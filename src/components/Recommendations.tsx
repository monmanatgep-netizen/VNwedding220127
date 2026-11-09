"use client";
import { useEffect, useState } from "react";
import { MapPin, BedDouble, Compass, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import SectionBackground from "@/components/SectionBackground";

type Recommendation = { id: string; category: "attraction" | "accommodation"; name: string; description: string; location_url: string; images: string[] };
function RecommendationGroup({ title, subtitle, items, icon }: { title: string; subtitle: string; items: Recommendation[]; icon: "attraction" | "accommodation" }) {
  if (!items.length) return null;
  const [active, setActive] = useState<Record<string, number>>({});
  const Icon = icon === "attraction" ? Compass : BedDouble;
  return <section className="mt-16">
    <div className="mb-8 text-center"><p className="eyebrow">{icon === "attraction" ? "Explore nearby" : "Stay nearby"}</p><h3 className="mt-3 font-display text-3xl text-[#789bc5]">{title}</h3><p className="mt-3 font-thai text-sm text-[#8b796a]">{subtitle}</p><div className="gold-line mx-auto mt-5 max-w-24"/></div>
    <div className="mx-auto grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map(item => { const index = active[item.id] || 0; const photos = item.images || []; return <article key={item.id} className="card overflow-hidden">
        <div className="relative aspect-[4/3] bg-[#edf2f7]">
          {photos.length ? <img src={photos[index]} alt={item.name} className="h-full w-full object-cover"/> : <div className="flex h-full items-center justify-center text-[#9bb0c8]"><Icon size={42}/></div>}
          {photos.length > 1 && <><button aria-label="รูปก่อนหน้า" onClick={() => setActive(p => ({...p,[item.id]:(index - 1 + photos.length) % photos.length}))} className="absolute left-3 top-1/2 rounded-full bg-white/85 p-2 shadow"><ChevronLeft size={18}/></button><button aria-label="รูปถัดไป" onClick={() => setActive(p => ({...p,[item.id]:(index + 1) % photos.length}))} className="absolute right-3 top-1/2 rounded-full bg-white/85 p-2 shadow"><ChevronRight size={18}/></button><span className="absolute bottom-3 right-3 rounded-full bg-black/45 px-3 py-1 text-xs text-white">{index + 1}/{photos.length}</span></>}
        </div>
        <div className="p-5"><h4 className="font-thai text-lg font-medium text-[#79583f]">{item.name}</h4><p className="mt-2 min-h-16 whitespace-pre-line font-thai text-sm leading-7 text-[#8b796a]">{item.description}</p><a href={item.location_url} target="_blank" rel="noreferrer" className="btn-outline mt-4 inline-flex items-center gap-2"><MapPin size={15}/> เปิดแผนที่ <ExternalLink size={13}/></a></div>
      </article>; })}
    </div>
  </section>;
}
export default function Recommendations() {
  const [items, setItems] = useState<Recommendation[]>([]);
  useEffect(() => { fetch("/api/recommendations", { cache: "no-store" }).then(r => r.ok ? r.json() : null).then(data => setItems(data?.recommendations || [])).catch(() => setItems([])); }, []);
  if (!items.length) return null;
  return <section className="section-space relative isolate bg-[#fbfaf7]">
    <SectionBackground section="recommendations" className="pointer-events-none absolute inset-0 -z-10" as="div"/>
    <div className="mx-auto max-w-7xl px-5"><div className="text-center"><p className="eyebrow">Around the venue</p><h2 className="mt-3 font-display text-3xl text-[#789bc5] sm:text-4xl">Explore & Stay</h2><p className="mt-3 font-thai text-sm text-[#8b796a]">สถานที่ท่องเที่ยวและที่พักแนะนำใกล้สถานที่จัดงาน</p></div>
      <RecommendationGroup title="Nearby Attractions" subtitle="สถานที่ท่องเที่ยวใกล้เคียง" items={items.filter(x => x.category === "attraction")} icon="attraction"/>
      <RecommendationGroup title="Recommended Stays" subtitle="ที่พักแนะนำใกล้สถานที่จัดงาน" items={items.filter(x => x.category === "accommodation")} icon="accommodation"/>
    </div>
  </section>;
}
