// src/app/components/Header.tsx
import { Rocket, RefreshCw, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import * as React from "react";

interface HeaderProps {
  /** Number of new jobs detected by polling */
  newJobCount?: number;
  onRefresh?: () => void;
}

/**
 * Header with a notification bell that shows the count of newly fetched jobs.
 * When the count increases, a short beep sound is played using the Web Audio API.
 */
export default function Header({ newJobCount = 0, onRefresh }: HeaderProps) {
  // Keep previous count to detect an increase
  const prevCount = React.useRef<number>(0);

  React.useEffect(() => {
    if (newJobCount > 0 && prevCount.current < newJobCount) {
      // Play a short beep using Web Audio API
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioCtx();
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(440, ctx.currentTime); // A4 note
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        oscillator.start();
        gainNode.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.2);
        oscillator.stop(ctx.currentTime + 0.2);
      } catch (e) {
        console.error("Audio notification failed", e);
      }
    }
    prevCount.current = newJobCount;
  }, [newJobCount]);

  return (
    <header className="bg-white border-b border-zinc-200 flex px-8 justify-between items-center h-20">
      {/* Logo & title */}
      <div className="flex items-center gap-4">
        <div className="size-12 rounded-xl bg-[#2b7fff] text-blue-50 flex justify-center items-center">
          <Rocket className="size-6" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-2xl">PakJobs Live</span>
          <span className="text-[#71717b] text-sm">Real-time jobs across Pakistan</span>
        </div>
      </div>

      {/* Right side – notification + refresh */}
      <div className="flex items-center gap-6">
        {/* Notification bell */}
        <div className="relative">
          <Bell className="size-5 text-[#2b7fff]" />
          {newJobCount > 0 && (
            <span className="absolute -top-2 -right-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs font-medium text-white">
              {newJobCount}
            </span>
          )}
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[#71717b] text-xs">Live listings</span>
        </div>
        <div className="bg-zinc-200 w-px h-10" />
        <Button 
          onClick={onRefresh}
          className="bg-[#2b7fff] text-white px-4 py-2 gap-2 flex items-center rounded-md text-sm font-medium hover:bg-blue-600 transition-colors"
        >
          <RefreshCw className="size-4" /> Update Jobs
        </Button>
      </div>
    </header>
  );
}