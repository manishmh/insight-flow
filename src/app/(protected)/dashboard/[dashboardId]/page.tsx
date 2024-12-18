"use client";

import DashboardBoards from "@/components/dashboard/boards/dashboard-boards";
import AddFirstBlock from "@/components/dashboard/main-content/add-first-block";
import { useDashboardContext } from "@/contexts/dashboard-context";
import React, { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

const DynamicDashboard = ({ params }: { params: any }) => {
  const dashboardId = params.dashboardId;

  const [isPendingDashbaord, startTransitionDashboard] = useTransition();
  const { dashboardData, handleDashboardData } = useDashboardContext();
  console.log("dashboarddata", dashboardData);

  useEffect(() => {
    startTransitionDashboard(() => {
      try {
        handleDashboardData(dashboardId);
      } catch (error) {
        toast.error("Failed to fetch dashboard data! Please relogin");
      }
    });
  }, [dashboardId, handleDashboardData]);


  return (
    <div className="h-full">
      {dashboardData?.boards.length <= 0 ? (
        <AddFirstBlock
          dashboardId={dashboardId}
        /> 
      ) : (
        <DashboardBoards />
      )}
    </div>
  );
};

export default DynamicDashboard;
