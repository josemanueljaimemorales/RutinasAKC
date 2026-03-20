let wb;

async function init(){
const res=await fetch('Rutinas a presentar 2026.xlsx');
const buf=await res.arrayBuffer();
wb=XLSX.read(buf);
renderHome();
}

function renderHome(){
let names=wb.SheetNames.slice(1,-2);
document.getElementById('app').innerHTML=
names.map(n=>`<button class="btn" onclick="renderAparatos('${n}')">${n}</button>`).join('');
}

function header(title){
return `<div class="header"><button class="back" onclick="renderHome()">⬅</button><div>${title}</div><div></div></div>`;
}

function renderAparatos(name){
let aparatos=["PISO","ARZON","ANILLOS","SALTO","PARALELAS","BARRA","BARRA FIJA","FIJA"];
document.getElementById('app').innerHTML=
header(name)+aparatos.map(a=>`<button class="btn" onclick="renderRutina('${name}','${a}')">${a}</button>`).join('');
}

function renderRutina(name, aparato){
let sheet=wb.Sheets[name];
let data=XLSX.utils.sheet_to_json(sheet,{header:1});

let start=-1,end=data.length;

for(let i=0;i<data.length;i++){
let row=(data[i][0]||"").toString().toUpperCase();
if(row.includes(aparato)){start=i;}
else if(start!=-1 && row.match(/PISO|ARZON|ANILLOS|SALTO|PARALELAS|BARRA|FIJA/)){end=i;break;}
}

if(start==-1){document.getElementById('app').innerHTML=header(name)+"No encontrado";return;}

let bloque=data.slice(start+1,end);

let table=`<table class="table">
<tr><th>Elemento</th><th>Grupo</th><th>Valor</th></tr>`;

bloque.forEach(r=>{
if(r[0]){
table+=`<tr><td>${r[0]}</td><td>${r[1]||''}</td><td>${r[2]||''}</td></tr>`;
}
});

table+="</table>";

let nota="";

bloque.forEach(r=>{
if((r[0]||"").toString().toUpperCase().includes("NOTA")){
nota=r[1]||"";
}
});

document.getElementById('app').innerHTML=
header(name+" - "+aparato)+
`<div class="nota">Nota: ${nota}</div>`+
table;
}

init();
