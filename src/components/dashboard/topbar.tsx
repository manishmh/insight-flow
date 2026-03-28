import { createNewEmptyBlock } from "@/server/components/block-functions";
import { SetDashboardName } from "@/server/components/dashboard-commands";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  setCurrentDashboard,
  updateDashboardName,
} from "@/store/slices/dashboardSlice";
import { GetDashboardData } from "@/server/components/dashboard-commands";
import { useEffect, useState, useTransition } from "react";
import { AiOutlineAppstoreAdd } from "react-icons/ai";
import { BsThreeDotsVertical } from "react-icons/bs";
import { GoSidebarExpand } from "react-icons/go";
import { LuLayoutDashboard, LuSettings, LuUser } from "react-icons/lu";
import { RotatingLines } from "react-loader-spinner";
import { toast } from "sonner";
import { usePathname } from "next/navigation";
import {
  setSidebarHover,
  toggleSidebar,
} from "@/store/slices/uiSlice";

const DashboardTopbar = () => {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const { currentDashboard } = useAppSelector((state) => state.dashboard);
  const { sidebar } = useAppSelector((state) => state.ui);
  
  const isSettings = pathname === "/dashboard/settings";
  const isProfile = pathname === "/dashboard/profile";
  
  const [isPendingBlock, startTransitionBlock] = useTransition();
  const [editBlockname, setEditBlockname] = useState(false);
  const [newblockName, setNewBlockName] = useState("");

  useEffect(() => {
    if (currentDashboard?.name) {
      setNewBlockName(currentDashboard.name);
    }
  }, [currentDashboard?.name]);

  const handleEmptyBlock = () => {
    if (!currentDashboard) return;
    
    startTransitionBlock(async () => {
      try {
        const dashboardId = currentDashboard.id;
        const newBoard = await createNewEmptyBlock(dashboardId);
        const updatedDashboard = await GetDashboardData(dashboardId);
        if (updatedDashboard) {
          dispatch(setCurrentDashboard(updatedDashboard));
        }
        toast.success("Block added successfully");
      } catch (error) {
        toast.error("Failed to add block");
        console.error(error);
      }
    });
  };

  const handleRenameDashboard = async () => {
    if (!currentDashboard) return;
    
    if (newblockName.trim() && newblockName !== currentDashboard.name) {
      try {
        const dashboardId = currentDashboard.id;
        await SetDashboardName(dashboardId, newblockName.trim());
        dispatch(updateDashboardName({ id: dashboardId, name: newblockName.trim() }));
        const updatedDashboard = await GetDashboardData(dashboardId);
        if (updatedDashboard) {
          dispatch(setCurrentDashboard(updatedDashboard));
        }
        toast.success("Dashboard renamed successfully");
      } catch (error) {
        toast.error("Failed to rename dashboard");
        console.error(error);
      }
    }
    setEditBlockname(false);
  };

  // If we are on settings/profile, show a simplified topbar
  if (isSettings || isProfile) {
    return (
      <div className="flex justify-between items-center h-full px-4">
        <div className="flex items-center gap-3">
          {!sidebar.open && (
            <div
              className="h-10 w-10 grid place-items-center cursor-pointer hover:bg-gray-100 rounded-md transition-colors mr-2 text-gray-600"
              onClick={() => dispatch(toggleSidebar())}
            >
              <GoSidebarExpand />
            </div>
          )}
          <div className="flex items-center gap-2 text-gray-800 font-semibold text-lg">
            {isSettings ? <LuSettings className="text-blue-600" /> : <LuUser className="text-blue-600" />}
            {isSettings ? "Settings" : "Profile"}
          </div>
        </div>
      </div>
    );
  }

  if (!currentDashboard) {
    return (
      <div className="flex justify-between items-center h-full px-4 w-full">
        <div className="flex items-center gap-3">
          <div className="h-4 w-4 bg-gray-200 animate-pulse rounded-sm"></div>
          <div className="h-6 w-48 bg-gray-200 animate-pulse rounded-md"></div>
        </div>
        <div className="flex gap-4">
          <div className="h-8 w-24 bg-gray-200 animate-pulse rounded-md"></div>
          <div className="h-8 w-8 bg-gray-200 animate-pulse rounded-sm"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-between items-center h-full px-2">
      <div className="flex items-center text-gray-600">
        {!sidebar.open && (
          <div
            className="h-14 aspect-square grid place-items-center cursor-pointer"
            onClick={() => dispatch(toggleSidebar())}
            onMouseEnter={() => dispatch(setSidebarHover(true))}
            onMouseLeave={() => dispatch(setSidebarHover(false))}
          >
            <GoSidebarExpand />
          </div>
        )}
        <div className="flex items-center gap-3 px-2">
          <div className="text-blue-600">
            <LuLayoutDashboard />
          </div>

          {editBlockname ? (
            <div>
              <input
                type="text"
                className="bg-white border border-blue-400 text-gray-800 px-2 py-0.5 rounded outline-none shadow-sm"
                value={newblockName}
                autoFocus
                onChange={(e) => setNewBlockName(e.target.value)}
                onBlur={handleRenameDashboard} 
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleRenameDashboard(); 
                  }
                }}
              />
            </div>
          ) : (
            <div
              className="tour-dashboard-name cursor-pointer font-bold text-gray-800 hover:text-blue-600 transition-colors"
              onClick={() => setEditBlockname(true)}
            >
              {currentDashboard.name}
            </div>
          )}
        </div>
      </div>
      <div className="text-gray-600 flex gap-4 items-center pr-2">
        <button
          className="tour-add-block flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg px-3 py-1.5 gap-2 shadow-sm shadow-blue-200 transition-all duration-200 text-sm"
          onClick={handleEmptyBlock}
        >
          {isPendingBlock ? (
            <RotatingLines width="16" strokeColor="white" />
          ) : (
            <>
              <AiOutlineAppstoreAdd className="text-lg" /> Add block
            </>
          )}
        </button>
        <div className="hover:bg-gray-100 p-2 rounded-full cursor-pointer transition-colors">
          <BsThreeDotsVertical />
        </div>
      </div>
    </div>
  );
};

export default DashboardTopbar;
