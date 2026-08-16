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
} from "@mui/material";

import {
  updateProfile,
} from "../../services/profileService";

import type { UserProfile } from "../../types/profile";

interface EditProfileProps {
  profile: UserProfile;
  onSave: (profile: UserProfile) => void;
  onCancel: () => void;
}

export default function EditProfile({
  profile,
  onSave,
  onCancel,
}: EditProfileProps) {
  const [form, setForm] = useState<UserProfile>(profile);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const updateField = (
    field: keyof UserProfile,
    value: string | number
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");

    try {
      setLoading(true);

      await updateProfile(form);

      onSave(form);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Failed to update profile."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
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
      {error && (
        <Alert
          severity="error"
          sx={{
            gridColumn: {
              xs: "auto",
              md: "1 / -1",
            },
          }}
        >
          {error}
        </Alert>
      )}

      <TextField
        label="Age"
        type="number"
        value={form.age}
        onChange={(e) =>
          updateField("age", Number(e.target.value))
        }
        required
      />

      <FormControl required>
        <InputLabel>Gender</InputLabel>

        <Select
          value={form.gender}
          label="Gender"
          onChange={(e) =>
            updateField("gender", e.target.value)
          }
        >
          <MenuItem value="male">Male</MenuItem>
          <MenuItem value="female">Female</MenuItem>
          <MenuItem value="other">Other</MenuItem>
        </Select>
      </FormControl>

      <TextField
        label="Height (cm)"
        type="number"
        value={form.height_cm}
        onChange={(e) =>
          updateField("height_cm", Number(e.target.value))
        }
        required
      />

      <TextField
        label="Weight (kg)"
        type="number"
        value={form.weight_kg}
        onChange={(e) =>
          updateField("weight_kg", Number(e.target.value))
        }
        required
      />

      <FormControl required>
        <InputLabel>Activity Level</InputLabel>

        <Select
          value={form.activity_level}
          label="Activity Level"
          onChange={(e) =>
            updateField("activity_level", e.target.value)
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
            updateField("goal", e.target.value)
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
        <InputLabel>Dietary Preference</InputLabel>

        <Select
          value={form.dietary_preference}
          label="Dietary Preference"
          onChange={(e) =>
            updateField(
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

      <Box
        sx={{
          gridColumn: {
            xs: "auto",
            md: "1 / -1",
          },
          display: "flex",
          justifyContent: "flex-end",
          gap: 1,
          mt: 1,
        }}
      >
        <Button
          type="button"
          variant="outlined"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          variant="contained"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </Box>
    </Box>
  );
}