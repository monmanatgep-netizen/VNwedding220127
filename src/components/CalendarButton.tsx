"use client";
import { wedding } from "@/lib/wedding";

export default function CalendarButton() {
  // 07:00 ICT = 00:00 UTC. The event is currently set to end at 14:00 ICT.
  const start = "20270122T000000Z";
  const end = "20270122T070000Z";
  const title = encodeURIComponent("Wedding: Parichart & Monmanat");
  const details = encodeURIComponent("พิธีมงคลสมรสของปาริชาติและมนต์มนัส");
  const location = encodeURIComponent(`${wedding.venue}, ${wedding.province}`);
  const google = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}`;
  return <div className="flex flex-wrap justify-center gap-3">
    <a className="btn-outline inline-flex items-center justify-center" href={google} target="_blank" rel="noreferrer">Add to Google Calendar</a>
    <a className="btn-outline inline-flex items-center justify-center" href="/calendar">Download Apple Calendar (.ics)</a>
  </div>;
}
