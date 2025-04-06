import { useCurrentUser } from "@/hooks/use-current-user";
import { signOut } from "next-auth/react";
import { RefObject, useEffect, useRef } from "react";
import { MdOutlineLogout } from "react-icons/md";

const WorkspaceModal = ({
  handleWorkspaceClose,
  wrapperRef,
}: {
  handleWorkspaceClose: () => void;
  wrapperRef: RefObject<HTMLDivElement>
}) => {
  const user = useCurrentUser();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        handleWorkspaceClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleWorkspaceClose, wrapperRef]);

  const handleLogout = () => {
    signOut({ callbackUrl: "/auth/login" });
  };

  return (
    <div
      className="absolute top-full bg-primary-bg w-full p-3 mt-1 rounded-4 border drop-shadow-md border-gray-300"
    >
      <div className="text-sm flex flex-col gap-2 text-gray-600">
        <div>{user?.name}</div>
        <div>{user?.email}</div>
      </div>
      <div
        className="flex gap-2 items-center justify-end mt-4 hover:bg-cyan-200  transition-colors duration-300 px-2 py-1 rounded-md"
        onClick={handleLogout}
      >
        Logout <MdOutlineLogout />
      </div>
    </div>
  );
};

export default WorkspaceModal;
