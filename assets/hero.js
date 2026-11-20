// Hero: isometric cutaway of The Collection Studios.
// Upper floor La Maison, ground floor La Galerie (left) + L'Hôtel (right).
// Hover lifts a room with an orange outline, click scrolls to its card.
// Placeholder until a baked GLB from Spline/Blender replaces buildScene().
import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';

const el=document.getElementById('scene'),lbl=document.getElementById('lbl');
const small=innerWidth<900;
const R=new THREE.WebGLRenderer({antialias:true,alpha:true});
R.setPixelRatio(Math.min(devicePixelRatio,2));
R.shadowMap.enabled=true;R.shadowMap.type=THREE.PCFSoftShadowMap;
R.toneMapping=THREE.ACESFilmicToneMapping;R.toneMappingExposure=1.05;R.outputColorSpace=THREE.SRGBColorSpace;
el.appendChild(R.domElement);
const S=new THREE.Scene();
S.environment=new THREE.PMREMGenerator(R).fromScene(new RoomEnvironment(),.04).texture;
const cam=new THREE.OrthographicCamera(-1,1,1,-1,.1,100);
const base=new THREE.Vector3(14,12,14),look=new THREE.Vector3(0,2.3,.6);

/* ---------- helpers ---------- */
let seed=11;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;
function tex(w,h,draw,rep=[1,1]){const c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'),w,h);
 const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(...rep);t.anisotropy=8;return t}
const mat=(c,o={})=>new THREE.MeshStandardMaterial({color:c,roughness:o.r??.8,metalness:o.m??0,map:o.map||null,emissive:o.e??0,emissiveIntensity:o.ei??1,envMapIntensity:o.env??.55});
function add(geo,m,x,y,z,p,cast=true){const o=new THREE.Mesh(geo,m);o.position.set(x,y,z);o.castShadow=cast;o.receiveShadow=true;p.add(o);return o}
const B=(w,h,d,m,x,y,z,p,cast)=>add(new THREE.BoxGeometry(w,h,d),m,x,y+h/2,z,p,cast);
const RB=(w,h,d,m,x,y,z,p,r=.05)=>add(new RoundedBoxGeometry(w,h,d,3,Math.max(.001,Math.min(r,w/2-.002,h/2-.002,d/2-.002))),m,x,y+h/2,z,p);
const CY=(rt,rb,h,m,x,y,z,p,seg=28)=>add(new THREE.CylinderGeometry(rt,rb,h,seg),m,x,y+h/2,z,p);
const SP=(r,m,x,y,z,p)=>add(new THREE.SphereGeometry(r,24,16),m,x,y,z,p);
const grp=(x,y,z,p,ry=0)=>{const g=new THREE.Group();g.position.set(x,y,z);g.rotation.y=ry;p.add(g);return g};

/* ---------- textures ---------- */
const planks=(cols,rep)=>tex(512,512,(x,w,h)=>{const pw=64;for(let i=0;i<w/pw;i++){let y=-rnd()*240;while(y<h){const len=170+rnd()*230;
 x.fillStyle=cols[Math.floor(rnd()*cols.length)];x.fillRect(i*pw,y,pw,len);x.strokeStyle='rgba(0,0,0,.07)';x.lineWidth=1.5;
 for(let g=0;g<5;g++){x.beginPath();const gx=i*pw+6+rnd()*52;x.moveTo(gx,y);x.bezierCurveTo(gx+6,y+len*.3,gx-6,y+len*.6,gx+2,y+len);x.stroke()}
 x.fillStyle='rgba(0,0,0,.28)';x.fillRect(i*pw,y,pw,2);y+=len}x.fillStyle='rgba(0,0,0,.3)';x.fillRect(i*pw,0,2,h)}},rep);
const noise=(col,amt,rep)=>tex(256,256,(x,w,h)=>{x.fillStyle=col;x.fillRect(0,0,w,h);for(let i=0;i<5000;i++){x.fillStyle=`rgba(${rnd()<.5?'0,0,0':'255,255,255'},${rnd()*amt})`;x.fillRect(rnd()*w,rnd()*h,2,2)}},rep);
const tiles=(col,rep)=>tex(256,256,(x,w,h)=>{x.fillStyle=col;x.fillRect(0,0,w,h);for(let i=0;i<3000;i++){x.fillStyle=`rgba(0,0,0,${rnd()*.05})`;x.fillRect(rnd()*w,rnd()*h,3,3)}
 x.strokeStyle='rgba(90,70,50,.25)';x.lineWidth=2;for(let i=0;i<=4;i++){x.beginPath();x.moveTo(i*64,0);x.lineTo(i*64,h);x.stroke();x.beginPath();x.moveTo(0,i*64);x.lineTo(w,i*64);x.stroke()}},rep);
