'use server'
import { db } from "@/lib/db";
import { auth } from "@/server/auth";
import { assertBoardOwner, assertDashboardOwner, requireUserId } from "@/server/components/ownership";
import { DASHBOARD_TEMPLATES } from "@/constants/templates";
import { randomUUID } from "crypto";

/**
 * @returns All the data for the dashboard
 */

export const GetDashboardData = async (dashboardId: string) => {
    const session = await auth();
    const userId = session?.user.id;
    if (!userId) return null;

    const dashboard = await db.dashboard.findFirst({
        where: { id: dashboardId, userId },
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
        where: { userId },
        orderBy: { id: "asc" },
    })

    return dashboards 
}

/**
 * @returns the current user's dashboards each with a lightweight list of their
 * blocks (id + name) — used to power global search.
 */
export const GetDashboardsWithBoards = async () => {
    const session = await auth();
    const userId = session?.user.id;
    if (!userId) return [];

    const dashboards = await db.dashboard.findMany({
        where: { userId },
        orderBy: { id: "asc" },
        select: {
            id: true,
            name: true,
            boards: { select: { id: true, name: true, currentDataId: true } },
        },
    });

    return dashboards;
};

const createDefaultDashboard = async (userId: string) => {
    const dashboard = await db.dashboard.create({
        data: {
            name: "Sample Board",
            userId,
            isDefault: true,
            boards: {
                create: {
                    name: "Main Board",
                    width: 500,
                    height: 360,
                },
            },
        },
        include: { boards: true },
    });

    await db.user.update({
        where: { id: userId },
        data: { defaultDashboardId: dashboard.id },
    });

    return dashboard.id;
};

const ensureDefaultDashboardId = async (userId: string, defaultDashboardId?: string | null) => {
    if (defaultDashboardId) {
        const defaultDashboard = await db.dashboard.findFirst({
            where: { id: defaultDashboardId, userId },
            select: { id: true },
        });

        if (defaultDashboard) return defaultDashboard.id;
    }

    const firstDashboard = await db.dashboard.findFirst({
        where: { userId },
        orderBy: { id: "asc" },
        select: { id: true },
    });

    if (firstDashboard) {
        await db.user.update({
            where: { id: userId },
            data: { defaultDashboardId: firstDashboard.id },
        });
        return firstDashboard.id;
    }

    return createDefaultDashboard(userId);
};


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

  const user = await db.user.findUnique({
    where: { id: userId },
    select: { defaultDashboardId: true },
  });

  if (user?.defaultDashboardId === dashboardId) {
    const nextDashboard = await db.dashboard.findFirst({
      where: { userId },
      orderBy: { id: "asc" },
      select: { id: true },
    });

    await db.user.update({
      where: { id: userId },
      data: { defaultDashboardId: nextDashboard?.id ?? null },
    });
  }

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

export const CreateDashboardFromImportedData = async ({
    dashboardName,
    dataId,
    sourceName,
}: {
    dashboardName: string;
    dataId: string;
    sourceName: string;
}) => {
    try {
        const session = await auth();
        const userId = session?.user.id;

        if (!userId) {
            console.error("CreateDashboardFromImportedData: No userId found in session");
            return null;
        }

        const dashboard = await db.dashboard.create({
            data: {
                name: dashboardName || sourceName || "Imported Data",
                userId,
                boards: {
                    create: {
                        name: sourceName || dashboardName || "Imported Data",
                        currentDataId: dataId,
                        width: 720,
                        height: 460,
                    },
                },
            },
            include: { boards: true },
        });

        return dashboard;
    } catch (e: any) {
        console.error("CreateDashboardFromImportedData Error:", e);
        return null;
    }
}

/**
 * 
 * @returns to get the default dashboard id for the current user
 */

