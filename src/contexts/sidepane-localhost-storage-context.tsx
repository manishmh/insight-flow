import React, { createContext, useContext, useState } from "react";
import { getTableState, setTableState } from "../utils/localStorage";

export interface DataStateInterface {
  description: string;
  activeColumns: string[];
  groupBy: string;
  sortBy: "asc" | "desc" | "none";
  sortColumn: string | null;
  aggregate: {
    countValues: Record<string, number>;
    countUnique: Record<string, number>;
    countEmpty: Record<string, number>;
    countRows: Record<string, number>;
    percentEmpty: Record<string, number>;
    percentNotEmpty: Record<string, number>;
    sum: Record<string, number>;
    average: Record<string, number>;
    median: Record<string, number>;
    max: Record<string, number>;
  };
  filters: { id: string; column: string; condition: string; value: string }[];
}


export const defaultDataValues: DataStateInterface = {
  description: "",
  activeColumns: [],
  groupBy: "",
  sortBy: "none",
  sortColumn: null,
  aggregate: {
    countValues: {},
    countUnique: {},
    countEmpty: {},
    countRows: {},
    percentEmpty: {},
    percentNotEmpty: {},
    sum: {},
    average: {},
    median: {},
    max: {},
  },
  filters: [],
};


interface TableContextType {
  dataStates: Record<string, DataStateInterface>;
  getDataState: (dataId: string) => DataStateInterface;
  updateState: (
    dataId: string,
    key: keyof DataStateInterface,
    value: any
  ) => void;
  updateAggregate: (
    dataId: string,
    key: keyof DataStateInterface["aggregate"],
    value: Record<string, number>
  ) => void;
  undo: (dataId: string) => void;
  redo: (dataId: string) => void;
  canUndo: (dataId: string) => boolean;
  canRedo: (dataId: string) => boolean;
}

const TableContext = createContext<TableContextType | undefined>(undefined);

export const TableProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [dataStates, setDataStates] = useState<
    Record<string, DataStateInterface>
  >({});
  
  const [history, setHistory] = useState<
    Record<string, { past: DataStateInterface[]; future: DataStateInterface[] }>
  >({});

  const getDataState = (dataId: string): DataStateInterface => {
    if (!dataStates[dataId]) {
      const saved = getTableState(dataId) ?? defaultDataValues;
      setDataStates((prev) => ({ ...prev, [dataId]: saved }));
      return saved;
    }
    return dataStates[dataId];
  };

  const updateState = (
    dataId: string,
    key: keyof DataStateInterface,
    value: any
  ) => {
    const prev = dataStates[dataId] ?? getDataState(dataId);
    
    setHistory((currHistory) => {
      const past = currHistory[dataId]?.past || [];
      const newPast = [...past, prev].slice(-50);
      return {
        ...currHistory,
        [dataId]: { past: newPast, future: [] },
      };
    });

    setDataStates((prevStates) => {
      const prevLocal = prevStates[dataId] ?? getDataState(dataId);

      const updated = {
        ...prevLocal,
        [key]: value,
      };

      setTableState(dataId, updated);

      return {
        ...prevStates,
        [dataId]: updated,
      };
    });
  };

  const updateAggregate = (
    dataId: string,
    aggregateKey: keyof DataStateInterface["aggregate"],
    value: Record<string, number>
  ) => {
    const prev = dataStates[dataId] ?? getDataState(dataId);
    
    setHistory((currHistory) => {
      const past = currHistory[dataId]?.past || [];
      const newPast = [...past, prev].slice(-50);
      return {
        ...currHistory,
        [dataId]: { past: newPast, future: [] },
      };
    });

    setDataStates((prevStates) => {
      const prevLocal = prevStates[dataId] ?? defaultDataValues;
      const updatedAggregate = {
        ...prevLocal.aggregate,
        [aggregateKey]: value,
      };
      const updated = {
        ...prevLocal,
        aggregate: updatedAggregate,
      };
      setTableState(dataId, updated);
      return {
        ...prevStates,
        [dataId]: updated,
      };
    });
  };

  const undo = (dataId: string) => {
    const item = history[dataId];
    if (!item || item.past.length === 0) return;

    const newPast = [...item.past];
    const stateToRestore = newPast.pop()!;
    const currentState = dataStates[dataId] ?? getDataState(dataId);

    setHistory((currHistory) => ({
      ...currHistory,
      [dataId]: {
        past: newPast,
        future: [currentState, ...(currHistory[dataId]?.future || [])],
      },
    }));

    setDataStates((prevStates) => {
      setTableState(dataId, stateToRestore);
      return {
        ...prevStates,
        [dataId]: stateToRestore,
      };
    });
  };

  const redo = (dataId: string) => {
    const item = history[dataId];
    if (!item || item.future.length === 0) return;

    const newFuture = [...item.future];
    const stateToRestore = newFuture.shift()!;
    const currentState = dataStates[dataId] ?? getDataState(dataId);

    setHistory((currHistory) => ({
      ...currHistory,
      [dataId]: {
        past: [...(currHistory[dataId]?.past || []), currentState],
        future: newFuture,
      },
    }));

    setDataStates((prevStates) => {
      setTableState(dataId, stateToRestore);
      return {
        ...prevStates,
        [dataId]: stateToRestore,
      };
    });
  };

  const canUndo = (dataId: string) => {
    return (history[dataId]?.past.length || 0) > 0;
  };

  const canRedo = (dataId: string) => {
    return (history[dataId]?.future.length || 0) > 0;
  };

  return (
    <TableContext.Provider
      value={{
        dataStates,
        getDataState,
        updateState,
        updateAggregate,
        undo,
        redo,
        canUndo,
        canRedo,
      }}
    >
      {children}
    </TableContext.Provider>
  );
};

export const useTableContext = () => {
  const ctx = useContext(TableContext);
  if (!ctx)
    throw new Error("useTableContext must be used inside <TableProvider>");
  return ctx;
};
