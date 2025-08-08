// ------------------------------
// Código que se ejecuta cuando el DOM está listo
// ------------------------------
document.addEventListener('DOMContentLoaded', function () {
  
  // ------------------------------
  // Crear usuarios de prueba en localStorage si no existen
  // ------------------------------
  if (!localStorage.getItem('usuarios')) {
    const usuariosPrueba = [
      { email: "admin@netshop.com", password: "123456" },
      { email: "jesustema@netshop.com", password: "cliente123" },
      { email: "benedicto@netshop.com", password: "userpass1" },
      { email: "rebecams@netshop.com", password: "userpass2" },
      { email: "asd", password: "asd" },
      { email: "alfred12@netshop.com", password: "userpass2" }
    ];
    localStorage.setItem('usuarios', JSON.stringify(usuariosPrueba));
  }

  // ------------------------------
  // Mostrar / ocultar la contraseña con icono de ojo
  // ------------------------------
  const togglePassword = document.getElementById('togglePassword');
  const passwordInput = document.getElementById('password');

  if (togglePassword && passwordInput) {
    togglePassword.addEventListener('click', function () {
      // Cambiar el tipo del input entre 'password' y 'text' para mostrar u ocultar la contraseña
      const isPassword = passwordInput.getAttribute('type') === 'password';
      passwordInput.setAttribute('type', isPassword ? 'text' : 'password');

      // Cambiar el icono del ojo (visible / oculto)
      this.classList.toggle('bi-eye-fill');
      this.classList.toggle('bi-eye-slash-fill');
    });
  }

  // ------------------------------
  // Manejo del evento submit del formulario de login
  // ------------------------------
  document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();  // Evitar recarga de página

    // Obtener valores de email y contraseña
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    // Validaciones para campos vacíos
    if (email.length === 0 && password.length === 0) {
      mostrarPopupRegistroDatosFaltantes(e);
    } else if (email.length === 0) {
      mostrarPopupRegistroDatosFaltantes(e);
    } else if (password.length === 0) {
      mostrarPopupRegistroDatosFaltantes(e);
    } else {
      // Buscar usuario en localStorage
      const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
      const usuarioValido = usuarios.find(user => user.email === email && user.password === password);

      if (usuarioValido) {
        // Si es válido, guardar el usuario activo en localStorage como objeto JSON
        localStorage.setItem('usuarioActivo', JSON.stringify(usuarioValido));

        // Mostrar popup de login exitoso
        mostrarPopupRegistro(e);
      } else {
        // Mostrar popup de error de usuario o contraseña incorrectos
        mostrarPopupRegistroConInc(e);
      }
    }
  });
});

// ------------------------------
// Funciones para mostrar y cerrar popups
// ------------------------------

// Popup: Login exitoso
function mostrarPopupRegistro(event) {
  event.preventDefault();
  document.getElementById("popup-login").style.display = "flex";
}
function cerrarPopupRegistro() {
  document.getElementById("popup-login").style.display = "none";
  window.location.href = "/index/index.html";  // Redirigir al inicio
}

// Popup: Usuario o contraseña incorrectos
function mostrarPopupRegistroConInc(event) {
  event.preventDefault();
  document.getElementById("popup-login-Con-Inc").style.display = "flex";
}
function cerrarPopupRegistroConInc() {
  document.getElementById("popup-login-Con-Inc").style.display = "none";
}

// Popup: Campos faltantes
function mostrarPopupRegistroDatosFaltantes(event) {
  event.preventDefault();
  document.getElementById("popup-login-DatosFalt").style.display = "flex";
}
function cerrarPopupRegistroDatosFaltantes() {
  document.getElementById("popup-login-DatosFalt").style.display = "none";
}
