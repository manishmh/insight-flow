import { createContext, useState, ReactNode, useContext } from "react";
import { BoardDataType } from "@/components/dashboard/boards/board";

interface BoardContextType {
    activeBoardData: BoardDataType | null;
    handleActiveBoardData: (data: BoardDataType | null) => void;
}

const BoardDataContext = createContext<BoardContextType | undefined>(undefined);

export const BoardDataProvider = ({ children }: { children: ReactNode}) => {
    const [activeBoardData, setActiveBoardData] = useState<BoardDataType | null>(null)

    const handleActiveBoardData = (data: BoardDataType | null) => {
        setActiveBoardData(data);
    }

    return (
        <BoardDataContext.Provider value={{ activeBoardData, handleActiveBoardData }}>
            {children}
        </BoardDataContext.Provider>
    )
}

export const useBoardContext = () => {
    const context = useContext(BoardDataContext);

    if (!context) {
        throw new Error('useBoardContext must be used within boardDataProvider')
    }
    return context;
}