"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import * as XLSX from "xlsx";
import AdminRecommendations from "@/components/AdminRecommendations";
import AdminBackgrounds from "@/components/AdminBackgrounds";
import AdminGallery from "@/components/AdminGallery";

type Guest = {
  id: string; guest_name: string; attendance: boolean; guest_count: number;
  food_preference: string | null; accommodation: boolean; note: string | null; created_at: string;
};
type Wish = { id: string; guest_name: string; message: string; created_at: string };

export default function AdminDashboard() {
  const router = useRouter();
  const [guests, setGuests] = useState<Guest[]>([]);
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  async function load() {
    try {
      const response = await fetch("/api/admin/data", { cache: "no-store" });
      if (response.status === 401) { router.replace("/admin/login"); return; }
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "โหลดข้อมูลไม่สำเร็จ");
      setGuests(data.guests || []); setWishes(data.wishes || []); setAuthorized(true);
    } catch (error) { console.error(error); } finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);
  useEffect(() => {
    if (!authorized) return;
    const timer = window.setInterval(load, 15000);
    return () => window.clearInterval(timer);
  }, [authorized]);

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
  }

  function exportExcel() {
    const rows = guests.map(g => ({
      ชื่อ: g.guest_name, การเข้าร่วม: g.attendance ? "มาร่วมงาน" : "ไม่สะดวก",
      จำนวนคน: g.guest_count, อาหาร: g.food_preference || "-",
      ที่พัก: g.accommodation ? "ต้องการ" : "ไม่ต้องการ",
      หมายเหตุ: g.note || "-", วันที่ตอบรับ: g.created_at
    }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(rows), "RSVP");
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(wishes.map(w => ({
      ชื่อ: w.guest_name, คำอวยพร: w.message, วันที่: w.created_at
    }))), "Guestbook");
    XLSX.writeFile(wb, "Wedding_Guest_Report.xlsx");
  }

  if (loading) return <main className="grid min-h-screen place-items-center">กำลังโหลดข้อมูล...</main>;

  const attending = guests.filter(g => g.attendance);
  const totalPeople = attending.reduce((sum, g) => sum + g.guest_count, 0);
  const staying = attending.filter(g => g.accommodation).length;
  const declined = guests.filter(g => !g.attendance).length;

  return <main className="min-h-screen luxury-bg min-h-screen p-5 sm:p-10">
    <div className="mx-auto max-w-7xl">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div><p className="eyebrow">Private administration</p><h1 className="mt-2 font-display text-3xl text-[#789bc5]">Wedding Dashboard</h1></div>
        <div className="flex gap-2"><button onClick={load} className="btn-outline">Refresh</button><button onClick={exportExcel} className="btn-primary">Export Excel</button><button onClick={logout} className="btn-outline">ออกจากระบบ</button></div>
      </header>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["จำนวนผู้ตอบรับ", guests.length], ["ยืนยันมาร่วมงาน", totalPeople],
          ["ไม่สะดวก", declined], ["ต้องการที่พัก", staying]
        ].map(([label, value]) => <div key={label} className="card p-6"><p className="text-sm text-[#8b796a]">{label}</p><p className="mt-2 font-display text-4xl text-[#789bc5]">{value}</p></div>)}
      </div>
      <section className="card mt-7 overflow-hidden">
        <div className="flex items-center justify-between border-b p-5"><h2 className="font-thai text-lg text-[#79583f]">รายชื่อผู้ตอบรับ</h2><span className="text-xs text-[#8b796a]">{guests.length} รายการ</span></div>
        <div className="overflow-x-auto"><table className="w-full min-w-[850px] text-left text-sm">
          <thead className="bg-[#edf3fa] text-[#587da9]"><tr>{["ชื่อ","สถานะ","จำนวนคน","อาหาร","ที่พัก","หมายเหตุ","วันที่"].map(x=><th key={x} className="p-4 font-medium">{x}</th>)}</tr></thead>
          <tbody>{guests.map(g=><tr key={g.id} className="border-t border-[#eee8e1]"><td className="p-4">{g.guest_name}</td><td className="p-4">{g.attendance ? "มาร่วมงาน" : "ไม่สะดวก"}</td><td className="p-4">{g.guest_count}</td><td className="p-4">{g.food_preference || "-"}</td><td className="p-4">{g.accommodation ? "ต้องการ" : "ไม่ต้องการ"}</td><td className="p-4">{g.note || "-"}</td><td className="p-4">{new Date(g.created_at).toLocaleDateString("th-TH")}</td></tr>)}</tbody>
        </table></div>
      </section>
      <AdminRecommendations />
      <AdminBackgrounds />
      <AdminGallery />
      <section className="card mt-7 p-5">
        <h2 className="font-thai text-lg text-[#79583f]">ข้อความอวยพร ({wishes.length})</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">{wishes.map(w=><article key={w.id} className="rounded-xl bg-[#f7f4ee] p-4"><p className="font-thai text-sm leading-7">{w.message}</p><p className="mt-3 text-xs text-[#789bc5]">— {w.guest_name}</p></article>)}</div>
      </section>
    </div>
  </main>;
}
