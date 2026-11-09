"use client";
import { useEffect, useState } from "react";
import { ImagePlus, Pencil, Trash2, X, MapPin } from "lucide-react";

type Item = { id: string; category: "attraction" | "accommodation"; name: string; description: string; location_url: string; images: string[] };
const blank = { category: "attraction" as const, name: "", description: "", location_url: "" };
export default function AdminRecommendations() {
  const [items, setItems] = useState<Item[]>([]);
  const [form, setForm] = useState(blank);
  const [editing, setEditing] = useState<Item | null>(null);
  const [files, setFiles] = useState<FileList | null>(null);
  const [removed, setRemoved] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  async function refresh() { const r = await fetch("/api/recommendations", { cache: "no-store" }); const d = await r.json(); if (r.ok) setItems(d.recommendations || []); else setMessage(d.error || "โหลดรายการไม่สำเร็จ"); }
  useEffect(() => { refresh(); }, []);
  function startEdit(item: Item) { setEditing(item); setForm({ category: item.category, name: item.name, description: item.description, location_url: item.location_url }); setFiles(null); setRemoved([]); setMessage(""); window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" }); }
  function reset() { setEditing(null); setForm(blank); setFiles(null); setRemoved([]); }
  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setBusy(true); setMessage("");
    try {
      const data = new FormData(); if (editing) data.append("id", editing.id);
      data.append("category", form.category); data.append("name", form.name); data.append("description", form.description); data.append("location_url", form.location_url);
      removed.forEach(url => data.append("remove_images", url)); if (files) Array.from(files).forEach(file => data.append("images", file));
      const response = await fetch("/api/recommendations", { method: "POST", body: data }); const result = await response.json();
      if (!response.ok) throw new Error(result.error || "บันทึกไม่สำเร็จ");
      setMessage("บันทึกข้อมูลเรียบร้อยแล้ว"); reset(); await refresh();
    } catch (err) { setMessage(err instanceof Error ? err.message : "เกิดข้อผิดพลาด"); } finally { setBusy(false); }
  }
  async function remove(item: Item) { if (!confirm(`ต้องการลบ “${item.name}” ใช่หรือไม่?`)) return; const r = await fetch("/api/recommendations", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: item.id }) }); const d = await r.json(); if (!r.ok) { setMessage(d.error || "ลบไม่สำเร็จ"); return; } setMessage("ลบรายการแล้ว"); await refresh(); if (editing?.id === item.id) reset(); }
  const attractionCount = items.filter(x => x.category === "attraction").length;
  const stayCount = items.filter(x => x.category === "accommodation").length;
  const remaining = (form.category === "attraction" ? 10 - attractionCount : 10 - stayCount) + (editing ? 1 : 0);
  const currentImages = (editing?.images || []).filter(url => !removed.includes(url));
  return <section className="card mt-7 p-5 sm:p-7">
    <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="eyebrow">Website content</p><h2 className="mt-2 font-thai text-xl text-[#79583f]">จัดการสถานที่ท่องเที่ยวและที่พัก</h2><p className="mt-1 font-thai text-xs text-[#8b796a]">สถานที่ท่องเที่ยว {attractionCount}/10 · ที่พัก {stayCount}/10</p></div><span className="rounded-full bg-[#edf3fa] px-3 py-1 text-xs text-[#587da9]">แสดงบนหน้าหลักอัตโนมัติ</span></div>
    <div className="mt-6 grid gap-3 md:grid-cols-2">{(["attraction", "accommodation"] as const).map(category => <div key={category} className="rounded-xl border border-[#eee8e1] p-4"><h3 className="font-thai text-sm font-medium text-[#79583f]">{category === "attraction" ? "สถานที่ท่องเที่ยว" : "ที่พักแนะนำ"}</h3><div className="mt-3 space-y-2">{items.filter(x => x.category === category).map(item => <div key={item.id} className="flex items-center gap-3 rounded-lg bg-[#faf8f4] p-2"><div className="h-12 w-14 shrink-0 overflow-hidden rounded-md bg-[#eaf0f6]">{item.images?.[0] && <img src={item.images[0]} alt="" className="h-full w-full object-cover"/>}</div><p className="min-w-0 flex-1 truncate font-thai text-sm text-[#79583f]">{item.name}</p><button onClick={() => startEdit(item)} className="rounded-lg p-2 text-[#789bc5] hover:bg-white" aria-label="แก้ไข"><Pencil size={16}/></button><button onClick={() => remove(item)} className="rounded-lg p-2 text-rose-400 hover:bg-white" aria-label="ลบ"><Trash2 size={16}/></button></div>)}{!items.some(x => x.category === category) && <p className="font-thai text-xs text-[#a89582]">ยังไม่มีรายการ</p>}</div></div>)}</div>
    <form onSubmit={save} className="mt-7 rounded-2xl bg-[#f8f6f1] p-4 sm:p-6">
      <div className="flex items-center justify-between gap-3"><h3 className="font-thai text-lg text-[#79583f]">{editing ? "แก้ไขรายการ" : "เพิ่มรายการใหม่"}</h3>{editing && <button type="button" onClick={reset} className="flex items-center gap-1 text-xs text-[#8b796a]"><X size={14}/> ยกเลิก</button>}</div>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <label className="font-thai text-sm text-[#79583f]">ประเภท<select className="field mt-2 w-full" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value as typeof p.category }))} disabled={!!editing}><option value="attraction">สถานที่ท่องเที่ยวใกล้เคียง</option><option value="accommodation">ที่พักแนะนำ</option></select></label>
        <label className="font-thai text-sm text-[#79583f]">ชื่อสถานที่<input required maxLength={150} className="field mt-2 w-full" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="เช่น น้ำตกสาริกา"/></label>
        <label className="font-thai text-sm text-[#79583f] md:col-span-2">รายละเอียด<textarea required maxLength={1500} rows={3} className="field mt-2 w-full" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="รายละเอียด จุดเด่น หรือคำแนะนำในการเดินทาง"/></label>
        <label className="font-thai text-sm text-[#79583f] md:col-span-2">ลิงก์สถานที่ / Google Maps<input required type="url" className="field mt-2 w-full" value={form.location_url} onChange={e => setForm(p => ({ ...p, location_url: e.target.value }))} placeholder="https://maps.google.com/..."/></label>
        {editing && currentImages.length > 0 && <div className="md:col-span-2"><p className="mb-2 font-thai text-sm text-[#79583f]">รูปภาพปัจจุบัน (เลือกเพื่อลบ)</p><div className="flex flex-wrap gap-3">{currentImages.map(url => <button type="button" key={url} onClick={() => setRemoved(p => [...p, url])} className="relative h-20 w-24 overflow-hidden rounded-lg ring-2 ring-transparent hover:ring-rose-300"><img src={url} alt="รูปสถานที่" className="h-full w-full object-cover"/><span className="absolute inset-0 grid place-items-center bg-black/35 text-xs text-white">แตะเพื่อลบ</span></button>)}</div></div>}
        <label className="md:col-span-2"><span className="font-thai text-sm text-[#79583f]">แนบรูปภาพ (สูงสุด 4 รูป, ไม่เกิน 5 MB ต่อรูป)</span><span className="mt-2 flex items-center gap-2 rounded-xl border border-dashed border-[#cbbda9] bg-white p-4 font-thai text-sm text-[#8b796a]"><ImagePlus size={20}/> <input type="file" accept="image/*" multiple onChange={e => setFiles(e.target.files)} className="min-w-0 flex-1 text-xs"/></span><span className="mt-1 block text-xs text-[#a89582]">{currentImages.length} รูปเดิมที่เก็บไว้{files?.length ? ` + ${files.length} รูปใหม่` : ""} (รวมไม่เกิน 4 รูป)</span></label>
      </div>
      {message && <p className="mt-4 rounded-lg bg-white p-3 font-thai text-sm text-[#587da9]">{message}</p>}
      <div className="mt-5 flex flex-wrap items-center gap-3"><button disabled={busy || remaining <= 0} className="btn-primary disabled:opacity-50">{busy ? "กำลังบันทึก..." : editing ? "บันทึกการแก้ไข" : "เพิ่มรายการ"}</button><span className="font-thai text-xs text-[#8b796a]">{remaining <= 0 ? "หมวดนี้ครบ 10 รายการแล้ว" : `เพิ่มได้อีก ${remaining} รายการในหมวดนี้`}</span></div>
    </form>
  </section>;
}
