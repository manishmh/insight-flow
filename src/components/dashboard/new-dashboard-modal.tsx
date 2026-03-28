import { RefObject, useEffect, useRef, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { RotatingLines } from "react-loader-spinner";

interface NewDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string) => Promise<void>;
  buttonRef: RefObject<HTMLButtonElement>;
  isPending: boolean;
}

const NewDashboardModal = ({
  isOpen,
  onClose,
  onCreate,
  buttonRef,
  isPending,
}: NewDashboardModalProps) => {
  const [dashboardName, setDashboardName] = useState("");
  const [position, setPosition] = useState({ top: "0px", left: "0px" });
  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Calculate and update position when modal opens or window resizes
  const updatePosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const modalWidth = 280; // min-w-[280px]
      const gap = 8;
      const viewportWidth = window.innerWidth;
      
      // Check if modal would overflow to the right
      const wouldOverflow = rect.right + gap + modalWidth > viewportWidth;
      
      // If it would overflow, position it to the left of the button instead
      const left = wouldOverflow 
        ? `${rect.left - modalWidth - gap}px`
        : `${rect.right + gap}px`;
      
      setPosition({
        top: `${rect.top}px`,
        left: left,
      });
    }
  };

  useEffect(() => {
    if (isOpen) {
      updatePosition();
      if (inputRef.current) {
        inputRef.current.focus();
      }
      
      // Update position on window resize
      window.addEventListener("resize", updatePosition);
      return () => {
        window.removeEventListener("resize", updatePosition);
      };
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isOpen, onClose, buttonRef]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (dashboardName.trim()) {
      try {
        await onCreate(dashboardName.trim());
        setDashboardName("");
        onClose();
      } catch (error) {
        // Error is already handled by the parent component (toast shown)
        // Keep modal open so user can try again
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
      setDashboardName("");
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop for mobile/click outside */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={modalRef}
        className="fixed z-50 bg-white border border-gray-300 rounded-lg shadow-lg p-4 min-w-[280px]"
        style={position}
        onKeyDown={handleKeyDown}
      >
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Dashboard Name
          </label>
          <input
            ref={inputRef}
            type="text"
            value={dashboardName}
            onChange={(e) => setDashboardName(e.target.value)}
            placeholder="Enter dashboard name"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            disabled={isPending}
          />
        </div>
        <div className="flex gap-2 justify-end">
          <button
            type="button"
            onClick={() => {
              onClose();
              setDashboardName("");
            }}
            disabled={isPending}
            className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-md transition-colors duration-200 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!dashboardName.trim() || isPending}
            className="px-3 py-1.5 text-sm bg-cyan-500 text-white rounded-md hover:bg-cyan-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isPending ? (
              <>
                <RotatingLines width="12" strokeColor="white" />
                Creating...
              </>
            ) : (
              <>
                <FaPlus className="text-xs" />
                Create
              </>
            )}
          </button>
        </div>
      </form>
      </div>
    </>
  );
};

export default NewDashboardModal;
