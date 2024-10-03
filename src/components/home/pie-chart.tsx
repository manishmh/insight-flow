import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Box, Stack } from "@mui/material";

ChartJS.register(ArcElement, Tooltip, Legend);

const data = {
  datasets: [
    {
      label: "revenue by city",
      data: [100000, 50000, 25000, 15000],
      backgroundColor: [
        "#2a3a5e",
        "#1f2a3e",
        "#3f4e72",
        "#4a5d89",
      ],
      borderColor: [
        "#ffffff",
      ],
      borderWidth: 2,
    },
  ],
};

export default function DoughnutChart() {
  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      spacing={{ xs: 0, md: 4 }}
      sx={{ color: "#1f2a3e" }}
    >
      <Box sx={{ flexGrow: 1 }}>
        <Doughnut data={data} />
      </Box>
    </Stack>
  );
}
