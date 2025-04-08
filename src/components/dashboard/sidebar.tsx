import {
  CreateNewDashboard,
  GetDashboards,
} from "@/server/components/dashboard-commands";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useRef, useState, useTransition } from "react";
import { BsArchive } from "react-icons/bs";
import { CgStudio } from "react-icons/cg";
import { FaChevronDown, FaPlus, FaRegHeart } from "react-icons/fa6";
import { GoSidebarExpand } from "react-icons/go";
import { HiOutlineSwitchVertical } from "react-icons/hi";
import { IoSearch, IoSettingsSharp } from "react-icons/io5";
import { LuCommand, LuLayoutDashboard } from "react-icons/lu";
import { MdQueryStats } from "react-icons/md";
import { PiPlugBold } from "react-icons/pi";
import { RotatingLines } from "react-loader-spinner";
import { toast } from "sonner";
import SidebarItem from "./sidebar-item";
import WorkspaceModal from "./workspace-modal";

const Sidebar = ({
  handleSidebar,
  handleSearchState,
}: {
  handleSidebar: () => void;
  handleSearchState: () => void;
}) => {
  const router = useRouter();
  const [dashboardState, setDashboardState] = useState(true);
  const [userDashboards, setUserDashboards] = useState<
    { id: string; name: string; userId: string; isDefault: boolean }[]
  >([]);
  const [isPending, startTransition] = useTransition();
  const [workspaceModal, setWorkspaceModal] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null)

  const handleWorkspaceToggle = () => {
    setWorkspaceModal((prev) => !prev);
  };

  useEffect(() => {
    const fetchDashboards = async () => {
      try {
        const dashboards = await GetDashboards();
        setUserDashboards(dashboards);
      } catch (error) {
        console.error("Failed to fetch dashboards:", error);
      }
    };

    fetchDashboards();
  }, []);

  const handleNewDashboard = () => {
    startTransition(async () => {
      try {
        const newDashboard = await CreateNewDashboard();

        if (newDashboard) {
          setUserDashboards((prev) => [...prev, newDashboard]);
          toast.success("New dashboard created!");
          router.push(`/dashboard/${newDashboard.id}`);
        } else {
          throw new Error("Dashboard creation failed");
        }
      } catch (error) {
        console.error("Error creating dashboard:", error);
        toast.error("Failed to create new dashboard! Try again later.");
      }
    });
  };

  const handleComingToast = () => {
    toast.info("Coming soon!");
  };

  return (
    <div className="h-full flex flex-col justify-between flex-1 pl-1 py-2 pt-3 ">
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
          onClick={handleSidebar}
          className="cursor-pointer hover:bg-gray-300 p-1 text-gray-600 rounded-sm transition-all duration-300"
        >
          <GoSidebarExpand />{" "}
        </div>
      </div>
      <div
        className="flex items-center py-1 ml-1 justify-between px-2 border border-gray-300 rounded-md my-4 select-none cursor-pointer"
        onClick={handleSearchState}
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
      <div className="flex flex-col gap-1 flex-1">
        {/* <div onClick={handleNewDashboard}>
          <SidebarItem logo={<FaPlus />} title="New" />
        </div> */}
        {/* <SidebarItem
          logo={<PiPlugBold />}
          title="Connections"
          num={1}
          link="/dashboard/connections"
        />
        <SidebarItem
          logo={<MdQueryStats />}
          title="Queries"
          num={2}
          link="/dashboard/queries"
        />
        <SidebarItem
          logo={<CgStudio />}
          title="Studio"
          link="/dashboard/studio"
        /> */}
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
          {userDashboards.length > 0 &&
            userDashboards.map((dashboard) => (
              <SidebarItem
                key={dashboard.id}
                logo={<LuLayoutDashboard />}
                title={dashboard.name}
                link={`/dashboard/${dashboard.id}`}
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
      <div
        className=" py-1 border-t xl:border-none border-gray-300 space-y-1"
        onClick={handleComingToast}
      >
        {/* <SidebarItem logo={<BsArchive />} title="Archive" />
        <SidebarItem logo={<IoSettingsSharp />} title="Settings" />
        <SidebarItem logo={<FaRegHeart />} title="Share feedback" /> */}
      </div>
    </div>
  );
};

export default Sidebar;
