import { redirect } from "next/navigation";
import { GetDefaultDashboardId } from "@/server/components/dashboard-commands";

// Resolve the default dashboard server-side and redirect during SSR. This avoids
// the client waterfall (render skeleton → hydrate → fetch id → navigate → fetch
// data) and lands the browser straight on /dashboard/{id}.
const Dashboard = async () => {
  const id = await GetDefaultDashboardId();

  if (id) {
    redirect(`/dashboard/${id}`);
  }

  return (
    <div className="p-4 h-full flex items-center justify-center text-gray-500">
      No dashboard found.
    </div>
  );
};

export default Dashboard;
