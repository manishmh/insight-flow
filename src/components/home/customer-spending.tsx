import { FaArrowUp } from "react-icons/fa6";
const CustomerSpending = () => {
  return (
    <div className="border border-gray-300 col-span-3 md:col-span-1 py-2 shadow flex flex-col h-full rounded-lg group">
      <h1 className="text-gray-600 border-b border-gray-300 pb-2 px-3">Customer spending</h1>
      <div className="flex justify-center flex-col items-center gap-6 flex-1 py-6 px-3">
        <div className="text-gray-500">Average monthly spending</div>
        <div className="text-[#2f3f5d] text-4xl md:text-5xl lg:text-6xl font-semibold">
          $201.55
        </div>
        <div className="flex items-center transition-all duration-500 opacity-0 group-hover:opacity-100 gap-1 bg-green-200 rounded-md px-2 text-green-700 translate-y-10 group-hover:translate-y-0">
          <FaArrowUp className="text-xs text-green-600" /> 20.5%
        </div>
      </div>
    </div>
  );
};

export default CustomerSpending;
