import { useEffect, useState } from "react";
import {
  AddOutlined,
  RestaurantOutlined,
} from "@mui/icons-material";

import {
  Alert,
  Box,
  Button,
  Card,
  CircularProgress,
  Typography,
} from "@mui/material";

import { useNavigate } from "react-router-dom";

import DashboardLayout from "../components/layout/DashboardLayout";
import PageHeader from "../components/common/PageHeader";
import StatCard from "../components/common/StatCard";
import MacroChart from "../components/dashboard/MacroChart";
import CalorieDistribution from "../components/dashboard/CalorieDistribution";
import TodayMealPlan from "../components/dashboard/TodayMealPlan";

import api from "../api/axios";

import { getTodayMealPlan } from "../services/mealPlanService";

import type { MealPlan } from "../types/mealPlan";

import { useAuth } from "../context/AuthContext";


interface UserProfile {
  age: number;
  gender: string;
  height_kg?: number;
  height_cm: number;
  weight_kg: number;

  activity_level: string;
  goal: string;

  body_type?: string;

  bmi?: number;
  bmi_category?: string;

  bmr?: number;
  tdee?: number;
  target_calories?: number;
}

interface ProfileResponse {
  success?: boolean;
  profile?: UserProfile;
  nutrition?: {
    bmi?: number;
    bmi_category?: string;
    bmr?: number;
    tdee?: number;
    target_calories?: number;
  };
}

interface MealFood {
  id: number;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  portion_grams: number;
}

interface MealGroup {
  name: string;
  calories: number;
  meals: MealFood[];
}

