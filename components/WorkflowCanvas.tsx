'use client';
import {useEffect,useId,useRef,useState} from 'react';
import {Play,ClipboardList,Filter,Bot,Plug,UserRoundCheck,FileCheck2,Square,UserRound, Bell,ZoomIn,ZoomOut,Maximize,Workflow,List,Check} from 'lucide-react';
import './workflow-canvas.css';

type Role='Human'|'AI agent'|'System'|'Control';
const nodes=[
 {id:'N1',name:'Planner starts',detail:'readiness run',type:'Trigger',role:'Control' as Role,x:65,y:165,icon:Play},
 {id:'N2',name:'Readiness checklist',detail:'(FORM-001)',type:'Form / input',role:'Human' as Role,x:240,y:165,icon:ClipboardList},
 {id:'N3',name:'Line clearance',detail:'complete?',type:'Condition',role:'Control' as Role,x:415,y:165,icon:Filter},
 {id:'N4',name:'Capacity summary',detail:'(AG-001)',type:'Agent action',role:'AI agent' as Role,x:590,y:85,icon:Bot},
 {id:'N5',name:'Update sandbox ERP',detail:'schedule',type:'Integration',role:'System' as Role,x:765,y:85,icon:Plug},
 {id:'N6',name:'Operations lead',detail:'approves release',type:'Approval',role:'Human' as Role,x:940,y:85,icon:UserRoundCheck},
 {id:'N7',name:'Approved production',detail:'plan record',type:'Record output',role:'System' as Role,x:1115,y:85,icon:FileCheck2},
 {id:'N8',name:'End',detail:'',type:'End',role:'Control' as Role,x:1290,y:165,icon:Square},
 {id:'N9',name:'Resolve clearance',detail:'deviation',type:'Human task',role:'Human' as Role,x:415,y:330,icon:UserRound},
 {id:'N10',name:'Notify planner of ERP',detail:'sync failure',type:'Notification',role:'System' as Role,x:940,y:290,icon:Bell}
];
const routes=[
 {from:0,to:1,label:'next'}, {from:1,to:2,label:'next'},
 {from:2,to:3,label:'Yes'}, {from:2,to:8,label:'No',recovery:true},
 {from:8,to:1,label:'Re-check (max 3)',recovery:true},
 {from:3,to:4,label:'next'}, {from:3,to:8,label:'Invalid output',recovery:true},
 {from:4,to:5,label:'next'}, {from:4,to:9,label:'Sync failed',recovery:true},
 {from:5,to:6,label:'Approved',gate:true}, {from:5,to:7,label:'Rejected / returned',recovery:true},
 {from:6,to:7,label:'next',gate:true}, {from:9,to:7,label:'next'}
];
function geometry(route:typeof routes[number]){
 const a=nodes[route.from],b=nodes[route.to];
 if(route.from===8&&route.to===1)return {d:`M${a.x-25} ${a.y} C${a.x-150} ${a.y},${b.x} ${a.y-10},${b.x} ${b.y+28}`,x:290,y:312};
 if(route.from===3&&route.to===8)return {d:`M${a.x+24} ${a.y+15} C${a.x+115} ${a.y+55},${b.x+85} ${b.y-65},${b.x+18} ${b.y-25}`,x:560,y:215};
 if(route.from===5&&route.to===7)return {d:`M${a.x+25} ${a.y+18} C${a.x+120} ${a.y+65},${b.x-130} ${b.y-50},${b.x-28} ${b.y-5}`,x:1130,y:24};
 const downward=b.y>a.y+80;
 const sx=a.x+(downward?0:28),sy=a.y+(downward?28:0),ex=b.x-(downward?0:28),ey=b.y-(downward?28:0);
 return {d:`M${sx} ${sy} C${sx+(downward?0:65)} ${sy+(downward?70:0)},${ex-(downward?0:65)} ${ey-(downward?70:0)},${ex} ${ey}`,x:(sx+ex)/2+(downward?36:0),y:(sy+ey)/2-10};
}
const chapterFocus=[[0,1,2],[1,8,3,5],[2,3,8,4,5],[9,5,5,6,7]];
export default function WorkflowCanvas({chapter=0,time=0,active=true,paused=false,reduced=false,narrated=false}:{chapter?:number;time?:number;active?:boolean;paused?:boolean;reduced?:boolean;narrated?:boolean}){
 const id=useId().replaceAll(':',''),[zoom,setZoom]=useState(1),[ordered,setOrdered]=useState(()=>typeof window!=='undefined'&&window.matchMedia('(max-width:600px)').matches),[selected,setSelected]=useState<number|null>(null);
 const beats=chapter===0?[0,9,14]:chapter===1?[0,4,8,13]:chapter===2?[0,4,8,12,15]:[0,4,9,13,17];
 let beat=0;beats.forEach((at,i)=>{if(time>=at)beat=i;});const focus=selected??chapterFocus[chapter][narrated?beat:Math.min(chapterFocus[chapter].length-1,chapter===0?1:chapter===1?2:chapter===2?3:1)];
 const list=useRef<HTMLOListElement>(null);
 useEffect(()=>{const media=window.matchMedia('(max-width:600px)');const update=()=>setOrdered(media.matches);media.addEventListener('change',update);return()=>media.removeEventListener('change',update);},[]);
 useEffect(()=>{const el=list.current,row=el?.children[focus] as HTMLElement|undefined;if(ordered&&el&&row)el.scrollTo({top:row.getBoundingClientRect().top-el.getBoundingClientRect().top+el.scrollTop-10,behavior:reduced?'instant':'smooth'});},[focus,ordered,reduced]);
 const released=narrated&&chapter===3&&time>=9;
 return <section className={`ucxo-workflow ${narrated?'is-narrated':''} ${!active||paused||reduced?'is-still':''}`} aria-label="UCXO Engine Planner workflow canvas">
  <div className="workflow-title"><span><Workflow size={14}/> Workflow canvas</span><span>WF-008 <b>draft v1</b><i>Illustrative</i></span></div>
  <div className="workflow-view-tabs"><div><button type="button" aria-pressed={!ordered} onClick={()=>setOrdered(false)}><Workflow size={12}/>Canvas</button><button type="button" aria-pressed={ordered} onClick={()=>setOrdered(true)}><List size={12}/>Ordered steps</button></div><span><Check size={12}/> Typed workflow</span></div>
  <div className="workflow-toolbar"><div><button type="button" aria-label="Zoom in workflow" onClick={()=>setZoom(z=>Math.min(2.5,z+.25))}><ZoomIn size={14}/></button><button type="button" aria-label="Zoom out workflow" onClick={()=>setZoom(z=>Math.max(.75,z-.25))}><ZoomOut size={14}/></button><button type="button" aria-label="Fit whole workflow to view" onClick={()=>setZoom(1)}><Maximize size={14}/></button><span>{Math.round(zoom*100)}%</span></div><div className="workflow-role-key">{(['Human','AI agent','System','Control'] as Role[]).map(role=><span key={role}><i className={`role-${role.replace(' ','-')}`}/>{role}</span>)}<span className="route-key">execution</span><span className="route-key is-recovery">decision · recovery</span></div></div>
  {ordered?<ol className="workflow-ordered" ref={list}>{nodes.map((n,i)=><li key={n.id} className={focus===i?'is-focused':''}><span className={`workflow-step-icon role-${n.role.replace(' ','-')}`}><n.icon size={16}/></span><div><small>{n.id} · {n.type} · {n.role}</small><strong>{n.name} {n.detail}</strong>{i===2&&<p>Yes → Capacity summary · No → Resolve clearance deviation</p>}{i===8&&<p>Re-check readiness checklist (max 3)</p>}{i===4&&<p>Sync failed → Notify planner</p>}</div></li>)}</ol>:<div className="workflow-scroll"><svg className="workflow-graph" viewBox="0 0 1380 450" style={{width:`${zoom*100}%`}} aria-label="Production readiness workflow with approval and recovery branches"><defs><pattern id={`${id}-dots`} width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1.2" fill="#d8d2e5"/></pattern><marker id={`${id}-arrow`} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 L8 4 L0 8" fill="none" stroke="#a494c9" strokeWidth="1.5"/></marker><marker id={`${id}-recover`} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 L8 4 L0 8" fill="none" stroke="#cb9277" strokeWidth="1.5"/></marker></defs><rect width="1380" height="450" fill={`url(#${id}-dots)`}/>
   {routes.map((route,i)=>{const g=geometry(route),held=route.gate&&!released;return <g key={i} className={`workflow-route ${route.recovery?'is-recovery':''} ${held?'is-held':''}`}><path d={g.d} markerEnd={`url(#${id}-${route.recovery?'recover':'arrow'})`}/><rect x={g.x-route.label.length*3.7-7} y={g.y-12} width={route.label.length*7.4+14} height="22" rx="5"/><text x={g.x} y={g.y+3}>{route.label}</text>{!held&&<circle r="3.5" className="workflow-signal"><animateMotion dur={`${3+i*.08}s`} repeatCount="indefinite" path={g.d}/></circle>}</g>;})}
   {nodes.map((n,i)=><g key={n.id} className={`workflow-node role-${n.role.replace(' ','-')} ${focus===i?'is-focused':''}`} transform={`translate(${n.x},${n.y})`} role="button" tabIndex={active?0:-1} aria-label={`${n.type}: ${n.name} ${n.detail}. ${n.role}`} onClick={()=>setSelected(selected===i?null:i)} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();setSelected(selected===i?null:i);}}}>
    <text className="workflow-node-id" x="-24" y="-38">{n.id}</text><rect className="workflow-node-halo" x="-34" y="-34" width="68" height="68" rx={n.role==='Control'?34:16}/><rect className="workflow-node-tile" x="-27" y="-27" width="54" height="54" rx={n.role==='Control'?27:12}/><n.icon x={-13} y={-13} width={26} height={26} strokeWidth={1.8}/>
    <circle className="workflow-port" cx="-30" cy="0" r="3"/><circle className="workflow-port" cx="30" cy="0" r="3"/>
    <text className="workflow-node-name" y="53">{n.name}</text><text className="workflow-node-name" y="70">{n.detail}</text><text className="workflow-node-type" y="91">{n.type} · {n.role}</text>
   </g>)}
  </svg></div>}
  <div className="workflow-footer"><span>{selected===null?'Next week’s production readiness plan':`${nodes[selected].type} · ${nodes[selected].name} ${nodes[selected].detail}`}</span><span>{released?'Illustrative approval recorded':'Human approval required'}</span></div>
 </section>;
}
