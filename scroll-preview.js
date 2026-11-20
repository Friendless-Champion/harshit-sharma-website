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
