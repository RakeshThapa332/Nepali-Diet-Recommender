import {
  ArrowForwardIosOutlined,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";

import { addFoodIntake } from "../../services/historyService";

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
  mealType: string;
}

export default function MealCard({
  meal,
  mealType,
}: MealCardProps) {
  const [open, setOpen] = useState(false);
  const [logging, setLogging] = useState(false);
  const [logStatus, setLogStatus] = useState("");

  const portionGrams = meal.portion_grams ?? 100;

  const macroCalories = useMemo(() => {
    const baseCalories =
      4 * Number(meal.protein || 0) +
      9 * Number(meal.fat || 0) +
      4 * Number(meal.carbs || 0);

    const portionFactor = portionGrams / 100;

    return {
      per100g: baseCalories,
      currentPortion: baseCalories * portionFactor,
    };
  }, [meal.carbs, meal.fat, meal.protein, portionGrams]);

  const macroChips = [
    {
      label: `Protein ${Number(meal.protein || 0).toFixed(1)} g`,
      color: "success",
      sx: { bgcolor: "success.light", color: "success.contrastText" },
    },
    {
      label: `Carbs ${Number(meal.carbs || 0).toFixed(1)} g`,
      color: "warning",
      sx: { bgcolor: "warning.light", color: "warning.contrastText" },
    },
    {
      label: `Fat ${Number(meal.fat || 0).toFixed(1)} g`,
      color: "error",
      sx: { bgcolor: "error.light", color: "error.contrastText" },
    },
  ];

  const handleLogIntake = async () => {
    try {
      setLogging(true);
      setLogStatus("");

      const response = await addFoodIntake({
        food_id: Number(meal.id),
        quantity_g: Number(portionGrams),
        meal_type: mealType,
      });

      const message = response?.message || "Logged to your intake history.";

      setLogStatus(message);
    } catch (error: any) {
      console.error("Failed to log food intake:", error);
      const serverMessage =
        error?.response?.data?.message ||
        "Failed to log this food. Please try again.";

      setLogStatus(serverMessage);
    } finally {
      setLogging(false);
    }
  };

  return (
    <>
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
            noWrap
            sx={{ fontWeight: 600 }}
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

        <IconButton
          size="small"
          onClick={() => setOpen(true)}
          aria-label={`View details for ${meal.name}`}
        >
          <ArrowForwardIosOutlined
            sx={{ fontSize: 12 }}
          />
        </IconButton>
      </Card>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            pb: 1,
          }}
        >
          {meal.name}
        </DialogTitle>

        <DialogContent>
          <Box
            sx={{
              display: "grid",
              gap: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                p: 1.5,
                borderRadius: 3,
                bgcolor: "action.hover",
              }}
            >
              {meal.image ? (
                <Box
                  component="img"
                  src={meal.image}
                  alt={meal.name}
                  sx={{
                    width: "100%",
                    maxWidth: 220,
                    height: 170,
                    borderRadius: 2,
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              ) : (
                <Box
                  sx={{
                    width: 120,
                    height: 120,
                    borderRadius: 2,
                    bgcolor: "grey.200",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 52,
                  }}
                >
                  🍲
                </Box>
              )}
            </Box>

            <Stack
              direction="row"
              spacing={1}
              sx={{
                flexWrap: "wrap",
                gap: 1,
              }}
            >
              {macroChips.map((chip) => (
                <Chip
                  key={chip.label}
                  label={chip.label}
                  size="small"
                  color={chip.color as any}
                  sx={{
                    ...chip.sx,
                    fontWeight: 700,
                  }}
                />
              ))}
            </Stack>

            <Box
              sx={{
                p: 1.5,
                border: 1,
                borderColor: "divider",
                borderRadius: 2,
                bgcolor: "background.paper",
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{ mb: 1, fontWeight: 700 }}
              >
                Nutrition summary
              </Typography>

              <Box
                sx={{
                  display: "grid",
                  gap: 1,
                }}
              >
                <DetailRow label="Portion" value={`${portionGrams} g`} />
                <DetailRow
                  label="Calories"
                  value={`${meal.calories.toFixed(1)} kcal`}
                />
                <DetailRow
                  label="Protein"
                  value={`${Number(meal.protein || 0).toFixed(1)} g`}
                />
                <DetailRow
                  label="Carbohydrates"
                  value={`${Number(meal.carbs || 0).toFixed(1)} g`}
                />
                <DetailRow
                  label="Fat"
                  value={`${Number(meal.fat || 0).toFixed(1)} g`}
                />
              </Box>
            </Box>

            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                bgcolor: "action.hover",
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{ mb: 1, fontWeight: 700 }}
              >
                Calorie calculation
              </Typography>

              <Typography variant="body2" sx={{ mb: 0.75 }}>
                <strong>Formula:</strong> 4 × protein + 9 × fat + 4 × carbs
              </Typography>

              <Typography variant="body2" sx={{ mb: 0.75 }}>
                <strong>Per 100 g:</strong>{" "}
                {(
                  4 * Number(meal.protein || 0) +
                  9 * Number(meal.fat || 0) +
                  4 * Number(meal.carbs || 0)
                ).toFixed(1)} kcal
              </Typography>

              <Typography variant="body2">
                <strong>For {portionGrams} g:</strong>{" "}
                {macroCalories.currentPortion.toFixed(1)} kcal
              </Typography>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button onClick={() => setOpen(false)}>Close</Button>

          <Button
            variant="contained"
            onClick={handleLogIntake}
            disabled={logging}
          >
            {logging ? "Logging..." : "Log intake"}
          </Button>
        </DialogActions>

        {logStatus && (
          <Typography
            variant="caption"
            color={logStatus.includes("Failed") ? "error" : "success"}
            sx={{ px: 3, pb: 2, display: "block" }}
          >
            {logStatus}
          </Typography>
        )}
      </Dialog>
    </>
  );
}

interface DetailRowProps {
  label: string;
  value: string;
}

function DetailRow({ label, value }: DetailRowProps) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: 1,
        borderColor: "divider",
        pb: 1,
      }}
    >
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>

      <Typography variant="body2" sx={{ fontWeight: 600 }}>
        {value}
      </Typography>
    </Box>
  );
}