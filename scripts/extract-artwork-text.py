import sys,json,pathlib,statistics
sys.path.insert(0,str(pathlib.Path('.localization-tools').resolve()))
from rapidocr_onnxruntime import RapidOCR
from PIL import Image
import numpy as np
engine=RapidOCR(intra_op_num_threads=2,inter_op_num_threads=1)
output={}
for file in sorted(pathlib.Path('public/product-previews').glob('*.webp')):
    image=Image.open(file).convert('RGB');image.thumbnail((1600,1100));array=np.array(image)
    result,_=engine(array)
    rows=[];width,height=image.size
    for box,text,confidence in result or []:
        if confidence<.35 or not any(c.isascii() and c.isalpha() for c in text):continue
        left=max(0,int(min(p[0] for p in box))-1);top=max(0,int(min(p[1] for p in box))-1)
        right=min(width-1,int(max(p[0] for p in box))+2);bottom=min(height-1,int(max(p[1] for p in box))+2)
        samples=[array[top,left],array[top,right],array[bottom,left],array[bottom,right]]
        bg='#'+''.join(f'{int(statistics.median([int(p[c]) for p in samples])):02x}' for c in range(3))
        rows.append(dict(text=text,x=left/width*100,y=top/height*100,w=(right-left)/width*100,h=(bottom-top)/height*100,bg=bg,confidence=float(confidence)))
    output[file.stem]=rows
    pathlib.Path('i18n/artwork-text.json').write_text(json.dumps(output,ensure_ascii=False,indent=2),encoding='utf-8')
    print(file.stem,len(rows),flush=True)