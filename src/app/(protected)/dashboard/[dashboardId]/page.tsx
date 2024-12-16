"use client";

import AddFirstBlock from "@/components/dashboard/main-content/add-first-block";
import { CreateNewEmptyblock } from "@/server/components/block-functions";
import { GetDashboardData } from "@/server/components/dashboard-commands";
import React, { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

const DynamicDashboard = ({ params }: { params: any }) => {
  const dashboardId = params.dashboardId;
  const [dashboardData, setDashboardData] = useState();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(() => {
      try {
        const dashboardData = GetDashboardData(dashboardId);
      } catch (error) {
        toast.error("failed to fetch dashboard data! please relogin");
      }
    });
  });

  const handleEmptyBlock = () => {
    startTransition(async () => {
      try {
        const block = CreateNewEmptyblock(dashboardId);
        toast.success("Block added successfully");
      } catch (error) {
        toast.error("Failed to add block");
        console.error(error);
      }
    });
  };

  return (
    <div className="h-full">
      <AddFirstBlock
        dashboardId={dashboardId}
        handleEmptyBlock={handleEmptyBlock}
      />
    </div>
  );
};

export default DynamicDashboard;
