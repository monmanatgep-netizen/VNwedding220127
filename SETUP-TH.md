# คู่มือติดตั้งเว็บไซต์งานแต่ง (Mac)

โปรเจกต์นี้เป็น Next.js + Supabase และต้องมีบัญชี Supabase ของเจ้าของเว็บไซต์ก่อน จึงจะใช้งาน RSVP, คำอวยพร, หลังบ้าน, ที่พัก/สถานที่ท่องเที่ยว และภาพพื้นหลังแบบบันทึกออนไลน์ได้

## สิ่งที่ต้องมี
- macOS
- Node.js 20.9 ขึ้นไป (แนะนำ LTS รุ่นปัจจุบัน)
- npm (ติดตั้งมาพร้อม Node.js)
- โปรเจกต์ Supabase

## 1) ติดตั้ง Node.js
ดาวน์โหลด Node.js LTS จาก https://nodejs.org/ แล้วติดตั้ง จากนั้นเปิด Terminal ตรวจสอบ:

```bash
node -v
npm -v
```

## 2) แตกไฟล์และติดตั้งแพ็กเกจ
แตก ZIP แล้วเปิด Terminal พิมพ์ `cd ` (เว้นวรรคหลัง cd) จากนั้นลากโฟลเดอร์ `parichart-monmanat-wedding` ลงใน Terminal แล้วกด Enter เช่น:

```bash
cd ~/Downloads/parichart-monmanat-wedding
npm install
```

## 3) สร้าง Supabase
1. ไปที่ https://supabase.com/dashboard แล้วสร้าง New project
2. เลือก Region ที่ใกล้ไทย เช่น Singapore และตั้ง Database Password เก็บไว้
3. รอให้โปรเจกต์พร้อม
4. เข้า SQL Editor > New query
5. เปิดไฟล์ `supabase/schema.sql` ในโฟลเดอร์โปรเจกต์ คัดลอกทั้งหมดไปวางใน SQL Editor แล้วกด Run

## 4) คัดลอก API keys
ใน Supabase ไปที่ Project Settings > API Keys (หรือ Settings > API ตามหน้าตา Dashboard) แล้วเตรียม:
- Project URL
- Publishable key หรือ anon / legacy anon key
- Secret key หรือ legacy service_role key (ใช้เฉพาะฝั่งเซิร์ฟเวอร์ ห้ามเปิดเผย)

## 5) สร้างไฟล์ .env.local
กลับมาที่ Terminal ซึ่งอยู่ในโฟลเดอร์โปรเจกต์ รัน:

```bash
cp .env.example .env.local
open -e .env.local
```

ใส่ค่าจริงลงในไฟล์ตามรูปแบบนี้ (แทนข้อความตัวอย่าง):

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_PUBLISHABLE_OR_ANON_KEY
NEXT_PUBLIC_SITE_URL=http://localhost:3000
ADMIN_ACCESS_CODE=110721
ADMIN_SESSION_SECRET=วางค่าที่สุ่มจากคำสั่งด้านล่าง
SUPABASE_SERVICE_ROLE_KEY=YOUR_SECRET_OR_SERVICE_ROLE_KEY
```

สร้างค่า ADMIN_SESSION_SECRET ด้วยคำสั่งนี้ใน Terminal:

```bash
openssl rand -hex 32
```

คัดลอกผลลัพธ์ไปแทนค่า `ADMIN_SESSION_SECRET` แล้ว Save ไฟล์ `.env.local`

อย่าใส่ `SUPABASE_SERVICE_ROLE_KEY` ด้วย prefix `NEXT_PUBLIC_` และห้ามส่งค่านี้ให้ผู้อื่น ห้ามอัปโหลด `.env.local` ขึ้น GitHub หรือแนบส่งแชต

## 6) เปิดเว็บไซต์
ใน Terminal ที่อยู่ในโฟลเดอร์โปรเจกต์:

```bash
npm run dev
```

เปิด:
- เว็บไซต์: http://localhost:3000
- หลังบ้าน: http://localhost:3000/admin/login
- รหัส Admin เริ่มต้นตามไฟล์ตัวอย่างนี้: `110721` (เปลี่ยนได้ที่ `ADMIN_ACCESS_CODE` ใน `.env.local`)

หยุดเซิร์ฟเวอร์ด้วย Control + C

## 7) ฟังก์ชันและการตั้งค่าเพิ่มเติม
- RSVP และ Guestbook ใช้ตารางและ RLS ที่สร้างจาก `supabase/schema.sql`
- จัดการสถานที่ท่องเที่ยว/ที่พักได้สูงสุดหมวดละ 10 รายการ รูปไม่เกิน 4 รูปต่อรายการ
- จัดการภาพพื้นหลังแยก 10 ส่วน อัปโหลด JPG/PNG/WebP ไม่เกิน 8 MB ต่อภาพ
- แกลเลอรีภาพอิสระ: สร้างชุดภาพได้ไม่จำกัด เลือกแนวตั้ง/แนวนอน/จัตุรัส จำนวนคอลัมน์ และเลือกตำแหน่งแทรกระหว่างส่วนต่าง ๆ ของหน้าแรกได้ อัปโหลด JPG/PNG/WebP ไม่เกิน 10 MB ต่อรูป
- รูปภาพถูกเก็บใน Supabase Storage; ตารางและ bucket ที่เกี่ยวข้องสร้างจาก schema.sql
- `WEDDING_API_KEY` เป็นค่าทางเลือก ไม่จำเป็นต่อการเชื่อม Supabase หรือการเปิดเว็บในเครื่อง และยังไม่ได้ผูกกับบริการ API ภายนอกในโปรเจกต์นี้

## 8) ก่อนเปิดให้แขกใช้จริง
- อย่าใช้ `localhost` เป็น URL สาธารณะ ต้อง Deploy เช่น Vercel และตั้ง Environment Variables บนแพลตฟอร์มนั้นด้วย
- เปลี่ยนรหัส Admin เป็นรหัสที่คาดเดายาก และเพิ่ม rate limiting/การป้องกัน brute force ก่อนเปิดสู่สาธารณะ
- ทดสอบการส่ง RSVP, คำอวยพร, การเพิ่มที่พัก/สถานที่, การอัปโหลดภาพพื้นหลัง และแกลเลอรีภาพอิสระ
- ตรวจสอบสถานที่จัดงาน, ลิงก์แผนที่, ข้อมูลการเดินทาง, ภาพถ่าย, ข้อมูล PromptPay และประกาศความเป็นส่วนตัว

## การแก้ปัญหาเบื้องต้น
- `npm: command not found`: ติดตั้ง Node.js LTS แล้วปิด/เปิด Terminal ใหม่
- `ENOENT package.json`: Terminal อยู่ผิดโฟลเดอร์ ให้ `cd` เข้าโฟลเดอร์ที่มี `package.json`
- Supabase error: ตรวจ URL, keys และรัน `supabase/schema.sql` ให้ครบ
- เปลี่ยน `.env.local` แล้วไม่เห็นผล: หยุด `npm run dev` ด้วย Control + C แล้วเริ่มใหม่
