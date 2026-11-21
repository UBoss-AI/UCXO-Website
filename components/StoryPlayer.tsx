'use client';
import LocalizedLineBreak from '@/i18n/LocalizedLineBreak';
import {useLocalize,useTranslation} from '@/i18n/LocaleProvider';
import {useEffect,useRef,useState} from 'react';
import dynamic from 'next/dynamic';
import {Play,Pause,RotateCcw,Volume2,VolumeX} from 'lucide-react';
import {chapters,storyStatus} from './story-data';
import {narrationStoryTime} from './narration-timing';
import {narrationPosition} from './narration-timeline';
import {explainerTrack} from './explainer-track';
import {localeInfo} from '@/i18n/registry';
import './story.css';
function StoryLoading(){const localize=useLocalize();return localize(<div className="story-loading">Preparing the workflow…</div>);}
const StoryScene=dynamic(()=>import('./StoryScene'),{ssr:false,loading:()=> <StoryLoading/>});
export default function StoryPlayer(){const localize=useLocalize();
 const {locale}=useTranslation();
 const {timeline:narrationTimeline,timing:narrationTiming,duration:narrationDuration,src}=explainerTrack(locale);
 const[chapter,setChapter]=useState(0),[time,setTime]=useState(0),[paused,setPaused]=useState(false),[muted,setMuted]=useState(true),[reduced,setReduced]=useState(false),[visible,setVisible]=useState(true),[hidden,setHidden]=useState(false),[blocked,setBlocked]=useState(false),[mediaFailed,setMediaFailed]=useState(false),[duration,setDuration]=useState<number>(narrationTimeline[0].duration);
 const[audioPlaying,setAudioPlaying]=useState(false),[audioError,setAudioError]=useState(false),[audioMessage,setAudioMessage]=useState('');const playRequest=useRef(0);
 const clock=useRef(0),globalClock=useRef(0); const host=useRef<HTMLElement>(null),video=useRef<HTMLVideoElement>(null),audio=useRef<HTMLAudioElement>(null),touch=useRef({x:0,y:0});const data=chapters[chapter],hasVideo=!!data.video&&!mediaFailed;const running=!paused&&visible&&!hidden;
 function syncTime(value:number){globalClock.current=value;const position=narrationPosition(value,narrationTimeline);clock.current=position.time;setChapter(position.chapter);setTime(position.time);setDuration(position.duration);}
 function navigate(n:number){const target=(n+4)%4;const at=narrationTimeline[target].start;syncTime(at);setMediaFailed(false);setBlocked(false);setAudioMessage('');if(audio.current){audio.current.currentTime=at;if(!muted&&running&&audio.current.paused)playMedia(audio.current);}if(video.current)video.current.currentTime=0;}
 function playMedia(element:HTMLMediaElement){
  const request=++playRequest.current;
  // Call play synchronously from click handlers to retain browser user activation.
  element.play().then(()=>{if(request===playRequest.current){setBlocked(false);setAudioMessage('');}}).catch(error=>{
   if(request!==playRequest.current||error?.name==='AbortError')return;
   setAudioPlaying(false);setBlocked(true);setPaused(true);
   setAudioMessage(error?.name==='NotAllowedError'?'Your browser paused the narration. Select Play narration to start.':'Narration could not start. Select Play narration to retry.');
  });
 }
 function enableNarration(restart=false){
  const element=hasVideo?video.current:audio.current;if(!element)return;
  const points=narrationTiming[chapter].points;const speechEnd=points[points.length-1].at;
  const start=restart||clock.current>=speechEnd||element.ended?0:clock.current;
  if(audioError){element.load();setAudioError(false);}
  const at=hasVideo?start:narrationTimeline[chapter].start+start;
  syncTime(at);element.currentTime=at;element.muted=false;element.volume=1;
  setMuted(false);setPaused(false);setBlocked(false);setAudioMessage('');playMedia(element);
 }
 function muteNarration(){playRequest.current++;setMuted(true);setBlocked(false);setAudioMessage('');const element=hasVideo?video.current:audio.current;if(element){element.muted=true;if(!hasVideo){syncTime(element.currentTime);element.pause();setAudioPlaying(false);}}}
 function toggleSound(){if(muted)enableNarration(true);else muteNarration();}
 function listen(){if(muted||paused||blocked||audioError)enableNarration(muted);else muteNarration();}
 function togglePlayback(){if(paused||blocked){if(!muted)enableNarration();else{setPaused(false);setBlocked(false);}}else{playRequest.current++;setPaused(true);audio.current?.pause();video.current?.pause();}}
 useEffect(()=>{const m=matchMedia('(prefers-reduced-motion: reduce)');const change=()=>{setReduced(m.matches);if(m.matches)setPaused(true);};change();m.addEventListener('change',change);const hide=()=>setHidden(document.hidden);hide();document.addEventListener('visibilitychange',hide);const io=new IntersectionObserver(([e])=>setVisible(e.isIntersecting),{threshold:.2});if(host.current)io.observe(host.current);return()=>{m.removeEventListener('change',change);document.removeEventListener('visibilitychange',hide);io.disconnect();};},[]);
 // Slides follow one continuous audio clock. Changing chapters never reloads or pauses audio.
 useEffect(()=>{if(!running||hasVideo)return;let raf=0,last=performance.now();const tick=(now:number)=>{let at=!muted&&audio.current?audio.current.currentTime:globalClock.current+Math.min((now-last)/1000,.1);last=now;if(muted&&at>=narrationDuration)at=0;syncTime(at);raf=requestAnimationFrame(tick);};raf=requestAnimationFrame(tick);return()=>cancelAnimationFrame(raf);},[running,hasVideo,muted,narrationDuration,narrationTimeline]);
 useEffect(()=>{const a=audio.current;if(!a||hasVideo)return;a.muted=muted;if(running&&!muted){if(a.paused){a.currentTime=globalClock.current;playMedia(a);}}else{playRequest.current++;a.pause();}},[running,muted,hasVideo]);
 useEffect(()=>{const v=video.current;if(!v)return;v.muted=muted;if(running){if(v.paused)playMedia(v);}else{playRequest.current++;v.pause();}},[running,muted,chapter,hasVideo]);
 useEffect(()=>()=>{playRequest.current++;audio.current?.pause();video.current?.pause();},[]);
 function seek(t:number){const local=Math.min(t,narrationTimeline[chapter].duration-.001);const at=narrationTimeline[chapter].start+local;syncTime(at);if(video.current)video.current.currentTime=local;if(audio.current)audio.current.currentTime=at;}
 function replay(){
  if(!muted){
   enableNarration(true);
   return;
  }
  seek(0);
  setPaused(false);
  setBlocked(false);
 }
 const storyTime=narrationStoryTime(chapter,time,narrationTiming);const displayTime=storyTime; const caption=[...data.captions].reverse().find(c=>displayTime>=c.at)?.text??data.captions[0].text;
 return localize(<section className="story-player" id="top" ref={host} aria-label="How UCXO works" aria-roledescription="carousel" onKeyDown={e=>{if((e.target as HTMLElement).tagName==='INPUT')return;if(e.key==='ArrowRight'){e.preventDefault();navigate(chapter+1);}if(e.key==='ArrowLeft'){e.preventDefault();navigate(chapter-1);}if(e.key===' '&&(e.target as HTMLElement).tagName!=='BUTTON'){e.preventDefault();togglePlayback();}}} onTouchStart={e=>{touch.current={x:e.touches[0].clientX,y:e.touches[0].clientY};}} onTouchEnd={e=>{const dx=e.changedTouches[0].clientX-touch.current.x,dy=e.changedTouches[0].clientY-touch.current.y;if(Math.abs(dx)>65&&Math.abs(dx)>Math.abs(dy)*1.5)navigate(chapter+(dx<0?1:-1));}}>
  {!hasVideo&&<audio lang={locale} ref={audio} muted={muted} src={src} preload="auto" onTimeUpdate={e=>syncTime(e.currentTarget.currentTime)} onEnded={e=>{syncTime(0);e.currentTarget.currentTime=0;if(running&&!muted)playMedia(e.currentTarget);}} onPlaying={()=>{setAudioPlaying(true);setBlocked(false);setAudioMessage('');}} onPause={()=>setAudioPlaying(false)} onError={()=>{setAudioPlaying(false);setAudioError(true);setBlocked(true);setPaused(true);setAudioMessage('Narration could not load. Select Play narration to retry.');}}/>}
  {!hasVideo&&<StoryScene chapter={chapter} time={displayTime} reduced={reduced} paused={!running}/>}
  <div className="story-stage" key={chapter} role="group" aria-roledescription="slide" aria-label={`Chapter ${chapter+1}: ${data.label}`}>
   {hasVideo&&<video ref={video} poster={data.poster} playsInline muted={muted} preload="auto" onLoadedMetadata={e=>setDuration(e.currentTarget.duration)} onTimeUpdate={e=>setTime(e.currentTarget.currentTime)} onEnded={()=>navigate(chapter+1)} onError={()=>{setMediaFailed(true);setTime(0);}}>{data.mobileVideo&&<source media="(max-width:600px)" src={data.mobileVideo}/>}<source src={data.video}/></video>}
   <div className="story-gradient"/>
   <div className="story-copy"><div className="eyebrow"><span className="mini-dot"/>HOW UCXO WORKS</div><span className="story-chapter-number">0{chapter+1} <span>/ 04</span></span><h1>{data.heading}</h1><p>{data.summary}</p><div className="story-example"><small>ONE OBJECTIVE. ONE CONNECTED STORY.</small><strong><LocalizedLineBreak message="Prepare next week’s production plan." englishPrefix="Prepare next week’s"/></strong></div>{(muted||blocked||audioError)&&<button className="story-listen" aria-label={muted?'Listen to explanation':paused||blocked?'Play narration':'Mute narration'} aria-pressed={!muted} onClick={listen}>{muted?<VolumeX size={16}/>:<Volume2 size={16}/>} {muted?'Listen to explanation':paused||blocked?'Resume narration':audioPlaying?'Sound on · Mute':'Starting narration…'}</button>}</div>
   <div className="story-state" role="status"><span className="mini-dot"/>{storyStatus(chapter,displayTime)}</div>
  </div>
  <div className="story-caption" aria-live={paused?'polite':'off'}><span>{caption}</span></div>
  <div className="story-bottom"><div className="story-playback"><button aria-label={paused?'Play explanation':'Pause explanation'} onClick={togglePlayback}>{paused?<Play size={17}/>:<Pause size={17}/>}</button><button aria-label="Replay chapter" onClick={replay}><RotateCcw size={16}/></button>{<button aria-label={muted?'Enable sound':'Mute sound'} aria-pressed={!muted} onClick={toggleSound}>{muted?<VolumeX size={17}/>:<Volume2 size={17}/>}</button>}<span className="story-time">{Math.floor(time).toString().padStart(2,'0')} / {Math.floor(duration)}s</span><input aria-label="Chapter progress" type="range" min="0" max={duration} step="0.1" value={time} onChange={e=>seek(Number(e.target.value))}/><span className="story-preview-label">{hasVideo?'CHAPTER FILM':muted?'NARRATION · SOUND OFF':audioPlaying?'NARRATION · PLAYING':audioError?'NARRATION · UNAVAILABLE':blocked?'NARRATION · TAP PLAY':paused?'NARRATION · PAUSED':'NARRATION · LOADING'}</span></div><div className="story-tabs" aria-label="Choose a chapter">{chapters.map((c,i)=><button key={c.label} aria-label={`Chapter ${i+1}: ${c.label}`} aria-current={i===chapter?'step':undefined} onClick={()=>navigate(i)}><span className="story-tab-line"><i style={{width:i===chapter?`${time/duration*100}%`:i<chapter?'100%':'0%'}}/></span><small>0{i+1}</small><span>{c.label}</span></button>)}</div></div>
  <p className="story-audio-language">{locale==='en'?'Audio: English':<span data-i18n-text-ready lang={locale}>{localeInfo(locale)?.name}</span>}</p>{audioMessage&&<p className="story-audio-message" role="alert">{audioMessage}</p>}
  {blocked&&<button className="story-start" onClick={()=>{if(!muted)enableNarration();else togglePlayback();}}><Play size={16}/>{blocked?'Play narration':'Play animation'}</button>}
 </section>);
}




