import { useEffect, useRef, useState, useTransition } from "react";
import { LuShare2, LuCopy, LuCheck, LuX } from "react-icons/lu";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setDashboardShareId } from "@/store/slices/dashboardSlice";
import { SetDashboardSharing } from "@/server/components/dashboard-commands";

const ShareDashboardButton = () => {
  const dispatch = useAppDispatch();
  const { currentDashboard } = useAppSelector((state) => state.dashboard);
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [copied, setCopied] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  if (!currentDashboard) return null;

  const shareId = currentDashboard.shareId;
  const shareUrl =
    typeof window !== "undefined" && shareId
      ? `${window.location.origin}/share/${shareId}`
      : "";

  const toggleSharing = (enabled: boolean) => {
    startTransition(async () => {
      try {
        const newShareId = await SetDashboardSharing(currentDashboard.id, enabled);
        dispatch(setDashboardShareId({ id: currentDashboard.id, shareId: newShareId }));
        toast.success(enabled ? "Public link enabled" : "Public link disabled");
      } catch {
        toast.error("Failed to update sharing");
      }
    });
  };

  const copyLink = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Could not copy link");
    }
  };

  return (
    <div className="relative" ref={popoverRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 text-gray-600 hover:bg-gray-100 rounded-lg px-2.5 py-1.5 text-sm font-medium transition-colors"
        title="Share dashboard"
      >
        <LuShare2 className="text-base" /> Share
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-sm text-gray-800">Share dashboard</span>
            <button
              onClick={() => setOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <LuX />
            </button>
          </div>
          <p className="text-xs text-gray-500 mb-3">
            Anyone with the link can view a read-only copy of this dashboard.
          </p>

          {shareId ? (
            <>
              <div className="flex items-center gap-2 mb-3">
                <input
                  readOnly
                  value={shareUrl}
                  className="flex-1 text-xs border border-gray-300 rounded px-2 py-1.5 bg-gray-50 text-gray-700 outline-none"
                  onFocus={(e) => e.target.select()}
                />
                <button
                  onClick={copyLink}
                  className="p-2 rounded bg-blue-600 hover:bg-blue-700 text-white"
                  title="Copy link"
                >
                  {copied ? <LuCheck className="text-sm" /> : <LuCopy className="text-sm" />}
                </button>
              </div>
              <button
                onClick={() => toggleSharing(false)}
                disabled={isPending}
                className="w-full text-xs font-medium text-red-600 hover:bg-red-50 border border-red-200 rounded-md py-1.5 transition-colors disabled:opacity-50"
              >
                Disable public link
              </button>
            </>
          ) : (
            <button
              onClick={() => toggleSharing(true)}
              disabled={isPending}
              className="w-full text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md py-2 transition-colors disabled:opacity-50"
            >
              {isPending ? "Creating link…" : "Create public link"}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ShareDashboardButton;
