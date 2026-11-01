/* Interactive portfolio presentation. Inputs and example garments stay in this browser. */
(() => {
  const form=document.getElementById('wardrobe-context');
  if(!form) return;
  const data=window.WEARWISE_DATA, engine=window.WearWiseEngine;
  const fields=['temperature','season','formality','occasion'];
  const palette={white:'#eeeade',navy_blue:'#554b8c',beige:'#cfb88d',black:'#363637',gray:'#9b9a96',brown:'#926c4c',military_green:'#73825a'};
  const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const pretty=s=>String(s).replaceAll('_',' ');
  function illustration(g) {
    const a=g.normalized_attributes, fill=palette[a.color] || '#d3c9ea';
    let shape;
    if(a.garment_type==='bottom') shape='<path d="M42 28h76l6 106H92L80 62 68 134H36z"/><path d="M42 42h76M80 28v34" fill="none"/>';
    else if(a.garment_type==='shoes') shape='<path d="M31 65h29l14 21 39 7q16 4 17 18v12H29q-9 0-9-10z"/><path d="M21 112h109M65 84l15-7m-6 14 15-7m-6 14 15-7" fill="none"/>';
    else shape='<path d="m50 30 20-7q10 13 20 0l20 7 26 24-16 24-15-12v70H55V66L40 78 24 54z"/><path d="M70 23q10 25 20 0" fill="none"/>'+(a.garment_type==='outerwear'?'<path d="M80 40v96M55 76h50M55 99h50M55 121h50" fill="none"/>':'');
    return `<svg viewBox="0 0 160 160" aria-hidden="true"><g fill="${fill}" stroke="#252822" stroke-width="2" stroke-linejoin="round">${shape}</g></svg>`;
  }
  function card(g,slot,result) {
    if(!g) return `<article class="outfit-card empty"><span class="mono">${slot}</span><div class="empty-garment">—</div><h4>No available match</h4><p>This slot remains open.</p></article>`;
    const ranked=[...result.strict,...result.fallback].find(c=>c.garment._id===g._id),a=g.normalized_attributes;
    return `<article class="outfit-card"><span class="mono">${slot}</span><div class="garment-art">${illustration(g)}</div><h4>${escape(g.name)}</h4><p>${escape(pretty(a.material))} · ${escape(pretty(a.color))}</p><div class="garment-score"><b>${ranked.score>0?'+':''}${ranked.score}</b><span>${ranked.fallback?'Fallback option':'Strict candidate'}</span></div><ul>${ranked.reasons.map(([label,points])=>`<li>${escape(label)} <b>${points>0?'+':''}${points}</b></li>`).join('') || '<li>No scoring bonuses</li>'}</ul></article>`;
  }
  function update() {
    const user=Object.fromEntries(fields.map(k=>[k,form.elements[k].value]));user.temperature=Number(user.temperature);
    document.getElementById('temperature-value').textContent=`${user.temperature}°C`;
    const result=engine.recommend(user,data.garments,data.config),band=result.facts.find(f=>f.startsWith('temp_band:'))?.slice(10) || 'unmatched';
    document.getElementById('context-caption').textContent=`${pretty(user.season)} · ${user.temperature}°C · ${pretty(user.occasion)}`;
    document.getElementById('outfit-results').innerHTML=['top','bottom','shoes'].map(k=>card(result.outfit[k],k.toUpperCase(),result)).join('') + result.outfit.extra.map(g=>card(g,'EXTRA',result)).join('');
    document.getElementById('rules-summary').textContent=`${pretty(band)} · ${result.strict.length} strict candidates · ${result.fallback.length} fallback candidates · ${result.excluded.length} excluded`;
    document.getElementById('derived-facts').innerHTML=result.facts.filter(f=>!fields.some(k=>f.startsWith(k+':'))).map(f=>`<span>${escape(f)}</span>`).join('');
    const selected=[result.outfit.top,result.outfit.bottom,result.outfit.shoes,...result.outfit.extra].filter(Boolean);
    const unmet=result.needs.filter(n=>!selected.some(g=>g.normalized_attributes.specific_type===n || g.normalized_attributes.garment_type===n));
    document.getElementById('outfit-notice').textContent=unmet.length?`Requests without an exact match: ${unmet.map(pretty).join(', ')}. The original engine fills available slots and can use broader categories or fallback items.`:'Every requested item has an exact match in this selection.';
    document.getElementById('excluded-items').innerHTML=result.excluded.map(c=>`<li><b>${escape(c.garment.name)}</b><span>${c.reasons.map(escape).join(' · ')}</span></li>`).join('') || '<li>No garments excluded by these conditions.</li>';
  }
  form.addEventListener('input',update);form.addEventListener('change',update);form.addEventListener('submit',e=>e.preventDefault());
  const presets={winter:{temperature:0,season:'winter',formality:'business_casual',occasion:'work'},spring:{temperature:18,season:'spring',formality:'business_casual',occasion:'work'},summer:{temperature:28,season:'summer',formality:'casual',occasion:'travel'}};
  document.querySelectorAll('[data-outfit-preset]').forEach(b=>b.addEventListener('click',()=>{Object.entries(presets[b.dataset.outfitPreset]).forEach(([k,v])=>{form.elements[k].value=v;});update();}));
  update();
})();
