document.addEventListener('DOMContentLoaded', function () {

  // ------------------------------
  // Mostrar / ocultar la contraseña con icono de ojo
  // ------------------------------
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

  // ------------------------------
  // Manejo del formulario de login
  // ------------------------------
  document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!email || !password) {
      mostrarPopupRegistroDatosFaltantes(e);
      return;
    }

    fetch("http://jft314.ddns.net:8080/nso/api/v1/nso/user/all", {
      method: "GET",
      redirect: "follow"
    })
      .then(response => response.json())
      .then(users => {
        // Buscar usuario válido según backend
        const usuarioValido = users.find(user => user.email === email && user.password === password);

        if (usuarioValido) {
          // Guardar usuario activo con datos esenciales
          localStorage.setItem('usuarioActivo', JSON.stringify({
            email: usuarioValido.email,
            id: usuarioValido.id,
            firstName: usuarioValido.firstName,
            lastName: usuarioValido.lastName
          }));

          mostrarPopupRegistro(e);
        } else {
          mostrarPopupRegistroConInc(e);
        }
      })
      .catch(error => {
        console.error('Error al obtener usuarios:', error);
        // Aquí podrías mostrar un popup de error de conexión si quieres
      });
  });

});

// ------------------------------
// POPUPS de mensajes (los mantengo igual que antes)
// ------------------------------

function mostrarPopupRegistro(event) {
  event.preventDefault();
  document.getElementById("popup-login").style.display = "flex";
}

function cerrarPopupRegistro() {
  document.getElementById("popup-login").style.display = "none";

  if (typeof manejarSesion === "function") {
    manejarSesion();
  }

  window.location.href = "/index/index.html";
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
