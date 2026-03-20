let BASE = [];
let NP = [];
let OBL = [];

document.getElementById("fileInput").addEventListener("change", function(e){
  const reader = new FileReader();
  reader.onload = function(e){
    const data = new Uint8Array(e.target.result);
    const wb = XLSX.read(data,{type:'array'});

    BASE = XLSX.utils.sheet_to_json(wb.Sheets["BASEAPPRUTINAS"],{defval:""});
    NP = XLSX.utils.sheet_to_json(wb.Sheets["NP"],{defval:""});
    OBL = XLSX.utils.sheet_to_json(wb.Sheets["OBLIGATORIOS"],{defval:""});
  };
  reader.readAsArrayBuffer(e.target.files[0]);
});

function set(html){
  document.getElementById("contenido").innerHTML = html;
}

function verAtletas(){
  let atletas = [...new Set(BASE.map(x=>x.NOMBRE))];
  let html = "<h2>ATLETAS</h2>";
  atletas.forEach(a=>{
    html += `<button onclick="verAparatos('${a}')">${a}</button>`;
  });
  html += '<br><button onclick="set(\'\')">⬅ REGRESAR</button>';
  set(html);
}

function verAparatos(nombre){
  const aparatos = ["PISO","ARZON","ANILLOS","SALTO","PARALELA","FIJA"];
  let html = `<h2>${nombre}</h2>`;
  aparatos.forEach(ap=>{
    html += `<button onclick="verRutina('${nombre}','${ap}')">${ap}</button>`;
  });
  html += `<br><button onclick="verAtletas()">⬅ REGRESAR</button>`;
  set(html);
}

function verRutina(nombre, aparato){
  const datos = BASE.filter(x=>x.NOMBRE===nombre && x.APARATO===aparato);
  const filaNP = NP.find(x=>x.NOMBRE===nombre);
  const np = filaNP ? (filaNP[aparato] || "") : "";

  let html = `<h2>${aparato} - NP: ${np}</h2>`;
  html += "<table><tr><th>ELEMENTO</th><th>ID</th><th>GRUPO</th><th>VALOR</th><th>DECIMAL</th></tr>";

  datos.forEach(d=>{
    html += `<tr>
      <td>${d.ELEMENTO||""}</td>
      <td>${d.ID||""}</td>
      <td>${d.GRUPO||""}</td>
      <td>${d.VALOR||""}</td>
      <td>${d["VALOR DECIMAL"]||""}</td>
    </tr>`;
  });

  html += "</table>";
  html += `<br><button onclick="verAparatos('${nombre}')">⬅ REGRESAR</button>`;
  set(html);
}

function verObligatorios(){
  let nombres = [...new Set(OBL.map(x=>x.NOMBRE))];
  let html = "<h2>OBLIGATORIOS</h2>";
  nombres.forEach(n=>{
    html += `<button onclick="verObligatoriosAparatos('${n}')">${n}</button>`;
  });
  html += '<br><button onclick="set(\'\')">⬅ REGRESAR</button>';
  set(html);
}

function verObligatoriosAparatos(nombre){
  const aparatos = ["PISO","ARZON","ANILLOS","SALTO","PARALELA","FIJA"];
  const filaNP = NP.find(x=>x.NOMBRE===nombre);

  let html = `<h2>${nombre}</h2>`;
  aparatos.forEach(ap=>{
    const np = filaNP ? (filaNP[ap] || "") : "";
    html += `<button>${ap} - NP: ${np}</button>`;
  });

  html += `<br><button onclick="verObligatorios()">⬅ REGRESAR</button>`;
  set(html);
}
