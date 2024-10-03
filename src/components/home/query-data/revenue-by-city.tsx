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
        <Box sx={{ textAlign: "center", marginBottom: 0 }} className="mt-2">
          <Stack direction="row" justifyContent="center" spacing={4}>
            <Box display="flex" alignItems="center">
              <Box
                sx={{
                  width: 16,
                  height: 16,
                  backgroundColor: "#2a3a5e",
                  marginRight: 1,
                }}
              />
              <Typography variant="body1">New York</Typography>
            </Box>
            <Box display="flex" alignItems="center">
              <Box
                sx={{
                  width: 16,
                  height: 16,
                  backgroundColor: "#1f2a3e",
                  marginRight: 1,
                }}
              />
              <Typography variant="body1">Los Angeles</Typography>
            </Box>
            <Box display="flex" alignItems="center">
              <Box
                sx={{
                  width: 16,
                  height: 16,
                  backgroundColor: "#3f4e72",
                  marginRight: 1,
                }}
              />
              <Typography variant="body1">Chicago</Typography>
            </Box>
            <Box display="flex" alignItems="center">
              <Box
                sx={{
                  width: 16,
                  height: 16,
                  backgroundColor: "#4a5d89",
                  marginRight: 1,
                }}
              />
              <Typography variant="body1">Houston</Typography>
            </Box>
          </Stack>
        </Box>

        <Box sx={{ flexGrow: 1 }}>
          <Doughnut data={data} />
        </Box>
      </Stack>
    </div>
  );
}
