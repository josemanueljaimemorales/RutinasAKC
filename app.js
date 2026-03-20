let WB, sheets={};

async function init(){
const res=await fetch('Rutinas a presentar 2026.xlsx');
const buf=await res.arrayBuffer();
WB=XLSX.read(buf);

WB.SheetNames.forEach(name=>{
if(!name.toLowerCase().includes("oblig") && 
   !name.toLowerCase().includes("np") && 
   !name.toLowerCase().includes("concentrado")){
    sheets[name]=XLSX.utils.sheet_to_json(WB.Sheets[name],{defval:''});
}
});

menu();
}

function menu(){
let atletas=Object.keys(sheets);
document.getElementById("app").innerHTML=
atletas.map(a=>`<button class="btn" onclick="aparatos('${a}')">${a}</button>`).join("");
}

function aparatos(a){
let aps=["Piso","Arzon","Anillos","Salto","Paralelas","Fija"];
document.getElementById("app").innerHTML=
`<button class="back" onclick="menu()">⬅</button>`+
aps.map(ap=>`<button class="btn" onclick="rutina('${a}','${ap}')">${ap}</button>`).join("");
}

function rutina(atleta, aparato){
let hoja=sheets[atleta]||[];

let filtrados=hoja.filter(r=>{
return (r.Aparato||"").toLowerCase().includes(aparato.toLowerCase());
}).slice(0,8);

let sumaVD=0;
let grupos=0;

filtrados.forEach(r=>{
let vd=parseFloat(r["Valor Decimal"]||r.VD||0);
if(!isNaN(vd)) sumaVD+=vd;

let g=parseFloat(r.Grupo||0);
if(!isNaN(g)) grupos+=g;
});

let np=(10 + sumaVD + grupos).toFixed(1);

document.getElementById("app").innerHTML=`
<button class="back" onclick="aparatos('${atleta}')">⬅</button>
<div class="title">${atleta} - ${aparato}</div>
<div class="title">Nota de partida: ${np}</div>

<table class="table">
<tr><th>Elemento</th><th>ID</th><th>Grupo</th><th>Valor</th><th>VD</th></tr>
${filtrados.map(d=>`<tr>
<td>${d.Elemento||""}</td>
<td>${d.ID||""}</td>
<td>${d.Grupo||""}</td>
<td>${d.Valor||""}</td>
<td>${d["Valor Decimal"]||d.VD||""}</td>
</tr>`).join("")}
</table>
`;
}

init();
