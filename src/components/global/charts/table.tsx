import { BoardDataType } from "@/components/dashboard/boards/board";
import {
  DataStateInterface,
  useTableContext,
} from "@/contexts/sidepane-localhost-storage-context";
import { getTableState } from "@/utils/localStorage";
import { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

const Table = ({ data }: { data: BoardDataType }) => {
  const [expandedCells, setExpandedCells] = useState<Set<string>>(new Set());
  const [pagination, setPagination] = useState(1);
  const [tableHeader, setTableHeader] = useState<string[]>([]);
  const [filteredData, setFilteredData] = useState<any[][]>([]);
  const RECORDS_PER_PAGE = 50;
  const totalPages = Math.ceil(data.data.data.length / RECORDS_PER_PAGE);
  const { dataStates } = useTableContext();

  useEffect(() => {
    const startIndex = (pagination - 1) * RECORDS_PER_PAGE;
    const allRows = data.data.data;
    const allColumns = data.data.columns;

    const TableActionsState: DataStateInterface = getTableState(data.id);
    const activeColumn = TableActionsState?.activeColumns ?? [];
    setTableHeader(activeColumn);

    const activeIndexes = activeColumn
      .map((col) => allColumns.indexOf(col))
      .filter((i) => i !== -1);

    // Step 3: slice & filter rows based on active indexes
    const paginatedRows = allRows.slice(
      startIndex,
      startIndex + RECORDS_PER_PAGE
    );
    const filtered = paginatedRows.map((row) =>
      activeIndexes.map((i) => [i, row[i]])
    );

    setFilteredData(filtered);
    console.log("filtereed", filtered);
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

  return (
    <div className="h-full w-full flex flex-col pt-2">
      <div className="w-full h-full overflow-hidden">
        <div className="overflow-scroll w-full h-full">
          <div className="w-full">
            <div className="flex text-base w-full">
              {tableHeader.map((column, index) => (
                <div
                  key={index}
                  className="w-[200px] px-4 flex-shrink-0 border-r border-gray-400 truncate text-gray-600"
                >
                  {column}
                </div>
              ))}
            </div>
            <div>
              {filteredData.map((row, rowIndex) => (
                <div key={rowIndex} className="flex w-full">
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
