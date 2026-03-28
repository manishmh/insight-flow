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
import { LuCommand, LuLayoutDashboard, LuDatabase, LuSettings, LuUser } from "react-icons/lu";
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
    <div className="tour-sidebar h-full flex flex-col justify-between flex-1 pl-1 py-2 pt-3 bg-[#f8fafc]">
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex justify-between items-center gap-2 w-full pl-1 mb-2">
          <div
            className="flex items-center gap-2 hover:bg-gray-200/50 px-2 py-1.5 rounded-md w-full transition-all duration-300 cursor-pointer relative group"
            onClick={handleWorkspaceToggle}
            ref={wrapperRef}
          >
            {workspaceModal && (
              <WorkspaceModal handleWorkspaceClose={handleWorkspaceToggle} wrapperRef={wrapperRef}/>
            )}
            <div className="bg-blue-600 text-white rounded-md aspect-square w-7 shadow-sm grid place-items-center font-bold text-xs">
              T
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-gray-800 text-sm">Workspace</span>
              <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Free Plan</span>
            </div>
            <span className="text-gray-400 ml-auto group-hover:text-gray-600">
              <HiOutlineSwitchVertical />
            </span>
          </div>
          <div
            onClick={() => dispatch(toggleSidebar())}
            className="cursor-pointer hover:bg-gray-200 p-1.5 text-gray-500 rounded-md transition-all duration-300 mr-1"
          >
            <GoSidebarExpand />
          </div>
        </div>

        <div
          className="flex items-center py-2 ml-1 justify-between px-3 border border-gray-200 bg-white shadow-sm rounded-lg my-3 select-none cursor-pointer hover:border-blue-300 transition-colors duration-200"
          onClick={() => dispatch(toggleSearch())}
        >
          <div className="flex items-center gap-2">
            <IoSearch className="text-gray-400" />
            <div className="text-gray-400 text-sm font-medium">Search...</div>
          </div>
          <div className="flex items-center gap-1.5 text-gray-400">
            <div className="border border-gray-100 rounded-md px-1.5 py-0.5 text-[10px] font-bold bg-gray-50">
              ⌘
            </div>
            <div className="border border-gray-100 rounded-md px-1.5 py-0.5 text-[10px] font-bold bg-gray-50">
              K
            </div>
          </div>
        </div>

        <div className="px-1 py-1 mb-2">
          <SidebarItem
            logo={<LuDatabase />}
            title="Data Sources"
            link="/dashboard/data-sources"
          />
        </div>

        <div className="flex-1 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-200">
          <div
            className={`mt-2 flex px-3 gap-2 items-center text-gray-500 uppercase text-[10px] font-bold tracking-widest cursor-pointer hover:text-gray-700 transition-colors`}
            onClick={() => setDashboardState(!dashboardState)}
          >
            <span
              className={`transition-transform duration-200 ${
                !dashboardState && "-rotate-90"
              }`}
            >
              <FaChevronDown />
            </span>
            <span>Dashboards</span>
          </div>

          {dashboardState && (
            <div className="mt-2 space-y-0.5">
              <div className="relative mb-1">
                <button
                  ref={newDashboardButtonRef}
                  onClick={handleNewDashboardClick}
                  className="w-full flex items-center gap-2 px-3 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 rounded-md transition-all duration-200 text-sm font-medium group"
                >
                  <div className="bg-gray-100 group-hover:bg-blue-100 group-hover:text-blue-600 p-1 rounded transition-colors">
                    <FaPlus className="text-[10px]" />
                  </div>
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
                <div className="flex gap-2 items-center opacity-40 pl-3 bg-gray-50 py-2 rounded-md mx-1 border border-dashed border-gray-300">
                  <RotatingLines width="12" strokeColor="blue" />
                  <span className="text-[10px] font-medium italic">Creating...</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mt-auto border-t border-gray-100 pt-2 px-1 pb-1 space-y-0.5">
        <SidebarItem
          logo={<LuSettings />}
          title="Settings"
          link="/dashboard/settings"
        />
        <SidebarItem
          logo={<LuUser />}
          title="Profile"
          link="/dashboard/profile"
        />
      </div>
    </div>
  );
};

export default Sidebar;
