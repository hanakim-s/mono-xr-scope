import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js';

function makeProduct(scene){
  const product=new THREE.Group();scene.add(product);
  const ivory=new THREE.MeshPhysicalMaterial({color:0xeee9df,roughness:.3,metalness:.07,clearcoat:.5,clearcoatRoughness:.28});
  const black=new THREE.MeshPhysicalMaterial({color:0x111214,roughness:.2,metalness:.48,clearcoat:.62});
  const metal=new THREE.MeshPhysicalMaterial({color:0xb58e69,roughness:.23,metalness:.94});
  const dark=new THREE.MeshPhysicalMaterial({color:0x25262a,roughness:.24,metalness:.82});
  const glass=new THREE.MeshPhysicalMaterial({color:0x56317b,roughness:.025,transmission:.58,transparent:true,opacity:.93,clearcoat:1,ior:1.55,thickness:.9,emissive:0x170923,emissiveIntensity:.55});
  const cyl=(r,len,mat,z,segments=72)=>{const m=new THREE.Mesh(new THREE.CylinderGeometry(r,r,len,segments,1,false),mat);m.rotation.x=Math.PI/2;m.position.z=z;product.add(m);return m};
  cyl(1.05,2.75,ivory,-.9);cyl(1.12,.55,black,.77);cyl(1.18,.58,metal,1.22);cyl(1.2,.1,dark,1.56);cyl(1.13,1.28,ivory,2.18);cyl(1.2,.34,black,2.98);cyl(1.1,.08,metal,3.19);cyl(.91,.045,glass,3.25,96);cyl(.57,.028,glass,3.29,96);cyl(.93,.23,black,-2.42);
  for(let i=0;i<30;i++){const a=i/30*Math.PI*2,g=new THREE.Mesh(new THREE.BoxGeometry(.032,.032,.6),dark);g.position.set(Math.cos(a)*1.19,Math.sin(a)*1.19,1.22);g.rotation.z=a;product.add(g)}
  const lug=new THREE.Mesh(new THREE.TorusGeometry(.18,.055,12,32,Math.PI*1.55),metal);lug.position.set(-1.02,-.45,-1.65);lug.rotation.set(Math.PI/2,0,.35);product.add(lug);return product;
}
function lights(scene){const key=new THREE.DirectionalLight(0xfff3df,5.4);key.position.set(-3,5,6);scene.add(key);const rim=new THREE.DirectionalLight(0xa7bfff,3.1);rim.position.set(4,1,-5);scene.add(rim);scene.add(new THREE.HemisphereLight(0xffffff,0x75695e,2.3))}
function setup(canvas,host,{hero=false}={}){
  if(!canvas||!host)return;
  const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setClearColor(0x000000,0);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.18;
  const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(hero?28:32,1,.1,100),product=makeProduct(scene);lights(scene);product.scale.setScalar(hero?.86:.78);product.rotation.set(-.12,1.15,-.05);camera.position.set(0,.12,hero?14.8:14.2);
  let targetX=-.12,targetY=1.15,zoom=hero?14.8:14.2,drag=false,px=0,py=0;
  const resize=()=>{const w=host.clientWidth,h=host.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()};new ResizeObserver(resize).observe(host);resize();
  if(hero){const update=p=>{targetY=1.2-p*1.18;targetX=-.14+p*.18;product.rotation.z=-.06+p*.06;zoom=14.8-p*3.4;product.scale.setScalar(.86+p*.12)};addEventListener('hero-scroll',e=>update(e.detail));update(Math.min(1,scrollY/(innerHeight*.78)))}
  else{const emit=()=>host.dispatchEvent(new CustomEvent('mono-angle',{detail:((targetY*180/Math.PI)%360+360)%360}));canvas.addEventListener('pointerdown',e=>{drag=true;px=e.clientX;py=e.clientY;canvas.setPointerCapture(e.pointerId)});canvas.addEventListener('pointermove',e=>{if(!drag)return;targetY+=(e.clientX-px)*.012;targetX=Math.max(-1.1,Math.min(1.1,targetX+(e.clientY-py)*.009));px=e.clientX;py=e.clientY;emit()});canvas.addEventListener('pointerup',()=>drag=false);canvas.addEventListener('pointercancel',()=>drag=false);host.addEventListener('wheel',e=>{e.preventDefault();zoom=Math.max(9.5,Math.min(17,zoom+e.deltaY*.009))},{passive:false});host.addEventListener('keydown',e=>{if(e.key==='ArrowRight')targetY+=.18;if(e.key==='ArrowLeft')targetY-=.18;if(e.key==='ArrowUp')targetX-=.12;if(e.key==='ArrowDown')targetX+=.12;emit()});emit()}
  const loop=()=>{product.rotation.y+=(targetY-product.rotation.y)*.075;product.rotation.x+=(targetX-product.rotation.x)*.075;camera.position.z+=(zoom-camera.position.z)*.075;product.position.y=Math.sin(performance.now()*.00065)*.04;renderer.render(scene,camera);requestAnimationFrame(loop)};loop();
}
setup(document.getElementById('mono3d'),document.getElementById('rotateView'));

