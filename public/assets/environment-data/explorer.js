/* Read-only exploration of the supplied DDL and SQL; no database connection. */
(() => {
  const table=document.getElementById('schema-table'), query=document.getElementById('query-choice');
  if(!table || !query)return;
  const data=window.ENVIRONMENT_DATA;
  function updateTable(){
    const selected=data.tables.find(t=>t.name===table.value),body=document.getElementById('schema-columns');
    body.replaceChildren();
    selected.columns.forEach(([name,type])=>{const tr=document.createElement('tr');[name,type].forEach(v=>{const td=document.createElement('td');td.textContent=v;tr.append(td);});body.append(tr);});
    const incoming=data.tables.filter(t=>t.references.includes(selected.name)).map(t=>t.name);
    document.getElementById('table-relationships').textContent=`References: ${[...new Set(selected.references)].join(', ') || 'none'} · Referenced by: ${incoming.join(', ') || 'none'}`;
  }
  function updateQuery(){
    const selected=data.queries.find(q=>String(q.number)===query.value);
    const steps=document.getElementById('query-steps');
    steps.replaceChildren();
    selected.steps.forEach(text=>{const li=document.createElement('li');li.textContent=text;steps.append(li);});
    for(const [id,key] of [['query-technique','technique'],['query-question','question'],['query-explanation','explanation'],['query-sql','sql'],['query-validation','validation']]) document.getElementById(id).textContent=selected[key];
  }
  table.addEventListener('change',updateTable);query.addEventListener('change',updateQuery);updateTable();updateQuery();
})();
