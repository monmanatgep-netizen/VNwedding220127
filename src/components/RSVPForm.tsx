"use client";
import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function RSVPForm() {
  const [name, setName] = useState("");
  const [attendance, setAttendance] = useState("yes");
  const [count, setCount] = useState("1");
  const [food, setFood] = useState("");
  const [accommodation, setAccommodation] = useState("no");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    if (!name.trim()) { setError("กรุณากรอกชื่อ-นามสกุล"); return; }
    setBusy(true);
    try {
      const supabase = createClient();
      const { error: dbError } = await supabase.from("guests").insert({
        guest_name: name.trim(),
        attendance: attendance === "yes",
        guest_count: attendance === "yes" ? Number(count) : 0,
        food_preference: food.trim() || null,
        accommodation: attendance === "yes" && accommodation === "yes",
        note: note.trim() || null
      });
      if (dbError) throw dbError;
      setDone(true);
    } catch (err) {
      console.error(err);
      setError("ส่งข้อมูลไม่สำเร็จ กรุณาตรวจสอบการเชื่อมต่อแล้วลองอีกครั้ง");
    } finally {
      setBusy(false);
    }
  }

  if (done) return (
    <div className="card p-8 text-center">
      <div className="font-display text-5xl text-[#ed9296]">Thank you</div>
      <h3 className="mt-3 font-thai text-xl text-[#789bc5]">ขอบคุณสำหรับการตอบรับ</h3>
      <p className="mt-2 text-sm text-[#79583f]">เรายินดีเป็นอย่างยิ่งที่จะได้พบคุณในวันสำคัญของเรา</p>
    </div>
  );

  const field = "mt-2 w-full rounded-xl border border-[#e5e1dc] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#789bc5]";

  return (
    <form onSubmit={submit} className="card space-y-5 p-6 sm:p-8">
      <div className="text-center">
        <p className="eyebrow">Kindly Respond</p>
        <h3 className="mt-2 font-display text-3xl text-[#789bc5]">RSVP</h3>
        <p className="mt-2 font-thai text-xs text-[#79583f]">กรุณาตอบรับภายในวันที่ [31 ธันวาคม 2026]</p>
      </div>
      <label className="block text-sm text-[#79583f]">ชื่อ-นามสกุล *
        <input required maxLength={150} value={name} onChange={e => setName(e.target.value)} className={field} placeholder="ชื่อของคุณ" />
      </label>
      <fieldset>
        <legend className="text-sm text-[#79583f]">การเข้าร่วมงาน *</legend>
        <div className="mt-2 grid grid-cols-2 gap-3">
          <button type="button" onClick={() => setAttendance("yes")} className={`rounded-xl border p-3 text-sm ${attendance === "yes" ? "border-[#789bc5] bg-[#edf3fa] text-[#587da9]" : "border-[#e5e1dc]"}`}>♥ มาร่วมงาน</button>
          <button type="button" onClick={() => setAttendance("no")} className={`rounded-xl border p-3 text-sm ${attendance === "no" ? "border-[#789bc5] bg-[#edf3fa] text-[#587da9]" : "border-[#e5e1dc]"}`}>ไม่สะดวก</button>
        </div>
      </fieldset>
      {attendance === "yes" && <>
        <label className="block text-sm text-[#79583f]">จำนวนผู้เข้าร่วมทั้งหมด (รวมคุณ)
          <select value={count} onChange={e => setCount(e.target.value)} className={field}>
            {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n} คน</option>)}
          </select>
        </label>
        <label className="block text-sm text-[#79583f]">อาหาร / ข้อจำกัดด้านอาหาร
          <input maxLength={200} value={food} onChange={e => setFood(e.target.value)} className={field} placeholder="เช่น มังสวิรัติ แพ้อาหารทะเล (ถ้ามี)" />
        </label>
        
      </>}
      <label className="block text-sm text-[#79583f]">ข้อความเพิ่มเติม (ถ้ามี)
        <textarea maxLength={500} rows={3} value={note} onChange={e => setNote(e.target.value)} className={field} placeholder="ฝากข้อความถึงบ่าวสาว..." />
      </label>
      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
      <button disabled={busy} className="btn-primary w-full disabled:opacity-50">{busy ? "กำลังส่งข้อมูล..." : "ยืนยันการตอบรับ"}</button>
      <p className="text-center text-[11px] text-[#9a8b7e]">ข้อมูลนี้ใช้เพื่อการจัดเตรียมงานแต่งงานเท่านั้น</p>
    </form>
  );
}