const marbleT=tex(512,512,(x,w,h)=>{x.fillStyle='#efebe5';x.fillRect(0,0,w,h);for(let v=0;v<14;v++){x.strokeStyle=`rgba(120,115,110,${.15+rnd()*.3})`;x.lineWidth=.6+rnd()*2.2;
 x.beginPath();let px=rnd()*w,py=0;x.moveTo(px,py);while(py<h){px+=(rnd()-.45)*40;py+=20+rnd()*30;x.lineTo(px,py)}x.stroke()}});
const tatamiT=tex(256,512,(x,w,h)=>{x.fillStyle='#c8bd84';x.fillRect(0,0,w,h);for(let i=0;i<h;i+=4){x.fillStyle=`rgba(90,80,30,${.08+rnd()*.1})`;x.fillRect(0,i,w,1.5)}
 x.fillStyle='#2e3b2c';x.fillRect(0,0,16,h);x.fillRect(w-16,0,16,h)});
const shojiT=tex(256,256,(x,w,h)=>{x.fillStyle='#fff6e2';x.fillRect(0,0,w,h);x.fillStyle='#6b4a2d';for(let i=0;i<=4;i++){x.fillRect(i*62,0,8,h)}for(let j=0;j<=5;j++){x.fillRect(0,j*50,w,6)}});
const rugT=tex(512,512,(x,w,h)=>{const c=w/2;[['#e9dfcf',256],['#c96f3b',236],['#e9dfcf',224],['#d8c9b1',150],['#c96f3b',138],['#e9dfcf',130]].forEach(([col,r])=>{x.fillStyle=col;x.beginPath();x.arc(c,c,r,0,7);x.fill()});
 for(let i=0;i<4000;i++){x.fillStyle=`rgba(0,0,0,${rnd()*.05})`;x.fillRect(rnd()*w,rnd()*h,2,2)}});
const paint=(bg,shapes)=>tex(256,256,(x,w,h)=>{x.fillStyle=bg;x.fillRect(0,0,w,h);shapes.forEach(([c,t,a,b,cc,d])=>{x.fillStyle=c;x.beginPath();t==='c'?x.arc(a,b,cc,0,7):x.rect(a,b,cc,d);x.fill()});
 for(let i=0;i<1500;i++){x.fillStyle=`rgba(0,0,0,${rnd()*.06})`;x.fillRect(rnd()*w,rnd()*h,3,3)}});
const sign=(txt,bg,fg,w=2048,h=128,size=64,align='center')=>tex(w,h,(x)=>{x.fillStyle=bg;x.fillRect(0,0,w,h);x.fillStyle=fg;x.font=`700 ${size}px "Inter Tight", Arial, sans-serif`;
 x.textBaseline='middle';x.textAlign=align;x.letterSpacing='6px';x.fillText(txt,align==='center'?w/2:48,h/2)});

