import {
  ArrowForwardIosOutlined,
} from "@mui/icons-material";
import {
  Box,
  Card,
  IconButton,
  Typography,
} from "@mui/material";

export interface Meal {
  id: number;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  portion_grams?: number;
  image?: string;
}

interface MealCardProps {
  meal: Meal;
}

export default function MealCard({
  meal,
}: MealCardProps) {
  return (
    <Card
      sx={{
        p: 1.25,
        borderRadius: 2,
        border: 1,
        borderColor: "divider",
        boxShadow: "none",
        display: "flex",
        alignItems: "center",
        gap: 1.25,
        height: "100%",
      }}
    >
      {meal.image ? (
        <Box
          component="img"
          src={meal.image}
          alt={meal.name}
          sx={{
            width: 56,
            height: 56,
            flexShrink: 0,
            borderRadius: 1.5,
            objectFit: "cover",
          }}
        />
      ) : (
        <Box
          sx={{
            width: 56,
            height: 56,
            flexShrink: 0,
            borderRadius: 1.5,
            bgcolor: "action.hover",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 25,
          }}
        >
          🍛
        </Box>
      )}

      <Box
        sx={{
          minWidth: 0,
          flexGrow: 1,
        }}
      >
        <Typography
          variant="body2"
          fontWeight={600}
          noWrap
        >
          {meal.name}
        </Typography>

        <Typography
          variant="caption"
          color="text.secondary"
        >
          {meal.calories} kcal
          {meal.portion_grams !== undefined &&
            ` · ${meal.portion_grams} g`}
        </Typography>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            display: "block",
            mt: 0.25,
          }}
        >
          P {meal.protein}g · C {meal.carbs}g · F{" "}
          {meal.fat}g
        </Typography>
      </Box>

      <IconButton size="small">
        <ArrowForwardIosOutlined
          sx={{ fontSize: 12 }}
        />
      </IconButton>
    </Card>
  );
}