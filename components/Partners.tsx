'use client';
import {useEffect,useId,useRef,useState} from 'react';
import Marquee from 'react-fast-marquee';
import {Pause,Play} from 'lucide-react';
import './partners.css';

const partners=[
 {name:'SPM',image:'/partners/spm.jpeg',width:558,height:549,key:'spm'},
 {name:'Tianum Lifecare',image:'/partners/tianum-lifecare.jpeg',width:358,height:327,key:'tianum'},
] as const;

export default function Partners(){
 const host=useRef<HTMLElement>(null),[paused,setPaused]=useState(false),[reduced,setReduced]=useState(true),[inView,setInView]=useState(false);
 const id=useId().replace(/[^a-zA-Z0-9]/g,''),spm=`partner-spm-${id}`,tianum=`partner-tianum-${id}`;
 useEffect(()=>{
  const motion=matchMedia('(prefers-reduced-motion: reduce)'),update=()=>setReduced(motion.matches);
  update();motion.addEventListener('change',update);
  const observer=new IntersectionObserver(([entry])=>setInView(entry.isIntersecting),{threshold:.1});
  if(host.current)observer.observe(host.current);
  return()=>{motion.removeEventListener('change',update);observer.disconnect();};
 },[]);
 const logos=<div className="partner-pair">{partners.map(partner=><div className="partner-logo" key={partner.key}><img src={partner.image} width={partner.width} height={partner.height} alt="" loading="lazy" draggable={false} style={{filter:`url(#${partner.key==='spm'?spm:tianum})`}}/></div>)}</div>;
 return <section className="partner-strip" id="partners" ref={host} aria-labelledby="partners-heading">
  <svg className="partner-filter-defs" width="0" height="0" aria-hidden="true" focusable="false"><defs>
   <filter id={spm} colorInterpolationFilters="sRGB"><feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 -4 0 0 3.8"/><feComposite in2="SourceGraphic" operator="in"/></filter>
   <filter id={tianum} colorInterpolationFilters="sRGB"><feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 3 0 0 -1"/></filter>
  </defs></svg>
  <div className="partner-inner"><div className="partner-label"><h2 id="partners-heading">Our partners</h2>{!reduced&&<button type="button" onClick={()=>setPaused(value=>!value)} aria-label={paused?'Resume partner logos':'Pause partner logos'} title={paused?'Resume partner logos':'Pause partner logos'} aria-controls="partners-marquee">{paused?<Play size={13}/>:<Pause size={13}/>}</button>}</div>
   <ul className="partners-accessible-list" aria-label="UCXO partners">{partners.map(partner=><li key={partner.key}>{partner.name}</li>)}</ul>
   <div className="partner-window" id="partners-marquee" aria-hidden="true" data-static={reduced} data-paused={paused}>
    {reduced?logos:<Marquee play={!paused&&inView} pauseOnHover direction="left" speed={24} autoFill={false} gradient={false}>{logos}</Marquee>}
   </div>
  </div>
 </section>;
}
