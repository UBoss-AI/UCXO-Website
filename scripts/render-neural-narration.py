"""Render Kokoro Heart narration locally; keep speech at its natural pace.
Install: pip install --target .media-tools kokoro-onnx soundfile
Model/voices: public model-files-v1.1 release of thewh1teagle/kokoro-onnx.
"""
import sys, json, subprocess
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / '.media-tools'))
import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro

raw = subprocess.check_output(['node', '-e', "process.stdout.write(JSON.stringify(require('./components/story-data.ts').chapters))"], cwd=ROOT)
chapters = json.loads(raw)
kokoro = Kokoro(str(ROOT / '.media-models/kokoro-v1.0.onnx'), str(ROOT / '.media-models/voices-v1.0.bin'))
output = ROOT / 'public/narration'
output.mkdir(exist_ok=True, parents=True)
timings = []
for i, chapter in enumerate(chapters):
    rendered = []
    cursor = 0.0
    cue_times = []
    for j, cue in enumerate(chapter['captions']):
        samples, rate = kokoro.create(cue['text'], voice='af_heart', speed=1.0, lang='en-us')
        # Preserve natural articulation; extend the timeline instead of speeding speech up.
        start = max(cue['at'], cursor + (0.16 if j else 0))
        cue_times.append({'at': round(start, 3), 'storyAt': cue['at']})
        rendered.append((start, samples))
        cursor = start + len(samples) / rate
        print(f'Chapter {i+1}, cue {j+1}: {len(samples)/rate:.2f}s', flush=True)
    duration = max(chapter['duration'], round(cursor + .35, 2))
    pcm = np.zeros(int(np.ceil(duration * rate)), dtype=np.float32)
    for start, samples in rendered:
        offset = round(start * rate)
        pcm[offset:offset + len(samples)] = samples
    sf.write(output / f'chapter-{i+1}-heart.wav', pcm, rate, subtype='PCM_16')
    timings.append({'duration': duration, 'storyDuration': chapter['duration'], 'cues': cue_times})
    print(f'Chapter {i+1}: {duration}s rendered', flush=True)
(ROOT / 'components/narration-timing.json').write_text(json.dumps(timings, indent=2), encoding='utf8')
print('Neural narration and synchronized timing manifest complete.', flush=True)
