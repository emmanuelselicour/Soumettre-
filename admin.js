// === CONFIG - remplace si tu veux ailleurs ===
const API_KEY = "nfp_15mLDnoA46wB94Bk8CP1irt7rHD2tYya7f29"; // ta clé fournie
const FORM_ID = "68ae6ed558338b00088302f7"; // ton form id
const ADMIN_PASSWORD = "04004749"; // mot de passe admin fourni

// === éléments DOM ===
const userTable = document.getElementById('userTable');
const searchInput = document.getElementById('search');
const refreshBtn = document.getElementById('refreshBtn');
const exportCsvBtn = document.getElementById('exportCsvBtn');
const downloadFilesBtn = document.getElementById('downloadFilesBtn');
const copyNumbersBtn = document.getElementById('copyNumbersBtn');
const deleteAllBtn = document.getElementById('deleteAllBtn');
const adminPassInput = document.getElementById('adminPass');
const toggleEyeBtn = document.getElementById('toggleEye');

let submissionsCache = [];

// === helpers ===
function formatDate(d) {
  const date = new Date(d);
  return date.toLocaleString();
}

function safeGet(sub, key){
  return (sub && sub.data && sub.data[key]) ? sub.data[key] : '';
}

// === fetch submissions ===
async function fetchSubmissions(){
  try {
    userTable.innerHTML = '<tr><td colspan="6">Chargement...</td></tr>';
    const res = await fetch(`https://api.netlify.com/api/v1/forms/${FORM_ID}/submissions`, {
      headers: { "Authorization": `Bearer ${API_KEY}` }
    });
    if (!res.ok) {
      const txt = await res.text();
      throw new Error('Erreur API: ' + txt);
    }
    const data = await res.json();
    submissionsCache = data || [];
    renderTable(submissionsCache);
  } catch (err) {
    console.error(err);
    userTable.innerHTML = `<tr><td colspan="6">Erreur en récupérant les soumissions. Voir console.</td></tr>`;
  }
}

// === render ===
function renderTable(list){
  if (!list.length) {
    userTable.innerHTML = '<tr><td colspan="6">Aucune inscription</td></tr>';
    return;
  }
  userTable.innerHTML = '';
  list.forEach(sub => {
    const nom = safeGet(sub,'nom');
    const prenom = safeGet(sub,'prenom');
    const whatsapp = safeGet(sub,'whatsapp');
    const date = sub.created_at ? formatDate(sub.created_at) : '';
    let filesHtml = '';
    if (sub.files && sub.files.length) {
      filesHtml = sub.files.map(f => `<a href="${f.url}" target="_blank" rel="noopener" download>${f.name}</a>`).join('<br>');
    }
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${nom}</td>
      <td>${prenom}</td>
      <td>${whatsapp}</td>
      <td>${filesHtml || '—'}</td>
      <td>${date}</td>
      <td>
        <button class="btn" onclick="confirmDeleteSingle('${sub.id}')">Supprimer</button>
      </td>
    `;
    userTable.appendChild(tr);
  });
}

// expose function pour onclick inline
window.confirmDeleteSingle = async function(id) {
  const pass = adminPassInput.value.trim();
  if (pass !== ADMIN_PASSWORD) { alert('Mot de passe admin incorrect.'); return; }
  if (!confirm('Confirmer la suppression de cette entrée ?')) return;
  try {
    const res = await fetch(`https://api.netlify.com/api/v1/submissions/${id}`, {
      method: 'DELETE',
      headers: { "Authorization": `Bearer ${API_KEY}` }
    });
    if (!res.ok) throw new Error('Erreur suppression');
    alert('Supprimé.');
    fetchSubmissions();
  } catch(err) {
    console.error(err);
    alert('Erreur lors de la suppression (voir console).');
  }
}

