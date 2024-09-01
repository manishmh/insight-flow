'use client'

import Link from "next/link";
import { ModeToggle } from "@/components/toggle-mode";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner'
import Navbar from "@/components/home/navbar";

export default function Home() {

  return (
    <main className="font-sans max-w-screen-3xl mx-auto">
      <Navbar />
      {/* <ModeToggle /> */}
      <div className="h-[200vh]"></div>
    </main> 
  );
}
