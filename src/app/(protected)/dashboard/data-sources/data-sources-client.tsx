"use client"

import { useState } from "react";
import { fetchExternalPostgresData } from "@/server/components/database-actions";
import { saveData } from "@/server/components/indexedDB";
import { toast } from "sonner";
import { LuDatabase, LuKey, LuTextCursorInput } from "react-icons/lu";
import { FaTerminal } from "react-icons/fa6";

export default function DataSourcesPage() {
  const [connectionString, setConnectionString] = useState("");
  const [query, setQuery] = useState("");
  const [sourceName, setSourceName] = useState("");
  const [isFetching, setIsFetching] = useState(false);

  const handleFetchAndSave = async () => {
    if (!connectionString || !query || !sourceName) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsFetching(true);
    try {
      const result = await fetchExternalPostgresData(connectionString, query);
      if (result.success && result.data) {
        const randomId = Math.random().toString(36).substring(7);
        await saveData(randomId, sourceName, {
          id: randomId,
          name: sourceName,
          data: result.data
        });
        toast.success(`Data source "${sourceName}" successfully imported!`);
        setConnectionString("");
        setQuery("");
        setSourceName("");
      } else {
        toast.error(result.error || "Failed to fetch data.");
      }
    } catch (e: any) {
      toast.error(e.message || "An error occurred.");
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <div className="p-8 h-full w-full flex flex-col items-center overflow-y-auto">
      <div className="w-full max-w-3xl space-y-8 mt-4">
        {/* Header Section */}
        <div className="border-b border-gray-300 pb-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-cyan-500/10 p-2 rounded-lg text-cyan-600">
              <LuDatabase className="text-2xl" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">New Postgres Connection</h1>
          </div>
          <p className="text-gray-500 max-w-xl text-sm leading-relaxed">
            Link an external PostgreSQL database (like NeonDB) directly into your workspace. Write a query to fetch the specific data needed for your dashboard blocks.
          </p>
        </div>

        {/* Form Section */}
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <LuTextCursorInput className="text-gray-400" /> Connection Name
            </label>
            <input 
              type="text" 
              placeholder="e.g. Production Analytics Users"
              value={sourceName}
              onChange={(e) => setSourceName(e.target.value)}
              className="w-full bg-[#f4f7f9] border border-gray-300 hover:border-gray-400 focus:bg-white rounded-lg p-3 text-sm text-gray-800 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all shadow-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <LuKey className="text-gray-400" /> Connection String
            </label>
            <input 
              type="password" 
              placeholder="postgres://user:password@host:port/dbname"
              value={connectionString}
              onChange={(e) => setConnectionString(e.target.value)}
              className="w-full bg-[#f4f7f9] border border-gray-300 hover:border-gray-400 focus:bg-white rounded-lg p-3 text-sm text-gray-800 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all font-mono placeholder:font-sans shadow-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <FaTerminal className="text-gray-400" /> SQL Query
            </label>
            <div className="relative group">
              <textarea 
                placeholder="SELECT * FROM users LIMIT 1000;"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-[#1e293b] border border-gray-700 rounded-lg p-4 text-sm text-cyan-50 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition-all h-40 font-mono shadow-inner resize-y"
                spellCheck="false"
              />
              <div className="absolute top-3 right-3 px-2 py-1 bg-gray-800/50 rounded text-[10px] text-gray-400 font-medium select-none pointer-events-none uppercase tracking-wider">
                SQL Editor
              </div>
            </div>
            <p className="text-xs text-gray-500 pt-1">
              Select the exact columns and rows you want imported to optimize performance.
            </p>
          </div>

          <div className="pt-4">
            <button
              onClick={handleFetchAndSave}
              disabled={isFetching}
              className={`w-full py-3 px-4 rounded-lg font-semibold text-white shadow-sm transition-all duration-200 flex justify-center items-center gap-2 ${
                isFetching ? "bg-cyan-400 cursor-not-allowed" : "bg-cyan-600 hover:bg-cyan-700 hover:shadow-md hover:-translate-y-[1px] active:translate-y-0"
              }`}
            >
              {isFetching ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Connecting & Fetching Data...
                </>
              ) : "Fetch & Save Connection"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
