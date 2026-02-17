function getParam(name){
  const u = new URL(window.location.href);
  return u.searchParams.get(name);
}
function field(k,v){
  const div = document.createElement('div');
  div.innerHTML = `<div class="k">${k}</div><div class="v">${(v ?? '')}</div>`;
  return div;
}
async function load(){
  const id = getParam('id');
  if(!id){ document.getElementById('title').textContent = 'Makine bulunamadı'; return; }

  const res = await fetch('./machines.json', {cache: 'no-store'});
  const data = await res.json();
  const m = (data.machines||[]).find(x => String(x.id) === String(id));

  if(!m){
    document.getElementById('title').textContent = 'Makine bulunamadı';
    document.getElementById('subtitle').textContent = 'Bu QR silinmiş/eskimiş olabilir.';
    return;
  }

  document.getElementById('title').textContent = (m.makine_kodu || 'Makine') + ' • #' + m.id;
  document.getElementById('subtitle').textContent = (m.durum || '');

  const grid = document.getElementById('grid');
  grid.appendChild(field('Seri No', m.seri_no));
  grid.appendChild(field('Marka', m.marka));
  grid.appendChild(field('Tip', m.tip));
  grid.appendChild(field('Firma', m.lokasyon_firma));
  grid.appendChild(field('Bölüm', m.lokasyon_bolum));
  grid.appendChild(field('Dış Bölüm', m.lokasyon_dis_bolum));
  grid.appendChild(field('Açıklama', m.aciklama));

  document.getElementById('updated').textContent =
    'Güncelleme: ' + (m.guncelleme_tarihi || '-') + ' • JSON: ' + (data.generated_at || '-');
}
load().catch(err=>{
  document.body.innerHTML = '<pre>' + (err && err.stack ? err.stack : err) + '</pre>';
});
