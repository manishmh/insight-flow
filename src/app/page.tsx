"use client";

import CollaborateRealtime from "@/components/home/collaborate-realtime/collaborate-realtime";
import ConnectYourData from "@/components/home/connect-data/connect-your-data";
import Hero from "@/components/home/hero";
import Navbar from "@/components/home/navbar";
import PowerfulOutOfBox from "@/components/home/powerful-out-of-box/powerful-out-of-box";
import QueryDataSql from "@/components/home/query-data/query-data-sql";
import Sponsors from "@/components/home/sponsors/sponsors";
import VisualizeData from "@/components/home/visualize-data/visualize-data";
import { ModeToggle } from "@/components/toggle-mode";

export default function Home() {
  return (
    <main className="font-sans max-w-screen-2xl mx-auto ">
      {/* <ModeToggle /> */}
      <Navbar />
      <div className="space-y-[150px] md:space-y-[200px]">
        <Hero />
        <Sponsors />
        <ConnectYourData />
        <QueryDataSql />
        <VisualizeData />
        <PowerfulOutOfBox />
        {/* <CollaborateRealtime /> */}
        <div className="h-[100vh]"></div>
      </div>
    </main>
  );
}
