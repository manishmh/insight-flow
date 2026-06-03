import Link from "next/link";
import { LuArrowLeft } from "react-icons/lu";
import ImportDataClient from "./import-data-client";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <div className="h-full w-full overflow-y-auto">
      <div className="mx-auto max-w-5xl px-8 pt-6">
        <Link
          href="/dashboard/data-sources"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-cyan-700"
        >
          <LuArrowLeft /> Back to Data Sources
        </Link>
      </div>
      <ImportDataClient />
    </div>
  );
}
