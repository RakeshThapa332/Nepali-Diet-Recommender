import {
  AddOutlined,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  Typography,
} from "@mui/material";

import DashboardLayout from "../components/layout/DashboardLayout";
import PageHeader from "../components/common/PageHeader";
import StatCard from "../components/common/StatCard";
import MacroChart from "../components/dashboard/MacroChart";
import CalorieDistribution from "../components/dashboard/CalorieDistribution";
import TodayMealPlan from "../components/dashboard/TodayMealPlan";

const mealGroups = [
  {
    name: "Breakfast",
    calories: 500,
    meals: [
      {
        id: 1,
        name: "Chiura",
        calories: 120,
        protein: 3,
        carbs: 25,
        fat: 1,
      },
      {
        id: 2,
        name: "Dahi",
        calories: 100,
        protein: 5,
        carbs: 7,
        fat: 4,
      },
      {
        id: 3,
        name: "Banana",
        calories: 90,
        protein: 1,
        carbs: 23,
        fat: 0,
      },
      {
        id: 4,
        name: "Badam",
        calories: 190,
        protein: 7,
        carbs: 7,
        fat: 16,
      },
    ],
  },
  {
    name: "Lunch",
    calories: 700,
    meals: [
      {
        id: 5,
        name: "Dal Bhat",
        calories: 350,
        protein: 13,
        carbs: 55,
        fat: 5,
      },
      {
        id: 6,
        name: "Chicken Curry",
        calories: 250,
        protein: 28,
        carbs: 8,
        fat: 12,
      },
      {
        id: 7,
        name: "Tarkari",
        calories: 100,
        protein: 3,
        carbs: 15,
        fat: 3,
      },
    ],
  },
  {
    name: "Dinner",
    calories: 700,
    meals: [
      {
        id: 8,
        name: "Roti",
        calories: 150,
        protein: 5,
        carbs: 30,
        fat: 2,
      },
      {
        id: 9,
        name: "Matar Veg",
        calories: 220,
        protein: 8,
        carbs: 30,
        fat: 7,
      },
      {
        id: 10,
        name: "Paneer Curry",
        calories: 230,
        protein: 12,
        carbs: 10,
        fat: 15,
      },
      {
        id: 11,
        name: "Salad",
        calories: 100,
        protein: 3,
        carbs: 15,
        fat: 2,
      },
    ],
  },
];

const calorieDistribution = [
  {
    name: "Breakfast",
    calories: 500,
  },
  {
    name: "Lunch",
    calories: 700,
  },
  {
    name: "Snacks",
    calories: 275,
  },
  {
    name: "Dinner",
    calories: 700,
  },
];

export default function Dashboard() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Your Personalized Diet Plan"
        subtitle="Thursday, May 15, 2026"
        action={
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddOutlined />}
          >
            Generate New Plan
          </Button>
        }
      />

      {/* Statistics */}
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
          value="2,175"
          unit="kcal"
          subtitle="Target: 2,175 kcal"
        />

        <StatCard
          label="Protein"
          value="120"
          unit="g"
          subtitle="22% of daily calories"
        />

        <StatCard
          label="Carbs"
          value="270"
          unit="g"
          subtitle="50% of daily calories"
        />

        <StatCard
          label="Fat"
          value="60"
          unit="g"
          subtitle="25% of daily calories"
        />
      </Box>

      {/* Charts */}
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
          protein={120}
          carbs={270}
          fat={60}
        />

        <CalorieDistribution
          meals={calorieDistribution}
        />
      </Box>

      {/* Nutrition summary */}
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
          fontWeight={700}
          sx={{ mb: 1.5 }}
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
            value="22.9"
            detail="Normal"
          />

          <SummaryItem
            label="BMR"
            value="1,680"
            detail="kcal/day"
          />

          <SummaryItem
            label="TDEE"
            value="2,175"
            detail="kcal/day"
          />

          <SummaryItem
            label="Goal"
            value="Weight Loss"
            detail="-500 kcal"
          />
        </Box>
      </Card>

      {/* Meal plan */}
      <TodayMealPlan
        mealGroups={mealGroups}
      />
    </DashboardLayout>
  );
}

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
        fontWeight={700}
        sx={{ mt: 0.25 }}
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