"use strict";
const COL={car:"#ff7043",truck:"#ff9e3d",bus:"#ffb020",trailer:"#f0a060",construction_vehicle:"#f4c060",pedestrian:"#ff3f81",bicycle:"#b65cff",motorcycle:"#805cff",traffic_cone:"#ffd45d",barrier:"#b8c0c8"};
const STATIC_COL={traffic_light:"#00e5ff",pedestrian_traffic_light:"#58d9ff",traffic_sign:"#ffdf55",pole:"#b9c8d2",street_light:"#b7d3e5",bus_stop:"#4de3a2",barrier:"#ffd166",traffic_cone:"#ffb74d",roadwork:"#ff8a65",construction:"#ff8a65",construction_zone:"#ff8a65",warning_sign:"#ffe066",debris:"#ff5d8f",object_on_road:"#ff5d8f"};
const MAP_COL={divider:"#ff9500",ped_crossing:"#2f6fff",boundary:"#e12b2b"};
const SEM={0:"#777",1:"#888",2:"#b85cff",3:"#ffb020",4:"#ff7043",5:"#c49a42",6:"#805cff",7:"#ff3f81",8:"#ffd45d",9:"#c08055",10:"#ff9e3d",11:"#7f7f7f",12:"#9a8f7f",13:"#d7839a",14:"#b6925f",15:"#90a4ae",16:"#4caf50"};
const NAMES={4:"car",7:"pedestrian",3:"bus",10:"truck",2:"bicycle",6:"motorcycle",11:"driveable",13:"sidewalk",15:"manmade",16:"vegetation"};
const S={d182:null,showOcc:true,m:null,f:null,idx:0,conf:.30,staticConf:.20,pc:"semantic",mode:"3d",pts:null,lane:null,showStatic:true,showMap:true,ground:null,view:{yaw:-.72,pitch:.92,roll:0,zoom:7,px:0,py:0,drag:null},lv:{z:1,px:0,py:0,drag:null}};
const $=q=>document.querySelector(q),oc=l=>COL[l]||"#e6edf3",sc=l=>STATIC_COL[l]||"#65d6c0";
let __loadSeq=0;
async function gj(u){const r=await fetch(u,{cache:"force-cache"});if(!r.ok)throw Error(`${u}:${r.status}`);return r.json()}
async function gp(u){const r=await fetch(u,{cache:"force-cache"});if(!r.ok)throw Error(`${u}:${r.status}`);const b=await r.arrayBuffer(),v=new DataView(b);if(String.fromCharCode(...new Uint8Array(b,0,4))!=="LTS4")throw Error("bad LTS4");const n=v.getUint32(4,true),xyz=new Float32Array(n*3),lab=new Uint8Array(n),score=new Float32Array(n);let o=8;for(let i=0;i<n;i++,o+=20){xyz[3*i]=v.getFloat32(o,true);xyz[3*i+1]=v.getFloat32(o+4,true);xyz[3*i+2]=v.getFloat32(o+8,true);lab[i]=v.getUint8(o+12);score[i]=v.getFloat32(o+16,true)}return{n,xyz,lab,sc:score}}
function camCard(c){const d=document.createElement("div");d.className="camera";d.dataset.cam=c.camera;d.innerHTML=`<img src="${c.raw_image}"><canvas></canvas><span class="camname">${c.camera}</span>`;return d}
function buildCams(){const g=$("#cams");g.innerHTML="";S.f.cameras.forEach(c=>g.append(camCard(c)));requestAnimationFrame(draw2d)}
function containGeom(w,h,sw,sh){const s=Math.min(w/sw,h/sh);return{s,ox:(w-sw*s)/2,oy:(h-sh*s)/2}}
function draw2d(){document.querySelectorAll(".camera").forEach(d=>{const cv=d.querySelector("canvas"),r=d.getBoundingClientRect(),z=devicePixelRatio||1;cv.width=Math.max(1,r.width*z);cv.height=Math.max(1,r.height*z);const x=cv.getContext("2d");x.setTransform(z,0,0,z,0,0);x.clearRect(0,0,r.width,r.height);const cm=S.f.cameras.find(c=>c.camera===d.dataset.cam),g=containGeom(r.width,r.height,cm.source_width,cm.source_height);
for(const b of S.f.mamba_projections||[]){if(b.camera!==d.dataset.cam||b.score<S.conf)continue;const q=b.bbox_xyxy;x.strokeStyle=oc(b.label);x.lineWidth=1.8;x.setLineDash([]);x.strokeRect(g.ox+q[0]*g.s,g.oy+q[1]*g.s,(q[2]-q[0])*g.s,(q[3]-q[1])*g.s);{const bw=(q[2]-q[0])*g.s,bh=(q[3]-q[1])*g.s;if(bw>28&&bh>22&&Number(b.score||0)>=Math.max(S.conf,.50)){const tx=g.ox+q[0]*g.s,ty=Math.max(10,g.oy+q[1]*g.s-2),txt=`${b.label} ${Number(b.score||0).toFixed(2)}`;x.font="9px system-ui";x.fillStyle=oc(b.label);x.fillText(txt,tx,ty)}}}
if(S.showStatic)for(const b of S.f.static_attention_projections||[]){if(b.camera!==d.dataset.cam)continue;if(b.projected===true||b.source==="static_3d_projection")continue;const __st=Number(b.score??b.confidence??0);if(!Number.isFinite(__st)||__st<S.staticConf)continue;const q=b.bbox_xyxy;x.strokeStyle=sc(b.label);x.lineWidth=2.0;x.setLineDash([]);x.strokeRect(g.ox+q[0]*g.s,g.oy+q[1]*g.s,(q[2]-q[0])*g.s,(q[3]-q[1])*g.s);{const bw=(q[2]-q[0])*g.s,bh=(q[3]-q[1])*g.s;if(bw>30&&bh>22&&__st>=Math.max(S.staticConf,.35)){const tx=g.ox+q[0]*g.s,ty=Math.max(10,g.oy+q[1]*g.s-2),txt=`${b.label} ${__st.toFixed(2)}`;x.font="9px system-ui";x.fillStyle=sc(b.label);x.fillText(txt,tx,ty)}}x.setLineDash([])}
if(S.f.signal_observations)for(const b of S.f.signal_observations){if(b.camera!==d.dataset.cam)continue;const q=b.bbox_xyxy;x.strokeStyle=b.state==="red"?"#ff3b30":b.state==="green"?"#35d07f":b.state==="yellow"?"#ffd60a":"#9aa4ad";x.lineWidth=2.2;x.setLineDash([]);x.strokeRect(g.ox+q[0]*g.s,g.oy+q[1]*g.s,(q[2]-q[0])*g.s,(q[3]-q[1])*g.s)}})}
function rot(p){let[x,y,z]=p,cy=Math.cos(S.view.yaw),sy=Math.sin(S.view.yaw),cp=Math.cos(S.view.pitch),sp=Math.sin(S.view.pitch),cr=Math.cos(S.view.roll),sr=Math.sin(S.view.roll);let x1=cy*x-sy*y,y1=sy*x+cy*y,z1=z;let x2=x1,y2=cp*y1-sp*z1,z2=sp*y1+cp*z1;return[cr*x2-sr*y2,sr*x2+cr*y2,z2]}
function p3(p,w,h){const q=rot(p),zz=q[2]+55,k=S.view.zoom*70/Math.max(7,zz);return[w/2+S.view.px+q[0]*k,h/2+S.view.py-q[1]*k]}
function pcCol(i){if(S.pc==="semantic")return SEM[S.pts.lab[i]]||"#aaa";if(S.pc==="confidence"){const s=S.pts.sc[i];return `rgb(${Math.floor(70+185*s)},${Math.floor(100+110*s)},${Math.floor(255-150*s)})`}const u=Math.max(0,Math.min(1,(S.pts.xyz[3*i+2]+3)/8));return `rgb(${Math.floor(70+185*u)},${Math.floor(190-100*u)},${Math.floor(255-150*u)})`}
function boxCorners(b){const[l,w,h]=b.size,[cx,cy,cz]=b.local_center,y=b.local_yaw||0,co=Math.cos(y),si=Math.sin(y),a=[];for(const sx of[-1,1])for(const sy of[-1,1])for(const sz of[-1,1]){const xx=sx*l/2,yy=sy*w/2;a.push([cx+co*xx-si*yy,cy+si*xx+co*yy,cz+sz*h/2])}return a}
const EDGES=[[0,1],[0,2],[0,4],[1,3],[1,5],[2,3],[2,6],[3,7],[4,5],[4,6],[5,7],[6,7]];
function drawBox3(x,b,W,H,color,width=1.8,dash=[]){const u=boxCorners(b).map(p=>p3(p,W,H));x.strokeStyle=color;x.lineWidth=width;x.setLineDash(dash);for(const e of EDGES){x.beginPath();x.moveTo(...u[e[0]]);x.lineTo(...u[e[1]]);x.stroke()}x.setLineDash([])}
function drawTrack3(x,t,W,H){for(const s of t.segments||[]){if(!s.points||s.points.length<2)continue;const est=String(s.kind||"").startsWith("estimated");x.strokeStyle=oc(t.label);x.lineWidth=est?2.9:2;x.setLineDash(est?[10,7]:[]);x.beginPath();s.points.forEach((p,i)=>{const q=p3(p,W,H);i?x.lineTo(...q):x.moveTo(...q)});x.stroke();x.setLineDash([])}}
function buildGround(){const g=new Map(),cnt=new Map();let sum=0,n=0;if(!S.pts)return;for(let i=0;i<S.pts.n;i+=2){const lab=S.pts.lab[i];if(![11,12,13].includes(lab))continue;const xx=S.pts.xyz[3*i],yy=S.pts.xyz[3*i+1],zz=S.pts.xyz[3*i+2],k=`${Math.floor(xx)}:${Math.floor(yy)}`;g.set(k,(g.get(k)||0)+zz);cnt.set(k,(cnt.get(k)||0)+1);sum+=zz;n++}for(const[k,v]of g)g.set(k,v/cnt.get(k));S.ground={g,mean:n?sum/n:-1.5}}
function groundZ(x,y){if(!S.ground)return-1.5;const ix=Math.floor(x),iy=Math.floor(y);for(let r=0;r<=2;r++)for(let dx=-r;dx<=r;dx++)for(let dy=-r;dy<=r;dy++){const v=S.ground.g.get(`${ix+dx}:${iy+dy}`);if(v!==undefined)return v+.04}return S.ground.mean+.04}
function drawMapVectors3(x,W,H){if(!S.showMap)return;for(const v of S.f.mask2map_vectors||[]){const pts=v.local_points||[];if(pts.length<2)continue;x.strokeStyle=MAP_COL[v.class_name]||"#f8c555";x.lineWidth=v.class_name==="ped_crossing"?2.5:2;x.setLineDash(v.class_name==="ped_crossing"?[6,4]:[]);x.beginPath();pts.forEach((p,i)=>{const q=p3([p[0],p[1],groundZ(p[0],p[1])],W,H);i?x.lineTo(...q):x.moveTo(...q)});x.stroke();x.setLineDash([])}}
function bevMetric(pr,W,H){
  const xmin=Number(pr?.[0]??-30),ymin=Number(pr?.[1]??-30),xmax=Number(pr?.[3]??60),ymax=Number(pr?.[4]??30);
  const pad=34;
  const spanX=Math.max(1,xmax-xmin),spanY=Math.max(1,ymax-ymin);
  const scale=Math.min((W-2*pad)/spanY,(H-2*pad)/spanX)*S.lv.z;
  const xmid=(xmin+xmax)/2,ymid=(ymin+ymax)/2;
  const cx=W/2+S.lv.px,cy=H/2+S.lv.py;
  return {
    scale,xmin,ymin,xmax,ymax,xmid,ymid,cx,cy,
    uv:(p)=>[cx-(Number(p[1])-ymid)*scale,cy-(Number(p[0])-xmid)*scale]
  };
}
function drawBevGrid(x,b,W,H){
  x.save();
  x.lineWidth=1;
  x.font="10px system-ui";
  x.fillStyle="#70808d";
  x.strokeStyle="#18232d";
  const step=10;
  for(let xx=Math.ceil(b.xmin/step)*step;xx<=b.xmax;xx+=step){
    const a=b.uv([xx,b.ymin]),c=b.uv([xx,b.ymax]);
    x.beginPath();x.moveTo(...a);x.lineTo(...c);x.stroke();
  }
  for(let yy=Math.ceil(b.ymin/step)*step;yy<=b.ymax;yy+=step){
    const a=b.uv([b.xmin,yy]),c=b.uv([b.xmax,yy]);
    x.beginPath();x.moveTo(...a);x.lineTo(...c);x.stroke();
  }
  const ego=b.uv([0,0]);
  x.strokeStyle="#ffffff";x.lineWidth=2;
  x.beginPath();x.moveTo(ego[0]-7,ego[1]);x.lineTo(ego[0]+7,ego[1]);x.moveTo(ego[0],ego[1]-7);x.lineTo(ego[0],ego[1]+7);x.stroke();
  x.fillStyle="#cbd5df";x.fillText("EGO",ego[0]+8,ego[1]-8);
  x.fillText("前方 +X ↑",10,18);
  x.fillText("左 +Y ←",10,32);
  x.restore();
}
function drawMask2MapMetric(x,b){
  for(const v of S.f.mask2map_vectors||[]){
    const pts=v.local_points||[];
    if(pts.length<2)continue;
    x.strokeStyle=MAP_COL[v.class_name]||"#f8c555";
    x.lineWidth=v.class_name==="ped_crossing"?2.7:2.1;
    x.setLineDash([]);
    x.beginPath();
    pts.forEach((p,i)=>{const q=b.uv(p);i?x.lineTo(...q):x.moveTo(...q)});
    x.stroke();
  }
}
function drawBevBox(x,bx,b,color,width=2){
  const [cx,cy]=bx.local_center,[l,w]=bx.size,y=bx.local_yaw||0,co=Math.cos(y),si=Math.sin(y);
  const a=[[-l/2,-w/2],[l/2,-w/2],[l/2,w/2],[-l/2,w/2]].map(p=>b.uv([cx+co*p[0]-si*p[1],cy+si*p[0]+co*p[1]]));
  x.strokeStyle=color;x.lineWidth=width;x.setLineDash([]);x.beginPath();a.forEach((p,i)=>i?x.lineTo(...p):x.moveTo(...p));x.closePath();x.stroke();
}
function drawBevTracks(x,b){
  for(const t of S.f.tracks||[]){
    for(const seg of t.segments||[]){
      if(!seg.points||seg.points.length<2)continue;
      const est=String(seg.kind||"").startsWith("estimated");
      x.strokeStyle=oc(t.label);x.lineWidth=est?3:2.2;x.setLineDash(est?[10,7]:[]);
      x.beginPath();seg.points.forEach((p,i)=>{const q=b.uv(p);i?x.lineTo(...q):x.moveTo(...q)});x.stroke();x.setLineDash([]);
    }
  }
}

