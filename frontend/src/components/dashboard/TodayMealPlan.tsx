import {
  Box,
  Card,
  Typography,
} from "@mui/material";

import MealSection from "../meals/MealSelection";
import type { Meal } from "../meals/MealCard";

export interface MealGroup {
  name: string;
  calories: number;
  meals: Meal[];
}

interface TodayMealPlanProps {
  mealGroups: MealGroup[];
}

export default function TodayMealPlan({
  mealGroups,
}: TodayMealPlanProps) {
  return (
    <Card
      sx={{
        p: 2,
        borderRadius: 2,
        border: 1,
        borderColor: "divider",
        boxShadow: "none",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Box>
          <Typography
            variant="h6"
            fontWeight={700}
          >
            Today's Meal Plan
          </Typography>

          <Typography
            variant="caption"
            color="text.secondary"
          >
            Your recommended meals for today
          </Typography>
        </Box>

        <Typography
          variant="caption"
          color="primary.main"
          sx={{
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          View full plan
        </Typography>
      </Box>

      {mealGroups.map((group) => (
        <MealSection
          key={group.name}
          name={group.name}
          calories={group.calories}
          meals={group.meals}
        />
      ))}
    </Card>
  );
}