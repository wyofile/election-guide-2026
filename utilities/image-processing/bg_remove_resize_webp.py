#!/usr/bin/env python3
"""
Batch resize + WebP conversion, with optional background removal.

For every image in an input folder this script will:
  1. Optionally remove the background (rembg / U2Net) -> transparent RGBA
  2. Resize to SIZE x SIZE (images are assumed already square)
  3. Save as a .webp file (alpha transparency preserved when present)

Usage:
    python bg_remove_resize_webp.py INPUT_DIR OUTPUT_DIR
    python bg_remove_resize_webp.py ./pics ./out --size 300 --quality 90
    python bg_remove_resize_webp.py ./pics ./out --recursive --lossless
    python bg_remove_resize_webp.py ./pics ./out --no-bg-remove
    python bg_remove_resize_webp.py ./pics ./out --no-bg-remove --size 400 --lossless

Background removal requires rembg and downloads the model (~170 MB) to
~/.u2net on first run (internet required once). With --no-bg-remove,
rembg is not imported or used and PNG transparency is preserved.
"""

import argparse
import sys
from pathlib import Path

from PIL import Image

SUPPORTED = {".jpg", ".jpeg", ".png", ".bmp", ".tif", ".tiff", ".gif", ".webp"}


def has_transparency(img):
    """Return True if the image has meaningful alpha / transparency."""
    if img.mode in ("RGBA", "LA"):
        return True
    if img.mode == "P" and "transparency" in img.info:
        return True
    return False


def process_image(path, out_dir, session, size, quality, lossless, skip_bg_remove):
    try:
        with Image.open(path) as img:
            if skip_bg_remove:
                # Preserve alpha for PNGs (and any other format with transparency).
                # Everything else collapses to RGB so WebP doesn't carry an
                # unnecessary alpha channel.
                if has_transparency(img):
                    img = img.convert("RGBA")
                else:
                    img = img.convert("RGB")
                processed = img.resize((size, size), Image.LANCZOS)
            else:
                img = img.convert("RGBA")
                from rembg import remove
                processed = remove(img, session=session)
                processed = processed.resize((size, size), Image.LANCZOS)

        out_path = out_dir / (path.stem + ".webp")
        save_kwargs = {"format": "WEBP", "method": 6}
        if lossless:
            save_kwargs["lossless"] = True
        else:
            save_kwargs["quality"] = quality
        processed.save(out_path, **save_kwargs)
        return out_path
    except Exception as e:
        print(f"  ! Failed {path.name}: {e}", file=sys.stderr)
        return None


def collect_files(in_dir, recursive):
    it = in_dir.rglob("*") if recursive else in_dir.iterdir()
    return sorted(f for f in it if f.is_file() and f.suffix.lower() in SUPPORTED)


def main():
    p = argparse.ArgumentParser(
        description="Resize and convert images to WebP, with optional background removal."
    )
    p.add_argument("input_dir", help="Folder containing source images")
    p.add_argument("output_dir", help="Folder where .webp files are written")
    p.add_argument("--size", type=int, default=300, help="Output dimension (default 300)")
    p.add_argument("--quality", type=int, default=90, help="WebP quality 1-100 (default 90)")
    p.add_argument("--lossless", action="store_true", help="Lossless WebP (ignores --quality)")
    p.add_argument("--recursive", action="store_true", help="Recurse into subfolders")
    p.add_argument("--no-bg-remove", action="store_true", dest="no_bg_remove",
                   help="Skip background removal — just resize and convert to WebP")
    p.add_argument("--model", default="u2net",
                   help="rembg model: u2net, u2netp, isnet-general-use, etc. (ignored with --no-bg-remove)")
    args = p.parse_args()

    in_dir = Path(args.input_dir)
    out_dir = Path(args.output_dir)

    if not in_dir.is_dir():
        sys.exit(f"Input directory not found: {in_dir}")
    out_dir.mkdir(parents=True, exist_ok=True)

    files = collect_files(in_dir, args.recursive)
    if not files:
        sys.exit(f"No supported images found in {in_dir}")

    session = None
    if not args.no_bg_remove:
        from rembg import new_session
        session = new_session(args.model)

    mode = "resize + WebP only" if args.no_bg_remove else f"bg-remove ({args.model}) + resize + WebP"
    print(f"Mode: {mode}")
    print(f"Processing {len(files)} image(s) -> {out_dir}")

    ok = 0
    for f in files:
        print(f"  - {f.name}")
        if process_image(f, out_dir, session, args.size, args.quality, args.lossless, args.no_bg_remove):
            ok += 1

    print(f"Done. {ok}/{len(files)} succeeded.")


if __name__ == "__main__":
    main()