export const GetDefaultDashboardId = async () => {
    const session = await auth();
    const userId = session?.user.id;

    if (!userId) return null;

    // Trust the session's defaultDashboardId first (ensureDefaultDashboardId
    // validates it anyway). Only hit the DB for it when the session lacks it.
    let defaultDashboardId: string | null = session?.user.defaultDashboardId ?? null;
    if (!defaultDashboardId) {
        const user = await db.user.findUnique({
            where: { id: userId },
            select: { defaultDashboardId: true },
        });
        defaultDashboardId = user?.defaultDashboardId ?? null;
    }

    return ensureDefaultDashboardId(userId, defaultDashboardId);
}

/** 
 * @returns to set the name of the dashboard
*/

export const SetDashboardName = async (dashboardId: string, name: string) => {
    await assertDashboardOwner(dashboardId);
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
        await assertBoardOwner(id);
        const board = await db.board.update({
            where: { id },
            data: { width, height }
        })

        return board;
    } catch (error) {
        throw new Error("Failed to update board size");
    }
}

/** Layout entry persisted from react-grid-layout. */
export type BoardLayoutItem = {
    id: string;
    x: number;
    y: number;
    w: number;
    h: number;
};

/**
 * Bulk-persist the grid positions/sizes of every board in a dashboard.
 * Ownership is verified once; all rows are written in a single transaction.
 */
export const UpdateDashboardLayout = async (
    dashboardId: string,
    layout: BoardLayoutItem[]
) => {
    await assertDashboardOwner(dashboardId);

    const ownedBoards = await db.board.findMany({
        where: { dashboardId },
        select: { id: true },
    });
    const ownedIds = new Set(ownedBoards.map((b) => b.id));
    const updates = layout
        .filter((item) => ownedIds.has(item.id))
        .map((item) =>
            db.board.update({
                where: { id: item.id },
                data: {
                    x: Math.round(item.x),
                    y: Math.round(item.y),
                    w: Math.round(item.w),
                    h: Math.round(item.h),
                },
            })
        );

    await db.$transaction(updates);
    return { success: true };
};

/**
 * Toggle a read-only public share link for a dashboard.
 * @returns the shareId (token) when enabled, or null when disabled.
 */
export const SetDashboardSharing = async (dashboardId: string, enabled: boolean) => {
    await assertDashboardOwner(dashboardId);
    const dashboard = await db.dashboard.update({
        where: { id: dashboardId },
        data: { shareId: enabled ? randomUUID() : null },
        select: { shareId: true },
    });
    return dashboard.shareId;
};

/**
 * Create a dashboard preloaded with blocks from a named template. Falls back to
 * a blank dashboard when the template key is unknown.
 */
export const CreateDashboardFromTemplate = async (name: string, templateKey: string) => {
    const userId = await requireUserId();
    const template = DASHBOARD_TEMPLATES[templateKey];
    if (!template) return CreateNewDashboard(name);

    const dashboard = await db.dashboard.create({
        data: { name: name || template.label, userId },
    });

    const perRow = 2;
    const w = 6;
    const h = 8;
    for (let i = 0; i < template.blocks.length; i++) {
        const block = template.blocks[i];
        const sample = await db.sampleData.findFirst({
            where: { name: block.source },
            select: { id: true },
        });
        await db.board.create({
            data: {
                dashboardId: dashboard.id,
                name: block.board,
                currentDataId: sample?.id ?? null,
                width: 550,
                height: 400,
                x: (i % perRow) * w,
                y: Math.floor(i / perRow) * h,
                w,
                h,
            },
        });
    }

    return db.dashboard.findUnique({
        where: { id: dashboard.id },
        include: { boards: true },
    });
};

/**
 * Public, unauthenticated read of a dashboard via its share token.
 * Returns null if no dashboard has that token.
 */
export const GetSharedDashboard = async (shareId: string) => {
    if (!shareId) return null;
    const dashboard = await db.dashboard.findUnique({
        where: { shareId },
        include: { boards: true },
    });

    if (!dashboard) return null;

    const boardsOrdered = [...dashboard.boards].sort((a, b) =>
        a.id.localeCompare(b.id)
    );
    return { ...dashboard, boards: boardsOrdered };
};
