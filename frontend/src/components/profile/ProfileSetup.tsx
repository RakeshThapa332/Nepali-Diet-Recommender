import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";

import { createProfile } from "../../services/profileService";
import type { UserProfile } from "../../types/profile";

interface ProfileSetupProps {
  onComplete: (profile: UserProfile) => void;
}

const initialProfile: UserProfile = {
  age: 0,
  gender: "",
  height_cm: 0,
  weight_kg: 0,
  activity_level: "",
  goal: "",
  dietary_preference: "",
};

export default function ProfileSetup({
  onComplete,
}: ProfileSetupProps) {
  const [form, setForm] =
    useState<UserProfile>(initialProfile);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (
    field: keyof UserProfile,
    value: string | number
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();
    setError("");

    if (
      !form.age ||
      !form.gender ||
      !form.height_cm ||
      !form.weight_kg ||
      !form.activity_level ||
      !form.goal
    ) {
      setError(
        "Please fill in all required fields."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await createProfile(form);

      onComplete(
        response.profile ?? form
      );
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Failed to create profile."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography
        variant="h4"
        fontWeight={700}
        mb={1}
      >
        Complete Your Profile
      </Typography>

      <Typography
        color="text.secondary"
        mb={3}
      >
        Tell us about yourself so we can create
        personalized nutrition recommendations.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "1fr 1fr",
          },
          gap: 2,
        }}
      >
        <TextField
          label="Age"
          type="number"
          value={form.age || ""}
          onChange={(e) =>
            handleChange(
              "age",
              Number(e.target.value)
            )
          }
          required
        />

        <FormControl required>
          <InputLabel>Gender</InputLabel>

          <Select
            value={form.gender}
            label="Gender"
            onChange={(e) =>
              handleChange(
                "gender",
                e.target.value
              )
            }
          >
            <MenuItem value="male">
              Male
            </MenuItem>

            <MenuItem value="female">
              Female
            </MenuItem>

            <MenuItem value="other">
              Other
            </MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Height (cm)"
          type="number"
          value={form.height_cm || ""}
          onChange={(e) =>
            handleChange(
              "height_cm",
              Number(e.target.value)
            )
          }
          required
        />

        <TextField
          label="Weight (kg)"
          type="number"
          value={form.weight_kg || ""}
          onChange={(e) =>
            handleChange(
              "weight_kg",
              Number(e.target.value)
            )
          }
          required
        />

        <FormControl required>
          <InputLabel>
            Activity Level
          </InputLabel>

          <Select
            value={form.activity_level}
            label="Activity Level"
            onChange={(e) =>
              handleChange(
                "activity_level",
                e.target.value
              )
            }
          >
            <MenuItem value="sedentary">
              Sedentary
            </MenuItem>

            <MenuItem value="light">
              Lightly Active
            </MenuItem>

            <MenuItem value="moderate">
              Moderately Active
            </MenuItem>

            <MenuItem value="active">
              Very Active
            </MenuItem>

            <MenuItem value="very_active">
              Extremely Active
            </MenuItem>
          </Select>
        </FormControl>

        <FormControl required>
          <InputLabel>Goal</InputLabel>

          <Select
            value={form.goal}
            label="Goal"
            onChange={(e) =>
              handleChange(
                "goal",
                e.target.value
              )
            }
          >
            <MenuItem value="weight_loss">
              Weight Loss
            </MenuItem>

            <MenuItem value="maintenance">
              Maintain Weight
            </MenuItem>

            <MenuItem value="weight_gain">
              Weight Gain
            </MenuItem>
          </Select>
        </FormControl>

        <FormControl
          sx={{
            gridColumn: {
              xs: "auto",
              md: "1 / -1",
            },
          }}
        >
          <InputLabel>
            Dietary Preference
          </InputLabel>

          <Select
            value={form.dietary_preference}
            label="Dietary Preference"
            onChange={(e) =>
              handleChange(
                "dietary_preference",
                e.target.value
              )
            }
          >
            <MenuItem value="">
              No Preference
            </MenuItem>

            <MenuItem value="vegetarian">
              Vegetarian
            </MenuItem>

            <MenuItem value="non_vegetarian">
              Non-Vegetarian
            </MenuItem>
          </Select>
        </FormControl>

        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={loading}
          sx={{
            gridColumn: {
              xs: "auto",
              md: "1 / -1",
            },
            mt: 1,
          }}
        >
          {loading
            ? "Saving Profile..."
            : "Complete Profile"}
        </Button>
      </Box>
    </Box>
  );
}