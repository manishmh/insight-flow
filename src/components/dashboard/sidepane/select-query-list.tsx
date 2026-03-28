import { GrDatabase } from "react-icons/gr";
import Modal from "./modal";

const SelectQueryList = ({
  queryList,
  recentlyUsed,
  customQueries,
  handleSelectQuery,
  handleSetSelectQuery,
}: {
  queryList: readonly string[];
  recentlyUsed: string[];
  customQueries: string[];
  handleSelectQuery: (type: string) => void;
  handleSetSelectQuery: () => void;
}) => {
  return (
    <Modal handleModalState={handleSetSelectQuery} className="p-3 overflow-y-auto max-h-[400px]">
      {recentlyUsed.length > 0 && (
        <div className="space-y-2 mb-4">
          <div className="text-gray-400 text-xs uppercase tracking-wider font-semibold">Recently used</div>
          {recentlyUsed.map((recentQuery) => (
            <div
              key={`recent-${recentQuery}`}
              className="flex items-center gap-2 text-gray-700 font-medium cursor-pointer hover:bg-[#d1d5db52] py-1 px-2 rounded-md"
              onClick={() => handleSelectQuery(recentQuery)}
            >
              <span className="text-[10px]">
                <GrDatabase />
              </span>
              <span className="line-clamp-1">{recentQuery}</span>
            </div>
          ))}
        </div>
      )}

      {customQueries.length > 0 && (
        <div className="space-y-2 mb-4">
          <div className="text-gray-400 text-xs uppercase tracking-wider font-semibold">Your Data Sources</div>
          {customQueries.map((query) => (
            <div
              key={`custom-${query}`}
              className="flex items-center gap-2 text-gray-700 font-medium cursor-pointer hover:bg-cyan-50 py-1 px-2 rounded-md border border-transparent hover:border-cyan-100"
              onClick={() => handleSelectQuery(query)}
            >
              <span className="text-[10px] text-cyan-600">
                <GrDatabase />
              </span>
              <span className="line-clamp-1 text-cyan-800">{query}</span>
            </div>
          ))}
        </div>
      )}

      <div className="space-y-2">
        <div className="text-gray-400 text-xs uppercase tracking-wider font-semibold">Sample connections</div>
        {queryList.map((query) => (
          <div
            key={`sample-${query}`}
            className="flex items-center gap-2 text-gray-700 font-medium cursor-pointer hover:bg-[#d1d5db52] py-1 px-2 rounded-md"
            onClick={() => handleSelectQuery(query)}
          >
            <span className="text-[10px]">
              <GrDatabase />
            </span>
            <span className="line-clamp-1">{query}</span>
          </div>
        ))}
      </div>
    </Modal>
  );
};

export default SelectQueryList;
