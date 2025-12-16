"use strict";

/* ===========================================================
   AUTENTICACIÓN (login/register) - localStorage
   =========================================================== */

let users = JSON.parse(localStorage.getItem("users") || "[]");

// Si existe sesión, mostramos app; si no, mostramos auth
function checkAuthOnLoad(){
  const auth = localStorage.getItem("auth") === "true";
  if(auth){
    document.getElementById('authContainer').style.display = 'none';
    document.getElementById('appContent').style.display = 'block';
  } else {
    document.getElementById('authContainer').style.display = 'flex';
    document.getElementById('appContent').style.display = 'none';
  }
}
checkAuthOnLoad();

function authShowRegister(){
  document.getElementById("loginBoxAuth").style.display = "none";
  document.getElementById("registerBoxAuth").style.display = "block";
}

function authShowLogin(){
  document.getElementById("registerBoxAuth").style.display = "none";
  document.getElementById("loginBoxAuth").style.display = "block";
}

function authRegister(){
  const nombre = document.getElementById("authRegNombre").value.trim();
  const email  = document.getElementById("authRegEmail").value.trim().toLowerCase();
  const pass   = document.getElementById("authRegPass").value.trim();

  if(!nombre || !email || !pass){
    alert("Completa todos los campos");
    return;
  }

  if(users.some(u => u.email === email)){
    alert("Este correo ya está registrado");
    return;
  }

  users.push({ nombre, email, pass });
  localStorage.setItem("users", JSON.stringify(users));
  alert("Registro exitoso ✔ Ahora inicia sesión");
  authShowLogin();
}

function authLogin(){
  const email = document.getElementById("authLoginEmail").value.trim().toLowerCase();
  const pass  = document.getElementById("authLoginPass").value.trim();

  if(!email || !pass){
    alert("Completa todos los campos");
    return;
  }

  const user = users.find(u => u.email === email && u.pass === pass);
  if(!user){
    alert("Correo o contraseña incorrectos");
    return;
  }

  localStorage.setItem("auth", "true");
  document.getElementById('authContainer').style.display = 'none';
  document.getElementById('appContent').style.display = 'block';
}

function logout(){
  localStorage.removeItem("auth");
  location.reload();
}

/* ===========================================================
   DATOS E INVENTARIO
   =========================================================== */

const coordenadasMunicipios = {
  "Zipaquirá":[5.0221, -73.9947],
  "Chía":[4.8588, -74.058],
  "Girardot":[4.3008, -74.8034],
  "Ibagué":[4.4447, -75.2424],
  "Espinal":[4.1492, -74.8843],
  "Melgar":[4.2044, -74.6407],
  "Tunja":[5.5353, -73.3678],
  "Duitama":[5.8269, -73.0347],
  "Sogamoso":[5.7204, -72.9333]
};

function generarCodigoSIAP(municipio, zona, serial){
  const m = municipio.slice(0,3).toUpperCase().replace(/\s/g,'');
  const z = zona.replace(/\s/g,'').toUpperCase();
  const s = String(serial).padStart(4,'0');
  return `SIAP-${m}-${z}-${s}`;
}

