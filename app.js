let data = [];
let NP = {};

const screen = document.getElementById("screen");

async function loadExcel(){
  try{
    const res = await fetch("Excel_Solo_Valores.xlsx");
    const buffer = await res.arrayBuffer();
    const wb = XLSX.read(buffer);

    const base = XLSX.utils.sheet_to_json(wb.Sheets["BASEAPPRUTINAS"]);
    const npSheet = XLSX.utils.sheet_to_json(wb.Sheets["NP"]);

    // Construir NP tomando SIEMPRE la primera columna como nombre (aunque sea _EMPTY)
    npSheet.forEach(r=>{
      const keys = Object.keys(r);
      if(!keys.length) return;
      const firstCol = keys[0];
      const rawName = (r[firstCol] ?? "").toString().trim();
      const name = rawName.toUpperCase();
      if(name){
        NP[name] = r;
      }
    });

    data = base;
    showAthletes();
  }catch(e){
    screen.innerHTML = "<div style='padding:20px'>Error cargando el Excel</div>";
    console.error(e);
  }
}

function showAthletes(){
  const athletes = [...new Set(data.map(d => (d["ATLETA"]||"").toString().trim()).filter(Boolean))];
  screen.innerHTML = "";
  athletes.forEach(a=>{
    const safe = a.replace(/'/g, "\\'");
    screen.innerHTML += `<div class="button" onclick="showAparatos('${safe}')">${a}</div>`;
  });
}

function showAparatos(name){
  const aparatos = [...new Set(
    data
      .filter(d => (d["ATLETA"]||"").toString().trim() === name)
      .map(d => (d["APARATO"]||"").toString().trim())
      .filter(Boolean)
  )];

  const safe = name.replace(/'/g, "\\'");
  screen.innerHTML = `<div class="back" onclick="showAthletes()">⬅️</div>`;
  aparatos.forEach(ap=>{
    const safeAp = ap.replace(/'/g, "\\'");
    screen.innerHTML += `<div class="button" onclick="showRutina('${safe}','${safeAp}')">${ap}</div>`;
  });
}

function mapAparato(ap){
  const a = (ap||"").toUpperCase().trim();
  if(a==="ARZON") return "HONGO A";
  if(a==="PARALELAS") return "PARALELA";
  if(a==="ANILLOS") return "ANILLO";
  return a;
}

function getNP(name, aparato){
  const keyName = (name||"").toUpperCase().trim();
  const keyAparato = mapAparato(aparato);
  const row = NP[keyName];
  if(!row) return "";

  // Buscar columna por coincidencia flexible (ignora mayúsculas/espacios)
  const cols = Object.keys(row);
  const match = cols.find(c => (c||"").toString().toUpperCase().trim() === keyAparato);
  if(!match) return "";

  return row[match];
}

function showRutina(name, aparato){
  const rutina = data.filter(d =>
    (d["ATLETA"]||"").toString().trim() === name &&
    (d["APARATO"]||"").toString().trim() === aparato
  );

  const npValue = getNP(name, aparato);

  const safe = name.replace(/'/g, "\\'");
  let html = `<div class="back" onclick="showAparatos('${safe}')">⬅️</div>`;
  html += `<h2>${name} - ${aparato}</h2>`;
  html += `<div class="np">Nota de partida: ${npValue || "-"}</div>`;

  html += `<table class="table">
    <tr>
      <th>Elemento</th>
      <th>ID</th>
      <th>Grupo</th>
      <th>Valor</th>
      <th>VD</th>
    </tr>`;

  rutina.forEach(r=>{
    html += `<tr>
      <td>${r["ELEMENTO"]||""}</td>
      <td>${r["NÚM DE ID"]||""}</td>
      <td>${r["GRUPO"]||""}</td>
      <td>${r["VALOR"]||""}</td>
      <td>${r["Valor decimal"]||""}</td>
    </tr>`;
  });

  html += `</table>`;
  screen.innerHTML = html;
}

loadExcel();
