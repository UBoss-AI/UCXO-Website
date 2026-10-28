'use client';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

type NodeSpec = {name:string; sub:string; pos:[number,number,number]; icon:string; detail:string; core?:boolean; amber?:boolean};
const scenes: NodeSpec[][] = [
 [{name:'Objective',sub:'THE STARTING POINT',pos:[-1.3,.5,1],icon:'◎',core:true,detail:'A business objective becomes an illustrative draft workflow for review.'},{name:'Human Task',sub:'OWNER ASSIGNED',pos:[1.2,2.1,-.4],icon:'♙',detail:'Define accountable owners and the evidence each task needs.'},{name:'Engine Agent',sub:'AI EXECUTION',pos:[1.7,-.2,1.6],icon:'✧',detail:'Assign an approved, reusable AI worker to a step.'},{name:'Approval',sub:'HUMAN REVIEW',pos:[4,1.2,-.4],icon:'✓',detail:'A required human approval remains a human decision.'},{name:'Dependency',sub:'CONNECTED WORK',pos:[-1.8,-1.7,1.5],icon:'⌘',detail:'Make prerequisites and the order of work explicit.'},{name:'Outcome',sub:'READY FOR REVIEW',pos:[4,-1.7,.6],icon:'↗',detail:'Review the outcome against your original objective.'}],
 [{name:'Engine Agent',sub:'REUSABLE AI WORKER',pos:[.6,.3,1.2],icon:'✧',core:true,detail:'One reusable Engine Agent can execute many separate Runs.'},{name:'Inputs',sub:'CONTEXT & INSTRUCTIONS',pos:[-2.3,1.5,0],icon:'≡',detail:'Inputs provide the context for this execution.'},{name:'Approved Skills',sub:'GOVERNED CAPABILITIES',pos:[.8,2.5,-1],icon:'◇',detail:'Approved, reusable capabilities guide the agent’s work.'},{name:'Tools',sub:'ILLUSTRATIVE',pos:[-1.9,-1.5,-.2],icon:'⌘',detail:'Generic tools illustrate the capabilities used during execution.'},{name:'Results',sub:'EXECUTION OUTPUT',pos:[3.7,1.2,.5],icon:'↗',detail:'Review the output and evidence from each execution.'},{name:'Run 01',sub:'EXECUTION HISTORY',pos:[1,-2.2,1.5],icon:'≋',detail:'The first execution creates Run 01; the original Engine Agent remains in place.'},{name:'Run 02',sub:'A NEW EXECUTION',pos:[3.4,-1.5,1],icon:'≋',detail:'The next execution creates a separate Run 02.'},{name:'Run 03',sub:'A SEPARATE RUN',pos:[5.3,-.6,.3],icon:'≋',detail:'Every execution creates its own Run in the execution history.'}],
 [{name:'Human Task',sub:'PREREQUISITE COMPLETE',pos:[-1.8,1.3,.8],icon:'♙',core:true,detail:'A completed human prerequisite makes the next eligible step ready.'},{name:'Engine Agent',sub:'WAITING → READY',pos:[1,.4,1.3],icon:'✧',detail:'The AI step becomes ready after its prerequisite completes.'},{name:'Review task',sub:'HUMAN · WAITING',pos:[3.9,1.6,-.3],icon:'♙',detail:'This review waits for the agent output and required evidence.'},{name:'Dependency',sub:'PREREQUISITE',pos:[-.7,-1.7,-.5],icon:'⌘',detail:'Dependencies govern when work can begin.'},{name:'Engine Agent',sub:'AI · WAITING',pos:[3.5,-1.6,.6],icon:'✧',detail:'Downstream work remains waiting until its requirements are met.'}],
 [{name:'Human Approval',sub:'AWAITING HUMAN APPROVAL',pos:[1,.4,1.2],icon:'✓',core:true,detail:'Signals hold at this gate. Only the required human approver grants approval.'},{name:'Evidence',sub:'READY FOR REVIEW',pos:[-1.8,1.5,.3],icon:'≡',detail:'Evidence gives the human reviewer context for a decision.'},{name:'Executor Agent',sub:'MONITORING LAYER',pos:[1.2,2.5,-1],icon:'◎',detail:'Monitors execution and escalates problems while preserving human approvals.'},{name:'Exception',sub:'ESCALATED FOR REVIEW',pos:[-1.9,-1.6,.6],icon:'!',amber:true,detail:'An exception branches to a human review; it does not bypass the approval gate.'},{name:'Review',sub:'HUMAN DECISION',pos:[1,-2.7,1],icon:'♙',amber:true,detail:'A human reviews the escalated exception and decides the next action.'},{name:'Outcome',sub:'WAITING FOR APPROVAL',pos:[5,.6,-.2],icon:'↗',detail:'Execution beyond this gate waits for required human approval.'},{name:'Run History',sub:'EXECUTION RECORD',pos:[4.7,-2.1,-.5],icon:'≋',detail:'Run history preserves visibility into individual executions.'}]
];
const connections = [[[0,1],[0,2],[0,4],[1,3],[2,3],[2,5],[4,2],[3,5]],[[1,0],[2,0],[3,0],[0,4],[0,5],[5,6],[6,7]],[[0,1],[3,1],[1,2],[1,4]],[[1,0],[2,0],[2,1],[3,4],[4,0],[0,5],[2,6]]];

