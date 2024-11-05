import { useState } from "react";
import { FaCheck, FaPlus } from "react-icons/fa6";
import { DataSourceItem } from "./data-section";
import Modal from "./modal";

type DataColumnsProps = {
  selectedData: DataSourceItem | undefined;
};

const GroupBy: React.FC<DataColumnsProps> = ({ selectedData }) => {
  const [groupByModal, setGroupByModal] = useState(false);
  const [checkedColumns, setCheckedColumns] = useState<string[]>([]);

  const handleGroupByModal = () => {
    setGroupByModal(!groupByModal);
  };

  const handleCheckboxToggle = (column: string) => {
    setCheckedColumns((prev) =>
      prev.includes(column)
        ? prev.filter((col) => col !== column)
        : [...prev, column]
    );
  };

  return (
    <div className="relative p-3 border-b border-gray-300">
      {groupByModal && (
        <Modal
          handleModalState={handleGroupByModal}
          className="bottom-0 max-h-[280px] overflow-scroll"
        >
          <div className="">
            <div className="space-y-1 py-2 px-3">
              {selectedData &&
                Object.keys(selectedData.data[0]).map((column, index) => (
                  <div
                    key={`column-${index}`}
                    onClick={() => handleCheckboxToggle(column)}
                    className="flex gap-2 hover:bg-[#d1d5db52] px-2 py-1 rounded-md cursor-pointer"
                  >
                    <div
                      className={`border border-gray-300 w-4 h-4 grid place-items-center rounded-sm text-[10px] ${
                        checkedColumns.includes(column) &&
                        "bg-cyan-500 text-white"
                      }`}
                    >
                      {checkedColumns.includes(column) && <FaCheck />}
                    </div>
                    <div className="text-gray-600">{column}</div>
                  </div>
                ))}
            </div>
          </div>
        </Modal>
      )}
      {groupByModal && <div className="absolute inset-0"></div>}
      <div
        className="hover:bg-[#d1d5db52] px-2 py-1 rounded-sm flex items-center text-gray-500 justify-between cursor-pointer"
        onClick={handleGroupByModal}
      >
        <div>Group by</div>
        <div>
          <FaPlus />
        </div>
      </div>
    </div>
  );
};

export default GroupBy;
