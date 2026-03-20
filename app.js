let data = [];
let NP = {};

const screen = document.getElementById("screen");

async function loadExcel() {
    const res = await fetch("Excel_Solo_Valores.xlsx");
    const buffer = await res.arrayBuffer();
    const wb = XLSX.read(buffer);

    const base = XLSX.utils.sheet_to_json(wb.Sheets["BASEAPPRUTINAS"]);
    const npSheet = XLSX.utils.sheet_to_json(wb.Sheets["NP"]);

    npSheet.forEach(r => {
        const name = r["NOMBRE"];
        NP[name] = r;
    });

    data = base;
    showAthletes();
}

function showAthletes(){
    const athletes = [...new Set(data.map(d => d["ATLETA"]))];

    screen.innerHTML = "";
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
    if(ap==="ARZON") return "HONGO A";
    return ap;
}

function showRutina(name, aparato){
    const rutina = data.filter(d=>d["ATLETA"]===name && d["APARATO"]===aparato);

    const npValue = NP[name] ? NP[name][mapAparato(aparato)] : "";

    let html = `<div class="back" onclick="showAparatos('${name}')">⬅️</div>`;
    html += `<h2>${name} - ${aparato}</h2>`;
    html += `<div class="np">Nota de partida: ${npValue || "-"}</div>`;

    html += `<table class="table">
    <tr>
        <th>Elemento</th>
        <th>ID</th>
        <th>Grupo</th>
        <th>Valor</th>
        <th>VD</th>
    </tr>`;

    rutina.forEach(r=>{
        html += `<tr>
            <td>${r["ELEMENTO"] || ""}</td>
            <td>${r["NÚM DE ID"] || ""}</td>
            <td>${r["GRUPO"] || ""}</td>
            <td>${r["VALOR"] || ""}</td>
            <td>${r["Valor decimal"] || ""}</td>
        </tr>`;
    });

    html += `</table>`;
    screen.innerHTML = html;
}

loadExcel();
