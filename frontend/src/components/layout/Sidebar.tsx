import {
  DashboardOutlined,
  RestaurantMenuOutlined,
  HistoryOutlined,
  TrendingUpOutlined,
  SettingsOutlined,
  PersonOutlined,
  LogoutOutlined,
  MenuBookOutlined,
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

interface SidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  {
    label: "Dashboard",
    icon: <DashboardOutlined />,
    active: true,
  },
  {
    label: "My Meal Plan",
    icon: <RestaurantMenuOutlined />,
  },
  {
    label: "Food Explorer",
    icon: <MenuBookOutlined />,
  },
  {
    label: "Logs / History",
    icon: <HistoryOutlined />,
  },
  {
    label: "Progress",
    icon: <TrendingUpOutlined />,
  },
  {
    label: "Profile",
    icon: <PersonOutlined />,
  },
  {
    label: "Settings",
    icon: <SettingsOutlined />,
  },
];

const drawerWidth = 240;

export default function Sidebar({
  mobileOpen,
  onClose,
}: SidebarProps) {
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
              key={item.label}
              selected={item.active}
              onClick={onClose}
              sx={{
                mb: 0.5,
                minHeight: 44,
                borderRadius: 1.5,
                "&.Mui-selected": {
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  "& .MuiListItemIcon-root": {
                    color: "inherit",
                  },
                  "&:hover": {
                    bgcolor: "primary.dark",
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 38,
                  color: "text.secondary",
                }}
              >
                {item.icon}
              </ListItemIcon>

              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontSize: 13,
                  fontWeight: item.active ? 600 : 400,
                }}
              />
            </ListItemButton>
          ))}
        </List>

        <Box sx={{ flexGrow: 1 }} />

        <Divider />

        <List sx={{ px: 1.25, py: 1.5 }}>
          <ListItemButton
            sx={{
              borderRadius: 1.5,
              color: "text.secondary",
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