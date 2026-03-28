"use client";

import DashboardBoards from "@/components/dashboard/boards/dashboard-boards";
import AddFirstBlock from "@/components/dashboard/main-content/add-first-block";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setCurrentDashboard, setLoading, setError } from "@/store/slices/dashboardSlice";
import { GetDashboardData } from "@/server/components/dashboard-commands";
import React, { useEffect, useTransition } from "react";
import { toast } from "sonner";

const DynamicDashboard = ({ params }: { params: any }) => {
  const dashboardId = params.dashboardId;
  const dispatch = useAppDispatch();
  const { currentDashboard, isLoading } = useAppSelector((state) => state.dashboard);
  const [isPendingDashboard, startTransitionDashboard] = useTransition();

  useEffect(() => {
    if (!dashboardId || dashboardId === "undefined") return;

    startTransitionDashboard(async () => {
      try {
        dispatch(setLoading(true));
        dispatch(setError(null));
        const dashboardData = await GetDashboardData(dashboardId);
        if (dashboardData) {
          dispatch(setCurrentDashboard(dashboardData));
        } else {
          dispatch(setError("Dashboard not found"));
          toast.error("Dashboard not found. Please check the URL.");
        }
      } catch (error) {
        dispatch(setError("Failed to fetch dashboard"));
        toast.error("Failed to load dashboard. Please try again.");
      } finally {
        dispatch(setLoading(false));
      }
    });
  }, [dashboardId, dispatch]);

  if (isLoading || isPendingDashboard || !currentDashboard) {
    return (
      <div className="h-full p-6 w-full flex flex-col gap-6">
        <div className="flex gap-4">
           <div className="h-24 bg-gray-200 animate-pulse rounded-md flex-1"></div>
           <div className="h-24 bg-gray-200 animate-pulse rounded-md flex-1"></div>
           <div className="h-24 bg-gray-200 animate-pulse rounded-md flex-1"></div>
        </div>
        <div className="flex-1 bg-gray-200 animate-pulse rounded-md w-full"></div>
      </div>
    );
  }

  return (
    <div className="h-full p-4">
      {currentDashboard?.boards.length <= 0 ? (
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
