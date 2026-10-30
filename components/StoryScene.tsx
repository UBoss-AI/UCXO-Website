'use client';
import {useEffect,useRef,useState} from 'react';
import * as THREE from 'three';
import {createHolographicNode} from './holographic-node';
import {createStudioEnvironment,attachment} from './scene-geometry';
import {glowTexture,energyMaterial} from './energy-flow';
import type {WorkflowNode,SymbolKind} from './scene-data';

const specs:{name:string;symbol:SymbolKind;x:number;z:number}[]=[
 {name:'Objective',symbol:'objective',x:-3.4,z:0},{name:'Human Task',symbol:'human',x:-.5,z:-2.3},
 {name:'Engine Agent',symbol:'agent',x:-.5,z:1.2},{name:'Human Review',symbol:'approval',x:2.5,z:-1.2},
 {name:'Run 01',symbol:'run',x:2.2,z:2},{name:'Outcome',symbol:'result',x:4.8,z:1.2},
 {name:'Executor Agent',symbol:'monitor',x:4.6,z:-3.5},{name:'Exception',symbol:'exception',x:.7,z:-4.3}
];
const links=[[0,1],[0,2],[2,4],[1,3],[4,3],[3,5],[6,3],[6,7],[7,3],[5,0]];
export default function StoryScene({chapter,time,reduced}:{chapter:number;time:number;reduced:boolean}){
 const host=useRef<HTMLDivElement>(null),labels=useRef<(HTMLSpanElement|null)[]>([]),update=useRef<()=>void>(()=>{}),state=useRef({chapter,time,reduced});state.current={chapter,time,reduced};const[failed,setFailed]=useState(false);
 useEffect(()=>{
  const el=host.current!;let renderer:THREE.WebGLRenderer;try{renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'low-power'});}catch{setFailed(true);return;}
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.setClearColor(0x07050d,0);renderer.shadowMap.enabled=true;el.prepend(renderer.domElement);
  const scene=new THREE.Scene(),world=new THREE.Group();scene.add(world);const env=createStudioEnvironment(renderer);scene.environment=env.texture;scene.environmentIntensity=.5;
  scene.add(new THREE.HemisphereLight(0xd6c2ff,0x07050d,1));const key=new THREE.DirectionalLight(0xf3eaff,3);key.position.set(-4,10,7);key.castShadow=true;scene.add(key);const rim=new THREE.PointLight(0x8b3dff,60,25);rim.position.set(1,4,-4);scene.add(rim);
  const floor=new THREE.Mesh(new THREE.PlaneGeometry(60,60),new THREE.MeshStandardMaterial({color:0x100a19,metalness:.65,roughness:.35}));floor.rotation.x=-Math.PI/2;floor.position.y=-.3;floor.receiveShadow=true;world.add(floor);const grid=new THREE.GridHelper(40,40,0x54266d,0x22132e);grid.position.y=-.29;(grid.material as THREE.Material).transparent=true;(grid.material as THREE.Material).opacity=.3;world.add(grid);floor.visible=false;grid.visible=false;
  const glow=glowTexture();const nodes=specs.map((s,i)=>{const spec:WorkflowNode={name:s.name,status:'',symbol:s.symbol,position:[0,0,0],mobile:[0,0,0],explanation:'',core:i===0||i===2,size:i===4?.8:1.3,amber:i===7};const node=createHolographicNode(spec,false,glow);node.group.position.set(s.x,0,s.z);world.add(node.group);return node;});
  const edges=links.map(([a,b],i)=>{const start=attachment(nodes[a].group.position,nodes[a].portDimensions,nodes[b].group.position);const end=attachment(nodes[b].group.position,nodes[b].portDimensions,nodes[a].group.position);start.y=end.y=.12;const mid=start.clone().lerp(end,.5);mid.y=.65;const curve=new THREE.QuadraticBezierCurve3(start,mid,end);const material=energyMaterial(i===7||i===8?0xe4ad63:0x8b3dff,.8,.6);const tube=new THREE.Mesh(new THREE.TubeGeometry(curve,48,.025,6,false),material);world.add(tube);const core=new THREE.Mesh(new THREE.TubeGeometry(curve,48,.012,6,false),new THREE.MeshBasicMaterial({color:i===7||i===8?0xe4ad63:0xb35cff,transparent:true,opacity:.8}));world.add(core);const pulse=new THREE.Mesh(new THREE.SphereGeometry(.065,8,8),new THREE.MeshBasicMaterial({color:i===7||i===8?0xe4ad63:0xd6c2ff}));world.add(pulse);return{a,b,curve,tube,core,material,pulse};});
  const camera=new THREE.PerspectiveCamera(38,1,.1,100);let disposed=false,lastMobile:boolean|undefined;const project=new THREE.Vector3();
  function render(){if(disposed)return;const{chapter:c,time:t,reduced:r}=state.current;const mobile=window.matchMedia('(max-width:600px)').matches;if(lastMobile!==mobile){lastMobile=mobile;const portrait=[[-2.4,-4.5],[-2.4,-1.5],[-2.4,1.5],[2.4,1.5],[-2.4,4.5],[2.4,4.5],[2.4,-4.5],[2.4,-1.5]];nodes.forEach((n,i)=>n.group.position.set(mobile?portrait[i][0]:specs[i].x,0,mobile?portrait[i][1]:specs[i].z));edges.forEach(e=>{e.curve.v0.copy(attachment(nodes[e.a].group.position,nodes[e.a].portDimensions,nodes[e.b].group.position));e.curve.v2.copy(attachment(nodes[e.b].group.position,nodes[e.b].portDimensions,nodes[e.a].group.position));e.curve.v0.y=e.curve.v2.y=.12;e.curve.v1.copy(e.curve.v0).lerp(e.curve.v2,.5);e.curve.v1.y=.65;e.tube.geometry.dispose();e.tube.geometry=new THREE.TubeGeometry(e.curve,48,.025,6,false);e.core.geometry.dispose();e.core.geometry=new THREE.TubeGeometry(e.curve,48,.012,6,false);});}camera.aspect=el.clientWidth/el.clientHeight;camera.position.set(mobile?0:7,mobile?17:10,mobile?17:13);camera.lookAt(mobile?0:.7,.2,mobile?0:-.6);camera.updateProjectionMatrix();world.rotation.y=r?-.08:-.08+Math.sin(t*.09)*.035;
   const focus=c===0?(t<9?0:t<12?1:3):c===1?(t<4?3:t<8?4:t<13?2:1):c===2?(t<4?2:t<8?4:t<12?1:t<15?3:4):(t<4?6:t<9?3:t<13?1:5);
   if(!mobile){const pull=THREE.MathUtils.smoothstep(t,5,12);const target=c===0?new THREE.Vector3(-3.4,0,0).lerp(new THREE.Vector3(-.5,0,-.4),pull):new THREE.Vector3(c===1?0:c===3?1.6:1.3,0,c===3?-.6:0);camera.position.copy(target).add(new THREE.Vector3(4.5,8.5,11));camera.lookAt(target.x,.65,target.z);camera.zoom=(c===0?2.1-pull*.6:c===1?1.62:c===2?1.48:1.44)*Math.min(1,camera.aspect/1.7);camera.updateProjectionMatrix();}
   nodes.forEach((n,i)=>{let visible=c===0?(i===0||t>8&&i<4):c===1?(i<4||i===4&&t>=4):c===2?(i<6&&(i!==4||t>=4)):i!==2; if(c===0&&r)visible=i<4; n.group.visible=visible;let scale=c===0&&i>0?THREE.MathUtils.smoothstep(t,8+i*.6,10+i*.6):1;if(c===2&&i===4)scale=THREE.MathUtils.smoothstep(t,4,4.8);if(c===1&&i===4)scale=THREE.MathUtils.smoothstep(t,4,4.8);n.group.scale.setScalar(scale);const waiting=c===2&&i===3&&t<12;const active=i===focus&&!waiting;n.accent.emissiveIntensity=active?2.8:waiting?.12:.45;n.hologram.position.y=r||waiting?0:Math.sin(t*.7+i)*.035;if(c===3&&i===3)n.hologram.position.y+=THREE.MathUtils.smoothstep(t,9,10)*.45;n.rotors.forEach(rotor=>{rotor.object.rotation[rotor.axis]=r||waiting?0:t*rotor.speed;});n.energy.forEach(m=>{m.uniforms.uTime.value=t;m.uniforms.uFlow.value=r||waiting?0:active?1:.25;});const label=labels.current[i];if(label){project.set(0,2.15,0);n.group.localToWorld(project);project.project(camera);label.style.left=`${(project.x*.5+.5)*100}%`;label.style.top=`${(-project.y*.5+.5)*100}%`;label.style.opacity=visible&&scale>.8?'1':'0';label.dataset.active=String(active);}
   });
   edges.forEach((e,i)=>{let visible=nodes[e.a].group.visible&&nodes[e.b].group.visible&&!(c<3&&i>5);if(c===0)visible=visible&&t>11; e.tube.visible=visible;e.core.visible=visible;e.material.uniforms.uTime.value=t;e.material.uniforms.uFlow.value=0;let moving=false,phase=0;if(c===2){if(i===2&&t>=4){moving=t<8;phase=(t-4)/4;}if(i===3&&t>=8){moving=t<12;phase=(t-8)/4;}if(i===4&&t>=15){moving=true;phase=(t-15)/3;}}
    if(c===0&&(i===0||i===1)){moving=t>11&&t<15;phase=(t-11)/4;}
    if(c===1&&i<5){moving=t>13;phase=Math.min((t-13)/4,1);}
    if(c===3){if(i===4){moving=t>1;phase=Math.min((t-1)/3,.97);}if(i===5){moving=t>9;phase=(t-9)/4;}if(i===7||i===8){moving=t<4;phase=t/4;}if(i===9){moving=t>13;phase=(t-13)/4;}}
    const gated=c===3&&i===5&&t<9;(e.core.material as THREE.MeshBasicMaterial).opacity=gated?.08:.65;
    // No signal crosses the mandatory approval gate before the human action at 9s.
    e.pulse.visible=visible&&moving&&!r;e.pulse.position.copy(e.curve.getPoint(THREE.MathUtils.clamp(phase,0,1)));e.material.uniforms.uFlow.value=moving&&!r?1:0;e.material.uniforms.uOpacity.value=c===2&&i===3&&t<8?.12:.65;
   });renderer.render(scene,camera);
  }
  const resize=()=>{renderer.setSize(el.clientWidth,el.clientHeight);render();};update.current=render;const observer=new ResizeObserver(resize);observer.observe(el);const lost=(e:Event)=>{e.preventDefault();setFailed(true);};renderer.domElement.addEventListener('webglcontextlost',lost);resize();return()=>{disposed=true;observer.disconnect();update.current=()=>{};renderer.domElement.removeEventListener('webglcontextlost',lost);scene.traverse(o=>{const m=o as THREE.Mesh;m.geometry?.dispose();if(m.material)(Array.isArray(m.material)?m.material:[m.material]).forEach(x=>x.dispose());});nodes.forEach(n=>n.textures.forEach(t=>t.dispose()));glow.dispose();env.dispose();renderer.dispose();renderer.domElement.remove();};
 },[]);
 useEffect(()=>{update.current();},[chapter,time,reduced]);
 return <div className={`story-scene ${failed?'story-scene-failed':''}`} ref={host} role="img" aria-label={`Illustrative monthly business review workflow, chapter ${chapter+1}`}><div className="story-object-labels" aria-hidden="true">{specs.map((s,i)=><span key={s.name} ref={e=>{labels.current[i]=e;}}>{chapter===3&&i===4?'Evidence':chapter===1&&i===4?'Evidence check':s.name}<small>{i===0?'MONTHLY BUSINESS REVIEW':chapter===3&&i===4?'RUN 01 HISTORY':chapter===2&&i===4?time<4?'PENDING EXECUTION':'DISTINCT EXECUTION':chapter===2&&i===3?time<12?'WAITING FOR PREREQUISITE':'READY FOR OUTPUT':chapter===3&&i===3?time<9?'AWAITING HUMAN APPROVAL':'HUMAN APPROVED':i===6?'MONITORING ONLY':i===7?'HUMAN REVIEWER':i===2?'REUSABLE AI WORKER':''}</small></span>)}</div>{failed&&<div className="story-fallback"><strong>Monthly business review</strong><p>Objective → Human task + Engine Agent → Run → Evidence → Human approval → Outcome</p><p>The complete explanation is available in the captions and transcript below.</p></div>}</div>;
}