function draw(){const cv=$("#lowercv"),r=cv.getBoundingClientRect(),z=devicePixelRatio||1;cv.width=Math.max(1,r.width*z);cv.height=Math.max(1,r.height*z);const x=cv.getContext("2d");x.setTransform(z,0,0,z,0,0);x.fillStyle="#020508";x.fillRect(0,0,r.width,r.height);
if(S.mode==="3d"){if(S.pts){const st=Math.max(1,Math.floor(S.pts.n/20000));for(let i=0;i<S.pts.n;i+=st){const q=p3([S.pts.xyz[3*i],S.pts.xyz[3*i+1],S.pts.xyz[3*i+2]],r.width,r.height);if(q[0]>=0&&q[0]<r.width&&q[1]>=0&&q[1]<r.height){x.fillStyle=pcCol(i);x.fillRect(q[0],q[1],1.1,1.1)}}}
drawMapVectors3(x,r.width,r.height);
for(const b of S.f.mamba_boxes||[]){if(b.score<S.conf)continue;drawBox3(x,b,r.width,r.height,oc(b.label),1.8,[])}
if(S.showStatic)for(const b of S.f.static_attention_boxes||[]){const __st3=Number(b.confidence??b.score??0);if(!Number.isFinite(__st3)||__st3<S.staticConf)continue;drawBox3(x,b,r.width,r.height,sc(b.label),2.1,[])}
if(S.showOcc)for(const b of S.f.occupancy_boxes||[]){drawBox3(x,b,r.width,r.height,"#ff2dce",2.4,[])}for(const t of S.f.tracks||[])drawTrack3(x,t,r.width,r.height);legend3()}
else{
const bev=bevMetric(S.m.mask2map_pc_range,r.width,r.height);
drawBevGrid(x,bev,r.width,r.height);
drawMask2MapMetric(x,bev);
drawBevTracks(x,bev);
for(const b of S.f.mamba_boxes||[]){if(b.score<S.conf)continue;drawBevBox(x,b,bev,oc(b.label),2)}
if(S.showStatic)for(const b of S.f.static_attention_boxes||[]){const __stLane=Number(b.confidence??b.score??0);if(!Number.isFinite(__stLane)||__stLane<S.staticConf)continue;drawBevBox(x,b,bev,sc(b.label),2)}
if(S.showOcc)for(const b of S.f.occupancy_boxes||[]){drawBevBox(x,b,bev,"#ff2dce",2.4)}
$("#legend").innerHTML='<b>Mask2Map 米制实体-道路图</b><br>直接绘制官方 vectors.local_points；实体/轨迹与地图共用 LiDAR local XY；前方+X↑ · 左+Y←<br><span class="muted">不再用 PNG 像素坐标叠框，因此无 Matplotlib 边距/比例误差</span>'}}
function legend3(){let h='<b>3D层</b><br><span style="color:#ff7043">Mamba动态BBX</span> · <span style="color:#00e5ff">静态注意BBX</span> · <span style="color:#ff9500">Mask2Map车道结构</span><br>';for(const k of [4,7,3,10,2,6,11,13,15,16])h+=`<span class="sw" style="background:${SEM[k]}"></span>${NAMES[k]}`;$("#legend").innerHTML=h+'<br><span class="muted">静态只来自prediction；不使用human GT</span>'}

