import { useCurrentUser } from "@/hooks/use-current-user";
import { MdOutlineLogout } from "react-icons/md";
import { signOut } from "next-auth/react";

const WorkspaceModal = () => {
  const user = useCurrentUser();

  const handleLogout = () => {
    signOut({ callbackUrl: "/auth/login" });
  }

  return (
    <div className="absolute top-full bg-primary-bg w-full p-3 py-4 mt-1 rounded-4 border drop-shadow-md border-gray-300">
      <div className="text-sm flex flex-col gap-2 text-gray-600">
        <div>{user?.name}</div>
        <div>{user?.email}</div>
      </div>
      <div className="flex gap-2 items-center justify-end mt-8 hover:bg-cyan-200 hover:font-semibold transition-colors duration-300 px-2 py-1 rounded-md" onClick={handleLogout}>
        Logout <MdOutlineLogout />
      </div>
    </div>
  );
};

export default WorkspaceModal;
