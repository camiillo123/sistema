"use strict";

/* ===========================================================
   AUTENTICACIÓN (login / registro) - localStorage
   =========================================================== */

let users = JSON.parse(localStorage.getItem("users") || "[]");

function checkAuthOnLoad() {
  const auth = localStorage.getItem("auth") === "true";

  const authContainer = document.getElementById("authContainer");
  const appContent = document.getElementById("appContent");

  if (!authContainer || !appContent) return;

  if (auth) {
    authContainer.style.display = "none";
    appContent.style.display = "block";

    // Leaflet necesita recalcular tamaño cuando se muestra
    setTimeout(() => {
      if (window.map) {
        map.invalidateSize();
      }
    }, 300);
  } else {
    authContainer.style.display = "flex";
    appContent.style.display = "none";
  }
}

document.addEventListener("DOMContentLoaded", checkAuthOnLoad);

function authShowRegister() {
  document.getElementById("loginBoxAuth").style.display = "none";
  document.getElementById("registerBoxAuth").style.display = "block";
}

function authShowLogin() {
  document.getElementById("registerBoxAuth").style.display = "none";
  document.getElementById("loginBoxAuth").style.display = "block";
}

function authRegister() {
  const nombre = document.getElementById("authRegNombre").value.trim();
  const email = document.getElementById("authRegEmail").value.trim().toLowerCase();
  const pass = document.getElementById("authRegPass").value.trim();

  if (!nombre || !email || !pass) {
    alert("Completa todos los campos");
    return;
  }

  if (users.some(u => u.email === email)) {
    alert("Este correo ya está registrado");
    return;
  }

  users.push({ nombre, email, pass });
  localStorage.setItem("users", JSON.stringify(users));

  alert("Registro exitoso ✔ Ahora inicia sesión");
  authShowLogin();
}

function authLogin() {
  const email = document.getElementById("authLoginEmail").value.trim().toLowerCase();
  const pass = document.getElementById("authLoginPass").value.trim();

  if (!email || !pass) {
    alert("Completa todos los campos");
    return;
  }

  const user = users.find(u => u.email === email && u.pass === pass);
  if (!user) {
    alert("Correo o contraseña incorrectos");
    return;
  }

  localStorage.setItem("auth", "true");
  checkAuthOnLoad();
}

function logout() {
  localStorage.removeItem("auth");
  location.reload();
}

/* ===========================================================
   DATOS E INVENTARIO
   =========================================================== */

const coordenadasMunicipios = {
  "Zipaquirá": [5.0221, -73.9947],
  "Chía": [4.8588, -74.058],
  "Girardot": [4.3008, -74.8034],
  "Ibagué": [4.4447, -75.2424],
  "Espinal": [4.1492, -74.8843],
  "Melgar": [4.2044, -74.6407],
  "Tunja": [5.5353, -73.3678],
  "Duitama": [5.8269, -73.0347],
  "Sogamoso": [5.7204, -72.9333]
};

const nivelMinimoPorVia = {
  residencial: 5,
  intersección: 20,
  avenida: 10,
  carretera: 7
};

function generarCodigoSIAP(municipio, zona, serial) {
  const m = municipio.slice(0, 3).toUpperCase().replace(/\s/g, "");
  const z = zona.replace(/\s/g, "").toUpperCase();
  const s = String(serial).padStart(4, "0");
  return `SIAP-${m}-${z}-${s}`;
}

let inventario = [
  {
    id: 1,
    nombre: "Luminaria 001 Zipa - Zona 1",
    coords: [5.0186, -74.0061],
    departamento: "Cundinamarca",
    municipio: "Zipaquirá",
    zona: "Zona 1",
    potenciaW: 150,
    tipo: "LED",
    flujoLm: 18000,
    alturaM: 8,
    fecha_instalacion: "2021-04-12",
    vida_util: 10,
    curva_fotometrica: "LM79-ref-001",
    estado: "fallo",
    consumoMensualKwh: 25,
    observaciones: "Requiere reemplazo de driver",
    mantenimiento: [
      { fecha: "2023-05-12", tipo: "inspección", tecnico: "Operador A", obs: "Cambio portalámparas" }
    ]
  },
  {
    id: 2,
    nombre: "Luminaria 002 Zipa - Zona 1",
    coords: [5.0220, -74.0020],
    departamento: "Cundinamarca",
    municipio: "Zipaquirá",
    zona: "Zona 1",
    potenciaW: 100,
    tipo: "Sodio",
    flujoLm: 12000,
    alturaM: 7,
    fecha_instalacion: "2016-09-03",
    vida_util: 8,
    curva_fotometrica: "NTC-curve-12",
    estado: "activa",
    consumoMensualKwh: 30,
    observaciones: "-",
    mantenimiento: [
      { fecha: "2024-02-14", tipo: "reparación", tecnico: "Operador B", obs: "Reemplazo balasta" }
    ]
  }
];

function inicializarInventario() {
  let serial = 1;
  inventario.forEach(item => {
    item.codigoSIAP = generarCodigoSIAP(item.municipio, item.zona, serial++);
    item.costoKwh = 620;
    item.costoMensual = item.consumoMensualKwh * item.costoKwh;
  });
}

inicializarInventario();

/* ===========================================================
   MAPA LEAFLET
   =========================================================== */

window.map = L.map("map", {
  zoomControl: true,
  attributionControl: false
}).setView([4.9, -74.1], 8);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19
}).addTo(map);

function crearIconoColor(color) {
  return new L.Icon({
    iconUrl: `https://maps.gstatic.com/mapfiles/ms2/micons/${color}-dot.png`,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -26]
  });
}

const iconos = {
  activa: crearIconoColor("green"),
  fallo: crearIconoColor("red"),
  apagada: crearIconoColor("yellow"),
  intermitente: crearIconoColor("purple"),
  robo: crearIconoColor("blue")
};

function estadoAIcono(estado) {
  return iconos[estado] || iconos.robo;
}

const markers = {};

inventario.forEach(item => {
  const marker = L.marker(item.coords, {
    icon: estadoAIcono(item.estado)
  }).addTo(map);

  marker.bindPopup(`
    <strong>${item.nombre}</strong><br>
    ${item.municipio} - ${item.zona}<br>
    <b>Estado:</b> ${item.estado}<br>
    <button onclick="verFicha(${item.id})">Ver ficha</button>
  `);

  markers[item.id] = marker;
});

/* ===========================================================
   FICHA TÉCNICA
   =========================================================== */

function verFicha(id) {
  const item = inventario.find(i => i.id === id);
  if (!item) return;

  const ficha = document.getElementById("fichaDetalle");
  if (!ficha) return;

  ficha.innerHTML = `
    <b>${item.nombre}</b><br>
    <b>Código SIAP:</b> ${item.codigoSIAP}<br>
    <b>Municipio:</b> ${item.municipio}<br>
    <b>Zona:</b> ${item.zona}<br>
    <b>Tipo:</b> ${item.tipo}<br>
    <b>Potencia:</b> ${item.potenciaW} W<br>
    <b>Estado:</b> ${item.estado}<br>
    <b>Consumo mensual:</b> ${item.consumoMensualKwh} kWh<br>
    <b>Costo mensual:</b> $${item.costoMensual.toLocaleString("es-CO")}
  `;
}

function centrarEn(lat, lng) {
  map.setView([lat, lng], 17);
}
