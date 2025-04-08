import React, { createContext, useContext, useState } from "react";
import { getTableState, setTableState } from "../utils/localStorage";

export interface DataStateInterface {
  description: string;
  activeColumns: string[];
  groupBy: string;
  sortBy: "asc" | "desc" | "none";
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
}

export const defaultDataValues: DataStateInterface = {
  description: "",
  activeColumns: [],
  groupBy: "",
  sortBy: "none",
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
}

const TableContext = createContext<TableContextType | undefined>(undefined);

export const TableProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [dataStates, setDataStates] = useState<
    Record<string, DataStateInterface>
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
    setDataStates((prevStates) => {
      const prev = prevStates[dataId] ?? getDataState(dataId);

      const updated = {
        ...prev,
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
    setDataStates((prevStates) => {
      const prev = prevStates[dataId] ?? defaultDataValues;
      const updatedAggregate = {
        ...prev.aggregate,
        [aggregateKey]: value,
      };
      const updated = {
        ...prev,
        aggregate: updatedAggregate,
      };
      setTableState(dataId, updated);
      return {
        ...prevStates,
        [dataId]: updated,
      };
    });
  };

  return (
    <TableContext.Provider
      value={{
        dataStates,
        getDataState,
        updateState,
        updateAggregate,
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
