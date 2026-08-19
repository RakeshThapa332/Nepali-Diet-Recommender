import { Box, Typography } from "@mui/material";
import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export default function PageHeader({
  title,
  subtitle,
  action,
}: PageHeaderProps) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: {
          xs: "flex-start",
          sm: "center",
        },
        justifyContent: "space-between",
        gap: 2,
        mb: 3,
        flexDirection: {
          xs: "column",
          sm: "row",
        },
      }}
    >
      <Box>
        <Typography
          variant="h5"
          sx={{
            lineHeight: 1.2,
            fontWeight:700
          }}
        >
          {title}
        </Typography>

        {subtitle && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mt: 0.5,
            }}
          >
            {subtitle}
          </Typography>
        )}
      </Box>

      {action && (
        <Box
          sx={{
            flexShrink: 0,
            width: {
              xs: "100%",
              sm: "auto",
            },
          }}
        >
          {action}
        </Box>
      )}
    </Box>
  );
}