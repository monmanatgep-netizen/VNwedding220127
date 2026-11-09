
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Music2, VolumeX } from "lucide-react";
import { wedding } from "@/lib/wedding";

export default function MusicToggle() {
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  const playMusic = useCallback(async () => {
    if (!audio.current) return;

    try {
      await audio.current.play();
      setPlaying(true);
    } catch {
      // หากเบราว์เซอร์บล็อก autoplay
      // จะรอให้ผู้ใช้แตะหน้าจอเพื่อเริ่มเพลง
      setPlaying(false);
    }
  }, []);

  useEffect(() => {
    const player = audio.current;
    if (!player) return;

    // พยายามเล่นทันทีเมื่อเปิดหน้าเว็บ
    playMusic();

    // หาก autoplay ถูกบล็อก ให้เริ่มเมื่อแตะหน้าจอครั้งแรก
    const startOnInteraction = () => {
      playMusic();
    };

    document.addEventListener("pointerdown", startOnInteraction, {
      once: true,
    });

    return () => {
      document.removeEventListener("pointerdown", startOnInteraction);
    };
  }, [playMusic]);

  async function toggle() {
    if (!audio.current) return;

    if (playing) {
      audio.current.pause();
      setPlaying(false);
    } else {
      await playMusic();
    }
  }

  return (
    <>
      <audio
        ref={audio}
        src={wedding.musicPath}
        loop
        preload="auto"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />

      <button
        onClick={toggle}
        aria-label={playing ? "ปิดเพลง" : "เปิดเพลง"}
        className="fixed bottom-5 right-5 z-40 grid h-12 w-12 place-items-center rounded-full border border-white bg-white/90 text-[#789bc5] shadow-lg backdrop-blur"
      >
        {playing ? <Music2 size={19} /> : <VolumeX size={19} />}
      </button>
    </>
  );
}
