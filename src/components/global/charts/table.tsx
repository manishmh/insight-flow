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
    <div className="h-full w-full flex flex-col bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="overflow-auto scrollbar-thin scrollbar-thumb-gray-200 hover:scrollbar-thumb-gray-300 scrollbar-track-transparent">
          <table className="w-full border-collapse text-left">
            <thead className="sticky top-0 z-10 bg-gray-50/80 backdrop-blur-md border-b border-gray-200">
              <tr className="flex">
                {tableHeader.map((column, index) => (
                  <th
                    key={index}
                    className="w-[200px] px-6 py-3.5 flex-shrink-0 text-[10px] font-bold uppercase tracking-wider text-gray-500 border-r border-gray-100 last:border-r-0"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row, rowIndex) => (
                <tr 
                  key={rowIndex} 
                  className={`flex group transition-colors duration-150 ${
                    rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                  } hover:bg-blue-50/50`}
                >
                  {row.map(([originalColIndex, value], colIndex) => {
                    const columnKey = data.data.columns[
                      originalColIndex
                    ] as keyof typeof data.data.columnsInfo;
                    const columnInfo = data.data.columnsInfo[columnKey] ?? {};
                    const cellKey = `${rowIndex}-${originalColIndex}`;

                    let displayValue: string | JSX.Element = value;
                    if (value === null) {
                      displayValue = <span className="text-gray-300 italic text-[10px]">null</span>;
                    } else if (columnInfo?.dataType == "Boolean") {
                      displayValue = (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          value ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}>
                          {value ? "TRUE" : "FALSE"}
                        </span>
                      );
                    } else if (columnInfo?.dataType === "Url") {
                      displayValue = (
                        <a
                          href={value}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline decoration-blue-200 underline-offset-2 transition-colors"
                        >
                          {value}
                        </a>
                      );
                    } else if (columnInfo?.dataType === "Date") {
                      displayValue = (
                        <span className="text-gray-600">
                          {new Date(value).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      );
                    } else if (columnInfo?.dataType === "Object") {
                      displayValue = (
                        <div className="font-mono text-[11px] text-purple-600">
                          {expandedCells.has(cellKey)
                            ? <pre className="whitespace-pre-wrap">{JSON.stringify(value, null, 2)}</pre>
                            : <span className="opacity-70">{JSON.stringify(value).substring(0, 30)}...</span>}
                        </div>
                      );
                    }

                    return (
                      <td
                        key={colIndex}
                        className={`w-[200px] flex-shrink-0 px-6 py-3 border-r border-gray-50 last:border-r-0 transition-all ${
                          expandedCells.has(cellKey)
                            ? "border-blue-200 bg-blue-50/50 shadow-inner"
                            : "truncate"
                        } cursor-pointer`}
                        onClick={() => toggleExpand(rowIndex, colIndex)}
                      >
                        <div className={`${expandedCells.has(cellKey) ? "" : "truncate text-gray-700"}`}>
                          {displayValue}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Pagination Footer */}
      <div className="bg-gray-50/50 border-t border-gray-200 flex items-center justify-between px-6 py-3">
        <div className="text-[11px] text-gray-500 font-medium italic">
          Showing {filteredData.length} records
        </div>
        <div className="flex items-center gap-4 text-gray-600 font-medium">
          <button
            className="p-1.5 hover:bg-gray-200 rounded-lg disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            onClick={() => setPagination(pagination - 1)}
            disabled={pagination === 1}
          >
            <FaChevronLeft className="text-[10px]" />
          </button>
          <div className="flex items-center gap-1.5 text-[11px] font-bold">
            <span className="bg-white border border-gray-200 text-blue-600 px-2 py-0.5 rounded shadow-sm">{pagination}</span>
            <span className="text-gray-400">/</span>
            <span className="text-gray-500">{totalPages}</span>
          </div>
          <button
            className="p-1.5 hover:bg-gray-200 rounded-lg disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            onClick={() => setPagination(pagination + 1)}
            disabled={pagination === totalPages}
          >
            <FaChevronRight className="text-[10px]" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Table;