/* ---------- materials ---------- */
const M={
 concrete:mat(0xd8d3cb,{map:noise('#d8d3cb',.06,[3,3]),r:.95}),
 concreteDk:mat(0xbdb6ac,{r:.95}),
 orange:mat(0xF2542D,{r:.7}),black:mat(0x161616,{r:.6}),
 walnut:mat(0xffffff,{map:planks(['#6f4428','#7b4c2d','#674026','#80522f'],[4,2.6]),r:.55}),
 oak:mat(0xffffff,{map:planks(['#c79f74','#bf956a','#cfa77c','#b88d62'],[1,1]),r:.6}),
 walnutSolid:mat(0x5e3a22,{r:.5}),
 marble:mat(0xffffff,{map:marbleT,r:.25,env:.9}),
 trav:mat(0xd9c6a5,{map:noise('#d9c6a5',.08,[1,1]),r:.7}),
 brass:mat(0xc9a14a,{m:.9,r:.3,env:1}),gilt:mat(0xc8992f,{m:.85,r:.32,env:1.1}),
 leather:mat(0x141414,{r:.38,env:.9}),boucle:mat(0xeee6d8,{map:noise('#eee6d8',.12,[3,3]),r:1}),
 plaster:mat(0xf1ece3,{r:.85}),mirror:mat(0xdfe6e8,{m:1,r:.06,env:1.4}),
 glass:mat(0xfff0cf,{e:0xffd58a,ei:.75,r:.2}),fire:mat(0xff7a2a,{e:0xff5a14,ei:2.2}),flame:mat(0xffd27a,{e:0xffc24a,ei:3}),
 lampShade:mat(0xfff1d6,{e:0xffcf86,ei:1.1,r:.9}),
 terracotta:mat(0xb4623a,{r:.85}),leaf:mat(0x55733f,{r:.7}),leaf2:mat(0x6d8a4c,{r:.7}),stem:mat(0x5a4632,{r:.8}),
 velvetRed:mat(0x9b1218,{r:.95}),velvetGreen:mat(0x2f4a3a,{r:.95}),rust:mat(0x8e3b25,{r:.95}),ochre:mat(0xc98a2b,{r:.9}),
 red:mat(0xa3241c,{r:.85}),indigo:mat(0x27305e,{r:.95}),
 tatami:mat(0xffffff,{map:tatamiT,r:.9}),shoji:mat(0xffffff,{map:shojiT,e:0xffe3b0,ei:.55,r:.9}),
 rug:mat(0xffffff,{map:rugT,r:1}),
 cobalt:mat(0xffffff,{map:noise('#1f3d93',.18,[4,5]),r:1}),
 stone:mat(0xffffff,{map:tiles('#d9cfbf',[3,4]),r:.6}),
 book:[0x8e2a22,0x2f4a3a,0xd8c49a,0x1f3d93,0x141414].map(c=>mat(c,{r:.8})),
};

/* ---------- architecture ---------- */
const world=new THREE.Group();S.add(world);
const T=.24; // wall thickness
// wall along local x, base y=0, centred on z=0. holes: {x,w,y0,y1,kind:'win'|'door'|'shoji'}
function wall(len,h,m,holes=[],trim){const g=new THREE.Group();let cur=-len/2;
 const seg=(a,b,y0,y1)=>{if(b-a>.001&&y1-y0>.001)B(b-a,y1-y0,T,m,(a+b)/2,y0,0,g)};
 holes.sort((a,b)=>a.x-b.x).forEach(o=>{const a=o.x-o.w/2,b=o.x+o.w/2;seg(cur,a,0,h);seg(a,b,0,o.y0);seg(a,b,o.y1,h);cur=b;
  if(o.kind==='door'){B(o.w,.06,T+.04,M.walnutSolid,o.x,o.y1-.06,0,g);return}
  const fm=M.walnutSolid,gm=o.kind==='shoji'?M.shoji:M.glass,ww=o.w,hh=o.y1-o.y0;
  B(ww,hh,.03,gm,o.x,o.y0,0,g,false);
  B(ww,.05,T+.03,fm,o.x,o.y0,0,g);B(ww+.1,.05,T+.14,fm,o.x,o.y0-.05,.04,g); // sill
  B(ww,.05,T+.03,fm,o.x,o.y1-.05,0,g);B(.05,hh,T+.03,fm,a+.025,o.y0,0,g);B(.05,hh,T+.03,fm,b-.025,o.y0,0,g);
  if(o.kind!=='shoji'){B(.04,hh,.07,fm,o.x,o.y0,0,g);B(ww,.04,.07,fm,o.x,o.y0+hh*.62,0,g)}});
 seg(cur,len/2,0,h);
 if(trim)B(len,.04,T+.02,trim,0,h,0,g);
 return g}
const rooms=[];
function room(name,cx,cy,w,d,h,o){
 const g=grp(cx,cy,0,world);
 B(w,.2,d,M.concreteDk,0,0,0,g);
 const fl=B(w-T,.02,d-T,o.floor,T/2,.2,T/2,g,false);
 const bw=wall(w,h,o.wall,o.back||[],o.trim);bw.position.set(0,.2,-d/2+T/2);g.add(bw);
 const lw=wall(d-T,h,o.wall,(o.left||[]).map(q=>({...q,x:-(q.x-T/2)})),o.trim);lw.rotation.y=Math.PI/2;lw.position.set(-w/2+T/2,.2,T/2);g.add(lw);
 B(w-T,.1,.03,o.base,T/2,.22,-d/2+T+.015,g);B(.03,.1,d-T,o.base,-w/2+T+.015,.22,T/2,g); // skirting
 // hover outline: visible box edges of the room
 const gm=new THREE.MeshBasicMaterial({color:0xF2542D,transparent:true,opacity:0,depthWrite:false});
 const e=.06,top=.2+h+.04;
 [[w,e,e,0,.18,d/2],[e,e,d,w/2,.18,0],[w,e,e,0,top,-d/2],[e,e,d,-w/2,top,0],[e,top-.18,e,w/2,.18,-d/2],[e,top-.18,e,-w/2,.18,d/2],[e,top-.18,e,-w/2,.18,-d/2]]
  .forEach(([a,b,c,x,y,z])=>{const m=new THREE.Mesh(new THREE.BoxGeometry(a,b,c),gm);m.position.set(x,y+b/2,z);g.add(m)});
 rooms.push({g,name,gm,wm:o.wall,y:cy});
 return {g,F:.22,x0:-w/2+T,z0:-d/2+T,w,d}}

