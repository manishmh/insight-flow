"use server"

import { db } from "@/lib/db";
import { auth } from "@/server/auth";

/** Resolve the current user id or throw if unauthenticated. */
export const requireUserId = async (): Promise<string> => {
  const session = await auth();
  const userId = session?.user.id;
  if (!userId) throw new Error("Unauthorized");
  return userId;
};

/** Throw unless the current user owns the given dashboard. */
export const assertDashboardOwner = async (dashboardId: string): Promise<string> => {
  const userId = await requireUserId();
  const dashboard = await db.dashboard.findFirst({
    where: { id: dashboardId, userId },
    select: { id: true },
  });
  if (!dashboard) throw new Error("Forbidden");
  return userId;
};

/** Throw unless the current user owns the dashboard that contains the given board. */
export const assertBoardOwner = async (boardId: string): Promise<string> => {
  const userId = await requireUserId();
  const board = await db.board.findFirst({
    where: { id: boardId, dashboard: { userId } },
    select: { id: true },
  });
  if (!board) throw new Error("Forbidden");
  return userId;
};
