import AddEmoji from "@/components/global/svg/add-emoji";
import { useDashboardContext } from "@/contexts/dashboard-context";
import { setBoardName } from "@/server/components/block-functions";
import React, { useState } from "react";

const EmojiNName = ({
  name,
  dataId,
  boardId,
}: {
  name: string;
  dataId: string;
  boardId: string;
}) => {
  const [nameInputValue, setNameInputValue] = useState(name);
  const [description, setDescription] = useState("");
  const {refreshDashboard} = useDashboardContext()

  const handleNameInputValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNameInputValue(e.target.value);
  };

  const handleNameChange = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const data = await setBoardName(nameInputValue, boardId);
      setNameInputValue(data.name); 
      refreshDashboard();
    }
  };

  const handleDescription = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div>
          <div>
            <div className="opacity-50 cursor-pointer transition-colors duration-300 rounded-sm p-1 hover:bg-[#d1d5db52]">
              <AddEmoji />
            </div>
          </div>
        </div>
        <div className="w-full">
          <input
            type="text"
            value={nameInputValue}
            onChange={handleNameInputValue}
            onKeyDown={handleNameChange}
            className="w-full bg-transparent capitalize h-6 hover:bg-[#d1d5db52] transition-colors duration-200 rounded px-2 outline-none focus:border-cyan-500 focus:border focus:bg-transparent py-[2px] caret-cyan-500 font-medium text-gray-800"
          />
        </div>
      </div>
      <div className="">
        <input
          type="text"
          value={description}
          placeholder="Add description"
          onChange={handleDescription}
          className="h-6 w-full bg-transparent hover:bg-[#d1d5db52] transition-colors duration-200 rounded pl-2 outline-none focus:border-cyan-500 focus:border focus:bg-transparent  caret-cyan-500 font-medium text-gray-800"
        />
      </div>
    </div>
  );
};

export default EmojiNName;
