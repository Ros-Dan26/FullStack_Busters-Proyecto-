function manejarSesion() {
  const userData = localStorage.getItem('usuario');

  const loginItem = document.getElementById('user-name');
  const userDropdown = document.getElementById('userDropdown');
  const usernameDisplay = document.getElementById('usernameDisplay');

  if (userData) {
    const usuario = JSON.parse(userData);
    const nombreUsuario = usuario.email.split('@')[0];

    // Ocultar "Iniciar sesión" y mostrar el dropdown
    if (loginItem) loginItem.style.display = 'none';
    if (userDropdown) {
      userDropdown.style.display = 'block';
      if (usernameDisplay) {
        usernameDisplay.textContent = `¡Hola, ${nombreUsuario}!`;
      }
    }
  } else {
    // Si no hay usuario, asegurarse de mostrar "Iniciar sesión"
    if (loginItem) loginItem.style.display = 'block';
    if (userDropdown) userDropdown.style.display = 'none';
  }
}

// Ejecutar al cargar
document.addEventListener('DOMContentLoaded', manejarSesion);

// Función de logout
function logout() {
  localStorage.removeItem('usuario');
  window.location.href = "login.html";
}

