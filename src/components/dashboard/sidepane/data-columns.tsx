import { useEffect, useState } from "react";
import { FaCheck, FaMinus } from "react-icons/fa6";
import { DataSourceItem } from "./data-section";
import Modal from "./modal";

type DataColumnsProps = {
  selectedData: DataSourceItem | undefined;
};

const DataColumns: React.FC<DataColumnsProps> = ({ selectedData }) => {
  const [openColumns, setOpenColumns] = useState(false);
  const [checkedColumns, setCheckedColumns] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(true);

  // Initialize all columns as checked when selectedData changes
  useEffect(() => {
    if (selectedData) {
      const allColumns = Object.keys(selectedData.data[0]);
      setCheckedColumns(allColumns); // Check all columns initially
    }
  }, [selectedData]);

  const handleOpencolumns = () => {
    setOpenColumns(!openColumns);
  };

  // Toggle Select All/Deselect All functionality
  const handleSelectAllToggle = () => {
    if (selectAll) {
      setCheckedColumns([]); // Uncheck all
    } else {
      setCheckedColumns(Object.keys(selectedData?.data[0] || {})); // Check all
    }
    setSelectAll(!selectAll);
  };

  // Toggle individual checkbox
  const handleCheckboxToggle = (column: string) => {
    setCheckedColumns(
      (prev) =>
        prev.includes(column)
          ? prev.filter((col) => col !== column) // Uncheck
          : [...prev, column] // Check
    );
  };

  return (
    <div className="border-b border-gray-300 relative px-3 py-3">
      {openColumns && (
        <Modal handleModalState={handleOpencolumns}>
          <div
            onClick={handleSelectAllToggle}
            className="flex gap-2 hover:bg-[#d1d5db52] px-2 my-2 mx-3 py-1 rounded-md cursor-pointer overflow-scroll"
          >
            <div
              className={`border border-gray-300 w-4 h-4 grid place-items-center rounded-sm text-[10px] ${
                selectAll && "bg-cyan-500 text-white"
              }`}
            >
              {selectAll && <FaCheck />}
            </div>
            <div className="text-gray-600">
              {selectAll ? "Deselect all" : "Select all"}
            </div>
          </div>
          <div className="border-t border-b border-gray-300">
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
      <div className="max-h-[320px] overflow-scroll">
        <div
          className="flex items-center justify-between text-gray-500 font-medium hover:bg-[#d1d5db52] px-2 rounded-md cursor-pointer "
          onClick={handleOpencolumns}
        >
          {openColumns && <div className="absolute inset-0"></div>}
          <div className="flex gap-2 items-center">
            Columns{" "}
            <span className="border border-gray-300 rounded px-1">
              {selectedData ? Object.keys(selectedData.data[0]).length : 0}
            </span>
          </div>
          <div className="text-xl text-gray-400">+</div>
        </div>

        <div className="space-y-2">
          {checkedColumns.map((column, index) => (
            <div
              key={`checked-column-${column}-${index}`}
              className="flex items-center justify-between "
            >
              <div className="hover:bg-[#d1d5db52] py-1 px-2 rounded-sm cursor-pointer w-full">
                {column}
              </div>
              <div
                className="text-gray-400 hover:bg-[#d1d5db52] py-1 px-2 rounded-sm cursor-pointer"
                onClick={() => handleCheckboxToggle(column)}
              >
                <FaMinus />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DataColumns;
