'use server'
import { BoardDataType } from "@/components/dashboard/boards/board";
import { db } from "@/lib/db";
import { Board } from "@prisma/client";
import { fetchDataById } from "./indexedDB";
import { assertBoardOwner, assertDashboardOwner } from "./ownership";

/** 
 * @returns Creating new empty block
 */

export const fetchBoardData = async (boardId: string) => {
  try {
    const data = await db.board.findUnique({
      where: {
        id: boardId
      }
    }) 

    return data;
  } catch (error) {
    console.error("failed to fetch board data", error) ;
    throw new Error("Failed to fetch block data");
  }
}

export const createNewEmptyBlock = async (dashboardId: string) => {
  try {
    await assertDashboardOwner(dashboardId);
    // Stack new blocks below existing ones so they don't overlap on the grid.
    const agg = await db.board.aggregate({
      where: { dashboardId },
      _max: { y: true, h: true },
    });
    const nextY = (agg._max.y ?? 0) + (agg._max.h ?? 0);
    const newBlock = await db.board.create({
      data: {
        dashboardId: dashboardId,
        name: "New Block",
        width: 550,
        height: 400,
        x: 0,
        y: nextY,
        w: 5,
        h: 8,
      },
    });
    return newBlock;
  } catch (error) {
    console.error("Failed to create block:", error);
    throw new Error("Failed to create block");
  }
};

/** 
 * @returns updaes selected block Query
 */

export const fetchSampleData = async (name: string) => {
  try {
    const sampleData = await db.sampleData.findFirst({
      where: {
        name: name
      }
    }) 

    return sampleData;
  } catch (error: any) {
    console.error("failed to fetch sample data", error);
    throw new Error("failed to fetch sample data");
  }
}

/** @returns lightweight list of available sample datasets (id, name, row count). */
export const listSampleDatasets = async () => {
  try {
    const datasets = await db.sampleData.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    });
    return datasets;
  } catch (error) {
    console.error("failed to list sample datasets", error);
    return [];
  }
};

export const fetchSampleDataWithId = async (id: string) => {
  try {
    const sampleData = await db.sampleData.findUnique({
      where: {
        id
      }
    })

    return sampleData;
  } catch (error: any) {
    console.error("failed to fetch sample data", error);
    throw new Error("failed to fetch sample data");
  }
}

// Batched fetch for many blocks at once. The dashboard mounts every block in the
// same tick, so coalescing their cache-miss reads into one query avoids N
// sequential server-action round-trips (Next runs server actions serially).
export const fetchSampleDataByIds = async (ids: string[]) => {
  try {
    if (!ids || ids.length === 0) return [];
    const rows = await db.sampleData.findMany({
      where: { id: { in: ids } },
    });
    return rows;
  } catch (error: any) {
    console.error("failed to fetch sample data batch", error);
    throw new Error("failed to fetch sample data batch");
  }
}

export const setCurrentDataId = async (boardId: string, currentDataId: string ) => {
  try {
    await assertBoardOwner(boardId);
    const board = await db.board.update({
      where: { id: boardId },
      data: { currentDataId }
    })

    return board;
  } catch (error) {
    throw new Error("Failed to update board sample data id") 
  }
}

export const setBoardName = async (name: string, id: string) => {
  try {
    await assertBoardOwner(id);
    const board = await db.board.update({
      where: { id },
      data: { name }
    }) 

    return board;
  } catch (error) {
    throw new Error("Failed to update board name") 
  }
}

 export const fetchAndFormatBoardData = async (dataId: string, board: Board): Promise<BoardDataType | null> => {
    try {
      let data = await fetchDataById(dataId);
      if (!data || Object.keys(data).length === 0) {
        data = await fetchSampleDataWithId(dataId);
      }

      const formattedData: BoardDataType = {
        id: data?.id ?? "",
        boardId: board.id,
        name: board.name ?? "Untitled",
        data: {
          data: data?.data?.data ?? [],
          columns: data?.data?.columns ?? [],
          columnsInfo: data?.data?.columnsInfo ?? [],
          duration: data?.data?.duration ?? 0,
          updatedAt: data?.data?.updatedAt ?? Date.now(),
        },
      };

      return formattedData;
    } catch (error) {
      console.error(`Error fetching board data (ID: ${dataId}):`, error);
      return null;
    }
  };