import {
    Menu as MenuIcon,
    NotificationsNoneOutlined,
} from "@mui/icons-material";



import {
    Avatar,
    Box,
    IconButton,
    Typography,
} from "@mui/material";

interface NavbarProps {
    onMenuClick: () => void;
    username?: string;
}

function getInitials(name: string): string {
    const trimmedName = name.trim();
    if (!trimmedName) {
        return "U";
    }
    const nameParts = trimmedName.split(/\s+/);

    if (nameParts.length === 1) {
        return nameParts[0].slice(0,2).toUpperCase();
    }

    return (
        nameParts[0][0] +
        nameParts[nameParts.length - 1][0]
    ).toUpperCase();
}

export default function Navbar({ 
    onMenuClick, username = "User",}: NavbarProps) {
        const initials =  getInitials(username);
    return (
        <Box
        component="header"
        sx={{
            height: 64,
            px: {xs:2, md: 3},
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: 1,
            borderColor: "divider",
            bgcolor: "background.paper",
            position: "sticky",
            top: 0,
            zIndex: 1100,
        }}
        >
            <Box sx={{ display: "flex", alignItems: "center", gap:1.5 }}>
                <IconButton
                onClick={onMenuClick}
                sx={{
                    display: { xs: "inline-flex", md: "none" },
                }}
                >
                    <MenuIcon />
                </IconButton>

                <Box>
                    <Typography variant="subtitle1" fontWeight={700}>
                        Dashboard
                    </Typography>

                    <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: { xs: "none", sm: "block" } }}
                    >
                        Your personalized nutrition overview
                    </Typography>
                </Box>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1}}>
                <IconButton>
                    <NotificationsNoneOutlined />
                </IconButton>

                <Avatar 
                sx={{
                    width: 34,
                    height: 34,
                    bgcolor: "primary.main",
                    fontSize: 13,
                }}
                >
                    {initials}
                </Avatar>
            </Box>
        </Box>
    );
}