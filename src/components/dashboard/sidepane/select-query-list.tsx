import { GrDatabase } from "react-icons/gr";
import { QueryType } from "./data-section";
import Modal from "./modal";

const SelectQueryList = ({
  queryList,
  recentlyUsed,
  handleSelectQuery,
  handleSetSelectQuery,
}: {
  queryList: readonly QueryType[];
  recentlyUsed: QueryType[];
  handleSelectQuery: (type: QueryType) => void;
  handleSetSelectQuery: () => void;
}) => {
  return (
    <Modal handleModalState={handleSetSelectQuery} className="p-3 overflow-scroll">
      {recentlyUsed.length > 0 && (
        <div className="space-y-2 ">
          <div className="text-gray-400">Recently used</div>
          {recentlyUsed.map((recentQuery) => (
            <div
              key={`select-query-${recentQuery}`}
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
      <div className="space-y-2">
        <div className="text-gray-400 ">Sample connections</div>
        {queryList.map((query) => (
          <div
            key={`select-query-${query}`}
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
