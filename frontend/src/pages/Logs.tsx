import { useEffect, useState } from "react";

import {
  Alert,
  Box,
  CircularProgress,
  Paper,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";

import DashboardLayout from "../components/layout/DashboardLayout";

import {
  getRecommendationHistory,
  getFoodIntakeHistory,
} from "../services/historyService";

import type {
  RecommendationLog,
  FoodIntakeLog,
} from "../services/historyService";

function formatDate(date: string | null) {
  if (!date) return "Unknown";

  return new Date(date).toLocaleString();
}

function formatGoal(goal: string) {
  return goal
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatMealType(mealType: string) {
  return mealType
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function History() {
  const [tab, setTab] = useState(0);

  const [recommendations, setRecommendations] =
    useState<RecommendationLog[]>([]);

  const [intakeLogs, setIntakeLogs] =
    useState<FoodIntakeLog[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        recommendationData,
        intakeData,
      ] = await Promise.all([
        getRecommendationHistory(),
        getFoodIntakeHistory(),
      ]);

      setRecommendations(recommendationData);
      setIntakeLogs(intakeData);
    } catch (err: any) {
      console.error("HISTORY ERROR:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load history."
      );
    } finally {
      setLoading(false);
    }
  };

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
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Typography
          variant="h4"
          fontWeight={700}
          mb={1}
        >
          History
        </Typography>

        <Typography
          color="text.secondary"
          mb={3}
        >
          View your previous recommendations and food
          intake records.
        </Typography>

        <Paper>
          <Tabs
            value={tab}
            onChange={(_, newValue) => setTab(newValue)}
            sx={{
              borderBottom: 1,
              borderColor: "divider",
            }}
          >
            <Tab label="Recommendation Logs" />

            <Tab label="Food Intake Logs" />
          </Tabs>

          <Box sx={{ p: 3 }}>
            {tab === 0 && (
              <RecommendationHistory
                recommendations={recommendations}
              />
            )}

            {tab === 1 && (
              <FoodIntakeHistory
                intakeLogs={intakeLogs}
              />
            )}
          </Box>
        </Paper>
      </Box>
    </DashboardLayout>
  );
}

interface RecommendationHistoryProps {
  recommendations: RecommendationLog[];
}

function RecommendationHistory({
  recommendations,
}: RecommendationHistoryProps) {
  if (recommendations.length === 0) {
    return (
      <Typography
        color="text.secondary"
        textAlign="center"
        py={5}
      >
        No recommendation history yet.
      </Typography>
    );
  }

  return (
    <Box>
      {recommendations.map((log) => (
        <Paper
          key={log.id}
          variant="outlined"
          sx={{
            p: 2,
            mb: 2,
          }}
        >
          <Typography fontWeight={700}>
            Diet Recommendation
          </Typography>

          <Typography
            color="text.secondary"
            variant="body2"
          >
            {formatDate(log.generated_at)}
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(3, 1fr)",
              },
              gap: 2,
              mt: 2,
            }}
          >
            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Target Calories
              </Typography>

              <Typography fontWeight={600}>
                {log.target_calories} kcal
              </Typography>
            </Box>

            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Goal
              </Typography>

              <Typography fontWeight={600}>
                {formatGoal(log.goal)}
              </Typography>
            </Box>

            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Cluster
              </Typography>

              <Typography fontWeight={600}>
                {log.cluster_id ?? "N/A"}
              </Typography>
            </Box>
          </Box>
        </Paper>
      ))}
    </Box>
  );
}

interface FoodIntakeHistoryProps {
  intakeLogs: FoodIntakeLog[];
}

function FoodIntakeHistory({
  intakeLogs,
}: FoodIntakeHistoryProps) {
  if (intakeLogs.length === 0) {
    return (
      <Typography
        color="text.secondary"
        textAlign="center"
        py={5}
      >
        No food intake records yet.
      </Typography>
    );
  }

  return (
    <Box>
      {intakeLogs.map((log) => (
        <Paper
          key={log.id}
          variant="outlined"
          sx={{
            p: 2,
            mb: 2,
          }}
        >
          <Typography fontWeight={700}>
            {log.food_name || "Unknown Food"}
          </Typography>

          <Typography
            color="text.secondary"
            variant="body2"
          >
            {formatDate(log.consumed_at)}
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
              },
              gap: 2,
              mt: 2,
            }}
          >
            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Quantity
              </Typography>

              <Typography fontWeight={600}>
                {log.quantity_g} g
              </Typography>
            </Box>

            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Meal
              </Typography>

              <Typography fontWeight={600}>
                {formatMealType(log.meal_type)}
              </Typography>
            </Box>
          </Box>
        </Paper>
      ))}
    </Box>
  );
}