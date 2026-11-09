import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { isAdminSession } from "@/lib/admin-auth";
export const runtime = "nodejs";
const BUCKET = "wedding-backgrounds";
const ALLOWED = new Set(["hero", "countdown", "details", "timeline", "venue", "rsvp", "guestbook", "gift", "recommendations", "footer"]);
function adminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL, key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("กรุณาตั้งค่า Supabase URL และ SUPABASE_SERVICE_ROLE_KEY ใน .env.local");
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}
function publicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL, key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("กรุณาตั้งค่า NEXT_PUBLIC_SUPABASE_URL และ NEXT_PUBLIC_SUPABASE_ANON_KEY ใน .env.local");
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}
export async function GET() {
  try { const { data, error } = await publicClient().from("wedding_backgrounds").select("section,image_url,overlay"); if (error) throw error; return NextResponse.json({ backgrounds: data || [] }, { headers: { "Cache-Control": "no-store" } }); }
  catch (e) { return NextResponse.json({ error: e instanceof Error ? e.message : "โหลดภาพพื้นหลังไม่สำเร็จ" }, { status: 500 }); }
}
export async function POST(request: Request) {
  if (!(await isAdminSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const supabase = adminClient(), form = await request.formData();
    const section = String(form.get("section") || ""), overlay = Math.max(0, Math.min(0.8, Number(form.get("overlay") ?? 0.25))), file = form.get("image");
    if (!ALLOWED.has(section)) return NextResponse.json({ error: "ไม่รู้จักส่วนของเว็บไซต์นี้" }, { status: 400 });
    const { data: old, error: readError } = await supabase.from("wedding_backgrounds").select("image_path").eq("section", section).maybeSingle();
    if (readError) throw readError;
    let imagePath: string | null = old?.image_path || null;
    if (file instanceof File && file.size > 0) {
      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 8 * 1024 * 1024) return NextResponse.json({ error: "รองรับ JPG, PNG หรือ WebP ขนาดไม่เกิน 8 MB" }, { status: 400 });
      const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg", nextPath = `${section}/${randomUUID()}.${ext}`;
      const { error } = await supabase.storage.from(BUCKET).upload(nextPath, file, { contentType: file.type }); if (error) throw error; imagePath = nextPath;
    }
    if (form.get("remove") === "true") imagePath = null;
    const imageUrl = imagePath ? supabase.storage.from(BUCKET).getPublicUrl(imagePath).data.publicUrl : null;
    const { error } = await supabase.from("wedding_backgrounds").upsert({ section, image_path: imagePath, image_url: imageUrl, overlay, updated_at: new Date().toISOString() }, { onConflict: "section" }); if (error) throw error;
    if (old?.image_path && old.image_path !== imagePath) await supabase.storage.from(BUCKET).remove([old.image_path]);
    return NextResponse.json({ success: true, section, image_url: imageUrl, overlay });
  } catch (e) { return NextResponse.json({ error: e instanceof Error ? e.message : "บันทึกภาพพื้นหลังไม่สำเร็จ" }, { status: 500 }); }
}
