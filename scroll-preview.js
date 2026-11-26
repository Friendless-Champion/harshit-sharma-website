const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
if (!reducedMotion.matches && 'IntersectionObserver' in window) {
 const targets=[...document.querySelectorAll(
  'h1, h2, h3, .recognition-grid > article, .home-photo-grid > a, '+
  '.about-page-story > div, .about-page-details > article, .about-page-next > a, '+
  '.directory-heading, .directory-grid > article, .detail-section-heading, '+
  '.detail-work-row:not(.top-skills), .resume-section-title, .resume-entry, .contact-inner > h2'
 )].filter(element=>!element.closest('.intake-study, .gear-nav, .story-grid'));
 targets.filter(element=>element.matches('h1, h2, h3, .directory-heading, .detail-section-heading, .resume-section-title')).forEach(element=>{
  const heading=element.matches('h1,h2,h3')?element:element.querySelector('h2');
  if(!heading || heading.dataset.scrollRolling || heading.closest('.intake-study, .gear-nav'))return;
  heading.dataset.scrollRolling='true';
  const lines=[];
  let line=[];
  [...heading.childNodes].forEach(node=>{
   if(node.nodeName==='BR'){lines.push(line);line=[];}
   else{line.push(node);}
  });
  lines.push(line);
  heading.replaceChildren();
  lines.forEach((nodes,index)=>{
   const mask=document.createElement('span');
   mask.className='scroll-line-mask';
   const inner=document.createElement('span');
   inner.className='scroll-line-text';
   inner.style.setProperty('--line-delay',index*90+'ms');
   nodes.forEach(node=>inner.append(node));
   mask.append(inner);
   heading.append(mask);
  });
 });
 const observer=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
   if(entry.isIntersecting){
    entry.target.classList.add('scroll-arrived');
    observer.unobserve(entry.target);
   }
  });
 },{threshold:.08,rootMargin:'0px 0px -32px 0px'});
 targets.forEach((element,index)=>{
  if(element.getBoundingClientRect().top < innerHeight*.9)return;
  element.classList.add('scroll-entrance');
  element.style.setProperty('--entrance-delay', (index%3)*45+'ms');
  observer.observe(element);
 });
 reducedMotion.addEventListener('change',event=>{
  if(event.matches){
   observer.disconnect();
   targets.forEach(element=>element.classList.add('scroll-arrived'));
  }
 });
}

// Skill text rolls once on entering view, independently of navigation hover effects.
if (!matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
 const skills=[...document.querySelectorAll('.top-skills-list li, .detail-facts b, .detail-facts div > span')];
 const skillObserver=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
   if(entry.isIntersecting){
    entry.target.classList.add('skill-revealed');
    skillObserver.unobserve(entry.target);
   }
  });
 },{threshold:.35});
 skills.forEach(skill=>{
  const text=skill.querySelector('strong')||skill;
  const label=text.textContent;
  const visual=document.createElement('span');
  visual.className='skill-roll-text';visual.setAttribute('aria-hidden','true');
  [...label].forEach((character,index)=>{
   const clip=document.createElement('span');clip.className='skill-letter-mask';
   const letter=document.createElement('span');letter.className='skill-letter';
   letter.textContent=character===' '?'\u00a0':character;
   letter.style.setProperty('--skill-delay',Math.min(index*18,400)+'ms');
   clip.append(letter);visual.append(clip);
  });
  const readable=document.createElement('span');
  readable.className='skill-readable';readable.textContent=label;
  const lastLetter=visual.querySelector('.skill-letter-mask:last-child .skill-letter');
  lastLetter?.addEventListener('animationend',()=>{
   skill.classList.add('skill-settled');
  },{once:true});
  text.replaceChildren(readable,visual);
  skill.classList.add('skill-roll');
  skillObserver.observe(skill);
 });
 const skillMotion=matchMedia('(prefers-reduced-motion: reduce)');
 skillMotion.addEventListener('change',event=>{
  if(event.matches){
   skillObserver.disconnect();
   skills.forEach(skill=>skill.classList.add('skill-revealed'));
  }
 });
}

// Rounded image outlines follow the actual card perimeter, including its corner arcs.
document.querySelectorAll('.home-photo-grid a, .recognition-grid article, .directory-card, .resume-experience-card, .about-page-details article, .detail-photo-note, .science-awards-year, .debate-awards-year, .chapter').forEach(link=>{
 link.classList.add('rounded-trace-host');
 link.style.setProperty('border-color','transparent','important');
 const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
 svg.classList.add('image-trace');
 svg.setAttribute('aria-hidden','true');
 svg.setAttribute('focusable','false');
 const outline=document.createElementNS('http://www.w3.org/2000/svg','rect');
 outline.setAttribute('pathLength','1');
 const base=outline.cloneNode(false);
 base.classList.add('trace-base');
 svg.append(base,outline);link.append(svg);
 const fit=()=>{
  const bounds=link.getBoundingClientRect();
  const width=bounds.width,height=bounds.height;
  const style=getComputedStyle(link);
  const borderLeft=parseFloat(style.borderLeftWidth)||0;
  const borderTop=parseFloat(style.borderTopWidth)||0;
  svg.style.left=-borderLeft+'px';svg.style.top=-borderTop+'px';
  svg.style.width=width+'px';svg.style.height=height+'px';
  const radius=parseFloat(getComputedStyle(link).borderTopLeftRadius)||0;
  svg.setAttribute('viewBox','0 0 '+width+' '+height);
  outline.setAttribute('x','1.75');outline.setAttribute('y','1.75');
  outline.setAttribute('width',String(Math.max(0,width-3.5)));
  outline.setAttribute('height',String(Math.max(0,height-3.5)));
  outline.setAttribute('rx',String(Math.max(0,radius-1.75)));
  for(const attribute of ['x','y','width','height','rx'])base.setAttribute(attribute,outline.getAttribute(attribute));
 };
 new ResizeObserver(fit).observe(link);fit();
});

// Theme selection is shared across local pages and remembered on reload.
document.querySelectorAll('.scheme-toggle').forEach(button=>{
 const sync=()=>{const dark=document.documentElement.dataset.theme==='dark';button.setAttribute('aria-pressed',String(dark));button.setAttribute('aria-label',dark?'Dark scheme selected; switch to light scheme':'Light scheme selected; switch to dark scheme')};
 sync();
 button.addEventListener('click',()=>{
  const theme=document.documentElement.dataset.theme==='dark'?'light':'dark';
  document.documentElement.dataset.theme=theme;
  try{localStorage.setItem('portfolio-theme',theme)}catch{}
  sync();window.dispatchEvent(new Event('themechange'));window.dispatchEvent(new Event('resize'));
 });
});
