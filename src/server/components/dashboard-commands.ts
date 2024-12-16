'use server'
import { db } from "@/lib/db";
import { auth } from "@/server/auth";

/** 
 * @returns All the data for the dashboard
 */

export const GetDashboardData = async (dashboardId: string) => {
    const dashboard = await db.dashboard.findUnique({
        where: { id: dashboardId },
        include: { boards: true },
    });
    
    return dashboard;
}

/**
 * 
 * @returns to get the dashboards for the current user
 */

export const GetDashboards = async () => {
    const session = await auth();
    const userId = session?.user.id;
    const dashboards = await db.dashboard.findMany({
        where: { userId }
    })

    return dashboards 
}


/**
 * 
 * @param userId 
 * @returns to create a new dashboard
 */
export const CreateNewDashboard = async () => {
    const session = await auth();
    const userId = session?.user.id;

    if (!userId) return;

    const dashboard = await db.dashboard.create({
        data: {
            name: "Untitled Board", 
            userId: userId,
        }
    })

    return dashboard
}

/**
 * 
 * @returns to get the default dashboard id for the current user
 */

export const GetDefaultDashboardId = async () => {
    const session = await auth();
    const defaultDashboardId = session?.user.defaultDashboardId;

    return defaultDashboardId;
}
