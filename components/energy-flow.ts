import * as THREE from 'three';

/** Moving light bands along actual 3D tubes, inspired by the reference's energy ribbons. */
export function energyMaterial(color: number, opacity = .7, speed = .6) {
  const material=new THREE.ShaderMaterial({
    uniforms: { uTime: {value:0}, uColor: {value:new THREE.Color(color)}, uOpacity:{value:opacity}, uSpeed:{value:speed}, uFlow:{value:1}, uStop:{value:1} },
    vertexShader: 'varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',
    fragmentShader: `
      varying vec2 vUv; uniform float uTime; uniform vec3 uColor;
      uniform float uOpacity; uniform float uSpeed; uniform float uFlow; uniform float uStop;
      void main(){
        float phase=fract(vUv.x*2.0-uTime*uSpeed);
        float head=pow(1.0-phase,6.0)*uFlow;
        float core=pow(abs(sin(vUv.y*3.14159265)),.5);
        float stop=1.0-smoothstep(uStop-.025,uStop,vUv.x);
        float alpha=(.22+head*.90)*core*uOpacity*stop;
        gl_FragColor=vec4(uColor*(1.0+head*2.5),alpha);
      }`,
    transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide,toneMapped:false,
  });
  material.userData.baseOpacity=opacity;
  return material;
}

export function glowTexture(){
  const canvas=document.createElement('canvas');canvas.width=canvas.height=64;
  const context=canvas.getContext('2d')!;
  const gradient=context.createRadialGradient(32,32,0,32,32,32);
  gradient.addColorStop(0,'rgba(255,255,255,1)');gradient.addColorStop(.12,'rgba(255,255,255,.95)');gradient.addColorStop(.35,'rgba(255,255,255,.25)');gradient.addColorStop(1,'rgba(255,255,255,0)');
  context.fillStyle=gradient;context.fillRect(0,0,64,64);return new THREE.CanvasTexture(canvas);
}

/** Three intertwined strands retain the direction and endpoints of a meaningful connection. */
export function ribbonCurve(curve:THREE.Curve<THREE.Vector3>,strand:number,radius=.055){
  const points:THREE.Vector3[]=[];
  for(let i=0;i<=48;i++){
    const t=i/48,point=curve.getPoint(t),envelope=Math.sin(Math.PI*t);
    const angle=t*Math.PI*4+strand*Math.PI*2/3;
    point.y+=Math.sin(angle)*radius*envelope;
    point.z+=Math.cos(angle)*radius*envelope;
    points.push(point);
  }
  return new THREE.CatmullRomCurve3(points);
}
