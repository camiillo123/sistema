"use strict";

/* ===========================================================
   AUTENTICACIÓN (login / registro) - localStorage
   =========================================================== */

let users = JSON.parse(localStorage.getItem("users") || "[]");

function checkAuthOnLoad() {

  // 🔒 Protección total (evita error null)
  if (!authContainer || !appContent) {
    console.warn("authContainer o appContent no existen aún");
    return;
  }

  const auth = localStorage.getItem("auth") === "true";

  if (auth) {
    authContainer.style.display = "none";
    appContent.style.display = "block";

    // Recalcular Leaflet cuando aparece
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

/* 👉 SOLO cuando el DOM esté listo */
document.addEventListener("DOMContentLoaded", () => {
  checkAuthOnLoad();
});

/* ===========================================================
   LOGIN / REGISTRO
   =========================================================== */

function authShowRegister() {
  const login = document.getElementById("loginBoxAuth");
  const register = document.getElementById("registerBoxAuth");
  if (login && register) {
    login.style.display = "none";
    register.style.display = "block";
  }
}

function authShowLogin() {
  const login = document.getElementById("loginBoxAuth");
  const register = document.getElementById("registerBoxAuth");
  if (login && register) {
    register.style.display = "none";
    login.style.display = "block";
  }
}

function authRegister() {
  const nombre = document.getElementById("authRegNombre")?.value.trim();
  const email = document.getElementById("authRegEmail")?.value.trim().toLowerCase();
  const pass = document.getElementById("authRegPass")?.value.trim();

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

  alert("Registro exitoso ✔");
  authShowLogin();
}

function authLogin() {
  const email = document.getElementById("authLoginEmail")?.value.trim().toLowerCase();
  const pass = document.getElementById("authLoginPass")?.value.trim();

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
   MAPA LEAFLET (solo si existe el div)
   =========================================================== */

let map;

document.addEventListener("DOMContentLoaded", () => {
  const mapDiv = document.getElementById("map");
  if (!mapDiv) return;

  map = L.map("map", {
    zoomControl: true,
    attributionControl: false
  }).setView([4.9, -74.1], 8);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19
  }).addTo(map);
});

/* ===========================================================
   FUNCIONES GLOBALES (necesarias para HTML)
   =========================================================== */

window.authLogin = authLogin;
window.authRegister = authRegister;
window.authShowLogin = authShowLogin;
window.authShowRegister = authShowRegister;
window.logout = logout;

