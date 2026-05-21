"use client";

import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useWedding } from "../_lib/context";
import { t } from "../_lib/i18n";

const TR_MONTHS = [
  "Ocak","Şubat","Mart","Nisan","Mayıs","Haziran",
  "Temmuz","Ağustos","Eylül","Ekim","Kasım","Aralık",
];

function playChime() {
  try {
    const ctx = new AudioContext();
    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, now + i * 0.15);
      gain.gain.linearRampToValueAtTime(0.12, now + i * 0.15 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.15 + 1.2);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now + i * 0.15);
      osc.stop(now + i * 0.15 + 1.5);
    });
    setTimeout(() => ctx.close(), 3000);
  } catch { /* audio not supported */ }
}

export function SectionHero() {
  const wedding = useWedding();
  const [videoEnded, setVideoEnded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const formattedDate = useMemo(() => {
    if (!wedding.weddingDate) return "";
    const d = new Date(wedding.weddingDate);
    return `${d.getDate()} ${TR_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
  }, [wedding.weddingDate]);

  const handleVideoEnd = useCallback(() => {
    setVideoEnded(true);
    playChime();
  }, []);

  // Video sadece zarf açıldıktan sonra başlasın — overlay arkasında oynayıp
  // ziyaretçi siteye girmeden Save the Date moduna geçmesin diye.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const start = () => {
      v.currentTime = 0;
      v.play().catch(() => {});
    };
    if (document.documentElement.classList.contains("mo-envelope-seen")) {
      start();
      return;
    }
    window.addEventListener("mo:envelope-opened", start, { once: true });
    return () => window.removeEventListener("mo:envelope-opened", start);
  }, []);

  return (
    <section
      className="relative min-h-svh overflow-hidden bg-black flex flex-col justify-center md:block"
      data-section-dark
    >
      {/* Mobile decorative backdrop — warm dark gradient instead of bare bars */}
      <div
        aria-hidden
        className="absolute inset-0 md:hidden bg-[radial-gradient(ellipse_at_top,#2c2017_0%,#150f0b_55%,#0a0706_100%)]"
      />

      {/* Top panel — mobile only: couple names + tagline fill the upper space */}
      <div className="relative z-0 md:hidden flex-1 flex flex-col items-center justify-center text-center px-6 pt-24 pb-5">
        <span className="font-sans text-[0.7rem] tracking-[0.35em] uppercase text-[#c9a96e]">
          {t("heroTagline")}
        </span>
        <h1 className="mt-3 font-merienda text-5xl text-[#f5ede1] leading-[1.05]">
          {wedding.brideName}
          <span className="block font-sans text-xl text-[#c9a96e] my-1">&amp;</span>
          {wedding.groomName}
        </h1>
      </div>

      {/* Video — contained block on mobile (no crop), full cover on desktop */}
      <video
        ref={videoRef}
        muted
        playsInline
        preload="auto"
        onEnded={handleVideoEnd}
        className="relative z-0 w-full aspect-video object-cover md:absolute md:inset-0 md:h-full md:aspect-auto"
        src="/6.mp4"
      />

      {/* Bottom panel — mobile only: date, venue + scroll hint fill the lower space */}
      <div className="relative z-0 md:hidden flex-1 flex flex-col items-center justify-center text-center gap-4 px-6 pt-5 pb-28">
        <div className="w-12 h-px bg-[#c9a96e]/60" />
        <p className="font-sans text-xs tracking-[0.18em] text-[#e7dccb]">
          {formattedDate}
          {wedding.venueName && (
            <span className="text-[#c9a96e]/70"> &middot; {wedding.venueName}</span>
          )}
        </p>
        <span className="font-sans text-[0.65rem] tracking-[0.3em] uppercase text-[#c9a96e]/70">
          {t("heroScrollHint")}
        </span>
      </div>

      {/* "Save the Date" reveal — white bg, black text, word by word */}
      <AnimatePresence>
        {videoEnded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute inset-0 z-10 bg-white flex flex-col items-center justify-center"
          >
            {/* "Save" */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white"
            >
              <span className="block font-merienda text-6xl sm:text-7xl md:text-9xl text-[#1a1210] leading-none">
                Save
              </span>
            </motion.div>

            {/* "the" */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white my-2 md:my-3"
            >
              <span className="block font-sans text-2xl sm:text-3xl md:text-5xl text-[#6b6560] tracking-[0.3em] uppercase leading-none">
                the
              </span>
            </motion.div>

            {/* "Date" */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.4, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white"
            >
              <span className="block font-merienda text-6xl sm:text-7xl md:text-9xl text-[#c75050] leading-none">
                Date
              </span>
            </motion.div>

            {/* Decorative line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 2.0 }}
              className="w-16 md:w-24 h-px bg-[#c9a96e] mt-8 md:mt-12 mb-6 md:mb-8"
            />

            {/* Date + venue */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 2.3 }}
              className="font-sans text-sm md:text-base tracking-[0.15em] text-[#6b6560]"
            >
              {formattedDate}
              {wedding.venueName && (
                <span className="text-[#6b6560]/50"> &middot; {wedding.venueName}</span>
              )}
            </motion.p>

            {/* CTA button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 2.7 }}
              className="mt-8 md:mt-10"
            >
              <Link
                href={`/lcv`}
                className="inline-flex items-center font-sans text-xs md:text-sm font-medium tracking-[0.2em] uppercase bg-[#c75050] text-white rounded-full px-8 py-3.5 hover:bg-[#b04545] transition-colors duration-300"
              >
                {t("heroCtaButton")}
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
