'use client';
import {useEffect,useRef,useState,type CSSProperties} from 'react';
import * as THREE from 'three';
import {workflowScenes} from './scene-data';
import {nodeColor,nodeColorHex} from './node-palette';
import {createHolographicNode} from './holographic-node';
import {createStudioEnvironment,attachment} from './scene-geometry';
import {glowTexture,energyMaterial} from './energy-flow';

// The carousel and narrated film use the same typed workflow, labels and routes.
const focusBeats=[[0,1,3,2],[1,3,0,5],[3,1,0,4,2],[4,0,0,1,5]];
const cueTimes=[[0,4,9,14],[0,4,8,13],[0,4,8,12,15],[0,4,9,13,17]];
export default function StoryScene({chapter,time,reduced}:{chapter:number;time:number;reduced:boolean}){
 const host=useRef<HTMLDivElement>(null),labels=useRef<(HTMLSpanElement|null)[]>([]),update=useRef<()=>void>(()=>{}),state=useRef({chapter,time,reduced});
 state.current={chapter,time,reduced};const[failed,setFailed]=useState(false);
 useEffect(()=>{
  const el=host.current!;let renderer:THREE.WebGLRenderer;
  try{renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'low-power'});}catch{setFailed(true);return;}
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.setClearColor(0x07050d,0);renderer.domElement.setAttribute('aria-hidden','true');el.prepend(renderer.domElement);
  const scene=new THREE.Scene(),env=createStudioEnvironment(renderer);scene.environment=env.texture;scene.environmentIntensity=.5;
  scene.add(new THREE.HemisphereLight(0xd6c2ff,0x07050d,1));const key=new THREE.DirectionalLight(0xf3eaff,3);key.position.set(-4,10,7);scene.add(key);
  const rim=new THREE.PointLight(0xf4f6ff,12,25);rim.position.set(1,4,-4);scene.add(rim);
  const glow=glowTexture();
  // Cache each chapter's scene; switching chapters keeps the renderer and audio alive.
  const worlds=workflowScenes.map(definition=>{
   const group=new THREE.Group();scene.add(group);
   const nodes=definition.nodes.map(spec=>{const node=createHolographicNode(spec,false,glow);group.add(node.group);return node;});
   const edges=definition.edges.map(spec=>{
    const color=nodeColor(definition.nodes[spec.to]),material=energyMaterial(color,.6,.6);
    const tube=new THREE.Mesh(new THREE.BufferGeometry(),material),pulse=new THREE.Mesh(new THREE.SphereGeometry(.055,8,8),new THREE.MeshBasicMaterial({color}));group.add(tube,pulse);
    const recovery=new THREE.Line(new THREE.BufferGeometry(),new THREE.LineDashedMaterial({color:0xff9b45,dashSize:.15,gapSize:.12,transparent:true,opacity:.7}));recovery.visible=spec.kind==='exception';group.add(recovery);return{spec,curve:new THREE.QuadraticBezierCurve3(),material,tube,pulse,recovery};
   });return{group,nodes,edges};
  });
  const camera=new THREE.PerspectiveCamera(38,1,.1,100),project=new THREE.Vector3();let disposed=false,lastMobile:boolean|undefined;
  function layout(mobile:boolean){worlds.forEach((world,c)=>{
   const definition=workflowScenes[c];world.nodes.forEach((node,i)=>{const p=mobile?definition.nodes[i].mobile:definition.nodes[i].position;node.group.position.set(p[0],0,-p[1]*1.2);});
   world.edges.forEach(e=>{const a=world.nodes[e.spec.from],b=world.nodes[e.spec.to];e.curve.v0.copy(attachment(a.group.position,a.portDimensions,b.group.position));e.curve.v2.copy(attachment(b.group.position,b.portDimensions,a.group.position));e.curve.v0.y=e.curve.v2.y=.12;e.curve.v1.copy(e.curve.v0).lerp(e.curve.v2,.5);e.curve.v1.y=.5;e.tube.geometry.dispose();e.tube.geometry=new THREE.TubeGeometry(e.curve,40,.02,6,false);e.recovery.geometry.dispose();e.recovery.geometry=new THREE.BufferGeometry().setFromPoints(e.curve.getPoints(80));e.recovery.computeLineDistances();e.tube.visible=e.spec.kind!=='exception';});
  });}
  function render(){if(disposed)return;const{chapter:c,time:t,reduced:r}=state.current,mobile=window.matchMedia('(max-width:600px)').matches;
   if(lastMobile!==mobile){lastMobile=mobile;layout(mobile);}const world=worlds[c],definition=workflowScenes[c];worlds.forEach((w,i)=>w.group.visible=i===c);
   camera.aspect=el.clientWidth/el.clientHeight;camera.position.set(mobile?0:3.5,mobile?15:10,mobile?15:13);camera.lookAt(.5,.5,0);camera.zoom=mobile?1.6:1.4*Math.min(1,camera.aspect/1.65);camera.updateProjectionMatrix();
   world.group.rotation.y=r?-.04:-.04+Math.sin(t*.09)*.025;
   let beat=0;cueTimes[c].forEach((at,i)=>{if(t>=at)beat=i;});const focus=focusBeats[c][beat];
   world.nodes.forEach((node,i)=>{const active=i===focus;node.accent.emissiveIntensity=active?1.2:.5;node.hologram.position.y=r?0:Math.sin(t*.7+i)*.025;
    node.rotors.forEach(rotor=>rotor.object.rotation[rotor.axis]=r?0:t*rotor.speed);node.energy.forEach(m=>{m.uniforms.uTime.value=t;m.uniforms.uFlow.value=r?0:active?1:.2;});
    const label=labels.current[i];if(label){project.copy(node.labelAnchor);node.group.localToWorld(project);project.project(camera);label.style.left=`${(project.x*.5+.5)*100}%`;label.style.top=`${(-project.y*.5+.5)*100}%`;label.style.opacity='1';label.dataset.active=String(active);}
   });
   world.edges.forEach((e,i)=>{
    // Release output follows the explicit human decision, never an automatic approval.
    const held=e.spec.kind==='blocked'&&!(c===3&&t>=9),recovery=e.spec.kind==='exception';
    e.material.uniforms.uTime.value=t;e.material.uniforms.uOpacity.value=held?.13:recovery?.45:.65;e.material.uniforms.uFlow.value=r||held?0:1;
    const phase=((t*.2+i*.16)%1);e.pulse.visible=!r&&!held;e.pulse.position.copy(e.curve.getPoint(phase));
   });renderer.render(scene,camera);
  }
  const resize=()=>{renderer.setSize(el.clientWidth,el.clientHeight);render();};update.current=render;const observer=new ResizeObserver(resize);observer.observe(el);
  const lost=(e:Event)=>{e.preventDefault();setFailed(true);};renderer.domElement.addEventListener('webglcontextlost',lost);resize();
  return()=>{disposed=true;observer.disconnect();update.current=()=>{};renderer.domElement.removeEventListener('webglcontextlost',lost);scene.traverse(o=>{const m=o as THREE.Mesh;m.geometry?.dispose();if(m.material)(Array.isArray(m.material)?m.material:[m.material]).forEach(x=>x.dispose());});worlds.forEach(w=>w.nodes.forEach(n=>n.textures.forEach(t=>t.dispose())));glow.dispose();env.dispose();renderer.dispose();renderer.domElement.remove();};
 },[]);
 useEffect(()=>{update.current();},[chapter,time,reduced]);
 const definition=workflowScenes[chapter];
 return <div className={`story-scene ${failed?'story-scene-failed':''}`} ref={host} role="img" aria-label={`Illustrative production readiness workflow: ${definition.title}`}><div className="story-object-labels" aria-hidden="true">{definition.nodes.map((node,i)=><span key={`${chapter}-${i}`} style={{'--node-accent':nodeColorHex(node)} as CSSProperties} ref={e=>{labels.current[i]=e;}}>{node.name}<small>{node.status}</small></span>)}</div><div className="story-flow-legend" aria-hidden="true"><span>Human</span><span>AI agent</span><span>System</span><span>Control</span><i/>Decision / recovery</div>{failed&&<div className="story-fallback"><strong>{definition.title}</strong><p>{definition.nodes.map(n=>n.name).join(' · ')}</p><p>The configured paths are explained in the captions and transcript below.</p></div>}</div>;
}
