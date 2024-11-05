import { useState } from "react";
import { FaCheck, FaChevronRight, FaPlus } from "react-icons/fa6";
import { DataSourceItem } from "./data-section";
import Modal from "./modal";

type DataColumnsProps = {
  selectedData: DataSourceItem | undefined;
};

const SortBy: React.FC<DataColumnsProps> = ({ selectedData }) => {
  const [sortByModal, setSortByModal] = useState(false);
  const [sortingOrder, setSortingOrder] = useState<"asc" | "desc">();
  const [checkedColumns, setCheckedColumns] = useState<string[]>([]);

  const handlesortByModal = () => {
    setSortByModal(!sortByModal);
  };

  const handleSortingOrder = (order: "asc" | "desc") => {
    setCheckedColumns([]);
    setSortingOrder(order);
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
      {sortByModal && (
        <Modal
          handleModalState={handlesortByModal}
          className="absolute right-full space-y-2 mr-2 rounded-md shadow border border-gray-300 w-[250px] max-h-[320px] bg-[#e1e8ee] bottom-0 min-h-0"
        >
          <div className="space-y-2 p-2 relative">

            {sortByModal && sortingOrder && (
              <div
                className={`absolute max-h-[320px] min-h-[200px] translate-x-2 left-full w-full bottom-0 rounded-md border-gray-300 border shadow bg-[#e1e8ee] ${
                  sortingOrder === "asc" && "-translate-y-8"
                }`}
              >
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
            )}

            <div
              className="flex items-center gap-2 justify-between text-gray-600 hover:bg-[#d1d5db52] cursor-pointer px-2 py-1 rounded-sm"
              onClick={() => handleSortingOrder("asc")}
            >
              <div>Ascending</div>
              <div>
                <FaChevronRight className="text-[10px]" />
              </div>
            </div>
            <div
              className="flex items-center gap-2 justify-between text-gray-600 hover:bg-[#d1d5db52] cursor-pointer px-2 py-1 rounded-sm"
              onClick={() => handleSortingOrder("desc")}
            >
              <div>Descending</div>
              <div>
                <FaChevronRight className="text-[10px]" />
              </div>
            </div>
          </div>
        </Modal>
      )}

      {sortByModal && <div className="absolute inset-0"></div>}
      <div
        className="hover:bg-[#d1d5db52] px-2 py-1 rounded-sm flex items-center text-gray-500 justify-between cursor-pointer"
        onClick={handlesortByModal}
      >
        <div>Sort by</div>
        <div>
          <FaPlus />
        </div>
      </div>
    </div>
  );
};

export default SortBy;
