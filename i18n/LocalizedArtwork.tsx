'use client';
import {localeInfo} from './registry';
import {useTranslation} from './LocaleProvider';
import artwork from './artwork-text.json';
import glossary from './glossary.json';
function navigationBackground(color:string,dark:boolean,x:number,y:number,tone:boolean){let c=[1,3,5].map(i=>parseInt(color.slice(i,i+2),16)/255);if(dark)c=c.map((v,i)=>Math.pow(v,[2,1.5,5][i]));// The inner-sidebar screen tint is disabled in the original tour CSS.
if(tone&&!(x>=7.23&&y>=9.45)){const tint=[170,150,205].map(v=>v/255);c=c.map((v,i)=>v*tint[i]);}return '#'+c.map(v=>Math.round(v*255).toString(16).padStart(2,'0')).join('');}
export default function LocalizedArtwork({screen,theme,bodyFilter,navFilter,navigationTone=false}:{screen:string;theme:'light'|'dark';bodyFilter?:string;navFilter?:string;navigationTone?:boolean}){
 const {locale,t}=useTranslation();if(locale==='en')return null;
 const rows=(artwork[screen as keyof typeof artwork]??[]).filter(row=>!(screen==='udashview'&&row.x>=31.33&&row.y>=9.48));
 return <div className="localized-artwork" aria-hidden="true">{rows.map((row,index)=>{if(glossary[row.text as keyof typeof glossary]===row.text)return null;const nav=row.x<31.33||row.y<9.45,text=t(row.text),font=Math.min(row.h*.9*.687,Math.max(.3,row.w/Math.max(text.length,1)*1.9)),bg=nav?navigationBackground(row.bg,theme==='dark',row.x,row.y,navigationTone):row.bg;return <span key={index} dir={localeInfo(locale)?.dir} style={{left:row.x+'%',top:row.y+'%',width:row.w+'%',height:row.h+'%',background:bg,color:'foreground' in row?String(row.foreground):nav?'#f1e7ff':'#1a2230',filter:theme==='dark'&&!nav?bodyFilter:undefined,fontSize:font+'cqw'}}>{text}</span>;})}</div>;
}