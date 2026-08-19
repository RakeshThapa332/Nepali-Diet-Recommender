import { useMemo, useState } from "react";

import {
  Box,
  Chip,
  Collapse,
  Divider,
  IconButton,
  Typography,
} from "@mui/material";

import {
  KeyboardArrowDown,
  KeyboardArrowUp,
} from "@mui/icons-material";

import MealCard, { type Meal } from "./MealCard";

interface MealSelectionProps {
  name: string;
  calories: number;
  meals: Meal[];
}

export default function MealSelection({
  name,
  calories,
  meals,
}: MealSelectionProps) {
  const [expanded, setExpanded] = useState(false);

  /*
   * Calculate nutrition from the foods in this meal.
   * This gives us a frontend verification of the
   * meal total returned by the backend.
   */
  const calculatedNutrition = useMemo(() => {
    return meals.reduce(
      (total, meal) => ({
        calories: total.calories + Number(meal.calories || 0),
        protein: total.protein + Number(meal.protein || 0),
        carbs: total.carbs + Number(meal.carbs || 0),
        fat: total.fat + Number(meal.fat || 0),
      }),
      {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
      }
    );
  }, [meals]);

  return (
    <Box
      sx={{
        mb: 2.5,
        border: 1,
        borderColor: "divider",
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      {/* Meal Header */}
      <Box
        onClick={() => setExpanded((previous) => !previous)}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 1.5,
          cursor: "pointer",
          transition: "background-color 0.2s",
          "&:hover": {
            bgcolor: "action.hover",
          },
        }}
      >
        <Box>
          <Typography
            variant="subtitle1"
            sx={{fontWeight:700}}
          >
            {name}
          </Typography>

          <Typography
            variant="caption"
            color="text.secondary"
          >
            {meals.length}{" "}
            {meals.length === 1 ? "food" : "foods"} •{" "}
            Click to {expanded ? "hide" : "view"} details
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Chip
            label={`${calories.toFixed(0)} kcal`}
            size="small"
            color="primary"
            variant="outlined"
          />

          <IconButton size="small">
            {expanded ? (
              <KeyboardArrowUp />
            ) : (
              <KeyboardArrowDown />
            )}
          </IconButton>
        </Box>
      </Box>

      {/* Expandable Content */}
      <Collapse in={expanded}>
        <Divider />

        <Box sx={{ p: 1.5 }}>
          {/* Food Cards */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(4, 1fr)",
              },
              gap: 1.25,
            }}
          >
            {meals.map((meal) => (
              <MealCard
                key={meal.id}
                meal={meal}
                mealType={name}
              />
            ))}
          </Box>

          {/* Nutrition Summary */}
          <Box
            sx={{
              mt: 2,
              p: 1.5,
              borderRadius: 1.5,
              bgcolor: "action.hover",
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{ fontWeight:700, mb: 1 }}
            >
              {name} Nutrition
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr 1fr",
                  sm: "repeat(4, 1fr)",
                },
                gap: 1,
              }}
            >
              <NutritionItem
                label="Calories"
                value={`${calculatedNutrition.calories.toFixed(0)} kcal`}
              />

              <NutritionItem
                label="Protein"
                value={`${calculatedNutrition.protein.toFixed(1)} g`}
              />

              <NutritionItem
                label="Carbohydrates"
                value={`${calculatedNutrition.carbs.toFixed(1)} g`}
              />

              <NutritionItem
                label="Fat"
                value={`${calculatedNutrition.fat.toFixed(1)} g`}
              />
            </Box>
          </Box>
        </Box>
      </Collapse>
    </Box>
  );
}

interface NutritionItemProps {
  label: string;
  value: string;
}

function NutritionItem({
  label,
  value,
}: NutritionItemProps) {
  return (
    <Box>
      <Typography
        variant="caption"
        color="text.secondary"
      >
        {label}
      </Typography>

      <Typography
        variant="body2"
        sx={{fontWeight:700}}
      >
        {value}
      </Typography>
    </Box>
  );
}