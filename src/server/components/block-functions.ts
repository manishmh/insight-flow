'use server'
import { db } from "@/lib/db";
import { auth } from "@/server/auth";
import { connect } from "http2";

/** 
 * @returns Creating new empty block
 */

export const createNewEmptyBlock = async (dashboardId: string) => {
  try {
    const newBlock = await db.board.create({
      data: {
        dashboardId: dashboardId,
        name: "New Block",
      },
    });
    return newBlock;
  } catch (error) {
    console.error("Failed to create block:", error);
    throw new Error("Failed to create block");
  }
};
