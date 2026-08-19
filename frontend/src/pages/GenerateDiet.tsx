import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  Card,
  CircularProgress,
  Typography,
} from "@mui/material";

import DashboardLayout from "../components/layout/DashboardLayout";

import EditProfile from "../components/profile/EditProfile";

import {
  getProfile,
  updateProfile,
} from "../services/profileService";

import { regenerateMealPlan } from "../services/mealPlanService";

import type { UserProfile } from "../types/profile";

type GenerateForm = {
  goal: string;
  foodPreference: string;
};

const GOAL_OPTIONS = [
  { value: "weight_loss", label: "Weight Loss" },
  { value: "maintenance", label: "Maintain Weight" },
  { value: "weight_gain", label: "Weight Gain" },
];

const FOOD_PREFERENCE_OPTIONS = [
  { value: "", label: "No Preference" },
  { value: "vegetarian", label: "Vegetarian" },
  { value: "non_vegetarian", label: "Non-Vegetarian" },
];

export default function GenerateDiet() {
  const navigate = useNavigate();

  const [profile, setProfile] =
    useState<UserProfile | null>(null);

  const [formData, setFormData] =
    useState<GenerateForm>({
      goal: "",
      foodPreference: "",
    });

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [editingProfile, setEditingProfile] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const data = await getProfile();

      setProfile(data);

      setFormData({
        goal: data.goal ?? "",
        foodPreference:
          data.dietary_preference ?? "",
      });
    } catch (err: any) {
      console.error(
        "GENERATE DIET PROFILE ERROR:",
        err.response?.status,
        err.response?.data || err
      );

      if (err.response?.status === 404) {
        setProfile(null);
        setError(
          "Please complete your profile before generating a diet plan."
        );
      } else {
        setError(
          err.response?.data?.message ||
            "Failed to load your profile."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleGoalChange = (value: string) => {
    setFormData((current) => ({
      ...current,
      goal: value,
    }));
  };

  const handleFoodPreferenceChange = (
    value: string
  ) => {
    setFormData((current) => ({
      ...current,
      foodPreference: value,
    }));
  };

  const handleProfileSaved = async (
    updatedProfile: UserProfile
  ) => {
    setProfile(updatedProfile);

    setFormData({
      goal: updatedProfile.goal ?? "",
      foodPreference:
        updatedProfile.dietary_preference ?? "",
    });

    setEditingProfile(false);

    setSuccess(
      "Your profile has been updated successfully."
    );

    try {
      const freshProfile = await getProfile();

      setProfile(freshProfile);

      setFormData({
        goal: freshProfile.goal ?? "",
        foodPreference:
          freshProfile.dietary_preference ?? "",
      });
    } catch (err) {
      console.error(
        "Failed to refresh profile:",
        err
      );
    }
  };

  const handleGenerateDiet = async () => {
    if (!profile) {
      setError(
        "Please complete your profile before generating a diet plan."
      );
      return;
    }

    if (!formData.goal) {
      setError("Please select a goal.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      // If the goal or food preference chosen here differs
      // from what's saved on the profile, persist it first —
      // the backend reads goal/diet from the saved profile,
      // not from this form directly.
      const goalChanged = formData.goal !== profile.goal;
      const preferenceChanged =
        formData.foodPreference !== (profile.dietary_preference ?? "");

      if (goalChanged || preferenceChanged) {
        await updateProfile({
          goal: formData.goal,
          dietary_preference: formData.foodPreference,
        });
      }

      // Always regenerate so the plan reflects the
      // goal/preference selected on this page, even if
      // a plan was already generated earlier today.
      await regenerateMealPlan();

      setSuccess("Your diet plan has been generated!");

      navigate("/meal-plan");
    } catch (err: any) {
      console.error(
        "GENERATE DIET ERROR:",
        err.response?.data || err
      );

      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to generate your diet plan."
      );
    } finally {
      setSaving(false);
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

  if (!profile) {
    return (
      <DashboardLayout>
        <Box
          sx={{
            maxWidth: 900,
            mx: "auto",
          }}
        >
          <Alert severity="warning">
            {error ||
              "Please complete your profile before generating a diet plan."}
          </Alert>
        </Box>
      </DashboardLayout>
    );
  }

  if (editingProfile) {
    return (
      <DashboardLayout>
        <Box
          sx={{
            maxWidth: 900,
            mx: "auto",
          }}
        >
          <EditProfile
            profile={profile}
            onSave={handleProfileSaved}
            onCancel={() => {
              setEditingProfile(false);
            }}
          />
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Box
        sx={{
          maxWidth: 900,
          mx: "auto",
        }}
      >
        {error && (
          <Alert
            severity="error"
            sx={{ mb: 2 }}
            onClose={() => setError("")}
          >
            {error}
          </Alert>
        )}

        {success && (
          <Alert
            severity="success"
            sx={{ mb: 2 }}
            onClose={() => setSuccess("")}
          >
            {success}
          </Alert>
        )}

        <Card
          sx={{
            p: {
              xs: 2,
              sm: 3,
              md: 4,
            },
            borderRadius: 2,
            border: 1,
            borderColor: "divider",
            boxShadow: "none",
          }}
        >
          <Typography
            variant="h5"
            sx={{ fontWeight: 700 }}
          >
            Generate Your Diet
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mt: 0.5,
              mb: 3,
            }}
          >
            Your personal information is taken directly
            from your profile.
          </Typography>

          {/* Current Profile */}
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 700, mb: 1.5 }}
          >
            Your Current Profile
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr",
              },
              gap: 2,
              mb: 2,
            }}
          >
            <ProfileValue
              label="Age"
              value={`${profile.age} years`}
            />

            <ProfileValue
              label="Gender"
              value={profile.gender}
            />

            <ProfileValue
              label="Height"
              value={`${profile.height_cm} cm`}
            />

            <ProfileValue
              label="Weight"
              value={`${profile.weight_kg} kg`}
            />

            <ProfileValue
              label="Activity Level"
              value={profile.activity_level}
            />

            <ProfileValue
              label="Body Type"
              value={profile.body_type || "Not set"}
            />
          </Box>

          <Button
            variant="outlined"
            size="small"
            onClick={() => {
              setError("");
              setSuccess("");
              setEditingProfile(true);
            }}
            sx={{
              mb: 3,
              textTransform: "none",
            }}
          >
            Edit Profile
          </Button>

          {/* Goal */}
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 700, mb: 1.5 }}
          >
            Your Goal
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(3, 1fr)",
              },
              gap: 1.5,
              mb: 3,
            }}
          >
            {GOAL_OPTIONS.map((option) => (
              <Button
                key={option.value}
                variant={
                  formData.goal === option.value
                    ? "contained"
                    : "outlined"
                }
                color="primary"
                onClick={() =>
                  handleGoalChange(option.value)
                }
                sx={{
                  minHeight: 58,
                  justifyContent: "flex-start",
                  textTransform: "none",
                }}
              >
                {option.label}
              </Button>
            ))}
          </Box>

          {/* Food Preference */}
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 700, mb: 1.5 }}
          >
            Food Preferences
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(3, 1fr)",
              },
              gap: 1.5,
              mb: 3,
            }}
          >
            {FOOD_PREFERENCE_OPTIONS.map((option) => (
              <Button
                key={option.value || "none"}
                variant={
                  formData.foodPreference ===
                  option.value
                    ? "contained"
                    : "outlined"
                }
                color="primary"
                onClick={() =>
                  handleFoodPreferenceChange(
                    option.value
                  )
                }
                sx={{
                  minHeight: 52,
                  textTransform: "none",
                }}
              >
                {option.label}
              </Button>
            ))}
          </Box>

          {/* Generate */}
          <Button
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            disabled={saving}
            onClick={handleGenerateDiet}
            sx={{
              minHeight: 52,
              textTransform: "none",
            }}
          >
            {saving ? (
              <CircularProgress
                size={24}
                color="inherit"
              />
            ) : (
              "Generate My Diet Plan"
            )}
          </Button>
        </Card>
      </Box>
    </DashboardLayout>
  );
}

function ProfileValue({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2,
        bgcolor: "action.hover",
        border: 1,
        borderColor: "divider",
      }}
    >
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: "block" }}
      >
        {label}
      </Typography>

      <Typography
        variant="body1"
        sx={{ fontWeight: 600, mt: 0.5 }}
      >
        {value}
      </Typography>
    </Box>
  );
}