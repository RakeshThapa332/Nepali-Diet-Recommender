import {
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

import { useState } from "react";
import type { NotificationSettings as NotificationSettingsType } from "../../types/settings";

const initialSettings: NotificationSettingsType = {
  notifications_enabled: true,

  breakfast_enabled: true,
  breakfast_time: "08:00",

  lunch_enabled: true,
  lunch_time: "12:30",

  dinner_enabled: true,
  dinner_time: "19:30",

  weekly_progress_enabled: true,
  recommendation_enabled: true,
};

export default function NotificationSettings() {
  const [settings, setSettings] =
    useState<NotificationSettingsType>(initialSettings);

  const updateSetting = <
    K extends keyof NotificationSettingsType
  >(
    key: K,
    value: NotificationSettingsType[K]
  ) => {
    setSettings((current) => ({
      ...current,
      [key]: value,
    }));
  };

  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <Typography
          variant="h6"
          fontWeight={700}
          mb={0.5}
        >
          Notifications
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          mb={3}
        >
          Manage meal reminders and other nutrition notifications.
        </Typography>

        <Divider sx={{ mb: 2 }} />

        {/* Master notification switch */}

        <FormControlLabel
          control={
            <Switch
              checked={settings.notifications_enabled}
              onChange={(e) =>
                updateSetting(
                  "notifications_enabled",
                  e.target.checked
                )
              }
            />
          }
          label={
            <Box>
              <Typography fontWeight={600}>
                Enable notifications
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Receive reminders and updates from Nepali Diet.
              </Typography>
            </Box>
          }
        />

        <Divider sx={{ my: 3 }} />

        {/* Meal reminders */}

        <Typography
          variant="subtitle1"
          fontWeight={700}
          mb={2}
        >
          Meal Reminders
        </Typography>

        <Stack spacing={2}>
          {/* Breakfast */}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <FormControlLabel
              control={
                <Switch
                  checked={settings.breakfast_enabled}
                  disabled={!settings.notifications_enabled}
                  onChange={(e) =>
                    updateSetting(
                      "breakfast_enabled",
                      e.target.checked
                    )
                  }
                />
              }
              label={
                <Typography fontWeight={600}>
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
                updateSetting(
                  "breakfast_time",
                  e.target.value
                )
              }
              sx={{ width: 140 }}
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
              flexWrap: "wrap",
            }}
          >
            <FormControlLabel
              control={
                <Switch
                  checked={settings.lunch_enabled}
                  disabled={!settings.notifications_enabled}
                  onChange={(e) =>
                    updateSetting(
                      "lunch_enabled",
                      e.target.checked
                    )
                  }
                />
              }
              label={
                <Typography fontWeight={600}>
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
                updateSetting(
                  "lunch_time",
                  e.target.value
                )
              }
              sx={{ width: 140 }}
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
              flexWrap: "wrap",
            }}
          >
            <FormControlLabel
              control={
                <Switch
                  checked={settings.dinner_enabled}
                  disabled={!settings.notifications_enabled}
                  onChange={(e) =>
                    updateSetting(
                      "dinner_enabled",
                      e.target.checked
                    )
                  }
                />
              }
              label={
                <Typography fontWeight={600}>
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
                updateSetting(
                  "dinner_time",
                  e.target.value
                )
              }
              sx={{ width: 140 }}
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
          fontWeight={700}
          mb={2}
        >
          Other Notifications
        </Typography>

        <Stack spacing={1}>
          <FormControlLabel
            control={
              <Switch
                checked={settings.weekly_progress_enabled}
                disabled={!settings.notifications_enabled}
                onChange={(e) =>
                  updateSetting(
                    "weekly_progress_enabled",
                    e.target.checked
                  )
                }
              />
            }
            label={
              <Box>
                <Typography fontWeight={600}>
                  Weekly progress
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Receive a weekly summary of your nutrition progress.
                </Typography>
              </Box>
            }
          />

          <FormControlLabel
            control={
              <Switch
                checked={settings.recommendation_enabled}
                disabled={!settings.notifications_enabled}
                onChange={(e) =>
                  updateSetting(
                    "recommendation_enabled",
                    e.target.checked
                  )
                }
              />
            }
            label={
              <Box>
                <Typography fontWeight={600}>
                  Diet recommendations
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Receive notifications about new recommendations.
                </Typography>
              </Box>
            }
          />
        </Stack>
      </CardContent>
    </Card>
  );
}