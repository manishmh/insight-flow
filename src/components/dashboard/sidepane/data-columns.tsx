import { useBoardContext } from "@/contexts/board-context";
import { useTableContext } from "@/contexts/sidepane-localhost-storage-context";
import { useState } from "react";
import { FaCheck, FaMinus } from "react-icons/fa6";
import Modal from "./modal";
import { getTableState } from "@/utils/localStorage";

type DataColumnsProps = {
  TableColumns: string[];
};

const DataColumns: React.FC<DataColumnsProps> = ({ TableColumns }) => {
  const [openColumns, setOpenColumns] = useState(false);
  const [selectAll, setSelectAll] = useState(true);
  const { activeBoardData } = useBoardContext();
  const { updateState } = useTableContext();

  const localCheckedColumns = getTableState(activeBoardData?.id ?? "")?.activeColumns ?? [];

  const handleOpencolumns = () => {
    setOpenColumns(!openColumns);
  };

  const handleSelectAllToggle = () => {
    const updated = selectAll ? [] : TableColumns;
    setSelectAll(!selectAll);
    updateState(activeBoardData?.id ?? "", "activeColumns", updated);
  };

  const handleCheckboxToggle = (column: string) => {
    const updated = localCheckedColumns.includes(column)
      ? localCheckedColumns.filter((col: any) => col !== column)
      : [...localCheckedColumns, column];

    const ordered = TableColumns.filter((col) => updated.includes(col));
    updateState(activeBoardData?.id ?? "", "activeColumns", ordered);

    if (ordered.length === 0) setSelectAll(false);
    if (ordered.length === TableColumns.length) setSelectAll(true);
  };

  return (
    <div className="border-b border-gray-300 relative px-3 py-3">
      {openColumns && (
        <Modal
          handleModalState={handleOpencolumns}
          className="overflow-scroll h-[320px]"
        >
          <div
            onClick={handleSelectAllToggle}
            className="flex gap-2 hover:bg-[#d1d5db52] px-2 my-2 mx-3 py-1 rounded-md cursor-pointer "
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
              {TableColumns.map((column, index) => (
                <div
                  key={`column-${index}`}
                  onClick={() => handleCheckboxToggle(column)}
                  className="flex gap-2 hover:bg-[#d1d5db52] px-2 py-1 rounded-md cursor-pointer"
                >
                  <div
                    className={`border border-gray-300 w-4 h-4 grid place-items-center rounded-sm text-[10px] ${
                      localCheckedColumns.includes(column)
                        ? "bg-cyan-500 text-white"
                        : ""
                    }`}
                  >
                    {localCheckedColumns.includes(column) && <FaCheck />}
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
              {TableColumns.length}
            </span>
          </div>
          <div className="text-xl text-gray-400">+</div>
        </div>

        <div className="space-y-2">
          {TableColumns.map((column, index) => (
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
