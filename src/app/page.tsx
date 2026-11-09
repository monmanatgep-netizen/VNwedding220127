import Image from "next/image";
import { MapPin, Heart, Sparkles, CalendarDays, Car } from "lucide-react";
import Countdown from "@/components/Countdown";
import RSVPForm from "@/components/RSVPForm";
import Guestbook from "@/components/Guestbook";
import Timeline from "@/components/Timeline";
import MusicToggle from "@/components/MusicToggle";
import CalendarButton from "@/components/CalendarButton";
import DigitalGift from "@/components/DigitalGift";
import Recommendations from "@/components/Recommendations";
import SectionBackground from "@/components/SectionBackground";
import WeddingGallery from "@/components/WeddingGallery";
import { wedding } from "@/lib/wedding";

function SectionTitle({ kicker, title, subtitle }: { kicker: string; title: string; subtitle?: string }) {
  return <div className="mb-10 text-center">
    <p className="eyebrow">{kicker}</p>
    <h2 className="mt-3 font-display text-3xl text-[#789bc5] sm:text-4xl">{title}</h2>
    {subtitle && <p className="mt-3 font-thai text-sm text-[#8b796a]">{subtitle}</p>}
    <div className="gold-line mx-auto mt-6 max-w-28"/>
  </div>;
}

