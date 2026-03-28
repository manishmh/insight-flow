import { BoardDataType } from "@/components/dashboard/boards/board";
import {
  DataStateInterface,
  useTableContext,
} from "@/contexts/sidepane-localhost-storage-context";
import { getTableState } from "@/utils/localStorage";
import { sortTableDataByColumn } from "@/utils/sortData";
import { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { LuLayoutDashboard } from "react-icons/lu";

const Table = ({ data }: { data: BoardDataType }) => {
  const [expandedCells, setExpandedCells] = useState<Set<string>>(new Set());
  const [pagination, setPagination] = useState(1);
  const [tableHeader, setTableHeader] = useState<string[]>([]);
  const [filteredData, setFilteredData] = useState<any[][]>([]);
  const [prevSortKey, setPrevSortKey] = useState<string>("");
  const RECORDS_PER_PAGE = 50;
  const { dataStates } = useTableContext();
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const allRows = data.data.data;
    const allColumns = data.data.columns;

    console.log("Table component - data structure:", {
      allRowsLength: allRows.length,
      allColumnsLength: allColumns.length,
      allColumns: allColumns,
      firstRow: allRows[0],
      dataId: data.id
    });

    const TableActionsState: DataStateInterface = getTableState(data.id);
    let activeColumn = TableActionsState?.activeColumns ?? [];
    
    // If no active columns, use all columns as fallback
    if (activeColumn.length === 0 && allColumns.length > 0) {
      activeColumn = allColumns;
      // Save to localStorage
      const { setTableState } = require("@/utils/localStorage");
      const currentState = TableActionsState || {};
      setTableState(data.id, {
        ...currentState,
        activeColumns: allColumns
      });
    }
    
    setTableHeader(activeColumn);

    // Get sort preferences
    const sortColumn = TableActionsState?.sortColumn ?? null;
    const sortOrder = TableActionsState?.sortBy ?? "none";
    const currentSortKey = `${sortColumn}-${sortOrder}`;

    // Reset pagination to page 1 if sort changed
    if (prevSortKey !== currentSortKey && prevSortKey !== "") {
      setPagination(1);
    }
    setPrevSortKey(currentSortKey);

    // Apply filtering
    const filters = TableActionsState?.filters || [];
    let processedRows = allRows;
    
    if (filters.length > 0) {
      processedRows = allRows.filter((row) => {
        return filters.every((filter) => {
          if (!filter.column || !filter.value) return true;
          const cellValue = String(row[filter.column] ?? "").toLowerCase();
          const filterValue = filter.value.toLowerCase();
          
          switch (filter.condition) {
            case "equals":
              return cellValue === filterValue;
            case "contains":
              return cellValue.includes(filterValue);
            case "starts_with":
              return cellValue.startsWith(filterValue);
            case "greater_than":
              return Number(row[filter.column]) > Number(filter.value);
            case "less_than":
              return Number(row[filter.column]) < Number(filter.value);
            default:
              return true;
          }
        });
      });
    }

    // Apply sorting BEFORE pagination
    let sortedRows = processedRows;
    if (sortOrder !== "none" && sortColumn) {
      sortedRows = sortTableDataByColumn(processedRows, allColumns, sortColumn, sortOrder);
      console.log("Table component - sorting applied:", {
        sortColumn,
        sortOrder,
        originalLength: allRows.length,
        sortedLength: sortedRows.length
      });
    }

    const activeIndexes = activeColumn
      .map((col) => allColumns.indexOf(col))
      .filter((i) => i !== -1);

    console.log("Table component - filtering:", {
      activeColumn,
      activeIndexes,
      allColumns,
      allRowsLength: sortedRows.length
    });

    // Apply pagination AFTER sorting
    const startIndex = (pagination - 1) * RECORDS_PER_PAGE;
    const paginatedRows = sortedRows.slice(
      startIndex,
      startIndex + RECORDS_PER_PAGE
    );
    const filtered = paginatedRows.map((row) =>
      activeIndexes.map((i) => [i, row[i]])
    );

    console.log("Table component - filtered data:", {
      paginatedRowsLength: paginatedRows.length,
      filteredLength: filtered.length,
      firstFilteredRow: filtered[0]
    });

    setFilteredData(filtered);
    
    // Update total pages based on sorted data length
    setTotalPages(Math.ceil(sortedRows.length / RECORDS_PER_PAGE));
  }, [pagination, data.id, data.data, dataStates]);

  const toggleExpand = (rowIndex: number, colIndex: number) => {
    setExpandedCells((prev) => {
      const newSet = new Set(prev);
      const cellKey = `${rowIndex}-${colIndex}`;
      if (newSet.has(cellKey)) {
        newSet.delete(cellKey);
      } else {
        newSet.add(cellKey);
      }
      return newSet;
    });
  };

  if (tableHeader.length === 0) return (
    <div className="flex flex-col justify-center items-center h-full gap-2">
      <div className="border border-gray-300 p-5 text-lg rounded-lg mb-2">
        <LuLayoutDashboard />
      </div>
      <div className="font-semibold">No columns selected</div>
      <div>Select a column to show data.</div>
    </div>
  )

  return (
    <div className="h-full w-full flex flex-col pt-2">
      <div className="w-full h-full overflow-hidden">
        <div className="overflow-scroll w-full h-full">
          <div className="w-full">
            <div className="flex text-sm w-full">
              {tableHeader.map((column, index) => (
                <div
                  key={index}
                  className="w-[200px] px-4 py-2 flex-shrink-0 border-r border-gray-400 truncate text-gray-600"
                >
                  {column}
                </div>
              ))}
            </div>
            <div>
              {filteredData.map((row, rowIndex) => (
                <div key={rowIndex} className="flex w-full text-sm">
                  {row.map(([originalColIndex, value], colIndex) => {
                    const columnKey = data.data.columns[
                      originalColIndex
                    ] as keyof typeof data.data.columnsInfo;
                    const columnInfo = data.data.columnsInfo[columnKey] ?? {};
                    const cellKey = `${rowIndex}-${originalColIndex}`;

                    let displayValue: string | JSX.Element = value;
                    if (value === null) {
                      displayValue = <div className="text-gray-500">NULL</div>;
                    } else if (columnInfo?.dataType == "Boolean") {
                      displayValue = (
                        <div className="w-full">
                          <div className="text-gray-500 border rounded-md border-gray-300 py-1 w-16 flex justify-center">
                            {value ? "True" : "False"}
                          </div>
                        </div>
                      );
                    } else if (columnInfo?.dataType === "Url") {
                      displayValue = (
                        <a
                          href={value}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-cyan-600 underline"
                        >
                          {value}
                        </a>
                      );
                    } else if (columnInfo?.dataType === "Date") {
                      displayValue = new Date(value).toLocaleString();
                    } else if (columnInfo?.dataType === "Object") {
                      displayValue = (
                        <div>
                          <pre>
                            {expandedCells.has(cellKey)
                              ? `${JSON.stringify(value, null, 2)}`
                              : `${JSON.stringify(value)}`}{" "}
                          </pre>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={colIndex}
                        className={`w-[200px] flex-shrink-0 px-4 py-2 truncate overflow-hidden ${
                          expandedCells.has(cellKey)
                            ? "whitespace-normal bg-gray-200 border-cyan-400 border "
                            : "whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px]"
                        }`}
                        onClick={() => toggleExpand(rowIndex, colIndex)}
                      >
                        {displayValue}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="bg-primary-bg border border-t-gray-400 flex items-center px-4 py-2">
        <div className="flex items-center justify-center gap-4 w-full text-gray-500 font-mono">
          <button
            className="text-xs p-2 hover:bg-gray-300 rounded-md hover:cursor-pointer"
            onClick={() => {
              setPagination(pagination - 1);
            }}
            disabled={pagination === 1}
          >
            <FaChevronLeft />
          </button>
          <div className="flex gap-2">
            <span className="text-black">{pagination}</span>
            <span>of</span>
            <span>{totalPages}</span>
          </div>
          <button
            className="text-xs p-2 hover:bg-gray-300 rounded-md hover:cursor-pointer"
            onClick={() => {
              setPagination(pagination + 1);
            }}
            disabled={pagination === totalPages}
          >
            <FaChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Table;
