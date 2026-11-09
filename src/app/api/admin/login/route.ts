import { createHmac, timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { code } = await request.json();
  const expected = process.env.ADMIN_ACCESS_CODE;
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!expected || !secret) return NextResponse.json({ error: "ยังไม่ได้ตั้งค่า Admin ใน .env.local" }, { status: 500 });
  const submitted = String(code ?? "");
  const a = Buffer.from(submitted); const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return NextResponse.json({ error: "รหัสลับไม่ถูกต้อง" }, { status: 401 });
  const token = createHmac("sha256", secret).update("wedding-admin-session-v1").digest("hex");
  const response = NextResponse.json({ ok: true });
  response.cookies.set("wedding_admin", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: 60 * 60 * 8 });
  return response;
}
