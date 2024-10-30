"use client";
import Sidebar from "@/components/dashboard/sidebar";
import DashboardTopbar from "@/components/dashboard/topbar";
import { SidebarContext } from "@/contexts/sidebar-context";
import { SidepaneContext } from "@/contexts/sidepane-context";
import { useCallback, ReactNode, useEffect, useState } from "react";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const [screenSize, setScreenSize] = useState<number | null>(null);
  const [searchState, setSearchState] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarHover, setSidebarHover] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(250);
  const [isResizing, setIsResizing] = useState(false);
  const [sidepaneOpen, setSidepaneOpen] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      const currentWidth = window.innerWidth;
      setScreenSize(currentWidth);
      setSidebarOpen(currentWidth > 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidepane = () => {
    setSidepaneOpen(!sidepaneOpen);
  };

  const handleSearchState = () => {
    setSearchState(!searchState);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsResizing(true);
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isResizing) {
        const newWidth = e.clientX;
        if (newWidth > 200 && newWidth < 360) {
          setSidebarWidth(newWidth);
        }
      }
    },
    [isResizing]
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
    <SidebarContext.Provider
      value={{ sidebarWidth, sidebarOpen, handleSidebar }}
    >
      <SidepaneContext.Provider value={{ sidepaneOpen, handleSidepane }}>
        <div className="flex md:text-sm 3xl:text-base select-none overflow-hidden">
          {searchState && (
            <>
              <div
                className="absolute z-[49] w-full h-screen"
                onClick={handleSearchState}
              ></div>
              <div className="absolute z-50 bg-white w-full max-w-[600px] h-[400px] rounded-lg top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2">
                Searchbar
              </div>
            </>
          )}

          {/* Sidebar */}
          <div
            className={`bg-[#e1e8ee] z-10 transition-all shadow-sm border-r border-gray-300 duration-300 max-h-screen fixed left-0 flex justify-between
          rounded-tr-md rounded-br-md ${
            sidebarHover ? "translate-x-0" : "-translate-x-full"
          } ${
              sidebarOpen
                ? "translate-x-0 top-14 md:top-0 h-screen"
                : "-translate-x-full top-14 bottom-2"
            } ${isResizing ? "pointer-events-none" : "pointer-events-auto"}`}
            style={{ width: sidebarWidth }}
            onMouseEnter={() => setSidebarHover(true)}
            onMouseLeave={() => setSidebarHover(false)}
          >
            <Sidebar
              handleSidebar={handleSidebar}
              handleSearchState={handleSearchState}
            />
            {/* resizing bar */}
            {sidebarOpen && (
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
            className={`relative z-0 transition-all min-h-screen overflow-y-auto duration-300 w-full  
            ${sidebarOpen ? "md:ml-0" : ""}
            ${isResizing ? "pointer-events-none" : "pointer-events-auto"}
          `}
            style={{
              marginLeft: sidebarOpen ? `${sidebarWidth}px` : "0px",
              marginRight: sidepaneOpen ? "280px" : "0px",
            }}
            onClick={() => setSidepaneOpen(!sidepaneOpen)}
          >
            <div className="w-full h-full flex flex-col">
              <div className="h-14 transition-all duration-300">
                <DashboardTopbar
                  setSidebarHover={setSidebarHover}
                  handleSidebar={handleSidebar}
                  sidebarOpen={sidebarOpen}
                />
              </div>

              <div className="h-full">{children}</div>
            </div>
          </div>

          {/* Side Pane */}
          <div
            className={`w-[280px] right-0 fixed h-screen flex-shrink-0 border-l border-gray-300 bg-cyan-200 p-3 transition-transform duration-300 cursor-pointer ${
              sidepaneOpen ? "translate-x-0" : "translate-x-full"
            }`}
          ></div>
        </div>
      </SidepaneContext.Provider>
    </SidebarContext.Provider>
  );
};

export default DashboardLayout;
