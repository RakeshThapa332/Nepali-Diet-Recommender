import { useState } from "react";
import {
  Box,
  Button,
  Card,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";

import DashboardLayout from "../components/layout/DashboardLayout";

interface FormData {
  age: string;
  gender: string;
  height: string;
  weight: string;
  activityLevel: string;
  bodyType: string;
  goal: string;
  foodPreference: string;
}

const initialForm: FormData = {
  age: "25",
  gender: "Male",
  height: "175",
  weight: "70",
  activityLevel: "Moderately Active",
  bodyType: "Mesomorphic",
  goal: "Weight Loss",
  foodPreference: "No Restrictions",
};

export default function GenerateDiet() {
  const [formData, setFormData] =
    useState<FormData>(initialForm);

  const handleChange = (
    field: keyof FormData,
    value: string,
  ) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  };

  return (
    <DashboardLayout>
      <Box
        sx={{
          maxWidth: 900,
          mx: "auto",
        }}
      >
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
            Let's Get to Know You
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 0.5, mb: 3 }}
          >
            Provide your details to get a personalized
            diet plan.
          </Typography>

          <Typography
            variant="subtitle2"
            fontWeight={700}
            sx={{ mb: 1.5 }}
          >
            Personal Information
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr",
              },
              gap: 2,
              mb: 3,
            }}
          >
            <TextField
              label="Age"
              type="number"
              value={formData.age}
              onChange={(event) =>
                handleChange(
                  "age",
                  event.target.value,
                )
              }
              fullWidth
            />

            <FormControl fullWidth>
              <InputLabel>Gender</InputLabel>
              <Select
                value={formData.gender}
                label="Gender"
                onChange={(event) =>
                  handleChange(
                    "gender",
                    event.target.value,
                  )
                }
              >
                <MenuItem value="Male">
                  Male
                </MenuItem>

                <MenuItem value="Female">
                  Female
                </MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Height"
              type="number"
              value={formData.height}
              onChange={(event) =>
                handleChange(
                  "height",
                  event.target.value,
                )
              }
              slotProps={{
                input: {
                  endAdornment: (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      cm
                    </Typography>
                  ),
                },
              }}
              fullWidth
            />

            <TextField
              label="Weight"
              type="number"
              value={formData.weight}
              onChange={(event) =>
                handleChange(
                  "weight",
                  event.target.value,
                )
              }
              slotProps={{
                input: {
                  endAdornment: (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      kg
                    </Typography>
                  ),
                },
              }}
              fullWidth
            />
          </Box>

          <Typography
            variant="subtitle2"
            fontWeight={700}
            sx={{ mb: 1.5 }}
          >
            Lifestyle Information
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr",
              },
              gap: 2,
              mb: 3,
            }}
          >
            <FormControl fullWidth>
              <InputLabel>
                Activity Level
              </InputLabel>

              <Select
                value={formData.activityLevel}
                label="Activity Level"
                onChange={(event) =>
                  handleChange(
                    "activityLevel",
                    event.target.value,
                  )
                }
              >
                <MenuItem value="Sedentary">
                  Sedentary
                </MenuItem>

                <MenuItem value="Lightly Active">
                  Lightly Active
                </MenuItem>

                <MenuItem value="Moderately Active">
                  Moderately Active
                </MenuItem>

                <MenuItem value="Very Active">
                  Very Active
                </MenuItem>

                <MenuItem value="Extra Active">
                  Extra Active
                </MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>
                Body Type
              </InputLabel>

              <Select
                value={formData.bodyType}
                label="Body Type"
                onChange={(event) =>
                  handleChange(
                    "bodyType",
                    event.target.value,
                  )
                }
              >
                <MenuItem value="Ectomorphic">
                  Ectomorphic
                </MenuItem>

                <MenuItem value="Mesomorphic">
                  Mesomorphic
                </MenuItem>

                <MenuItem value="Endomorphic">
                  Endomorphic
                </MenuItem>
              </Select>
            </FormControl>
          </Box>

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
                  handleChange("goal", goal)
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
                  handleChange(
                    "foodPreference",
                    preference,
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

          <Button
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            onClick={() => {
              console.log(
                "Generate diet:",
                formData,
              );
            }}
          >
            Generate My Diet Plan
          </Button>
        </Card>
      </Box>
    </DashboardLayout>
  );
}