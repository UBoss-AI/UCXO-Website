# How it works — narrated review edition

Production destination: https://chief-engine.vercel.app/how-it-works/

The page is an original browser-rendered 3D explanation with one continuous English narration track, captions, and a verbatim transcript. It is not a final offline-rendered film. Release targets: GitHub utkarsh0336/Chief-Engine (main) and the existing chief-engine Vercel production project.

## Current experience

- 66.425 seconds total, displayed as 67 seconds. Chapter boundaries: 0, 12.975, 28.6, and 46.15 seconds.
- Enlarged desktop framing, an opening close-up that pulls back to the draft, larger labels, and active-node emphasis.
- Tasks assemble, an evidence check is added, a separate Run appears on execution, prerequisite signals unlock the dependent review, and a mandatory approval holds the outcome path until the illustrated human decision.
- Narration now uses the Kokoro-82M Heart (af_heart) neural English voice, speed 1.0. Four continuous recordings were generated with the official hexgrad demo, downloaded, and stored as local PCM WAV assets in public/narration. The website makes no requests to a speech service. The model is Apache-2.0 licensed: https://huggingface.co/hexgrad/Kokoro-82M.
- Sound starts off. Listen to explanation enables narration. While sound is enabled, audio currentTime drives the animation; a global audio timeline advances chapters without reloading media. Pause, seek, replay, visibility changes and chapter selection also control audio. Sound and pause choices persist across chapter changes.
- One master audio element and the 3D canvas remain mounted across all chapters. Muted playback uses the animation clock. Audio loading failure falls back to the captioned animation.

## Source and reproduction

components/StoryScene.tsx contains the procedural 3D geometry and chapter choreography; components/StoryPlayer.tsx contains playback. components/story-data.ts contains the exact caption/narration cues. The page transcript is generated from these same cues.

Run npm install, then npm run dev. Production validation: npm run build. The static export includes /how-it-works/index.html.

The previous Windows voice renderer remains in scripts/render-narration.cjs as a fallback. The neural local-render recipe is scripts/render-neural-narration.py (kokoro-onnx, soundfile, official model and voices required). For the current continuous Heart recordings, scripts/align-heart-narration.cjs pads the files and produces components/narration-timing.ts. Caption boundaries are estimated from sentence pauses, and the existing 3D choreography is mapped to that recording timeline. Keep the original recorded inputs if regenerating alignment. No API keys are needed by the website.

## Final film production, if desired

Offline-rendered landscape/portrait chapter films and posters can still replace the real-time 3D presentation. The existing optional video manifest/player path remains available. Professional recorded narration or a different approved voice may replace the synthetic tracks; retime captions and animation cues to match any changed recording. No third-party music or footage is used.

## Original references

https://www.youtube.com/shorts/yhqIcm7ql8c
https://tendril.studio/work/ibm-software/
https://wearewouq.com/work/cybersphere

## Verification of narrated revision

TypeScript and production build passed. All four WAV files have exact chapter durations (18/18/18/21 seconds) and nonzero PCM samples. Browser playback confirmed audio readyState 4 and an advancing time matching the animation timeline. Pause/replay and chapter selection preserve pause and sound preferences; chapter-four audio completion loops to chapter one with sound retained. The built preview serves narration as audio/wav with HTTP 200. The final clean browser session reported no warnings or errors. Desktop framing and a 390 by 844 portrait layout were visually checked without horizontal overflow.


## Uniform background revision

The reflective floor and grid are hidden. WebGL remains transparent and the scene/gradient backgrounds are transparent over the same #07050D hero surface, removing the separate rectangular backdrop.



## Narration control regression fix

Both sound controls now use the same narration controller. Enabling sound restarts the chapter at the spoken beginning and calls media.play() synchronously in the click event. Unmuting paused playback resumes it. The audio element persists across chapters; old playback requests cannot overwrite a newer action. Speaker icons reflect the same enabled state, and the playback label follows actual media events. Browser rejection or media-load failure exposes a retry action instead of silently changing the mute setting. Local browser regressions verified Listen after seeking to the silent tail, unmute while paused, pause/resume from the large button, and sound retention across chapter changes; the console was clean.


## Continuous narration regression fix

The player uses public/narration/chief-engine-explainer.wav throughout. Run node scripts/build-continuous-narration.cjs to rebuild it and components/narration-timeline.ts from the Heart recordings. The builder trims padded tails and inserts 0.3-second sentence breaks. Chapter changes never pause or reload audio. Animation and captions follow the global audio clock. Replay and chapter selection seek within the master track.

Validation: node --test scripts/continuous-narration.test.cjs checks speech at the old 18-second failure point and every chapter, duration integrity, and chapter boundaries. Browser playback crossed every boundary and looped while playing. Pause/resume, chapter selection, and replay were checked.
