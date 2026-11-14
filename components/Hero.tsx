'use client';
import {useCallback,useEffect,useRef,useState} from 'react';
import dynamic from 'next/dynamic';
import gsap from 'gsap';
import {ArrowRight,ArrowLeft,ArrowDown,Play,Pause,Workflow} from 'lucide-react';
const GraphScene=dynamic(()=>import('./GraphScene'),{ssr:false,loading:()=> <div className="scene-loading"><Workflow size={64}/><span>Connecting the workflow</span></div>});
const slides=[
 {label:'Objectives & UForms',kicker:'FROM INTENT TO EXECUTION',headline:<>Turn business<br/> objectives into<br/><em>coordinated action.</em></>,description:'Start with an objective, UMaster resource context, and UForms inputs. Review the proposed workflow before execution.',tag:'Illustrative objective · UMaster + UForms',cta:'Explore UCXO',href:'#platform'},
 {label:'Engine Agents',kicker:'YOUR REUSABLE AI WORKFORCE',headline:<>Build your<br/><em>AI workforce.</em></>,description:'Build reusable agents with approved skills and tools. UEngine coordinates each execution as a separate Run.',tag:'Illustrative agent execution network',cta:'Explore Engine Agents',href:'#agents'},
 {label:'UEngine & UDo',kicker:'CONNECTED BY DESIGN',headline:<>People and AI,<br/><em>working in sync.</em></>,description:'UEngine coordinates dependencies. People complete UDo assignments while agents perform approved work.',tag:'Illustrative execution · UDo + UEngine',cta:'See How It Works',href:'/how-it-works/'},
 {label:'UApprove & UPingMe',kicker:'ACCOUNTABILITY AT EVERY STEP',headline:<>Keep execution<br/><em>under control.</em></>,description:'Keep decisions in UApprove, conversations in UPingMe, and evidence in URecords.',tag:'Illustrative oversight · UApprove + UPingMe',cta:'Explore oversight',href:'#oversight'}
];
export default function Hero(){
 const hero=useRef<HTMLElement>(null),panels=useRef<(HTMLDivElement|null)[]>([]),progress=useRef<(HTMLSpanElement|null)[]>([]);const [current,setCurrent]=useState(0),[paused,setPaused]=useState(false),[reduced,setReduced]=useState(false),[onscreen,setOnscreen]=useState(true),[hidden,setHidden]=useState(false),[visited,setVisited]=useState([true,false,false,false]);
 const currentRef=useRef(0),busy=useRef(false),timeline=useRef<gsap.core.Timeline|null>(null);const elapsed=useRef(0);const touch=useRef({x:0,y:0});
 const change=useCallback((target:number,direction=1)=>{if(busy.current||target===currentRef.current)return;busy.current=true;const old=currentRef.current;const from=panels.current[old],to=panels.current[target];if(!from||!to){busy.current=false;return;}
  setVisited(v=>v.map((x,i)=>x||i===target));currentRef.current=target;setCurrent(target);elapsed.current=0;
  timeline.current=gsap.timeline({onComplete:()=>{gsap.set(from,{visibility:'hidden'});busy.current=false;}})
   .set(to,{visibility:'visible',xPercent:direction*100,zIndex:2})
   .to(from,{xPercent:-direction*100,duration:reduced?.01:1,ease:'power3.inOut'},0)
   .to(to,{xPercent:0,duration:reduced?.01:1,ease:'power3.inOut'},0)
   .fromTo(to.querySelectorAll('.hero-copy > *'),{y:reduced?0:24,opacity:0},{y:0,opacity:1,duration:reduced?.01:.7,stagger:.07,ease:'power2.out'},reduced?0:.35);
 },[reduced]);
 useEffect(()=>{const media=matchMedia('(prefers-reduced-motion: reduce)');const update=()=>{setReduced(media.matches);if(media.matches)setPaused(true);};update();media.addEventListener('change',update);const visibility=()=>setHidden(document.hidden);document.addEventListener('visibilitychange',visibility);const observer=new IntersectionObserver(([entry])=>setOnscreen(entry.isIntersecting),{threshold:.15});if(hero.current)observer.observe(hero.current);return()=>{media.removeEventListener('change',update);document.removeEventListener('visibilitychange',visibility);observer.disconnect();timeline.current?.kill();};},[]);
 useEffect(()=>{let raf=0,last=performance.now();function tick(now:number){const delta=now-last;last=now;if(!paused&&onscreen&&!hidden&&!busy.current){elapsed.current+=Math.min(delta,100);if(elapsed.current>=6000)change((currentRef.current+1)%4,1);}progress.current.forEach((el,i)=>{if(el)el.style.transform=`scaleX(${i===currentRef.current?Math.min(elapsed.current/6000,1):0})`;});raf=requestAnimationFrame(tick);}raf=requestAnimationFrame(tick);return()=>cancelAnimationFrame(raf);},[paused,onscreen,hidden,change]);
 function navigate(target:number,direction=1){setPaused(true);change(target,direction);}
 return <section className="hero" id="top" ref={hero} aria-roledescription="carousel" aria-label="Discover UCXO" onKeyDown={e=>{if(e.key==='ArrowRight'){e.preventDefault();navigate((current+1)%4);}else if(e.key==='ArrowLeft'){e.preventDefault();navigate((current+3)%4,-1);}else if(e.key==='Tab')setPaused(true);}} onTouchStart={e=>{touch.current={x:e.touches[0].clientX,y:e.touches[0].clientY};}} onTouchEnd={e=>{const dx=e.changedTouches[0].clientX-touch.current.x,dy=e.changedTouches[0].clientY-touch.current.y;if(Math.abs(dx)>60&&Math.abs(dx)>Math.abs(dy)*1.5)navigate((current+(dx<0?1:3))%4,dx<0?1:-1);}}>
  <div className="hero-panels">{slides.map((s,i)=><div key={i} ref={e=>{panels.current[i]=e}} className={`hero-panel panel-${i}`} style={{visibility:i===0?'visible':'hidden'}} aria-hidden={current!==i} inert={current!==i} role="group" aria-roledescription="slide" aria-label={`${i+1} of 4: ${s.label}`}>
    <div className="hero-ambient"/>{visited[i]&&<GraphScene index={i} active={current===i&&onscreen&&!hidden} reduced={reduced} paused={paused}/>}
    <div className="hero-shade"/>
    <div className="hero-copy"><div className="eyebrow"><span className="mini-dot"/>{s.kicker}</div><h1>{s.headline}</h1><p>{s.description}</p><div className="hero-actions"><a className="button primary" href={s.href} tabIndex={current===i?0:-1}>{s.cta}<ArrowRight size={17}/></a>{i===0&&<a className="text-action" href="/how-it-works/" tabIndex={current===i?0:-1}><span className="play-icon"><Play size={11} fill="currentColor"/></span>See How It Works</a>}</div><div className="hero-footnote"><span>Human-led.</span><span>AI-powered.</span><span>Accountable by design.</span></div></div>
    <div className="visual-caption"><span className="mini-dot"/>{s.tag}<span className="caption-tip">HOVER TO EXPLORE ↗</span></div>
  </div>)}</div>
  <div className="hero-bottom"><div className="slide-tabs" role="group" aria-label="Select a feature">{slides.map((s,i)=><button className={current===i?'active':''} key={s.label} onClick={()=>navigate(i)} aria-label={`Slide ${i+1}: ${s.label}`} aria-current={current===i?'true':undefined}><span className="progress-track"><span ref={e=>{progress.current[i]=e}}/></span><span className="tab-caption"><span className="tab-number">0{i+1}</span>{s.label}</span></button>)}</div><div className="slide-controls"><button aria-label={paused?'Play slideshow':'Pause slideshow'} onClick={()=>setPaused(p=>!p)}>{paused?<Play size={15}/>:<Pause size={15}/>}</button><span className="control-divider"/><button aria-label="Previous slide" onClick={()=>navigate((current+3)%4,-1)}><ArrowLeft size={17}/></button><button aria-label="Next slide" onClick={()=>navigate((current+1)%4)}><ArrowRight size={17}/></button></div></div>
  <a className="scroll-cue" href="#platform" aria-label="Scroll to explore"><ArrowDown size={13}/>SCROLL TO EXPLORE</a>
  <span className="sr-only" aria-live={paused?'polite':'off'}>{slides[current].label}</span>
 </section>
}
