'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface AddBlockContextType {
  addBlock: boolean;
  handleAddBlock: () => void;
}

const AddBlockContext = createContext<AddBlockContextType | undefined>(undefined);

export const AddBlockProvider = ({ children }: { children: ReactNode }) => {
  const [addBlock, setAddBlock] = useState(false);

  const handleAddBlock = () => {
    setAddBlock(true);
  };

  return (
    <AddBlockContext.Provider value={{ addBlock, handleAddBlock }}>
      {children}
    </AddBlockContext.Provider>
  );
};

export const useAddBlockContext = () => {
  const context = useContext(AddBlockContext);
  if (!context) {
    throw new Error('useAddBlockContext must be used within an AddBlockProvider');
  }
  return context;
};
