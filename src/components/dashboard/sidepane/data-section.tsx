import SelectQuerySvg from "@/components/global/svg/select-query-svg";
import { sampleTableData } from "@/constants/sampel-table-data";
import { useState } from "react";
import DataColumns from "./data-columns";
import GroupBy from "./group-by";
import SelectQueryList from "./select-query-list";
import SortBy from "./sort-by";
import Aggregiate from "./aggregate";

export type DataSourceItem = {
  label: string;
  data: any[];
};

const dataSources: DataSourceItem[] = [sampleTableData];
const extractedLabels = dataSources.map((source) => source.label);

const originalList = [
  ...extractedLabels,
  "empty_table",
  "documents",
  "users",
  "workspaces",
  "products",
  "purchases",
  "orders",
] as const;

export type QueryType = (typeof originalList)[number];

const DataSection = () => {
  const [selectQuery, setSelectQuery] = useState(false);
  const [selectedQuery, setSelectedQuery] = useState<QueryType | null>(
    "Customers"
  );
  const [recentlyUsed, setRecentlyUsed] = useState<QueryType[]>([]);

  const handleSetSelectQuery = () => {
    setSelectQuery(!selectQuery);
  };

  const handleSelectedQuery = (query: QueryType) => {
    setSelectedQuery(query);
    setRecentlyUsed((prevRecentlyUsed) =>
      [query, ...prevRecentlyUsed.filter((item) => item !== query)].slice(0, 3)
    );

    handleSetSelectQuery();
  };

  // Find data corresponding to the selected query
  const selectedData = dataSources.find(
    (source) => source.label === selectedQuery
  );

  return (
    <>
      <div className="py-2 px-3 border-b border-gray-300">
        {selectQuery && (
          <SelectQueryList
            queryList={originalList}
            recentlyUsed={recentlyUsed}
            handleSetSelectQuery={handleSetSelectQuery}
            handleSelectQuery={handleSelectedQuery}
          />
        )}
        <div className="text-gray-500 px-2">Query</div>
        <div className="relative">
          <div
            className="text-gray-500 flex items-center w-full gap-2 my-2 hover:bg-[#d1d5db52] py-1 px-2 rounded-md cursor-pointer"
            onClick={() => setSelectQuery(!selectQuery)}
          >
            {selectQuery && <div className="absolute inset-0"></div>}
            <div className="w-4 h-4 mt-[1px] flex flex-shrink-0">
              <SelectQuerySvg />
            </div>
            {selectedQuery ? (
              <div className="flex justify-between w-full ">
                <span className="text-gray-800 font-semibold truncate w-1/2">
                  {selectedQuery}
                </span>
                <span className="whitespace-nowrap w-1/2">
                  Sample Collection
                </span>
              </div>
            ) : (
              "Select a query..."
            )}
          </div>
        </div>
      </div>
      {/* Pass selectedData to DataColumns */}
      <DataColumns selectedData={selectedData} />
      <GroupBy selectedData={selectedData} />
      <SortBy selectedData={selectedData} />
      <Aggregiate  selectedData={selectedData}/>
    </>
  );
};

export default DataSection;
