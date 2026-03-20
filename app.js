let WB, sheets={}, concRows=[], npRows=[];

async function init(){
const res=await fetch('Rutinas a presentar 2026.xlsx');
const buf=await res.arrayBuffer();
WB=XLSX.read(buf);

// guardar hojas
WB.SheetNames.forEach(name=>{
let rows=XLSX.utils.sheet_to_json(WB.Sheets[name],{header:1,defval:""});
if(name.toLowerCase().includes("concentrado")) concRows=rows;
else if(name.toLowerCase().includes("np")) npRows=rows;
else if(!name.toLowerCase().includes("oblig")) sheets[name]=rows;
});

menu();
}

function menu(){
let atletas=Object.keys(sheets);
document.getElementById("app").innerHTML=
atletas.map(a=>`<button class="btn" onclick="aparatos('${a}')">${a}</button>`).join("");
}

function aparatos(a){
let aps=["PISO","ARZON","ANILLOS","SALTO","PARALELAS","FIJA"];
document.getElementById("app").innerHTML=
`<button class="back" onclick="menu()">⬅</button>`+
aps.map(ap=>`<button class="btn" onclick="rutina('${a}','${ap}')">${ap}</button>`).join("");
}

// ====== BUSCAR RUTINA EN CONCENTRADO ======
function getRutina(atleta, aparato){
let lista=[];
let found=false;

for(let i=0;i<concRows.length;i++){
let row=concRows[i].join(" ").toUpperCase();

if(row.includes(atleta.toUpperCase()) && row.includes(aparato)){
found=true;
continue;
}

if(found){
let txt=concRows[i][0];
if(!txt) break;

let stop=["PISO","ARZON","ANILLOS","SALTO","PARALELAS","FIJA"];
if(stop.some(s=>txt.toUpperCase().includes(s))) break;

lista.push(txt);
}
}

return lista;
}

// ====== BUSCAR NP ======
function getNP(atleta, aparato){
for(let r of npRows){
let txt=r.join(" ").toUpperCase();
if(txt.includes(atleta.toUpperCase()) && txt.includes(aparato)){
for(let c of r){
if(typeof c==="number") return c;
}
}
}
return "";
}

// ====== BUSCAR DATOS EN HOJA ======
function buscarElemento(hoja, nombre){
for(let r of hoja){
let txt=r.join(" ").toLowerCase();
if(txt.includes(nombre.toLowerCase())){
return {
Elemento:r[0]||"",
ID:r[1]||"",
Grupo:r[2]||"",
Valor:r[3]||"",
VD:r[4]||""
};
}
}
return {Elemento:nombre,ID:"",Grupo:"",Valor:"",VD:""};
}

function rutina(atleta, aparato){
let lista=getRutina(atleta, aparato);
let hoja=sheets[atleta]||[];
let np=getNP(atleta, aparato);

let datos=lista.map(n=>buscarElemento(hoja,n));

document.getElementById("app").innerHTML=`
<button class="back" onclick="aparatos('${atleta}')">⬅</button>
<div class="title">${atleta} - ${aparato}</div>
<div class="title">Nota de partida: ${np}</div>

<table class="table">
<tr><th>Elemento</th><th>ID</th><th>Grupo</th><th>Valor</th><th>VD</th></tr>
${datos.map(d=>`<tr>
<td>${d.Elemento}</td>
<td>${d.ID}</td>
<td>${d.Grupo}</td>
<td>${d.Valor}</td>
<td>${d.VD}</td>
</tr>`).join("")}
</table>
`;
}

init();
