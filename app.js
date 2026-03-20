let wb;

async function init(){
const res=await fetch('Rutinas a presentar 2026.xlsx');
const buf=await res.arrayBuffer();
wb=XLSX.read(buf);
renderHome();
}

function header(t){return `<div class="header"><button class="back" onclick="renderHome()">⬅</button><div>${t}</div><div></div></div>`;}

function renderHome(){
let names=wb.SheetNames.slice(1,-2);
document.getElementById('app').innerHTML=
names.map(n=>`<button class="btn" onclick="renderAparatos('${n}')">${n}</button>`).join('');
}

function renderAparatos(name){
let aparatos=["PISO","ARZON","ANILLOS","SALTO","PARALELAS","FIJA"];
document.getElementById('app').innerHTML=
header(name)+aparatos.map(a=>`<button class="btn" onclick="renderRutina('${name}','${a}')">${a}</button>`).join('');
}

function renderRutina(name, aparato){
let sheet=wb.Sheets[name];
let rows=XLSX.utils.sheet_to_json(sheet,{header:1});

let start=-1,end=rows.length;

for(let i=0;i<rows.length;i++){
let txt=(rows[i][0]||"").toString().toUpperCase();
if(txt.includes(aparato)){start=i;}
else if(start!=-1 && txt.match(/PISO|ARZON|ANILLOS|SALTO|PARALELAS|FIJA/)){end=i;break;}
}

if(start==-1){document.getElementById('app').innerHTML=header(name)+"No encontrado";return;}

let bloque=rows.slice(start,end);

// detectar encabezados
let headerRow=bloque.find(r=>r.includes("NOMBRE"));
let idxNombre=headerRow.indexOf("NOMBRE");
let idxID=headerRow.indexOf("NÚM DE ID");
let idxGrupo=headerRow.indexOf("GRUPO");
let idxValor=headerRow.indexOf("VALOR");
let idxDecimal=headerRow.indexOf("Valor decimal");

let table=`<table class="table">
<tr><th>Elemento</th><th>ID</th><th>Grupo</th><th>Valor</th><th>Decimal</th></tr>`;

bloque.forEach(r=>{
if(r[idxNombre] && r[idxNombre]!="NOMBRE"){
table+=`<tr>
<td>${r[idxNombre]||""}</td>
<td>${r[idxID]||""}</td>
<td>${r[idxGrupo]||""}</td>
<td>${r[idxValor]||""}</td>
<td>${r[idxDecimal]||""}</td>
</tr>`;
}
});

table+="</table>";

// buscar NP y NF
let np="",nf="";
rows.forEach(r=>{
let txt=(r.join(" ")||"").toUpperCase();
if(txt.includes("NP")) np=r[ r.length-1 ];
if(txt.includes("PROBABLE")) nf=r[ r.length-1 ];
});

document.getElementById('app').innerHTML=
header(name+" - "+aparato)+
`<div class="np">NP: ${np}</div>`+
`<div class="nf">Nota Final: ${nf}</div>`+
table;
}

init();
