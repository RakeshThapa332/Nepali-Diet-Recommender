import { useEffect, useState } from "react";

import {
  Badge,
  Box,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Menu,
  Typography,
} from "@mui/material";

import {
  NotificationsNoneOutlined,
} from "@mui/icons-material";

import {
  getNotifications,
  markNotificationAsRead,
} from "../../services/notificationService";

import { useAuth } from "../../context/AuthContext";

import type { Notification } from "../../types/notification";

export default function NotificationMenu() {
  const { user } = useAuth();

  const [notifications, setNotifications] = useState<
    Notification[]
  >([]);

  const [anchorEl, setAnchorEl] =
    useState<null | HTMLElement>(null);

  const [loading, setLoading] = useState(false);

  /*
   * Load notifications for the currently logged-in user
   */
  const loadNotifications = async () => {
    if (!user) {
      setNotifications([]);
      return;
    }

    try {
      setLoading(true);

      const data = await getNotifications();

      setNotifications(data);
    } catch (error: any) {
      console.error(
        "Failed to load notifications:",
        error.response?.data || error
      );

      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  /*
   * Load notifications when user logs in.
   * Also refresh every 60 seconds.
   */
  useEffect(() => {
    if (!user) {
      setNotifications([]);
      return;
    }

    loadNotifications();

    const interval = setInterval(
      loadNotifications,
      60 * 1000
    );

    return () => {
      clearInterval(interval);
    };
  }, [user]);

  /*
   * Number shown on the notification bell.
   *
   * Only unread notifications are counted.
   */
  const unreadCount = notifications.filter(
    (notification) => !notification.is_read
  ).length;

  /*
   * Open notification menu
   */
  const handleOpen = (
    event: React.MouseEvent<HTMLElement>
  ) => {
    setAnchorEl(event.currentTarget);

    // Refresh notifications when menu is opened.
    loadNotifications();
  };

  /*
   * Close notification menu
   */
  const handleClose = () => {
    setAnchorEl(null);
  };

  /*
   * Mark one notification as read.
   */
  const handleNotificationClick = async (
    notification: Notification
  ) => {
    // Already read, so there is nothing to do.
    if (notification.is_read) {
      return;
    }

    try {
      /*
       * Update backend first.
       *
       * PUT:
       * /api/notifications/<id>/read
       */
      await markNotificationAsRead(notification.id);

      /*
       * Immediately update React state.
       *
       * This makes the red "1" disappear without
       * requiring a page refresh.
       */
      setNotifications((currentNotifications) =>
        currentNotifications.map((item) =>
          item.id === notification.id
            ? {
                ...item,
                is_read: true,
              }
            : item
        )
      );
    } catch (error: any) {
      console.error(
        "Failed to mark notification as read:",
        error.response?.data || error
      );
    }
  };

  return (
    <>
      {/* Notification button */}
      <IconButton
        onClick={handleOpen}
        aria-label="notifications"
      >
        <Badge
          badgeContent={unreadCount}
          color="error"
          max={99}
        >
          <NotificationsNoneOutlined />
        </Badge>
      </IconButton>

      {/* Notification menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        slotProps={{
          paper: {
            sx: {
              width: 360,
              maxWidth: "calc(100vw - 32px)",
              maxHeight: 500,
            },
          },
        }}
      >
        {/* Header */}
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography
            variant="h6"
            sx={{fontWeight:700}}
          >
            Notifications
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            Your latest updates and reminders
          </Typography>
        </Box>

        <Divider />

        {/* Loading */}
        {loading && notifications.length === 0 ? (
          <Box
            sx={{
              px: 2,
              py: 4,
              textAlign: "center",
            }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
            >
              Loading notifications...
            </Typography>
          </Box>
        ) : notifications.length === 0 ? (
          /* Empty state */
          <Box
            sx={{
              px: 2,
              py: 5,
              textAlign: "center",
            }}
          >
            <NotificationsNoneOutlined
              sx={{
                fontSize: 40,
                color: "text.secondary",
                mb: 1,
              }}
            />

            <Typography
              variant="body2"
              color="text.secondary"
            >
              No notifications yet.
            </Typography>
          </Box>
        ) : (
          /* Notifications */
          <List disablePadding>
            {notifications.map((notification) => (
              <ListItem
                key={notification.id}
                onClick={() =>
                  handleNotificationClick(notification)
                }
                sx={{
                  px: 2,
                  py: 1.5,

                  /*
                   * Unread notifications have a different
                   * background.
                   */
                  bgcolor: notification.is_read
                    ? "transparent"
                    : "action.hover",

                  borderBottom: 1,
                  borderColor: "divider",

                  /*
                   * Make notifications look clickable.
                   */
                  cursor: notification.is_read
                    ? "default"
                    : "pointer",

                  "&:hover": {
                    bgcolor: "action.selected",
                  },
                }}
              >
                <ListItemText
                  primary={
                    <Typography
                    sx={{fontWeight:
                        notification.is_read
                          ? 500
                          : 700
                      }}
                    >
                      {notification.title}
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                      >
                        {notification.message}
                      </Typography>

                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          display: "block",
                          mt: 0.5,
                        }}
                      >
                        {new Date(
                          notification.created_at
                        ).toLocaleString()}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}
      </Menu>
    </>
  );
}