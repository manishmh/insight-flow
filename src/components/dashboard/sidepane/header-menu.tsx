import { GoSidebarExpand } from "react-icons/go";
import { HiDotsHorizontal } from "react-icons/hi";
import { ImRedo, ImUndo } from "react-icons/im";
import { useSidepane } from "@/contexts/sidepane-context";

const HeaderMenu = ({
  headerMenu,
  handleHeaderMenu,
}: {
  headerMenu: boolean;
  handleHeaderMenu: () => void;
}) => {
  const { handleSidepane } = useSidepane();
  return (
    <div className="flex justify-between items-center text-gray-500">
      <div className="flex items-center gap-4 text-[10px]">
        {/* <div className="cursor-pointer hover:bg-gray-300 p-1 rounded transition-colors duration-200">
          <ImUndo />
        </div>
        <div className="cursor-pointer hover:bg-gray-300 p-1 rounded transition-colors duration-200">
          <ImRedo />
        </div> */}
      </div>
      <div className="flex items-center gap-4">
        <div className="relative">
          <div
            className="cursor-pointer hover:bg-gray-300 p-1 rounded-md transition-colors duration-200"
            onClick={handleHeaderMenu}
          >
            <HiDotsHorizontal />
          </div>
          {headerMenu && (
            <div className="absolute bg-white border border-gray-300 rounded-md shadow w-[200px] h-[90px] right-0 top-6"></div>
          )}
        </div>
        <div
          className="rotate-180 cursor-pointer hover:bg-gray-300 p-1 rounded-md transition-colors duration-200 text-gray-600"
          onClick={handleSidepane}
        >
          <GoSidebarExpand />
        </div>
      </div>
    </div>
  );
};

export default HeaderMenu;
