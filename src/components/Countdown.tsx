"use client";
import { useEffect, useState } from "react";
import { wedding } from "@/lib/wedding";

type Parts = { days: number; hours: number; minutes: number; seconds: number };
export default function Countdown() {
  const [parts, setParts] = useState<Parts>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [arrived, setArrived] = useState(false);

  useEffect(() => {
    const target = new Date(wedding.dateISO).getTime();
    const tick = () => {
      const diff = target - Date.now();
      if (diff <= 0) { setArrived(true); return; }
      setParts({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff / 3600000) % 24),
        minutes: Math.floor((diff / 60000) % 60),
        seconds: Math.floor((diff / 1000) % 60)
      });
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  if (arrived) return <p className="font-thai text-xl text-[#789bc5]">วันนี้คือวันสำคัญของเรา ♡</p>;
  return (
    <div className="mx-auto grid max-w-md grid-cols-4 gap-2 sm:gap-4">
      {Object.entries(parts).map(([label, value]) => (
        <div key={label} className="rounded-2xl border border-[#dbe5f1] bg-white/80 px-2 py-4">
          <div className="font-display text-3xl text-[#789bc5] sm:text-4xl">{String(value).padStart(2, "0")}</div>
          <div className="mt-1 text-[10px] uppercase tracking-widest text-[#8b796a]">{label}</div>
        </div>
      ))}
    </div>
  );
}