/* ---------- props ---------- */
function plant(p,x,y,z,s=1,leaves=9){const g=grp(x,y,z,p);g.scale.setScalar(s);
 CY(.2,.15,.36,M.terracotta,0,0,0,g);CY(.18,.18,.02,M.stem,0,.33,0,g);CY(.018,.022,.9,M.stem,0,.34,0,g);
 for(let i=0;i<leaves;i++){const l=SP(.16,i%2?M.leaf:M.leaf2,0,0,0,g);const a=i*2.4,r=.12+rnd()*.12,yy=.55+i*.075;
  l.position.set(Math.cos(a)*r,yy,Math.sin(a)*r);l.scale.set(1,.28,.7);l.rotation.set(rnd()*.6-.3,-a,.5+rnd()*.4)}return g}
function frame(p,x,y,z,fw,fh,art,rot=0,metal=M.gilt){const g=grp(x,y,z,p,rot);RB(fw+.18,fh+.18,.07,metal,0,0,0,g,.02);B(fw,fh,.02,mat(0xffffff,{map:art,r:.9}),0,.09,.04,g);return g}
function books(p,x,y,z,n,ry=0){const g=grp(x,y,z,p,ry);let off=0;for(let i=0;i<n;i++){const t=.05+rnd()*.04,hh=.22+rnd()*.1;B(t,hh,.17,M.book[i%5],off,0,0,g);off+=t+.005}return g}
function bust(p,x,y,z,ry=0){const g=grp(x,y,z,p,ry);RB(.5,1,.5,M.plaster,0,0,0,g,.015);RB(.56,.06,.56,M.plaster,0,1,0,g,.01);
 const sh=SP(.3,M.plaster,0,1.18,0,g);sh.scale.set(1,.5,.6);CY(.075,.09,.18,M.plaster,0,1.24,0,g);
 const hd=SP(.14,M.plaster,0,1.5,.01,g);hd.scale.set(.95,1.15,1.05);SP(.035,M.plaster,0,1.49,.15,g);const bun=SP(.08,M.plaster,0,1.6,-.1,g);return g}
function stanchion(p,x,y,z){CY(.13,.15,.04,M.brass,x,y,z,p);CY(.022,.022,.84,M.brass,x,y+.04,z,p);SP(.05,M.brass,x,y+.92,z,p)}
function rope(p,a,b){const m=a.clone().lerp(b,.5);m.y-=.2;const c=new THREE.CatmullRomCurve3([a,a.clone().lerp(m,.5).setY(a.y-.14),m,b.clone().lerp(m,.5).setY(b.y-.14),b]);
 const r=new THREE.Mesh(new THREE.TubeGeometry(c,32,.028,10),M.velvetRed);r.castShadow=true;p.add(r)}
function sofa(p,x,y,z,ry,L,m,pillows=[]){const g=grp(x,y,z,p,ry);
 RB(L,.34,.92,m,0,.08,0,g,.08);RB(L,.52,.24,m,0,.36,-.34,g,.11);RB(.24,.5,.92,m,-L/2+.12,.08,0,g,.1);RB(.24,.5,.92,m,L/2-.12,.08,0,g,.1);
 const n=Math.round((L-.5)/1.05);for(let i=0;i<n;i++){const cw=(L-.5)/n;RB(cw-.03,.16,.66,m,-L/2+.25+cw*i+cw/2,.42,.07,g,.07)}
 [[-L/2+.1,.04,-.4],[L/2-.1,.04,-.4],[-L/2+.1,.04,.4],[L/2-.1,.04,.4]].forEach(([a,b,c])=>CY(.03,.025,.08,M.black,a,0,c,g));
 pillows.forEach(([px,pm,rz])=>{const q=RB(.42,.4,.13,pm,px,.56,-.18,g,.06);q.rotation.set(-.25,0,rz)});return g}
