import { useState } from "react";
import { FaCheck, FaChevronRight, FaPlus } from "react-icons/fa6";
import { useAppSelector } from "@/store/hooks";
import { useTableContext } from "@/contexts/sidepane-localhost-storage-context";
import Modal from "./modal";

const SortBy = () => {
  const { activeBoard } = useAppSelector((state) => state.board);
  const { updateState, getDataState } = useTableContext();
  const [sortByModal, setSortByModal] = useState(false);
  const [sortingOrder, setSortingOrder] = useState<"asc" | "desc" | null>(null);
  const [showColumnDialog, setShowColumnDialog] = useState(false);

  const dataState = activeBoard?.id ? getDataState(activeBoard.id) : null;
  const currentSortOrder = dataState?.sortBy ?? "none";
  const currentSortColumn = dataState?.sortColumn ?? null;
  const columns = activeBoard?.data?.columns ?? [];

  const handlesortByModal = () => {
    setSortByModal(!sortByModal);
    if (!sortByModal) {
      // Reset when opening
      setSortingOrder(null);
      setShowColumnDialog(false);
    }
  };

  const handleSortingOrder = (order: "asc" | "desc") => {
    setSortingOrder(order);
    setShowColumnDialog(true);
  };

  const handleColumnSelect = (column: string) => {
    if (!activeBoard?.id || !sortingOrder) return;

    updateState(activeBoard.id, "sortColumn", column);
    updateState(activeBoard.id, "sortBy", sortingOrder);

    // Close dialogs
    setShowColumnDialog(false);
    setSortingOrder(null);
    setSortByModal(false);
  };

  const handleClearSort = () => {
    if (!activeBoard?.id) return;
    updateState(activeBoard.id, "sortColumn", null);
    updateState(activeBoard.id, "sortBy", "none");
    setSortByModal(false);
    setSortingOrder(null);
    setShowColumnDialog(false);
  };

  if (!activeBoard || columns.length === 0) return null;

  return (
    <div className="relative p-3 border-b border-gray-300">
      {sortByModal && (
        <Modal
          handleModalState={handlesortByModal}
          className="absolute right-full space-y-2 mr-2 rounded-md shadow border border-gray-300 w-[250px] max-h-[320px] bg-[#e1e8ee] bottom-0 min-h-0"
        >
          <div className="space-y-2 p-2 relative">
            {/* Order Selection Dialog */}
            <>
              <div
                className="flex items-center gap-2 justify-between text-gray-600 hover:bg-[#d1d5db52] cursor-pointer px-2 py-1 rounded-sm"
                onClick={() => handleSortingOrder("asc")}
              >
                <div>Ascending</div>
                <div>
                  {sortingOrder === "asc" ? <FaCheck className="text-cyan-500" /> : <FaChevronRight className="text-[10px]" />}
                </div>
              </div>
              <div
                className="flex items-center gap-2 justify-between text-gray-600 hover:bg-[#d1d5db52] cursor-pointer px-2 py-1 rounded-sm"
                onClick={() => handleSortingOrder("desc")}
              >
                <div>Descending</div>
                <div>
                  {sortingOrder === "desc" ? <FaCheck className="text-cyan-500" /> : <FaChevronRight className="text-[10px]" />}
                </div>
              </div>
              {currentSortOrder !== "none" && currentSortColumn && (
                <div
                  className="flex items-center gap-2 justify-between text-red-600 hover:bg-red-50 cursor-pointer px-2 py-1 rounded-sm border-t border-gray-300 mt-2 pt-2"
                  onClick={handleClearSort}
                >
                  <div>Clear Sort</div>
                </div>
              )}
            </>

            {/* Column Selection Dialog */}
            {showColumnDialog && sortingOrder && (
              <div
                className={`absolute max-h-[320px] min-h-[200px] translate-x-2 left-full w-full bottom-0 rounded-md border-gray-300 border shadow bg-[#e1e8ee] ${
                  sortingOrder === "asc" && "-translate-y-8"
                }`}
              >
                <div className="space-y-1 py-2 px-3">
                  {columns.map((column, index) => (
                    <div
                      key={`column-${index}`}
                      onClick={() => handleColumnSelect(column)}
                      className="flex gap-2 hover:bg-[#d1d5db52] px-2 py-1 rounded-md cursor-pointer"
                    >
                      <div
                        className={`border border-gray-300 w-4 h-4 grid place-items-center rounded-sm text-[10px] ${
                          currentSortColumn === column &&
                          currentSortOrder === sortingOrder
                            ? "bg-cyan-500 text-white"
                            : ""
                        }`}
                      >
                        {currentSortColumn === column &&
                          currentSortOrder === sortingOrder && <FaCheck />}
                      </div>
                      <div className="text-gray-600">{column}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}

      {sortByModal && <div className="absolute inset-0"></div>}
      <div
        className="hover:bg-[#d1d5db52] px-2 py-1 rounded-sm flex items-center text-gray-500 justify-between cursor-pointer"
        onClick={handlesortByModal}
      >
        <div>
          Sort by
          {currentSortOrder !== "none" && currentSortColumn && (
            <span className="ml-2 text-xs text-cyan-600">
              ({currentSortColumn} - {currentSortOrder === "asc" ? "Asc" : "Desc"})
            </span>
          )}
        </div>
        <div>
          <FaPlus />
        </div>
      </div>
    </div>
  );
};

export default SortBy;
