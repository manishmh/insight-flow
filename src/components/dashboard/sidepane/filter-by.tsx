import { useState } from "react";
import { FaPlus, FaTrash } from "react-icons/fa6";
import Modal from "./modal";
import { useAppSelector } from "@/store/hooks";
import { useTableContext } from "@/contexts/sidepane-localhost-storage-context";

const FilterBy = () => {
  const { activeBoard } = useAppSelector((state) => state.board);
  const { updateState, getDataState } = useTableContext();

  const [filterModal, setFilterModal] = useState(false);

  const dataState = activeBoard?.id ? getDataState(activeBoard.id) : null;
  const currentFilters = dataState?.filters || [];
  const columns = activeBoard?.data?.columns ?? [];

  const handleFilterModal = () => {
    setFilterModal(!filterModal);
  };

  const updateFiltersState = (newFilters: any[]) => {
    if (!activeBoard?.id) return;
    updateState(activeBoard.id, "filters", newFilters);
  };

  const handleAddFilter = () => {
    const newFilter = {
      id: Math.random().toString(36).substring(7),
      column: columns[0] || "",
      condition: "contains",
      value: "",
    };
    updateFiltersState([...currentFilters, newFilter]);
  };

  const handleRemoveFilter = (filterId: string) => {
    updateFiltersState(currentFilters.filter((f) => f.id !== filterId));
  };

  const handleUpdateFilter = (filterId: string, key: string, value: string) => {
    const updated = currentFilters.map((f) => {
      if (f.id === filterId) {
        return { ...f, [key]: value };
      }
      return f;
    });
    updateFiltersState(updated);
  };

  const conditions = [
    { value: "equals", label: "Equals" },
    { value: "contains", label: "Contains" },
    { value: "starts_with", label: "Starts with" },
    { value: "greater_than", label: "Greater than" },
    { value: "less_than", label: "Less than" },
  ];

  if (!activeBoard || columns.length === 0) return null;

  return (
    <div className="relative p-3 border-b border-gray-300">
      {filterModal && (
        <Modal
          handleModalState={handleFilterModal}
          className="absolute right-full space-y-2 mr-2 rounded-md shadow border border-gray-300 w-[240px] max-h-[400px] overflow-y-auto bg-[#e1e8ee] bottom-0 min-h-0"
        >
          <div className="space-y-3 p-3 relative">
            <div className="font-semibold text-gray-700 text-sm border-b border-gray-300 pb-1">Active Filters</div>
            
            {currentFilters.length === 0 && (
              <div className="text-gray-500 text-xs italic">No filters applied.</div>
            )}

            {currentFilters.map((filter) => (
              <div key={filter.id} className="bg-white p-2 rounded border border-gray-200 shadow-sm space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-600">Filter</span>
                  <button onClick={() => handleRemoveFilter(filter.id)} className="text-red-500 hover:text-red-700">
                    <FaTrash size={10} />
                  </button>
                </div>
                
                <select
                  value={filter.column}
                  onChange={(e) => handleUpdateFilter(filter.id, "column", e.target.value)}
                  className="w-full border border-gray-300 rounded p-1 bg-gray-50 text-gray-700 outline-none"
                >
                  {columns.map((col) => (
                    <option key={col} value={col}>{col}</option>
                  ))}
                </select>

                <select
                  value={filter.condition}
                  onChange={(e) => handleUpdateFilter(filter.id, "condition", e.target.value)}
                  className="w-full border border-gray-300 rounded p-1 bg-gray-50 text-gray-700 outline-none"
                >
                  {conditions.map((cond) => (
                    <option key={cond.value} value={cond.value}>{cond.label}</option>
                  ))}
                </select>

                <input
                  type="text"
                  placeholder="Value..."
                  value={filter.value}
                  onChange={(e) => handleUpdateFilter(filter.id, "value", e.target.value)}
                  className="w-full border border-gray-300 rounded p-1 bg-gray-50 text-gray-700 outline-none"
                />
              </div>
            ))}

            <button
              onClick={handleAddFilter}
              className="w-full text-center py-1 bg-cyan-500 hover:bg-cyan-600 text-white rounded text-xs font-semibold flex justify-center items-center gap-2 mt-2"
            >
              <FaPlus /> Add Filter
            </button>
          </div>
        </Modal>
      )}

      {filterModal && <div className="absolute inset-0"></div>}
      <div
        className="hover:bg-[#d1d5db52] px-2 py-1 rounded-sm flex items-center text-gray-500 justify-between cursor-pointer"
        onClick={handleFilterModal}
      >
        <div>
          Filter by
          {currentFilters.length > 0 && (
            <span className="ml-2 text-xs text-cyan-600">
              ({currentFilters.length})
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

export default FilterBy;