// delete all
deleteAllBtn.addEventListener('click', async () => {
  const pass = adminPassInput.value.trim();
  if (pass !== ADMIN_PASSWORD) { alert('Mot de passe admin incorrect.'); return; }
  if (!confirm(`Tu t'apprêtes à supprimer ${submissionsCache.length} entrées. Confirmer ?`)) return;
  try {
    for (const s of submissionsCache) {
      await fetch(`https://api.netlify.com/api/v1/submissions/${s.id}`, {
        method: 'DELETE',
        headers: { "Authorization": `Bearer ${API_KEY}` }
      });
    }
    alert('Toutes les soumissions ont été supprimées.');
    fetchSubmissions();
  } catch(err) {
    console.error(err);
    alert('Erreur lors de la suppression en masse. Voir console.');
  }
});

// search filter
searchInput.addEventListener('input', () => {
  const q = searchInput.value.trim().toLowerCase();
  const filtered = submissionsCache.filter(s => {
    const text = `${safeGet(s,'nom')} ${safeGet(s,'prenom')} ${safeGet(s,'whatsapp')}`.toLowerCase();
    return text.includes(q);
  });
  renderTable(filtered);
});

// refresh
refreshBtn.addEventListener('click', fetchSubmissions);

// export CSV
exportCsvBtn.addEventListener('click', () => {
  if (!submissionsCache.length) { alert('Aucune donnée à exporter'); return; }
  const headers = ['Nom','Prénom','WhatsApp','Fichiers','Date'];
  const rows = submissionsCache.map(s=>{
    const files = (s.files || []).map(f=>f.url).join('|');
    return [
      `"${(safeGet(s,'nom')||'').replace(/"/g,'""')}"`,
      `"${(safeGet(s,'prenom')||'').replace(/"/g,'""')}"`,
      `"${(safeGet(s,'whatsapp')||'').replace(/"/g,'""')}"`,
      `"${files.replace(/"/g,'""')}"`,
      `"${s.created_at || ''}"`
    ].join(',');
  });
  const csv = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `eds_inscriptions_${new Date().toISOString().slice(0,10)}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
});

// copy all numbers
copyNumbersBtn.addEventListener('click', async () => {
  const nums = submissionsCache.map(s => safeGet(s,'whatsapp')).filter(Boolean);
  if (!nums.length) { alert('Aucun numéro à copier.'); return; }
  const text = nums.join(', ');
  try {
    await navigator.clipboard.writeText(text);
    alert('Numéros copiés dans le presse-papier.');
  } catch(e) {
    alert('Impossible de copier automatiquement. Voici la liste:\n' + text);
  }
});

// download all files as zip (JSZip)
downloadFilesBtn.addEventListener('click', async () => {
  if (!submissionsCache.length) { alert('Aucune donnée'); return; }
  if (!window.JSZip) { alert('JSZip non chargé.'); return; }
  const zip = new JSZip();
  let filesFound = 0;
  try {
    for (const s of submissionsCache) {
      const namePrefix = `${safeGet(s,'nom') || 'contact'}_${safeGet(s,'prenom') || ''}_${s.id}`;
      if (s.files && s.files.length) {
        for (const f of s.files) {
          filesFound++;
          try {
            const resp = await fetch(f.url);
            const blob = await resp.blob();
            zip.file(`${namePrefix}/${f.name}`, blob);
          } catch(err){ console.warn('Erreur fetch file', f.url, err); }
        }
      }
    }
    if (!filesFound) { alert('Aucun fichier trouvé dans les soumissions.'); return; }
    const content = await zip.generateAsync({type:"blob"});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(content);
    a.download = `eds_files_${new Date().toISOString().slice(0,10)}.zip`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  } catch(err) {
    console.error(err);
    alert('Erreur lors de la création du ZIP. Voir console.');
  }
});

// eye toggle for pwd
toggleEyeBtn.addEventListener('click', () => {
  if (adminPassInput.type === 'password') {
    adminPassInput.type = 'text';
    toggleEyeBtn.innerHTML = '🙈';
  } else {
    adminPassInput.type = 'password';
    toggleEyeBtn.innerHTML = '👁️';
  }
});

// initial load
fetchSubmissions();
