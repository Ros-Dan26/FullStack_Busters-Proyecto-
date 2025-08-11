// Maneja la visibilidad de elementos del header según si hay sesión activa
function manejarSesion() {
  console.log("Ejecutando manejarSesion...");

  // Obtener el usuario activo desde localStorage (guardado como JSON)
  const usuarioJSON = localStorage.getItem('usuarioActivo');
  console.log("usuarioActivo en localStorage:", usuarioJSON);

  // Parsear el JSON o asignar null si no existe
  const usuario = usuarioJSON ? JSON.parse(usuarioJSON) : null;

  // Referencias a elementos del header (pueden ser null si aún no están en el DOM)
  const dropdown = document.getElementById('userDropdown');
  const username = document.getElementById('usernameDisplay');
  const iniciarSesion = document.getElementById('user-name');
  const registroProducto = document.getElementById('registroProducto');

  if (usuario) {
    console.log("Usuario activo:", usuario.email);

    if (dropdown) {
      dropdown.style.display = 'block'; // Mostrar dropdown usuario

      // Agregar evento para ir al perfil al hacer clic en el nombre de usuario
      const enlaceUsuario = dropdown.querySelector('a.nav-link');
      if (enlaceUsuario) {
        enlaceUsuario.style.cursor = 'pointer';
        enlaceUsuario.onclick = function(e) {
          e.preventDefault();
          irPerfil();
        };
      }
    }
    if (username) username.textContent = usuario.email.split('@')[0]; // Mostrar nombre usuario
    if (iniciarSesion) iniciarSesion.style.display = 'none'; // Ocultar iniciar sesión
    if (registroProducto) registroProducto.style.display = 'block'; // Mostrar registro producto
  } else {
    console.log("No hay usuario activo");

    if (dropdown) dropdown.style.display = 'none'; // Ocultar dropdown usuario
    if (username) username.textContent = ''; // Limpiar nombre usuario
    if (iniciarSesion) iniciarSesion.style.display = 'block'; // Mostrar iniciar sesión
    if (registroProducto) registroProducto.style.display = 'none'; // Ocultar registro producto
  }
}

// Función para redirigir a perfil
function irPerfil() {
  window.location.href = '/perfil/perfil.html';
}

// Ejecutar manejarSesion cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', manejarSesion);
