import { GetDashboardData } from '@/server/components/dashboard-commands';
import { createContext, useContext, useState, ReactNode, useCallback } from 'react';

interface Board {
    id: string;
    name: string;
    dashboardId: string;
    data: any;
}

interface dashboardDataType {
    id: string;
    name: string;
    boards: Board[];
    userId: string;
    isDefault: boolean;
}

interface DashboardContextType {
    dashboardData: dashboardDataType;
    handleDashboardData: (dashboardId: string) => void;
}

const DashboardDataContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardDataProvider = ({ children }: { children: ReactNode }) => {
    const [dashboardData, setDashboardData] = useState<dashboardDataType>({
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

    return (
        <DashboardDataContext.Provider value={{ dashboardData, handleDashboardData }}>
            {children}
        </DashboardDataContext.Provider>
    )
}

export const useDashboardContext = () => {
    const context = useContext(DashboardDataContext);

    if (!context) {
        throw new Error('useDashboardContext must be used within DashboardDataProvider');
    }
    return context;
}