function updateStaticCount(){
  const boxes=(S.f&&S.f.static_attention_boxes)||[];
  const shown=boxes.filter(b=>{const v=Number(b.confidence??b.score??0);return Number.isFinite(v)&&v>=S.staticConf}).length;
  const real2d=((S.f&&S.f.static_attention_projections)||[]).filter(b=>b.projected!==true&&b.source!=="static_3d_projection").length;
  const el=$("#staticCount");if(el)el.textContent=`静态3D ${shown}/${boxes.length} · 本帧真实2D ${real2d}`;
}
function esc(s){return String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[c]))}
function panel(){
const d=(S.d182&&S.d182.frames||[])[S.idx]||{};
const hazards=d.hazards||[],dec=d.decision||{},adv=d.advice||{},vr=d.vlm_reasoning||{};
const act={MAINTAIN:"保持",FOLLOW:"跟随",DECELERATE:"减速",YIELD:"让行",STOP:"停车"}[dec.longitudinal]||dec.longitudinal||"";
let h='<div class="section"><h3>驾驶建议 · 行人显示ID锚定 F013</h3>';
h+=`<div class="adviceHero">${esc(adv.summary_zh||"当前帧暂无建议")}<div class="adviceMeta">${esc(act)} · ${esc(dec.urgency||"")} · ${esc(adv.primary_concern_zh||"无新增关键风险")}</div></div>`;
const chain=adv.critical_relation_chain||[];
if(chain.length){h+='<div class="section"><h3>关键实体关系</h3>';chain.slice(0,2).forEach((x,i)=>{h+=`<div class="item why"><b>${esc(x.subject_zh||x.subject_id)}</b> → ${esc(x.predicate_zh||x.predicate)} → <b>${esc(x.object_zh||x.object_id)}</b></div>`});h+='</div>'}
h+='<details class="evidenceDetails"><summary>展开详细证据与安全审计</summary>';
if((adv.secondary_concerns_zh||[]).length)h+=`<div class="item why"><b>次要关注</b>：${esc((adv.secondary_concerns_zh||[]).join("；"))}</div>`;
const facts=adv.explanation_facts||[];if(facts.length){h+='<div class="section"><h3>解释事实</h3>';facts.forEach(x=>h+=`<div class="item"><b>${esc(x.text_zh||"")}</b></div>`);h+='</div>'}
if(hazards.length){h+='<div class="section"><h3>驾驶风险</h3>';hazards.slice(0,6).forEach(v=>{const dm=v.distance_m!=null?` · ${Number(v.distance_m).toFixed(1)}m`:"";h+=`<div class="item hazard"><b>${esc(v.display_name_zh||v.type)}</b> <span class="pill">${esc(v.severity)}</span>${dm}<br><span class="muted">${esc(v.explanation_zh||"")}</span></div>`});h+='</div>'}
const sig=d.signal_explanations_zh||[];if(sig.length){h+='<div class="section"><h3>交通信号</h3>';sig.forEach(s=>h+=`<div class="item"><b>${esc(s.title_zh||"交通信号")}</b><br><span class="muted">${esc(s.explanation_zh||"")}</span></div>`);h+='</div>'}
const occ=(S.f&&S.f.occupancy_boxes)||[];if(occ.length){h+='<div class="section"><h3>多源确认残余障碍</h3>';occ.slice(0,5).forEach(o=>h+=`<div class="item"><b>${esc(o.display_name_zh||"物理残余")}</b> <span class="pill">${Number(o.distance_m||0).toFixed(1)}m</span></div>`);h+='</div>'}
const vh=vr.visual_hazards||[];h+='<div class="section"><h3>VLM 360°安全审计</h3>';if(vr.used){if(vh.length)vh.forEach(x=>h+=`<div class="item why"><b>${esc(x.zone||"周围")} · ${esc(x.hazard_type||"视觉安全假设")}</b><br><span class="muted">${esc(x.description_zh||"")}</span></div>`);else h+='<div class="muted">本帧未提出需要保留的新增视觉安全假设。</div>'}else h+='<div class="muted">本帧未调用 VLM 安全审计。</div>';h+='</div></details></div>';
$("#panel").innerHTML=h;
}
async function load(i){const seq=++__loadSeq;const idx=Math.max(0,Math.min(S.m.frame_count-1,Number(i)||0));$("#frame").value=idx;const f=await gj(`data/frames/${String(idx).padStart(6,"0")}.json`);const pts=await gp(`${f.semantic_point_file}`);if(seq!==__loadSeq)return;S.idx=idx;S.f=f;S.pts=pts;const sf=Number(S.f.source_frame_index??idx);$("#fv").textContent=`F${String(sf).padStart(3,"0")} · ${idx+1}/${S.m.frame_count}`;buildGround();S.lane=null;buildCams();panel();updateStaticCount();draw();document.documentElement.dataset.ltmapFrame=String(sf);document.documentElement.dataset.ltmapPoints=String(S.pts.n)}
function reset(){S.view={yaw:-.72,pitch:.92,roll:0,zoom:7,px:0,py:0,drag:null};S.lv={z:1,px:0,py:0,drag:null};draw()}
function bind(){$("#frame").min=0;$("#frame").max=S.m.frame_count-1;$("#frame").step=1;$("#frame").oninput=e=>load(+e.target.value);$("#frame").onchange=e=>load(+e.target.value);$("#conf").value=".30";$("#staticConf").value=".20";$("#conf").oninput=e=>{S.conf=+e.target.value;$("#confv").textContent=S.conf.toFixed(2);draw2d();draw()};$("#staticConf").oninput=e=>{S.staticConf=+e.target.value;$("#staticConfv").textContent=S.staticConf.toFixed(2);updateStaticCount();draw2d();draw()};$("#pointColor").onchange=e=>{S.pc=e.target.value;draw()};$("#showStatic").onchange=e=>{S.showStatic=e.target.checked;draw2d();draw()};$("#showOcc").onchange=e=>{S.showOcc=e.target.checked;draw()};$("#showMap").onchange=e=>{S.showMap=e.target.checked;draw()};$("#b3d").onclick=()=>{S.mode="3d";$("#b3d").classList.add("active");$("#blane").classList.remove("active");$("#lowerHint").textContent="左键平移 · 右键360°旋转 · 滚轮缩放";draw()};$("#blane").onclick=()=>{S.mode="lane";$("#blane").classList.add("active");$("#b3d").classList.remove("active");$("#lowerHint").textContent="左键平移 · 滚轮缩放 · Mask2Map米制矢量";draw()};$("#reset").onclick=reset;const c=$("#lowercv");c.oncontextmenu=e=>e.preventDefault();c.onmousedown=e=>{if(S.mode==="3d")S.view.drag={x:e.clientX,y:e.clientY,b:e.button,shift:e.shiftKey};else S.lv.drag={x:e.clientX,y:e.clientY}};window.addEventListener("mouseup",()=>{S.view.drag=null;S.lv.drag=null});window.addEventListener("mousemove",e=>{if(S.mode==="3d"&&S.view.drag){const dx=e.clientX-S.view.drag.x,dy=e.clientY-S.view.drag.y;S.view.drag.x=e.clientX;S.view.drag.y=e.clientY;if(S.view.drag.b===0){S.view.px+=dx;S.view.py+=dy}else if(S.view.drag.shift){S.view.roll+=dx*.007}else{S.view.yaw+=dx*.007;S.view.pitch+=dy*.007}draw()}else if(S.mode==="lane"&&S.lv.drag){S.lv.px+=e.clientX-S.lv.drag.x;S.lv.py+=e.clientY-S.lv.drag.y;S.lv.drag={x:e.clientX,y:e.clientY};draw()}});c.onwheel=e=>{e.preventDefault();if(S.mode==="3d")S.view.zoom=Math.max(2,Math.min(22,S.view.zoom*Math.exp(-e.deltaY*.001)));else S.lv.z=Math.max(.4,Math.min(4,S.lv.z*Math.exp(-e.deltaY*.001)));draw()};window.onresize=()=>{draw2d();draw()};
const __tp=new Map();
c.addEventListener("pointerdown",e=>{if(e.pointerType!=="touch")return;__tp.set(e.pointerId,{x:e.clientX,y:e.clientY});try{c.setPointerCapture(e.pointerId)}catch(_){}});
c.addEventListener("pointermove",e=>{if(e.pointerType!=="touch"||!__tp.has(e.pointerId))return;e.preventDefault();const old=__tp.get(e.pointerId),dx=e.clientX-old.x,dy=e.clientY-old.y;__tp.set(e.pointerId,{x:e.clientX,y:e.clientY});if(__tp.size===1){if(S.mode==="3d"){S.view.px+=dx;S.view.py+=dy}else{S.lv.px+=dx;S.lv.py+=dy}draw()}else if(__tp.size===2){const a=[...__tp.values()];const dist=Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y);const prev=Number(c.dataset.touchDist||dist);const ratio=prev>1?dist/prev:1;c.dataset.touchDist=String(dist);if(S.mode==="3d")S.view.zoom=Math.max(2,Math.min(22,S.view.zoom*ratio));else S.lv.z=Math.max(.4,Math.min(4,S.lv.z*ratio));draw()}} ,{passive:false});
const __tend=e=>{if(e.pointerType!=="touch")return;__tp.delete(e.pointerId);if(__tp.size<2)delete c.dataset.touchDist};c.addEventListener("pointerup",__tend);c.addEventListener("pointercancel",__tend)}
async function init(){S.m=await gj("data/manifest.json");S.d182=await gj("data/v18_2_decision_graph.json");bind();const hero=new URLSearchParams(location.search).get("hero")==="1";if(hero)document.documentElement.classList.add("hero-mode");await load(0);if(hero){let i=0;setInterval(()=>{i=(i+1)%Math.max(1,S.m.frame_count);load(i)},1700)}}
init().catch(e=>{console.error(e);document.body.innerHTML=`<pre>${e.stack||e}</pre>`});
