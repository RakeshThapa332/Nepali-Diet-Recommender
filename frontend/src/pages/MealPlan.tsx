import {
  Box,
  Button,
  Card,
  Typography,
} from "@mui/material";
import {
  DownloadOutlined,
} from "@mui/icons-material";

import DashboardLayout from "../components/layout/DashboardLayout";
import MealSection from "../components/meals/MealSelection";

const meals = [
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

export default function MealPlan() {
  return (
    <DashboardLayout>
      <Box
        sx={{
          maxWidth: 1200,
          mx: "auto",
        }}
      >
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
              sx={{ mt: 0.5 }}
            >
              Your personalized meals for today
            </Typography>
          </Box>

          <Button
            variant="contained"
            color="primary"
            startIcon={<DownloadOutlined />}
          >
            Generate Plan PDF
          </Button>
        </Box>

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
              label="Total Calories"
              value="1,900 kcal"
            />

            <Summary
              label="Protein"
              value="120 g"
            />

            <Summary
              label="Carbohydrates"
              value="270 g"
            />

            <Summary
              label="Fat"
              value="60 g"
            />
          </Box>

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
        sx={{ mt: 0.25 }}
      >
        {value}
      </Typography>
    </Box>
  );
}