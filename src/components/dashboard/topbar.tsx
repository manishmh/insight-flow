import { Dispatch, SetStateAction } from "react";
import { AiOutlineAppstoreAdd } from "react-icons/ai";
import { BsThreeDotsVertical } from "react-icons/bs";
import { GoSidebarExpand } from "react-icons/go";
import { LuLayoutDashboard } from "react-icons/lu";

const DashboardTopbar = ({
  setSidebarHover,
  handleSidebar,
  sidebarOpen,
}: {
  setSidebarHover: Dispatch<SetStateAction<boolean>>;
  handleSidebar: () => void;
  sidebarOpen: boolean;
}) => {
  return (
    <div className="flex justify-between items-center h-full">
      <div className="flex items-center gap-4 text-gray-600">
        {!sidebarOpen && (
          <div className="h-14 aspect-square grid place-items-center" 
            onClick={handleSidebar}
            onMouseEnter={() => setSidebarHover(true)}
            onMouseLeave={() => setSidebarHover(false)}
          >
            <GoSidebarExpand />
          </div>
        )}
        <div>
          <LuLayoutDashboard />
        </div>
        <div className="">Name</div>
      </div>
      <div className="text-gray-600 flex gap-4 items-center">
        <button className="flex items-center border border-gray-300 rounded-md px-2 py-1 gap-1">
          <AiOutlineAppstoreAdd /> Add block
        </button>
        <div className="">
          <BsThreeDotsVertical />
        </div>
      </div>
    </div>
  );
};

export default DashboardTopbar;