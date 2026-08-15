import { Box, Card, Typography } from "@mui/material";

interface StatisticsCardProps {
  label: string;
  value: string | number;
  unit?: string;
  subtitle?: string;
}

export default function StatisticsCard({
  label,
  value,
  unit,
  subtitle,
}: StatisticsCardProps) {
  return (
    <Card
      sx={{
        height: "100%",
        p: 2,
        borderRadius: 2,
        border: 1,
        borderColor: "divider",
        boxShadow: "none",
      }}
    >
      <Typography
        variant="caption"
        color="text.secondary"
        fontWeight={500}
      >
        {label}
      </Typography>

      <Box
        sx={{
          display: "flex",
          alignItems: "baseline",
          gap: 0.75,
          mt: 0.75,
        }}
      >
        <Typography
          variant="h5"
          fontWeight={700}
          color="primary.main"
        >
          {value}
        </Typography>

        {unit && (
          <Typography
            variant="caption"
            color="text.secondary"
          >
            {unit}
          </Typography>
        )}
      </Box>

      {subtitle && (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            display: "block",
            mt: 0.5,
          }}
        >
          {subtitle}
        </Typography>
      )}
    </Card>
  );
}