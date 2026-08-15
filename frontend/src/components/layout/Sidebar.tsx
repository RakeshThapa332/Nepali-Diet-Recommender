import {
  DashboardOutlined,
  RestaurantMenuOutlined,
  HistoryOutlined,
  TrendingUpOutlined,
  SettingsOutlined,
  PersonOutlined,
  LogoutOutlined,
  MenuBookOutlined,
  AutoAwesomeOutlined,
} from "@mui/icons-material";

import {
  Box,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";

import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
interface SidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  {
    label: "Dashboard",
    icon: <DashboardOutlined />,
    path: "/dashboard",
  },
  {
    label: "Generate Diet",
    icon: <AutoAwesomeOutlined/>,
    path: "/generate",
  },
  {
    label: "My Meal Plan",
    icon: <RestaurantMenuOutlined />,
    path: "/meal-plan",
  },
  {
    label: "Food Explorer",
    icon: <MenuBookOutlined />,
    path: "/foods",
  },
  {
    label: "Logs / History",
    icon: <HistoryOutlined />,
    path: "/logs",
  },
  {
    label: "Progress",
    icon: <TrendingUpOutlined />,
    path: "/progress",
  },
  {
    label: "Profile",
    icon: <PersonOutlined />,
    path: "/profile",
  },
  {
    label: "Settings",
    icon: <SettingsOutlined />,
    path: "/settings",
  },
];

const drawerWidth = 240;

export default function Sidebar({
  mobileOpen,
  onClose,
}: SidebarProps) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/login");
    onClose();
  }
  return (
    <Box
      component="aside"
      sx={{
        width: { xs: mobileOpen ? drawerWidth : 0, md: drawerWidth },
        flexShrink: 0,
        position: { xs: "fixed", md: "sticky" },
        top: 0,
        left: 0,
        height: "100vh",
        zIndex: 1200,
        overflow: "hidden",
        transition: "width 0.2s ease",
        bgcolor: "background.paper",
        borderRight: 1,
        borderColor: "divider",
      }}
    >
      <Box
        sx={{
          width: drawerWidth,
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Logo */}
        <Box
          sx={{
            height: 72,
            px: 2.5,
            display: "flex",
            alignItems: "center",
            gap: 1.25,
          }}
        >
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 1.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "primary.main",
              color: "primary.contrastText",
            }}
          >
            <RestaurantMenuOutlined fontSize="small" />
          </Box>

          <Box>
            <Typography
              variant="subtitle2"
              fontWeight={700}
              noWrap
            >
              Nepali Diet
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
              noWrap
            >
              Recommender
            </Typography>
          </Box>
        </Box>

        <Divider />

        {/* Navigation */}
        <List sx={{ px: 1.25, py: 2 }}>
          {menuItems.map((item) => (
            <ListItemButton
              key={item.path}
              component={NavLink}
              to={item.path}
              onClick={onClose}
              sx={{
                mb: 0.5,
                minHeight: 44,
                borderRadius: 1.5,
                color: "text-primary",
                textDecoration: "none",
                "& .MuiListItemIcon-root": {
                  color: "text.secondary",
                },

                "&.active": {
                  bgcolor: "primary.main",
                  color: "primary.contrastText",

                  "& .MuiListItemIcon-root": {
                    color: "inherit",
                  },

                  "&:hover": {
                    bgcolor: "primary.dark",
                  },
                },
                  "&:hover": {
                    bgcolor: "action.hover",
                  },
                
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 38,
                  
                }}
              >
                {item.icon}
              </ListItemIcon>

              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontSize: 13,
                  fontWeight: 500,
                }}
              />
            </ListItemButton>
          ))}
        </List>

        <Box sx={{ flexGrow: 1 }} />

        <Divider />

        {/* Logout */}
        <List sx={{ px: 1.25, py: 1.5 }}>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              borderRadius: 1.5,
              color: "text.secondary",

              "&:hover": {
                bgcolor: "action.hover",
                color: "error.main",
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 38,
                color: "inherit",
              }}
            >
              <LogoutOutlined />
            </ListItemIcon>

            <ListItemText
              primary="Logout"
              primaryTypographyProps={{
                fontSize: 13,
              }}
            />
          </ListItemButton>
        </List>
      </Box>
    </Box>
  );
}