export default function GraphScene({index,active,reduced}:{index:number;active:boolean;reduced:boolean}) {
 const host=useRef<HTMLDivElement>(null); const labels=useRef<(HTMLButtonElement|null)[]>([]); const state=useRef({active,reduced}); state.current={active,reduced};
 const [selected,setSelected]=useState<number|null>(null); const selection=useRef<number|null>(null); selection.current=selected;
 const [failed,setFailed]=useState(false);
 useEffect(()=>{
  const el=host.current; if(!el)return;
  let renderer:THREE.WebGLRenderer;
  try {renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'low-power'});} catch {setFailed(true);return;}
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.7)); renderer.setClearColor(0x000000,0); el.prepend(renderer.domElement);
  const scene=new THREE.Scene(); const camera=new THREE.PerspectiveCamera(37,1,.1,100); camera.position.set(9,7,17); camera.lookAt(1,0,0);
  const world=new THREE.Group(); scene.add(world);
  scene.add(new THREE.AmbientLight(0x9274c9,2.2)); const key=new THREE.DirectionalLight(0xd9c7ff,5);key.position.set(3,8,5);scene.add(key);
  const purple=new THREE.PointLight(0x8b3dff,55,20);purple.position.set(1,2,3);scene.add(purple); const rim=new THREE.PointLight(0xb35cff,55,20);rim.position.set(-3,-2,0);scene.add(rim);
  const disposable:THREE.Texture[]=[];
  function glow(){const c=document.createElement('canvas');c.width=c.height=128;const x=c.getContext('2d')!;const g=x.createRadialGradient(64,64,0,64,64,64);g.addColorStop(0,'rgba(172,92,255,.75)');g.addColorStop(.25,'rgba(139,61,255,.2)');g.addColorStop(1,'rgba(139,61,255,0)');x.fillStyle=g;x.fillRect(0,0,128,128);const t=new THREE.CanvasTexture(c);disposable.push(t);return t;}
  const glowTexture=glow();
  const nodeMeshes=scenes[index].map((n)=>{
   const group=new THREE.Group();const size=n.core?1.55:1.05;
   const shape=new THREE.Shape();const r=.15,w=size/2; if(n.icon==='♙'){shape.absarc(0,0,w,0,Math.PI*2,false);}else{shape.moveTo(-w+r,-w);shape.lineTo(w-r,-w);shape.quadraticCurveTo(w,-w,w,-w+r);shape.lineTo(w,w-r);shape.quadraticCurveTo(w,w,w-r,w);shape.lineTo(-w+r,w);shape.quadraticCurveTo(-w,w,-w,w-r);shape.lineTo(-w,-w+r);shape.quadraticCurveTo(-w,-w,-w+r,-w);}
   const geometry=new THREE.ExtrudeGeometry(shape,{depth:.38,bevelEnabled:true,bevelSegments:3,steps:1,bevelSize:.06,bevelThickness:.05});
   const material=new THREE.MeshStandardMaterial({color:n.core?0x351451:0x140c24,metalness:.7,roughness:.26,emissive:n.amber?0x6f3504:0x49217b,emissiveIntensity:n.core?.6:.23});
   const mesh=new THREE.Mesh(geometry,material); group.add(mesh);
   const outline=new THREE.LineSegments(new THREE.EdgesGeometry(geometry,35),new THREE.LineBasicMaterial({color:n.amber?0xecac5b:0xa25bff,transparent:true,opacity:n.core?.85:.5}));group.add(outline);
   const c=document.createElement('canvas');c.width=c.height=256;const ctx=c.getContext('2d')!;ctx.font='100px Arial';ctx.textAlign='center';ctx.textBaseline='middle';ctx.shadowColor=n.amber?'#ffc169':'#b575ff';ctx.shadowBlur=22;ctx.fillStyle=n.amber?'#ffc169':'#e2c9ff';ctx.fillText(n.icon,128,132);const texture=new THREE.CanvasTexture(c);disposable.push(texture);
   const face=new THREE.Mesh(new THREE.PlaneGeometry(size*.8,size*.8),new THREE.MeshBasicMaterial({map:texture,transparent:true,depthWrite:false}));face.position.z=.445;group.add(face);
   const light=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTexture,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,opacity:n.core?.6:.3}));light.scale.setScalar(n.core?5:3);light.position.z=-.2;group.add(light);
   group.position.set(...n.pos);world.add(group);return {group,material,base:n.pos};
  });
  const edges=connections[index].map(([a,b])=>{
   const p=new THREE.Vector3(...scenes[index][a].pos),q=new THREE.Vector3(...scenes[index][b].pos);const middle=p.clone().lerp(q,.5);middle.z+=.45;
   const curve=new THREE.QuadraticBezierCurve3(p,middle,q);const amber=scenes[index][a].amber;
   const material=new THREE.MeshBasicMaterial({color:amber?0xc99a58:0x9546ff,transparent:true,opacity:.75});
   const tube=new THREE.Mesh(new THREE.TubeGeometry(curve,40,.018,6,false),material);world.add(tube);
   const halo=new THREE.Mesh(new THREE.TubeGeometry(curve,40,.055,6,false),new THREE.MeshBasicMaterial({color:amber?0xe3a14f:0x8b3dff,transparent:true,opacity:.08,blending:THREE.AdditiveBlending,depthWrite:false}));world.add(halo);
   const pulse=new THREE.Mesh(new THREE.SphereGeometry(.055,8,8),new THREE.MeshBasicMaterial({color:amber?0xffc77d:0xe2bcff}));world.add(pulse);
   const cone=new THREE.Mesh(new THREE.ConeGeometry(.07,.2,5),new THREE.MeshBasicMaterial({color:amber?0xe3a14f:0x9857ed}));cone.position.copy(curve.getPoint(.72));cone.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),curve.getTangent(.72).normalize());world.add(cone);
   return {a,b,curve,material,pulse,tube,halo};
  });
  const grid=new THREE.GridHelper(32,40,0x43225d,0x20152e);grid.position.y=-3;const gridMat=grid.material as THREE.Material;gridMat.transparent=true;gridMat.opacity=.22;world.add(grid);
  [2.3,3.3,4.3].forEach((radius,i)=>{const ring=new THREE.Mesh(new THREE.TorusGeometry(radius,.008,5,100),new THREE.MeshBasicMaterial({color:0x8841d8,transparent:true,opacity:.15-i*.03}));ring.rotation.x=-Math.PI/2;ring.position.set(1,-2.95,0);world.add(ring);});
  const dots=new Float32Array(170*3);for(let i=0;i<dots.length;i++)dots[i]=(Math.random()-.5)*24;
  const dust=new THREE.BufferGeometry();dust.setAttribute('position',new THREE.BufferAttribute(dots,3));world.add(new THREE.Points(dust,new THREE.PointsMaterial({color:0x9461ce,size:.022,transparent:true,opacity:.5})));
  let targetX=0,targetY=0,raf=0,time=0,last=performance.now();
  const pointer=(e:PointerEvent)=>{if(state.current.reduced)return;const rect=el.getBoundingClientRect();targetX=((e.clientX-rect.left)/rect.width-.5)*.12;targetY=((e.clientY-rect.top)/rect.height-.5)*.08;};el.addEventListener('pointermove',pointer);
  const leave=()=>{targetX=0;targetY=0;};el.addEventListener('pointerleave',leave);
  const resize=()=>{const w=el.clientWidth,h=el.clientHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.position.set(w<600?3:7,w<600?3:5,w<600?13:13);camera.lookAt(1,0,0);camera.updateProjectionMatrix();};const observer=new ResizeObserver(resize);observer.observe(el);resize();
  const tick=(now:number)=>{raf=requestAnimationFrame(tick);const delta=Math.min((now-last)/1000,.05);last=now;if(!state.current.active||document.hidden)return;if(!state.current.reduced)time+=delta;
   world.rotation.y+=(targetX-world.rotation.y)*.035;world.rotation.x+=(targetY-world.rotation.x)*.035;
   nodeMeshes.forEach(({group,material,base},i)=>{const reveal=state.current.reduced?1:THREE.MathUtils.smoothstep(time-i*.2,0,.8);group.scale.setScalar(Math.max(.001,reveal));group.position.y=base[1]+Math.sin(time*.7+i)*.065;const sel=selection.current;material.emissiveIntensity=sel===i?1.2:(scenes[index][i].core?.6:.23);const button=labels.current[i];if(button){const p=group.getWorldPosition(new THREE.Vector3());p.y-=scenes[index][i].core?1.08:.85;p.project(camera);button.style.opacity=String(reveal);button.style.left=`${(p.x*.5+.5)*el.clientWidth}px`;button.style.top=`${(-p.y*.5+.5)*el.clientHeight}px`;const status=button.querySelector('span');if(index===2&&i===1&&status)status.textContent=time%7>2?'AI · READY':'AI · WAITING';}});
   edges.forEach((edge,i)=>{let phase=(time*.19+i*.23)%1;if(index===3&&edge.b===0)phase=Math.min(phase,.72);edge.pulse.position.copy(edge.curve.getPoint(phase));edge.pulse.visible=!(index===3&&edge.a===0);const draw=state.current.reduced?1:THREE.MathUtils.clamp((time-.3-i*.1)/1.2,0,1);edge.tube.geometry.setDrawRange(0,Math.floor(edge.tube.geometry.index!.count*draw/3)*3);edge.halo.geometry.setDrawRange(0,Math.floor(edge.halo.geometry.index!.count*draw/3)*3);const sel=selection.current;edge.material.opacity=sel===null?.65:edge.a===sel||edge.b===sel?1:.12;});renderer.render(scene,camera);
  };raf=requestAnimationFrame(tick);
  const lost=(e:Event)=>{e.preventDefault();setFailed(true)};renderer.domElement.addEventListener('webglcontextlost',lost);
  return ()=>{cancelAnimationFrame(raf);observer.disconnect();el.removeEventListener('pointermove',pointer);el.removeEventListener('pointerleave',leave);renderer.domElement.removeEventListener('webglcontextlost',lost);scene.traverse(o=>{const mesh=o as THREE.Mesh;if(mesh.geometry)mesh.geometry.dispose();if(mesh.material){(Array.isArray(mesh.material)?mesh.material:[mesh.material]).forEach(m=>m.dispose());}});disposable.forEach(t=>t.dispose());renderer.dispose();renderer.domElement.remove();};
 },[index]);
 return <div className={'graph-scene'+(failed?' graph-fallback':'')} ref={host} aria-label={`Interactive illustrative ${['draft workflow','agent execution network','human and AI handoff','oversight graph'][index]}`}>
  {failed&&<svg viewBox="0 0 700 430" className="fallback-wires" aria-hidden="true"><path d="M100 130 Q300 50 350 220 T600 150 M100 130 Q150 350 350 220 T600 350" fill="none" stroke="#8b3dff" strokeWidth="2"/></svg>}
  {scenes[index].map((node,i)=><button key={i} ref={e=>{labels.current[i]=e}} className={'graph-label '+(node.core?'core ':'')+(node.amber?'amber ':'')+(selected===i?'selected':'')} style={failed?{left:`${18+(i%3)*30}%`,top:`${26+Math.floor(i/3)*39}%`}:undefined} onPointerEnter={()=>setSelected(i)} onPointerLeave={()=>setSelected(null)} onFocus={()=>setSelected(i)} onBlur={()=>setSelected(null)} onClick={()=>setSelected(i)} aria-label={`${node.name}. ${node.detail}`} tabIndex={active?0:-1}>
   {failed&&<span className="fallback-icon">{node.icon}</span>}<strong>{node.name}</strong><span>{node.sub}</span>
  </button>)}
  <div className={'node-inspector '+(selected!==null?'visible':'')} aria-live="polite">{selected!==null&&<><span className="mini-dot"/>{scenes[index][selected].detail}</>}</div>
 </div>
}