let inventario = [
  {
    id:1,
    nombre:"Luminaria 001 Zipa - Zona 1",
    coords:[5.0186,-74.0061],
    departamento:"Cundinamarca",
    municipio:"Zipaquirá",
    zona:"Zona 1",
    potenciaW:150,
    tipo:"LED",
    flujoLm:18000,
    alturaM:8,
    fecha_instalacion:"2021-04-12",
    vida_util:10,
    curva_fotometrica:"LM79-ref-001",
    estado:"fallo",
    consumoMensualKwh:25,
    observaciones:"Requiere reemplazo de driver",
    mantenimiento:[
      {fecha:"2023-05-12", tipo:"inspección", tecnico:"Operador A", obs:"Cambio portalámparas"}
    ]
  },
  {
    id:2,
    nombre:"Luminaria 002 Zipa - Zona 1",
    coords:[5.0220,-74.0020],
    departamento:"Cundinamarca",
    municipio:"Zipaquirá",
    zona:"Zona 1",
    potenciaW:100,
    tipo:"Sodio",
    flujoLm:12000,
    alturaM:7,
    fecha_instalacion:"2016-09-03",
    vida_util:8,
    curva_fotometrica:"NTC-curve-12",
    estado:"activa",
    consumoMensualKwh:30,
    observaciones:"-",
    mantenimiento:[
      {fecha:"2024-02-14", tipo:"reparación", tecnico:"Operador B", obs:"Reemplazo balasta"}
    ]
  },
  {
    id:3,
    nombre:"IGLESIA LA VALVANERA - Chía",
    coords:[4.86742,-74.04995],
    departamento:"Cundinamarca",
    municipio:"Chía",
    zona:"Centro",
    potenciaW:200,
    tipo:"LED",
    flujoLm:22000,
    alturaM:10,
    fecha_instalacion:"2022-06-01",
    vida_util:12,
    curva_fotometrica:"LM79-ref-igv",
    estado:"activa",
    consumoMensualKwh:45,
    observaciones:"Foco LED 200W",
    mantenimiento:[]
  },
  {
    id:4,
    nombre:"Parque Principal Chía",
    coords:[4.86463,-74.06047],
    departamento:"Cundinamarca",
    municipio:"Chía",
    zona:"Parque",
    potenciaW:120,
    tipo:"LED",
    flujoLm:15000,
    alturaM:9,
    fecha_instalacion:"2019-11-20",
    vida_util:10,
    curva_fotometrica:"LM79-PARQ",
    estado:"fallo",
    consumoMensualKwh:28,
    observaciones:"Fundamento, pos. 3",
    mantenimiento:[
      {fecha:"2025-01-12", tipo:"inspección", tecnico:"Operador C", obs:"Detectada corrosión en brazo"}
    ]
  },
  {
    id:5,
    nombre:"Luminaria Ibagué 01",
    coords:[4.4447,-75.2424],
    departamento:"Tolima",
    municipio:"Ibagué",
    zona:"Avenida 1",
    potenciaW:250,
    tipo:"LED",
    flujoLm:30000,
    alturaM:12,
    fecha_instalacion:"2020-03-10",
    vida_util:15,
    curva_fotometrica:"LM79-IBG-250",
    estado:"activa",
    consumoMensualKwh:55,
    observaciones:"-",
    mantenimiento:[]
  }
];

function inicializarInventario(){
  let serial = 1;
  for(const item of inventario){
    item.codigoSIAP = generarCodigoSIAP(item.municipio, item.zona, serial);
    item.costoKwh = 620;
    item.costoMensual = item.consumoMensualKwh * item.costoKwh;
    serial++;
  }
}
inicializarInventario();

/* ===========================================================
   MAPA LEAFLET
   =========================================================== */

const map = L.map('map', {
  zoomControl:true,
  attributionControl:false
}).setView([4.9,-74.1],8);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
  maxZoom:19
}).addTo(map);

function crearIconoColor(color){
  return new L.Icon({
    iconUrl:`https://maps.gstatic.com/mapfiles/ms2/micons/${color}-dot.png`,
    iconSize:[28,28],
    iconAnchor:[14,28],
    popupAnchor:[0,-26]
  });
}

const iconoVerde = crearIconoColor('green');
const iconoRojo = crearIconoColor('red');
const iconoAmarillo = crearIconoColor('yellow');
const iconoBlue = crearIconoColor('blue');
const iconoPurple = crearIconoColor('purple');

const markers = {};

function estadoAIcono(estado){
  if(estado==='activa') return iconoVerde;
  if(estado==='fallo') return iconoRojo;
  if(estado==='apagada') return iconoAmarillo;
  if(estado==='intermitente') return iconoPurple;
  if(estado==='robo') return iconoBlue;
  return iconoBlue;
}
document.getElementById("app")

