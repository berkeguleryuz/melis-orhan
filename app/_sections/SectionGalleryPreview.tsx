"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { t } from "../_lib/i18n";
import { ArrowRightIcon } from "../_icons/ArrowRightIcon";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const photos = [
  "/melis-orhan/anilarimiz/anilarimiz-1.webp",
  "/melis-orhan/anilarimiz/anilarimiz-2.webp",
  "/melis-orhan/anilarimiz/anilarimiz-3.webp",
  "/melis-orhan/anilarimiz/anilarimiz-4.webp",
  "/melis-orhan/anilarimiz/anilarimiz-5.webp",
  "/melis-orhan/anilarimiz/anilarimiz-6.webp",
  "/melis-orhan/anilarimiz/anilarimiz-7.webp",
  "/melis-orhan/anilarimiz/anilarimiz-8.webp",
  "/melis-orhan/anilarimiz/anilarimiz-9.webp",
  "/melis-orhan/anilarimiz/anilarimiz-10.webp",
];

export function SectionGalleryPreview() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!gridRef.current) return;
      const items = gridRef.current.querySelectorAll("[data-bento]");
      items.forEach((item, i) => {
        gsap.fromTo(
          item,
          { opacity: 0, scale: 0.95 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 70%",
              toggleActions: "play none none none",
            },
            delay: i * 0.06,
          },
        );
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="bg-[#faf7f4] py-28 md:py-36 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 md:mb-20"
        >
          <p className="font-sans text-[11px] tracking-[0.4em] uppercase text-[#c75050] mb-3">
            {t("galleryLabel")}
          </p>
          <h2 className="font-merienda text-3xl md:text-4xl text-[#1a1210]">
            {t("galleryHeading")}
          </h2>
        </motion.div>

        {/* 2 rows x 5 columns grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4"
        >
          {photos.map((url, i) => (
            <div
              key={i}
              data-bento
              className="relative aspect-[3/4] rounded-xl overflow-hidden group cursor-pointer"
              style={{ opacity: 0 }}
            >
              <Image
                src={url}
                alt={`Anılarımız ${i + 1}`}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 20vw"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
            </div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-center mt-16"
        >
          <Link
            href={`/galeri`}
            className="group inline-flex items-center gap-2 font-sans text-sm tracking-[0.1em] uppercase text-[#c75050] hover:text-[#1a1210] transition-colors font-medium"
          >
            Fotoğraf Ekle
            <ArrowRightIcon
              size={14}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
