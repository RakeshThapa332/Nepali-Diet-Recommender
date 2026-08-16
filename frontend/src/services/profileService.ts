import api from "../api/axios";
import type { UserProfile } from "../types/profile";

export async function getProfile(): Promise<UserProfile> {
  const response = await api.get("/profile/");
  return response.data.profile;
}

export async function createProfile(profile: UserProfile) {
  const response = await api.post("/profile/", profile);
  return response.data;
}

export async function updateProfile(profile: Partial<UserProfile>) {
  const response = await api.put("/profile/", profile);
  return response.data;
}

export async function deleteProfile() {
  const response = await api.delete("/profile/");
  return response.data;
}