"use client";

import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { InitializeGuestAccount } from "@/server/components/guest-account";
import { RotatingLines } from "react-loader-spinner";

export default function GuestLogin() {
  const router = useRouter();
  const [status, setStatus] = useState("Initializing guest session...");

  useEffect(() => {
    let isMounted = true;
    const loginAsGuest = async () => {
      try {
        const initRes = await InitializeGuestAccount();
        if (!initRes.success) {
          if (isMounted) setStatus("Failed to initialize guest account.");
          return;
        }

        if (isMounted) setStatus("Logging you in...");
        const res = await signIn("credentials", {
          email: "guest@insightflow.com",
          password: "Guest1234!",
          redirect: false,
        });

        if (res?.error) {
          if (isMounted) setStatus("Failed to login as guest.");
        } else {
          if (isMounted) setStatus("Success! Redirecting...");
          // Give NextAuth a moment to set the cookie before router push
          setTimeout(() => {
            router.push("/dashboard");
          }, 500);
        }
      } catch (error) {
        if (isMounted) setStatus("An error occurred. Please try again.");
      }
    };

    loginAsGuest();
    return () => {
      isMounted = false;
    };
  }, [router]);

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center gap-4 bg-gray-50">
      <RotatingLines width="50" strokeColor="black" />
      <p className="text-gray-600 font-medium text-lg animate-pulse">{status}</p>
    </div>
  );
}
