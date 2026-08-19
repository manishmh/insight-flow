"use client";

import { useState } from "react";
import { runInvestigationStep } from "@/server/ai/actions";
import { toast } from "sonner";
import { LuBot, LuSend, LuDatabase, LuLineChart, LuLightbulb, LuSearch } from "react-icons/lu";

export default function AIAnalystPage() {
  const [question, setQuestion] = useState("");
  const [connectionId, setConnectionId] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleAsk = async () => {
    if (!question.trim()) return;
    if (!connectionId) {
      toast.error("Please provide a connection ID for now (mocked in UI)");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await runInvestigationStep(question, connectionId);
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
        {!result ? (
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
           <div className="flex items-center gap-3">
             <span className="text-sm font-semibold text-gray-700 uppercase tracking-widest">Data Source</span>
             <input
                type="text"
                placeholder="Database Connection ID..."
                value={connectionId}
                onChange={(e) => setConnectionId(e.target.value)}
                className="w-full sm:w-64 bg-gray-50 border border-gray-300 rounded-md p-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
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
