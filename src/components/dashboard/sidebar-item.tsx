import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleSidepane } from "@/store/slices/uiSlice";
import { FaTrash } from "react-icons/fa6";

const SidebarItem = ({
    logo,
    title,
    num,
    link,
    dashboardId,
    onDelete,
  }: {
    logo: ReactNode;
    title: string;
    num?: number;
    link?: string;
    dashboardId?: string;
    onDelete?: (dashboardId: string) => void;
  }) => {
    const router = useRouter();
    const pathname = usePathname();
    const dispatch = useAppDispatch();
    const { sidepane } = useAppSelector((state) => state.ui);
    const [contextMenuOpen, setContextMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const extractId = (url: string) => {
      const parts = url.split("/");
      return parts[parts.length - 1];
    };

    const activeId = extractId(pathname);

    const handleSidebarPush = () => {
      if (sidepane.open) {
        dispatch(toggleSidepane());
      }
      if (link) {
        router.push(link);
      }
    };

    const handleContextMenu = useCallback(
      (e: React.MouseEvent) => {
        e.preventDefault();
        if (dashboardId && onDelete) {
          setContextMenuOpen(true);
        }
      },
      [dashboardId, onDelete]
    );

    const handleDelete = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        if (dashboardId && onDelete) {
          onDelete(dashboardId);
          setContextMenuOpen(false);
        }
      },
      [dashboardId, onDelete]
    );

    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
          setContextMenuOpen(false);
        }
      };
      if (contextMenuOpen) {
        document.addEventListener("mousedown", handleClickOutside);
      }
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [contextMenuOpen]);

    const isActive = link === pathname || (link !== "/dashboard" && pathname.startsWith(link || ""));

    return (
      <div
        className={`relative flex justify-between items-center group transition-all duration-200 pr-1 ml-1 rounded-md cursor-pointer ${
          isActive 
            ? "bg-blue-50 text-blue-600 border-l-2 border-blue-500 rounded-l-none" 
            : "hover:bg-gray-100 text-gray-600"
        }`}
        onClick={handleSidebarPush}
        onContextMenu={handleContextMenu}
      >
        <div className={`flex gap-2 items-center px-2 py-1.5 rounded-md min-w-0 flex-1 ${isActive ? "font-medium text-blue-700" : ""}`}>
          <div className={`${isActive ? "text-blue-600" : "text-gray-500"}`}>
            {logo}
          </div>
          <span className="truncate">{title}</span>
        </div>
        {num && (
          <div className={`w-5 h-5 aspect-square border grid place-items-center rounded-md text-[10px] flex-shrink-0 ${
            isActive ? "border-blue-200 bg-blue-100 text-blue-600" : "border-gray-200 text-gray-400"
          }`}>
            {num}
          </div>
        )}
        {contextMenuOpen && dashboardId && onDelete && (
          <div
            ref={menuRef}
            className="absolute left-0 top-full mt-0.5 z-50 min-w-[120px] bg-gray-50 border border-gray-300 rounded-md shadow-md py-1"
          >
            <button
              type="button"
              onClick={handleDelete}
              className="w-full flex items-center gap-2 px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 rounded mx-1"
            >
              <FaTrash className="text-xs" />
              Delete
            </button>
          </div>
        )}
      </div>
    );
  };

  export default SidebarItem;