export default function Dashboard() {
  const navigate = useNavigate();

  const { user } = useAuth();

  const [profile, setProfile] =
    useState<UserProfile | null>(null);

  const [mealPlan, setMealPlan] =
    useState<MealPlan | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const [profileResponse, todayPlan] =
          await Promise.all([
            api.get<ProfileResponse>(
              "/profile/"
            ),
            getTodayMealPlan(),
          ]);

  
        const responseData =
          profileResponse.data;

        let loadedProfile =
          responseData.profile ?? null;

        if (
          loadedProfile &&
          responseData.nutrition
        ) {
          loadedProfile = {
            ...loadedProfile,
            bmi:
              responseData.nutrition.bmi ??
              loadedProfile.bmi,

            bmi_category:
              responseData.nutrition
                .bmi_category ??
              loadedProfile.bmi_category,

            bmr:
              responseData.nutrition.bmr ??
              loadedProfile.bmr,

            tdee:
              responseData.nutrition.tdee ??
              loadedProfile.tdee,

            target_calories:
              responseData.nutrition
                .target_calories ??
              loadedProfile.target_calories,
          };
        }

        setProfile(loadedProfile);

        setMealPlan(todayPlan);
      } catch (err) {
        console.error(
          "Failed to load dashboard:",
          err
        );

        setError(
          "Failed to load your dashboard data."
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <Box
          sx={{
            minHeight: 500,
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

  if (error) {
    return (
      <DashboardLayout>
        <Box sx={{ maxWidth: 1200, mx: "auto" }}>
          <Alert severity="error">
            {error}
          </Alert>
        </Box>
      </DashboardLayout>
    );
  }


  if (!profile) {
    return (
      <DashboardLayout>
        <Box sx={{ maxWidth: 1200, mx: "auto" }}>
          <Alert
            severity="info"
            action={
              <Button
                color="inherit"
                size="small"
                onClick={() =>
                  navigate("/profile")
                }
              >
                Complete Profile
              </Button>
            }
          >
            Please complete your profile to
            generate your personalized nutrition
            information.
          </Alert>
        </Box>
      </DashboardLayout>
    );
  }

  /*
   * Nutrition values.
   *
   * Meal plan values take priority because
   * the dashboard should represent the actual
   * current plan.
   */
  const targetCalories =
    mealPlan?.target_calories ??
    profile.target_calories ??
    profile.tdee ??
    0;

  const protein =
    mealPlan?.daily_macros?.protein ?? 0;

  const carbs =
    mealPlan?.daily_macros?.carbs ?? 0;

  const fat =
    mealPlan?.daily_macros?.fat ?? 0;


  const proteinCalories = protein * 4;
  const carbCalories = carbs * 4;
  const fatCalories = fat * 9;

  const macroCalories =
    proteinCalories +
    carbCalories +
    fatCalories;

  const proteinPercentage =
    macroCalories > 0
      ? (proteinCalories / macroCalories) *
        100
      : 0;

  const carbPercentage =
    macroCalories > 0
      ? (carbCalories / macroCalories) *
        100
      : 0;

  const fatPercentage =
    macroCalories > 0
      ? (fatCalories / macroCalories) *
        100
      : 0;

  /*
   * Meal groups for TodayMealPlan.
   */
  const mealGroups: MealGroup[] =
    mealPlan
      ? [
          {
            name: "Breakfast",
            calories:
              mealPlan.meals.breakfast
                .total_calories,

            meals:
              mealPlan.meals.breakfast.foods.map(
                (food) => ({
                  id: food.food_id,
                  name: food.food_name,
                  calories: food.calories,
                  protein: food.protein,
                  carbs: food.carbs,
                  fat: food.fat,
                  portion_grams:
                    food.portion_grams,
                })
              ),
          },

          {
            name: "Lunch",
            calories:
              mealPlan.meals.lunch
                .total_calories,

            meals:
              mealPlan.meals.lunch.foods.map(
                (food) => ({
                  id: food.food_id,
                  name: food.food_name,
                  calories: food.calories,
                  protein: food.protein,
                  carbs: food.carbs,
                  fat: food.fat,
                  portion_grams:
                    food.portion_grams,
                })
              ),
          },

          {
            name: "Dinner",
            calories:
              mealPlan.meals.dinner
                .total_calories,

            meals:
              mealPlan.meals.dinner.foods.map(
                (food) => ({
                  id: food.food_id,
                  name: food.food_name,
                  calories: food.calories,
                  protein: food.protein,
                  carbs: food.carbs,
                  fat: food.fat,
                  portion_grams:
                    food.portion_grams,
                })
              ),
          },
        ]
      : [];

  /*
   * Calorie distribution is calculated
   * directly from today's meal plan.
   */
  const calorieDistribution =
    mealGroups.map((meal) => ({
      name: meal.name,
      calories: Math.round(
        meal.calories
      ),
    }));

  /*
   * Goal formatting.
   */
  const formattedGoal =
    profile.goal
      ? profile.goal
          .replace(/_/g, " ")
          .replace(/\b\w/g, (letter) =>
            letter.toUpperCase()
          )
      : "Not set";

  /*
   * Button action.
   *
   * If today's plan exists:
   *      View My Meal Plan
   *
   * Otherwise:
   *      Generate New Plan
   */
  const handlePlanAction = () => {
    if (mealPlan) {
      navigate("/meal-plan");
    } else {
      navigate("/generate");
    }
  };

  /*
   * Current date.
   */
  const today = new Date();

  const formattedDate =
    today.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });


  const displayName =
    user?.name || user?.username || 
    "User";

  return (
    <DashboardLayout>
      <Box
        sx={{
          maxWidth: 1200,
          mx: "auto",
        }}
      >

        <PageHeader
          title={`Welcome, ${displayName}`}
          subtitle={formattedDate}
          action={
            <Button
              variant="contained"
              color="primary"
              startIcon={
                mealPlan ? (
                  <RestaurantOutlined />
                ) : (
                  <AddOutlined />
                )
              }
              onClick={handlePlanAction}
            >
              {mealPlan
                ? "View My Meal Plan"
                : "Generate New Plan"}
            </Button>
          }
        />

        {!mealPlan && (
          <Alert
            severity="info"
            sx={{
              mb: 2,
              borderRadius: 2,
            }}
            action={
              <Button
                color="inherit"
                size="small"
                onClick={() =>
                  navigate("/generate")
                }
              >
                Generate
              </Button>
            }
          >
            You don't have a meal plan for
            today yet. Generate your personalized
            diet plan to see your calorie and
            macronutrient distribution.
          </Alert>
        )}


        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr 1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(4, 1fr)",
            },
            gap: 1.5,
            mb: 2,
          }}
        >
          <StatCard
            label="Daily Calories"
            value={
              targetCalories > 0
                ? Math.round(
                    targetCalories
                  ).toLocaleString()
                : "--"
            }
            unit="kcal"
            subtitle={
              targetCalories > 0
                ? "Daily target"
                : "Generate a plan"
            }
          />

          <StatCard
            label="Protein"
            value={
              protein > 0
                ? protein.toFixed(1)
                : "--"
            }
            unit="g"
            subtitle={
              protein > 0
                ? `${proteinPercentage.toFixed(
                    0
                  )}% of macro calories`
                : "Not available"
            }
          />

          <StatCard
            label="Carbohydrates"
            value={
              carbs > 0
                ? carbs.toFixed(1)
                : "--"
            }
            unit="g"
            subtitle={
              carbs > 0
                ? `${carbPercentage.toFixed(
                    0
                  )}% of macro calories`
                : "Not available"
            }
          />

          <StatCard
            label="Fat"
            value={
              fat > 0
                ? fat.toFixed(1)
                : "--"
            }
            unit="g"
            subtitle={
              fat > 0
                ? `${fatPercentage.toFixed(
                    0
                  )}% of macro calories`
                : "Not available"
            }
          />
        </Box>


        {mealPlan && (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "1fr 1fr",
              },
              gap: 2,
              mb: 2,
            }}
          >
            <MacroChart
              protein={protein}
              carbs={carbs}
              fat={fat}
            />

            <CalorieDistribution
              meals={calorieDistribution}
            />
          </Box>
        )}


        <Card
          sx={{
            p: 2,
            mb: 2,
            borderRadius: 2,
            border: 1,
            borderColor: "divider",
            boxShadow: "none",
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{ fontWeight:700, mb: 1.5 }}
          >
            Nutrition Summary
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr 1fr",
                sm: "repeat(4, 1fr)",
              },
              gap: 2,
            }}
          >
            <SummaryItem
              label="BMI"
              value={
                profile.bmi != null
                  ? profile.bmi.toFixed(1)
                  : "--"
              }
              detail={
                profile.bmi_category ||
                "Not available"
              }
            />

            <SummaryItem
              label="BMR"
              value={
                profile.bmr != null
                  ? Math.round(
                      profile.bmr
                    ).toLocaleString()
                  : "--"
              }
              detail="kcal/day"
            />

            <SummaryItem
              label="TDEE"
              value={
                profile.tdee != null
                  ? Math.round(
                      profile.tdee
                    ).toLocaleString()
                  : "--"
              }
              detail="kcal/day"
            />

            <SummaryItem
              label="Goal"
              value={formattedGoal}
              detail={
                targetCalories > 0 &&
                profile.tdee
                  ? `${Math.round(
                      targetCalories -
                        profile.tdee
                    )} kcal/day`
                  : "Personalized"
              }
            />
          </Box>
        </Card>


        {mealPlan && (
          <TodayMealPlan
            mealGroups={mealGroups}
          />
        )}
      </Box>
    </DashboardLayout>
  );
}

   /*SUMMARY ITEM*/


interface SummaryItemProps {
  label: string;
  value: string;
  detail: string;
}

function SummaryItem({
  label,
  value,
  detail,
}: SummaryItemProps) {
  return (
    <Box>
      <Typography
        variant="caption"
        color="text.secondary"
      >
        {label}
      </Typography>

      <Typography
        variant="body1"
        sx={{
          fontWeight:700,
          mt: 0.25,
          textTransform:
            label === "Goal"
              ? "capitalize"
              : "none",
        }}
      >
        {value}
      </Typography>

      <Typography
        variant="caption"
        color="text.secondary"
      >
        {detail}
      </Typography>
    </Box>
  );
}
