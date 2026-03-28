import { useState } from "react";
import { FaCheck, FaChevronRight, FaPlus } from "react-icons/fa6";
import Modal from "./modal";
import { useAppSelector } from "@/store/hooks";
import { useTableContext } from "@/contexts/sidepane-localhost-storage-context";

const Aggregate = () => {
  const { activeBoard } = useAppSelector((state) => state.board);
  const { updateAggregate, getDataState } = useTableContext();

  const [activeGroupModal, setActiveGroupModal] = useState<string | null>(null);
  const [selectedOperation, setSelectedOperation] = useState<string | null>(null);

  const dataState = activeBoard?.id ? getDataState(activeBoard.id) : null;
  const aggregates = dataState?.aggregate;

  const columns = activeBoard?.data?.columns ?? [];
  const rows = activeBoard?.data?.data ?? [];

  const handleGroupModal = (groupLabel: string) => {
    if (activeGroupModal === groupLabel) {
      setActiveGroupModal(null);
      setSelectedOperation(null);
    } else {
      setActiveGroupModal(groupLabel);
      setSelectedOperation(null);
    }
  };

  const handleOperationSelect = (operation: string) => {
    setSelectedOperation(operation);
  };

  const calculateOperation = (operation: string, column: string): number => {
    if (!rows.length) return 0;
    
    let result = 0;
    const values = rows.map(r => r[column]);

    switch (operation) {
      case "countValues":
        result = values.length;
        break;
      case "countUnique":
        result = new Set(values).size;
        break;
      case "countEmpty":
        result = values.filter(v => v === null || v === "" || v === undefined).length;
        break;
      case "countRows":
        result = rows.length;
        break;
      case "percentEmpty":
        const emptyCount = values.filter(v => v === null || v === "" || v === undefined).length;
        result = (emptyCount / rows.length) * 100;
        break;
      case "percentNonEmpty":
        const nonEmptyCount = values.filter(v => v !== null && v !== "" && v !== undefined).length;
        result = (nonEmptyCount / rows.length) * 100;
        break;
      case "sum":
        result = values.reduce((acc, val) => acc + (Number(val) || 0), 0);
        break;
      case "average":
        const sum = values.reduce((acc, val) => acc + (Number(val) || 0), 0);
        result = sum / rows.length;
        break;
      case "max":
        result = Math.max(...values.map(v => Number(v) || 0));
        break;
      case "median":
        const sorted = [...values].map(v => Number(v) || 0).sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        result = sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
        break;
      default:
        result = 0;
    }
    return result;
  };

  const handleColumnSelect = (operation: string, column: string) => {
    if (!activeBoard?.id || !operation) return;
    
    const currentOpState = aggregates?.[operation as keyof typeof aggregates] || {};
    
    // Unselect if already selected
    if (currentOpState[column] !== undefined) {
      const newOpState = { ...currentOpState };
      delete newOpState[column];
      updateAggregate(
        activeBoard.id, 
        operation as keyof typeof aggregates, 
        newOpState
      );
      return;
    }

    // Otherwise calculate and update context state
    const result = calculateOperation(operation, column);
    updateAggregate(
      activeBoard.id, 
      operation as keyof typeof aggregates, 
      { ...currentOpState, [column]: result }
    );
  };

  const operationGroups = [
    {
      label: "Count Operations",
      operations: ["countValues", "countUnique", "countEmpty", "countRows"],
    },
    {
      label: "Empty Operations",
      operations: ["percentEmpty", "percentNonEmpty"],
    },
    {
      label: "Math Operations",
      operations: ["sum", "average", "median", "max"],
    },
  ];

  const operationDescriptions: Record<string, string> = {
    countValues: "Total count of values in column",
    countUnique: "Count of all distinct/unique values",
    countEmpty: "Count of empty or null cells",
    countRows: "Total number of rows in the table",
    percentEmpty: "Percentage of cells that are empty",
    percentNonEmpty: "Percentage of cells with data",
    sum: "Sum of all numeric values",
    average: "Average arithmetic mean of numeric values",
    median: "Middle value of sorted numeric values",
    max: "Largest numeric value",
  };

  if (!activeBoard || columns.length === 0) return null;

  return (
    <>
      {operationGroups.map((group) => (
        <div key={group.label} className="relative p-3 border-b border-gray-300">
          {activeGroupModal === group.label && (
            <Modal
              handleModalState={() => handleGroupModal(group.label)}
              className="absolute right-full space-y-2 mr-2 rounded-md shadow border border-gray-300 w-[200px] max-h-[320px] bg-[#e1e8ee] bottom-0 min-h-0"
            >
              <div className="space-y-2 p-2 relative">
                {/* Operation Selection */}
                <div className="flex flex-col items-start py-1">
                  {group.operations.map((operation) => (
                    <div
                      key={operation}
                      onClick={() => handleOperationSelect(operation)}
                      title={operationDescriptions[operation]}
                      className="rounded-md hover:bg-[#d1d5db52] px-2 py-1 w-full text-left flex items-center gap-2 justify-between text-gray-600 cursor-pointer"
                    >
                      <div>{operation}</div>
                      <div>
                        {selectedOperation === operation ? <FaCheck className="text-cyan-500" /> : <FaChevronRight className="text-[10px]" />}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Column Selection Dialog */}
                {selectedOperation && group.operations.includes(selectedOperation) && (
                  <div
                    className={`absolute max-h-[320px] min-h-[200px] translate-x-2 left-full w-full bottom-0 rounded-md border-gray-300 border shadow bg-[#e1e8ee]`}
                  >
                    <div className="space-y-1 py-2 px-3 overflow-y-auto max-h-[300px]">
                      {columns.map((column, index) => {
                        const hasValue = aggregates?.[selectedOperation as keyof typeof aggregates]?.[column] !== undefined;
                        const value = aggregates?.[selectedOperation as keyof typeof aggregates]?.[column];

                        return (
                          <div
                            key={`col-${index}`}
                            onClick={() => handleColumnSelect(selectedOperation, column)}
                            className="flex flex-col hover:bg-[#d1d5db52] px-2 py-1 rounded-md cursor-pointer text-gray-600"
                          >
                            <div className="flex gap-2 items-center">
                              <div className={`border border-gray-300 w-4 h-4 grid place-items-center rounded-sm text-[10px] ${hasValue ? "bg-cyan-500 text-white" : ""}`}>
                                {hasValue && <FaCheck />}
                              </div>
                              <div>{column}</div>
                            </div>
                            {hasValue && (
                              <div className="text-xs text-cyan-600 ml-6 mt-1">
                                Result: {typeof value === 'number' && !Number.isInteger(value) ? value.toFixed(2) : value}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </Modal>
          )}

          {activeGroupModal === group.label && <div className="absolute inset-0"></div>}
          <div
            className="hover:bg-[#d1d5db52] px-2 py-1 rounded-sm flex items-center text-gray-500 justify-between cursor-pointer"
            onClick={() => handleGroupModal(group.label)}
          >
            <div>{group.label}</div>
            <div>
              <FaPlus />
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default Aggregate;