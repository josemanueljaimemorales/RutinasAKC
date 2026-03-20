let wb;

async function init(){
const res=await fetch('Rutinas a presentar 2026.xlsx');
const buf=await res.arrayBuffer();
wb=XLSX.read(buf);
home();
}

function header(t){return `<div class="header"><button class="back" onclick="home()">⬅</button><div>${t}</div><div></div></div>`;}

function home(){
let names=wb.SheetNames.slice(1,-2);
document.getElementById('app').innerHTML=
names.map(n=>`<button class="btn" onclick="aparatos('${n}')">${n}</button>`).join('');
}

function getNP(nombre, aparato){
let sheet=wb.Sheets["NP"];
let rows=XLSX.utils.sheet_to_json(sheet,{header:1});

for(let r of rows){
if(!r[0]) continue;
if(r[0].toString().toLowerCase().includes(nombre.toLowerCase())){
for(let i=0;i<r.length;i++){
if((r[i]||"").toString().toLowerCase().includes(aparato.toLowerCase())){
return r[i+1]||"";
}
}
}
}
return "";
}

function aparatos(name){
let aparatos=["PISO","ARZON","ANILLOS","SALTO","PARALELAS","FIJA"];
document.getElementById('app').innerHTML=
header(name)+aparatos.map(a=>`<button class="btn" onclick="rutina('${name}','${a}')">${a}</button>`).join('');
}

function rutina(name, aparato){
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

let headerRow=bloque.find(r=>r.includes("NOMBRE"));
let iN=headerRow.indexOf("NOMBRE");
let iID=headerRow.indexOf("NÚM DE ID");
let iG=headerRow.indexOf("GRUPO");
let iV=headerRow.indexOf("VALOR");
let iD=headerRow.indexOf("Valor decimal");

let table=`<table class="table"><tr><th>Elemento</th><th>ID</th><th>Grupo</th><th>Valor</th><th>Decimal</th></tr>`;

bloque.forEach(r=>{
if(r[iN] && r[iN]!="NOMBRE"){
table+=`<tr>
<td>${r[iN]}</td>
<td>${r[iID]}</td>
<td>${r[iG]}</td>
<td>${r[iV]}</td>
<td>${r[iD]}</td>
</tr>`;
}
});

table+="</table>";

let np=getNP(name, aparato);

document.getElementById('app').innerHTML=
header(name+" - "+aparato)+
`<div class="np">Nota de partida: ${np}</div>`+
table;
}

init();
