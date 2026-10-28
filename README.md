# Chief Engine

An original, responsive marketing homepage built with Next.js, React, TypeScript, GSAP, and Three.js. It exports to static files for private Sites hosting. No product backend, authentication, or internal application routes are modified.

## Development

```sh
npm ci
npm run dev
npm run typecheck
npm run build
```

The production export is in `out/`. Use a static HTTP server to preview that directory; `next start` does not serve static exports.

## Structure

- `app/page.tsx`: homepage narrative, feature sections, oversight illustration, use cases, FAQ, and footer.
- `app/globals.css`: visual identity, responsive layouts, and reduced-motion styling.
- `components/Hero.tsx`: exactly four slides; GSAP transitions; progress, arrows, pause/play, keyboard and touch handlers; viewport and tab visibility handling.
- `components/GraphScene.tsx`: four original WebGL scenes, projected interactive labels, node/edge inspection, and a static SVG/CSS fallback when WebGL is unavailable.
- `components/Journey.tsx`: accessible five-stage workflow walkthrough.
- `components/Header.tsx`: brand and responsive navigation.

## Reference direction

The supplied links were reviewed for inspiration. Commercial template source was not used.

- Aiero: https://aiero-nextjs-template.netlify.app/ — spacious technology layout and presentation.
- GSAP full-screen carousel: https://codepen.io/plenge/pen/dyYzrXr — horizontal scene transitions and stable navigation.
- Orchid: https://animatedwebs.com/demos/orchid-ai-studio/index.html — purple-black atmosphere and layered lighting.
- Synqora: https://wrapmarket.com/item/synqora-ai-agent-management-saas-landing-page-template-WGJFG5MT6 and its live preview https://synqora-mu.vercel.app/ — interactive agent networks and travelling signals.
- 3D Force Graph examples: https://vasturiano.github.io/3d-force-graph/example/tree/ and the supplied expandable-nodes, directional-links-particles, directional-links-arrows, emit-particles, highlight, and click-to-focus examples — graph structure, directional connections, and relationship inspection.

## Content and integration boundaries

All product claims come from the supplied brief. Workflow content is illustrative. No invented pricing, testimonials, customer logos, integrations, performance statistics, or compliance badges are included. All calls to action link to working homepage sections.

An existing verified sign-in URL was not supplied. Add the real destination to the header when available. Real product screenshots may replace or augment the original illustrative scenes. The site does not need a backend or API keys to work. Google Fonts are optional external font resources, with local system-font fallbacks.

## Verification

Production build and TypeScript checks; browser checks of four-slide automatic progression, direct navigation, pause/play, keyboard wraparound, graph inspection, responsive navigation, journey tabs, FAQ disclosure, section links, console output, and horizontal overflow at desktop and narrow viewport sizes. Touch swipe and reduced-motion support are implemented; physical touch-device testing remains recommended.
