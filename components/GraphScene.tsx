'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import {nodeColor,nodeColorHex,nodePalette} from './node-palette';
import * as THREE from 'three';
import { workflowScenes } from './scene-data';
import { attachment, colors, createStudioEnvironment, softShadowTexture } from './scene-geometry';
import { createHolographicNode } from './holographic-node';
import { energyMaterial, glowTexture, ribbonCurve } from './energy-flow';
import './graph-scene.css';

type Props = { index:number; active:boolean; reduced:boolean; paused?:boolean };

export default function GraphScene({index,active,reduced,paused=false}:Props){
  const host=useRef<HTMLDivElement>(null),labels=useRef<(HTMLButtonElement|null)[]>([]);
  const runtime=useRef({active,reduced,paused});runtime.current={active,reduced,paused};
  const invalidate=useRef<()=>void>(()=>{});
  const [selected,setSelected]=useState<number|null>(null),[fallback,setFallback]=useState(false);
  const [compact,setCompact]=useState<boolean|null>(null);
  const selectedRef=useRef<number|null>(null);selectedRef.current=selected;
  const definition=workflowScenes[index];

  useEffect(()=>{
    const element=host.current;if(!element)return;
    const measure=()=>setCompact(element.clientWidth<610);
    const observer=new ResizeObserver(measure);observer.observe(element);measure();
    return()=>observer.disconnect();
  },[]);

  useEffect(()=>{
    const element=host.current;if(!element||compact===null)return;
    const mobile=compact;
    let renderer:THREE.WebGLRenderer;
    try{renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:mobile?'low-power':'high-performance'});}catch{setFallback(true);return;}
    renderer.setPixelRatio(Math.min(devicePixelRatio,mobile?1.35:1.65));renderer.setClearColor(0x07050d,0);
    renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;
    renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
    renderer.domElement.setAttribute('aria-hidden','true');element.prepend(renderer.domElement);
    const scene=new THREE.Scene(),environment=createStudioEnvironment(renderer);
    scene.environment=environment.texture;scene.environmentIntensity=.55;
    const camera=new THREE.PerspectiveCamera(34,1,.1,60),world=new THREE.Group();scene.add(world);
    scene.add(new THREE.HemisphereLight(0xc7b8e8,0x08050d,.65));
    const key=new THREE.DirectionalLight(0xf0e6ff,2.3);key.position.set(-4,7,8);key.castShadow=true;
    key.shadow.mapSize.setScalar(mobile?512:1024);key.shadow.camera.left=-7;key.shadow.camera.right=7;key.shadow.camera.top=7;key.shadow.camera.bottom=-7;
    key.shadow.normalBias=.025;key.shadow.bias=-.0002;key.shadow.radius=5;scene.add(key);
    const rim=new THREE.DirectionalLight(0xdce8f2,1.2);rim.position.set(6,3,-4);scene.add(rim);
    const fill=new THREE.DirectionalLight(0xd6c2ff,.8);fill.position.set(-6,-1,2);scene.add(fill);
    const sideFill=new THREE.DirectionalLight(0xd2b1f5,.9);sideFill.position.set(6,1,5);scene.add(sideFill);
    const purple=new THREE.PointLight(colors.purple,4,14,2);purple.position.set(0,3,2);world.add(purple);
    const cyan=new THREE.PointLight(0xf4f6ff,6,14,2);cyan.position.set(-3,3,-3);world.add(cyan);
    const floor=new THREE.Mesh(new THREE.PlaneGeometry(40,40),new THREE.MeshStandardMaterial({color:0x100b19,roughness:.32,metalness:.65,envMapIntensity:.3,transparent:true,opacity:.18}));
    floor.rotation.x=-Math.PI/2;floor.position.y=-.30;floor.receiveShadow=true;world.add(floor);
    const shadowTexture=softShadowTexture(),glow=glowTexture();
    const grid=new THREE.GridHelper(24,32,0x254755,0x152636);grid.position.y=-.285;
    (grid.material as THREE.Material).transparent=true;(grid.material as THREE.Material).opacity=.2;world.add(grid);
    const nodes=definition.nodes.map(node=>{
      const source=mobile?node.mobile:node.position;
      const object=createHolographicNode(node,mobile,glow),position=new THREE.Vector3(source[0],.24+source[2]*.28,-source[1]*(mobile?1.15:1.35));
      if(source[1]>1.5)object.labelAnchor.set(0,2.05,0);
      if(index===1&&node.core)object.labelAnchor.x=-object.dimensions.x*.60;
      object.group.position.copy(position);world.add(object.group);
      const shadow=new THREE.Mesh(new THREE.PlaneGeometry(2.8,2.5),new THREE.MeshBasicMaterial({map:shadowTexture,transparent:true,opacity:.55,depthWrite:false}));shadow.rotation.x=-Math.PI/2;shadow.position.set(position.x,-.28,position.z);world.add(shadow);
      return {...object,position};
    });
    const conduitGlass=new THREE.MeshPhysicalMaterial({color:0x67517e,metalness:.35,roughness:.2,transmission:mobile?0:.15,thickness:.1,clearcoat:1,envMapIntensity:1.2,transparent:true,opacity:.20});
    const portMetal=new THREE.MeshStandardMaterial({color:0x84778f,metalness:.95,roughness:.25});
    const edges=definition.edges.map((spec,i)=>{
      const from=nodes[spec.from],to=nodes[spec.to];
      const fromPort=from.position.clone().add(from.portOffset),toPort=to.position.clone().add(to.portOffset);
      const start=attachment(fromPort,from.portDimensions,toPort),end=attachment(toPort,to.portDimensions,fromPort);
      const middle=start.clone().lerp(end,.5);middle.y+=spec.kind==='monitor'?.65:.30;
      const curve=new THREE.QuadraticBezierCurve3(start,middle,end),color=spec.kind==='exception'?nodePalette.exception:nodeColor(definition.nodes[spec.to]);
      const group=new THREE.Group();world.add(group);
      const material=new THREE.MeshStandardMaterial({color,emissive:color,emissiveIntensity:spec.kind==='blocked'?.05:.8,roughness:.3,metalness:.35,transparent:true,opacity:spec.kind==='monitor'?.4:.85});
      const outer=new THREE.Mesh(new THREE.TubeGeometry(curve,40,.026,8,false),conduitGlass);group.add(outer);
      const inner=new THREE.Mesh(new THREE.TubeGeometry(curve,40,.008,5,false),material);group.add(inner);
      const strands=[0,1,2].map(strand=>{
        const path=ribbonCurve(curve,strand,.16),light=energyMaterial(spec.kind==='exception'?nodePalette.exception:nodeColor(definition.nodes[strand===0?spec.from:spec.to]),.72,.65);
        const haloLight=energyMaterial(color,.1,.65);
        const mesh=new THREE.Mesh(new THREE.TubeGeometry(path,48,.022,6,false),light),halo=new THREE.Mesh(new THREE.TubeGeometry(path,48,.065,6,false),haloLight);group.add(mesh,halo);return {mesh,light,path,halo,haloLight};
      });
      const ports=[start,end].flatMap((point,j)=>{
        const port=new THREE.Mesh(new THREE.CylinderGeometry(.09,.09,.16,12),portMetal);port.position.copy(point);port.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),curve.getTangent(j));group.add(port);
        const collar=new THREE.Mesh(new THREE.TorusGeometry(.073,.012,6,18),material);collar.position.copy(point);collar.quaternion.setFromUnitVectors(new THREE.Vector3(0,0,1),curve.getTangent(j));group.add(collar);return [port,collar];
      });
      const pulse=new THREE.Mesh(new THREE.SphereGeometry(.045,12,8),new THREE.MeshBasicMaterial({color}));group.add(pulse);
      const tip=new THREE.Mesh(new THREE.ConeGeometry(.045,.12,6),material);tip.position.copy(curve.getPoint(.72));tip.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),curve.getTangent(.72));group.add(tip);
      const count=mobile?10:18,positions=new Float32Array(count*3);
      const traffic=new THREE.Points(new THREE.BufferGeometry(),new THREE.PointsMaterial({map:glow,color,size:mobile?.09:.11,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,opacity:.85}));
      traffic.geometry.setAttribute('position',new THREE.BufferAttribute(positions,3));group.add(traffic);
      return {spec,curve,outer,inner,material,pulse,ports,group,tip,strands,traffic,order:i};
    });
    const dustPositions=new Float32Array((mobile?160:320)*3),dustColors=new Float32Array(dustPositions.length);
    for(let i=0;i<dustPositions.length/3;i++){
      const seed=Math.sin(i*137.43+index*23.7)*43758.5453,x=(seed-Math.floor(seed))*14-7;
      dustPositions[i*3]=x;dustPositions[i*3+1]=i%3===0?2.5+Math.sin(x*.6+i*.2)*.7:-.15+Math.sin(i*3.2)*.15;dustPositions[i*3+2]=i%3===0?-5-Math.abs(Math.sin(i*71.9))*3:Math.sin(i*71.9)*7;
      const color=new THREE.Color(i%5===0?0xe5ad64:i%2===0?0x6594df:0x68b5c8);dustColors[i*3]=color.r;dustColors[i*3+1]=color.g;dustColors[i*3+2]=color.b;
    }
    const dustGeometry=new THREE.BufferGeometry();dustGeometry.setAttribute('position',new THREE.BufferAttribute(dustPositions,3));dustGeometry.setAttribute('color',new THREE.BufferAttribute(dustColors,3));
    const dust=new THREE.Points(dustGeometry,new THREE.PointsMaterial({map:glow,vertexColors:true,size:.075,transparent:true,opacity:.42,blending:THREE.AdditiveBlending,depthWrite:false}));world.add(dust);

    let raf=0,last=0,time=0,wasActive=false,targetX=0,targetY=0,disposed=false;
    const projected=new THREE.Vector3();
    const requestRender=()=>{if(!disposed&&!raf)raf=requestAnimationFrame(render);};invalidate.current=requestRender;
    function render(now:number){
      raf=0;if(disposed)return;
      const state=runtime.current;if(!state.active||document.hidden){wasActive=false;last=now;return;}
      if(!wasActive){time=state.paused||state.reduced?6:0;last=now;wasActive=true;}
      const delta=Math.min((now-last)/1000,.15);last=now;if(!state.reduced&&!state.paused)time+=delta;
      const stage=state.reduced?6:time;
      const drift=state.reduced?0:Math.sin(stage*.19)*.045;
      world.rotation.y+=(targetX+drift-world.rotation.y)*.06;world.rotation.x+=(targetY+(state.reduced?0:Math.sin(stage*.14)*.015)-world.rotation.x)*.06;
      dust.rotation.y=state.reduced?0:stage*.012;
      nodes.forEach((node,i)=>{
        const spec=definition.nodes[i];let delay=i*.15;if(index===1&&i>=5)delay=2.05+(i-5)*1.4;
        const reveal=state.reduced?1:THREE.MathUtils.smoothstep(stage-delay,0,.65);
        node.group.visible=reveal>.005;node.group.scale.setScalar(.75+reveal*.25);node.group.position.y=node.position.y-(1-reveal)*.35;
        const related=selectedRef.current===null||selectedRef.current===i||definition.edges.some(e=>(e.from===i&&e.to===selectedRef.current)||(e.to===i&&e.from===selectedRef.current));
        const waiting=(index===2&&(i===2||i===4||(i===1&&stage<2.4)))||(index===3&&i===5);
        const visualTime=waiting?0:stage;
        let intensity=spec.core?1.1:.45;if(index===1&&(i===2||i===3)&&stage>.65&&stage<4.85&&(stage-.65)%1.4<.8)intensity=1.5;if(index===2&&((i===0&&stage>.8)||(i===1&&stage>=2.4)))intensity=1.1;
        node.accent.emissiveIntensity=selectedRef.current===i?1.25:related?Math.min(intensity,.85):.12;
        node.hologram.position.y=state.reduced||waiting?0:Math.sin(stage*.85+i*.6)*.045;
        node.rotors.forEach(rotor=>{rotor.object.rotation[rotor.axis]=visualTime*rotor.speed;});
        node.energy.forEach(light=>{light.uniforms.uTime.value=visualTime;light.uniforms.uOpacity.value=light.userData.baseOpacity*(related?1:.22)*(selectedRef.current===i?1.4:1)*(waiting?.35:1);light.uniforms.uFlow.value=state.reduced||waiting?0:1;});
        const orbitPositions=node.particles.geometry.attributes.position as THREE.BufferAttribute;
        for(let p=0;p<orbitPositions.count;p++){
          const angle=visualTime*.52+p/orbitPositions.count*Math.PI*2;
          orbitPositions.setXYZ(p,Math.cos(angle)*node.orbitRadius,.08+Math.sin(angle*2+i)*.045,Math.sin(angle)*node.orbitRadius);
        }
        orbitPositions.needsUpdate=true;(node.particles.material as THREE.PointsMaterial).opacity=related?(waiting?.18:.85):.12;
        const label=labels.current[i];if(label){
          projected.copy(node.labelAnchor);
          if(index===3&&i===4)projected.set(node.dimensions.x*.75,.50,0);
          node.group.localToWorld(projected);projected.project(camera);
          label.style.left=`${(projected.x*.5+.5)*element!.clientWidth}px`;label.style.top=`${(-projected.y*.5+.5)*element!.clientHeight}px`;label.style.opacity=String(reveal);label.style.pointerEvents=reveal>.9?'auto':'none';
          const status=label.querySelector<HTMLElement>('.scene-node-status');if(status&&index===2){if(i===0)status.textContent=stage>.8?'PREREQUISITE COMPLETE':'IN PROGRESS';if(i===1){status.textContent=stage>=2.4?'READY':'WAITING';status.dataset.ready=String(stage>=2.4);}}
        }
      });
      edges.forEach(edge=>{
        const {spec}=edge,selected=selectedRef.current,related=selected===null||spec.from===selected||spec.to===selected;
        edge.material.opacity=related?(spec.kind==='monitor'?.48:.95):.10;
        let reveal=THREE.MathUtils.clamp((stage-.45-edge.order*.12)/.9,0,1);
        if(index===1&&spec.kind==='history')reveal=THREE.MathUtils.clamp((stage-(1.8+Math.max(spec.to-5,0)*1.4))/.7,0,1);
        if(state.reduced)reveal=1;[edge.outer,edge.inner,...edge.strands.flatMap(s=>[s.mesh,s.halo])].forEach(mesh=>mesh.geometry.setDrawRange(0,Math.floor(mesh.geometry.index!.count*reveal/3)*3));edge.ports.forEach(port=>port.visible=reveal>.1);edge.tip.visible=reveal>.8&&spec.kind!=='blocked';
        let phase=(stage*.23+edge.order*.22)%1,visible=spec.kind!=='blocked'&&stage>1&&reveal>.95&&!state.reduced;
        if(index===0){phase=((stage-1.4-edge.order*.16)*.24)%1;visible=stage>1.4+edge.order*.16;}
        if(index===1){
          const execution=(stage-.65)%1.4;phase=THREE.MathUtils.clamp(execution/.65,0,1);
          if(spec.to===4){phase=THREE.MathUtils.clamp((execution-.65)/.4,0,1);visible=stage>1.3&&stage<4.85&&execution>.65&&execution<1.05;}
          else if(spec.kind==='history'){const arrival=2.05+Math.max(spec.to-5,0)*1.4;phase=THREE.MathUtils.clamp((stage-arrival+.4)/.4,0,1);visible=stage>=arrival-.4&&stage<=arrival;}
          else visible=stage>.65&&stage<4.85&&execution<.65;
        }
        if(index===2){phase=THREE.MathUtils.clamp((stage-(spec.start??1))/((spec.end??2.4)-(spec.start??1)),0,1);visible=spec.kind!=='blocked'&&stage>=(spec.start??1)&&stage<(spec.end??2.4);}
        if(index===3&&spec.kind!=='monitor'){
          phase=THREE.MathUtils.clamp((stage-(spec.start??1))/((spec.end??2.1)-(spec.start??1)),0,1);visible=spec.kind!=='blocked'&&stage>=(spec.start??1);if(spec.to===0)phase=Math.min(phase,.97);if(spec.kind==='exception'&&stage>4.4)phase=1;
        }
        edge.pulse.visible=visible&&related&&reveal>.7&&!state.reduced;edge.pulse.position.copy(edge.curve.getPoint(THREE.MathUtils.clamp(phase,0,1)));
        const heldAtGate=index===3&&spec.to===0&&stage>=(spec.end??2.1);
        edge.strands.forEach(strand=>{
          [strand.light,strand.haloLight].forEach(light=>{
            light.uniforms.uTime.value=stage+edge.order*.25;
            light.uniforms.uOpacity.value=spec.kind==='blocked'?.025:light.userData.baseOpacity*(related?1:.12);
            light.uniforms.uFlow.value=visible&&!heldAtGate&&!state.reduced?1:0;
            light.uniforms.uStop.value=index===3&&spec.to===0?.97:1;
          });
        });
        edge.traffic.visible=visible&&related&&reveal>.9&&!state.reduced;
        const trafficPositions=edge.traffic.geometry.attributes.position as THREE.BufferAttribute;
        for(let p=0;p<trafficPositions.count;p++){
          let t=(phase+p/trafficPositions.count)%1;
          if(index===3&&spec.kind!=='monitor')t=THREE.MathUtils.clamp(phase-p/trafficPositions.count*.42,0,.97);
          const point=edge.strands[p%3].path.getPoint(THREE.MathUtils.clamp(t,0,1));trafficPositions.setXYZ(p,point.x,point.y,point.z);
        }
        trafficPositions.needsUpdate=true;
      });
      renderer.render(scene,camera);if(state.active&&!state.paused&&!state.reduced)requestRender();
    }
    const resize=()=>{const w=element.clientWidth,h=element.clientHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.position.set(mobile?1.8:3.3,mobile?8.5:8.5,mobile?11.8:11.3);camera.lookAt(.25,.6,0);camera.updateProjectionMatrix();requestRender();};
    const observer=new ResizeObserver(resize);observer.observe(element);resize();
    const raycaster=new THREE.Raycaster(),pointerPosition=new THREE.Vector2();
    const pick=(event:PointerEvent)=>{
      const rect=element.getBoundingClientRect();pointerPosition.set((event.clientX-rect.left)/rect.width*2-1,-(event.clientY-rect.top)/rect.height*2+1);
      raycaster.setFromCamera(pointerPosition,camera);const hits=raycaster.intersectObjects(nodes.map(n=>n.group),true);
      if(!hits.length)return null;let object:THREE.Object3D|null=hits[0].object;
      while(object&&object.parent!==world)object=object.parent;
      const found=nodes.findIndex(n=>n.group===object);return found<0?null:found;
    };
    const pointer=(event:PointerEvent)=>{
      if(!(event.target as HTMLElement).closest('button,.scene-inspector')&&event.pointerType!=='touch'){
        const node=pick(event);if(node!==selectedRef.current)setSelected(node);element.style.cursor=node===null?'default':'pointer';
      }
      if(runtime.current.reduced||runtime.current.paused)return;const rect=element.getBoundingClientRect();targetX=((event.clientX-rect.left)/rect.width-.5)*.09;targetY=((event.clientY-rect.top)/rect.height-.5)*.055;requestRender();
    };
    let downX=0,downY=0;
    const pointerDown=(event:PointerEvent)=>{downX=event.clientX;downY=event.clientY;};
    const pointerUp=(event:PointerEvent)=>{if(Math.hypot(event.clientX-downX,event.clientY-downY)<12&&!(event.target as HTMLElement).closest('button,.scene-inspector')){const node=pick(event);if(node!==null)setSelected(node);}};
    const leave=()=>{targetX=0;targetY=0;if(!element.contains(document.activeElement))setSelected(null);requestRender();},lost=(event:Event)=>{event.preventDefault();setFallback(true);cancelAnimationFrame(raf);raf=0;disposed=true;};
    element.addEventListener('pointermove',pointer,{passive:true});element.addEventListener('pointerleave',leave);element.addEventListener('pointerdown',pointerDown,{passive:true});element.addEventListener('pointerup',pointerUp,{passive:true});renderer.domElement.addEventListener('webglcontextlost',lost);
    return()=>{disposed=true;cancelAnimationFrame(raf);observer.disconnect();invalidate.current=()=>{};element.removeEventListener('pointermove',pointer);element.removeEventListener('pointerleave',leave);element.removeEventListener('pointerdown',pointerDown);element.removeEventListener('pointerup',pointerUp);renderer.domElement.removeEventListener('webglcontextlost',lost);scene.traverse(object=>{const mesh=object as THREE.Mesh;mesh.geometry?.dispose();if(mesh.material)(Array.isArray(mesh.material)?mesh.material:[mesh.material]).forEach(m=>m.dispose());});nodes.forEach(node=>node.textures.forEach(texture=>texture.dispose()));glow.dispose();shadowTexture.dispose();environment.dispose();renderer.dispose();renderer.domElement.remove();};
  },[index,definition,compact]);
  useEffect(()=>{invalidate.current();},[active,paused,reduced,selected]);
  const explanation=selected===null?null:definition.nodes[selected];
  const connected=selected===null?[]:definition.edges.filter(e=>e.from===selected||e.to===selected).map(e=>definition.nodes[e.from===selected?e.to:e.from].name);
  return <div className={`graph-scene cinematic-scene ${fallback?'static-workflow':''}`} ref={host} aria-label={`Interactive ${definition.title.toLowerCase()}`}>
    {index===2&&<div className="scene-lane-key"><span><i/>HUMAN OWNERS</span><span><i/>ENGINE AGENTS</span></div>}
    {index===1&&<div className="scene-history-key">ONE REUSABLE AGENT <span>·</span> SEPARATE EXECUTION HISTORY</div>}
    {fallback&&<svg className="static-connections" viewBox="0 0 700 480" aria-hidden="true">{definition.edges.map((edge,i)=>{const point=(n:number)=>[90+(n%3)*250,85+Math.floor(n/3)*155];const[x1,y1]=point(edge.from),[x2,y2]=point(edge.to);return <path key={i} d={`M${x1} ${y1} C${x1} ${y2},${x2} ${y1},${x2} ${y2}`} fill="none" stroke={nodeColorHex(definition.nodes[edge.to])} strokeWidth="2" opacity={edge.kind==='blocked'?.25:.65}/>;})}</svg>}
    {definition.nodes.map((node,i)=><button key={`${index}-${i}`} ref={element=>{labels.current[i]=element;}} className={`scene-node-label ${node.core?'scene-core':''} ${node.amber?'scene-amber':''} ${selected===i?'scene-selected':''} ${node.symbol==='run'?'scene-run':''}`} style={{'--node-accent':nodeColorHex(node),...(fallback?{left:`${13+(i%3)*36}%`,top:`${18+Math.floor(i/3)*32}%`,opacity:1,pointerEvents:'auto'}:{})} as CSSProperties} aria-label={`${node.name}. ${node.explanation}`} tabIndex={active?0:-1} onPointerEnter={event=>{if(event.pointerType!=='touch')setSelected(i);}} onPointerLeave={event=>{if(event.pointerType!=='touch'&&document.activeElement!==event.currentTarget)setSelected(null);}} onFocus={()=>setSelected(i)} onBlur={()=>setSelected(null)} onClick={()=>setSelected(i)}>
      {fallback&&<span className="static-node-block" aria-hidden="true"><span/></span>}<strong>{node.name}</strong><span className="scene-node-status">{node.status}</span>
    </button>)}
    <div className={`scene-inspector ${explanation?'is-visible':''}`} aria-live="polite">{explanation&&<><div><span className="mini-dot"/><strong>{explanation.name}</strong><button onClick={()=>setSelected(null)} aria-label="Close node explanation">×</button></div><p>{explanation.explanation}</p><span className="scene-connected">CONNECTED TO · {connected.join(' / ')}</span></>}</div>
  </div>;
}


