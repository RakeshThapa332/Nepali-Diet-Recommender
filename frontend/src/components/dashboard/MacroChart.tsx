import { useTheme } from "@mui/material/styles";
import {
  Box,
  Card,
  Typography,
} from "@mui/material";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface MacroChartProps {
  protein: number;
  carbs: number;
  fat: number;
}

export default function MacroChart({
  protein,
  carbs,
  fat,
}: MacroChartProps) {
  const theme = useTheme();

  const data = [
    {
      name: "Protein",
      value: protein,
      color: theme.palette.primary.main,
    },
    {
      name: "Carbs",
      value: carbs,
      color: theme.palette.info.main,
    },
    {
      name: "Fat",
      value: fat,
      color: theme.palette.success.main,
    },
  ];

  const total = Number((protein + carbs + fat).toFixed(2));

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
        variant="subtitle2"
        sx={{ fontWeight: 700 }}
      >
        Macronutrient Split
      </Typography>

      <Box
        sx={{
          height: 220,
          position: "relative",
          mt: 1,
        }}
      >
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={55}
              outerRadius={82}
              paddingAngle={3}
              stroke="none"
            >
              {data.map((item) => (
                <Cell
                  key={item.name}
                  fill={item.color}
                />
              ))}
            </Pie>

            <Tooltip />
          </PieChart>
        </ResponsiveContainer>

        <Box
          sx={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {total.toFixed(2)}g
          </Typography>
          <Typography variant="caption" color="text.secondary">
            total
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-around",
          gap: 1,
        }}
      >
        <MacroValue
          label="Protein"
          value={protein}
          color={theme.palette.primary.main}
        />

        <MacroValue
          label="Carbs"
          value={carbs}
          color={theme.palette.info.main}
        />

        <MacroValue
          label="Fat"
          value={fat}
          color={theme.palette.success.main}
        />
      </Box>
    </Card>
  );
}

interface MacroValueProps {
  label: string;
  value: number;
  color: string;
}

function MacroValue({
  label,
  value,
  color,
}: MacroValueProps) {
  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.75,
        }}
      >
        <Box
          sx={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            bgcolor: color,
          }}
        />

        <Typography
          variant="caption"
          color="text.secondary"
        >
          {label}
        </Typography>
      </Box>

      <Typography
        variant="body2"
        sx={{ mt: 0.25, fontWeight: 700 }}
      >
        {value.toFixed(2)}g
      </Typography>
    </Box>
  );
}