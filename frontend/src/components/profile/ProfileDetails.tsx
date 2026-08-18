import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";

import type { UserProfile } from "../../types/profile";

interface ProfileDetailsProps {
  profile: UserProfile;
  onEdit: () => void;
}

export default function ProfileDetails({
  profile,
  onEdit,
}: ProfileDetailsProps) {
  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight={700}>
            Your Profile
          </Typography>

          <Typography color="text.secondary">
            Your personal and nutrition information
          </Typography>
        </Box>

        <Button variant="outlined" onClick={onEdit}>
          Edit Profile
        </Button>
      </Box>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <ProfileItem
            label="Age"
            value={`${profile.age} years`}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <ProfileItem
            label="Gender"
            value={formatValue(profile.gender)}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <ProfileItem
            label="Height"
            value={`${profile.height_cm} cm`}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <ProfileItem
            label="Weight"
            value={`${profile.weight_kg} kg`}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <ProfileItem
            label="Activity Level"
            value={formatValue(profile.activity_level)}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <ProfileItem
            label="Goal"
            value={formatValue(profile.goal)}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <ProfileItem
            label="Body Type"
            value={
              profile.body_type
                ? formatValue(profile.body_type)
                : "Not set"
            }
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6,md: 4 }}>
          <ProfileItem
            label="Dietary Preference"
            value={
              profile.dietary_preference
                ? formatValue(profile.dietary_preference)
                : "No preference"
            }
          />
        </Grid>
      </Grid>

      {profile.bmi !== undefined && (
        <>
          <Typography
            variant="h6"
            fontWeight={700}
            sx={{ mt: 4, mb: 2 }}
          >
            Your Nutrition Overview
          </Typography>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <ProfileItem
                label="BMI"
                value={
                  profile.bmi_category
                    ? `${profile.bmi} (${profile.bmi_category})`
                    : `${profile.bmi}`
                }
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <ProfileItem
                label="BMR"
                value={`${profile.bmr} kcal/day`}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <ProfileItem
                label="TDEE"
                value={`${profile.tdee} kcal/day`}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <ProfileItem
                label="Target Calories"
                value={`${profile.target_calories} kcal/day`}
              />
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
}

function ProfileItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <Card>
      <CardContent>
        <Typography
          variant="caption"
          color="text.secondary"
        >
          {label}
        </Typography>

        <Typography
          variant="h6"
          fontWeight={600}
          mt={0.5}
        >
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}

function formatValue(value: string) {
  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}