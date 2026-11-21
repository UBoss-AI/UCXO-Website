import json,pathlib,statistics,sys
sys.path.insert(0,str(pathlib.Path('.localization-tools').resolve()))
from PIL import Image
import numpy as np
p=pathlib.Path('i18n/artwork-text.json');data=json.loads(p.read_text(encoding="utf-8"))
for name,rows in data.items():
 image=Image.open('public/product-previews/'+name+'.webp').convert('RGB');image.thumbnail((1600,1100));arr=np.array(image);w,h=image.size
 for row in rows:
  l=max(0,min(w-1,round(row['x']*w/100)));t=max(0,min(h-1,round(row['y']*h/100)));r=max(0,min(w-1,round((row['x']+row['w'])*w/100)));b=max(0,min(h-1,round((row['y']+row['h'])*h/100)))
  samples=[arr[t,l],arr[t,r],arr[b,l],arr[b,r]]
  row['bg']='#'+''.join(f'{int(statistics.median([int(s[c]) for s in samples])):02x}' for c in range(3))
p.write_text(json.dumps(data,ensure_ascii=False,indent=2),encoding='utf-8')
print('Corrected mask colours for',len(data),'screens')