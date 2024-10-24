'use client'

import { logout } from "@/actions/logout"
import MainContent from "@/components/dashboard/main-content/main-content";
import { useCurrentUser } from "@/hooks/use-current-user"
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const Dashboard = () => {
  const router = useRouter();
  const user = useCurrentUser();

  const signout = async () => {
    try {
      await logout();
      toast.success('You have been signed out');

      router.push('/auth/login');
    } catch (error) {
      toast.error('Failed to sign out. Try again later');
    }
  };

  return (
    <div className="h-full">
      {/* <div className="text-red-700 text-xl">Feature in progress..</div> */}
      <MainContent />
    </div>
  );
}

export default Dashboard;
