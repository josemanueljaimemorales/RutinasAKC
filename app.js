let data = [];
let NP = {};
let OBL = [];

const screen = document.getElementById("screen");

async function loadExcel(){
const res = await fetch("Excel_Solo_Valores.xlsx");
const buffer = await res.arrayBuffer();
const wb = XLSX.read(buffer);

data = XLSX.utils.sheet_to_json(wb.Sheets["BASEAPPRUTINAS"]);
const npSheet = XLSX.utils.sheet_to_json(wb.Sheets["NP"]);
OBL = XLSX.utils.sheet_to_json(wb.Sheets["OBLIGATORIOS"]);

npSheet.forEach(r=>{
const keys = Object.keys(r);
const name = (r[keys[0]]||"").toString().trim().toUpperCase();
if(name) NP[name]=r;
});

showHome();
}

function showHome(){
screen.innerHTML = `
<div class="button" onclick="showAthletes()">Rutinas</div>
<div class="button" onclick="showObligatorios()">Obligatorios</div>
`;
}

function showAthletes(){
const athletes = [...new Set(data.map(d=>d["ATLETA"]))];
screen.innerHTML = `<div class="back" onclick="showHome()">⬅️</div>`;
athletes.forEach(a=>{
screen.innerHTML += `<div class="button" onclick="showAparatos('${a}')">${a}</div>`;
});
}

function showAparatos(name){
const aparatos = [...new Set(data.filter(d=>d["ATLETA"]===name).map(d=>d["APARATO"]))];
screen.innerHTML = `<div class="back" onclick="showAthletes()">⬅️</div>`;
aparatos.forEach(ap=>{
screen.innerHTML += `<div class="button" onclick="showRutina('${name}','${ap}')">${ap}</div>`;
});
}

function mapAparato(ap){
ap=ap.toUpperCase();
if(ap==="ARZON") return "ARZON";
if(ap==="PARALELAS") return "PARALELA";
if(ap==="ANILLOS") return "ANILLO";
return ap;
}

function getNP(name, aparato){
const row = NP[name.toUpperCase()];
if(!row) return "";
const key = mapAparato(aparato);
const col = Object.keys(row).find(c=>c.toUpperCase().includes(key));
if(!col) return "";
let val = row[col];
if(!isNaN(val)) return parseFloat(val).toFixed(3);
return val;
}

function showRutina(name, aparato){
const rutina = data.filter(d=>d["ATLETA"]===name && d["APARATO"]===aparato);
const np = getNP(name, aparato);

let html = `<div class="back" onclick="showAparatos('${name}')">⬅️</div>`;
html += `<h2>${name} - ${aparato}</h2>`;
html += `<div class="np">Nota de partida: ${np||"-"}</div>`;

html += `<table class="table">
<tr><th>Elemento</th><th>ID</th><th>Grupo</th><th>Valor</th><th>VD</th></tr>`;

rutina.forEach(r=>{
html+=`<tr>
<td>${r["ELEMENTO"]||""}</td>
<td>${r["NÚM DE ID"]||""}</td>
<td>${r["GRUPO"]||""}</td>
<td>${r["VALOR"]||""}</td>
<td>${r["Valor decimal"]||""}</td>
</tr>`;
});

html += "</table>";
screen.innerHTML = html;
}

function showObligatorios(){
const names = OBL.map(r=>r[Object.keys(r)[0]]);
screen.innerHTML = `<div class="back" onclick="showHome()">⬅️</div>`;
names.forEach(n=>{
screen.innerHTML += `<div class="button" onclick="showObligatorioDetalle('${n}')">${n}</div>`;
});
}

function showObligatorioDetalle(name){
const r = OBL.find(x=>x[Object.keys(x)[0]]===name);

const hongoKey = Object.keys(r).find(k =>
k.toUpperCase().includes("HONGO") || k.toUpperCase().includes("ARZON")
);

const hongoValue = hongoKey ? r[hongoKey] : "-";

let html = `<div class="back" onclick="showObligatorios()">⬅️</div>`;
html += `<h2>${name}</h2>`;
html += `<div class="np">Nivel: ${r["NIVEL"]}</div>`;

html += `<table class="table">
<tr><th>Aparato</th><th>Nota</th></tr>
<tr><td>Piso</td><td>${r["PISO"]}</td></tr>
<tr><td>Hongo</td><td>${hongoValue}</td></tr>
<tr><td>Anillo</td><td>${r["ANILLO"]}</td></tr>
<tr><td>Salto</td><td>${r["SALTO"]}</td></tr>
<tr><td>Paralela</td><td>${r["PARALELA"]}</td></tr>
<tr><td>Fija</td><td>${r["FIJA"]}</td></tr>
</table>`;

screen.innerHTML = html;
}

loadExcel();
