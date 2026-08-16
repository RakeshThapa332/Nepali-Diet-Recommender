import api from "../api/axios";
import type { UserSettings } from "../types/settings";

export async function getSettings(): Promise<UserSettings> {
  const response = await api.get("/settings/");
  return response.data.settings;
}

export async function updateSettings(
  settings: Partial<UserSettings>
): Promise<UserSettings> {
  const response = await api.put("/settings/", settings);
  return response.data.settings;
}