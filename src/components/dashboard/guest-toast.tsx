"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

const GuestToast = () => {
  const { data: session } = useSession();
  const hasShownToast = useRef(false);

  useEffect(() => {
    if (session?.user?.email === "guest@insightflow.com" && !hasShownToast.current) {
      hasShownToast.current = true;
      toast.info("You are browsing as a Guest. Dummy data is provided for your session.", {
        duration: 8000,
        position: "top-center"
      });
    }
  }, [session]);

  return null;
};

export default GuestToast;
