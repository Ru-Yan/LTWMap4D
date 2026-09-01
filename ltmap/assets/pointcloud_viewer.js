(function(){
  const D=window.LTMAP_WEBGL;
  const canvas=document.getElementById('pcCanvas');
  if(!D||!canvas){return;}
  const ctx=canvas.getContext('2d',{alpha:false});
  const slider=document.getElementById('pcFrame');
  const frameText=document.getElementById('pcFrameText');
  const camImg=document.getElementById('pcCam');
  const camText=document.getElementById('pcCamText');
  const status=document.getElementById('pcStatus');
  const accum=document.getElementById('pcAccum');
  const semantic=document.getElementById('pcSemantic');
  const showMap=document.getElementById('pcMap');
  const showTrack=document.getElementById('pcTrack');
  const viewSel=document.getElementById('pcView');
  const playBtn=document.getElementById('pcPlay');
  const resetBtn=document.getElementById('pcReset');
  const keys=['a020','a021','a022','a023'];
  let idx=0,yaw=-0.58,pitch=1.08,zoom=1,drag=false,lastX=0,lastY=0,playing=true,timer=null;
  const palette=['#65777d','#3478c9','#e6783c','#7457aa','#8a6b48','#74858a','#d85858','#2f956d','#36a6bf'];
  function b64u8(s){const b=atob(s),a=new Uint8Array(b.length);for(let i=0;i<b.length;i++)a[i]=b.charCodeAt(i);return a;}
  const pos=new Int16Array(b64u8(D.positions_i16).buffer);
  const cls=b64u8(D.class_u8),fidx=b64u8(D.frame_u8);
  function resize(){const dpr=Math.min(window.devicePixelRatio||1,1.6),w=Math.max(10,canvas.clientWidth),h=Math.max(10,canvas.clientHeight),W=Math.round(w*dpr),H=Math.round(h*dpr);if(canvas.width!==W||canvas.height!==H){canvas.width=W;canvas.height=H;}ctx.setTransform(dpr,0,0,dpr,0,0);return [w,h];}
  function project(x,y,z,w,h){
    const cy=Math.cos(yaw),sy=Math.sin(yaw),cp=Math.cos(pitch),sp=Math.sin(pitch);
    const xr=cy*x-sy*y, yr=sy*x+cy*y;
    const yp=cp*yr-sp*z*2.2;
    const sc=Math.min(w,h)/(112/zoom);
    return [w*0.50+xr*sc,h*0.53-yp*sc];
  }
  function drawPointCloud(w,h){
    const m=D.frames[idx]; const end=accum.checked?m.cumulative:m.offset+m.count; const start=accum.checked?0:m.offset;
    const n=end-start; const stride=Math.max(1,Math.ceil(n/52000));
    ctx.globalAlpha=.86;
    for(let i=start;i<end;i+=stride){
      const base=i*3; const x=pos[base]*.01,y=pos[base+1]*.01,z=pos[base+2]*.01;
      if(Math.abs(x)>72||Math.abs(y)>72||z<-5||z>9)continue;
      const p=project(x,y,z,w,h); if(p[0]<-3||p[0]>w+3||p[1]<-3||p[1]>h+3)continue;
      const c=cls[i]; ctx.fillStyle=(semantic.checked&&c>0)?palette[c]:'#6b7e84';
      const r=c>0?1.75:1.05; ctx.fillRect(p[0]-r*.5,p[1]-r*.5,r,r);
    }
    ctx.globalAlpha=1;
  }
  function drawMapLayer(w,h){
    if(!showMap.checked)return; const map=D.maps[keys[idx]]; if(!map||!map.count)return;
    const q=new Int16Array(b64u8(map.q).buffer),mc=b64u8(map.cls);
    for(let i=0;i<map.count;i++){
      const x=q[i*3]*.01,y=q[i*3+1]*.01,z=q[i*3+2]*.01; const p=project(x,y,z,w,h); const c=mc[i];
      ctx.fillStyle=c===6?'#d85858':c===7?'#2f956d':'#36a6bf'; ctx.beginPath();ctx.arc(p[0],p[1],2.7,0,Math.PI*2);ctx.fill();
    }
  }
  function drawTracks(w,h){
    if(!showTrack.checked)return; const ts=D.tracks[keys[idx]]||[];
    for(const t of ts){const col=palette[t.cls]||'#536970';ctx.strokeStyle=col;ctx.lineWidth=2;ctx.globalAlpha=.82;ctx.beginPath();t.pts.forEach((p,j)=>{const q=project(p[0],p[1],p[2],w,h);if(j===0)ctx.moveTo(q[0],q[1]);else ctx.lineTo(q[0],q[1]);});ctx.stroke();const p=t.pts[t.pts.length-1],q=project(p[0],p[1],p[2],w,h);ctx.globalAlpha=1;ctx.fillStyle=col;ctx.beginPath();ctx.arc(q[0],q[1],4,0,Math.PI*2);ctx.fill();}
  }
  function draw(){const [w,h]=resize();ctx.fillStyle='#f8fafb';ctx.fillRect(0,0,w,h);ctx.strokeStyle='#e6ecee';ctx.lineWidth=1;for(let i=1;i<10;i++){ctx.beginPath();ctx.moveTo(i*w/10,0);ctx.lineTo(i*w/10,h);ctx.stroke();ctx.beginPath();ctx.moveTo(0,i*h/10);ctx.lineTo(w,i*h/10);ctx.stroke();}drawPointCloud(w,h);drawMapLayer(w,h);drawTracks(w,h);}
  function update(){idx=Number(slider.value)||0;const m=D.frames[idx],key=keys[idx],shown=accum.checked?m.cumulative:m.count;frameText.textContent='FRAME '+String(m.frame).padStart(3,'0');camImg.src=D.camera[key];camText.textContent='CAM_FRONT · frame '+String(m.frame).padStart(3,'0');status.innerHTML='当前帧 '+m.count.toLocaleString()+' 点<br>累计 '+m.cumulative.toLocaleString()+' 点<br>'+m.current_entities+' 个当前实体<br>绘制 '+shown.toLocaleString()+' 点（自适应抽样）';draw();}
  function setView(mode){if(mode==='top'){yaw=0;pitch=0;zoom=1.06;}else{yaw=-0.58;pitch=1.08;zoom=1;}draw();}
  canvas.addEventListener('pointerdown',e=>{drag=true;lastX=e.clientX;lastY=e.clientY;canvas.setPointerCapture(e.pointerId);});
  canvas.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-lastX,dy=e.clientY-lastY;lastX=e.clientX;lastY=e.clientY;yaw+=dx*.007;pitch=Math.max(-1.35,Math.min(1.35,pitch+dy*.006));draw();});
  canvas.addEventListener('pointerup',()=>drag=false);canvas.addEventListener('pointercancel',()=>drag=false);
  canvas.addEventListener('wheel',e=>{e.preventDefault();zoom=Math.max(.45,Math.min(3.2,zoom*(e.deltaY>0?.91:1.1)));draw();},{passive:false});
  slider.addEventListener('input',update);[accum,semantic,showMap,showTrack].forEach(x=>x.addEventListener('change',update));viewSel.addEventListener('change',()=>setView(viewSel.value));resetBtn.addEventListener('click',()=>setView(viewSel.value));
  function stop(){if(timer){clearInterval(timer);timer=null;}} function start(){stop();timer=setInterval(()=>{slider.value=(Number(slider.value)+1)%4;update();},1050);}
  playBtn.addEventListener('click',()=>{playing=!playing;playBtn.textContent=playing?'暂停':'播放';if(playing)start();else stop();});
  if('ResizeObserver'in window)new ResizeObserver(draw).observe(canvas); else window.addEventListener('resize',draw);
  setView('3d');update();start();
})();
