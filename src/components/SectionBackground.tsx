"use client";
import { CSSProperties, ReactNode, useEffect, useState } from "react";

type Background = { section: string; image_url: string | null; overlay: number };
let cached: Background[] | null = null;
let pending: Promise<Background[]> | null = null;
async function getBackgrounds() {
  if (cached) return cached;
  if (!pending) pending = fetch("/api/backgrounds", { cache: "no-store" }).then(r => r.ok ? r.json() : { backgrounds: [] }).then(d => { cached = d.backgrounds || []; return cached!; }).catch(() => []);
  return pending;
}
export function invalidateBackgroundCache() { cached = null; pending = null; }
export default function SectionBackground({ section, children, className = "", as = "section" }: { section: string; children?: ReactNode; className?: string; as?: "section" | "div" }) {
  const [background, setBackground] = useState<Background | null>(null);
  useEffect(() => { let live = true; getBackgrounds().then(rows => { if (live) setBackground(rows.find(x => x.section === section) || null); }); return () => { live = false; }; }, [section]);
  const style: CSSProperties = background?.image_url ? { backgroundImage: `linear-gradient(rgba(255,255,255,${background.overlay}), rgba(255,255,255,${background.overlay})), url("${background.image_url}")`, backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "scroll" } : {};
  const Tag = as;
  return <Tag className={className} style={style}>{children}</Tag>;
}
