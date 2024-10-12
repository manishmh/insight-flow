import { Box, Stack, Typography } from "@mui/material";
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import React from "react";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const data = {
  datasets: [
    {
      label: "revenue by city",
      data: [100000, 50000, 25000, 15000],
      backgroundColor: ["#2a3a5e", "#1f2a3e", "#3f4e72", "#4a5d89"],
      borderColor: ["#ffffff"],
      borderWidth: 2,
    },
  ],
};

export default function RevenueByCity() {
  return (
    <div className="flex items-center justify-center h-full rounded-md shadow-md">
      <Stack
        direction={{ xs: "column", md: "column" }}
        spacing={{ xs: 0, md: 0 }}
        sx={{ color: "#1f2a3e" }}
        className="flex flex-col items-center py-4 justify-center"
      >
        <div className="hidden md:flex items-center px-2 flex-col md:flex-row gap-4">
          <div className="flex items-center justify-center gap-3 pt-2">
            <div className="w-3 h-3 bg-[#2a3a5e] bg-opacity-70"></div>
            <h1 className="text-gray-600">New York</h1>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            <div className="w-3 h-3 bg-[#1f2a3e] bg-opacity-70"></div>
            <h1 className="text-gray-600">Los Angeles</h1>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            <div className="w-3 h-3 bg-[#3f4e72] bg-opacity-70"></div>
            <h1 className="text-gray-600">Chicago</h1>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            <div className="w-3 h-3 bg-[#4a5d89] bg-opacity-70"></div>
            <h1 className="text-gray-600">Houstan</h1>
          </div>
        </div>

        <Box sx={{ flexGrow: 1 }}>
          <Doughnut data={data} />
        </Box>
      </Stack>
    </div>
  );
}
