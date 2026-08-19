import {
  Box,
  Card,
  CardContent,
  Divider,
  FormControlLabel,
  Stack,
  Switch,
  Typography,
} from "@mui/material";

import DashboardLayout from "../components/layout/DashboardLayout";
import { useThemeMode } from "../context/ThemeContext";
import NotificationSettings from "../components/settings/NotificationSettings";
import DeleteAccount from "../components/settings/DeleteAccount";

export default function Settings() {
  const { darkMode, toggleDarkMode } = useThemeMode();

  return (
    <DashboardLayout>
      <Box sx={{ maxWidth: 900, mx: "auto" }}>
        <Typography variant="h4" fontWeight={700} mb={1}>
          Settings
        </Typography>

        <Typography
          color="text.secondary"
          mb={4}
        >
          Manage your application preferences and notifications.
        </Typography>

        {/* Appearance */}
        <Card sx={{ mb: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography
              variant="h6"
              fontWeight={700}
              mb={0.5}
            >
              Appearance
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              mb={3}
            >
              Customize how Nepali Diet looks on your device.
            </Typography>

            <Divider sx={{ mb: 2 }} />

            <FormControlLabel
              control={
                <Switch
                  checked={darkMode}
                  onChange={toggleDarkMode}
                />
              }
              label={
                <Stack>
                  <Typography fontWeight={600}>
                    Dark mode
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    {darkMode
                      ? "Dark theme is enabled."
                      : "Light theme is enabled."}
                  </Typography>
                </Stack>
              }
            />
          </CardContent>
        </Card>

        {/* Notifications */}
        <NotificationSettings />

        <Card sx={{ mt: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={700} mb={1}>
              Account data
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Permanently remove your account and all associated data.
            </Typography>
            <DeleteAccount />
          </CardContent>
        </Card>
      </Box>
    </DashboardLayout>
  );
}