export default function Home() {
  return <main className="overflow-hidden">
    <MusicToggle/>
    <section className="relative isolate flex min-h-[92svh] items-center justify-center px-5 py-20 text-center">
      <SectionBackground section="hero" className="pointer-events-none absolute inset-0 -z-10" as="div"/>
      <div className="pointer-events-none absolute inset-5 border border-[#d9e4f0] sm:inset-8"/>
      <div className="pointer-events-none absolute inset-7 border border-[#eadfcf] sm:inset-10"/>
      <div className="relative z-10 mx-auto max-w-3xl">
        <p className="eyebrow">Together with their families</p>
        <p className="mt-12 font-thai text-sm text-[#79583f]">ขอเรียนเชิญร่วมเป็นเกียรติในพิธีมงคลสมรส</p>
        <div className="mt-8 font-display text-5xl tracking-wide text-[#789bc5] sm:text-7xl">{wedding.brideLatin}</div>
        <div className="my-2 flex items-center justify-center gap-4 text-[#ed9296]">
          <span className="h-px w-12 bg-[#c6a878]"/><Heart size={19} fill="currentColor"/><span className="h-px w-12 bg-[#c6a878]"/>
        </div>
        <div className="font-display text-5xl tracking-wide text-[#789bc5] sm:text-7xl">{wedding.groomLatin}</div>
        <p className="mt-8 font-thai text-lg text-[#79583f]">{wedding.bride} <span className="text-[#ed9296]">&</span> {wedding.groom}</p>
        <p className="mt-5 font-display text-xl tracking-[.18em] text-[#789bc5]">{wedding.dateEnglish}</p>
        <div className="mt-10 flex justify-center"><a href="#details" className="btn-primary">Discover our day <span aria-hidden>↓</span></a></div>
        <p className="mt-12 text-[10px] tracking-[.3em] text-[#a89582]">A DAY TO REMEMBER · 2027</p>
      </div>
      <div className="absolute -left-12 top-24 h-40 w-40 rounded-full bg-[#f6dadd]/40 blur-3xl"/>
      <div className="absolute -right-12 bottom-24 h-44 w-44 rounded-full bg-[#dce7f4]/70 blur-3xl"/>
    </section>

    <WeddingGallery placement="after-hero"/>

    <section className="section-space relative isolate bg-[#fbfaf7] text-center">
      <SectionBackground section="countdown" className="pointer-events-none absolute inset-0 -z-10" as="div"/>
      <SectionTitle kicker="Save the date" title="Counting down to forever" subtitle="นับถอยหลังสู่วันสำคัญของเรา"/>
      <Countdown/>
      <p className="mt-8 font-thai text-sm text-[#79583f]">วันศุกร์ที่ 22 มกราคม 2570</p>
    </section>

    <WeddingGallery placement="after-countdown"/>

    <section id="details" className="section-space relative isolate">
      <SectionBackground section="details" className="pointer-events-none absolute inset-0 -z-10" as="div"/>
      <SectionTitle kicker="The celebration" title="Wedding Details" subtitle="รายละเอียดพิธีมงคลสมรส"/>
      <div className="mx-auto grid max-w-4xl gap-5 md:grid-cols-2">
        <div className="card p-7 text-center">
          <CalendarDays className="mx-auto text-[#789bc5]" size={28}/>
          <p className="eyebrow mt-4">Date & time</p>
          <h3 className="mt-2 font-display text-2xl text-[#789bc5]">22 January 2027</h3>
          <p className="mt-2 font-thai text-sm text-[#79583f]">เริ่มพิธีเวลา 07.00 น.</p>
        </div>
        <div className="card p-7 text-center">
          <MapPin className="mx-auto text-[#789bc5]" size={28}/>
          <p className="eyebrow mt-4">Venue</p>
          <h3 className="mt-2 font-thai text-xl text-[#789bc5]">{wedding.venue}</h3>
          <p className="mt-2 font-thai text-sm text-[#79583f]">{wedding.province}</p>
        </div>
      </div>
      <div className="mt-8 text-center"><CalendarButton/></div>
    </section>

    <WeddingGallery placement="after-details"/>

    <section className="section-space relative isolate bg-[#fbfaf7]">
      <SectionBackground section="timeline" className="pointer-events-none absolute inset-0 -z-10" as="div"/>
      <SectionTitle kicker="Order of events" title="The Wedding Day" subtitle="กำหนดการภายในงาน"/>
      <Timeline/>
    </section>

    <WeddingGallery placement="after-timeline"/>

    <section className="section-space relative isolate">
      <SectionBackground section="venue" className="pointer-events-none absolute inset-0 -z-10" as="div"/>
      <SectionTitle kicker="Find us" title="The Venue" subtitle={`${wedding.venue} · ${wedding.province}`}/>
      <div className="card mx-auto max-w-4xl overflow-hidden">
        <div className="grid md:grid-cols-2">
          <div className="flex min-h-64 flex-col justify-center bg-[#eaf0f6] p-8">
            <MapPin size={30} className="text-[#789bc5]"/>
            <h3 className="mt-5 font-thai text-xl text-[#79583f]">{wedding.venue}</h3>
            <p className="mt-2 font-thai text-sm text-[#8b796a]">{wedding.province}</p>
            <p className="mt-5 flex items-center gap-2 font-thai text-xs text-[#8b796a]"><Car size={16}/> {wedding.parkingNote}</p>
            <a className="btn-primary mt-6 inline-flex w-fit" target="_blank" rel="noreferrer"
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(wedding.mapsQuery)}`}>เปิด Google Maps</a>
          </div>
          <div className="flex min-h-64 items-center justify-center bg-[#f7f4ee] p-8 text-center">
            <div><Sparkles className="mx-auto text-[#c6a878]" size={32}/><p className="mt-4 font-display text-2xl text-[#789bc5]">See you there</p><p className="mt-2 font-thai text-sm text-[#79583f]">เรารอพบคุณในวันพิเศษนี้</p></div>
          </div>
        </div>
      </div>
    </section>

    <WeddingGallery placement="after-venue"/>

    <section id="rsvp" className="section-space relative isolate bg-[#fbfaf7]">
      <SectionBackground section="rsvp" className="pointer-events-none absolute inset-0 -z-10" as="div"/>
      <SectionTitle kicker="Kindly respond" title="Will you join us?" subtitle="ขอความกรุณาตอบรับการเข้าร่วมงาน"/>
      <div className="mx-auto max-w-xl"><RSVPForm/></div>
    </section>

    <WeddingGallery placement="after-rsvp"/>

    <section id="guestbook" className="section-space relative isolate">
      <SectionBackground section="guestbook" className="pointer-events-none absolute inset-0 -z-10" as="div"/>
      <SectionTitle kicker="With love" title="Leave a wish" subtitle="ร่วมฝากข้อความและคำอวยพรให้กับเรา"/>
      <Guestbook/>
    </section>

    <WeddingGallery placement="after-guestbook"/>

    <section className="section-space relative isolate bg-[#fbfaf7]">
      <SectionBackground section="gift" className="pointer-events-none absolute inset-0 -z-10" as="div"/>
      <SectionTitle kicker="A little gift" title="Digital Gift" subtitle="คำอวยพรและความปรารถนาดีของคุณมีค่ากับเรามากที่สุด"/>
      <DigitalGift/>
    </section>
    <WeddingGallery placement="after-gift"/>
    <Recommendations/>
    <WeddingGallery placement="after-recommendations"/>
    <WeddingGallery placement="before-footer"/>
    <section className="relative isolate bg-[#789bc5] px-5 py-12 text-center text-white">
      <SectionBackground section="footer" className="pointer-events-none absolute inset-0 -z-10" as="div"/>
      <p className="font-display text-2xl">Your presence is our present</p>
      <p className="mt-5 text-xs tracking-widest">PARICHART & MONMANAT · 22.01.2027</p>
    </section>
    <footer className="luxury-footer px-5 py-10 text-center">
      <div className="mb-5 flex flex-wrap items-center justify-center gap-3">
        <a href="#guestbook" className="btn-primary">เข้าดูคำอวยพร ♡</a>
        <a href="/admin/login" className="rounded-full border border-white/80 bg-white/75 px-3 py-2 text-[11px] text-[#9a8b7e] shadow-sm transition hover:bg-white hover:text-[#789bc5]">Admin</a>
      </div>
      <p className="text-xs text-[#9a8b7e]">Made with love · Parichart & Monmanat</p>
    </footer>
  </main>;
}
