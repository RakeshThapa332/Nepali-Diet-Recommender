import { useState } from "react";
import { Box } from "@mui/material";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export default function DashboardLayout({
    children,
}: DashboardLayoutProps) {
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleMenuClick = () => {
        setMobileOpen((current) => !current);
    };
    const handleClose =() => {
        setMobileOpen(false);
    };

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
                onclick={handleClose}
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
                <Navbar onMenuClick={handleMenuClick} />

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