import { wedding } from "@/lib/wedding";

export async function GET() {
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Parichart Monmanat//Wedding//TH",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    "UID:parichart-monmanat-20270122@wedding",
    "DTSTAMP:20261030T000000Z",
    "DTSTART:20270122T000000Z",
    "DTEND:20270122T070000Z",
    "SUMMARY:Wedding - Parichart & Monmanat",
    `LOCATION:${wedding.venue}, ${wedding.province}`,
    "DESCRIPTION:พิธีมงคลสมรสของปาริชาติและมนต์มนัส",
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");

  return new Response(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'attachment; filename="Parichart-Monmanat-Wedding.ics"',
      "Cache-Control": "public, max-age=3600"
    }
  });
}
