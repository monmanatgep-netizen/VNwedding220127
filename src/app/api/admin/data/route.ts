import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { isAdminSession } from "@/lib/admin-auth";

export async function GET() {
  if (!(await isAdminSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return NextResponse.json({ error: "กรุณาตั้งค่า SUPABASE_SERVICE_ROLE_KEY ใน .env.local" }, { status: 500 });
  const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  const [{ data: guests, error: guestError }, { data: wishes, error: wishError }] = await Promise.all([
    supabase.from("guests").select("*").order("created_at", { ascending: false }),
    supabase.from("guestbook").select("*").order("created_at", { ascending: false })
  ]);
  if (guestError || wishError) return NextResponse.json({ error: guestError?.message || wishError?.message }, { status: 500 });
  return NextResponse.json({ guests: guests || [], wishes: wishes || [] });
}
