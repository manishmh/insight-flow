import { cn } from "@/lib/utils";
import { ReactNode, useEffect, useRef } from "react";

const Modal = ({
  handleModalState,
  className,
  children,
}: {
  handleModalState: () => void;
  className?: string;
  children: ReactNode;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        handleModalState();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [handleModalState]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "absolute right-full space-y-2 mr-2 rounded-md shadow border border-gray-300 w-[250px] max-h-[320px] min-h-[220px] bg-[#e1e8ee]",
        className
      )}
    >
      {children}
    </div>
  );
};

export default Modal;
