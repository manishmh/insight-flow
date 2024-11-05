import Link from "next/link";
import { ReactNode, useState } from "react";
import { BsArchive } from "react-icons/bs";
import { CgStudio } from "react-icons/cg";
import { FaChevronDown, FaPlus, FaRegHeart } from "react-icons/fa6";
import { GoSidebarExpand } from "react-icons/go";
import { HiOutlineSwitchVertical } from "react-icons/hi";
import { IoSearch, IoSettingsSharp } from "react-icons/io5";
import { LuCommand, LuLayoutDashboard } from "react-icons/lu";
import { MdQueryStats } from "react-icons/md";
import { PiPlugBold } from "react-icons/pi";

const Sidebar = ({
  handleSidebar,
  handleSearchState,
}: {
  handleSidebar: () => void;
  handleSearchState: () => void;
}) => {
  const [dashboard, setDashboard] = useState(true);
  return (
    <div className="h-full flex flex-col justify-between flex-1 pl-1 py-2 pt-3 ">
      <div className="flex justify-between items-center gap-2 w-full pl-1">
        <div className="flex items-center gap-1 hover:bg-[#d1d5dbac] px-1 py-1 rounded-sm w-full transition-all duration-300 cursor-pointer">
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
      <div
        className="flex flex-col gap-1 flex-1"
        onClick={() => setDashboard(!dashboard)}
      >
        <SidebarItem logo={<FaPlus />} title="New" link="/dashboard/new" />
        <SidebarItem
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
        />
        <div
          className={`mt-4 flex px-3 gap-2 items-center text-gray-600 cursor-pointer`}
          onClick={() => setDashboard(!dashboard)}
        >
          <span
            className={`transition-all duration-300 ${
              !dashboard && "-rotate-90"
            }`}
          >
            <FaChevronDown />
          </span>
          <span>Dashboard</span>
        </div>
      </div>
      {dashboard && (
        <div className="h-full overflow-scroll scrollbar-none py-2">
          <SidebarItem
            logo={<LuLayoutDashboard />}
            title="Sample Board"
            link="/dashboard/new"
          />
          <SidebarItem
            logo={<LuLayoutDashboard />}
            title="Test"
            link="/dashboard/new"
          />
          <SidebarItem
            logo={<LuLayoutDashboard />}
            title="Untitled Board"
            link="/dashboard/new"
          />
          <SidebarItem
            logo={<LuLayoutDashboard />}
            title="Untitled Board"
            link="/dashboard/new"
          />
          <SidebarItem
            logo={<LuLayoutDashboard />}
            title="Untitled Board"
            link="/dashboard/new"
          />
          <SidebarItem
            logo={<LuLayoutDashboard />}
            title="Untitled Board"
            link="/dashboard/new"
          />
        </div>
      )}
      <div className=" py-1 border-t xl:border-none border-gray-300">
        <SidebarItem
          logo={<BsArchive />}
          title="Archive"
          link="/dashboard/new"
        />
        <SidebarItem
          logo={<IoSettingsSharp />}
          title="Settings"
          link="/dashboard/new"
        />
        <SidebarItem
          logo={<FaRegHeart />}
          title="Share feedback"
          link="/dashboard/new"
        />
      </div>
    </div>
  );
};

export default Sidebar;

const SidebarItem = ({
  logo,
  title,
  num,
  link,
}: {
  logo: ReactNode;
  title: string;
  num?: number;
  link: string;
}) => {
  return (
    <Link href={link}>
      <div className="flex justify-between items-center group hover:bg-[#d1d5dbac] transition-all duration-300 pr-1 ml-1 rounded-md">
        <div className="flex gap-2 items-center text-gray-600 text  px-2 py-1 rounded-md ">
          {logo}
          {title}
        </div>
        {num && (
          <div className="w-5 h-5 aspect-square border border-gray-300 group-hover:border-gray-400 grid place-items-center rounded-md text-gray-500 ">
            {num}
          </div>
        )}
      </div>
    </Link>
  );
};
