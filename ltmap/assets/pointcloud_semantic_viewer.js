(function(){
  const D=window.LTMAP_SEMANTIC_FIXTURE;
  const canvas=document.getElementById('semPcCanvas');
  if(!D||!canvas)return;
  const ctx=canvas.getContext('2d',{alpha:false});
  const status=document.getElementById('semPcStatus');
  const viewSel=document.getElementById('semPcView');
  const resetBtn=document.getElementById('semPcReset');
  const pointSize=document.getElementById('semPcSize');
  const b64u8=s=>{const b=atob(s),a=new Uint8Array(b.length);for(let i=0;i<b.length;i++)a[i]=b.charCodeAt(i);return a;};
  const pos=new Int16Array(b64u8(D.positions_i16).buffer);
  const cls=b64u8(D.class_u8);
  const colors=D.colors||{};
  let yaw=-0.62,pitch=0.88,zoom=1.0,drag=false,lastX=0,lastY=0;

  function resize(){
    const dpr=Math.min(window.devicePixelRatio||1,1.75),w=Math.max(10,canvas.clientWidth),h=Math.max(10,canvas.clientHeight);
    const W=Math.round(w*dpr),H=Math.round(h*dpr);
    if(canvas.width!==W||canvas.height!==H){canvas.width=W;canvas.height=H;}
    ctx.setTransform(dpr,0,0,dpr,0,0);return [w,h];
  }
  function project(x,y,z,w,h){
    if(viewSel.value==='top'){
      const sc=Math.min(w,h)/(108/zoom);return [w*.50+x*sc,h*.52-y*sc];
    }
    const cy=Math.cos(yaw),sy=Math.sin(yaw),cp=Math.cos(pitch),sp=Math.sin(pitch);
    const xr=cy*x-sy*y,yr=sy*x+cy*y;
    const yp=cp*yr-sp*z*2.0;
    const sc=Math.min(w,h)/(108/zoom);
    return [w*.50+xr*sc,h*.55-yp*sc];
  }
  function drawGrid(w,h){
    ctx.fillStyle='#fbfcfd';ctx.fillRect(0,0,w,h);
    ctx.strokeStyle='#edf1f2';ctx.lineWidth=1;
    for(let i=1;i<10;i++){
      ctx.beginPath();ctx.moveTo(i*w/10,0);ctx.lineTo(i*w/10,h);ctx.stroke();
      ctx.beginPath();ctx.moveTo(0,i*h/10);ctx.lineTo(w,i*h/10);ctx.stroke();
    }
  }
  function draw(){
    const [w,h]=resize();drawGrid(w,h);
    const size=Number(pointSize.value||2.4);
    for(let i=0;i<D.count;i++){
      const o=i*3,x=pos[o]*D.scale,y=pos[o+1]*D.scale,z=pos[o+2]*D.scale;
      const p=project(x,y,z,w,h);if(p[0]<-5||p[0]>w+5||p[1]<-5||p[1]>h+5)continue;
      const lab=cls[i],col=colors[String(lab)]||'#9aa9ae';
      const r=lab===0?Math.max(1,size*.55):size;
      ctx.globalAlpha=lab===0?.55:.92;ctx.fillStyle=col;
      ctx.beginPath();ctx.arc(p[0],p[1],r,0,Math.PI*2);ctx.fill();
    }
    ctx.globalAlpha=1;
    status.textContent=`${D.count.toLocaleString()} semantic points · 8 classes · ${viewSel.value==='top'?'BEV':'3D'} view`;
  }
  function reset(){yaw=-0.62;pitch=0.88;zoom=1;draw();}
  canvas.addEventListener('pointerdown',e=>{drag=true;lastX=e.clientX;lastY=e.clientY;canvas.setPointerCapture(e.pointerId);});
  canvas.addEventListener('pointermove',e=>{if(!drag||viewSel.value==='top')return;const dx=e.clientX-lastX,dy=e.clientY-lastY;lastX=e.clientX;lastY=e.clientY;yaw+=dx*.007;pitch=Math.max(-1.35,Math.min(1.35,pitch+dy*.006));draw();});
  canvas.addEventListener('pointerup',()=>drag=false);canvas.addEventListener('pointercancel',()=>drag=false);
  canvas.addEventListener('wheel',e=>{e.preventDefault();zoom=Math.max(.45,Math.min(3.5,zoom*(e.deltaY>0?.91:1.1)));draw();},{passive:false});
  viewSel.addEventListener('change',()=>{if(viewSel.value==='top'){yaw=0;pitch=0;}else{yaw=-.62;pitch=.88;}draw();});
  pointSize.addEventListener('input',draw);resetBtn.addEventListener('click',reset);
  if('ResizeObserver'in window)new ResizeObserver(draw).observe(canvas);else window.addEventListener('resize',draw);
  draw();
})();
