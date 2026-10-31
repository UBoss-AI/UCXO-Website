import * as THREE from 'three';
import { roundedBox } from './scene-geometry';
import {nodeColor,nodeColorHex} from './node-palette';
import { energyMaterial } from './energy-flow';
import type { WorkflowNode } from './scene-data';

export type HolographicNode={
  group:THREE.Group;accent:THREE.MeshStandardMaterial;dimensions:THREE.Vector3;
  portDimensions:THREE.Vector3;portOffset:THREE.Vector3;labelAnchor:THREE.Vector3;
  hologram:THREE.Group;rotors:{object:THREE.Object3D;axis:'x'|'y'|'z';speed:number}[];
  energy:THREE.ShaderMaterial[];particles:THREE.Points;orbitRadius:number;textures:THREE.Texture[];setColor:(color:number)=>void;
};

function createInterface(node:WorkflowNode){
  const canvas=document.createElement('canvas');canvas.width=640;canvas.height=300;
  const ctx=canvas.getContext('2d')!;
  ctx.fillStyle='rgba(5,15,28,.88)';ctx.fillRect(0,0,640,300);
  ctx.strokeStyle=nodeColorHex(node);ctx.lineWidth=2;ctx.strokeRect(2,2,636,296);
  ctx.fillStyle='#b4a6ed';ctx.font='18px Arial';ctx.fillText('UCXO / ILLUSTRATIVE',26,36);
  ctx.fillStyle='#d4fbff';ctx.font='bold 30px Arial';ctx.fillText(node.name.toUpperCase(),26,87);
  ctx.fillStyle='#84cdda';ctx.font='18px Arial';ctx.fillText(node.status,26,122);
  const rows=[['WORKFLOW','CONNECTED STAGES'],['OWNERSHIP','PEOPLE + ENGINE AGENTS'],['HUMAN REVIEW',node.symbol==='approval'?'REQUIRED / AWAITING':'PRESERVED WHERE REQUIRED']];
  rows.forEach(([label,value],i)=>{const y=168+i*44;ctx.fillStyle='#a1c2cf';ctx.font='16px Arial';ctx.fillText(label,26,y);ctx.strokeStyle='#274553';ctx.beginPath();ctx.moveTo(220,y+12);ctx.lineTo(612,y+12);ctx.stroke();ctx.fillStyle=nodeColorHex(node);ctx.font='15px Arial';ctx.fillText(value,225,y);});
  const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;return texture;
}

function gearGeometry(radius:number){
  const shape=new THREE.Shape();const teeth=12;
  for(let i=0;i<=teeth*4;i++){
    const angle=i/(teeth*4)*Math.PI*2,r=i%4<2?radius:radius*.79;
    if(i===0)shape.moveTo(Math.cos(angle)*r,Math.sin(angle)*r);else shape.lineTo(Math.cos(angle)*r,Math.sin(angle)*r);
  }
  const hole=new THREE.Path();hole.absarc(0,0,radius*.36,0,Math.PI*2,true);shape.holes.push(hole);
  return new THREE.ExtrudeGeometry(shape,{depth:.075,bevelEnabled:true,bevelSegments:2,steps:1,bevelSize:.012,bevelThickness:.012});
}

