let workbook;
let currentAthlete = "";
let currentSheet;

async function init(){
  const res = await fetch('Rutinas a presentar 2026.xlsx');
  const buffer = await res.arrayBuffer();
  workbook = XLSX.read(buffer);

  showAthletes();
}

function showAthletes(){
  let html = "<h2>Atletas</h2>";

  workbook.SheetNames.forEach((name,i)=>{
    if(i===0) return;
    if(name.toLowerCase().includes("np")) return;
    if(name.toLowerCase().includes("concentrado")) return;

    html += `<button onclick="selectAthlete('${name}')">${name}</button>`;
  });

  document.getElementById("screen").innerHTML = html;
}

function selectAthlete(name){
  currentAthlete = name;
  currentSheet = workbook.Sheets[name];

  let html = `<h2>${name}</h2>
  <button onclick="showApp('PISO')">Piso</button>
  <button onclick="showApp('ARZON')">Arzón</button>
  <button onclick="showApp('ANILLOS')">Anillos</button>
  <button onclick="showApp('SALTO')">Salto</button>
  <button onclick="showApp('PARALELAS')">Paralelas</button>
  <button onclick="showApp('BARRA')">Barra</button>
  <br><button onclick="showAthletes()">⬅ Regresar</button>
  `;

  document.getElementById("screen").innerHTML = html;
}

function showApp(aparato){
  let rows = XLSX.utils.sheet_to_json(currentSheet, {header:1});
  let data = [];
  let capturing = false;

  rows.forEach(r=>{
    let txt = (r.join(" ")||"").toUpperCase();

    if(txt.includes(aparato)){
      capturing = true;
      return;
    }

    if(capturing){
      if(txt.includes("NOTA") || txt.includes("TOTAL")){
        data.push({nota: r.join(" ")});
        capturing = false;
      } else if(r.length > 2){
        data.push({
          nombre: r[0] || "",
          grupo: r[2] || "",
          valor: r[3] || "",
          extra: r[4] || ""
        });
      }
    }
  });

  let html = `<h2>${aparato}</h2>`;

  let nota = data.find(d=>d.nota);
  if(nota){
    html += `<div class="nota">${nota.nota}</div>`;
  }

  html += `<table>
  <tr><th>Elemento</th><th>Grupo</th><th>Valor</th><th>Extra</th></tr>`;

  data.forEach(d=>{
    if(!d.nota){
      html += `<tr>
      <td>${d.nombre}</td>
      <td>${d.grupo}</td>
      <td>${d.valor}</td>
      <td>${d.extra}</td>
      </tr>`;
    }
  });

  html += `</table>
  <br><button onclick="selectAthlete('${currentAthlete}')">⬅ Regresar</button>`;

  document.getElementById("screen").innerHTML = html;
}

init();
