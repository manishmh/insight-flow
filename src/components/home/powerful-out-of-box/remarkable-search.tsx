import { rsdata } from "@/constants";
import { useEffect, useState } from "react";
import { IoSearch } from "react-icons/io5";
import POBDetails from "./pob-details";

const RemarkableSearch = () => {
  const [inputValue, setInputValue] = useState("");
  const [startAnnimation, setStartAnnimation] = useState(false);
  const [rsdataCopy, setRsdataCopy] = useState(rsdata)
  const filterData = ["Toronto", "Vancouver"];

  useEffect(() => {
    setStartAnnimation(!startAnnimation)

    let currentWord = 0;
    let interval: NodeJS.Timeout;

    const typeInputValue = () => {
      currentWord = (currentWord + 1) % filterData.length;
      setInputValue("")

      filterData[currentWord].split("").forEach((char, index) => {
        setTimeout(() => {
          setInputValue((prev) => prev + char);
        }, index * 200);
      })
    }

    typeInputValue();

    interval = setInterval(typeInputValue, 4000);

    return () => clearTimeout(interval);

  }, []);

  useEffect(() => {
    if (inputValue.length >= 2) {  // Start searching when at least 2 characters are typed
      const filteredData = rsdata.filter((person) =>
        person.city.toLowerCase().includes(inputValue.toLowerCase())
      );
      
      setRsdataCopy(filteredData.length > 0 ? filteredData : rsdata); // Reset if no match
    } else {
      setRsdataCopy(rsdata); // Reset to original data if input is cleared or less than 2 chars
    }
  }, [inputValue]);

  return (
    <div className="space-y-4">
      <div className="h-[220px]">
        <div className="relative">
          <div className={`flex items-center gap-2 bg-gray-300 px-2 py-1 rounded-md ${startAnnimation ? "border border-blue-950 shadow-sm shadow-blue-950" : ""}`}>
            <IoSearch className="text-gray-500"/>
            <input
              type="text"
              value={inputValue}
              className="w-full h-full bg-transparent outline-none text-gray-600"
              placeholder="Search..."
              readOnly
            />
          </div>
          <div className="shadow-md py-2 mt-2 h-full bg-[rgb(234,242,248)] transition-all duration-1000 rounded-md overflow-scroll scrollbar-none">
            <table className="min-w-full table-auto h-full transition-all duration-1000">
              <thead>
                <tr className="text-[#3a5077] text-sm leading-normal">
                  <th className="py-1 px-2 md:px-6 text-left font-normal">Id</th>
                  <th className="py-1 px-2 md:px-6 text-left font-normal">city</th>
                  <th className="py-1 px-2 md:px-6 text-left font-normal">
                    total spending
                  </th>
                  <th className="py-1 px-2 md:px-6 text-left font-normal">
                    total orders
                  </th>
                </tr>
              </thead>
              <tbody className="text-gray-600 pb-2 text-sm font-light transition-all duration-1000">
                {rsdataCopy.map((person) => (
                  <tr key={person.id} className="hover:bg[#b2bfd5]">
                    <td className="py-1 px-2 md:px-6 text-left">{person.id}</td>
                    <td className="py-1 px-2 md:px-6 text-left">{person.city}</td>
                    <td className="py-1 px-2 md:px-6 text-left">
                      {person.totalSpending}
                    </td>
                    <td className="py-1 px-2 md:px-6 text-left">
                      {person.totalOrders}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="absolute bottom-0 w-full h-12 bg-gradient-to-t from-[#e1e8ee] to-transparent"></div>
        </div>
      </div>
      <POBDetails
        logo={<IoSearch />}
        heading="Remarkable search"
        desc="Search on index is remarkably fast and relevant across tables, queries, datasets, and dashboards."
      />
    </div>
  );
};

export default RemarkableSearch;