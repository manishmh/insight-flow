import AddEmoji from "@/components/global/svg/add-emoji";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setCurrentDashboard, updateBoardInDashboard } from "@/store/slices/dashboardSlice";
import { GetDashboardData } from "@/server/components/dashboard-commands";
import {
  DataStateInterface,
  useTableContext,
} from "@/contexts/sidepane-localhost-storage-context";
import { setBoardName } from "@/server/components/block-functions";
import { getTableState } from "@/utils/localStorage";
import React, { useEffect, useRef, useState } from "react";

const EmojiNName = () => {
  const dispatch = useAppDispatch();
  const { activeBoard } = useAppSelector((state) => state.board);
  const [nameInputValue, setNameInputValue] = useState<string>(activeBoard?.name || "");
  console.log("input value", nameInputValue);
  const [description, setDescription] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);

  const { updateState } = useTableContext();

  const nameRef = useRef<HTMLTextAreaElement>(null);
  const descRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setNameInputValue(activeBoard?.name || "Untitled");
  }, [activeBoard?.name]);

  useEffect(() => {
    if (activeBoard?.id) {
      const TableLocalStorageData: DataStateInterface = getTableState(
        activeBoard.id
      );
      setDescription(TableLocalStorageData?.description || "");
    }
  }, [activeBoard?.id]);

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
    if (e.key === "Enter" && !e.shiftKey && activeBoard) {
      e.preventDefault();
      const updatedBoard = await setBoardName(
        nameInputValue,
        activeBoard.boardId
      );
      setNameInputValue(updatedBoard.name);
      setIsEditingName(false);
      
      // Update Redux store
      dispatch(updateBoardInDashboard(updatedBoard));
      
      // Refresh dashboard to get latest state
      const updatedDashboard = await GetDashboardData(updatedBoard.dashboardId);
      if (updatedDashboard) {
        dispatch(setCurrentDashboard(updatedDashboard));
      }
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
    if (e.key === "Enter" && !e.shiftKey && activeBoard) {
      e.preventDefault();
      updateState(activeBoard.id, "description", description);
      setIsEditingDescription(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-start gap-2 mr-8">
        <div className="opacity-50 transition-colors duration-300 rounded-sm p-1 hover:bg-[#d1d5db52]">
          <AddEmoji />
        </div>
        <div className="w-full pt-0.5">
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
              {activeBoard?.name || "Untitled"}
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
