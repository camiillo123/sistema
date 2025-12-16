/* ===========================================================
   AUTENTICACIÓN (login/register) - localStorage
   =========================================================== */
let users = JSON.parse(localStorage.getItem("users") || "[]");

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

/* 🔴 SIGUE AQUÍ TODO TU JS ORIGINAL
   - inventario
   - leaflet
   - marcadores
   - SIAP
   - RETILAP
   - búsqueda
   - mantenimiento
   - toggleMap
   - exports
   EXACTAMENTE IGUAL
*/
