import {
  Box,
  Button,
  Card,
  Typography,
} from "@mui/material";
import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export default function EmptyState({
  title,
  description,
  icon,
  action,
}: EmptyStateProps) {
  return (
    <Card
      sx={{
        p: 4,
        borderRadius: 2,
        border: 1,
        borderColor: "divider",
        boxShadow: "none",
        textAlign: "center",
      }}
    >
      {icon && (
        <Box
          sx={{
            width: 56,
            height: 56,
            mx: "auto",
            mb: 2,
            borderRadius: "50%",
            bgcolor: "action.hover",
            color: "text.secondary",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {icon}
        </Box>
      )}

      <Typography
        variant="h6"
        fontWeight={700}
      >
        {title}
      </Typography>

      {description && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            maxWidth: 500,
            mx: "auto",
            mt: 0.75,
          }}
        >
          {description}
        </Typography>
      )}

      {action && (
        <Box sx={{ mt: 2.5 }}>
          {action}
        </Box>
      )}
    </Card>
  );
}