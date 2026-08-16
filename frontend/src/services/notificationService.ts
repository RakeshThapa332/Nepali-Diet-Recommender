import api from "../api/axios";
import type { Notification } from "../types/notification";

export async function getNotifications(): Promise<Notification[]> {
  const response = await api.get("/notifications/");
  return response.data.notifications;
}

export async function markNotificationAsRead(
  notificationId: number
) {
  const response = await api.put(
    `/notifications/${notificationId}/read`
  );

  return response.data;
}