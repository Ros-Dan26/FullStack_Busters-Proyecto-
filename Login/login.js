// /Login/login.js
document.addEventListener('DOMContentLoaded', function () {
  // Mostrar / ocultar contraseña
  const togglePassword = document.getElementById('togglePassword');
  const passwordInput = document.getElementById('password');
  if (togglePassword && passwordInput) {
    togglePassword.addEventListener('click', function () {
      const isPassword = passwordInput.getAttribute('type') === 'password';
      passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
      this.classList.toggle('bi-eye-fill');
      this.classList.toggle('bi-eye-slash-fill');
    });
  }

  // Manejo del form de login
  document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!email || !password) {
      mostrarPopupRegistroDatosFaltantes(e);
      return;
    }

    try {
      // NOTA: Esto consulta todos los usuarios y valida en cliente (no es seguro en producción)
      const res = await fetch("http://jft314.ddns.net:8080/nso/api/v1/nso/user/all", { method: "GET" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const users = await res.json();

      const usuarioValido = users.find(user => user.email === email && user.password === password);
      if (usuarioValido) {
        // Guarda solo lo necesario para sesión
        localStorage.setItem('usuarioActivo', JSON.stringify({
          id: usuarioValido.id,
          email: usuarioValido.email,
          firstName: usuarioValido.firstName,
          lastName: usuarioValido.lastName
        }));
        mostrarPopupRegistro(e);
      } else {
        mostrarPopupRegistroConInc(e);
      }
    } catch (err) {
      console.error('Error al obtener usuarios:', err);
      alert("No se pudo validar el usuario. Intenta de nuevo.");
    }
  });
});

// POPUPS (se mantienen)
function mostrarPopupRegistro(event) {
  event.preventDefault();
  document.getElementById("popup-login").style.display = "flex";
}
function cerrarPopupRegistro() {
  document.getElementById("popup-login").style.display = "none";
  if (typeof manejarSesion === "function") manejarSesion();
  window.location.href = "../index.html";
}
function mostrarPopupRegistroConInc(event) {
  event.preventDefault();
  document.getElementById("popup-login-Con-Inc").style.display = "flex";
}
function cerrarPopupRegistroConInc() {
  document.getElementById("popup-login-Con-Inc").style.display = "none";
}
function mostrarPopupRegistroDatosFaltantes(event) {
  event.preventDefault();
  document.getElementById("popup-login-DatosFalt").style.display = "flex";
}
function cerrarPopupRegistroDatosFaltantes() {
  document.getElementById("popup-login-DatosFalt").style.display = "none";
}
