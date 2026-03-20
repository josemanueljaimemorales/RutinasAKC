let WB, hojas={}, NP={}, CONC={};

async function init(){
const res=await fetch('Rutinas a presentar 2026.xlsx');
const buf=await res.arrayBuffer();
WB=XLSX.read(buf);

WB.SheetNames.forEach(name=>{
const data=XLSX.utils.sheet_to_json(WB.Sheets[name],{defval:''});
if(name.toLowerCase().includes('np')) NP=parseNP(data);
else if(name.toLowerCase().includes('concentrado')) CONC=parseCONC(data);
else if(!name.toLowerCase().includes('oblig')) hojas[name]=data;
});

menuAtletas();
}

function parseNP(data){
let obj={};
data.forEach(r=>{
let atleta=r.Nombre||r.nombre;
if(!atleta) return;
obj[atleta]=r;
});
return obj;
}

function parseCONC(data){
let obj={};
data.forEach(r=>{
let atleta=r.Nombre||r.nombre;
if(!atleta) return;
obj[atleta]=r;
});
return obj;
}

function menuAtletas(){
let names=Object.keys(hojas);
document.getElementById('app').innerHTML=
names.map(n=>`<button class="btn" onclick="aparatos('${n}')">${n}</button>`).join('');
}

function aparatos(atleta){
let aps=["Piso","Arzon","Anillos","Salto","Paralelas","Fija"];
document.getElementById('app').innerHTML=
`<button class="back" onclick="menuAtletas()">⬅</button>`+
aps.map(a=>`<button class="btn" onclick="rutina('${atleta}','${a}')">${a}</button>`).join('');
}

function rutina(atleta,aparato){
let hoja=hojas[atleta]||[];
let conc=CONC[atleta]||{};
let lista=(conc[aparato]||"").toString().split(',').map(e=>e.trim()).filter(e=>e);

let datos=lista.map(nombre=>{
let r=hoja.find(x=>(x.Elemento||"").toLowerCase().includes(nombre.toLowerCase()));
if(!r) return {Elemento:nombre,ID:"",Grupo:"",Valor:"",VD:""};
return {
Elemento:r.Elemento,
ID:r.ID,
Grupo:r.Grupo,
Valor:r.Valor,
VD:r["Valor Decimal"]||r.VD||""
};
});

let np=(NP[atleta]||{})[aparato]||"";

document.getElementById('app').innerHTML=`
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
</tr>`).join('')}
</table>
`;
}

init();