function lounge(p,x,y,z,ry){const g=grp(x,y,z,p,ry);
 CY(.05,.05,.28,M.black,0,0,0,g);[0,1,2,3,4].forEach(i=>{const a=i*1.2566;const f=B(.42,.03,.05,M.black,Math.cos(a)*.2,0,Math.sin(a)*.2,g);f.rotation.y=-a});
 RB(.84,.1,.82,M.walnutSolid,0,.28,0,g,.04);RB(.76,.15,.72,M.leather,0,.37,.03,g,.07);
 const bk=grp(0,.4,-.36,g);bk.rotation.x=-.28;RB(.84,.82,.1,M.walnutSolid,0,0,0,bk,.04);RB(.76,.76,.13,M.leather,0,.03,.08,bk,.07);
 [-.43,.43].forEach(s=>RB(.1,.08,.62,M.leather,s,.58,0,g,.04));
 const ot=grp(0,0,.95,g);CY(.04,.04,.18,M.black,0,0,0,ot);RB(.58,.08,.48,M.walnutSolid,0,.18,0,ot,.03);RB(.52,.13,.42,M.leather,0,.25,0,ot,.06);return g}
function floorLamp(p,x,y,z){CY(.17,.19,.04,M.brass,x,y,z,p);CY(.016,.016,1.5,M.brass,x,y+.04,z,p);const s=CY(.16,.27,.34,M.lampShade,x,y+1.46,z,p);s.castShadow=false;
 const L=new THREE.PointLight(0xffc27a,3.5,4.5,1.6);L.position.set(x,y+1.5,z);p.add(L)}

/* ---------- build ---------- */
// base, orange deck, slab
RB(10.7,.5,7.1,M.concrete,0,-.5,0,world,.03);
RB(4.4,.32,2.3,M.orange,2.75,-.52,4.6,world,.03);
const tag=RB(2.5,.1,.62,M.black,2.95,-.2,4.45,world,.02);
const tagTop=new THREE.Mesh(new THREE.PlaneGeometry(2.4,.5),new THREE.MeshBasicMaterial({map:sign('JUST BRING THE CAMERA  →','#161616','#ffffff',1024,200,64,'left'),toneMapped:false}));
tagTop.rotation.x=-Math.PI/2;tagTop.position.set(2.95,-.094,4.45);world.add(tagTop);
B(10,.35,6.4,M.concrete,0,3.0,0,world);
const slabSign=new THREE.Mesh(new THREE.PlaneGeometry(10,.35),new THREE.MeshBasicMaterial({map:sign('READY-MADE SETS  ·  LA MAISON  ·  LA GALERIE  ·  L’HÔTEL','#d8d3cb','#2a2a2a',2048,72,34),toneMapped:false}));
slabSign.position.set(0,3.175,3.201);world.add(slabSign);
B(.22,2.8,.22,M.concrete,4.89,.2,3.09,world); // front-right column

// LA GALERIE (ground left)
{const r=room('La Galerie',-2.55,0,4.9,6.4,2.8,{wall:mat(0x6a1d18,{r:.92}),floor:M.stone,trim:M.concrete,base:mat(0x4a130f)});
 const {g,F}=r,bz=-3.2+T+.04,lx=-2.45+T+.04;
 frame(g,.25,F+1.0,bz,1.25,.95,paint('#2d3b55',[['#c9a46a','c',90,120,60],['#e8dcc6','r',150,40,70,150],['#8e2a22','c',190,190,30]]));
 frame(g,-1.35,F+1.15,bz,.62,.82,paint('#d8c49a',[['#3d2b20','c',128,110,70],['#f1e6d6','c',128,96,40]]));
 frame(g,1.65,F+1.25,bz,.56,.7,paint('#5f6b45',[['#e8c27a','r',40,40,170,90],['#2b2b2b','r',60,160,130,60]]));
 frame(g,lx,F+.95,-1.6,.85,.65,paint('#e6d9c3',[['#1f3d93','r',30,60,90,130],['#c96f3b','c',180,120,55]]),Math.PI/2);
 frame(g,lx,F+1.9,-1.6,.5,.35,paint('#141414',[['#c9a04a','c',128,128,60]]),Math.PI/2);
 frame(g,lx,F+1.2,.9,.55,.75,paint('#9c4a3a',[['#efe4d4','c',128,100,50],['#2e2a26','r',60,170,140,60]]),Math.PI/2);
 [[.25,1.25],[-1.35,.45],[1.65,.42]].forEach(([x,fw])=>{B(fw,.035,.12,M.brass,x,F+2.05+(x===.25?.05:x<0?.18:.16),bz+.06,g)});
 bust(g,-1.55,F,-1.25,.4);bust(g,1.45,F,.85,-.6);
 const P=[[-1.9,.0],[-.3,.45],[1.1,-.1]];P.forEach(([x,z])=>stanchion(g,x,F,z));
 for(let i=0;i<2;i++)rope(g,new THREE.Vector3(P[i][0],F+.86,P[i][1]),new THREE.Vector3(P[i+1][0],F+.86,P[i+1][1]));
 const bn=grp(.1,F,1.85,g,.08);[[-.6,-.15],[.6,-.15],[-.6,.15],[.6,.15]].forEach(([a,c])=>CY(.025,.025,.32,M.brass,a,0,c,bn));RB(1.45,.16,.46,M.velvetGreen,0,.32,0,bn,.06);
 [[.25,1.3],[-1.35,1.45],[1.65,1.55]].forEach(([x,yy])=>{const s=new THREE.SpotLight(0xfff0d8,9,6,.42,.7,1.4);s.position.set(x,3.3,-.6);s.target.position.set(x,F+yy,bz);g.add(s,s.target)});}

