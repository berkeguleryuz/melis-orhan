#!/usr/bin/env python3
"""Convert Melis & Orhan source photos to optimized webp with clean ASCII names."""
from pathlib import Path
from PIL import Image, ImageOps

SRC = Path(__file__).resolve().parent.parent / "public" / "melisorhan2026"
DST = Path(__file__).resolve().parent.parent / "public" / "melis-orhan"
DST.mkdir(parents=True, exist_ok=True)
(DST / "anilarimiz").mkdir(exist_ok=True)

# (source, destination_relative, max_width, quality)
JOBS = [
    ("MELİS.jpg",        "melis.webp",        600, 84),
    ("ORHAN.jpg",        "orhan.webp",        600, 84),
    ("TANIŞTIK1.jpg",    "tanistik-1.webp",   1200, 80),
    ("TANIŞTIK2.jpg",    "tanistik-2.webp",   1200, 80),
    ("SEVDİK1.jpg",      "sevdik-1.webp",     1200, 80),
    ("SEVDİK2.JPG",      "sevdik-2.webp",     1200, 80),
    ("EVLENİYORUZ1.jpg", "evleniyoruz-1.webp", 1200, 80),
    ("EVLENİYORUZ2.jpg", "evleniyoruz-2.webp", 1200, 80),
    ("MYRINA GARDEN.jpg", "myrina-garden.webp", 1800, 84),
    ("ANILARIMIZ/ANILARIMIZZ1.jpg", "anilarimiz/anilarimiz-1.webp", 1000, 78),
    ("ANILARIMIZ/ANILARIMIZ2.jpg",  "anilarimiz/anilarimiz-2.webp", 1000, 78),
    ("ANILARIMIZ/ANILARIMIZZ3.jpg", "anilarimiz/anilarimiz-3.webp", 1000, 78),
    ("ANILARIMIZ/ANILARIMIZ4.jpg",  "anilarimiz/anilarimiz-4.webp", 1000, 78),
    ("ANILARIMIZ/ANILARIMIZZ5.jpg", "anilarimiz/anilarimiz-5.webp", 1000, 78),
    ("ANILARIMIZ/ANILARIMIZ6.jpg",  "anilarimiz/anilarimiz-6.webp", 1000, 78),
    ("ANILARIMIZ/ANILARIMIZ7.jpg",  "anilarimiz/anilarimiz-7.webp", 1000, 78),
    ("ANILARIMIZ/ANILARIMIZ8.jpg",  "anilarimiz/anilarimiz-8.webp", 1000, 78),
    ("ANILARIMIZ/ANILARIMIZ9.jpg",  "anilarimiz/anilarimiz-9.webp", 1000, 78),
    ("ANILARIMIZ/ANILARIMIZ10.jpg", "anilarimiz/anilarimiz-10.webp", 1000, 78),
]

for src_name, dst_name, max_w, q in JOBS:
    src = SRC / src_name
    dst = DST / dst_name
    if not src.exists():
        print(f"SKIP (missing): {src_name}")
        continue
    img = Image.open(src)
    img = ImageOps.exif_transpose(img)
    if img.mode not in ("RGB",):
        img = img.convert("RGB")
    if img.width > max_w:
        ratio = max_w / img.width
        new_size = (max_w, round(img.height * ratio))
        img = img.resize(new_size, Image.LANCZOS)
    img.save(dst, "WEBP", quality=q, method=6)
    size_kb = dst.stat().st_size // 1024
    print(f"OK  {src_name} -> {dst_name}  ({img.width}x{img.height}, {size_kb}KB)")

print("\nDone.")
