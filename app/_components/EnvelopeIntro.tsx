"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Image from "next/image";

import { useWedding } from "../_lib/context";

const STORAGE_KEY = "mo-envelope-opened";
// TEST modu: true iken zarf HER sayfa yenilemesinde tekrar açılır.
// CANLIYA ALMADAN ÖNCE false YAP (oturum başına bir kez gösterim).
const ALWAYS_SHOW = true;
// Üst kapağın üçgen geometrisi — hem kapak katmanında hem iç kısımda kullanılır.
const FLAP_CLIP = "polygon(0% 0%, 100% 0%, 50% 53%)";

export function EnvelopeIntro() {
  const wedding = useWedding();
  const brideFirst = wedding.brideName.split(" ")[0];
  const groomFirst = wedding.groomName.split(" ")[0];

  const [removed, setRemoved] = useState(false);
  const [opening, setOpening] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const sealRef = useRef<HTMLButtonElement>(null);
  const flapRef = useRef<HTMLDivElement>(null);
  const envelopeRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ALWAYS_SHOW) {
      try {
        sessionStorage.removeItem(STORAGE_KEY);
      } catch {}
      document.documentElement.classList.remove("mo-envelope-seen");
      return;
    }
    let opened = false;
    try {
      opened = sessionStorage.getItem(STORAGE_KEY) === "1";
    } catch {}
    // eslint-disable-next-line react-hooks/set-state-in-effect -- mount'ta tek seferlik, hydration-guvenli kaldirma
    if (opened) {
      setRemoved(true);
      markOpened();
    }
  }, []);

  function markOpened() {
    if (typeof window === "undefined") return;
    document.documentElement.classList.add("mo-envelope-seen");
    window.dispatchEvent(new CustomEvent("mo:envelope-opened"));
  }

  useEffect(() => {
    if (removed) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [removed]);

  function finish() {
    if (!ALWAYS_SHOW) {
      try {
        sessionStorage.setItem(STORAGE_KEY, "1");
      } catch {}
    }
    markOpened();
    setRemoved(true);
  }

  function handleOpen() {
    if (opening) return;
    setOpening(true);

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      gsap.to(rootRef.current, {
        opacity: 0,
        duration: 0.4,
        onComplete: finish,
      });
      return;
    }

    const tl = gsap.timeline({ onComplete: finish });
    tl.to(sealRef.current, { scale: 1.09, duration: 0.16, ease: "power2.out" })
      .to(sealRef.current, {
        y: -130,
        rotate: -28,
        opacity: 0,
        duration: 0.5,
        ease: "back.in(1.5)",
      })
      .to(
        flapRef.current,
        { rotateX: -172, duration: 0.8, ease: "power3.inOut" },
        "-=0.18",
      )
      .to(
        glowRef.current,
        { opacity: 1, duration: 0.5, ease: "power2.out" },
        "-=0.5",
      )
      .to(
        envelopeRef.current,
        { scale: 1.95, opacity: 0, duration: 1.2, ease: "power2.in" },
        "-=0.3",
      )
      .to(
        flashRef.current,
        { opacity: 1, duration: 0.7, ease: "power2.out" },
        "-=1.05",
      )
      .to(
        rootRef.current,
        { opacity: 0, duration: 0.7, ease: "power2.inOut" },
        "-=0.25",
      );
  }

  if (removed) return null;

  return (
    <div
      ref={rootRef}
      className="envelope-intro fixed inset-0 z-[100] flex items-center justify-center
                 bg-[radial-gradient(ellipse_at_center,#2a1818_0%,#120909_75%)]"
    >
      <div
        ref={envelopeRef}
        className="envelope relative h-[min(78vh,560px)] aspect-[654/938]
                   drop-shadow-[0_30px_60px_rgba(0,0,0,0.6)]"
        style={{ perspective: "1400px" }}
      >
        {/* Taban: kapalı zarf görseli */}
        <div className="absolute inset-0">
          <Image
            src="/envelope.webp"
            alt="Davetiye zarfı"
            fill
            priority
            sizes="min(54vh, 390px)"
            className="object-cover"
          />
        </div>

        {/* İç kısım — kapak açılınca görünür koyu cep */}
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,#1f1010,#0a0505)]"
          style={{ clipPath: FLAP_CLIP }}
        />

        {/* Üst kapak — taban görselin dilimi, bağımsız döner */}
        <div
          ref={flapRef}
          className="envelope-flap absolute inset-0"
          style={{
            clipPath: FLAP_CLIP,
            transformOrigin: "top center",
            transformStyle: "preserve-3d",
            backfaceVisibility: "hidden",
          }}
        >
          <Image
            src="/envelope.webp"
            alt=""
            aria-hidden
            fill
            sizes="min(54vh, 390px)"
            className="object-cover"
          />
        </div>

        {/* Mum mührü — gold/rose tonu */}
        <div className="absolute left-1/2 top-[53%] -translate-x-1/2 -translate-y-1/2">
          <button
            ref={sealRef}
            type="button"
            aria-label="Davetiyeyi aç"
            onClick={handleOpen}
            className="envelope-seal h-[88px] w-[88px] rounded-full
                       bg-[radial-gradient(circle_at_38%_32%,#f5e3bd,#c9a96e_65%,#8a6b3b)]
                       shadow-[0_8px_20px_rgba(0,0,0,0.55),inset_0_2px_6px_rgba(255,255,255,0.4)]
                       flex items-center justify-center cursor-pointer
                       ring-1 ring-black/10"
          >
            <span className="text-[#2a1810]/90 select-none leading-none flex items-center">
              <span className="font-merienda italic text-[26px]">{brideFirst.charAt(0)}</span>
              <span className="font-geist italic text-[28px] font-light mx-0.5 leading-none">
                &amp;
              </span>
              <span className="font-merienda italic text-[26px]">{groomFirst.charAt(0)}</span>
            </span>
          </button>
        </div>

        {/* Çift altı yazılar */}
        <div className="absolute left-0 right-0 top-[64%] text-center px-4 select-none">
          <p className="text-2xl text-[#e8c987] drop-shadow-[0_1px_2px_rgba(0,0,0,0.55)] leading-tight">
            <span className="font-merienda">{brideFirst}</span>
            <span className="font-cormorant italic font-medium mx-1.5 text-[1.05em]">ve</span>
            <span className="font-merienda">{groomFirst}</span>
          </p>
          <p className="mt-2 font-sans text-[10px] tracking-[0.3em] uppercase text-[#d99a9a]/75">
            sizi davet ediyor
          </p>
        </div>

        {/* Açılış ışık parlaması */}
        <div
          ref={glowRef}
          className="envelope-glow absolute inset-0 opacity-0 pointer-events-none
                     bg-[radial-gradient(circle_at_50%_45%,rgba(245,220,170,0.9),transparent_65%)]"
        />
      </div>

      {/* İpucu */}
      <p className="absolute bottom-12 left-1/2 -translate-x-1/2 font-sans text-[11px]
                    tracking-[0.25em] uppercase text-[#f5ede1]/45">
        Açmak için mühre dokun
      </p>

      {/* Siteye geçişte ekranı saran sıcak ışık */}
      <div
        ref={flashRef}
        className="pointer-events-none absolute inset-0 opacity-0
                   bg-[radial-gradient(circle_at_50%_45%,rgba(255,228,180,0.97),rgba(232,180,160,0.55)_45%,rgba(199,80,80,0.18)_72%)]"
      />
    </div>
  );
}
