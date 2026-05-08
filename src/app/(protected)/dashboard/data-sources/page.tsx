import Link from "next/link";
import { FaDatabase, FaFileImport } from "react-icons/fa6";

export const dynamic = "force-dynamic";

const options = [
  {
    title: "Import file",
    description: "Upload JSON or CSV data from your computer and create a dashboard from it.",
    href: "/dashboard/data-sources/import",
    icon: <FaFileImport />,
    cta: "Import data",
  },
  {
    title: "Postgres connection",
    description: "Fetch selected rows from an external PostgreSQL database with a SQL query.",
    href: "/dashboard/data-sources/postgres",
    icon: <FaDatabase />,
    cta: "Connect Postgres",
  },
];

export default function Page() {
  return (
    <div className="h-full w-full overflow-y-auto p-8">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="border-b border-gray-200 pb-5">
          <h1 className="text-2xl font-bold text-gray-800">Data Sources</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
            Choose how data enters Insight Flow. File imports keep credentials out of the app, while Postgres is available for controlled direct imports.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {options.map((option) => (
            <Link
              key={option.href}
              href={option.href}
              className="group rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:border-cyan-300 hover:shadow-md"
            >
              <div className="flex items-start gap-4">
                <div className="grid h-11 w-11 place-items-center rounded-lg bg-cyan-50 text-xl text-cyan-600">
                  {option.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="font-semibold text-gray-800">{option.title}</h2>
                  <p className="mt-1 min-h-[48px] text-sm leading-6 text-gray-500">
                    {option.description}
                  </p>
                  <div className="mt-4 text-sm font-semibold text-cyan-700 group-hover:text-cyan-800">
                    {option.cta}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
