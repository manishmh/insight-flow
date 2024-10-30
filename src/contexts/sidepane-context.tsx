import { createContext, useContext } from 'react'

interface SidepaneContextType {
    sidepaneOpen: boolean;
    handleSidepane: () => void;
}

export const SidepaneContext = createContext<SidepaneContextType | undefined>(undefined);

export const useSidepane = () => {
    const context = useContext(SidepaneContext);
    if (!context) {
        throw new Error("useSidepane must be used within a SidepaneProvider");
    }
    return context;
}