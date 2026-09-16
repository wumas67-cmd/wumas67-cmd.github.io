---
name: animations
description: Project animation skill for performant CSS/JS motion, microinteractions, scroll effects, accessibility, and perceived quality on the 一縷清香 website.
version: 1.0.0-project
source: https://github.com/mthines/agent-skills/blob/main/skills/design/animations/SKILL.md
---

# Animations — 一縷清香專案版

Use this skill when designing, implementing, or reviewing website motion.

## Core principles
- Animate `transform`, `opacity`, and lightweight `filter` effects whenever possible.
- Use CSS transitions for simple hover/focus state changes.
- Use CSS keyframes for looping decorative motion.
- Use GSAP/ScrollTrigger when motion requires sequencing, scroll synchronization, stagger, or parallax.
- Keep UI feedback in the 150–500ms range; larger atmospheric sequences may be slower when they do not block interaction.
- Motion direction should match the user's action and the visual hierarchy.
- Do not animate layout-heavy properties such as width, height, top, left, margin, or padding unless there is a measured reason.

## Motion intensity for this brand
- Microinteractions: subtle and quick.
- Section entrances: calm, 20–40px travel maximum.
- Parallax: low amplitude, slow, layered.
- Product cards: staggered reveal with restrained scale/translate.
- Hero moment: the strongest animation on the page, but still elegant and readable.
- Avoid bounce-heavy, elastic, neon, arcade, or aggressive marketplace-style motion.

## Accessibility
Always support:
```css
@media (prefers-reduced-motion: reduce) {
  /* disable decorative movement and reveal content immediately */
}
```

When reduced motion is requested:
- stop decorative loops where practical;
- disable scroll-scrub/parallax;
- show content immediately;
- keep essential focus, open/close, and cart-state feedback usable.

## Performance checklist
- Transform/opacity first.
- Keep continuous animations limited.
- Do not leave `will-change` on large numbers of elements.
- Avoid large blurred layers moving across the whole viewport.
- Batch repeated card/row reveals where possible.
- Animation failure must never break navigation, products, or cart functionality.

## 一縷清香 motion language
Think of smoke, breathing, paper, sunlight, and slow mountain mist:
- soft acceleration and deceleration;
- layered depth;
- gradual opacity;
- stagger rather than simultaneous movement;
- long-form ambient movement only in decorative areas.