// L'HÔTEL (ground right)
{const r=room("L'Hôtel",2.45,0,5.1,6.4,2.8,{wall:mat(0xeadfcb,{r:.9}),floor:M.cobalt,trim:M.concrete,base:mat(0x8e3b25),
  back:[{x:-1.35,w:1.15,y0:.75,y1:2.25,kind:'shoji'}],left:[{x:-1.5,w:1.0,y0:0,y1:2.2,kind:'door'}]});
 const {g,F}=r,bz=-3.2+T,lx=-2.55+T;
 // red ceiling corridor: red band + soffit along the back
 B(5.1-T,.5,.02,M.red,T/2,2.5,bz+.012,g,false);B(.02,.5,6.4-T,M.red,lx+.012,2.5,T/2,g,false);
 B(5.1-T,.14,1.05,M.red,T/2,2.86,bz+.52,g);
 [-.2,1.9].forEach(x=>{B(.012,.42,.012,M.black,x,2.44,bz+.6,g);const gl=SP(.13,M.lampShade,x,2.36,bz+.6,g);gl.castShadow=false;const L=new THREE.PointLight(0xffc98a,2.2,3.5,1.6);L.position.set(x,2.2,bz+.7);g.add(L)});
 sofa(g,1.15,F,bz+.55,0,2.3,M.rust,[[-.75,M.ochre,.12],[.75,M.indigo,-.1]]);
 CY(.48,.48,.05,M.trav,1.15,F+.36,-1.2,g);CY(.26,.32,.36,M.trav,1.15,F,-1.2,g);books(g,1.0,F+.41,-1.2,3,.3);CY(.06,.05,.12,M.black,1.4,F+.41,-1.1,g);
 const tub=grp(2.0,F,-.1,g,-2.3);CY(.36,.34,.4,M.ochre,0,0,0,tub);const tb=add(new THREE.CylinderGeometry(.38,.38,.32,28,1,true,0,Math.PI),M.ochre,0,.55,0,tub);tb.material.side=THREE.DoubleSide;
 RB(.55,.38,.4,M.walnutSolid,2.2,F,bz+.3,g,.03);CY(.1,.14,.18,M.brass,2.2,F+.38,bz+.3,g);const ts=CY(.12,.2,.2,M.lampShade,2.2,F+.62,bz+.3,g);ts.castShadow=false;
 // tatami corner
 const tz=1.85,tx=-1.25;RB(2.5,.14,2.55,M.walnutSolid,tx,F,tz,g,.02);
 [-.62,.62].forEach(dx=>{const t=B(1.2,.02,2.45,M.tatami,tx+dx,F+.14,tz,g);t.castShadow=false});
 RB(1.0,.06,.62,M.walnutSolid,tx,F+.42,tz+.05,g,.02);[[-.42,-.24],[.42,-.24],[-.42,.24],[.42,.24]].forEach(([a,c])=>B(.06,.26,.06,M.walnutSolid,tx+a,F+.16,tz+.05+c,g));
 [[-.75,.05],[.75,.05]].forEach(([a,c])=>RB(.5,.07,.5,M.indigo,tx+a,F+.16,tz+c,g,.03));
 CY(.05,.04,.08,M.plaster,tx-.15,F+.48,tz,g);CY(.05,.04,.08,M.plaster,tx+.12,F+.48,tz+.12,g);CY(.07,.06,.12,M.black,tx,F+.48,tz-.1,g);
 const sh=grp(tx,F+.14,tz-1.22,g);[-.85,0,.85].forEach(dx=>{B(.82,1.55,.04,M.shoji,dx,0,0,sh);B(.86,.05,.07,M.walnutSolid,dx,1.55,0,sh)});
 const lan=SP(.17,M.lampShade,tx+1.05,F+.42,tz+.95,g);lan.scale.y=1.25;lan.castShadow=false;CY(.08,.1,.18,M.walnutSolid,tx+1.05,F+.14,tz+.95,g);
 const L=new THREE.PointLight(0xffc98a,2.5,3.2,1.6);L.position.set(tx+.9,F+.8,tz+.8);g.add(L);
 plant(g,2.25,F,1.9,.9);}

