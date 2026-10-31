"""Replace only the closing brand line, preserving the existing Heart narration."""
import json
import sys
import wave
from pathlib import Path

root = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(root / '.media-tools'))
import numpy as np
from kokoro_onnx import Kokoro

voice = Kokoro(str(root / '.media-models/kokoro-v1.0.int8.onnx'), str(root / '.media-models/voices-v1.0.bin'))
samples, rate = voice.create('U C X O. Business execution, coordinated.', voice='af_heart', speed=1.0, lang='en-us')
chapter = root / 'public/narration/chapter-4-heart.wav'
with wave.open(str(chapter), 'rb') as source:
    assert source.getframerate() == rate and source.getnchannels() == 1 and source.getsampwidth() == 2
    prefix = source.readframes(round(17.07 * rate))
pcm = (np.clip(samples, -1, 1) * 32767).astype('<i2').tobytes()
speech_end = round(17.07 + len(samples) / rate, 3)
with wave.open(str(chapter), 'wb') as output:
    output.setnchannels(1)
    output.setsampwidth(2)
    output.setframerate(rate)
    output.writeframes(prefix + pcm + bytes(round(.35 * rate) * 2))
timing = root / 'components/narration-timing.ts'
text = timing.read_text(encoding='utf-8').replace('"at": 19.975,', f'"at": {speech_end},')
text = text.replace('"duration": 21,', f'"duration": {round(speech_end + .35, 3)},')
timing.write_text(text, encoding='utf-8')
print(json.dumps({'closing_line': 'U C X O. Business execution, coordinated.', 'speech_end': speech_end, 'rate': rate}))
