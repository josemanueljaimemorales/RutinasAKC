let baseData=[], npData=[];

async function init(){
try{
const res=await fetch('archivo_convertido.xlsx');
const buf=await res.arrayBuffer();
const wb=XLSX.read(buf);

baseData=XLSX.utils.sheet_to_json(wb.Sheets['BASEAPPRUTINAS'],{defval:''});
npData=XLSX.utils.sheet_to_json(wb.Sheets['NP'],{defval:''});

menu();
}catch(e){
document.getElementById('app').innerHTML="ERROR cargando Excel";
console.error(e);
}
}

function menu(){
let atletas=[...new Set(baseData.map(r=>r.Atleta))];
document.getElementById('app').innerHTML=
atletas.map(a=>`<button class="btn" onclick="aparatos('${a}')">${a}</button>`).join('');
}

function aparatos(a){
let aps=[...new Set(baseData.filter(r=>r.Atleta===a).map(r=>r.Aparato))];
document.getElementById('app').innerHTML=
`<button class="back" onclick="menu()">⬅</button>`+
aps.map(ap=>`<button class="btn" onclick="rutina('${a}','${ap}')">${ap}</button>`).join('');
}

function getNP(atleta, aparato){
let row=npData.find(r=>r.Nombre===atleta || r.Atleta===atleta);
if(!row) return "";
return row[aparato] || "";
}

function rutina(a,ap){
let lista=baseData.filter(r=>r.Atleta===a && r.Aparato===ap);
let np=getNP(a,ap);

document.getElementById('app').innerHTML=`
<button class="back" onclick="aparatos('${a}')">⬅</button>
<div class="title">${a} - ${ap}</div>
<div class="title">NP: ${np}</div>

<table class="table">
<tr><th>Elemento</th><th>ID</th><th>Grupo</th><th>Valor</th><th>VD</th></tr>
${lista.map(r=>`<tr>
<td>${r.Elemento}</td>
<td>${r.ID}</td>
<td>${r.Grupo}</td>
<td>${r.Valor}</td>
<td>${r.VD || r["Valor Decimal"]}</td>
</tr>`).join('')}
</table>
`;
}

init();