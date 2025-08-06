// Función que maneja la sesión y muestra/oculta elementos del navbar
function manejarSesion() {
  // Obtenemos el usuario activo desde localStorage (debe estar guardado como objeto JSON)
  const usuarioJSON = localStorage.getItem('usuarioActivo');
  const usuario = usuarioJSON ? JSON.parse(usuarioJSON) : null;

  // Referencias a elementos del DOM
  const dropdown = document.getElementById('userDropdown');           // Dropdown con nombre usuario y logout
  const username = document.getElementById('usernameDisplay');         // Span donde mostramos nombre usuario
  const iniciarSesion = document.getElementById('user-name');          // Link "Iniciar sesión"
  const registroProducto = document.getElementById('registroProducto');// Link "Registro Producto"

  if (usuario) {
    // Si hay usuario activo:
    if (dropdown) dropdown.style.display = 'block';                     // Mostrar dropdown usuario
    if (username) username.textContent = usuario.email.split('@')[0];  // Mostrar nombre antes de @
    if (iniciarSesion) iniciarSesion.style.display = 'none';            // Ocultar "Iniciar sesión"
    if (registroProducto) registroProducto.style.display = 'block';    // Mostrar "Registro Producto"
  } else {
    // Si NO hay usuario activo:
    if (dropdown) dropdown.style.display = 'none';                      // Ocultar dropdown usuario
    if (username) username.textContent = '';                            // Limpiar nombre usuario
    if (iniciarSesion) iniciarSesion.style.display = 'block';           // Mostrar "Iniciar sesión"
    if (registroProducto) registroProducto.style.display = 'none';     // Ocultar "Registro Producto"
  }
}

// Función para cerrar sesión
function logout() {
  localStorage.removeItem('usuarioActivo'); // Elimina usuario activo del localStorage
  location.href = '/index/index.html';      // Redirige al inicio
}

// Ejecutar la función manejarSesion cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', manejarSesion);
