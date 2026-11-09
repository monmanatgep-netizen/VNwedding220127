"use client";
import { FormEvent, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
type Wish = { id: string; guest_name: string; message: string; created_at: string };
export default function Guestbook() {
 const [name,setName]=useState(""); const [message,setMessage]=useState(""); const [sent,setSent]=useState(false); const [busy,setBusy]=useState(false); const [error,setError]=useState(""); const [wishes,setWishes]=useState<Wish[]>([]);
 async function loadWishes(){ try { const supabase=createClient(); const {data}=await supabase.from("guestbook").select("id,guest_name,message,created_at").order("created_at",{ascending:false}).limit(30); setWishes((data||[]) as Wish[]); } catch { /* Guestbook remains usable if public reading has not been enabled yet. */ } }
 useEffect(()=>{loadWishes();},[]);
 async function submit(e: FormEvent){ e.preventDefault(); setBusy(true); setError(""); try { const supabase=createClient(); const {error}=await supabase.from("guestbook").insert({guest_name:name.trim(),message:message.trim()}); if(error) throw error; setSent(true); setName(""); setMessage(""); await loadWishes(); } catch { setError("ส่งข้อความไม่สำเร็จ กรุณาตรวจสอบการเชื่อมต่อแล้วลองใหม่"); } finally {setBusy(false);} }
 const field="mt-2 w-full rounded-xl border border-[#e5e1dc] px-4 py-3 text-sm outline-none focus:border-[#789bc5]";
 return <div className="mx-auto max-w-xl space-y-7">
  <form onSubmit={submit} className="card space-y-4 p-6">
   {sent && <p className="text-center font-thai text-sm text-[#789bc5]">ขอบคุณสำหรับคำอวยพรของคุณ ♡</p>}
   <label className="block text-sm text-[#79583f]">ชื่อของคุณ<input required maxLength={150} value={name} onChange={e=>setName(e.target.value)} className={field}/></label>
   <label className="block text-sm text-[#79583f]">ข้อความอวยพร<textarea required minLength={1} maxLength={1000} rows={4} value={message} onChange={e=>setMessage(e.target.value)} className={field} placeholder="เขียนคำอวยพรให้คู่บ่าวสาว..."/></label>
   {error && <p className="text-sm text-red-600">{error}</p>}<button disabled={busy} className="btn-primary w-full">{busy?"กำลังส่ง...":"ส่งคำอวยพร ♡"}</button>
  </form>
  <div><div className="mb-4 text-center"><p className="eyebrow">Kind words</p><h3 className="mt-2 font-display text-2xl text-[#789bc5]">Guest Wishes</h3></div>
   {wishes.length===0 ? <p className="text-center text-sm text-[#9a8b7e]">ยังไม่มีข้อความอวยพร</p> : <div className="space-y-3">{wishes.map(w=><article key={w.id} className="rounded-2xl border border-[#e9e5df] bg-white/80 p-5 shadow-sm"><p className="font-thai text-sm leading-7 text-[#79583f]">“{w.message}”</p><p className="mt-3 text-xs text-[#789bc5]">— {w.guest_name}</p></article>)}</div>}
  </div>
 </div>;
}
