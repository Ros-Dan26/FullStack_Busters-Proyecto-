// ------------------------------
// Código que se ejecuta cuando el DOM está listo
// ------------------------------
document.addEventListener('DOMContentLoaded', function () {
  
  // ------------------------------
  // Crear usuarios de prueba si no existen en localStorage
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
    // Guardamos el array de usuarios como JSON en localStorage
    localStorage.setItem('usuarios', JSON.stringify(usuariosPrueba));
  }

  // ------------------------------
  // Mostrar / ocultar la contraseña con icono de ojo
  // ------------------------------
  const togglePassword = document.getElementById('togglePassword');
  const passwordInput = document.getElementById('password');

  if (togglePassword && passwordInput) {
    togglePassword.addEventListener('click', function () {
      // Cambiar tipo del input entre 'password' y 'text'
      const isPassword = passwordInput.getAttribute('type') === 'password';
      passwordInput.setAttribute('type', isPassword ? 'text' : 'password');

      // Cambiar icono (ojo abierto / cerrado)
      this.classList.toggle('bi-eye-fill');
      this.classList.toggle('bi-eye-slash-fill');
    });
  }

  // ------------------------------
  // Manejo del formulario de login
  // ------------------------------
  document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault(); // Evitar recarga de página

    // Obtener email y contraseña ingresados
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    // Validaciones: campos vacíos
    if (!email || !password) {
      mostrarPopupRegistroDatosFaltantes(e);
    } else {
      // Buscar usuario en localStorage
      const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
      const usuarioValido = usuarios.find(user => user.email === email && user.password === password);

      if (usuarioValido) {
        // Guardar el usuario activo
        localStorage.setItem('usuarioActivo', JSON.stringify(usuarioValido));

        // Mostrar popup de login exitoso
        mostrarPopupRegistro(e);
      } else {
        // Mostrar popup de error (usuario o contraseña incorrectos)
        mostrarPopupRegistroConInc(e);
      }
    }
  });
});

// ------------------------------
// POPUPS de mensajes
// ------------------------------

// Popup: Login exitoso
function mostrarPopupRegistro(event) {
  event.preventDefault();
  document.getElementById("popup-login").style.display = "flex";
}
function cerrarPopupRegistro() {
  // Ocultar popup
  document.getElementById("popup-login").style.display = "none";

  // Si la función manejarSesion está disponible, actualizar navbar
  if (typeof manejarSesion === "function") {
    manejarSesion();
  }

  // Redirigir al inicio
  window.location.href = "/index/index.html";
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
