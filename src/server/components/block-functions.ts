import { auth } from "@/server/auth";
import { db } from "@/lib/db";
import { connect } from "http2";

/** 
 * @returns Creating new empty block
 */

export const CreateNewEmptyblock = async (dashboardId: string) => {
    const newBlock = await db.board.create({
        data: {
            dashboard: { connect: { id: dashboardId }},
            name: "New Block",
        }
    })

    return newBlock;
}