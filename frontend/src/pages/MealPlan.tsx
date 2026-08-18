import { useEffect, useState } from "react";

import {
  Box,
  Button,
  Card,
  CircularProgress,
  Typography,
  Alert,
} from "@mui/material";

import {
  DownloadOutlined,
  RefreshOutlined,
} from "@mui/icons-material";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import DashboardLayout from "../components/layout/DashboardLayout";
import MealSection from "../components/meals/MealSelection";

import {
  getTodayMealPlan,
  generateDailyRecommendation,
  regenerateMealPlan,
} from "../services/mealPlanService";

import type { MealPlan } from "../types/mealPlan";

interface MealSectionFood {
  id: number;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  portion_grams: number;
}

interface MealSectionData {
  name: string;
  calories: number;
  meals: MealSectionFood[];
}

export default function MealPlan() {
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadMealPlan = async () => {
      try {
        setLoading(true);
        setError("");

        // First, try to get today's already-saved meal plan.
        let plan = await getTodayMealPlan();

        // If no plan exists, generate one.
        if (!plan) {
          plan = await generateDailyRecommendation();
        }

        setMealPlan(plan);
      } catch (err) {
        console.error(
          "Failed to load today's meal plan:",
          err
        );

        setError(
          "Failed to load your meal plan."
        );
      } finally {
        setLoading(false);
      }
    };

    loadMealPlan();
  }, []);

  /*
   * Refresh: ask the backend for a new set of foods that
   * still hit the same nutrition targets. Doesn't block the
   * whole page — only the button shows a spinner so the
   * currently displayed plan stays visible while it loads.
   */
  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      setError("");

      const newPlan = await regenerateMealPlan();

      setMealPlan(newPlan);
    } catch (err) {
      console.error(
        "Failed to refresh meal plan:",
        err
      );

      setError(
        "Failed to refresh your meal plan. Please try again."
      );
    } finally {
      setRefreshing(false);
    }
  };

  /*
   * Generate a downloadable PDF summary of today's plan.
   */
  const handleDownloadPdf = () => {
    if (!mealPlan) return;

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Your Daily Meal Plan", 14, 18);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(
      `Date: ${new Date(
        mealPlan.date
      ).toLocaleDateString()}`,
      14,
      25
    );

    autoTable(doc, {
      startY: 32,
      head: [["Summary", "Amount"]],
      body: [
        [
          "Target Calories",
          `${mealPlan.target_calories.toFixed(0)} kcal`,
        ],
        [
          "Protein",
          `${mealPlan.daily_macros.protein.toFixed(1)} g`,
        ],
        [
          "Carbohydrates",
          `${mealPlan.daily_macros.carbs.toFixed(1)} g`,
        ],
        [
          "Fat",
          `${mealPlan.daily_macros.fat.toFixed(1)} g`,
        ],
      ],
      theme: "striped",
      headStyles: { fillColor: [46, 125, 50] },
    });

    const sections: {
      title: string;
      calories: number;
      foods: MealPlan["meals"]["breakfast"]["foods"];
    }[] = [
      {
        title: "Breakfast",
        calories: mealPlan.meals.breakfast.total_calories,
        foods: mealPlan.meals.breakfast.foods,
      },
      {
        title: "Lunch",
        calories: mealPlan.meals.lunch.total_calories,
        foods: mealPlan.meals.lunch.foods,
      },
      {
        title: "Dinner",
        calories: mealPlan.meals.dinner.total_calories,
        foods: mealPlan.meals.dinner.foods,
      },
    ];

    for (const section of sections) {
      const previousTable = (doc as any).lastAutoTable;
      const nextY = previousTable
        ? previousTable.finalY + 10
        : 40;

      doc.setFontSize(13);
      doc.setTextColor(20);
      doc.text(
        `${section.title} (${section.calories.toFixed(0)} kcal)`,
        14,
        nextY
      );

      autoTable(doc, {
        startY: nextY + 4,
        head: [
          [
            "Food",
            "Portion",
            "Calories",
            "Protein",
            "Carbs",
            "Fat",
          ],
        ],
        body: section.foods.map((food) => [
          food.food_name,
          `${food.portion_grams} g`,
          `${food.calories.toFixed(0)} kcal`,
          `${food.protein.toFixed(1)} g`,
          `${food.carbs.toFixed(1)} g`,
          `${food.fat.toFixed(1)} g`,
        ]),
        theme: "grid",
        headStyles: { fillColor: [66, 66, 66] },
        styles: { fontSize: 9 },
      });
    }

    doc.save(
      `meal-plan-${mealPlan.date}.pdf`
    );
  };

  /*
   * Loading state
   */
  if (loading) {
    return (
      <DashboardLayout>
        <Box
          sx={{
            minHeight: 400,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress />
        </Box>
      </DashboardLayout>
    );
  }

  /*
   * Error state
   */
  if (error) {
    return (
      <DashboardLayout>
        <Box
          sx={{
            maxWidth: 1200,
            mx: "auto",
          }}
        >
          <Alert severity="error">
            {error}
          </Alert>
        </Box>
      </DashboardLayout>
    );
  }

  /*
   * No meal plan
   */
  if (!mealPlan) {
    return (
      <DashboardLayout>
        <Box
          sx={{
            maxWidth: 1200,
            mx: "auto",
          }}
        >
          <Alert severity="info">
            No meal plan has been generated for today.
          </Alert>
        </Box>
      </DashboardLayout>
    );
  }

  /*
   * Convert backend meal structure into
   * the structure expected by MealSection.
   */
  const meals: MealSectionData[] = [
    {
      name: "Breakfast",
      calories:
        mealPlan.meals.breakfast.total_calories,

      meals:
        mealPlan.meals.breakfast.foods.map(
          (food) => ({
            id: food.food_id,
            name: food.food_name,
            calories: food.calories,
            protein: food.protein,
            carbs: food.carbs,
            fat: food.fat,
            portion_grams: food.portion_grams,
          })
        ),
    },

    {
      name: "Lunch",
      calories:
        mealPlan.meals.lunch.total_calories,

      meals:
        mealPlan.meals.lunch.foods.map(
          (food) => ({
            id: food.food_id,
            name: food.food_name,
            calories: food.calories,
            protein: food.protein,
            carbs: food.carbs,
            fat: food.fat,
            portion_grams: food.portion_grams,
          })
        ),
    },

    {
      name: "Dinner",
      calories:
        mealPlan.meals.dinner.total_calories,

      meals:
        mealPlan.meals.dinner.foods.map(
          (food) => ({
            id: food.food_id,
            name: food.food_name,
            calories: food.calories,
            protein: food.protein,
            carbs: food.carbs,
            fat: food.fat,
            portion_grams: food.portion_grams,
          })
        ),
    },
  ];

  return (
    <DashboardLayout>
      <Box
        sx={{
          maxWidth: 1200,
          mx: "auto",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            flexDirection: {
              xs: "column",
              sm: "row",
            },
            alignItems: {
              xs: "flex-start",
              sm: "center",
            },
            justifyContent: "space-between",
            gap: 2,
            mb: 3,
          }}
        >
          <Box>
            <Typography
              variant="h5"
              fontWeight={700}
            >
              Meal Plan Details
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mt: 0.5,
              }}
            >
              Your personalized meals for today
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              gap: 1.5,
            }}
          >
            <Button
              variant="outlined"
              color="primary"
              startIcon={
                refreshing ? (
                  <CircularProgress size={16} />
                ) : (
                  <RefreshOutlined />
                )
              }
              disabled={refreshing}
              onClick={handleRefresh}
            >
              {refreshing ? "Refreshing..." : "Refresh"}
            </Button>

            <Button
              variant="contained"
              color="primary"
              startIcon={<DownloadOutlined />}
              onClick={handleDownloadPdf}
            >
              Generate Plan PDF
            </Button>
          </Box>
        </Box>

        {/* Meal Plan Card */}
        <Card
          sx={{
            p: {
              xs: 1.5,
              sm: 2,
            },
            borderRadius: 2,
            border: 1,
            borderColor: "divider",
            boxShadow: "none",
          }}
        >
          {/* Nutrition Summary */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr 1fr",
                sm: "repeat(4, 1fr)",
              },
              gap: 1.5,
              mb: 3,
            }}
          >
            <Summary
              label="Target Calories"
              value={`${mealPlan.target_calories.toFixed(
                2
              )} kcal`}
            />

            <Summary
              label="Protein"
              value={`${mealPlan.daily_macros.protein.toFixed(
                2
              )} g`}
            />

            <Summary
              label="Carbohydrates"
              value={`${mealPlan.daily_macros.carbs.toFixed(
                2
              )} g`}
            />

            <Summary
              label="Fat"
              value={`${mealPlan.daily_macros.fat.toFixed(
                2
              )} g`}
            />
          </Box>

          {/* Breakfast / Lunch / Dinner */}
          {meals.map((meal) => (
            <MealSection
              key={meal.name}
              name={meal.name}
              calories={meal.calories}
              meals={meal.meals}
            />
          ))}
        </Card>
      </Box>
    </DashboardLayout>
  );
}

/*
 * Nutrition summary component
 */
interface SummaryProps {
  label: string;
  value: string;
}

function Summary({
  label,
  value,
}: SummaryProps) {
  return (
    <Box
      sx={{
        p: 1.5,
        borderRadius: 1.5,
        bgcolor: "action.hover",
      }}
    >
      <Typography
        variant="caption"
        color="text.secondary"
      >
        {label}
      </Typography>

      <Typography
        variant="body1"
        fontWeight={700}
        sx={{
          mt: 0.25,
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}