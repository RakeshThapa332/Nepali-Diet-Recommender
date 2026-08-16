import { useEffect, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Card,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";

import DashboardLayout from "../components/layout/DashboardLayout";

import EditProfile from "../components/profile/EditProfile";

import {
  getProfile,
  updateProfile,
} from "../services/profileService";

import type { UserProfile } from "../types/profile";

type GenerateForm = {
  goal: string;
  foodPreference: string;
};

export default function GenerateDiet() {
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

      console.log("GENERATE DIET PROFILE:", data);

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

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const generationData = {
        age: profile.age,
        gender: profile.gender,
        height_cm: profile.height_cm,
        weight_kg: profile.weight_kg,
        activity_level: profile.activity_level,
        goal: formData.goal,
        dietary_preference:
          formData.foodPreference,
      };

      console.log(
        "DIET GENERATION DATA:",
        generationData
      );

      setSuccess(
        "Your profile information is ready for diet generation."
      );
    } catch (err: any) {
      console.error(
        "GENERATE DIET ERROR:",
        err.response?.data || err
      );

      setError(
        err.response?.data?.message ||
          "Failed to prepare your diet recommendation."
      );
    } finally {
      setSaving(false);
    }
  };

  /*
   * Loading state
   */
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

  /*
   * If the user has no profile yet.
   */
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

  /*
   * Profile editing mode
   */
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
            fontWeight={700}
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
            fontWeight={700}
            sx={{ mb: 1.5 }}
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
            fontWeight={700}
            sx={{ mb: 1.5 }}
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
            {[
              "Weight Loss",
              "Maintain Weight",
              "Weight Gain",
            ].map((goal) => (
              <Button
                key={goal}
                variant={
                  formData.goal === goal
                    ? "contained"
                    : "outlined"
                }
                color="primary"
                onClick={() =>
                  handleGoalChange(goal)
                }
                sx={{
                  minHeight: 58,
                  justifyContent: "flex-start",
                  textTransform: "none",
                }}
              >
                {goal}
              </Button>
            ))}
          </Box>

          {/* Food Preference */}
          <Typography
            variant="subtitle2"
            fontWeight={700}
            sx={{ mb: 1.5 }}
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
            {[
              "Prefer Veg",
              "Vegetarian",
              "No Restrictions",
            ].map((preference) => (
              <Button
                key={preference}
                variant={
                  formData.foodPreference ===
                  preference
                    ? "contained"
                    : "outlined"
                }
                color="primary"
                onClick={() =>
                  handleFoodPreferenceChange(
                    preference
                  )
                }
                sx={{
                  minHeight: 52,
                  textTransform: "none",
                }}
              >
                {preference}
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

/*
 * Small reusable display component for profile values.
 */
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
        display="block"
      >
        {label}
      </Typography>

      <Typography
        variant="body1"
        fontWeight={600}
        sx={{ mt: 0.5 }}
      >
        {value}
      </Typography>
    </Box>
  );
}