// LA MAISON (upper floor)
{const r=room('La Maison',0,3.35,10,6.4,2.75,{wall:mat(0xefe4d4,{r:.9}),floor:M.walnut,trim:mat(0xd9c7ad),base:mat(0xd9c7ad),
  back:[{x:-3.25,w:1.25,y0:.45,y1:2.4},{x:3.3,w:1.25,y0:.45,y1:2.4}],left:[{x:.5,w:1.5,y0:.5,y1:2.3}]});
 const {g,F}=r,bz=-3.2+T,lx=-5+T;
 // marble fireplace + mirror
 RB(2.5,.06,.85,M.marble,0,F,bz+.42,g,.01);
 RB(2.1,1.32,.4,M.marble,0,F+.06,bz+.2,g,.02);RB(1.0,.78,.14,M.black,0,F+.08,bz+.36,g,.02);
 const fi=B(.62,.16,.08,M.fire,0,F+.1,bz+.4,g,false);[-.15,.12].forEach(dx=>{const lg=CY(.045,.045,.5,M.walnutSolid,dx,F+.1,bz+.42,g);lg.rotation.z=Math.PI/2;lg.position.y=F+.14});
 RB(2.4,.08,.52,M.marble,0,F+1.38,bz+.22,g,.02);
 RB(1.3,1.45,.06,M.gilt,0,F+1.48,bz+.04,g,.02);B(1.12,1.27,.02,M.mirror,0,F+1.57,bz+.08,g);
 [-.85,-.72,.8].forEach((x,i)=>{const hh=[.26,.18,.22][i];CY(.035,.035,hh,M.plaster,x,F+1.46,bz+.24,g);SP(.022,M.flame,x,F+1.46+hh+.03,bz+.24,g).castShadow=false});
 const vase=CY(.07,.1,.26,M.black,.45,F+1.46,bz+.24,g);
 const fire=new THREE.PointLight(0xff8a3d,3,4.2,1.5);fire.position.set(0,F+.45,bz+.9);g.add(fire);
 // lounge chair, rug, sofa, tables
 const rug=CY(1.75,1.75,.02,M.rug,.3,F,.35,g,48);rug.castShadow=false;
 lounge(g,1.35,F+.02,-.5,-.75);
 sofa(g,-4.2,F,.45,Math.PI/2,2.5,M.boucle,[[-.85,M.ochre,.15],[.85,M.velvetGreen,-.1]]);
 CY(.5,.5,.06,M.trav,-2.75,F+.34,.45,g);CY(.28,.34,.34,M.trav,-2.75,F,.45,g);books(g,-2.9,F+.4,.4,4,.4);
 const cup=CY(.05,.04,.08,M.plaster,-2.5,F+.4,.6,g);
 CY(.26,.26,.04,M.marble,2.75,F+.52,.55,g);CY(.03,.03,.52,M.brass,2.75,F,.55,g);CY(.14,.14,.02,M.brass,2.75,F,.55,g);plant(g,2.75,F+.56,.55,.45,6);
 floorLamp(g,3.9,F,-2.45);
 // credenza with books
 RB(1.7,.62,.45,M.walnutSolid,-1.75,F,bz+.25,g,.02);books(g,-2.4,F+.62,bz+.25,6);CY(.1,.12,.3,M.terracotta,-1.2,F+.62,bz+.25,g);
 frame(g,lx+.04,F+1.0,-1.9,.75,.95,paint('#c9b48f',[['#3a2a1c','c',120,140,70],['#8e2a22','r',30,30,60,60]]),Math.PI/2,M.walnutSolid);
 plant(g,4.4,F,-2.55,1.25,11);plant(g,-4.35,F,-2.5,1.0,9);plant(g,-3.25,F+.5,bz+.12,.32,5);}

