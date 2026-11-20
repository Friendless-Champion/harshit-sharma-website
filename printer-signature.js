const canvas=document.querySelector('.printer-canvas');
if(canvas){
 const ctx=canvas.getContext('2d');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const points=[];
 const left=155,right=440,top=150,bottom=290,radius=42;
 // A continuous rounded rectangular toolpath, projected onto a shallow isometric plane.
 for(let corner=0;corner<4;corner++){
  const centers=[[right-radius,top+radius],[right-radius,bottom-radius],[left+radius,bottom-radius],[left+radius,top+radius]];
  const [x,y]=centers[corner];
  const start=-Math.PI/2+corner*Math.PI/2;
  for(let step=0;step<=32;step++){
   const angle=start+step/32*Math.PI/2;
   points.push({x:x+radius*Math.cos(angle),y:y+radius*Math.sin(angle)});
  }
 }
 points.push(points[0]);
 const segments=[];
 let total=0;
 for(let i=1;i<points.length;i++){
  const a=points[i-1],b=points[i],length=Math.hypot(b.x-a.x,b.y-a.y);
  segments.push({a,b,start:total,length});total+=length;
 }
 function project(p,offset=0){return {x:p.x,y:235+(p.y-220)*.52+(p.x-300)*.13+offset};}
 function path(progress,offset,color,width){
  ctx.beginPath();const first=project(points[0],offset);ctx.moveTo(first.x,first.y);
  let position=first;
  const distance=progress*total;
  for(const segment of segments){
   if(distance<segment.start)break;
   const fraction=Math.min(1,(distance-segment.start)/segment.length);
   position=project({x:segment.a.x+(segment.b.x-segment.a.x)*fraction,y:segment.a.y+(segment.b.y-segment.a.y)*fraction},offset);
   ctx.lineTo(position.x,position.y);
  }
  ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineJoin='round';ctx.lineCap='round';ctx.stroke();
  return position;
 }
 let phase=0,frame=0,last=0;
 let active=true;
 function draw(){
  ctx.clearRect(0,0,600,440);
  const travel=Math.min(1,phase/.80);
  const lift=Math.max(0,Math.min(1,(phase-.87)/.10));
  const smooth=lift*lift*(3-2*lift);
  const shift=phase*2.5;
  // Finish the perimeter, lift the toolhead, then settle the stack for the next layer.
  for(let layer=31;layer>=0;layer--){
   const depth=layer+1;
   const alpha=Math.max(0,1-depth/33);
   path(1,depth*2.5+shift,'rgba(245,158,11,'+(alpha*.65)+')',1.65);
   path(1,depth*2.5+shift-1,'rgba(255,210,115,'+(alpha*.5)+')',1);
  }
  const tip=path(travel,shift,'#F59E0B',2);
  path(travel,shift-1,'#fbd477',1);
  // Unbranded light front housing with an exposed drive indicator and dark hotend shroud.
  const x=tip.x,y=tip.y-smooth*2.5;
  ctx.save();ctx.translate(x,y);ctx.scale(.88,.88);ctx.translate(-x,-y);
  // Plain P1-inspired cover with a central cooling fan and tapered lower duct.
  ctx.fillStyle='#273543';
  ctx.beginPath();ctx.roundRect(x-36,y-107,72,79,6);ctx.fill();
  const shell=ctx.createLinearGradient(x-43,y-100,x+38,y-29);
  shell.addColorStop(0,'#e4e9ed');shell.addColorStop(1,'#a7b2bc');
  ctx.fillStyle=shell;ctx.strokeStyle='#94a3b8';ctx.lineWidth=1.1;
  ctx.beginPath();ctx.moveTo(x-44,y-103);ctx.lineTo(x+44,y-103);
  ctx.lineTo(x+42,y-47);ctx.quadraticCurveTo(x+40,y-34,x+25,y-28);
  ctx.lineTo(x-25,y-28);ctx.quadraticCurveTo(x-40,y-34,x-42,y-47);
  ctx.closePath();ctx.fill();ctx.stroke();
  ctx.fillStyle='#25313c';ctx.beginPath();ctx.arc(x,y-62,25,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle='#778795';ctx.lineWidth=2;ctx.stroke();
  ctx.save();ctx.translate(x,y-62);ctx.rotate(phase*Math.PI*6);
  for(let blade=0;blade<7;blade++){
   ctx.rotate(Math.PI*2/7);
   ctx.beginPath();ctx.ellipse(0,-13,5,11,.55,0,Math.PI*2);
   ctx.fillStyle='#475569';ctx.fill();
  }
  ctx.restore();
  ctx.beginPath();ctx.arc(x,y-62,7,0,Math.PI*2);ctx.fillStyle='#94a3b8';ctx.fill();
  ctx.strokeStyle='#657585';ctx.lineWidth=1.2;
  for(const radius of [12,20]){
   ctx.beginPath();ctx.arc(x,y-62,radius,0,Math.PI*2);ctx.stroke();
  }
  ctx.fillStyle='#1b2733';
  ctx.beginPath();ctx.moveTo(x-26,y-28);ctx.lineTo(x+26,y-28);
  ctx.lineTo(x+18,y-12);ctx.lineTo(x-18,y-12);ctx.closePath();ctx.fill();
  ctx.fillStyle='#0F172A';ctx.fillRect(x-15,y-25,30,6);
  ctx.beginPath();ctx.moveTo(x-7,y-12);ctx.lineTo(x+7,y-12);
  ctx.lineTo(x+2,y-1);ctx.lineTo(x-2,y-1);ctx.closePath();ctx.fillStyle='#bd9547';ctx.fill();
  ctx.restore();

 }
 function resize(){
  const rect=canvas.getBoundingClientRect(),scale=Math.min(devicePixelRatio||1,2);
  canvas.width=Math.round(rect.width*scale);canvas.height=Math.round(rect.height*scale);
  ctx.setTransform(canvas.width/600,0,0,canvas.height/440,0,0);
  ctx.translate(300,230);ctx.scale(1.56,1.56);ctx.translate(-300,-230);draw();
 }
 function animate(time){
  if(!active||reduced.matches)return;
  const delta=last?Math.min(time-last,60):0;last=time;
  phase=(phase+delta/5500)%1;draw();frame=requestAnimationFrame(animate);
 }
 function resume(){
  cancelAnimationFrame(frame);last=0;
  if(active&&!reduced.matches)frame=requestAnimationFrame(animate);
  else draw();
 }
 new ResizeObserver(resize).observe(canvas);
 new IntersectionObserver(entries=>{active=entries[0].isIntersecting&&!document.hidden;resume();}).observe(canvas);
 document.addEventListener('visibilitychange',()=>{active=!document.hidden;resume();});
 reduced.addEventListener('change',resume);
 resize();resume();
 addEventListener('pagehide',()=>cancelAnimationFrame(frame),{once:true});
}
