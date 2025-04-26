'use server'
import { BoardDataType } from "@/components/dashboard/boards/board";
import { db } from "@/lib/db";
import { Board } from "@prisma/client";
import { fetchDataById } from "./indexedDB";

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
    const newBlock = await db.board.create({
      data: {
        dashboardId: dashboardId,
        name: "New Block",
        width: 550,
        height: 400,
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
    throw new error("failed to fetch sample data", error);
  }
}

export const fetchSampleDataWithId = async (id: string) => {
  try {
    const sampleData = await db.sampleData.findUnique({
      where: {
        id
      }
    }) 

    return sampleData;
  } catch (error: any) {
    throw new error("failed to fetch sample data", error);
  }
}

export const setCurrentDataId = async (boardId: string, currentDataId: string ) => {
  try {
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