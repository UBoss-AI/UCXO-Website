import asyncio
import concurrent.futures
import json
import pathlib
import subprocess
import sys
import time
import urllib.parse
import urllib.request

sys.path.insert(0, str(pathlib.Path('.localization-tools').resolve()))
import edge_tts
import imageio_ffmpeg

RATE = 24000
FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()
ROOT = pathlib.Path('public/narration/localized')
TOUR = '--tour' in sys.argv
if TOUR:
    ROOT = ROOT / 'tour'
ROOT.mkdir(parents=True, exist_ok=True)
CHAPTERS = json.loads(subprocess.check_output(
    ['node', '-p', "JSON.stringify(require('./components/story-data.ts').chapters)"], encoding='utf-8'))
TOUR_DATA = json.loads(subprocess.check_output(
    ['node', '-p', "JSON.stringify(require('./components/product-tour-data.ts'))"], encoding='utf-8')) if TOUR else None
LOCALES = [row['code'] for row in json.loads(pathlib.Path('i18n/locales.json').read_text('utf-8')) if row['code'] != 'en']
TAGS = {'zh-Hans': 'zh-CN', 'zh-Hant': 'zh-TW', 'nb': 'no', 'fil': 'tl', 'he': 'iw'}

def render_text(text, locale):
    if locale == 'fa':
        async def render_persian():
            return b''.join([chunk['data'] async for chunk in edge_tts.Communicate(
                text, 'fa-IR-DilaraNeural').stream() if chunk['type'] == 'audio'])
        return asyncio.run(render_persian())
    query = urllib.parse.urlencode({'ie': 'UTF-8', 'client': 'tw-ob', 'tl': TAGS.get(locale, locale), 'q': text})
    request = urllib.request.Request('https://translate.google.com/translate_tts?' + query,
                                     headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(request, timeout=25) as response:
        return response.read()

def render_cue(text, locale):
    parts = []
    while len(text) > 180:
        split = text.rfind(' ', 65, 180)
        split = split if split > 0 else 180
        parts.append(text[:split])
        text = text[split:].strip()
    parts.append(text)
    samples = []
    for part in parts:
        for attempt in range(3):
            try:
                audio = render_text(part, locale)
                pcm = subprocess.run([FFMPEG, '-v', 'error', '-i', 'pipe:0', '-ac', '1', '-ar',
                                      str(RATE), '-f', 's16le', 'pipe:1'], input=audio,
                                     capture_output=True, check=True).stdout
                if len(pcm) < RATE // 2:
                    raise ValueError('Narration cue is unexpectedly short')
                samples.append(pcm)
                break
            except Exception:
                if attempt == 2:
                    raise
                time.sleep(2 ** attempt)
    return b''.join(samples)

def render_locale(locale):
    catalogue = json.loads(pathlib.Path('i18n/catalogues', locale + '.locale.json').read_text('utf-8'))
    messages = {entry['source']: entry['text'] for entry in catalogue['entries'].values()}
    if TOUR:
        return render_tour(locale, messages)
    timeline = []
    clips = []
    position = 0
    for chapter in CHAPTERS:
        points = []
        start = position
        for caption in chapter['captions']:
            points.append({'at': (position - start) / RATE, 'storyAt': caption['at']})
            pcm = render_cue(messages[caption['text']], locale) + bytes(int(RATE * .20) * 2)
            clips.append(pcm)
            position += len(pcm) // 2
        points.append({'at': (position - start) / RATE, 'storyAt': chapter['duration']})
        timeline.append({'start': start / RATE, 'duration': (position - start) / RATE, 'points': points})
    save_audio(locale, clips)
    print(locale, round(position / RATE, 1), flush=True)
    return timeline

def save_audio(locale, clips):
    subprocess.run([FFMPEG, '-v', 'error', '-y', '-f', 's16le', '-ac', '1', '-ar', str(RATE),
                    '-i', 'pipe:0', '-codec:a', 'libmp3lame', '-b:a', '64k', str(ROOT / (locale + '.mp3'))],
                   input=b''.join(clips), check=True)

def render_tour(locale, messages):
    clips = []
    position = 0

    def cue(text, pause):
        nonlocal position
        pcm = render_cue(text, locale) + bytes(int(RATE * pause) * 2)
        start = position
        position += len(pcm) // 2
        clips.append(pcm)
        return {'start': start / RATE, 'duration': (position - start) / RATE}

    intro = cue(messages[TOUR_DATA['productTourIntro']['narration']].replace('UCXO.AI', 'U C X O, A I'), .45)
    announcements = []
    timeline = []
    for chapter in TOUR_DATA['tourChapters']:
        label = chapter['label']
        spoken = {'UDashview': 'U Dashview', 'U&Me': 'U and Me', 'USpace': 'U Space', 'UMaster': 'U Master'}[label]
        announcements.append({**cue(spoken, .3), 'label': label})
        start = position
        steps = [cue(messages[step['text']], .3) for step in chapter['steps']]
        timeline.append({'start': start / RATE, 'duration': (position - start) / RATE, 'steps': steps})

    save_audio(locale, clips)
    print(locale, round(position / RATE, 1), flush=True)
    return {'intro': intro, 'announcements': announcements, 'timeline': timeline, 'duration': position / RATE}

manifest_path = pathlib.Path('components/localized-tour-timing.json' if TOUR else 'components/localized-explainer-timing.json')
manifest = json.loads(manifest_path.read_text('utf-8')) if manifest_path.exists() else {}
specified = [arg for arg in sys.argv[1:] if arg != '--tour']
failed_locales = []
with concurrent.futures.ThreadPoolExecutor(max_workers=8) as executor:
    futures = {executor.submit(render_locale, code): code for code in (specified or LOCALES)}
    for future in concurrent.futures.as_completed(futures):
        code = futures[future]
        try:
            manifest[code] = future.result()
        except Exception as error:
            failed_locales.append(code)
            print(code, repr(error), file=sys.stderr, flush=True)
            continue
        manifest_path.write_text(json.dumps(manifest, indent=2, sort_keys=True) + '\n', encoding='utf-8', newline='\n')
if failed_locales:
    sys.exit(1)
