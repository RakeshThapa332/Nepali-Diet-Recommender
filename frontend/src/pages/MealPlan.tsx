import { useEffect, useState } from "react";

import {
  Box,
  Button,
  Card,
  CircularProgress,
  Typography,
  Alert,
} from "@mui/material";

import { DownloadOutlined } from "@mui/icons-material";

import DashboardLayout from "../components/layout/DashboardLayout";
import MealSection from "../components/meals/MealSelection";

import {
  getTodayMealPlan,
  generateDailyRecommendation,
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

          <Button
            variant="contained"
            color="primary"
            startIcon={
              <DownloadOutlined />
            }
          >
            Generate Plan PDF
          </Button>
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