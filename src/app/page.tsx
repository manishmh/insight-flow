'use client'

import Link from "next/link";
import { ModeToggle } from "@/components/toggle-mode";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner'

export default function Home() {


  return (
    <main className="text-3xl font-bold text-violet-400">
      <ModeToggle />
      <Button
        onClick={() => {
          toast("Toast description")
        }}
      >
        toast
      </Button>
      <Link href="/auth/login">
        <div className="h-full flex justify-center items-center">Login</div>
      </Link>
    </main> 
  );
}
