'use client';

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { GetDefaultDashboardId } from "@/server/components/dashboard-commands";

const Dashboard = () => {
  const router = useRouter();

  useEffect(() => {
    const fetchDefaultDashboardId = async () => {
      try {
        const id = await GetDefaultDashboardId();
        console.log('defaultdashboardid', id)

        router.push(`/dashboard/${id}`);
      } catch (error) {
        console.error("Failed to fetch default dashboard ID:", error);
      }
    };

    fetchDefaultDashboardId();
  }, []);

  return (
    <div className="p-4 h-full flex flex-col gap-4">
      <div className="h-1/2 w-full flex gap-4">
        <div className="w-full h-full bg-[#cdd4deac] animate-pulse"></div>
        <div className="w-full h-full bg-[#cdd4deac] animate-pulse"></div>
      </div>
      <div className="w-full h-1/2 bg-[#cdd4deac] animate-pulse"></div>
    </div>
  )
};

export default Dashboard;
