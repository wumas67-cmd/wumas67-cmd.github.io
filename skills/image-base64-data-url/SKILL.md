---
name: image-base64-data-url
description: Convert a local image file into a Base64 data URL for HTML, CSS, JSON, or API payloads. Use when an image must be embedded inline, a local image path does not load in a website, or the user asks to encode an image as Base64 on Windows or in a local project.
license: MIT
---

# Image Base64 Data URL

Convert local images offline. Do not upload images or expose the Base64 payload in chat unless the user asks to see it.

## Workflow

1. Confirm the input path exists and is an image.
2. Prefer the PowerShell script on Windows; use the Python script when Python is already part of the project workflow.
3. Write large results to a file instead of printing them into logs or chat.
4. Verify the result begins with `data:image/<type>;base64,` and, when practical, decode it and compare bytes with the source.
5. Warn that Base64 increases size by roughly one third. For large public website images, a normal image file is usually better for caching and performance.

## PowerShell

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "<skill-dir>\scripts\image-to-data-url.ps1" -InputPath "<image>" -OutputPath "<output.txt>"
```

Omit `-OutputPath` only for small images when stdout is specifically useful.

## Python

```powershell
python "<skill-dir>\scripts\image_to_data_url.py" "<image>" --output "<output.txt>"
```

Both scripts support PNG, JPEG, GIF, WebP, SVG, BMP, ICO, AVIF, and TIFF by extension. Use `-MimeType` or `--mime-type` to override MIME detection.

## Website use

```html
<img src="data:image/jpeg;base64,..." alt="Product photo">
```

```css
background-image: url("data:image/png;base64,...");
```

Keep the entire data URL on one line. Do not add spaces after the comma.
