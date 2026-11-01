/* Browser adaptation of the supplied forward_chaining.py; original behavior retained.
   The trace is a portfolio addition. No AI calls or database operations occur here. */
((root) => {
  function garmentFacts(g) {
    const a = g.normalized_attributes || {}, f = new Set();
    if (g.filename) f.add(`garment:${g.filename}`);
    if (a.garment_type) f.add(`garment_type:${a.garment_type}`);
    if (a.color) a.color.split('and').map(s => s.trim()).filter(Boolean).forEach(c => f.add(`color:${c}`));
    ['pattern','season','style','formality','occasion','material'].forEach(k => { if(a[k]) f.add(`${k}:${a[k]}`); });
    return f;
  }
  function derive(user, config) {
    const facts = new Set(Object.entries(user).filter(([,v]) => v != null && v !== '').map(([k,v]) => `${k}:${v}`));
    const r = config.rules;
    let previous;
    do {
      previous = facts.size;
      if (user.temperature != null) {
        const band = r.temperature_rules.rules.find(b => b.min <= Number(user.temperature) && Number(user.temperature) <= b.max);
        if (band) {
          facts.add(`temp_band:${band.name}`);
          (band.required || []).forEach(v => facts.add(`need:${v}`));
          (band.forbidden || []).forEach(v => facts.add(`forbid:${v}`));
        }
      }
      const form = r.formality_rules[user.formality] || {};
      (form.allowed || []).forEach(v => facts.add(`allowed_item:${v}`));
      (form.forbidden || []).forEach(v => facts.add(`forbid:${v}`));
      (r.pattern_rules[user.pattern] || []).forEach(v => facts.add(`compatible_with_pattern:${v}`));
      (r.color_matching.compatible_colors[user.color] || []).forEach(v => facts.add(`compatible_with_color:${v}`));
      const occ = (r.occasion_rules || {})[user.occasion] || {};
      (occ.allowed || []).forEach(v => facts.add(`allowed_item:${v}`));
      (occ.forbidden_styles || []).forEach(v => facts.add(`forbid_style:${v}`));
      (occ.forbidden_items || []).forEach(v => facts.add(`forbid:${v}`));
    } while(facts.size !== previous);
    return facts;
  }
  function rejection(g, facts, season) {
    const a = g.normalized_attributes || {}, reasons = [];
    if(a.style && facts.has(`forbid_style:${a.style}`)) reasons.push(`Style excluded: ${a.style}`);
    if(facts.has(`forbid:${a.garment_type}`)) reasons.push(`Category excluded: ${a.garment_type}`);
    if(a.specific_type && facts.has(`forbid:${a.specific_type}`)) reasons.push(`Item excluded: ${a.specific_type}`);
    if(season === 'summer' && ['winter','autumn'].includes(a.season) || season === 'winter' && a.season === 'summer') reasons.push(`Season mismatch: ${a.season}`);
    return reasons;
  }
  function score(g, facts, user) {
    const a = g.normalized_attributes || {}, gf = garmentFacts(g), reasons = [];
    if(user.occasion && a.occasion) {
      if(user.occasion === a.occasion) reasons.push(['Occasion match',10]);
      else if(a.garment_type !== 'outerwear') reasons.push(['Occasion mismatch',-5]);
    }
    if(user.formality && a.formality === user.formality) reasons.push(['Formality match',5]);
    [...gf].filter(f => f.startsWith('color:')).forEach(f => {if(facts.has(`compatible_with_color:${f.slice(6)}`)) reasons.push(['Compatible color',3]);});
    ['material','style','color'].forEach(k => {if(user[k] && gf.has(`${k}:${user[k]}`)) reasons.push([`${k} preference`,5]);});
    return {score:reasons.reduce((sum,[,v]) => sum+v,0),reasons};
  }
  function recommend(user, garments, config) {
    const facts = derive(user,config), allowed = [...facts].filter(f=>f.startsWith('allowed_item:')).map(f=>f.slice(13));
    const strict=[],fallback=[],excluded=[];
    garments.forEach(g => {
      const rejected=rejection(g,facts,user.season);
      if(rejected.length){excluded.push({garment:g,reasons:rejected});return;}
      const a=g.normalized_attributes || {}, item={garment:g,...score(g,facts,user),fallback:false};
      if(allowed.length && a.specific_type && !allowed.includes(a.specific_type)) {
        item.fallback=true;item.score-=20;item.reasons.push(['Fallback adjustment',-20]);fallback.push(item);
      } else strict.push(item);
    });
    strict.sort((a,b)=>b.score-a.score);fallback.sort((a,b)=>b.score-a.score);
    const ranked=[...strict,...fallback], outfit={top:null,bottom:null,shoes:null,extra:[]};
    ['top','bottom','shoes'].forEach(k=>{outfit[k]=ranked.find(c=>c.garment.normalized_attributes.garment_type===k)?.garment || null;});
    const selected=new Set(['top','bottom','shoes'].filter(k=>outfit[k]).map(k=>outfit[k]._id));
    const needs=[...facts].filter(f=>f.startsWith('need:')).map(f=>f.slice(5));
    needs.forEach(need=>{
      const target=['coat','jacket','puffer jacket','parka','trench coat','blazer'].includes(need)?'outerwear':['boots','sneakers','sandals','heels'].includes(need)?'shoes':need;
      if(target==='shoes' && outfit.shoes) return;
      const item=strict.find(c=>!selected.has(c.garment._id) && (c.garment.normalized_attributes.garment_type===target || c.garment.normalized_attributes.specific_type===need)) || fallback.find(c=>!selected.has(c.garment._id) && c.garment.normalized_attributes.garment_type===target);
      if(item){outfit.extra.push(item.garment);selected.add(item.garment._id);}
    });
    return {facts:[...facts],strict,fallback,excluded,outfit,needs};
  }
  const api={garmentFacts,derive,rejection,score,recommend};
  if(typeof module!=='undefined' && module.exports) module.exports=api;
  else root.WearWiseEngine=api;
})(typeof window!=='undefined'?window:globalThis);
