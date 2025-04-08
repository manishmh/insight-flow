import AddEmoji from "@/components/global/svg/add-emoji";
import { useDashboardContext } from "@/contexts/dashboard-context";
import {
  DataStateInterface,
  useTableContext,
} from "@/contexts/sidepane-localhost-storage-context";
import { setBoardName } from "@/server/components/block-functions";
import { getTableState } from "@/utils/localStorage";
import React, { useEffect, useRef, useState } from "react";

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
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);

  const { refreshDashboard } = useDashboardContext();
  const { updateState } = useTableContext();

  const nameRef = useRef<HTMLTextAreaElement>(null);
  const descRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const TableLocalStorageData: DataStateInterface = getTableState(dataId);
    setDescription(TableLocalStorageData?.description || "");
  }, []);

  useEffect(() => {
    if (isEditingName && nameRef.current) {
      nameRef.current.focus();
      autoResize(nameRef.current);
    }
    if (isEditingDescription && descRef.current) {
      descRef.current.focus();
      autoResize(descRef.current);
    }
  }, [isEditingName, isEditingDescription]);

  const autoResize = (el: HTMLTextAreaElement) => {
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNameInputValue(e.target.value);
    autoResize(e.target);
  };

  const handleNameKeyDown = async (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const data = await setBoardName(nameInputValue, boardId);
      setNameInputValue(data.name);
      setIsEditingName(false);
      refreshDashboard();
    }
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setDescription(e.target.value);
    autoResize(e.target);
  };

  const handleDescriptionKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      updateState(dataId, "description", description);
      setIsEditingDescription(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-start gap-2 mr-8">
        <div className="opacity-50 transition-colors duration-300 rounded-sm p-1 hover:bg-[#d1d5db52]">
          <AddEmoji />
        </div>
        <div className="w-full">
          {isEditingName ? (
            <textarea
              ref={nameRef}
              value={nameInputValue}
              onChange={handleNameChange}
              onKeyDown={handleNameKeyDown}
              onBlur={() => setIsEditingName(false)}
              rows={1}
              className="w-full bg-transparent capitalize resize-none overflow-hidden hover:bg-[#d1d5db52] transition-colors duration-200 rounded px-2 outline-none focus:border-cyan-500 focus:border focus:bg-transparent py-[2px] caret-cyan-500 font-medium text-gray-800"
            />
          ) : (
            <div
              onClick={() => setIsEditingName(true)}
              className="capitalize font-medium text-gray-800 cursor-text px-2 py-[2px] hover:bg-[#d1d5db52] rounded transition-colors duration-200 whitespace-pre-wrap break-words"
            >
              {nameInputValue || "Untitled"}
            </div>
          )}
        </div>
      </div>

      <div className="">
        {isEditingDescription ? (
          <textarea
            ref={descRef}
            value={description}
            onChange={handleDescriptionChange}
            onKeyDown={handleDescriptionKeyDown}
            onBlur={() => setIsEditingDescription(false)}
            rows={1}
            className="w-full bg-transparent resize-none overflow-hidden hover:bg-[#d1d5db52] transition-colors duration-200 rounded pl-2 outline-none focus:border-cyan-500 focus:border focus:bg-transparent caret-cyan-500 font-medium text-gray-600"
          />
        ) : (
          <div
            onClick={() => setIsEditingDescription(true)}
            className="text-gray-600 cursor-text px-2 py-[2px] hover:bg-[#d1d5db52] rounded transition-colors duration-200 whitespace-pre-wrap break-words line-clamp-2"
          >
            {description || "Add description"}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmojiNName;
