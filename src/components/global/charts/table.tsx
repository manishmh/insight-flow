import { BoardDataType } from "@/components/dashboard/boards/board";
import { useState } from "react";

const Table = ({ data }: { data: BoardDataType }) => {
  const [expandedCells, setExpandedCells] = useState<Set<string>>(new Set());
  console.log(expandedCells)

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
    <div className="overflow-auto p-2">
      <table className="min-w-full table-fixed ">
        <thead>
          <tr className="text-left ">
            {data.data.columns.map((column, index) => (
              <th
                key={index}
                className="pl-4 border-gray-300 text-gray-500 font-semibold border-r-2 truncate"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.data.data.map((row, rowIndex) => (
            <tr key={rowIndex} className="">
              {row.map((value: any, colIndex: number) => {
                const columnKey = data.data.columns[colIndex] as keyof typeof data.data.columnsInfo;
                const columnInfo = data.data.columnsInfo[columnKey] ?? {};
                let displayValue: string | JSX.Element = value;
                const cellKey = `${rowIndex}-${colIndex}`;

                if (value === null) {
                  displayValue = <div className="text-gray-500">NULL</div>;
                } else if (columnInfo?.dataType === "Boolean") {
                  displayValue = <span className="text-gray-500 border rounded-md border-gray-300 px-3 py-1">{value ? "True" : "False"}</span>;
                } else if (columnInfo?.dataType === "Date") {
                  displayValue = new Date(value).toLocaleString();
                } else if (columnInfo?.dataType === "Url") {
                  displayValue = <a href={value} target="_blank" rel="noopener noreferrer" className="text-cyan-600 underline">{value}</a>;
                } else if (columnInfo?.dataType == "Object") {
                  displayValue = <div><pre>{expandedCells.has(cellKey) ? `${JSON.stringify(value, null, 2)}` : `${JSON.stringify(value)}`} </pre></div>
                }
                
                return (
                  <td 
                    key={colIndex} 
                    className={` px-4 py-2 truncate overflow-hidden ${expandedCells.has(cellKey) ? "whitespace-normal bg-gray-200 border-cyan-400 border " : "whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px]"}`} 
                    onClick={() => toggleExpand(rowIndex, colIndex)}
                  >
                    {displayValue}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
