'use client'

import { ModeToggle } from "@/components/toggle-mode";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export default function Home() {
  const { toast } = useToast();

  return (
    <main className="text-3xl font-bold text-violet-400">
      <ModeToggle />
      <Button
        onClick={() => {
          toast({
            title: "Toast Title",
            description: "Toast Description",
            duration: 2000,
          });
        }}
      >
        toast
      </Button>
    </main> 
  );
}
