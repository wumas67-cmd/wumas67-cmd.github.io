---
name: gsap-web
description: Project animation skill for GSAP timelines, ScrollTrigger, parallax, hero motion, scroll reveals, and polished motion on the 一縷清香 static website.
version: 0.1.0-project
source: https://github.com/iart-ai/web-animation-skills/blob/main/skills/gsap-web/SKILL.md
---

# GSAP Web — 一縷清香專案版

Use this skill when building or reviewing motion for the site's HTML/CSS/JavaScript pages.

## Core rules
- Prefer one master timeline for coordinated hero entrances.
- Use ScrollTrigger for scroll-linked storytelling, reveal sequences, and subtle parallax.
- Animate `transform`, `opacity`, and `filter` whenever possible; avoid layout-heavy animation.
- Use intentional easing such as `power2.out`, `power3.out`, and `power2.inOut`; use `none` for scrubbed scroll motion.
- Keep movement calm, slow, refined, and consistent with an incense/lifestyle brand.
- Never let motion delay access to navigation, product information, cart actions, or checkout UI.
- Register plugins before use.
- Respect `prefers-reduced-motion` and provide a stable no-motion experience.

## Static GitHub Pages setup
Use CDN builds for GSAP and ScrollTrigger so the site stays build-step free.

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.15.0/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.15.0/ScrollTrigger.min.js"></script>
```

```js
gsap.registerPlugin(ScrollTrigger);
```

## Recommended patterns for this project
- Hero: stagger eyebrow, headline, paragraph, CTA and proof points on one timeline.
- Hero artwork: slowly move sun, mountain layers and incense holder at different scroll speeds.
- Sections: fade + translate reveal as content enters the viewport.
- Product cards: batch/stagger cards instead of creating excessive independent triggers.
- Scent finder and ritual steps: use restrained staggered entrances.
- Header: subtle transform/opacity changes only; avoid distracting continuous movement.
- Pointer parallax: desktop only, small range, transform only.

## Performance
- Prefer transform and opacity.
- Keep simultaneous animated elements limited.
- Use `will-change` only on elements that actually animate.
- Refresh ScrollTrigger after dynamic product cards are rendered if needed.
- Avoid heavy effects or large third-party animation dependencies beyond GSAP for this static site.

## Accessibility
If `prefers-reduced-motion: reduce` is active:
- skip decorative entrance/parallax animations;
- show content immediately;
- preserve all functionality;
- leave only essential state feedback.

## Project design direction
Motion should feel like incense smoke: gradual, soft, layered, and never abrupt. The goal is premium atmosphere, not spectacle.
