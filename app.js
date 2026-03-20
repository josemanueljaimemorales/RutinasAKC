let workbook;
let atletas = [];
let datos = {};
let NP = {};

const app = document.getElementById("app");

document.getElementById("fileInput").addEventListener("change", function(e){
  const file = e.target.files[0];
  const reader = new FileReader();

  reader.onload = function(e) {
    const data = new Uint8Array(e.target.result);
    workbook = XLSX.read(data, { type: "array" });

    procesar();
    pantallaAtletas();
  };

  reader.readAsArrayBuffer(file);
});

function procesar() {
  atletas = [];
  datos = {};
  NP = {};

  workbook.SheetNames.forEach(nombre => {
    const hoja = workbook.Sheets[nombre];
    const json = XLSX.utils.sheet_to_json(hoja, { defval: "" });

    const nombreLower = nombre.toLowerCase();

    if (nombreLower.includes("np")) {
      json.forEach(r => {
        const atleta = r["Nombre"] || r["Atleta"];
        const aparato = r["Aparato"];
        const nota = r["Nota"] || r["NP"];

        if (!NP[atleta]) NP[atleta] = {};
        NP[atleta][aparato] = nota;
      });
      return;
    }

    if (nombreLower.includes("concentrado")) return;

    atletas.push(nombre);
    datos[nombre] = json;
  });
}

function pantallaAtletas() {
  app.innerHTML = "<h2>ATLETAS</h2>";

  atletas.forEach(a => {
    const btn = document.createElement("button");
    btn.textContent = a;
    btn.onclick = () => pantallaAparatos(a);
    app.appendChild(btn);
  });
}

function pantallaAparatos(atleta) {
  const aparatos = ["Piso","Arzón","Anillos","Salto","Paralela","Fija"];

  app.innerHTML = `<h2>${atleta}</h2>`;

  aparatos.forEach(ap => {
    const btn = document.createElement("button");
    btn.textContent = ap;
    btn.onclick = () => pantallaRutina(atleta, ap);
    app.appendChild(btn);
  });

  volver(pantallaAtletas);
}

function pantallaRutina(atleta, aparato) {
  const lista = datos[atleta] || [];

  const rutina = lista.filter(r =>
    (r["Aparato"] || "").toLowerCase() === aparato.toLowerCase()
  );

  app.innerHTML = `<h2>${atleta} - ${aparato}</h2>`;

  rutina.forEach(e => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <b>${e["Elemento"] || e["Nombre"] || ""}</b><br>
      ID: ${e["ID Elemento"] || ""}<br>
      Grupo: ${e["Grupo"] || ""}<br>
      Valor: ${e["Valor"] || ""}<br>
      Decimal: ${e["Valor Decimal"] || ""}
    `;

    app.appendChild(card);
  });

  const nota = NP[atleta]?.[aparato] || "N/A";

  const np = document.createElement("div");
  np.className = "np";
  np.textContent = "Nota de Partida: " + nota;

  app.appendChild(np);

  volver(() => pantallaAparatos(atleta));
}

function volver(fn) {
  const btn = document.createElement("button");
  btn.textContent = "⬅ Volver";
  btn.onclick = fn;
  app.appendChild(document.createElement("br"));
  app.appendChild(btn);
}
