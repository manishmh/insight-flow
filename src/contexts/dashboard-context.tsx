import { GetDashboardData } from '@/server/components/dashboard-commands';
import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { Prisma } from '@prisma/client'; 

type DashboardWithBoards = Prisma.DashboardGetPayload<{
  include: { boards: true };
}>;

interface DashboardContextType {
  dashboardData: DashboardWithBoards;
  handleDashboardData: (dashboardId: string) => void;
  refreshDashboard: () => void;
}

const DashboardDataContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardDataProvider = ({ children }: { children: ReactNode }) => {
  const [dashboardData, setDashboardData] = useState<DashboardWithBoards>({
    id: '',
    name: '',
    boards: [],
    userId: '',
    isDefault: false,
  });

  const handleDashboardData = useCallback(async (dashboardId: string) => {
    try {
      const data = await GetDashboardData(dashboardId);
      if (!data) return;
      setDashboardData(data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const refreshDashboard = useCallback(async () => {
    if (!dashboardData.id) return;
    try {
      const data = await GetDashboardData(dashboardData.id);
      if (!data) return;
      setDashboardData(data);
    } catch (error) {
      console.error(error);
    }
  }, [dashboardData.id]);

  return (
    <DashboardDataContext.Provider value={{ dashboardData, handleDashboardData, refreshDashboard }}>
      {children}
    </DashboardDataContext.Provider>
  );
};

export const useDashboardContext = () => {
  const context = useContext(DashboardDataContext);

  if (!context) {
    throw new Error('useDashboardContext must be used within DashboardDataProvider');
  }
  return context;
};

