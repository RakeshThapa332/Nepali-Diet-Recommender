import { useEffect, useState } from "react";

import {
  Alert,
  Box,
  CircularProgress,
} from "@mui/material";

import DashboardLayout from "../components/layout/DashboardLayout";

import ProfileSetup from "../components/profile/ProfileSetup";
import ProfileDetails from "../components/profile/ProfileDetails";
import EditProfile from "../components/profile/EditProfile";

import {
  getProfile,
} from "../services/profileService";

import type { UserProfile } from "../types/profile";

type ProfileMode = "details" | "edit";

export default function Profile() {
  const [profile, setProfile] =
    useState<UserProfile | null>(null);

  const [mode, setMode] =
    useState<ProfileMode>("details");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
  try {
    setLoading(true);
    setError("");

    const profile = await getProfile();

    console.log("PROFILE:", profile);

    setProfile(profile);
    setMode("details");
  } catch (err: any) {
    console.log(
      "PROFILE ERROR:",
      err.response?.status,
      err.response?.data
    );

    if (err.response?.status === 404) {
      setProfile(null);
    } else {
      setError(
        err.response?.data?.message ||
          "Failed to load profile."
      );
    }
  } finally {
    setLoading(false);
  }
};

  if (loading) {
    return (
      <DashboardLayout>
        <Box
          sx={{
            minHeight: "60vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress />
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Box>
        {error && (
          <Alert
            severity="error"
            sx={{ mb: 3 }}
          >
            {error}
          </Alert>
        )}

        {!profile ? (
          <ProfileSetup
            onComplete={(newProfile) => {
              setProfile(newProfile);
              setMode("details");
            }}
          />
        ) : mode === "details" ? (
          <ProfileDetails
            profile={profile}
            onEdit={() => setMode("edit")}
          />
        ) : (
          <EditProfile
            profile={profile}
            onSave={(updatedProfile) => {
              setProfile(updatedProfile);
              setMode("details");
            }}
            onCancel={() => {
              setMode("details");
            }}
          />
        )}
      </Box>
    </DashboardLayout>
  );
}