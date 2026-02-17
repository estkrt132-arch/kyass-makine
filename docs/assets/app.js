async function load() {
  const res = await fetch('./machines.json', {cache: 'no-store'});
  const data = await res.json();

  const meta = document.getElementById('meta');
  meta.textContent = data.count + ' kayıt • ' + (data.generated_at || '');

  const qEl = document.getElementById('q');
  const tbody = document.getElementById('rows');

  function norm(s){return (s||'').toString().toLowerCase().trim();}
  function render(){
    const q = norm(qEl.value);
    tbody.innerHTML = '';
    const items = (data.machines||[]).filter(m=>{
      if(!q) return true;
      const hay = [m.makine_kodu,m.seri_no,m.marka,m.tip,m.durum].map(norm).join(' ');
      return hay.includes(q);
    });
    for(const m of items){
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><a href="./machine.html?id=${encodeURIComponent(m.id)}">${m.makine_kodu||''}</a></td>
        <td>${m.seri_no||''}</td>
        <td>${m.marka||''}</td>
        <td>${m.tip||''}</td>
        <td><span class="pill">${m.durum||''}</span></td>
      `;
      tbody.appendChild(tr);
    }
  }
  qEl.addEventListener('input', render);
  render();
}
load().catch(err=>{
  document.body.innerHTML = '<pre>' + (err && err.stack ? err.stack : err) + '</pre>';
});
