import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export async function isAdminSession() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) return false;
  const cookieStore = await cookies();
  const token = cookieStore.get("wedding_admin")?.value || "";
  const expected = createHmac("sha256", secret).update("wedding-admin-session-v1").digest("hex");
  const a = Buffer.from(token); const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}
