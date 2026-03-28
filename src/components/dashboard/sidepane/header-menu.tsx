import { GoSidebarExpand } from "react-icons/go";
import { HiDotsHorizontal } from "react-icons/hi";
import { ImRedo, ImUndo } from "react-icons/im";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleSidepane } from "@/store/slices/uiSlice";
import { useTableContext } from "@/contexts/sidepane-localhost-storage-context";

const HeaderMenu = ({
  headerMenu,
  handleHeaderMenu,
}: {
  headerMenu: boolean;
  handleHeaderMenu: () => void;
}) => {
  const dispatch = useAppDispatch();
  const { activeBoard } = useAppSelector((state) => state.board);
  const { undo, redo, canUndo, canRedo } = useTableContext();

  const dataId = activeBoard?.id;
  const isUndoEnabled = dataId ? canUndo(dataId) : false;
  const isRedoEnabled = dataId ? canRedo(dataId) : false;

  return (
    <div className="flex justify-between items-center text-gray-500">
      <div className="flex items-center gap-4 text-[10px]">
        <button
          className={`p-1 rounded transition-colors duration-200 ${
            isUndoEnabled
              ? "cursor-pointer hover:bg-gray-300 text-gray-700"
              : "cursor-not-allowed text-gray-300"
          }`}
          onClick={() => {
            if (isUndoEnabled && dataId) undo(dataId);
          }}
          disabled={!isUndoEnabled}
          title="Undo"
        >
          <ImUndo />
        </button>
        <button
          className={`p-1 rounded transition-colors duration-200 ${
            isRedoEnabled
              ? "cursor-pointer hover:bg-gray-300 text-gray-700"
              : "cursor-not-allowed text-gray-300"
          }`}
          onClick={() => {
            if (isRedoEnabled && dataId) redo(dataId);
          }}
          disabled={!isRedoEnabled}
          title="Redo"
        >
          <ImRedo />
        </button>
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
          onClick={() => dispatch(toggleSidepane())}
        >
          <GoSidebarExpand />
        </div>
      </div>
    </div>
  );
};

export default HeaderMenu;
