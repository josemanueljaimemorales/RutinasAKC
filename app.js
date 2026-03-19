let workbook;
let currentSheet;

async function loadExcel(){
  const res = await fetch('Rutinas a presentar 2026.xlsx');
  const buffer = await res.arrayBuffer();
  workbook = XLSX.read(buffer);

  let container = document.getElementById("athletes");

  workbook.SheetNames.forEach((name,i)=>{
    if(i===0) return;
    if(name.toLowerCase().includes("np")) return;
    if(name.toLowerCase().includes("concentrado")) return;

    container.innerHTML += `<button onclick="selectAthlete('${name}')">${name}</button>`;
  });
}

function selectAthlete(name){
  currentSheet = workbook.Sheets[name];

  document.getElementById("aparatos").innerHTML = `
  <button onclick="showApp('PISO')">Piso</button>
  <button onclick="showApp('ARZON')">Arzón</button>
  <button onclick="showApp('ANILLOS')">Anillos</button>
  <button onclick="showApp('SALTO')">Salto</button>
  <button onclick="showApp('PARALELAS')">Paralelas</button>
  <button onclick="showApp('BARRA')">Barra</button>
  `;

  document.getElementById("content").innerHTML = "";
}

function showApp(aparato){
  let rows = XLSX.utils.sheet_to_json(currentSheet, {header:1});
  let html = "<div class='rutina'>";

  let capturing = false;

  rows.forEach(r=>{
    let rowText = (r.join(" ") || "").toUpperCase();

    if(rowText.includes(aparato)){
      capturing = true;
      html += `<h2>${aparato}</h2>`;
      return;
    }

    if(capturing){
      if(rowText.includes("NOTA") || rowText.includes("TOTAL")){
        html += `<div class='nota'>${r.join(" ")}</div>`;
        capturing = false;
      } else {
        html += `<div class='linea'>${r.join(" ")}</div>`;
      }
    }
  });

  html += "</div>";

  document.getElementById("content").innerHTML = html;
}

loadExcel();
