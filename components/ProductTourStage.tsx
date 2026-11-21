'use client';
import {useLocalize} from '@/i18n/LocaleProvider';
import {useEffect,useRef,useState} from 'react';
import {MousePointer2} from 'lucide-react';
import type {TourStep,TourRect} from './product-tour-data';
import ProductScreenImage from './ProductScreenImage';

function mix(a:number,b:number,t:number){return a+(b-a)*t;}
function smooth(t:number){const x=Math.max(0,Math.min(1,t));return x*x*(3-2*x);}
export default function ProductTourStage({step,previous,time,focusView,reduced,active,theme='dark'}:{step:TourStep;previous?:TourStep;time:number;focusView:boolean;reduced:boolean;active:boolean;theme?:'dark'|'light'}){const localize=useLocalize();
 const host=useRef<HTMLDivElement>(null),[size,setSize]=useState({width:900,height:618});
 useEffect(()=>{const el=host.current;if(!el)return;const observer=new ResizeObserver(()=>setSize({width:el.clientWidth,height:el.clientHeight}));observer.observe(el);return()=>observer.disconnect();},[]);
 const click=!!step.click&&!!previous,switched=!click||time>=1.95;
 const screen=switched?step.screen:previous!.screen;
 const from=previous?.focus??step.focus,goal=step.focus;
 const before:[number,number]=[from.x+from.w*.5,from.y+from.h*.5],target=step.click??[goal.x+goal.w*.5,goal.y+goal.h*.5];
 const progress=smooth(time/1.5),after=smooth((time-2)/1.0);
 const pointer=click?(time<2?[mix(before[0],target[0],progress),mix(before[1],target[1],progress)]:[mix(target[0],goal.x+goal.w*.5,after),mix(target[1],goal.y+goal.h*.5,after)]):[goal.x+goal.w*.5,goal.y+goal.h*.5];
 const rect:TourRect=click&&!switched?{x:target[0]-8,y:target[1]-2.6,w:23,h:5.2}:goal;
 const zoom=focusView?1.85:1,imageHeight=size.width*897/1306;
 const centerX=click&&time<3?pointer[0]:goal.x+goal.w*.5,centerY=click&&time<3?pointer[1]:goal.y+goal.h*.5;
 const x=focusView?Math.max(size.width-size.width*zoom,Math.min(0,size.width*.5-size.width*centerX/100*zoom)):0;
 const y=focusView?Math.max(size.height-imageHeight*zoom,Math.min(0,size.height*.5-imageHeight*centerY/100*zoom)):0;
 const clicking=click&&time>=1.5&&time<2.25;
 return localize(<div className={`tour-software-stage ${focusView?'is-focused-view':''} ${reduced?'is-reduced':''}`} ref={host} role="img" aria-label={`${step.title}. Original UCXO software screen with a guided cursor demonstration.`} data-theme={theme} data-screen={screen} data-clicking={clicking} data-step={step.id}>
  <div className="tour-software-plane" style={{transform:`translate(${x}px,${y}px) scale(${zoom})`}}>
   <ProductScreenImage screen={screen} active={active} theme={theme} navigationTone/>
   <div className="tour-nav-header-tone"/><div className="tour-nav-rail-tone"/><div className="tour-nav-inner-tone"/>
   {screen==='udashview'&&<div className="tour-dashboard-update">
    <div className="tour-dashboard-toolbar"><div><b>Overview</b><span>Activity</span></div><div><b>▦ Workspace map</b><span>▦ Cards</span><span>◇ Board</span><span>☷ List</span><span className="tour-department">Department <strong>All in my scope⌄</strong></span></div></div>
    <div className="tour-dashboard-context"><strong>♙ Pilot Company A (sample)</strong><span>♧ Operations</span></div>
    <p>Good to see you, Arjun (Operator). Every module you can open sits around UCXO with one figure; each card opens exactly what it counts.</p>
    <div className="tour-dashboard-refresh">◷ Refreshed 09:29 am <span>⟳ Refresh</span></div>
    <div className="tour-dashboard-map"><div className="tour-dashboard-orbit"><b>UX</b></div><strong>UCXO</strong><span>Pilot Company A (sample)</span><small>Your departments: Operations.</small></div>
    <div className="tour-dashboard-map-caption">Where work is set up and carried out</div>
    <div className="tour-dashboard-module"><span>⚑</span><strong>Mission &amp; Objectives</strong><b>1</b></div>
   </div>}
   <div className="tour-highlight" style={{left:`${rect.x}%`,top:`${rect.y}%`,width:`${rect.w}%`,height:`${rect.h}%`}}/>
   {!reduced&&<div className="tour-pointer" style={{left:`${pointer[0]}%`,top:`${pointer[1]}%`}}><MousePointer2 fill="#fff" stroke="#241236" strokeWidth={1.8}/><span className={`tour-click-ring ${clicking?'is-clicking':''}`}/></div>}
  </div>
 </div>);
}
