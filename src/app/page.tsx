"use client";

import ConnectYourData from "@/components/home/connect-data/connect-your-data";
import Hero from "@/components/home/hero";
import Navbar from "@/components/home/navbar";
import QueryData from "@/components/home/query-data/query-data";
import QueryDataSql from "@/components/home/query-data/query-data-sql";
import Sponsors from "@/components/home/sponsors/sponsors";
import VisualizeData from "@/components/home/visualize-data/visualize-data";
import { ModeToggle } from "@/components/toggle-mode";

export default function Home() {
  return (
    <main className="font-sans max-w-screen-3xl mx-auto">
      {/* <ModeToggle /> */}
      <Navbar />
      <div className="space-y-[250px]">
        <Hero />
        <Sponsors />
        <ConnectYourData />
        <QueryDataSql />
        <VisualizeData />
        <div className="h-screen"></div>
      </div>
    </main>
  );
}
