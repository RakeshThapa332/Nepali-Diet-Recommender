import {
  Box,
  Chip,
  Typography,
} from "@mui/material";

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
  return (
    <Box sx={{ mb: 2.5 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 1,
        }}
      >
        <Typography
          variant="subtitle2"
          fontWeight={700}
        >
          {name}
        </Typography>

        <Chip
          label={`${calories} kcal`}
          size="small"
          color="primary"
          variant="outlined"
        />
      </Box>

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
          />
        ))}
      </Box>
    </Box>
  );
}