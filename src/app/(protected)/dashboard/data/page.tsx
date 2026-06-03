"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LuTrash2, LuDatabase, LuFileUp, LuRefreshCw } from "react-icons/lu";
import { toast } from "sonner";
import { fetchAllData, deleteData } from "@/server/components/indexedDB";
import { listSampleDatasets } from "@/server/components/block-functions";

type ImportedDataset = { id: string; name: string; rows: number };
type SampleDataset = { id: string; name: string };

export default function MyDataPage() {
  const router = useRouter();
  const [imported, setImported] = useState<ImportedDataset[]>([]);
  const [samples, setSamples] = useState<SampleDataset[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [records, sampleList] = await Promise.all([
        fetchAllData().catch(() => []),
        listSampleDatasets().catch(() => []),
      ]);
      setImported(
        (records || []).map((r: any) => ({
          id: r.id,
          name: r.name ?? r.jsonData?.name ?? "Untitled",
          rows: r.jsonData?.data?.data?.length ?? 0,
        }))
      );
      setSamples(sampleList || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteData(id);
      setImported((prev) => prev.filter((d) => d.id !== id));
      toast.success("Dataset removed");
    } catch {
      toast.error("Failed to remove dataset");
    }
  };

  return (
    <div className="h-full w-full overflow-y-auto p-8">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="flex items-end justify-between border-b border-gray-200 pb-5 gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">My Data</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
              Datasets available to your blocks. Remove imported datasets you no longer need, or
              import new data.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={load}
              className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              <LuRefreshCw className={loading ? "animate-spin" : ""} /> Refresh
            </button>
            <button
              onClick={() => router.push("/dashboard/data-sources")}
              className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              <LuFileUp /> Import data
            </button>
          </div>
        </div>

        <section>
          <h2 className="mb-3 text-sm font-bold uppercase tracking-widest text-gray-500">
            Imported datasets
          </h2>
          {loading ? (
            <div className="text-sm text-gray-400">Loading…</div>
          ) : imported.length === 0 ? (
            <div className="rounded-lg border border-dashed border-gray-300 bg-white p-6 text-center text-sm text-gray-500">
              No imported datasets yet.{" "}
              <button
                onClick={() => router.push("/dashboard/data-sources")}
                className="font-semibold text-blue-600 hover:underline"
              >
                Import some data
              </button>
              .
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {imported.map((d) => (
                <div
                  key={d.id}
                  className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
                >
                  <div className="grid h-10 w-10 place-items-center rounded-lg bg-cyan-50 text-cyan-600">
                    <LuDatabase />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-medium text-gray-800 capitalize">{d.name}</div>
                    <div className="text-xs text-gray-500">{d.rows.toLocaleString()} rows</div>
                  </div>
                  <button
                    onClick={() => handleDelete(d.id)}
                    title="Delete dataset"
                    className="rounded-md p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                  >
                    <LuTrash2 />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="mb-3 text-sm font-bold uppercase tracking-widest text-gray-500">
            Sample datasets
          </h2>
          {loading ? (
            <div className="text-sm text-gray-400">Loading…</div>
          ) : samples.length === 0 ? (
            <div className="text-sm text-gray-400">No sample datasets.</div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-3">
              {samples.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 shadow-sm"
                >
                  <div className="grid h-8 w-8 place-items-center rounded-md bg-gray-100 text-gray-500">
                    <LuDatabase className="text-sm" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-gray-700 capitalize">
                      {s.name}
                    </div>
                    <div className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                      Sample
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
