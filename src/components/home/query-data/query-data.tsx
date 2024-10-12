import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { motion } from "framer-motion";

const QueryData = ({ customers }: { customers: any }) => {
  // Define animation for each row
  const rowAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1, // Stagger the animation for each row
      },
    }),
  };

  return (
    <div className="flex flex-col items-center gap-6 shadow-md rounded-lg overflow-hidden h-full relative">
      <div className="absolute bg-gradient-to-l from-[#e1e8ee] to-transparent h-full w-10 z-20 right-0"></div>
      <div className="w-full h-full">
        <div className="flex flex-col items-start w-full border border-gray-300 h-full overflow-scroll scrollbar-none">
          <h1 className="border-b border-gray-300 w-full pl-2 py-2 text-gray-600">
            Top customers
          </h1>
          <table className="min-w-full table-auto border-collapse border border-gray-300">
            <thead className="text-gray-600">
              <tr>
                <th className="font-normal px-2 text-left border border-gray-300 py-1">
                  id
                </th>
                <th className="font-normal text-left border border-gray-300 px-2 py-1">
                  date joined
                </th>
                <th className="font-normal text-left border border-gray-300 px-2 py-1">
                  city
                </th>
                <th className="font-normal text-left border border-gray-300 px-2 py-1">
                  total spending
                </th>
                <th className="font-normal text-left border border-gray-300 px-2 py-1">
                  total orders
                </th>
                <th className="font-normal text-left border border-gray-300 px-2 py-1">
                  last order
                </th>
                <th className="font-normal pr-2 text-left border border-gray-300 px-2 py-1">
                  membership
                </th>
              </tr>
            </thead>
            <tbody className="text text-gray-600">
              {customers.map((customer: any, index: number) => (
                <motion.tr
                  key={customer.id}
                  initial="hidden"
                  animate="visible"
                  custom={index} // Pass index to stagger animations
                  variants={rowAnimation}
                  className=""
                >
                  <td className="pl-2 border border-gray-300 py-1">{customer.id}</td>
                  <td className="border border-gray-300 px-2 py-1">
                    {customer.dateJoined}
                  </td>
                  <td className="border border-gray-300 px-2 py-1">{customer.city}</td>
                  <td className="border border-gray-300 px-2 py-1">
                    ${customer.totalSpending.toFixed(2)}
                  </td>
                  <td className="border border-gray-300 px-2 py-1">
                    {customer.totalOrders}
                  </td>
                  <td className="border border-gray-300 px-2 py-1">
                    {customer.lastOrder}
                  </td>
                  <td className="pr-2 border border-gray-300 px-2 py-1">
                    {customer.membership}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-center items-center gap-4 text-sm pb-2 text-gray-400 mt-2 w-full">
            <FaChevronLeft className="text-xs" />
            <span>
              <span className="text-gray-600">1</span>
              <span className="px-3">/</span>
              64
            </span>
            <FaChevronRight className="text-xs" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default QueryData;
