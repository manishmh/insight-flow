"use client";

import { useCurrentUser } from "@/hooks/use-current-user";
import { motion, AnimatePresence } from "framer-motion";
import { LuMail, LuUser, LuCalendar, LuPieChart, LuLayout, LuCheck, LuLoader2, LuPencil, LuX } from "react-icons/lu";
import { useState, useTransition } from "react";
import { updateUserProfile } from "@/server/components/user-actions";
import { toast } from "sonner";

const ProfilePage = () => {
  const user = useCurrentUser();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [isPending, startTransition] = useTransition();

  const handleSave = () => {
    if (!name.trim() || name === user?.name) {
      setIsEditing(false);
      return;
    }

    startTransition(async () => {
      const result = await updateUserProfile(name);
      if (result.success) {
        toast.success(result.success);
        setIsEditing(false);
      } else {
        toast.error(result.error);
      }
    });
  };

  const stats = [
    { label: "Dashboards", value: "4", icon: <LuLayout />, color: "bg-blue-100 text-blue-600" },
    { label: "Data Sources", value: "2", icon: <LuPieChart />, color: "bg-purple-100 text-purple-600" },
  ];

  return (
    <div className="p-8 max-w-4xl mx-auto h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header/Cover Placeholder */}
          <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700"></div>
          
          <div className="px-8 pb-8">
            <div className="relative flex justify-between items-end -mt-12 mb-6">
              <div className="p-1 bg-white rounded-2xl shadow-lg">
                <div className="w-24 h-24 bg-gray-100 rounded-xl flex items-center justify-center text-3xl font-bold text-blue-600 uppercase transition-all duration-300">
                  {name?.[0] || user?.name?.[0] || "U"}
                </div>
              </div>
              
              <AnimatePresence mode="wait">
                {!isEditing ? (
                  <motion.button
                    key="edit"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    onClick={() => setIsEditing(true)}
                    className="px-5 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm flex items-center gap-2"
                  >
                    <LuPencil className="text-xs" />
                    Edit Profile
                  </motion.button>
                ) : (
                  <motion.div
                    key="actions"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex gap-2"
                  >
                    <button
                      onClick={() => { setIsEditing(false); setName(user?.name || ""); }}
                      className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-semibold text-gray-500 hover:bg-gray-100 transition-colors"
                      disabled={isPending}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="px-5 py-2 bg-blue-600 border border-blue-600 rounded-lg text-sm font-semibold text-white hover:bg-blue-700 transition-all shadow-md shadow-blue-100 flex items-center gap-2"
                      disabled={isPending}
                    >
                      {isPending ? <LuLoader2 className="animate-spin" /> : <LuCheck />}
                      Save Changes
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="space-y-4">
              {isEditing ? (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Display Name</label>
                  <input
                    type="text"
                    value={name}
                    autoFocus
                    onChange={(e) => setName(e.target.value)}
                    className="text-2xl font-bold text-gray-900 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1 w-full max-w-md focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
              ) : (
                <div className="space-y-1">
                  <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{user?.name}</h1>
                  <p className="text-gray-500 flex items-center gap-1.5 font-medium">
                    <LuMail className="text-sm opacity-70" />
                    {user?.email}
                  </p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
              {stats.map((stat, i) => (
                <div key={i} className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 flex items-center gap-4 transition-all hover:border-gray-200 hover:bg-gray-50">
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    {stat.icon}
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900 tracking-tight">{stat.value}</div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-8 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div>
                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Account Overview</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-gray-600">
                    <LuUser className="text-gray-400 text-sm" />
                    <span className="text-xs font-medium italic">Member since March 2026</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <LuCalendar className="text-gray-400 text-sm" />
                    <span className="text-xs font-medium italic">Last activity detected today</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Platform Stats</h3>
                <div className="space-y-3 px-4 py-3 bg-blue-50/50 rounded-xl border border-blue-100/50">
                   <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-500">Storage Used</span>
                      <span className="font-bold text-blue-700">1.2 MB / 10 MB</span>
                   </div>
                   <div className="w-full bg-blue-200/50 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-blue-600 w-1/6 h-full rounded-full"></div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default ProfilePage;