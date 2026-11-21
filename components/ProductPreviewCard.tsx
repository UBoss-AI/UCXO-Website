'use client';
import {useLocalize} from '@/i18n/LocaleProvider';
import {useRef,useState} from 'react';
import {ArrowUpRight,Check,Expand,Maximize2,Minus,X} from 'lucide-react';
import ProductScreenImage from './ProductScreenImage';
import {productPreviews,type ProductPreview} from './product-preview-data';

export default function ProductPreviewCard({preview,index}:{preview:ProductPreview;index:number}){const localize=useLocalize();
  const [selected,setSelected]=useState(0),[actualSize,setActualSize]=useState(false);
  const dialog=useRef<HTMLDialogElement>(null),screen=preview.screens[selected];
  function expand(){setActualSize(false);dialog.current?.showModal();}
  return localize(<article className="product-preview-card" id={preview.id} aria-labelledby={`${preview.id}-heading`}>
    <div className="product-preview-card-top"><span><b>0{index+1}</b> / {String(productPreviews.length).padStart(2,'0')}</span><span>{preview.label}</span><span className="product-preview-proof"><Check size={12}/>Original software screen</span></div>
    <div className="product-preview-layout">
      <div className="product-preview-copy">
        <div className="product-preview-kicker"><i/>{preview.kicker}</div>
        <h2 id={`${preview.id}-heading`}>{preview.heading}<br/><em>{preview.emphasis}</em></h2>
        <p>{preview.copy}</p>
        <a className="button primary" href="/book-a-demo/">Book a Demo<ArrowUpRight size={16}/></a>
        <ul>{preview.highlights.map(item=><li key={item}><Check size={13}/>{item}</li>)}</ul>
      </div>
      <div className="product-preview-visual">
        <div className="product-preview-image-top"><span><i/>{preview.label} <small>/ {screen.label}</small></span><button type="button" onClick={expand} aria-label={`Expand ${preview.label} screen`}><Expand size={14}/>View full screen</button></div>
        <button type="button" className="product-preview-image" onClick={expand} aria-label={`Inspect original ${screen.label} screen`}>
          <ProductScreenImage screen={screen.id} alt={screen.description} active={index===0} theme={index%2===0?'dark':'light'}/>
          <span className="product-preview-image-hint"><Expand size={14}/>Inspect original screen</span>
        </button>
        <p className="product-preview-touch-hint"><Expand size={12}/>Tap the screen to inspect it at full size.</p>
        <div className="product-preview-screen-options" role="group" aria-label={`${preview.label} software screens`}>{preview.screens.map((item,i)=><button type="button" key={item.id} aria-pressed={selected===i} onClick={()=>setSelected(i)}>{item.label}</button>)}</div>
        <p className="product-preview-source">PDF page {screen.page}<span>Original layout, labels, data and states</span></p>
      </div>
    </div>
    {preview.note&&<p className="product-preview-source-note">Reference note: {preview.note}</p>}
    <dialog ref={dialog} className="product-preview-dialog" aria-label={`${screen.label} original software screen`} onClick={event=>{if(event.target===event.currentTarget)dialog.current?.close();}}>
      <div className="product-preview-dialog-bar"><div><strong>{screen.label}</strong><span>Original UCXO software · PDF page {screen.page}</span></div><div><button type="button" onClick={()=>setActualSize(x=>!x)}>{actualSize?<Minus size={16}/>:<Maximize2 size={16}/>} {actualSize?'Fit to window':'Actual size'}</button><button type="button" aria-label="Close screen preview" onClick={()=>dialog.current?.close()} autoFocus><X size={20}/></button></div></div>
      <div className={`product-preview-dialog-image ${actualSize?'is-actual-size':''}`}><ProductScreenImage screen={screen.id} alt={screen.description} active theme={index%2===0?'dark':'light'}/></div>
    </dialog>
  </article>);
}
