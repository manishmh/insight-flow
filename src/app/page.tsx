"use client";

import Footer from "@/components/global/footer/footer";
import ConnectYourData from "@/components/home/connect-data/connect-your-data";
import EffortlessWorkspace from "@/components/home/efforless-workplace/efforless-workplace";
import Hero from "@/components/home/hero";
import Navbar from "@/components/home/navbar";
import PowerfulOutOfBox from "@/components/home/powerful-out-of-box/powerful-out-of-box";
import QueryDataSql from "@/components/home/query-data/query-data-sql";
import Sponsors from "@/components/home/sponsors/sponsors";
import VisualizeData from "@/components/home/visualize-data/visualize-data";
import { ModeToggle } from "@/components/toggle-mode";

export default function Home() {
  return (
    <main className="space-y-[150px] md:space-y-[200px]">
      <div className="font-sans max-w-screen-2xl mx-auto">
        {/* <ModeToggle /> */}
        <Navbar />
        <div className="space-y-[150px] md:space-y-[200px]">
          <Hero />
          <Sponsors />
          <ConnectYourData />
          <QueryDataSql />
          <VisualizeData />
          <PowerfulOutOfBox />
          <EffortlessWorkspace />
        </div>
      </div>
      <Footer />
    </main>
  );
}
