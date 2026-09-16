#!/usr/bin/env python3
"""Convert a local image to a Base64 data URL without network access."""

import argparse
import base64
from pathlib import Path

MIME_TYPES = {
    ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
    ".gif": "image/gif", ".webp": "image/webp", ".svg": "image/svg+xml",
    ".bmp": "image/bmp", ".ico": "image/x-icon", ".avif": "image/avif",
    ".tif": "image/tiff", ".tiff": "image/tiff",
}

def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("input", type=Path, help="Local image path")
    parser.add_argument("--output", "-o", type=Path, help="Write the data URL to this UTF-8 file")
    parser.add_argument("--mime-type", help="Override MIME detection, for example image/png")
    args = parser.parse_args()

    image_path = args.input.resolve(strict=True)
    mime_type = args.mime_type or MIME_TYPES.get(image_path.suffix.lower())
    if not mime_type:
        parser.error(f"unsupported image extension {image_path.suffix!r}; pass --mime-type")
    if not mime_type.startswith("image/"):
        parser.error("--mime-type must be an image MIME type, such as image/png")

    payload = base64.b64encode(image_path.read_bytes()).decode("ascii")
    data_url = f"data:{mime_type};base64,{payload}"
    if args.output:
        output_path = args.output.resolve()
        output_path.parent.mkdir(parents=True, exist_ok=True)
        output_path.write_text(data_url, encoding="utf-8")
        print(output_path)
    else:
        print(data_url)
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
