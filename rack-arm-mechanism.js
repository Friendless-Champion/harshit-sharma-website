const svg=document.getElementById('intake-mechanism'),T=document.getElementById('intake-travel'),PL=document.getElementById('intake-play'),
LK=document.getElementById('intake-link-arm'),AR=document.getElementById('intake-arm-angle'),PC=document.getElementById('intake-position');
const D=85,H1L=[72,118],AL=[240,-12],L=345,HUB1=[-47,-205],HUB2=[-502,-123];
const OUT='#0c0c0d',lerp=(a,b,t)=>a+(b-a)*t,f=n=>n.toFixed(1);
// rack outline with teeth
let rd='M-55,-24 L745,-24 L795,36 L790,52 L768,58 L758,48 L755,28';
for(let x=744;x>-45;x-=23)rd+=` L${x},28 L${x-4},40 L${x-14},40 L${x-23},28`;
rd+=' L-55,28 Z';
const holes=[0,1,2,3,4,5].map(k=>`<circle cx="${141*k}" cy="0" r="10" fill="#b8bcc2" stroke="${OUT}" stroke-width="2.5"/>`).join('');
const rack=`<path d="${rd}" fill="url(#rg)" stroke="${OUT}" stroke-width="2.5" stroke-linejoin="round"/><rect x="690" y="-22" width="62" height="48" rx="3" fill="none" stroke="${OUT}" stroke-width="1.5"/><circle cx="730" cy="-8" r="3" fill="#222"/><circle cx="716" cy="16" r="3" fill="#222"/><circle cx="742" cy="12" r="3" fill="#222"/>${holes}`;
const tick=(r,d)=>`<g transform="rotate(${f(d)})"><line x1="0" y1="0" x2="0" y2="${-r}" stroke="#8bd35a" stroke-width="3"/><line x1="0" y1="0" x2="${r}" y2="0" stroke="#ef6b6b" stroke-width="3"/></g>`;
const stad=(a,b,r)=>`<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="${OUT}" stroke-linecap="round" stroke-width="${2*r+6}"/><line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="#34363a" stroke-linecap="round" stroke-width="${2*r}"/>`;
const pulley=(c,r,d)=>`<g transform="translate(${c[0]},${c[1]})"><circle r="${r}" fill="#17181a" stroke="${OUT}" stroke-width="3"/><circle r="${r*.7}" fill="#eef2f6" stroke="${OUT}" stroke-width="2"/><circle r="${r*.3}" fill="#17181a"/><circle r="${r*.14}" fill="#eef2f6"/>${tick(r*.9,d)}</g>`;
const gear=(c,r,d)=>`<g transform="translate(${c[0]},${c[1]}) rotate(${f(d)})"><circle r="${r}" fill="#2b2d30" stroke="${OUT}" stroke-width="2.5"/><circle r="${r-3}" fill="none" stroke="#6d7076" stroke-width="7" stroke-dasharray="${f(r*.17)} ${f(r*.17)}"/><circle r="${r*.55}" fill="#24262a" stroke="${OUT}" stroke-width="2"/><circle r="${r*.3}" fill="#17181a" stroke="#8a8e94" stroke-width="2"/><circle cx="${r*.78}" cy="0" r="2.5" fill="#8a8e94"/></g>`;
const bolt=(x,y,r=9)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="#2a2b2e" stroke="${OUT}" stroke-width="2"/><circle cx="${x}" cy="${y}" r="${r*.4}" fill="#9a9ea4" stroke="${OUT}" stroke-width="1"/>`;
const pinionSvg=d=>{let q=`<g transform="rotate(${f(d)})">`;for(let i=0;i<12;i++){const w=i*Math.PI/6;q+=`<circle cx="${f(43*Math.cos(w))}" cy="${f(43*Math.sin(w))}" r="7" fill="#2a2c2f" stroke="${OUT}" stroke-width="2"/>`}
 return q+`<circle r="39" fill="#2a2c2f"/><circle r="26" fill="#17181a" stroke="#9a9ea4" stroke-width="3"/><circle r="12" fill="#26272a" stroke="#777" stroke-width="2"/><line x1="0" y1="0" x2="0" y2="-20" stroke="#8a8e94" stroke-width="2"/></g>`};
const defs='<defs><linearGradient id="rg" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="800" y2="0"><stop offset="0" stop-color="#34373b"/><stop offset="1" stop-color="#8a8f95"/></linearGradient><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2d2f32"/><stop offset="1" stop-color="#474c52"/></linearGradient></defs>';
function render(t,at){
 const al=-100*Math.PI/180,u=[-Math.sin(al),Math.cos(al)],Tp=[D*Math.cos(al),D*Math.sin(al)];
 const xr=lerp(-30,421,t),th=Math.atan2(u[1],u[0])*180/Math.PI;
 const H=[Tp[0]-xr*u[0],Tp[1]-xr*u[1]],hub=[H[0]-H1L[0],H[1]-H1L[1]];
 const pin=-xr/44*180/Math.PI,big=-pin*.4,sm=-big*50/18;
 const A=[hub[0]+AL[0],hub[1]+AL[1]],g=lerp(145.6,102.6,at)*Math.PI/180,E=[A[0]+L*Math.cos(g),A[1]+L*Math.sin(g)];
 const hd=t*720;
 const base=`<polygon points="-143,12 -95,4 -31,-26 42,-44 227,-177 245,-202 268,-227 304,-234 320,-202 322,-97 312,-40 272,246 -131,246 -143,234" fill="url(#bg)" stroke="${OUT}" stroke-width="3" stroke-linejoin="round"/>
 ${[[-107,175],[-83,175],[-107,223],[-83,223],[228,175],[252,175],[228,223],[252,223],[84,175],[132,175],[181,175]].map(p=>bolt(...p)).join('')}
 ${[[256,-207],[250,-183],[305,-222],[308,-194]].map(p=>bolt(...p,8)).join('')}
 <rect x="40" y="48" width="175" height="148" rx="34" fill="#303337" stroke="${OUT}" stroke-width="2.5"/>
 ${stad([-97,56],[90,103],20)}${stad([-97,56],[0,0],12)}
 ${gear([90,103],50,big)}${gear([150,105],18,sm)}${[[155,73],[182,90],[153,140]].map(p=>bolt(...p,6)).join('')}
 <circle cx="-97" cy="56" r="31" fill="#17181a" stroke="${OUT}" stroke-width="3"/><circle cx="-97" cy="56" r="25" fill="#cfd0d2" stroke="${OUT}" stroke-width="2"/><circle cx="-97" cy="56" r="15" fill="#121214" stroke="#555" stroke-width="2"/><circle cx="-97" cy="56" r="4" fill="#888"/>
 ${pinionSvg(pin)}`;
 const block=`<g transform="translate(${f(hub[0])},${f(hub[1])})"><polygon points="-81,-113 14,-113 256,-37 273,-21 274,30 262,60 60,110 30,160 3,166 -30,150 -47,115 -60,60 -81,-40" fill="#323437" stroke="${OUT}" stroke-width="3" stroke-linejoin="round"/>
 <circle cx="3" cy="115" r="50" fill="#323437" stroke="${OUT}" stroke-width="3"/>
 <rect x="-81" y="-113" width="95" height="48" fill="#2b2d30" stroke="${OUT}" stroke-width="2"/><rect x="-90" y="-100" width="9" height="22" fill="#2b2d30" stroke="${OUT}" stroke-width="2"/>
 ${[-58,-34,-10].map(x=>bolt(x,-89,8)).join('')}
 ${stad([0,0],[3,115],24)}
 <circle r="56" fill="#26272a" stroke="${OUT}" stroke-width="3"/>${[[-1,-49],[-48,-1],[48,-1]].map(p=>bolt(...p,7)).join('')}
 <circle r="38" fill="#17181a" stroke="${OUT}" stroke-width="2"/>
 ${pulley([0,0],24,hd)}${pulley([3,115],27,-hd*.8)}
 <line x1="72" y1="70" x2="268" y2="28" stroke="${OUT}" stroke-width="22" stroke-linecap="round"/><line x1="72" y1="70" x2="268" y2="28" stroke="#1f2022" stroke-width="17" stroke-linecap="round"/>
 <circle cx="${AL[0]}" cy="${AL[1]}" r="11" fill="#1f2022" stroke="${OUT}" stroke-width="2.5"/>
 <circle cx="${H1L[0]}" cy="${H1L[1]}" r="9" fill="#cfd4da" stroke="${OUT}" stroke-width="2"/></g>`;
 const rk=`<g transform="translate(${f(H[0])},${f(H[1])}) rotate(${f(th)})">${rack}</g><g transform="translate(${f(Tp[0])},${f(Tp[1])}) rotate(${f(th)})"><rect x="30" y="-90" width="290" height="115" rx="22" fill="#a9afb7" fill-opacity=".26" stroke="${OUT}" stroke-width="2.5"/><line x1="40" y1="-58" x2="312" y2="-58" stroke="${OUT}" stroke-opacity=".6" stroke-width="1.5"/><line x1="40" y1="-38" x2="312" y2="-38" stroke="${OUT}" stroke-opacity=".6" stroke-width="1.5"/>${[[45,8],[130,-72],[250,-78],[285,2]].map(p=>bolt(...p,7)).join('')}</g>`;
 const nut=x=>`<circle cx="${x}" cy="0" r="11" fill="#9aa3ad" stroke="${OUT}" stroke-width="2.5"/><circle cx="${x}" cy="0" r="5.5" fill="#d9dde2" stroke="${OUT}" stroke-width="1.5"/><circle cx="${x}" cy="0" r="2" fill="#2a2b2e"/>`;
 const arm=`<g transform="translate(${f(A[0])},${f(A[1])}) rotate(${f(g*180/Math.PI)})"><path d="M-95.5,-13 L-28,-13 Q-12,-13 -8,-23.5 L5,-23.5 L345,-14 A14,14 0 0 1 345,14 L5,23.5 L-8,23.5 Q-12,13 -28,13 L-95.5,13 A13,13 0 0 1 -95.5,-13 Z" fill="#6a6a6a" stroke="${OUT}" stroke-width="2.5" stroke-linejoin="round"/>${nut(-95.5)}${nut(0)}${nut(345)}</g>`;
 svg.innerHTML=defs+base+block+rk+arm;
 PC.textContent=Math.round(t*100)+'%';
}
function cur(){const t=T.value/1000;return [t,LK.checked?t:AR.value/1000]}
function draw(){const [t,a]=cur();render(t,a)}
let playing=false,ph=0,last=0;
function loop(ts){if(!playing)return;const dt=Math.min(ts-last,50);last=ts;ph+=dt/3200;
 const t=.5-.5*Math.cos(ph*Math.PI*2);T.value=Math.round(t*1000);if(LK.checked)AR.value=T.value;draw();requestAnimationFrame(loop)}
function setPlaying(next){playing=next;PL.textContent=playing?'Pause':'Play';PL.setAttribute('aria-pressed',String(playing));if(playing){ph=Math.acos(1-2*T.value/1000)/(Math.PI*2);last=performance.now();requestAnimationFrame(loop)}}
PL.onclick=()=>setPlaying(!playing);
T.oninput=()=>{if(playing){playing=false;PL.textContent='Play';PL.setAttribute('aria-pressed','false')}if(LK.checked)AR.value=T.value;draw()};
AR.oninput=draw;
LK.onchange=()=>{AR.disabled=LK.checked;if(LK.checked)AR.value=T.value;draw()};
draw();
setPlaying(true);
