"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { IoSearch } from "react-icons/io5";
import { LuLayoutDashboard, LuComponent } from "react-icons/lu";
import { useAppDispatch } from "@/store/hooks";
import { toggleSearch } from "@/store/slices/uiSlice";
import { GetDashboardsWithBoards } from "@/server/components/dashboard-commands";

type DashWithBoards = {
  id: string;
  name: string;
  boards: { id: string; name: string; currentDataId: string | null }[];
};

const SearchModal = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [dashboards, setDashboards] = useState<DashWithBoards[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    GetDashboardsWithBoards()
      .then((d) => setDashboards((d as DashWithBoards[]) ?? []))
      .catch(() => {});
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dispatch(toggleSearch());
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [dispatch]);

  const q = query.trim().toLowerCase();

  const dashResults = useMemo(
    () => dashboards.filter((d) => !q || d.name.toLowerCase().includes(q)),
    [dashboards, q]
  );

  const blockResults = useMemo(() => {
    if (!q) return [];
    const out: { dashId: string; dashName: string; id: string; name: string }[] = [];
    for (const d of dashboards) {
      for (const b of d.boards) {
        if (b.name.toLowerCase().includes(q)) {
          out.push({ dashId: d.id, dashName: d.name, id: b.id, name: b.name });
        }
      }
    }
    return out.slice(0, 50);
  }, [dashboards, q]);

  const go = (dashId: string) => {
    dispatch(toggleSearch());
    router.push(`/dashboard/${dashId}`);
  };

  const empty = dashResults.length === 0 && blockResults.length === 0;

  return (
    <>
      <div
        className="fixed inset-0 z-[49] bg-black/20"
        onClick={() => dispatch(toggleSearch())}
        aria-hidden="true"
      />
      <div className="fixed z-50 bg-white w-full max-w-[600px] max-h-[70vh] flex flex-col rounded-xl shadow-2xl top-[15%] left-1/2 -translate-x-1/2 overflow-hidden border border-gray-200">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200">
          <IoSearch className="text-gray-400 text-lg shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search dashboards and blocks…"
            className="flex-1 outline-none text-sm text-gray-800 placeholder:text-gray-400"
          />
          <kbd className="text-[10px] text-gray-400 border border-gray-200 rounded px-1.5 py-0.5">
            ESC
          </kbd>
        </div>

        <div className="overflow-y-auto p-2">
          {empty && (
            <div className="py-10 text-center text-sm text-gray-400">No results found.</div>
          )}

          {dashResults.length > 0 && (
            <div className="mb-2">
              <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                Dashboards
              </div>
              {dashResults.map((d) => (
                <button
                  key={d.id}
                  onClick={() => go(d.id)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 text-left transition-colors"
                >
                  <LuLayoutDashboard className="text-blue-500 shrink-0" />
                  <span className="text-sm text-gray-800 truncate">{d.name}</span>
                </button>
              ))}
            </div>
          )}

          {blockResults.length > 0 && (
            <div>
              <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                Blocks
              </div>
              {blockResults.map((b) => (
                <button
                  key={b.id}
                  onClick={() => go(b.dashId)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 text-left transition-colors"
                >
                  <LuComponent className="text-cyan-500 shrink-0" />
                  <span className="text-sm text-gray-800 truncate capitalize">{b.name}</span>
                  <span className="ml-auto text-[11px] text-gray-400 truncate">{b.dashName}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SearchModal;
