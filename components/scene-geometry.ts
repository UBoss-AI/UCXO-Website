import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';


export const colors = { purple: 0x8b3dff, violet: 0xb35cff, lavender: 0xe3d1ff, amber: 0xe4ad63 };
export function roundedBox(w:number,h:number,d:number,r=.1){return new RoundedBoxGeometry(w,h,d,3,Math.min(r,d/3));}

// Procedural studio softboxes supply real reflections without external assets.
export function createStudioEnvironment(renderer:THREE.WebGLRenderer){
  const studio=new THREE.Scene();studio.background=new THREE.Color(0x302734);
  const panels:THREE.Mesh[]=[];
  const panel=(color:number,intensity:number,w:number,h:number,x:number,y:number,z:number)=>{
    const mesh=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({color:new THREE.Color(color).multiplyScalar(intensity),side:THREE.DoubleSide}));
    mesh.position.set(x,y,z);mesh.lookAt(0,0,0);studio.add(mesh);panels.push(mesh);
  };
  panel(0xfff5ff,5,9,3,-4,6,5);panel(0xb35cff,3,3,10,6,2,-2);panel(0xded6ff,2,2,7,-6,0,0);panel(0x8b3dff,2,8,2,0,-4,3);
  const generator=new THREE.PMREMGenerator(renderer);const target=generator.fromScene(studio,.04);
  panels.forEach(mesh=>{mesh.geometry.dispose();(mesh.material as THREE.Material).dispose();});generator.dispose();return target;
}

// Intersect each rail with the bounding surface, so its ferrule attaches to a physical node.
export function attachment(position:THREE.Vector3,dimensions:THREE.Vector3,toward:THREE.Vector3){const dir=toward.clone().sub(position);const f=Math.max(Math.abs(dir.x)/(dimensions.x*.53),Math.abs(dir.y)/(dimensions.y*.52),Math.abs(dir.z)/(dimensions.z*.54));return position.clone().add(dir.multiplyScalar(1/f));}
export function softShadowTexture(){const canvas=document.createElement('canvas');canvas.width=canvas.height=128;const ctx=canvas.getContext('2d')!;const g=ctx.createRadialGradient(64,64,3,64,64,64);g.addColorStop(0,'rgba(0,0,0,.85)');g.addColorStop(.35,'rgba(0,0,0,.4)');g.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=g;ctx.fillRect(0,0,128,128);return new THREE.CanvasTexture(canvas);}



