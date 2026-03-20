let workbook;
let atletas = [];
let datosRutinas = {};
let notasPartida = {};

const app = document.getElementById("app");

document.getElementById("fileInput").addEventListener("change", function(e){
  const file = e.target.files[0];
  const reader = new FileReader();

  reader.onload = function(e) {
    const data = new Uint8Array(e.target.result);
    workbook = XLSX.read(data, { type: "array" });
    procesarDatos();
    mostrarAtletas();
  };

  reader.readAsArrayBuffer(file);
});

function procesarDatos() {
  atletas = [];
  datosRutinas = {};
  notasPartida = {};

  workbook.SheetNames.forEach(nombre => {
    const hoja = workbook.Sheets[nombre];
    const json = XLSX.utils.sheet_to_json(hoja, { defval: "" });

    datosRutinas[nombre] = json;

    if (nombre.toLowerCase().includes("np")) {
      json.forEach(row => {
        const atleta = row["Nombre"];
        const aparato = row["Aparato"];
        const nota = row["Nota"];

        if (!notasPartida[atleta]) notasPartida[atleta] = {};
        notasPartida[atleta][aparato] = nota;
      });
    }

    if (!nombre.toLowerCase().includes("np") &&
        !nombre.toLowerCase().includes("concentrado")) {
      atletas.push(nombre);
    }
  });
}

function mostrarAtletas() {
  app.innerHTML = "<h2>Atletas</h2>";

  atletas.forEach(atleta => {
    const btn = document.createElement("button");
    btn.textContent = atleta;
    btn.onclick = () => mostrarAparatos(atleta);
    app.appendChild(btn);
  });
}

function mostrarAparatos(atleta) {
  const aparatos = ["Piso","Arzón","Anillos","Salto","Paralela","Fija"];

  app.innerHTML = `<h2>${atleta}</h2>`;

  aparatos.forEach(ap => {
    const btn = document.createElement("button");
    btn.textContent = ap;
    btn.onclick = () => mostrarRutina(atleta, ap);
    app.appendChild(btn);
  });

  crearBotonVolver(mostrarAtletas);
}

function mostrarRutina(atleta, aparato) {
  const data = datosRutinas[atleta];

  app.innerHTML = `<h2>${atleta} - ${aparato}</h2>`;

  const rutina = data.filter(r =>
    (r["Aparato"] || "").toLowerCase() === aparato.toLowerCase()
  );

  rutina.forEach(elem => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <b>${elem["Elemento"] || ""}</b><br>
      ID: ${elem["ID Elemento"] || ""}<br>
      Grupo: ${elem["Grupo"] || ""}<br>
      Valor: ${elem["Valor"] || ""}<br>
      Decimal: ${elem["Valor Decimal"] || ""}
    `;

    app.appendChild(card);
  });

  const nota = notasPartida[atleta]?.[aparato] || "N/A";

  const np = document.createElement("h3");
  np.textContent = "Nota de partida: " + nota;
  app.appendChild(np);

  crearBotonVolver(() => mostrarAparatos(atleta));
}

function crearBotonVolver(fn) {
  const btn = document.createElement("button");
  btn.textContent = "⬅ Volver";
  btn.onclick = fn;
  app.appendChild(document.createElement("br"));
  app.appendChild(btn);
}
