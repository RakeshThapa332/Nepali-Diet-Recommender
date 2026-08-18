import { useEffect, useMemo, useState } from "react";

import {
  Alert,
  Box,
  Card,
  Chip,
  CircularProgress,
  LinearProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import DashboardLayout from "../components/layout/DashboardLayout";
import PageHeader from "../components/common/PageHeader";
import { getFoodIntakeHistory } from "../services/historyService";
import { getProfile } from "../services/profileService";
import type { FoodIntakeLog } from "../services/historyService";
import type { UserProfile } from "../types/profile";

function formatDateLabel(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function getBmiCategory(bmi: number) {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Healthy";
  if (bmi < 30) return "Overweight";
  return "Obese";
}

function getGoalLabel(goal: string) {
  switch (goal) {
    case "weight_loss":
      return "Weight Loss";
    case "maintenance":
      return "Maintenance";
    case "weight_gain":
      return "Weight Gain";
    default:
      return "Goal";
  }
}

export default function Progress() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [intakeLogs, setIntakeLogs] = useState<FoodIntakeLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProgress = async () => {
      try {
        setLoading(true);
        setError("");

        const [profileData, intakeData] = await Promise.all([
          getProfile(),
          getFoodIntakeHistory(),
        ]);

        setProfile(profileData);
        setIntakeLogs(intakeData);
      } catch (err: any) {
        console.error("PROGRESS ERROR:", err);
        setError(
          err.response?.data?.message ||
            "Failed to load progress data."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProgress();
  }, []);

  const summary = useMemo(() => {
    const consumed = intakeLogs.reduce(
      (total, item) => total + (Number(item.calories) || 0),
      0
    );

    const protein = intakeLogs.reduce(
      (total, item) => total + (Number(item.protein) || 0),
      0
    );

    const carbs = intakeLogs.reduce(
      (total, item) => total + (Number(item.carbs) || 0),
      0
    );

    const fat = intakeLogs.reduce(
      (total, item) => total + (Number(item.fat) || 0),
      0
    );

    const targetCalories = Number(profile?.target_calories ?? 0);
    const heightM = Number(profile?.height_cm ?? 0) / 100;
    const calculatedBmi = heightM > 0 && profile?.weight_kg
      ? Number(profile.weight_kg) / (heightM * heightM)
      : Number(profile?.bmi ?? 0);
    const bmi = Number(calculatedBmi || 0);

    const proteinTarget = 120;
    const carbsTarget = 250;
    const fatTarget = 70;

    const streak = (() => {
      if (!intakeLogs.length) return 0;

      const uniqueDates = new Set(
        intakeLogs
          .filter((log) => log.consumed_at)
          .map((log) => new Date(log.consumed_at!).toDateString())
      );

      const days = Array.from(uniqueDates).sort().reverse();
      let streakCount = 0;
      const today = new Date();
      const checkDate = new Date(today);

      while (true) {
        const key = checkDate.toDateString();
        if (days.includes(key)) {
          streakCount += 1;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }

      return streakCount;
    })();

    const trend = Array.from({ length: 7 }, (_, index) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - index));

      const key = date.toDateString();
      const calories = intakeLogs
        .filter((log) => log.consumed_at && new Date(log.consumed_at).toDateString() === key)
        .reduce((sum, item) => sum + (Number(item.calories) || 0), 0);

      const proteinTotal = intakeLogs
        .filter((log) => log.consumed_at && new Date(log.consumed_at).toDateString() === key)
        .reduce((sum, item) => sum + (Number(item.protein) || 0), 0);

      return {
        day: formatDateLabel(date),
        calories: Number(calories.toFixed(0)),
        protein: Number(proteinTotal.toFixed(1)),
      };
    });

    const caloriesProgress = targetCalories > 0 ? (consumed / targetCalories) * 100 : 0;
    const overallGoalProgress = Math.min(
      100,
      (caloriesProgress * 0.7 + (protein / proteinTarget) * 100 * 0.3)
    );

    return {
      consumed,
      protein,
      carbs,
      fat,
      targetCalories,
      remaining: Math.max(targetCalories - consumed, 0),
      caloriesProgress,
      proteinProgress: proteinTarget > 0 ? (protein / proteinTarget) * 100 : 0,
      carbsProgress: carbsTarget > 0 ? (carbs / carbsTarget) * 100 : 0,
      fatProgress: fatTarget > 0 ? (fat / fatTarget) * 100 : 0,
      bmi,
      bmiCategory: bmi ? getBmiCategory(bmi) : "Not available",
      streak,
      goalProgress: overallGoalProgress,
      trend,
      weightKg: Number(profile?.weight_kg ?? 0),
      goalTitle: getGoalLabel(profile?.goal || ""),
    };
  }, [intakeLogs, profile]);

  if (loading) {
    return (
      <DashboardLayout>
        <Box
          sx={{
            minHeight: "60vh",
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

  return (
    <DashboardLayout>
      <Box>
        <PageHeader
          title="Progress"
          subtitle="Track your nutrition and progress toward your goal."
        />

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, minmax(0, 1fr))",
              lg: "repeat(4, minmax(0, 1fr))",
            },
            gap: 2,
            mb: 3,
          }}
        >
          <StatCard
            label="Calories"
            value={`${summary.consumed.toFixed(0)} / ${summary.targetCalories.toFixed(0)} kcal`}
            progress={summary.caloriesProgress}
            color="primary"
          />

          <StatCard
            label="Protein"
            value={`${summary.protein.toFixed(1)} g`}
            progress={summary.proteinProgress}
            color="success"
          />

          <StatCard
            label="Carbs"
            value={`${summary.carbs.toFixed(1)} g`}
            progress={summary.carbsProgress}
            color="warning"
          />

          <StatCard
            label="Fat"
            value={`${summary.fat.toFixed(1)} g`}
            progress={summary.fatProgress}
            color="error"
          />
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              lg: "1.4fr 0.8fr",
            },
            gap: 2,
            mb: 3,
          }}
        >
          <Card sx={{ p: 2 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 2,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Weekly Nutrition Trend
              </Typography>

              <Chip label={`${summary.streak} day streak`} color="success" />
            </Box>

            <Box sx={{ width: "100%", height: 260 }}>
              <ResponsiveContainer>
                <AreaChart data={summary.trend}>
                  <defs>
                    <linearGradient id="caloriesFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1976d2" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#1976d2" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="day" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="calories"
                    stroke="#1976d2"
                    fill="url(#caloriesFill)"
                    strokeWidth={3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </Card>

          <Card sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
              BMI & Weight Status
            </Typography>

            <Stack spacing={2}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Current weight
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {summary.weightKg ? `${summary.weightKg.toFixed(1)} kg` : "No data"}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">
                  BMI
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {summary.bmi ? summary.bmi.toFixed(1) : "N/A"}
                </Typography>
                <Chip
                  label={summary.bmiCategory}
                  color={
                    summary.bmiCategory === "Healthy"
                      ? "success"
                      : summary.bmiCategory === "Overweight"
                        ? "warning"
                        : "primary"
                  }
                  size="small"
                  sx={{ mt: 1 }}
                />
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Goal focus
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {summary.goalTitle}
                </Typography>
              </Box>
            </Stack>
          </Card>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "1.2fr 0.8fr",
            },
            gap: 2,
          }}
        >
          <Card sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
              Goal Completion
            </Typography>

            <Box sx={{ mb: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 0.75,
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Overall plan progress
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  {summary.goalProgress.toFixed(0)}%
                </Typography>
              </Box>

              <LinearProgress
                variant="determinate"
                value={Math.min(summary.goalProgress, 100)}
                sx={{ height: 10, borderRadius: 999 }}
              />
            </Box>

            <ProgressRow
              label="Calories remaining"
              value={`${summary.remaining.toFixed(0)} kcal`}
              percent={Math.min(summary.caloriesProgress, 100)}
              color="primary"
            />

            <ProgressRow
              label="Protein target"
              value={`${summary.protein.toFixed(1)} g logged`}
              percent={Math.min(summary.proteinProgress, 100)}
              color="success"
            />

            <ProgressRow
              label="Carbs target"
              value={`${summary.carbs.toFixed(1)} g logged`}
              percent={Math.min(summary.carbsProgress, 100)}
              color="warning"
            />

            <ProgressRow
              label="Fat target"
              value={`${summary.fat.toFixed(1)} g logged`}
              percent={Math.min(summary.fatProgress, 100)}
              color="error"
            />
          </Card>

          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
              Recent Intake
            </Typography>

            {intakeLogs.length === 0 ? (
              <Typography color="text.secondary">
                No food intake logged yet.
              </Typography>
            ) : (
              <Stack spacing={1.5}>
                {intakeLogs.slice(0, 5).map((log) => (
                  <Box
                    key={log.id}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 1,
                      borderBottom: 1,
                      borderColor: "divider",
                      pb: 1,
                    }}
                  >
                    <Box>
                      <Typography sx={{ fontWeight: 600 }}>
                        {log.food_name || "Unknown Food"}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {log.meal_type}
                      </Typography>
                    </Box>

                    <Typography variant="body2" color="text.secondary">
                      {(Number(log.calories) || 0).toFixed(0)} kcal
                    </Typography>
                  </Box>
                ))}
              </Stack>
            )}
          </Paper>
        </Box>
      </Box>
    </DashboardLayout>
  );
}

interface StatCardProps {
  label: string;
  value: string;
  progress: number;
  color: "primary" | "success" | "warning" | "error";
}

function StatCard({ label, value, progress, color }: StatCardProps) {
  return (
    <Card sx={{ p: 2 }}>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>

      <Typography variant="h6" sx={{ mt: 1, fontWeight: 700 }}>
        {value}
      </Typography>

      <LinearProgress
        variant="determinate"
        value={Math.min(progress, 100)}
        color={color}
        sx={{ mt: 2, height: 8, borderRadius: 999 }}
      />
    </Card>
  );
}

interface ProgressRowProps {
  label: string;
  value: string;
  percent: number;
  color: "primary" | "success" | "warning" | "error";
}

function ProgressRow({ label, value, percent, color }: ProgressRowProps) {
  return (
    <Box sx={{ mb: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 0.75,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>

        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {value}
        </Typography>
      </Box>

      <LinearProgress
        variant="determinate"
        value={Math.min(percent, 100)}
        color={color}
        sx={{ height: 8, borderRadius: 999 }}
      />
    </Box>
  );
}
