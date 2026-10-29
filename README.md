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

The right-side Sign in button links to the user-supplied https://app.ubossai.com/login destination, including on mobile. Real product screenshots may replace or augment the original illustrative scenes. The site does not need a backend or API keys to work. Google Fonts are optional external font resources, with local system-font fallbacks.

## Verification

Production build and TypeScript checks; browser checks of four-slide automatic progression, direct navigation, pause/play, keyboard wraparound, graph inspection, responsive navigation, journey tabs, FAQ disclosure, section links, console output, and horizontal overflow at desktop and narrow viewport sizes. Touch swipe and reduced-motion support are implemented; physical touch-device testing remains recommended.


## Cinematic hero update

The hero uses original beveled glass-and-metal meshes, procedural studio reflections, soft shadows, physical conduit ports, and event-timed signals. scene-data.ts defines the workflow relationships and responsive arrangements; scene-geometry.ts builds the shared materials and objects. No stock images, rendered videos, or external 3D assets are required. Desktop rendering is capped at 1.65 device pixels with 1024-pixel shadow maps; mobile uses 1.35 and 512, plus reduced glass transmission. Only the active scene schedules continuous rendering; paused or reduced-motion scenes render on interaction. Human approval gates remain closed. The homepage copy and sections below the hero are unchanged. A single spacing correction preserves the first headline when mobile hides its line breaks.

## Holographic motion reference

The four hero scenes now interpret the supplied Craftvoy Agentic AI Short (https://www.youtube.com/shorts/Nlwc6wTzzK0) through original procedural 3D geometry: raised metal plinths, floating holograms, rotating gears and rings, braided cyan/amber energy ribbons, travelling particles, floating workflow HUDs, and gentle scene drift. holographic-node.ts builds role-specific modules; energy-flow.ts supplies animated additive ribbon materials. Waiting tasks remain dim and stationary; required approval gates stay closed. The reference video and branding are not embedded.

