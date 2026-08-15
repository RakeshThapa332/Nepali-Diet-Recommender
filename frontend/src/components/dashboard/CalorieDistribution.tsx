import {
  Box,
  Card,
  LinearProgress,
  Typography,
} from "@mui/material";

interface CalorieItem {
  name: string;
  calories: number;
}

interface CalorieDistributionProps {
  meals: CalorieItem[];
}

export default function CalorieDistribution({
  meals,
}: CalorieDistributionProps) {
  const maxCalories = Math.max(
    ...meals.map((meal) => meal.calories),
  );

  return (
    <Card
      sx={{
        height: "100%",
        p: 2,
        borderRadius: 2,
        border: 1,
        borderColor: "divider",
        boxShadow: "none",
      }}
    >
      <Typography
        variant="subtitle2"
        fontWeight={700}
      >
        Calorie Distribution
      </Typography>

      <Box sx={{ mt: 2 }}>
        {meals.map((meal) => (
          <Box
            key={meal.name}
            sx={{ mb: 2 }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 0.75,
              }}
            >
              <Typography variant="caption">
                {meal.name}
              </Typography>

              <Typography
                variant="caption"
                color="text.secondary"
              >
                {meal.calories} kcal
              </Typography>
            </Box>

            <LinearProgress
              variant="determinate"
              value={
                maxCalories > 0
                  ? (meal.calories / maxCalories) * 100
                  : 0
              }
              color="primary"
              sx={{
                height: 6,
                borderRadius: 5,
                bgcolor: "action.hover",
                "& .MuiLinearProgress-bar": {
                  borderRadius: 5,
                },
              }}
            />
          </Box>
        ))}
      </Box>
    </Card>
  );
}