/* ================== AUTH ================== */
let users = JSON.parse(localStorage.getItem("users") || "[]");

function authShowRegister(){
  loginBoxAuth.style.display="none";
  registerBoxAuth.style.display="block";
}

function authShowLogin(){
  registerBoxAuth.style.display="none";
  loginBoxAuth.style.display="block";
}

function authRegister(){
  const nombre = authRegNombre.value.trim();
  const email = authRegEmail.value.trim().toLowerCase();
  const pass = authRegPass.value.trim();

  if(!nombre||!email||!pass){ alert("Campos incompletos"); return; }
  users.push({nombre,email,pass});
  localStorage.setItem("users",JSON.stringify(users));
  alert("Registro exitoso");
  authShowLogin();
}

function authLogin(){
  const email = authLoginEmail.value.trim().toLowerCase();
  const pass = authLoginPass.value.trim();
  const user = users.find(u=>u.email===email && u.pass===pass);
  if(!user){ alert("Credenciales inválidas"); return; }
  localStorage.setItem("auth","true");
  location.reload();
}

function logout(){
  localStorage.removeItem("auth");
  location.reload();
}

/* ================== MAPA ================== */
const map = L.map('map').setView([4.9,-74.1],8);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
  maxZoom:19
}).addTo(map);

/* ================== INVENTARIO ================== */
// TODO: aquí va TODO tu inventario y funciones tal como estaban
