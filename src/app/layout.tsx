import { cn } from "@/lib/utils";
import { auth } from "@/server/auth";
import "@/styles/globals.css";
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { Open_Sans } from "next/font/google";
import { ThemeProvider } from "../providers/theme-provider";
import { Toaster } from 'sonner'

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
    <SessionProvider session={session}>
      <html lang="en" suppressHydrationWarning>
        <body className={cn(font.className, "bg-[#e1e8ee] dark:bg-[#030014]")}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            storageKey="discord-theme"
            disableTransitionOnChange
          >
            {children}
            <Toaster position="bottom-right" expand={true} richColors/>
          </ThemeProvider>
        </body>
      </html>
    </SessionProvider>
  );
}
