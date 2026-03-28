import { createNewEmptyBlock } from "@/server/components/block-functions";
import { SetDashboardName } from "@/server/components/dashboard-commands";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  setCurrentDashboard,
  updateDashboardName,
  updateDashboardBoards,
} from "@/store/slices/dashboardSlice";
import { GetDashboardData } from "@/server/components/dashboard-commands";
import { useEffect, useState, useTransition } from "react";
import { AiOutlineAppstoreAdd } from "react-icons/ai";
import { BsThreeDotsVertical } from "react-icons/bs";
import { GoSidebarExpand } from "react-icons/go";
import { LuLayoutDashboard } from "react-icons/lu";
import { RotatingLines } from "react-loader-spinner";
import { toast } from "sonner";
import {
  setSidebarHover,
  toggleSidebar,
} from "@/store/slices/uiSlice";

const DashboardTopbar = () => {
  const dispatch = useAppDispatch();
  const { currentDashboard } = useAppSelector((state) => state.dashboard);
  const { sidebar } = useAppSelector((state) => state.ui);
  const [isPendingBlock, startTransitionBlock] = useTransition();
  const [editBlockname, setEditBlockname] = useState(false);
  const [newblockName, setNewBlockName] = useState(
    currentDashboard?.name || ""
  );

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
        
        // Refresh dashboard data
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
        
        // Update Redux state
        dispatch(updateDashboardName({ id: dashboardId, name: newblockName.trim() }));
        
        // Refresh dashboard data to get latest boards
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
        <div className="flex items-center gap-3">
          <div>
            <LuLayoutDashboard />
          </div>

          {editBlockname ? (
            <div>
              <input
                type="text"
                className="bg-transparent border border-gray-400 text-black px-1"
                value={newblockName}
                autoFocus={editBlockname}
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
              className="tour-dashboard-name cursor-pointer"
              onClick={() => setEditBlockname(!editBlockname)}
            >
              {currentDashboard.name}
            </div>
          )}
        </div>
      </div>
      <div className="text-gray-600 hover:text-gray-800 transition-colors duration-300 flex gap-4 items-center">
        <button
          className="tour-add-block flex items-center border border-gray-300 rounded-md px-2 py-1 gap-1"
          onClick={handleEmptyBlock}
        >
          {isPendingBlock ? (
            <RotatingLines width="15" strokeColor="black" />
          ) : (
            <>
              <AiOutlineAppstoreAdd /> Add block
            </>
          )}
        </button>
        <div className="hover:bg-gray-300 p-1 rounded-sm">
          <BsThreeDotsVertical />
        </div>
      </div>
    </div>
  );
};

export default DashboardTopbar;
