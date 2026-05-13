"use client";

import DashboardBoards from "@/components/dashboard/boards/dashboard-boards";
import AddFirstBlock from "@/components/dashboard/main-content/add-first-block";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setCurrentDashboard, setLoading, setError } from "@/store/slices/dashboardSlice";
import { GetDashboardData, GetDefaultDashboardId } from "@/server/components/dashboard-commands";
import { useRouter } from "next/navigation";
import React, { useEffect, useTransition } from "react";
import { toast } from "sonner";

const DynamicDashboard = ({ params }: { params: any }) => {
  const dashboardId = params.dashboardId;
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { currentDashboard, isLoading } = useAppSelector((state) => state.dashboard);

  useEffect(() => {
    if (!dashboardId || dashboardId === "undefined") return;

    let isMounted = true;

    const loadDashboard = async () => {
      try {
        dispatch(setLoading(true));
        dispatch(setError(null));
        const dashboardData = await GetDashboardData(dashboardId);
        if (!isMounted) return;

        if (dashboardData) {
          dispatch(setCurrentDashboard(dashboardData));
        } else {
          dispatch(setError("Dashboard not found"));
          const fallbackDashboardId = await GetDefaultDashboardId();

          if (!isMounted) return;
          if (fallbackDashboardId && fallbackDashboardId !== dashboardId) {
            router.replace(`/dashboard/${fallbackDashboardId}`);
          } else {
            toast.error("Dashboard not found. Please check the URL.");
          }
        }
      } catch (error) {
        if (!isMounted) return;
        dispatch(setError("Failed to fetch dashboard"));
        toast.error("Failed to load dashboard. Please try again.");
      } finally {
        if (isMounted) {
          dispatch(setLoading(false));
        }
      }
    };

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, [dashboardId, dispatch, router]);

  if (isLoading || !currentDashboard) {
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
