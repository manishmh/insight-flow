import { useState } from "react";
import { FaChevronRight, FaPlus } from "react-icons/fa6";
import { DataSourceItem } from "./data-section";
import Modal from "./modal";

type AggregiateProps = {
  selectedData: DataSourceItem | undefined;
};

const Aggregiate: React.FC<AggregiateProps> = ({ selectedData }) => {
  const [aggregateModal, setAggregateModal] = useState(false);
  const [selectedOperation, setSelectedOperation] = useState<string | null>(
    null
  );
  const [aggregateSelections, setAggregateSelections] = useState<
    Record<string, string>
  >({});

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

  const columns = selectedData ? Object.keys(selectedData.data[0]) : [];

  const handleaggregateModal = () => {
    setAggregateModal(!aggregateModal);
  };

  const handleOperationSelect = (operation: string) => {
    setSelectedOperation(operation);
  };

  const handleColumnSelect = (column: string) => {
    if (selectedOperation) {
      setAggregateSelections((prev) => ({
        ...prev,
        [column]: selectedOperation,
      }));
      setSelectedOperation(null);
    }
  };

  return (
    <div className="relative p-3 border-b border-gray-300">
      {aggregateModal && (
        <Modal
          handleModalState={handleaggregateModal}
          className="bottom-0 max-w-none w-[200px]"
        >
          <div>
            {operationGroups.map((group, index) => (
              <div key={index} className="flex flex-col items-start py-1 px-2">
                {index > 0 && (
                  <div className="border-t border-gray-300 w-full my-1" />
                )}
                {group.operations.map((operation) => (
                  <div key={operation} className="w-full relative group">
                    <button
                      onClick={() => handleOperationSelect(operation)}
                      className="rounded-md hover:bg-[#d1d5db52] px-2 py-1 w-full text-left flex items-center gap-2 justify-between text-gray-600"
                    >
                      <div>{operation}</div>
                      <div className="text-[10px]">
                        <FaChevronRight />
                      </div>
                    </button>

                    <div className="absolute left-full bottom-0 w-[250px] hidden group-hover:block max-h-[400px] transition-all duration-500">
                      <div className="bg-[#e1e8ee] ml-4 w-full border border-gray-300 shadow overflow-scroll p-2">
                        {columns.map((column) => (
                          <button
                            key={column}
                            onClick={() => handleColumnSelect(column)}
                            className="px-2 py-1 w-full text-left hover:bg-[#d1d5db52]"
                          >
                            {column}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </Modal>
      )}

      {aggregateModal && <div className="absolute inset-0"></div>}
      <div
        className="hover:bg-[#d1d5db52] px-2 py-1 rounded-sm flex items-center text-gray-500 justify-between cursor-pointer"
        onClick={handleaggregateModal}
      >
        <div>Aggregate</div>
        <div>
          <FaPlus />
        </div>
      </div>
    </div>
  );
};

export default Aggregiate;