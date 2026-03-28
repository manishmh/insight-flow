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

    if (!dashboard) return dashboard;

    // Keep board order stable by id (creation order). Do not sort by name so
    // changing block name or sample data does not rearrange blocks.
    const boardsOrdered = [...dashboard.boards].sort((a, b) =>
        a.id.localeCompare(b.id)
    );
    return { ...dashboard, boards: boardsOrdered };
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
 * Deletes a dashboard by id. User must own the dashboard.
 * @param dashboardId Dashboard id to delete
 * @returns Deleted dashboard or null
 */
export const DeleteDashboard = async (dashboardId: string) => {
  const session = await auth();
  const userId = session?.user.id;
  if (!userId) return null;

  const dashboard = await db.dashboard.findFirst({
    where: { id: dashboardId, userId },
  });
  if (!dashboard) return null;

  await db.dashboard.delete({
    where: { id: dashboardId },
  });
  return dashboard;
};

/**
 * 
 * @param name Optional dashboard name. Defaults to "Untitled Board" if not provided
 * @returns to create a new dashboard
 */
export const CreateNewDashboard = async (name?: string) => {
    try {
        const session = await auth();
        const userId = session?.user.id;

        if (!userId) {
            console.error("CreateNewDashboard: No userId found in session");
            return null; // Return null explicitly if auth fails
        }

        const dashboard = await db.dashboard.create({
            data: {
                name: name || "Untitled Board", 
                userId: userId,
            }
        });

        // Add a default board to the new dashboard
        await db.board.create({
            data: {
                name: "Main Board",
                dashboardId: dashboard.id,
                width: 400,
                height: 300
            }
        });

        const fullDashboard = await db.dashboard.findUnique({
            where: { id: dashboard.id },
            include: { boards: true }
        });

        return fullDashboard;
    } catch (e: any) {
        console.error("CreateNewDashboard Error:", e);
        return null; // Handle smoothly so client can show proper error
    }
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

/** 
 * @returns to set the name of the dashboard
*/

export const SetDashboardName = async (dashboardId: string, name: string) => {
    const dashboard = await db.dashboard.update({
        where: { id: dashboardId },
        data: { name }
    })

    return dashboard;
}

/** 
 * @returns updates board size
 */

export const UpdateBoardSize = async (id: string, width: number, height: number) => {
    try {
        const board = await db.board.update({
            where: { id },
            data: { width, height }
        })
    
        return board;
    } catch (error) {
        throw new Error("Failed to update board size");    
    }
}