import {
  CreateNewDashboard,
  DeleteDashboard,
  GetDashboards,
} from "@/server/components/dashboard-commands";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  setDashboards,
  addDashboard,
  removeDashboard,
} from "@/store/slices/dashboardSlice";
import { toggleSidebar, toggleSearch } from "@/store/slices/uiSlice";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { FaChevronDown, FaPlus } from "react-icons/fa6";
import { GoSidebarExpand } from "react-icons/go";
import { HiOutlineSwitchVertical } from "react-icons/hi";
import { IoSearch} from "react-icons/io5";
import { LuCommand, LuLayoutDashboard, LuDatabase } from "react-icons/lu";
import { RotatingLines } from "react-loader-spinner";
import { toast } from "sonner";
import SidebarItem from "./sidebar-item";

import WorkspaceModal from "./workspace-modal";
import NewDashboardModal from "./new-dashboard-modal";

const Sidebar = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { dashboards, currentDashboard } = useAppSelector((state) => state.dashboard);
  const [dashboardState, setDashboardState] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [workspaceModal, setWorkspaceModal] = useState(false);
  const [newDashboardModal, setNewDashboardModal] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const newDashboardButtonRef = useRef<HTMLButtonElement>(null);

  const handleWorkspaceToggle = () => {
    setWorkspaceModal((prev) => !prev);
  };

  useEffect(() => {
    if (dashboards.length > 0) return;

    const fetchDashboards = async () => {
      try {
        const fetchedDashboards = await GetDashboards();
        dispatch(setDashboards(fetchedDashboards));
      } catch (error) {
        console.error("Failed to fetch dashboards:", error);
      }
    };

    fetchDashboards();
  }, [dispatch, dashboards.length]);

  const handleNewDashboardClick = () => {
    setNewDashboardModal(true);
  };

  const handleCreateDashboard = async (name: string) => {
    return new Promise<void>((resolve, reject) => {
      startTransition(async () => {
        try {
          const newDashboard = await CreateNewDashboard(name);

          if (newDashboard) {
            dispatch(addDashboard(newDashboard));
            toast.success("New dashboard created!");
            router.push(`/dashboard/${newDashboard.id}`);
            resolve();
          } else {
            throw new Error("Dashboard creation failed");
          }
        } catch (error) {
          console.error("Error creating dashboard:", error);
          toast.error("Failed to create new dashboard! Try again later.");
          reject(error);
        }
      });
    });
  };

  const handleComingToast = () => {
    toast.info("Coming soon!");
  };

  const handleDeleteDashboard = async (dashboardId: string) => {
    try {
      const deleted = await DeleteDashboard(dashboardId);
      if (deleted) {
        dispatch(removeDashboard(dashboardId));
        toast.success("Dashboard deleted.");
        const remaining = dashboards.filter((d) => d.id !== dashboardId);
        if (currentDashboard?.id === dashboardId) {
          const first = remaining[0];
          if (first) {
            router.push(`/dashboard/${first.id}`);
          } else {
            router.push("/dashboard");
          }
        }
      } else {
        toast.error("Failed to delete dashboard.");
      }
    } catch (error) {
      console.error("Error deleting dashboard:", error);
      toast.error("Failed to delete dashboard.");
    }
  };

  return (
    <div className="tour-sidebar h-full flex flex-col justify-between flex-1 pl-1 py-2 pt-3 ">
      <div className="flex justify-between items-center gap-2 w-full pl-1">
        <div
          className="flex items-center gap-1 hover:bg-[#d1d5dbac] px-1 py-1 rounded-sm w-full transition-all duration-300 cursor-pointer relative"
          onClick={handleWorkspaceToggle}
          ref={wrapperRef}
        >
          {workspaceModal && (
            <WorkspaceModal handleWorkspaceClose={handleWorkspaceToggle} wrapperRef={wrapperRef}/>
          )}
          <div className="bg-blue-200 rounded-sm aspect-square w-6 grid place-items-center">
            T
          </div>
          <span className="font-semibold">Workspace</span>
          <span className="text-gray-600">
            <HiOutlineSwitchVertical />{" "}
          </span>
        </div>
        <div
          onClick={() => dispatch(toggleSidebar())}
          className="cursor-pointer hover:bg-gray-300 p-1 text-gray-600 rounded-sm transition-all duration-300"
        >
          <GoSidebarExpand />{" "}
        </div>
      </div>
      <div
        className="flex items-center py-1 ml-1 justify-between px-2 border border-gray-300 rounded-md my-4 select-none cursor-pointer"
        onClick={() => dispatch(toggleSearch())}
      >
        <div className="flex items-center gap-2">
          <IoSearch className="text-gray-500" />
          <div className="text-gray-500">Search...</div>
        </div>
        <div className="flex items-center gap-2 text-gray-500">
          <div className="border border-gray-300 rounded-sm p-1 h-6 bg-gray-300">
            <LuCommand />
          </div>
          <div className="border border-gray-300 rounded-sm w-6 grid place-items-center h-6 bg-gray-300">
            K
          </div>
        </div>
      </div>
      <div className="px-3 py-2 border-b border-gray-200 mb-2">
        <SidebarItem
          logo={<LuDatabase />}
          title="New Connection"
          link="/dashboard/data-sources"
        />
      </div>
      <div className="flex flex-col gap-1 flex-1">
        <div
          className={`mt-4 flex px-3 gap-2 items-center text-gray-600 cursor-pointer`}
          onClick={() => setDashboardState(!dashboardState)}
        >
          <span
            className={`transition-all duration-300 ${
              !dashboardState && "-rotate-90"
            }`}
          >
            <FaChevronDown />
          </span>
          <span>Dashboard</span>
        </div>
      </div>
      {dashboardState && (
        <div className="h-full overflow-scroll scrollbar-none py-2 space-y-1">
          <div className="relative">
            <button
              ref={newDashboardButtonRef}
              onClick={handleNewDashboardClick}
              className="w-full flex items-center gap-2 px-3 py-1.5 text-gray-600 hover:bg-[#d1d5dbac] rounded-md transition-colors duration-200 text-sm font-medium"
            >
              <FaPlus className="text-xs" />
              New Dashboard
            </button>
            <NewDashboardModal
              isOpen={newDashboardModal}
              onClose={() => setNewDashboardModal(false)}
              onCreate={handleCreateDashboard}
              buttonRef={newDashboardButtonRef}
              isPending={isPending}
            />
          </div>
          {dashboards.length > 0 &&
            dashboards.map((dashboard) => (
              <SidebarItem
                key={dashboard.id}
                logo={<LuLayoutDashboard />}
                title={dashboard.name}
                link={`/dashboard/${dashboard.id}`}
                dashboardId={dashboard.id}
                onDelete={handleDeleteDashboard}
              />
            ))}

          {isPending && (
            <div className="flex gap-2 items-center opacity-40 pl-3 bg-[#d1d5dbac] py-1 rounded-md">
              <RotatingLines width="15" strokeColor="black" />
              creating dashboard...
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Sidebar;
