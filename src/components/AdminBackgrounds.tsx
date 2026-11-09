"use client";
import { useEffect, useState } from "react";
import { ImagePlus, Trash2, Save, Image as ImageIcon } from "lucide-react";
import { invalidateBackgroundCache } from "@/components/SectionBackground";

type Row = { section: string; image_url: string | null; overlay: number };
const sections = [
  ["hero", "หน้าแรก / ซองเชิญ"], ["countdown", "นับถอยหลัง"], ["details", "รายละเอียดงาน"], ["timeline", "กำหนดการ"],
  ["venue", "สถานที่จัดงาน"], ["rsvp", "ตอบรับเข้าร่วมงาน"], ["guestbook", "คำอวยพร"], ["gift", "ของขวัญดิจิทัล"],
  ["recommendations", "สถานที่ท่องเที่ยวและที่พัก"], ["footer", "ส่วนท้ายเว็บไซต์"]
] as const;
export default function AdminBackgrounds() {
  const [rows, setRows] = useState<Row[]>([]);
  const [section, setSection] = useState<string>("hero");
  const [file, setFile] = useState<File | null>(null);
  const [overlay, setOverlay] = useState(0.25);
  const [remove, setRemove] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  async function refresh() { const r = await fetch("/api/backgrounds", { cache: "no-store" }); const d = await r.json(); if (r.ok) setRows(d.backgrounds || []); else setMessage(d.error || "โหลดข้อมูลไม่สำเร็จ"); }
  useEffect(() => { refresh(); }, []);
  const current = rows.find(x => x.section === section);
  useEffect(() => { setOverlay(current?.overlay ?? 0.25); setFile(null); setRemove(false); }, [section, current?.overlay]);
  async function save(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setMessage("");
    try { const form = new FormData(); form.set("section", section); form.set("overlay", String(overlay)); if (file) form.set("image", file); if (remove) form.set("remove", "true");
      const r = await fetch("/api/backgrounds", { method: "POST", body: form }); const d = await r.json(); if (!r.ok) throw new Error(d.error || "บันทึกไม่สำเร็จ");
      setMessage("บันทึกภาพพื้นหลังเรียบร้อยแล้ว"); setFile(null); setRemove(false); invalidateBackgroundCache(); await refresh();
    } catch (err) { setMessage(err instanceof Error ? err.message : "เกิดข้อผิดพลาด"); } finally { setBusy(false); }
  }
  return <section className="card mt-7 p-5 sm:p-7">
    <div><p className="eyebrow">Website appearance</p><h2 className="mt-2 font-thai text-xl text-[#79583f]">จัดการภาพพื้นหลังแต่ละส่วน</h2><p className="mt-1 font-thai text-xs text-[#8b796a]">อัปโหลดภาพ JPG, PNG หรือ WebP ขนาดไม่เกิน 8 MB แล้วกำหนดภาพแยกแต่ละส่วนของหน้าเว็บไซต์</p></div>
    <form onSubmit={save} className="mt-5 grid gap-4 md:grid-cols-2">
      <label className="font-thai text-sm text-[#79583f] md:col-span-2">เลือกส่วนของเว็บไซต์<select className="field mt-2 w-full" value={section} onChange={e => setSection(e.target.value)}>{sections.map(([key,label]) => <option key={key} value={key}>{label}</option>)}</select></label>
      <div className="md:col-span-2"><p className="mb-2 font-thai text-sm text-[#79583f]">ภาพพื้นหลังปัจจุบัน</p>{current?.image_url && !remove ? <div className="relative h-48 overflow-hidden rounded-xl bg-[#f4f0e9]"><img src={current.image_url} alt="ภาพพื้นหลังปัจจุบัน" className="h-full w-full object-cover"/><button type="button" onClick={() => setRemove(true)} className="absolute right-3 top-3 flex items-center gap-2 rounded-full bg-white/90 px-3 py-2 text-xs text-rose-600"><Trash2 size={14}/> ลบภาพนี้</button></div> : <div className="grid h-32 place-items-center rounded-xl border border-dashed border-[#cbbda9] bg-[#faf8f4] font-thai text-sm text-[#a89582]"><ImageIcon/>ยังไม่มีภาพพื้นหลัง</div>}</div>
      <label className="md:col-span-2"><span className="font-thai text-sm text-[#79583f]">อัปโหลดภาพใหม่</span><span className="mt-2 flex items-center gap-2 rounded-xl border border-dashed border-[#cbbda9] bg-white p-4 font-thai text-sm text-[#8b796a]"><ImagePlus size={20}/><input type="file" accept="image/jpeg,image/png,image/webp" onChange={e => { setFile(e.target.files?.[0] || null); setRemove(false); }} className="min-w-0 flex-1 text-xs"/></span>{file && <span className="mt-1 block text-xs text-[#587da9]">{file.name} · {(file.size / 1024 / 1024).toFixed(2)} MB</span>}</label>
      <label className="font-thai text-sm text-[#79583f] md:col-span-2">ความจางของ Overlay: {Math.round(overlay * 100)}%<input className="mt-3 w-full accent-[#789bc5]" type="range" min="0" max="0.8" step="0.05" value={overlay} onChange={e => setOverlay(Number(e.target.value))}/><span className="mt-1 block text-xs text-[#8b796a]">ยิ่งมาก ภาพยิ่งจางและพื้นหลังสีขาวจะทับมากขึ้น ช่วยให้อ่านข้อความง่าย</span></label>
      {message && <p className="rounded-lg bg-[#f8f6f1] p-3 font-thai text-sm text-[#587da9] md:col-span-2">{message}</p>}
      <div className="flex flex-wrap items-center gap-3 md:col-span-2"><button disabled={busy || (!file && !remove && !current)} className="btn-primary inline-flex items-center gap-2 disabled:opacity-50"><Save size={16}/>{busy ? "กำลังบันทึก..." : "บันทึกภาพพื้นหลัง"}</button><span className="font-thai text-xs text-[#8b796a]">มีผลกับหน้าเว็บไซต์หลังโหลดใหม่</span></div>
    </form>
  </section>;
}
