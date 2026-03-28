// @ts-nocheck
"use client";

import { useEffect, useState } from "react";
import { Joyride } from "react-joyride";
import { useSession } from "next-auth/react";

const TOUR_STEPS: any[] = [
  {
    target: "body",
    content: (
      <div>
        <h2 className="text-xl font-bold mb-2">Welcome to InsightFlow!</h2>
        <p className="text-gray-600">Let&apos;s take a quick tour to help you get started with building powerful dashboards.</p>
      </div>
    ),
    placement: "center",
  },
  {
    target: ".tour-sidebar",
    content: (
      <div>
        <h3 className="font-bold text-lg">Sidebar Navigation</h3>
        <p>Access your connections and navigate between different dashboards from here.</p>
      </div>
    ),
    placement: "right",
  },
  {
    target: ".tour-dashboard-name",
    content: (
      <div>
        <h3 className="font-bold text-lg">Dashboard Title</h3>
        <p>Click here to rename your current dashboard.</p>
      </div>
    ),
    placement: "bottom",
  },
  {
    target: ".tour-add-block",
    content: (
      <div>
        <h3 className="font-bold text-lg">Add Blocks</h3>
        <p>Click this to add a new block (chart, table, etc.) to your dashboard.</p>
      </div>
    ),
    placement: "bottom",
  },
];

const TOUR_KEY_PREFIX = "insightflow_tour_completed_";

const TourGuide = () => {
  const [run, setRun] = useState(false);
  const { data: session, status: sessionStatus } = useSession();

  useEffect(() => {
    // Only run on client and when session is stable
    if (typeof window === "undefined" || sessionStatus !== "authenticated" || !session?.user?.id) return;

    const tourKey = `${TOUR_KEY_PREFIX}${session.user.id}`;
    const hasCompleted = localStorage.getItem(tourKey);

    if (!hasCompleted) {
      // Check if user is newly created or guest
      // For now, let's stick to localStorage but make it user-specific
      // If we want to be even more strict about "new user", we'd need createdAt from session
      
      const timer = setTimeout(() => {
        // Double check localStorage inside timeout to prevent race conditions from concurrent effects
        if (!localStorage.getItem(tourKey)) {
          setRun(true);
          // We set it immediately when we start to prevent re-triggers on refresh/navigation
          localStorage.setItem(tourKey, "true");
        }
      }, 1500); // Slightly longer delay to ensure full hydration
      
      return () => clearTimeout(timer);
    }
  }, [session, sessionStatus]);

  const handleJoyrideCallback = (data: any) => {
    const { status, action } = data;
    const finishedStatuses = ["finished", "skipped"];

    if (finishedStatuses.includes(status) || action === "close") {
      setRun(false);
      // Ensure it's set in case the effect timeout didn't or was cleared
      if (session?.user?.id) {
        localStorage.setItem(`${TOUR_KEY_PREFIX}${session.user.id}`, "true");
      }
    }
  };
// ... (rest of the component)

  const tourStyles: any = {
    options: {
      arrowColor: "#fff",
      backgroundColor: "#fff",
      overlayColor: "rgba(0, 0, 0, 0.6)",
      primaryColor: "#0ea5e9", // Tailwind sky-500
      textColor: "#333",
      zIndex: 10000,
    },
    tooltipContainer: {
      textAlign: "left",
    },
    buttonNext: {
      backgroundColor: "#0ea5e9",
      borderRadius: "6px",
      padding: "8px 16px",
    },
    buttonBack: {
      marginRight: "8px",
      color: "#6b7280", // Tailwind gray-500
    },
    tooltip: {
      borderRadius: "12px",
      padding: "20px",
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
    },
  };

  return (
    <Joyride
      callback={handleJoyrideCallback}
      continuous
      hideCloseButton
      run={run}
      scrollToFirstStep
      showProgress
      showSkipButton
      steps={TOUR_STEPS}
      styles={tourStyles}
    />
  );
};

export default TourGuide;
