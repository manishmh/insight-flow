"use client";

import DashboardBoards from "@/components/dashboard/boards/dashboard-boards";
import AddFirstBlock from "@/components/dashboard/main-content/add-first-block";
import { useDashboardContext } from "@/contexts/dashboard-context";
import React, { useEffect, useTransition } from "react";
import { toast } from "sonner";

const DynamicDashboard = ({ params }: { params: any }) => {
  const dashboardId = params.dashboardId;

  const [isPendingDashbaord, startTransitionDashboard] = useTransition();
  const { dashboardData, handleDashboardData } = useDashboardContext();

  useEffect(() => {
    startTransitionDashboard(() => {
      try {
        handleDashboardData(dashboardId);
      } catch (error) {
        toast.error("Failed to fetch dashboard data! Please relogin");
      }
    });
  }, [dashboardId, handleDashboardData]);

  if (!dashboardData) return <div>Loading...</div>

  return (
    <div className="h-full p-4">
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