export function createHolographicNode(node:WorkflowNode,mobile:boolean,glow:THREE.Texture):HolographicNode{
  const group=new THREE.Group(),hologram=new THREE.Group();group.add(hologram);
  const size=(node.size??(node.core?1.65:1.12))*(mobile?.88:1);
  const color=nodeColor(node),cool=color;
  const metal=new THREE.MeshPhysicalMaterial({color:0x151a2b,metalness:.85,roughness:.25,clearcoat:1,envMapIntensity:.9});
  const glass=new THREE.MeshPhysicalMaterial({color,emissive:color,emissiveIntensity:.12,metalness:.08,roughness:.18,transmission:mobile?.1:.22,thickness:.2,ior:1.3,transparent:true,opacity:.55,depthWrite:false,clearcoat:1});
  const accent=new THREE.MeshStandardMaterial({color,emissive:cool,emissiveIntensity:.55,metalness:.25,roughness:.3,transparent:true,opacity:.9});
  const violet=new THREE.MeshStandardMaterial({color,emissive:color,emissiveIntensity:.8,metalness:.3,roughness:.2});
  const thin=new THREE.LineBasicMaterial({color:cool,transparent:true,opacity:.52});
  const rotors:HolographicNode['rotors']=[],energy:THREE.ShaderMaterial[]=[],textures:THREE.Texture[]=[];
  const add=(parent:THREE.Group,geometry:THREE.BufferGeometry,material:THREE.Material,x=0,y=0,z=0,shadow=false)=>{
    const mesh=new THREE.Mesh(geometry,material);mesh.position.set(x,y,z);mesh.castShadow=shadow;mesh.receiveShadow=shadow;parent.add(mesh);return mesh;
  };
  const line=(parent:THREE.Group,points:THREE.Vector3[],material:THREE.Material=accent,radius=.012)=>add(parent,new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),Math.max(8,points.length*4),radius,5,false),material);
  const ring=(parent:THREE.Group,radius:number,y:number,material:THREE.Material,thickness=.012)=>{const mesh=add(parent,new THREE.TorusGeometry(radius,thickness,6,72),material,0,y,0);mesh.rotation.x=Math.PI/2;return mesh;};

  // Horizontal, layered plinths replace the old upright cards.
  add(group,roundedBox(size,.19,size*.87,.065),metal,0,.08,0,true);
  add(group,roundedBox(size*.93,.07,size*.81,.025),metal,0,.205,0);
  add(group,roundedBox(size*.98,.08,size*.85,.025),metal,0,.28,0);
  [-1,1].forEach(side=>{
    for(let p=0;p<4;p++)add(group,roundedBox(.055,.035,.035,.008),accent,side*size*.47,.10,(p-1.5)*size*.16);
    add(group,roundedBox(size*.7,.012,.02,.004),accent,0,.31,side*size*.35);
    add(group,roundedBox(.018,.018,size*.66,.004),violet,side*size*.43,.25,0);
  });
  const radius=size*.59+.1;
  const orbit=new THREE.Group();group.add(orbit);
  const orbitMaterial=energyMaterial(cool,.75,.5),outerMaterial=energyMaterial(color,.62,-.33);energy.push(orbitMaterial,outerMaterial);
  ring(orbit,radius,.04,orbitMaterial,.016);ring(orbit,radius*1.13,.065,outerMaterial,.008);
  const arc=add(orbit,new THREE.TorusGeometry(radius*.91,.016,6,60,Math.PI*1.4),accent,0,.08,0);arc.rotation.x=Math.PI/2;
  rotors.push({object:orbit,axis:'y',speed:.24});
  const positions=new Float32Array((mobile?8:13)*3);
  const particles=new THREE.Points(new THREE.BufferGeometry(),new THREE.PointsMaterial({map:glow,color:cool,size:mobile?.105:.12,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,opacity:.85}));
  particles.geometry.setAttribute('position',new THREE.BufferAttribute(positions,3));group.add(particles);
  const aura=new THREE.Sprite(new THREE.SpriteMaterial({map:glow,color,transparent:true,opacity:node.core?.14:.07,blending:THREE.AdditiveBlending,depthWrite:false}));aura.position.y=.6;aura.scale.set(size*2.2,size*2.2,1);group.add(aura);

  // A transparent projection volume, animated light column, and real objects within it.
  const height=node.symbol==='run'?.65:node.core?1.36:.95;
  const chamber=roundedBox(size*.73,height,size*.62,.04);
  if(node.symbol!=='evidence'&&node.symbol!=='human'){
    const shell=add(hologram,chamber,glass.clone(),0,.37+height*.5,0);(shell.material as THREE.MeshPhysicalMaterial).opacity=.13;
    const edges=new THREE.LineSegments(new THREE.EdgesGeometry(chamber,35),thin);edges.position.copy(shell.position);hologram.add(edges);
  }else chamber.dispose();
  const beamMaterial=energyMaterial(cool,.13,.25);energy.push(beamMaterial);
  const beam=add(hologram,new THREE.CylinderGeometry(size*.14,size*.34,height,20,1,true),beamMaterial,0,.34+height*.5,0);rotors.push({object:beam,axis:'y',speed:.18});
  const symbolScale=node.core?1.15:.88;
  const model=new THREE.Group();model.position.y=.34;model.scale.setScalar(symbolScale);hologram.add(model);

  switch(node.symbol){
    case 'agent':
    case 'tools':{
      const gears=[{r:.23,x:-.19,y:.58,z:.12,s:1},{r:.19,x:.20,y:.88,z:-.02,s:-1.2},{r:.12,x:-.17,y:1.05,z:-.06,s:1.5}];
      const holographicGlass=new THREE.MeshBasicMaterial({color:cool,transparent:true,opacity:.62,depthWrite:false,side:THREE.DoubleSide});
      gears.forEach(g=>{const mesh=add(model,gearGeometry(g.r),holographicGlass,g.x,g.y,g.z);mesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(mesh.geometry,20),thin));rotors.push({object:mesh,axis:'z',speed:g.s*.28});});
      add(model,roundedBox(.62,.08,.42,.02),glass,0,.21,0);
      for(let i=0;i<3;i++)add(model,roundedBox(.43,.035,.31,.012),i%2?accent:violet,0,.28+i*.065,0);
      break;
    }
    case 'objective':{
      add(model,new THREE.SphereGeometry(.20,24,16),accent,0,.67,0);
      const gyroscope=new THREE.Group();gyroscope.position.y=.67;model.add(gyroscope);
      [0,1,2].forEach(i=>{const orbitRing=add(gyroscope,new THREE.TorusGeometry(.33+i*.065,.009,5,48),i===1?violet:accent);orbitRing.rotation.set(i*.9,.4+i*.7,i*.4);});
      rotors.push({object:gyroscope,axis:'y',speed:.35});
      [-.28,0,.28].forEach((x,i)=>add(model,roundedBox(.13,.2+i*.07,.13,.02),glass,x,.18+i*.035,.12));break;
    }
    case 'human':
      add(model,new THREE.SphereGeometry(.12,20,12),accent,0,.90,0);
      add(model,new THREE.CapsuleGeometry(.12,.25,4,10),glass,0,.56,0);
      line(model,[new THREE.Vector3(-.30,.37,0),new THREE.Vector3(-.21,.60,0),new THREE.Vector3(0,.66,0),new THREE.Vector3(.21,.60,0),new THREE.Vector3(.30,.37,0)]);
      ring(model,.31,.20,accent,.01);break;
    case 'approval':{
      const arch=add(model,new THREE.TorusGeometry(.23,.037,8,32,Math.PI),accent,0,.87,0);arch.rotation.z=0;
      add(model,roundedBox(.58,.44,.18,.06),glass,0,.53,.02);
      const outline=new THREE.LineSegments(new THREE.EdgesGeometry(roundedBox(.58,.44,.18,.06)),thin);outline.position.set(0,.53,.02);model.add(outline);
      add(model,new THREE.CylinderGeometry(.024,.024,.13,10),accent,0,.54,.13);
      [-1,1].forEach(side=>add(model,roundedBox(.065,1,.065,.015),violet,side*.40,.51,0));add(model,roundedBox(.86,.065,.065,.015),violet,0,1.04,0);break;
    }
    case 'evidence':
      for(let layer=0;layer<3;layer++){
        const panel=add(model,roundedBox(.68,.055,.47,.02),glass,(layer-1)*.08,.23+layer*.21,(layer-1)*-.06);panel.rotation.y=(layer-1)*.12;
        for(let row=0;row<3;row++)add(model,roundedBox(.40,.009,.018,.003),accent,(layer-1)*.08,.265+layer*.21,-.12+row*.11-(layer-1)*.06);
      }break;
    case 'monitor':{
      add(model,new THREE.SphereGeometry(.16,20,14),accent,0,.65,0);
      const radar=new THREE.Group();radar.position.y=.65;model.add(radar);
      [0,1,2].forEach(i=>{const r=add(radar,new THREE.TorusGeometry(.27+i*.05,.009,5,48),i===1?violet:accent);r.rotation.set(i*.9,i*.5,i*.6);});rotors.push({object:radar,axis:'y',speed:.3});break;
    }
    case 'skills':{
      const crystal=add(model,new THREE.OctahedronGeometry(.28),glass,0,.65,0);
      const outline=new THREE.LineSegments(new THREE.EdgesGeometry(crystal.geometry),thin);outline.position.copy(crystal.position);model.add(outline);rotors.push({object:crystal,axis:'y',speed:.4});ring(model,.30,.27,accent);break;
    }
    case 'dependency':{
      const a=add(model,new THREE.TorusGeometry(.19,.025,7,40),accent,-.12,.60,0),b=add(model,new THREE.TorusGeometry(.19,.025,7,40),violet,.12,.60,0);a.rotation.y=.25;b.rotation.y=-.25;break;
    }
    case 'exception':
      add(model,roundedBox(.055,.40,.055,.012),accent,0,.75,0);add(model,new THREE.SphereGeometry(.04,10,8),accent,0,.43,0);ring(model,.29,.20,violet);break;
    case 'result':
      add(model,new THREE.CylinderGeometry(.025,.025,.50,10),accent,0,.62,0);add(model,new THREE.ConeGeometry(.13,.22,5),accent,0,.98,0);
      for(let i=0;i<3;i++)add(model,roundedBox(.09,.15+i*.10,.09,.012),glass,-.22+i*.22,.20+i*.05,.14);break;
    default:
      for(let i=0;i<3;i++)add(model,roundedBox(.45,.09,.38,.02),i%2?glass:accent,0,.22+i*.16,0);
  }

  if(node.core){
    const texture=createInterface(node);textures.push(texture);
    const hud=add(group,new THREE.PlaneGeometry(size*.84,size*.40),new THREE.MeshBasicMaterial({map:texture,transparent:true,opacity:.82,side:THREE.DoubleSide,depthWrite:false}),-.65,1.68,-size*.48);
    hud.material.userData.preserveColor=true;hud.rotation.y=-.18;hud.rotation.x=-.10;
  }
  const tinted=new Set<THREE.Material>();
  group.traverse(object=>{const material=(object as THREE.Mesh).material;if(material)(Array.isArray(material)?material:[material]).forEach(m=>{if(m!==metal&&!m.userData.preserveColor)tinted.add(m);});});
  let currentColor=color;
  const setColor=(value:number)=>{if(value===currentColor)return;currentColor=value;for(const material of tinted){if(material instanceof THREE.ShaderMaterial){material.uniforms.uColor?.value.setHex(value);}else{const colored=material as THREE.Material&{color?:THREE.Color;emissive?:THREE.Color};colored.color?.setHex(value);colored.emissive?.setHex(value);}}};
  return {group,accent,dimensions:new THREE.Vector3(size,1.9,size),portDimensions:new THREE.Vector3(size,.17,size*.87),portOffset:new THREE.Vector3(0,.12,0),labelAnchor:new THREE.Vector3(0,-.06,size*.67),hologram,rotors,energy,particles,orbitRadius:radius,textures,setColor};
}
