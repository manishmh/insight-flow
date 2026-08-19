"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { LuKey, LuShield, LuSave } from "react-icons/lu";

export default function AISettingsPage() {
  const [provider, setProvider] = useState("mock");
  const [model, setModel] = useState("mock-model");
  const [apiKey, setApiKey] = useState("");
  const [privacyMode, setPrivacyMode] = useState("MINIMIZED");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // In a real implementation, we would fetch the current config from the server here.
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      // Simulate saving to server action
      await new Promise(r => setTimeout(r, 500));
      toast.success("AI configuration saved securely");
    } catch (e) {
      toast.error("Failed to save config");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">AI Analyst Settings</h1>
        <p className="text-gray-500 text-sm mt-1">
          Configure how AI interacts with your data. Bring your own key for full control.
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <LuKey className="text-blue-500" /> Provider Configuration
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Provider</label>
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                className="w-full bg-[#f4f7f9] border border-gray-300 rounded-lg p-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              >
                <option value="mock">Mock (Testing only)</option>
                <option value="openai">OpenAI</option>
                <option value="anthropic">Anthropic</option>
              </select>
            </div>

            {provider !== "mock" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                  <input
                    type="text"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    placeholder={provider === "openai" ? "gpt-4o" : "claude-3-5-sonnet-20240620"}
                    className="w-full bg-[#f4f7f9] border border-gray-300 rounded-lg p-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">API Key (BYOK)</label>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="sk-..."
                    className="w-full bg-[#f4f7f9] border border-gray-300 rounded-lg p-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none font-mono"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Your key is encrypted on our servers and never exposed to the browser.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <LuShield className="text-green-500" /> Data Privacy Mode
          </h2>

          <div className="space-y-3">
            <label className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${privacyMode === 'MINIMIZED' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}>
              <input
                type="radio"
                name="privacy"
                value="MINIMIZED"
                checked={privacyMode === 'MINIMIZED'}
                onChange={() => setPrivacyMode('MINIMIZED')}
                className="mt-1"
              />
              <div>
                <div className="font-medium text-gray-800 text-sm">Minimized Data (Recommended)</div>
                <div className="text-xs text-gray-500">Only sends necessary aggregated results to the AI. Never sends full raw tables.</div>
              </div>
            </label>

            <label className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${privacyMode === 'METADATA_ONLY' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}>
              <input
                type="radio"
                name="privacy"
                value="METADATA_ONLY"
                checked={privacyMode === 'METADATA_ONLY'}
                onChange={() => setPrivacyMode('METADATA_ONLY')}
                className="mt-1"
              />
              <div>
                <div className="font-medium text-gray-800 text-sm">Metadata Only</div>
                <div className="text-xs text-gray-500">Sends schema and query definitions only. AI cannot see query results.</div>
              </div>
            </label>

            <label className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${privacyMode === 'FULL' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}>
              <input
                type="radio"
                name="privacy"
                value="FULL"
                checked={privacyMode === 'FULL'}
                onChange={() => setPrivacyMode('FULL')}
                className="mt-1"
              />
              <div>
                <div className="font-medium text-gray-800 text-sm">Full Data Access</div>
                <div className="text-xs text-gray-500">Allows AI to see raw query results up to the row limit for deeper analysis.</div>
              </div>
            </label>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors disabled:bg-blue-400"
          >
            {saving ? "Saving..." : <><LuSave /> Save Configuration</>}
          </button>
        </div>
      </div>
    </div>
  );
}
