import { rsdata } from "@/constants";
import { useEffect, useState } from "react";
import { IoSearch } from "react-icons/io5";
import POBDetails from "./pob-details";

const RemarkableSearch = () => {
  const [inputValue, setInputValue] = useState("");
  const [rsdataCopy, setRsdataCopy] = useState(rsdata)
  const filterData = ["Toronto", "Vancouver"];

  useEffect(() => {
    let wordIndex = 0; // Track the current word
    let charIndex = 0; // Track the current character
    let typingTimeout: ReturnType<typeof setTimeout>; // Ensure consistent typing
    let wordTypingComplete = false; // Track whether the word is fully typed
    console.log('wordindex', wordIndex)
    console.log('charIndex', charIndex)

    const typeNextCharacter = () => {
      // Get the current word
      const currentWord = filterData[wordIndex];
      console.log('currentword', currentWord)

      if (charIndex === 0) {
        // If starting a new word, reset the input
        setInputValue("");
        wordTypingComplete = false;
      }

      console.log('current char', currentWord[charIndex])
      // Update the input field one character at a time
      setInputValue((prev) => prev + currentWord[charIndex]);
      charIndex++;

      if (charIndex === currentWord.length) {
        // If word is completely typed, wait 2 seconds before moving to the next word
        wordTypingComplete = true;
        wordIndex = (wordIndex + 1) % filterData.length; // Move to the next word or reset to the first word
        charIndex = 0; // Reset character index for the next word

        typingTimeout = setTimeout(typeNextCharacter, 2000); // 2 seconds delay before starting the next word
      } else {
        // Keep typing the current word
        typingTimeout = setTimeout(typeNextCharacter, 200); // Continue typing every 200ms
      }
    };

    // Start typing effect
    typingTimeout = setTimeout(typeNextCharacter, 500);

    // Clear timeout on component unmount to avoid memory leaks
    return () => clearTimeout(typingTimeout);
  }, []);

  return (
    <div className="space-y-4">
      <div className="h-[220px]">
        <div className="relative">
          <div className="flex items-center gap-2 bg-gray-300 px-2 py-1 rounded-md">
            <IoSearch className="text-gray-500"/>
            <input
              type="text"
              value={inputValue}
              className="w-full h-full bg-transparent outline-none text-gray-600"
              placeholder="Search..."
              readOnly
            />
          </div>
          <div className="shadow-md py-2 mt-2 h-full bg-[rgb(234,242,248)] transition-all duration-500 rounded-md overflow-scroll scrollbar-none">
            <table className="min-w-full table-auto h-full ">
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
              <tbody className="text-gray-600 pb-2 text-sm font-light">
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
