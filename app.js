let data;
let atletaSel = null;

fetch('data.json')
.then(r=>r.json())
.then(d=>{
  data=d;
  cargarAtletas();
});

function cargarAtletas(){
  let cont=document.getElementById('atletas');
  Object.keys(data.np).forEach(a=>{
    let b=document.createElement('button');
    b.textContent=a;
    b.className='atleta-btn';
    b.onclick=()=>seleccionarAtleta(a);
    cont.appendChild(b);
  });
}

function seleccionarAtleta(a){
  atletaSel=a;
  document.getElementById('aparatos').innerHTML='';
  data.aparatos.forEach(ap=>{
    let b=document.createElement('button');
    b.textContent=ap;
    b.className='aparato-btn';
    b.onclick=()=>verRutina(ap);
    document.getElementById('aparatos').appendChild(b);
  });
}

function verRutina(ap){
  let lista=data.rutinas.filter(r=>r.ATLETA===atletaSel && r.APARATO===ap);

  let html='';
  lista.forEach(e=>{
    html+=`<div class="card">
      <b>${e.ELEMENTO}</b><br>
      Grupo: ${e.GRUPO} | Valor: ${e.VALOR}
    </div>`;
  });

  let np=data.np[atletaSel]?.[ap] || 'N/A';

  document.getElementById('np').textContent="NP: "+np;
  document.getElementById('rutina').innerHTML=html;
}
