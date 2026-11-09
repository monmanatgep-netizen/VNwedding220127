import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Parichart & Monmanat | Wedding Invitation",
  description: "ขอเชิญร่วมเป็นเกียรติในพิธีมงคลสมรสของปาริชาติและมนต์มนัส วันที่ 22 มกราคม 2570",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000")
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  );
}
