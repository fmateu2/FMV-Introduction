(() => {
 const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
 // Animation is automatic; only the device's accessibility preference reduces it.
 const applyMotion=()=>{document.documentElement.classList.toggle('reduced-motion',reducedMotion.matches);document.documentElement.classList.toggle('js-motion',!reducedMotion.matches);};
 applyMotion();
 reducedMotion.addEventListener('change',applyMotion);
 const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.07});
 document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
 const menu=document.querySelector('.menu-toggle');
 if(menu){menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));menu.textContent=open?'Close':'Menu';document.querySelector('.nav-links').classList.toggle('open',open)});document.querySelectorAll('.nav-links a').forEach(a=>a.addEventListener('click',()=>{menu.setAttribute('aria-expanded','false');menu.textContent='Menu';document.querySelector('.nav-links').classList.remove('open')}));}
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu){menu.setAttribute('aria-expanded','false');menu.textContent='Menu';document.querySelector('.nav-links').classList.remove('open')}});
 document.querySelectorAll('[data-copy-email]').forEach(btn=>btn.addEventListener('click',async()=>{const toast=document.querySelector('.toast');try{await navigator.clipboard.writeText('mateu.fra@gmail.com');toast.textContent='Email copied. Let’s talk!';}catch{toast.textContent='mateu.fra@gmail.com';}toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),3000)}));
})();
