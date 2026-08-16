import { useState } from "react";
import { Box } from "@mui/material";
import { useLocation } from "react-router-dom";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

import { useAuth } from "../../context/AuthContext";

interface DashboardLayoutProps {
    children: React.ReactNode;
}

const pageInfo: Record<
    string,
    { title:  string; subtitle: string}
    >={
        "/dashboard": {
             title: "Dashboard",
            subtitle: "Your personalized nutrition overview",
        },
        "/generate": {
            title: "Generate Diet",
            subtitle: "Create your personalized meal plan",
        },
        "/meal-plan": {
            title: "My Meal Plan",
            subtitle: "View your personalized meal plan",
        },
        "/foods": {
        title: "Food Explorer",
        subtitle: "Explore Nepali foods and nutrition",
        },
        "/logs": {
            title: "Logs / History",
            subtitle: "Track your nutrition and meal history",
        },
        "/progress": {
            title: "Progress",
            subtitle: "Track your nutrition progress",
        },
        "/profile": {
            title: "Profile",
            subtitle: "Manage your profile information",
        },
        "/settings": {
            title: "Settings",
            subtitle: "Manage your application settings",
        },
    }

export default function DashboardLayout({
    children,
}: DashboardLayoutProps) {
    const [mobileOpen, setMobileOpen] = useState(false);

    const location = useLocation();

    const {user} = useAuth();
    const handleMenuClick = () => {
        setMobileOpen((current) => !current);
    };
    const handleClose =() => {
        setMobileOpen(false);
    };

    let currentPage = pageInfo[location.pathname];

    if (location.pathname.startsWith("/foods/")) {
        currentPage = {
            title: "Food Details",
            subtitle: "View nutritional information",
        };
    }
    
    if (!currentPage) {
        currentPage = {
            title: "Nepali Diet",
            subtitle: "Diet recommendation system",
        };
    }
    return (
        <Box
        sx={{
            minHeight: "100vh",
            display: "flex",
            bgcolor: "background.default",
            color: "text.primary",
        }}
        >
            <Sidebar
            mobileOpen={mobileOpen}
            onClose={handleClose}
            />

            {mobileOpen && (
                <Box
                onClick={handleClose}
                sx={{
                    display: { xs: "block", md: "none"},
                    position: "fixed",
                    inset: 0,
                    zIndex: 1150,
                    bgcolor: "rgba(0, 0, 0, 0.55)",
                }}
                />
            )}
            <Box
            sx={{
                flexGrow: 1,
                minWidth: 0,
            }}>
                <Navbar 
                    onMenuClick={handleMenuClick}
                    title={currentPage.title}
                    subtitle={currentPage.subtitle}
                    />

                <Box
                component="main"
                sx={{
                    p: { xs: 2, sm: 2.5, md: 3 },
                    maxWidth: 1600,
                    mx: "auto",
                }}>
                    {children}
                </Box>
            </Box>
        </Box>
    );
}