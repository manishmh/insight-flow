import { cn } from "@/lib/utils";
import { auth } from "@/server/auth";
import "@/styles/globals.css";
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { Open_Sans } from "next/font/google";
import { Toaster } from "sonner";
import { ThemeProvider } from "../providers/theme-provider";

const font = Open_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Insight Flow",
  description: "Data visularizer for databases",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          font.className,
          "bg-[#e1e8ee] dark:bg-[#030014] scroll-smooth h-full"
        )}
      >
        <SessionProvider session={session}>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
            storageKey="discord-theme"
            disableTransitionOnChange
          >
            {children}
            <Toaster
              position="bottom-right"
              expand={true}
              duration={2000}
              richColors
            />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
