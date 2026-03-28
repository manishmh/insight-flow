"use client";

import { LuShield, LuPalette, LuBell, LuLogOut } from "react-icons/lu";
import { useState } from "react";
import { motion } from "framer-motion";
import { signOut } from "next-auth/react";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("appearance");

  const tabs = [
    { id: "appearance", label: "Appearance", icon: <LuPalette /> },
    { id: "security", label: "Security", icon: <LuShield /> },
    { id: "notifications", label: "Notifications", icon: <LuBell /> },
  ];

  return (
    <div className="p-8 max-w-4xl mx-auto h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 leading-tight">Settings</h1>
        <p className="text-gray-500 mt-2">Manage your account settings and preferences.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 flex flex-col gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                  : "text-gray-600 hover:bg-white hover:text-gray-900 border border-transparent hover:border-gray-200"
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
          <hr className="my-4 border-gray-200" />
          <button 
            onClick={() => signOut()}
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-all duration-200"
          >
            <LuLogOut className="text-lg" />
            Logout
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "appearance" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Appearance</h3>
                  <p className="text-sm text-gray-500">Customize how InsightFlow looks for you.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 border-2 border-blue-600 rounded-xl bg-gray-50 cursor-pointer">
                    <div className="h-20 bg-white rounded-lg shadow-inner mb-3 border border-gray-200"></div>
                    <span className="text-sm font-medium text-gray-900">Light Mode</span>
                  </div>
                  <div className="p-4 border-2 border-transparent relative rounded-xl bg-gray-900 cursor-not-allowed text-white overflow-hidden group">
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[1px] z-10 transition-opacity">
                      <span className="bg-white/10 text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded border border-white/20">Coming Soon</span>
                    </div>
                    <div className="h-20 bg-gray-800 rounded-lg shadow-inner mb-3 border border-gray-700 opacity-50"></div>
                    <span className="text-sm font-medium opacity-50">Dark Mode</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Security</h3>
                  <p className="text-sm text-gray-500">Enable additional security features to protect your account.</p>
                </div>
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg flex items-start gap-3">
                  <LuShield className="text-orange-600 mt-1" />
                  <div>
                    <h4 className="text-sm font-bold text-orange-800">Two-Factor Authentication</h4>
                    <p className="text-xs text-orange-700 mt-1">Enhance your account security by adding an extra layer of protection.</p>
                    <button className="mt-3 text-sm font-bold text-orange-900 underline hover:text-orange-950 transition-colors">Enable 2FA</button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <LuBell className="text-2xl text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">No new notifications</h3>
                <p className="text-sm text-gray-500 mt-1">We&apos;ll notify you when something important happens.</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
