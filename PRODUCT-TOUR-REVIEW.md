# Local guided-product-tour review

Status: localhost approved by the user on 15 November 2026. Production Vercel deployment and GitHub main push are authorized, in that order.

Open http://127.0.0.1:3004/ after building the static export. The earlier five static reference cards remain at /carousel-preview/.

## Coverage
- UDashview: 5 steps, 49.893 seconds. Workspace context, visible view controls, UDO, UApprove and UForms navigation.
- U&Me: 4 steps, 40.725 seconds. Tasks, assignment/status controls, approvals and named authority.
- USpace: 5 steps, 64.635 seconds. Forms, form versions/submissions, records, runs and training.
- UMaster: 8 steps, 109.333 seconds. Mission & Objectives, Work Planner, Engine Planner, HR Master, Machine Master, Forms Master, Delegation Master, UUsers.
- UPingme: 8 steps, 102.869 seconds. Overview, Inbox, shared UDO tasks, channels, work conversations, unavailable calls/meetings status, people directory, workspace settings.

Total: 30 guided steps, 23 original PDF screen crops, 367.456 seconds (6m 08s). One audio element and one continuous narration track; carousel and cursor positions are driven by that clock. Audio starts only after a user action. Muted visual playback uses the same timeline. Pause/replay, per-step navigation, per-section seek, five horizontal tabs, arrows, swipe, roving keyboard tabs, transcript and expanded viewer are included. Reduced-motion preference pauses initial playback and removes cursor/camera transitions. Phone focus view zooms the original pixels rather than rebuilding the application.

## Reference fidelity and limits
Images are lossless crops of the provided UCXO-1_merged (2).pdf, with only print margins removed. Screen source pages and crop bounds are in public/product-previews/sources.json. Other dashboard view destinations and unprovided inner-tab screens are highlighted/explained without inventing a state. No fake task completion or approvals are demonstrated. Calls/meetings preserve the PDF's unavailable-provider state. UAvatar is not promoted as a working feature.

## Source
- components/product-tour-data.ts: narration, exact destination screen IDs, source-screen navigation hit points, focus rectangles.
- scripts/render-product-tour.py: existing local Kokoro Heart renderer; writes the continuous WAV and timing metadata. It does not change the How It Works narration.
- components/ProductTour.tsx: persistent player and five horizontal cards.
- components/ProductTourStage.tsx: cursor/click timing, original-screen transitions, focus viewport.
- scripts/product-tour.test.cjs: source/timing coverage, every step/card boundary, speech verification in all explanations.

Check production build, existing narration regression tests, source-image fidelity, and browser playback/responsiveness before any future release.

Local server: scripts/serve-local-preview.py --port 3004 serves only the out directory on 127.0.0.1. It supports HTTP byte ranges, required for reliable narration seeking. Verified initial/middle/suffix ranges and invalid-range handling; browser playback stays unmuted after jumping to UMaster and Engine Planner. Default python -m http.server does not provide the needed seek support.


Approved design refinements: dashboard toolbar and centered map; dark header/outer rail, saturated inner sidebar; enlarged software preview; top-aligned copy; five workspace one-liners; exact labels UDashview, U&Me, USpace, UMaster, UPingme throughout copy, preview labels, captions and narration.
