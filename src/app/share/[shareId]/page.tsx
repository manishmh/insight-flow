import { GetSharedDashboard } from "@/server/components/dashboard-commands";
import { notFound } from "next/navigation";
import SharedDashboardView from "./shared-dashboard-view";

export default async function SharedDashboardPage({
  params,
}: {
  params: { shareId: string };
}) {
  const dashboard = await GetSharedDashboard(params.shareId);
  if (!dashboard) notFound();

  return (
    <div className="min-h-screen bg-[#e1e8ee] p-4 sm:p-6">
      <div className="mb-4 flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-xl font-bold text-gray-800">{dashboard.name}</h1>
          <p className="text-xs text-gray-500">Read-only shared dashboard · InsightFlow</p>
        </div>
        <a
          href="/"
          className="text-xs font-medium text-blue-600 hover:text-blue-800 border border-blue-200 rounded-md px-3 py-1.5 bg-white"
        >
          Built with InsightFlow →
        </a>
      </div>
      <SharedDashboardView boards={dashboard.boards} />
    </div>
  );
}
