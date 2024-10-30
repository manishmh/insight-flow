import { createContext, useContext } from 'react';

// Define the context type
interface SidebarContextType {
  sidebarWidth: number;
  sidebarOpen: boolean;
  handleSidebar: () => void;
}

// Create the context with default values
export const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

// Create a custom hook for easier access to the context
export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

