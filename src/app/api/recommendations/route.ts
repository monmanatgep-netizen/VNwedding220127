import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { isAdminSession } from "@/lib/admin-auth";

export const runtime = "nodejs";
const BUCKET = "wedding-recommendations";
function supabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("กรุณาตั้งค่า Supabase URL และ SUPABASE_SERVICE_ROLE_KEY ใน .env.local");
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

export async function GET() {
  try {
    const supabase = supabaseAdmin();
    const { data, error } = await supabase.from("recommendations").select("*").order("category").order("sort_order").order("created_at");
    if (error) throw error;
    return NextResponse.json({ recommendations: data || [] }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "โหลดข้อมูลไม่สำเร็จ" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await isAdminSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const supabase = supabaseAdmin();
    const form = await request.formData();
    const id = String(form.get("id") || "");
    const category = String(form.get("category") || "");
    const name = String(form.get("name") || "").trim();
    const description = String(form.get("description") || "").trim();
    const locationUrl = String(form.get("location_url") || "").trim();
    if (!["attraction", "accommodation"].includes(category)) return NextResponse.json({ error: "ประเภทข้อมูลไม่ถูกต้อง" }, { status: 400 });
    if (!name || !description || !locationUrl) return NextResponse.json({ error: "กรุณากรอกชื่อ รายละเอียด และลิงก์สถานที่ให้ครบ" }, { status: 400 });
    try { new URL(locationUrl); } catch { return NextResponse.json({ error: "ลิงก์สถานที่ไม่ถูกต้อง" }, { status: 400 }); }

    const { data: existingRows, error: countError } = await supabase.from("recommendations").select("id").eq("category", category);
    if (countError) throw countError;
    if (!id && (existingRows || []).length >= 10) return NextResponse.json({ error: "หมวดนี้เพิ่มได้สูงสุด 10 รายการ" }, { status: 400 });
    if (id && !(existingRows || []).some((row: {id:string}) => row.id === id)) return NextResponse.json({ error: "ไม่พบรายการที่ต้องการแก้ไข" }, { status: 404 });

    const { data: old } = id ? await supabase.from("recommendations").select("images").eq("id", id).single() : { data: null };
    const images: string[] = [...((old?.images || []) as string[])];
    const removeImages = form.getAll("remove_images").map(String);
    const retained = images.filter(url => !removeImages.includes(url));
    const files = form.getAll("images").filter((f): f is File => f instanceof File && f.size > 0);
    if (retained.length + files.length > 4) return NextResponse.json({ error: "รูปภาพได้ไม่เกิน 4 รูปต่อรายการ" }, { status: 400 });
    const uploaded: string[] = [];
    for (const file of files) {
      if (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) return NextResponse.json({ error: "รองรับไฟล์รูปภาพขนาดไม่เกิน 5 MB ต่อรูป" }, { status: 400 });
      const ext = (file.name.split(".").pop() || "jpg").replace(/[^a-zA-Z0-9]/g, "").toLowerCase() || "jpg";
      const path = `${category}/${randomUUID()}.${ext}`;
      const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, file, { contentType: file.type, upsert: false });
      if (uploadError) throw uploadError;
      const { data: publicUrl } = supabase.storage.from(BUCKET).getPublicUrl(path);
      uploaded.push(publicUrl.publicUrl);
    }
    const payload = { category, name, description, location_url: locationUrl, images: [...retained, ...uploaded], updated_at: new Date().toISOString() };
    const result = id
      ? await supabase.from("recommendations").update(payload).eq("id", id).select().single()
      : await supabase.from("recommendations").insert({ ...payload, sort_order: (existingRows || []).length }).select().single();
    if (result.error) throw result.error;
    const removed = images.filter(url => !retained.includes(url));
    for (const url of removed) {
      const marker = `/storage/v1/object/public/${BUCKET}/`;
      const index = url.indexOf(marker);
      if (index >= 0) await supabase.storage.from(BUCKET).remove([decodeURIComponent(url.slice(index + marker.length))]);
    }
    return NextResponse.json({ recommendation: result.data });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "บันทึกข้อมูลไม่สำเร็จ" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!(await isAdminSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: "ไม่พบรหัสรายการ" }, { status: 400 });
    const supabase = supabaseAdmin();
    const { data, error } = await supabase.from("recommendations").select("images").eq("id", id).single();
    if (error) throw error;
    const { error: deleteError } = await supabase.from("recommendations").delete().eq("id", id);
    if (deleteError) throw deleteError;
    const marker = `/storage/v1/object/public/${BUCKET}/`;
    const paths = ((data.images || []) as string[]).flatMap(url => { const i = url.indexOf(marker); return i >= 0 ? [decodeURIComponent(url.slice(i + marker.length))] : []; });
    if (paths.length) await supabase.storage.from(BUCKET).remove(paths);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "ลบข้อมูลไม่สำเร็จ" }, { status: 500 });
  }
}
