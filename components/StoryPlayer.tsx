'use client';
import {useEffect,useRef,useState} from 'react';
import dynamic from 'next/dynamic';
import {ArrowLeft,ArrowRight,Play,Pause,RotateCcw,Volume2,VolumeX,ArrowUpRight} from 'lucide-react';
import {chapters,storyStatus} from './story-data';
import {narrationStoryTime} from './narration-timing';
import './story.css';
const StoryScene=dynamic(()=>import('./StoryScene'),{ssr:false,loading:()=> <div className="story-loading">Preparing the workflow…</div>});
export default function StoryPlayer(){
 const[chapter,setChapter]=useState(0),[time,setTime]=useState(0),[paused,setPaused]=useState(false),[muted,setMuted]=useState(true),[reduced,setReduced]=useState(false),[visible,setVisible]=useState(true),[hidden,setHidden]=useState(false),[blocked,setBlocked]=useState(false),[mediaFailed,setMediaFailed]=useState(false),[duration,setDuration]=useState(18);
 const clock=useRef(0); const host=useRef<HTMLElement>(null),video=useRef<HTMLVideoElement>(null),audio=useRef<HTMLAudioElement>(null),touch=useRef({x:0,y:0});const data=chapters[chapter],hasVideo=!!data.video&&!mediaFailed;const running=!paused&&visible&&!hidden;
 function navigate(n:number){clock.current=0;setChapter((n+4)%4);setTime(0);setDuration(chapters[(n+4)%4].duration);setMediaFailed(false);setBlocked(false);}
 useEffect(()=>{const m=matchMedia('(prefers-reduced-motion: reduce)');const change=()=>{setReduced(m.matches);if(m.matches)setPaused(true);};change();m.addEventListener('change',change);const hide=()=>setHidden(document.hidden);hide();document.addEventListener('visibilitychange',hide);const io=new IntersectionObserver(([e])=>setVisible(e.isIntersecting),{threshold:.2});if(host.current)io.observe(host.current);return()=>{m.removeEventListener('change',change);document.removeEventListener('visibilitychange',hide);io.disconnect();};},[]);
 // The preview uses its own 18/20-second animation timeline. Supplied films instead use timeupdate and ended.
 useEffect(()=>{if(!running||hasVideo)return;let raf=0,last=performance.now();const tick=(now:number)=>{if(!muted&&audio.current){clock.current=audio.current.currentTime;}else clock.current+=Math.min((now-last)/1000,.1);last=now;if(muted&&clock.current>=data.duration){clock.current=0;setChapter(c=>(c+1)%4);setTime(0);setDuration(chapters[(chapter+1)%4].duration);return;}setTime(clock.current);raf=requestAnimationFrame(tick);};raf=requestAnimationFrame(tick);return()=>cancelAnimationFrame(raf);/* time intentionally sampled only when playback starts */
 // eslint-disable-next-line react-hooks/exhaustive-deps
 },[running,hasVideo,chapter,data.duration,muted]);
 useEffect(()=>{const a=audio.current;if(!a||hasVideo)return;if(running&&!muted){a.currentTime=clock.current;a.play().then(()=>setBlocked(false)).catch(()=>{setBlocked(true);setPaused(true);});}else a.pause();return()=>a.pause();},[running,muted,chapter,hasVideo]);
 useEffect(()=>{const v=video.current;if(!v)return;v.muted=muted;if(running){v.play().then(()=>setBlocked(false)).catch(()=>{setBlocked(true);setPaused(true);});}else v.pause();},[running,muted,chapter,hasVideo]);
 function seek(t:number){clock.current=t;setTime(t);if(video.current)video.current.currentTime=t;if(audio.current)audio.current.currentTime=t;}
 function replay(){seek(0);setBlocked(false);}
 const storyTime=narrationStoryTime(chapter,time);const displayTime=reduced&&paused?Math.max(storyTime,15):storyTime; const caption=[...data.captions].reverse().find(c=>displayTime>=c.at)?.text??data.captions[0].text;
 return <section className="story-player" id="top" ref={host} aria-label="How Chief Engine works" aria-roledescription="carousel" onKeyDown={e=>{if((e.target as HTMLElement).tagName==='INPUT')return;if(e.key==='ArrowRight'){e.preventDefault();navigate(chapter+1);}if(e.key==='ArrowLeft'){e.preventDefault();navigate(chapter-1);}if(e.key===' '&&(e.target as HTMLElement).tagName!=='BUTTON'){e.preventDefault();setPaused(p=>!p);}}} onTouchStart={e=>{touch.current={x:e.touches[0].clientX,y:e.touches[0].clientY};}} onTouchEnd={e=>{const dx=e.changedTouches[0].clientX-touch.current.x,dy=e.changedTouches[0].clientY-touch.current.y;if(Math.abs(dx)>65&&Math.abs(dx)>Math.abs(dy)*1.5)navigate(chapter+(dx<0?1:-1));}}>
  {!hasVideo&&<audio key={`narration-${chapter}`} ref={audio} src={`/narration/chapter-${chapter+1}-heart.wav`} preload="auto" onEnded={()=>navigate(chapter+1)} onError={()=>{setMuted(true);setBlocked(false);}}/>}
  <div className="story-stage" key={chapter} role="group" aria-roledescription="slide" aria-label={`Chapter ${chapter+1}: ${data.label}`}>
   {hasVideo?<video ref={video} poster={data.poster} playsInline muted={muted} preload="auto" onLoadedMetadata={e=>setDuration(e.currentTarget.duration)} onTimeUpdate={e=>setTime(e.currentTarget.currentTime)} onEnded={()=>navigate(chapter+1)} onError={()=>{setMediaFailed(true);setTime(0);}}>{data.mobileVideo&&<source media="(max-width:600px)" src={data.mobileVideo}/>}<source src={data.video}/></video>:<StoryScene chapter={chapter} time={displayTime} reduced={reduced&&paused}/>}
   <div className="story-gradient"/>
   <div className="story-copy"><div className="eyebrow"><span className="mini-dot"/>HOW CHIEF ENGINE WORKS</div><span className="story-chapter-number">0{chapter+1} <span>/ 04</span></span><h1>{data.heading}</h1><p>{data.summary}</p><div className="story-example"><small>ONE OBJECTIVE. ONE CONNECTED STORY.</small><strong>Prepare the monthly<br/>business review.</strong><span>Illustrative workflow</span></div><button className="story-listen" onClick={()=>{setMuted(m=>!m);if(muted)setPaused(false);}}>{muted?<Volume2 size={16}/>:<VolumeX size={16}/>} {muted?'Listen to explanation':'Mute narration'}</button><a className="text-action" href="#transcript">Read the transcript <ArrowUpRight size={14}/></a></div>
   <div className="story-state" role="status"><span className="mini-dot"/>{storyStatus(chapter,displayTime)}</div>
   {chapter===0&&<div className="story-context"><span>Team <strong>Business operations</strong></span><span>Owner <strong>Review lead</strong></span><span>Desired outcome <strong>A review-ready report</strong></span></div>}
   {chapter===1&&storyTime>=4&&<div className="story-action"><small>{storyTime<13?'ILLUSTRATIVE PLAN EDIT':'ILLUSTRATIVE HUMAN ACTION'}</small><strong>{storyTime<8?'Add an evidence check':storyTime<13?'Human owner + governed agent skills':'✓ Approve & Assign'}</strong></div>}
   {chapter===3&&storyTime>=9&&<div className="story-action"><small>ILLUSTRATIVE HUMAN ACTION</small><strong>✓ Evidence reviewed and approved</strong></div>}
  </div>
  <div className="story-caption" aria-live={paused?'polite':'off'}><span>{caption}</span></div>
  <div className="story-bottom"><div className="story-playback"><button aria-label={paused?'Play explanation':'Pause explanation'} onClick={()=>{setPaused(p=>!p);setBlocked(false);}}>{paused?<Play size={17}/>:<Pause size={17}/>}</button><button aria-label="Replay chapter" onClick={replay}><RotateCcw size={16}/></button>{<button aria-label={muted?'Enable sound':'Mute sound'} onClick={()=>setMuted(m=>!m)}>{muted?<VolumeX size={17}/>:<Volume2 size={17}/>}</button>}<span className="story-time">{Math.floor(time).toString().padStart(2,'0')} / {Math.floor(duration)}s</span><input aria-label="Chapter progress" type="range" min="0" max={duration} step="0.1" value={time} onChange={e=>seek(Number(e.target.value))}/><span className="story-preview-label">{hasVideo?'CHAPTER FILM':muted?'NARRATION · SOUND OFF':'ENGLISH NARRATION · SOUND ON'}</span><button aria-label="Previous chapter" onClick={()=>navigate(chapter-1)}><ArrowLeft size={18}/></button><button aria-label="Next chapter" onClick={()=>navigate(chapter+1)}><ArrowRight size={18}/></button></div><div className="story-tabs" aria-label="Choose a chapter">{chapters.map((c,i)=><button key={c.label} aria-label={`Chapter ${i+1}: ${c.label}`} aria-current={i===chapter?'step':undefined} onClick={()=>navigate(i)}><span className="story-tab-line"><i style={{width:i===chapter?`${time/duration*100}%`:i<chapter?'100%':'0%'}}/></span><small>0{i+1}</small><span>{c.label}</span></button>)}</div></div>
  {(blocked||reduced&&paused)&&<button className="story-start" onClick={()=>{setPaused(false);setBlocked(false);}}><Play size={16}/>{blocked?'Play chapter':'Play animation'}</button>}
 </section>;
}




