import { createContext, useState, ReactNode, useContext } from "react";

interface BoardContextType {
    activeBoardId: string;
    handleActiveBoardId: (boardId: string) => void;
}

const BoardDataContext = createContext<BoardContextType | undefined>(undefined);

export const BoardDataProvider = ({ children }: { children: ReactNode}) => {
    const [activeBoardId, setActiveBoardId] = useState<string>('');

    const handleActiveBoardId = (boardId: string) => {
        setActiveBoardId(boardId)
    };

    return (
        <BoardDataContext.Provider value={{ activeBoardId, handleActiveBoardId }}>
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