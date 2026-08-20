"use client";

import { useState, useEffect } from "react";
import { runInvestigationStep } from "@/server/ai/actions";
import { toast } from "sonner";
import { LuBot, LuSend, LuDatabase, LuLineChart, LuLightbulb, LuSearch, LuChevronDown } from "react-icons/lu";
import { fetchAllData, fetchDataById } from "@/server/components/indexedDB";
import { fetchSampleDataWithId } from "@/server/components/block-functions";
import { listSampleDatasets } from "@/server/components/block-functions";
import Link from "next/link";

export default function AIAnalystPage() {
  const [question, setQuestion] = useState("");
  const [connectionId, setConnectionId] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const [userDatasets, setUserDatasets] = useState<{id: string, name: string}[]>([]);
  const [sampleDatasets, setSampleDatasets] = useState<{id: string, name: string}[]>([]);

  useEffect(() => {
    const loadDatasets = async () => {
      try {
        const [records, sampleList] = await Promise.all([
          fetchAllData().catch(() => []),
          listSampleDatasets().catch(() => []),
        ]);

        const mappedRecords = (records || []).map((r: any) => ({
            id: r.id,
            name: r.name ?? r.jsonData?.name ?? "Untitled",
        }));

        setUserDatasets(mappedRecords);
        setSampleDatasets(sampleList || []);

        if (mappedRecords.length > 0) {
           setConnectionId(mappedRecords[0].id);
        } else if (sampleList && sampleList.length > 0) {
           setConnectionId(sampleList[0].id);
        }
      } catch (error) {
        console.error("Failed to load datasets:", error);
      }
    };
    loadDatasets();
  }, []);

  const handleAsk = async () => {
    if (!question.trim()) return;
    if (!connectionId) {
      toast.error("Please select a dataset first.");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      // Load context payload for the selected connectionId
      let data = await fetchDataById(connectionId);
      if (!data || Object.keys(data).length === 0) {
        data = await fetchSampleDataWithId(connectionId) as any;
      }

      let contextPayload = {
         boardName: data?.name || "Selected Dataset",
         columns: data?.data?.columns || [],
         sampleData: (data?.data?.data || []).slice(0, 50)
      };

      const res = await runInvestigationStep(question, contextPayload);
      if (res.success && res.text) {
        setResult(res.text);
      } else {
        toast.error(res.error || "Failed to run investigation");
      }
    } catch (e: any) {
      toast.error(e.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <div className="p-8 border-b border-gray-200 bg-white">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <LuBot className="text-blue-600" /> AI Analytics
        </h1>
        <p className="text-gray-500 mt-2 text-sm">Ask questions, investigate trends, find anomalies and understand your data.</p>
      </div>

      <div className="flex-1 overflow-y-auto p-8">
        {(!result && userDatasets.length === 0 && sampleDatasets.length === 0) ? (
             <div className="h-full flex flex-col items-center justify-center text-center p-8 max-w-md mx-auto">
               <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                 <LuDatabase className="text-2xl text-gray-400" />
               </div>
               <h2 className="text-xl font-bold text-gray-800 mb-2">No Data Available</h2>
               <p className="text-gray-500 mb-6">You need to import or connect a dataset before running an AI analysis.</p>
               <Link href="/dashboard/data-sources" className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                 Connect Data Source
               </Link>
             </div>
        ) : !result ? (
           <div className="max-w-4xl mx-auto space-y-8">
             <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-widest mb-4">Suggested Analyses</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 rounded-lg bg-blue-50/50 border border-blue-100 hover:border-blue-300 cursor-pointer transition flex flex-col gap-2" onClick={() => setQuestion("Explain this data")}>
                    <LuLightbulb className="text-blue-500 text-xl" />
                    <span className="text-sm font-medium text-gray-800">Explain Data</span>
                  </div>
                  <div className="p-4 rounded-lg bg-green-50/50 border border-green-100 hover:border-green-300 cursor-pointer transition flex flex-col gap-2" onClick={() => setQuestion("Compare periods")}>
                    <LuLineChart className="text-green-500 text-xl" />
                    <span className="text-sm font-medium text-gray-800">Compare Periods</span>
                  </div>
                  <div className="p-4 rounded-lg bg-orange-50/50 border border-orange-100 hover:border-orange-300 cursor-pointer transition flex flex-col gap-2" onClick={() => setQuestion("Find anomalies")}>
                    <LuSearch className="text-orange-500 text-xl" />
                    <span className="text-sm font-medium text-gray-800">Find Anomalies</span>
                  </div>
                  <div className="p-4 rounded-lg bg-purple-50/50 border border-purple-100 hover:border-purple-300 cursor-pointer transition flex flex-col gap-2" onClick={() => setQuestion("Find top contributors")}>
                    <LuDatabase className="text-purple-500 text-xl" />
                    <span className="text-sm font-medium text-gray-800">Top Contributors</span>
                  </div>
                </div>
             </div>
           </div>
        ) : (
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 max-w-4xl mx-auto space-y-6">
            <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-4">AI Analysis</h2>
            <div className="prose prose-sm md:prose-base text-gray-700 max-w-none whitespace-pre-wrap leading-relaxed">
              {result}
            </div>
            <div className="flex gap-4 pt-6 border-t border-gray-100">
               <button className="text-sm font-semibold text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-md transition-colors border border-blue-200">View SQL</button>
               <button className="text-sm font-semibold text-gray-600 hover:bg-gray-100 px-4 py-2 rounded-md transition-colors border border-gray-200">View Evidence</button>
               <button className="text-sm font-semibold text-gray-600 hover:bg-gray-100 px-4 py-2 rounded-md transition-colors border border-gray-200">View Investigation</button>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto flex flex-col gap-3">
           <div className="flex flex-col gap-2">
             <span className="text-sm font-semibold text-gray-700 uppercase tracking-widest">Data Source</span>
             <div className="flex flex-wrap items-center gap-2">
                {userDatasets.slice(0, 5).map(d => (
                  <button
                    key={d.id}
                    onClick={() => setConnectionId(d.id)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${connectionId === d.id ? 'bg-blue-600 text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}
                  >
                    {d.name}
                  </button>
                ))}

                {userDatasets.length > 5 && (
                  <div className="relative group">
                    <select
                      value={userDatasets.some(d => d.id === connectionId) && !userDatasets.slice(0, 5).some(d => d.id === connectionId) ? connectionId : ""}
                      onChange={(e) => setConnectionId(e.target.value)}
                      className="appearance-none bg-white border border-gray-200 text-gray-700 px-3 py-1.5 text-sm font-medium rounded-full outline-none focus:ring-2 focus:ring-blue-500 pr-8 cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <option value="" disabled>More Datasets</option>
                      {userDatasets.slice(5).map(d => (
                         <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                    <LuChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                )}

                {sampleDatasets.length > 0 && (
                  <div className="relative group ml-auto">
                    <select
                      value={sampleDatasets.some(d => d.id === connectionId) ? connectionId : ""}
                      onChange={(e) => setConnectionId(e.target.value)}
                      className="appearance-none bg-indigo-50 border border-indigo-100 text-indigo-700 px-3 py-1.5 text-sm font-medium rounded-full outline-none focus:ring-2 focus:ring-indigo-500 pr-8 cursor-pointer hover:bg-indigo-100 transition-colors"
                    >
                      <option value="" disabled>Sample Data</option>
                      {sampleDatasets.map(d => (
                         <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                    <LuChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-indigo-400 pointer-events-none" />
                  </div>
                )}
             </div>
           </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Ask anything about your data..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAsk()}
              disabled={loading}
              className="w-full bg-gray-50 border border-gray-300 rounded-xl p-4 pr-16 text-base focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 transition-all shadow-inner"
            />
            <button
              onClick={handleAsk}
              disabled={loading}
              className="absolute right-3 top-3 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 shadow-sm transition-colors"
            >
              <LuSend className="text-lg" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
