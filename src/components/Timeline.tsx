"use client";
import { useState } from "react";
import { schedule } from "@/lib/wedding";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function Timeline() {
  const [active, setActive] = useState<number | null>(0);
  return <div className="mx-auto max-w-2xl space-y-3">
    {schedule.map((item, i) => (
      <button key={item.time} onClick={() => setActive(active === i ? null : i)}
        className="card w-full p-5 text-left transition hover:-translate-y-0.5">
        <div className="flex items-center gap-4">
          <span className="font-display text-2xl text-[#789bc5]">{item.time}</span>
          <span className="h-8 w-px bg-[#d9e3ef]"/>
          <span className="flex-1 font-thai text-sm text-[#79583f]">{item.title}</span>
          {active === i ? <ChevronUp size={18}/> : <ChevronDown size={18}/>}
        </div>
        {active === i && <p className="mt-4 border-t border-[#eee8e1] pt-4 font-thai text-sm leading-7 text-[#8b796a]">{item.detail}</p>}
      </button>
    ))}
  </div>;
}
