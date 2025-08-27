const API_TOKEN = "nfp_15mLDnoA46wB94Bk8CP1irt7rHD2tYya7f29"; // Ton token Netlify
const FORM_ID = "68ae648c5501c20008ac0398"; // 👉 À coller après déploiement

async function checkPassword() {
  const pass = document.getElementById("password").value;
  if (pass === "04004749") {
    document.getElementById("login").style.display = "none";
    document.getElementById("panel").style.display = "block";
    fetchSubmissions();
  } else {
    document.getElementById("error").innerText = "Mot de passe incorrect";
  }
}

async function fetchSubmissions() {
  const res = await fetch(`https://api.netlify.com/api/v1/forms/${FORM_ID}/submissions`, {
    headers: { Authorization: `Bearer ${API_TOKEN}` }
  });
  const data = await res.json();

  let tbody = document.getElementById("data");
  tbody.innerHTML = "";

  data.forEach((item, i) => {
    tbody.innerHTML += `
      <tr>
        <td><input type="checkbox" class="row-select" value="${item.id}"></td>
        <td>${item.data.nom}</td>
        <td>${item.data.prenom}</td>
        <td>${item.data.numero}</td>
        <td>${item.data.email}</td>
        <td>${item.data.photo ? `<a href="${item.data.photo}" target="_blank">Voir</a>` : "—"}</td>
        <td><button onclick="deleteOne('${item.id}')">Supprimer</button></td>
      </tr>
    `;
  });
}

function searchData() {
  const filter = document.getElementById("search").value.toLowerCase();
  const rows = document.querySelectorAll("#data tr");
  rows.forEach(row => {
    const nom = row.cells[1].innerText.toLowerCase();
    const numero = row.cells[3].innerText.toLowerCase();
    row.style.display = (nom.includes(filter) || numero.includes(filter)) ? "" : "none";
  });
}

function toggleAll(source) {
  document.querySelectorAll(".row-select").forEach(cb => cb.checked = source.checked);
}

async function deleteOne(id) {
  if (!confirm("Supprimer cette entrée ?")) return;
  await fetch(`https://api.netlify.com/api/v1/submissions/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${API_TOKEN}` }
  });
  fetchSubmissions();
}

async function deleteSelected() {
  const selected = [...document.querySelectorAll(".row-select:checked")].map(cb => cb.value);
  if (!selected.length) return alert("Aucune sélection");
  if (!confirm("Supprimer les éléments sélectionnés ?")) return;
  for (let id of selected) {
    await fetch(`https://api.netlify.com/api/v1/submissions/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${API_TOKEN}` }
    });
  }
  fetchSubmissions();
}

function downloadCSV() {
  const rows = [["Nom", "Prénom", "Numéro", "Email"]];
  document.querySelectorAll("#data tr").forEach(tr => {
    rows.push([
      tr.cells[1].innerText,
      tr.cells[2].innerText,
      tr.cells[3].innerText,
      tr.cells[4].innerText
    ]);
  });

  let csvContent = rows.map(r => r.join(",")).join("\n");
  let blob = new Blob([csvContent], { type: "text/csv" });
  let url = URL.createObjectURL(blob);
  let a = document.createElement("a");
  a.href = url;
  a.download = "contacts.csv";
  a.click();
}
