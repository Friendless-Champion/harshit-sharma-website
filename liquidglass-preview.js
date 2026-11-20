import { LiquidGlass } from './assets/vendor/liquidglass/index.js';
const header = document.querySelector('.topbar');
const navigation = header?.querySelector('nav');
if (header && navigation && !matchMedia('(prefers-reduced-transparency: reduce)').matches) {
 const background = document.createElement('canvas');
 background.className = 'glass-grid-source';
 background.setAttribute('aria-hidden','true');
 header.prepend(background);
 function paint() {
  const rect=header.getBoundingClientRect();
  const scale=Math.min(devicePixelRatio,2);
  background.width=rect.width*scale;
  background.height=rect.height*scale;
  const ctx=background.getContext('2d');
  ctx.scale(scale,scale);
  ctx.fillStyle='#0F172A';
  ctx.fillRect(0,0,rect.width,rect.height);
  ctx.fillStyle='rgba(148,163,184,.18)';
  for(let x=10-(rect.left%20);x<rect.width;x+=20) for(let y=10-((rect.top+scrollY)%20);y<rect.height;y+=20) {
   ctx.beginPath();ctx.arc(x,y,.8,0,Math.PI*2);ctx.fill();
  }
 }
 paint();
 navigation.dataset.config=JSON.stringify({
  floating:false,cornerRadius:14,zRadius:12,blurAmount:.08,
  refraction:.65,chromAberration:.025,edgeHighlight:.25,
  specular:.12,fresnel:.45,shadowOpacity:0,tintStrength:.06
 });
 try {
  const instance=await LiquidGlass.init({root:header,glassElements:[navigation]});
  navigation.classList.add('glass-ready');
  addEventListener('resize',()=>{paint();instance.markChanged(background);});
  addEventListener('scroll',()=>{paint();instance.markChanged(background);},{passive:true});
  window.addEventListener('pagehide',()=>instance.destroy(),{once:true});
 } catch(error) {
  background.remove();
  console.warn('Glass preview is using its CSS fallback.');
 }
}
