let data=[];

async function init(){
const res=await fetch('AKC_APP_DATA_V2.xlsx');
const buf=await res.arrayBuffer();
const wb=XLSX.read(buf);
data=XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]],{defval:''});
menu();
}

function menu(){
let atletas=[...new Set(data.map(r=>r.Atleta))];
document.getElementById('app').innerHTML=
atletas.map(a=>`<button class="btn" onclick="aparatos('${a}')">${a}</button>`).join('');
}

function aparatos(a){
let aps=[...new Set(data.filter(r=>r.Atleta===a).map(r=>r.Aparato))];
document.getElementById('app').innerHTML=
`<button class="back" onclick="menu()">⬅</button>`+
aps.map(ap=>`<button class="btn" onclick="rutina('${a}','${ap}')">${ap}</button>`).join('');
}

function rutina(a,ap){
let lista=data.filter(r=>r.Atleta===a && r.Aparato===ap);

document.getElementById('app').innerHTML=`
<button class="back" onclick="aparatos('${a}')">⬅</button>
<div class="title">${a} - ${ap}</div>
${lista.map(r=>`<div class="btn">${r.Elemento}</div>`).join('')}
`;
}

init();