/* ---------- lights ---------- */
S.add(new THREE.HemisphereLight(0xfff3e2,0x6b5a4a,.85));
const sun=new THREE.DirectionalLight(0xffd6a0,3.4);sun.position.set(-9,13,-7);sun.castShadow=true;
sun.shadow.mapSize.set(small?1024:2048,small?1024:2048);Object.assign(sun.shadow.camera,{left:-10,right:10,top:10,bottom:-10,near:1,far:40});
sun.shadow.bias=-.0004;sun.shadow.normalBias=.03;sun.shadow.radius=3;S.add(sun);
const fill=new THREE.DirectionalLight(0xe6ecff,1.1);fill.position.set(10,9,12);S.add(fill);

/* ---------- intro, hover, click ---------- */
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
let introStart=performance.now(),heroVisible=true;
new IntersectionObserver(([e])=>{if(e.isIntersecting&&!heroVisible)introStart=performance.now();heroVisible=e.isIntersecting},{threshold:0}).observe(el);
const ease=x=>1-Math.pow(1-Math.min(Math.max(x,0),1),3);
const ray=new THREE.Raycaster(),mouse=new THREE.Vector2(-9,-9);let hov=-1,tgt={x:0,y:0};
function size(){const w=el.clientWidth,h=el.clientHeight,a=w/h,f=Math.max(6.9,8.2/a);cam.left=-f*a;cam.right=f*a;cam.top=f;cam.bottom=-f;cam.updateProjectionMatrix();R.setSize(w,h)}
size();addEventListener('resize',size);
el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect();mouse.x=(e.clientX-r.left)/r.width*2-1;mouse.y=-(e.clientY-r.top)/r.height*2+1;tgt.x=mouse.x;tgt.y=mouse.y;lbl.style.left=(e.clientX-r.left+16)+'px';lbl.style.top=(e.clientY-r.top+16)+'px'});
el.addEventListener('pointerleave',()=>{mouse.set(-9,-9);tgt={x:0,y:0}});
const order={"La Maison":0,"La Galerie":1,"L'Hôtel":2};
el.addEventListener('click',()=>{if(hov<0)return;const i=order[rooms[hov].name];document.querySelectorAll('.sp').forEach((s,j)=>s.classList.toggle('on',j===i));document.getElementById('spaces').scrollIntoView({behavior:'smooth'})});
rooms.forEach(r=>{r.wm.emissive=new THREE.Color(0xF2542D);r.wm.emissiveIntensity=0});
function owner(o){while(o){const i=rooms.findIndex(r=>r.g===o);if(i>-1)return i;o=o.parent}return -1}
const fireLight=rooms[2].g.children.find(c=>c.isPointLight&&c.color.getHex()===0xff8a3d);
(function loop(){requestAnimationFrame(loop);
 if(!heroVisible)return;
 const t=performance.now()/1000,it=reduce?9:(performance.now()-introStart)/1000,e0=ease(it/1.3);
 world.rotation.y=-.5*(1-e0);world.position.y=-1.5*(1-e0);
 cam.position.set(base.x+tgt.x*2.2,base.y+tgt.y*1.2,base.z-tgt.x*2.2);cam.lookAt(look);
 if(fireLight)fireLight.intensity=2.8+Math.sin(t*9)*.35+Math.sin(t*5.3)*.25;
 ray.setFromCamera(mouse,cam);const hit=ray.intersectObjects(rooms.map(r=>r.g),true)[0];hov=hit?owner(hit.object):-1;
 rooms.forEach((r,i)=>{const on=i===hov;
  r.gm.opacity+=((on?1:0)-r.gm.opacity)*.15;r.wm.emissiveIntensity+=((on?.12:0)-r.wm.emissiveIntensity)*.15;
  const drop=(1-ease((it-.15-i*.18)/.9))*6,want=r.y+(on?.15:0)+drop;
  r.g.position.y=drop>.001?want:r.g.position.y+(want-r.g.position.y)*.12});
 if(hov>-1){lbl.textContent=rooms[hov].name+'  →';lbl.style.opacity=1}else lbl.style.opacity=0;
 R.render(S,cam)})();
