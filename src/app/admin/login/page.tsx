"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
 const router = useRouter(); const [code,setCode] = useState(""); const [error,setError] = useState(""); const [busy,setBusy] = useState(false);
 async function submit(e: FormEvent) { e.preventDefault(); setBusy(true); setError(""); try {
  const res = await fetch("/api/admin/login", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({code}) });
  const data = await res.json(); if (!res.ok) throw new Error(data.error || "ไม่สามารถเข้าสู่ระบบได้");
  router.replace("/admin"); router.refresh();
 } catch(err) { setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด"); } finally { setBusy(false); }
 }
 return <main className="luxury-bg grid min-h-screen place-items-center p-5">
  <form onSubmit={submit} className="relative w-full max-w-sm rounded-[28px] border border-white/80 bg-white/85 p-8 text-center shadow-2xl backdrop-blur-xl">
   <p className="eyebrow">Private access</p><div className="my-4 font-display text-3xl text-[#789bc5]">Wedding Admin</div>
   <p className="mb-6 font-thai text-sm text-[#79583f]">กรุณากรอกรหัสลับ 6 หลัก</p>
   <input aria-label="รหัสลับ 6 หลัก" autoComplete="one-time-code" inputMode="numeric" pattern="[0-9]{6}" maxLength={6} minLength={6} required value={code} onChange={e=>setCode(e.target.value.replace(/\D/g,"").slice(0,6))} placeholder="• • • • • •" className="w-full rounded-2xl border border-[#dbe5f1] bg-white px-4 py-4 text-center text-2xl tracking-[.6em] text-[#587da9] outline-none focus:border-[#789bc5]"/>
   {error && <p role="alert" className="mt-4 text-sm text-red-600">{error}</p>}
   <button disabled={busy || code.length!==6} className="btn-primary mt-6 w-full disabled:opacity-50">{busy ? "กำลังตรวจสอบ..." : "เข้าสู่ระบบ"}</button>
   <a href="/" className="mt-5 inline-block text-xs text-[#9a8b7e] hover:text-[#789bc5]">กลับหน้าหลัก</a>
  </form></main>;
}
