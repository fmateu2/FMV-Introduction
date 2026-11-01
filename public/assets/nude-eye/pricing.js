/* Portfolio illustration of the Java product methods, not the original application. */
(() => {
  const kind=document.getElementById('product-kind'); if(!kind)return;
  const base=document.getElementById('base-price'), vat=document.getElementById('apply-vat'), hours=document.getElementById('service-hours'), expiry=document.getElementById('near-expiry');
  function update(){
    const type=kind.value;
    document.getElementById('service-options').hidden=type!=='service';
    document.getElementById('expiry-options').hidden=type!=='consumable';
    const price=Number(base.value),duration=Number(hours.value);
    const total=document.getElementById('price-total'),formula=document.getElementById('price-formula'),description=document.getElementById('price-behavior');
    if(base.value==='' || !Number.isFinite(price) || price<0 || price>10000 || type==='service' && (hours.value==='' || !Number.isFinite(duration) || duration<.25 || duration>24)){
      total.textContent='—';formula.textContent='Enter valid example values.';description.textContent='Use a price from €0 to €10,000 and a duration from 0.25 to 24 hours.';return;
    }
    let result=price;const parts=[price.toFixed(2)];
    if(type==='service'){result*=duration;parts.push(duration.toFixed(2)+' hours');}
    if(vat.checked){const multiplier=type==='lenses'?1.10:1.21;result*=multiplier;parts.push(multiplier.toFixed(2));}
    if(type==='consumable' && expiry.checked){result*=.60;parts.push('0.60');}
    formula.textContent=parts.join(' × ');total.textContent=new Intl.NumberFormat('en-IE',{style:'currency',currency:'EUR'}).format(result);
    description.textContent={glasses:'Glasses inherit the physical-product pricing behavior.',lenses:'ContactLens overrides the method with the project’s reduced multiplier.',consumable:'Consumable applies the expiry discount after the optional VAT multiplier.',service:'Service uses its duration to turn an hourly rate into a total.'}[type];
  }
  [kind,base,vat,hours,expiry].forEach(el=>{el.addEventListener('input',update);el.addEventListener('change',update);});update();
})();
