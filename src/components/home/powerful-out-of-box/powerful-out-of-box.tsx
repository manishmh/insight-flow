import { MdOutlineDataset } from "react-icons/md";
import RobustAlerting from "./robust-alerting";
import WorkspaceDatasets from "./workspace-datasets";
import AdvancedCustomization from "./advanced-customization";
import TrustSafety from "./trust-safety";
import RemarkableSearch from "./remarkable-search";
import OfflineSupport from "./offline-support";

const PowerfulOutOfBox = () => {
  return (
    <div className="px-4 space-y-28">
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-2 self-center border border-gray-300 px-2 py-1 rounded-lg text-gray-700">
          <MdOutlineDataset className="" />
          Flexibility built-in 
        </div>
        <h1 className="text-3xl xl:text-5xl text-center font-medium text-gray-900">
            Powerful out of the box
        </h1>
        <h2 className="text-center mx-auto pt-3 text-gray-500 text-lg">
            Index is build from grouond up to be fast, powerful and delightful to use.
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-20 max-w-md md:max-w-screen-2xl mx-auto xl:px-28">
        <RobustAlerting />
        <WorkspaceDatasets />
        <AdvancedCustomization />
        <TrustSafety />
        <RemarkableSearch />
        <OfflineSupport />
      </div>
    </div>
  );
};

export default PowerfulOutOfBox;
