import { useEffect, useState } from "react";

import {
  Alert,
  Box,
  Card,
  CardContent,
  Divider,
  FormControlLabel,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";

import {
  getSettings,
  updateSettings,
} from "../../services/settingsService";

import type { UserSettings } from "../../types/settings";

export default function NotificationSettings() {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getSettings();

      setSettings(data);
    } catch (err: any) {
      console.error("SETTINGS ERROR:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load notification settings."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (
    field: keyof UserSettings,
    value: boolean
  ) => {
    if (!settings) return;

    const previousSettings = settings;

    const updatedSettings = {
      ...settings,
      [field]: value,
    };

    // Update UI immediately
    setSettings(updatedSettings);

    try {
      const savedSettings = await updateSettings({
        [field]: value,
      });

      setSettings(savedSettings);
    } catch (err: any) {
      console.error("UPDATE SETTINGS ERROR:", err);

      // Revert UI if backend update fails
      setSettings(previousSettings);

      setError(
        err.response?.data?.message ||
          "Failed to update settings."
      );
    }
  };

  const handleTimeChange = async (
    field:
      | "breakfast_time"
      | "lunch_time"
      | "dinner_time",
    value: string
  ) => {
    if (!settings) return;

    const previousSettings = settings;

    setSettings({
      ...settings,
      [field]: value,
    });

    try {
      const savedSettings = await updateSettings({
        [field]: value,
      });

      setSettings(savedSettings);
    } catch (err: any) {
      console.error("UPDATE TIME ERROR:", err);

      setSettings(previousSettings);

      setError(
        err.response?.data?.message ||
          "Failed to update notification time."
      );
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent sx={{ p: 3 }}>
          <Typography>
            Loading notification settings...
          </Typography>
        </CardContent>
      </Card>
    );
  }

  if (!settings) {
    return (
      <Alert severity="error">
        Unable to load notification settings.
      </Alert>
    );
  }

  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <Typography
          variant="h6"
          sx={{fontWeight:700,
          mb:0.5}}
        >
          Notifications
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{mb:3}}
        >
          Control meal reminders and other nutrition notifications.
        </Typography>

        {error && (
          <Alert
            severity="error"
            sx={{ mb: 3 }}
            onClose={() => setError("")}
          >
            {error}
          </Alert>
        )}

        {/* Master notification switch */}
        <FormControlLabel
          control={
            <Switch
              checked={settings.notifications_enabled}
              onChange={(e) =>
                handleToggle(
                  "notifications_enabled",
                  e.target.checked
                )
              }
            />
          }
          label={
            <Stack>
<Typography sx={{ fontWeight: 600 }}>
                Enable notifications
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Turn all notifications on or off.
              </Typography>
            </Stack>
          }
        />

        <Divider sx={{ my: 3 }} />

        {/* Meal reminders */}
        <Typography
          variant="subtitle1"
          sx={{fontWeight:700,
          mb:2}}
        >
          Meal reminders
        </Typography>

        <Stack spacing={2.5}>
          {/* Breakfast */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <FormControlLabel
              control={
                <Switch
                  checked={settings.breakfast_enabled}
                  disabled={!settings.notifications_enabled}
                  onChange={(e) =>
                    handleToggle(
                      "breakfast_enabled",
                      e.target.checked
                    )
                  }
                />
              }
              label={
                <Typography sx={{ fontWeight: 600 }}>
                  Breakfast
                </Typography>
              }
            />

            <TextField
              type="time"
              size="small"
              value={settings.breakfast_time}
              disabled={
                !settings.notifications_enabled ||
                !settings.breakfast_enabled
              }
              onChange={(e) =>
                handleTimeChange(
                  "breakfast_time",
                  e.target.value
                )
              }
              sx={{ width: 130 }}
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
            />
          </Box>

          {/* Lunch */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <FormControlLabel
              control={
                <Switch
                  checked={settings.lunch_enabled}
                  disabled={!settings.notifications_enabled}
                  onChange={(e) =>
                    handleToggle(
                      "lunch_enabled",
                      e.target.checked
                    )
                  }
                />
              }
              label={
                <Typography sx={{ fontWeight: 600 }}>
                  Lunch
                </Typography>
              }
            />

            <TextField
              type="time"
              size="small"
              value={settings.lunch_time}
              disabled={
                !settings.notifications_enabled ||
                !settings.lunch_enabled
              }
              onChange={(e) =>
                handleTimeChange(
                  "lunch_time",
                  e.target.value
                )
              }
              sx={{ width: 130 }}
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
            />
          </Box>

          {/* Dinner */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <FormControlLabel
              control={
                <Switch
                  checked={settings.dinner_enabled}
                  disabled={!settings.notifications_enabled}
                  onChange={(e) =>
                    handleToggle(
                      "dinner_enabled",
                      e.target.checked
                    )
                  }
                />
              }
              label={
                <Typography sx={{ fontWeight: 600 }}>
                  Dinner
                </Typography>
              }
            />

            <TextField
              type="time"
              size="small"
              value={settings.dinner_time}
              disabled={
                !settings.notifications_enabled ||
                !settings.dinner_enabled
              }
              onChange={(e) =>
                handleTimeChange(
                  "dinner_time",
                  e.target.value
                )
              }
              sx={{ width: 130 }}
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
            />
          </Box>
        </Stack>

        <Divider sx={{ my: 3 }} />

        {/* Other notifications */}
        <Typography
          variant="subtitle1"
          sx={{fontWeight:700,
          mb:2}}
        >
          Other notifications
        </Typography>

        <Stack spacing={1}>
          <FormControlLabel
            control={
              <Switch
                checked={settings.weekly_progress_enabled}
                disabled={!settings.notifications_enabled}
                onChange={(e) =>
                  handleToggle(
                    "weekly_progress_enabled",
                    e.target.checked
                  )
                }
              />
            }
            label={
              <Stack>
                <Typography sx={{fontWeight:600}}>
                  Weekly progress
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Receive a weekly nutrition progress reminder.
                </Typography>
              </Stack>
            }
          />

          <FormControlLabel
            control={
              <Switch
                checked={settings.recommendation_enabled}
                disabled={!settings.notifications_enabled}
                onChange={(e) =>
                  handleToggle(
                    "recommendation_enabled",
                    e.target.checked
                  )
                }
              />
            }
            label={
              <Stack>
                <Typography sx={{fontWeight:600}}>
                  Diet recommendations
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Receive notifications related to your diet recommendations.
                </Typography>
              </Stack>
            }
          />
        </Stack>
      </CardContent>
    </Card>
  );
}