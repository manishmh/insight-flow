"use client";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "@/components/dashboard/sidebar";
import Sidepane from "@/components/dashboard/sidepane/sidepane";
import DashboardTopbar from "@/components/dashboard/topbar";
import GuestToast from "@/components/dashboard/guest-toast";
import TourGuide from "@/components/dashboard/tour-guide";
import { BoardDataProvider } from "@/contexts/board-context";
import { TableProvider } from "@/contexts/sidepane-localhost-storage-context";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { usePathname } from "next/navigation";
import {
  setSidebarOpen,
  setSidebarWidth,
  setSidebarHover,
  setSidepaneOpen,
  setSearchOpen,
  toggleSidebar,
  toggleSidepane,
  toggleSearch,
} from "@/store/slices/uiSlice";
import { ReactNode, useCallback, useEffect, useState } from "react";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const { sidebar, sidepane, search } = useAppSelector((state) => state.ui);
  const [isResizing, setIsResizing] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const currentWidth = window.innerWidth;
      dispatch(setSidebarOpen(currentWidth > 768));
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [dispatch]);

  const handleSidebar = () => {
    dispatch(toggleSidebar());
  };

  const handleSidepane = () => {
    dispatch(toggleSidepane());
  };

  const handleSearchState = () => {
    dispatch(toggleSearch());
  };

  const handleMouseDown = () => {
    setIsResizing(true);
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isResizing) {
        const newWidth = e.clientX;
        if (newWidth > 200 && newWidth < 360) {
          dispatch(setSidebarWidth(newWidth));
        }
      }
    },
    [isResizing, dispatch]
  );

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  useEffect(() => {
    if (isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  return (
    <BoardDataProvider>
      <TableProvider>
        <GuestToast />
        <TourGuide />
        <div className="flex text-sm md:text-xs 3xl:text-sm overflow-hidden bg-white">
          {search.open && (
                  <>
                    <div
                      className="absolute z-[49] w-full h-screen"
                      onClick={() => dispatch(toggleSearch())}
                    ></div>
                    <div className="absolute z-50 bg-white w-full max-w-[600px] h-[400px] rounded-lg top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2">
                      <div className="text-lg text-gray-600 w-full h-full grid place-items-center">
                        coming soon...
                      </div>
                    </div>
                  </>
                )}

                {/* Sidebar */}
                <div
                  className={`bg-[#f8fafc] z-10 transition-all shadow-sm border-r border-gray-200 duration-300 max-h-screen fixed left-0 flex justify-between
          rounded-tr-md rounded-br-md ${
            sidebar.hover ? "translate-x-0" : "-translate-x-full"
          } ${
                    sidebar.open
                      ? "translate-x-0 top-14 md:top-0 h-screen"
                      : "-translate-x-full top-14 bottom-2"
                  } ${
                    isResizing ? "pointer-events-none" : "pointer-events-auto"
                  }`}
                  style={{ width: sidebar.width }}
                  onMouseEnter={() => dispatch(setSidebarHover(true))}
                  onMouseLeave={() => dispatch(setSidebarHover(false))}
                >
                  <Sidebar />
                  {/* resizing bar */}
                  {sidebar.open && (
                    <div className="flex items-center h-screen w-2.5 group justify-end">
                      <div
                        className={`w-[6px] h-20 hover:h-24 transition-all rounded-full hover:cursor-col-resize opacity-0 bg-[#3f4e72] group-hover:opacity-100 duration-200 ${
                          isResizing ? "cursor-col-resize" : "cursor-default"
                        }`}
                        onMouseDown={handleMouseDown}
                      ></div>
                    </div>
                  )}
                </div>

                {/* Main Content Area */}
                <div
                  className={`relative z-0 transition-all min-h-screen overflow-y-auto duration-300 w-full bg-[#f1f5f9]
            ${sidebar.open ? "md:ml-0" : ""}
            ${isResizing ? "pointer-events-none" : "pointer-events-auto"}
          `}
                  style={{
                    marginLeft: sidebar.open ? `${sidebar.width}px` : "0px",
                    marginRight: sidepane.open ? "280px" : "0px",
                  }}
                >
                  <div className="w-full h-full flex flex-col">
                    <div className="h-14 transition-all duration-300 bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
                      <DashboardTopbar />
                    </div>

                    <div className="flex-1 min-h-0 relative">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={pathname}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          className="h-full"
                        >
                          {children}
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>
                </div>

                {/* Side Pane */}
                <div
                  className={`w-[280px] right-0 fixed h-screen flex-shrink-0 border-l border-gray-300 py-3 transition-transform duration-300 hidden md:block ${
                    sidepane.open ? "translate-x-0" : "translate-x-full"
                  }`}
                >
                  <Sidepane />
                </div>
              </div>
        </TableProvider>
      </BoardDataProvider>
  );
};

export default DashboardLayout;
