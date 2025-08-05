document.addEventListener('DOMContentLoaded', function () {
  // Crear usuarios de prueba si no existen
  if (!localStorage.getItem('usuarios')) {
    const usuariosPrueba = [
      { email: "admin@netshop.com", password: "123456" },
      { email: "jesustema@netshop.com", password: "cliente123" },
      { email: "Benedicto@netshop.com", password: "userpass1" },
      { email: "Rebecams@netshop.com", password: "userpass2" },
      { email: "asd", password: "asd" },
      { email: "Alfred12@netshop.com", password: "userpass2" }
    ];
    localStorage.setItem('usuarios', JSON.stringify(usuariosPrueba));
  }

  // Mostrar/Ocultar contraseña
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

  // Lógica del login
  document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();  
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    if (email.length === 0 && password.length === 0) {
      //alertify.error("Ingrese sus datos para continuar");
      mostrarPopupRegistroDatosFaltantes(e);
    } else if (email.length === 0) {
      //alertify.error("El correo electrónico es necesario");
      mostrarPopupRegistroDatosFaltantes(e);
    } else if (password.length === 0) {
      //alertify.error("La contraseña es necesaria");
      mostrarPopupRegistroDatosFaltantes(e);
    } else {
      const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
      const usuarioValido = usuarios.find(user => user.email === email && user.password === password);

      if (usuarioValido) {
        localStorage.setItem('usuarioActivo', email);
        mostrarPopupRegistro(e);
        //alertify.success("Bienvenido " + usuarioValido.email + ", es un gusto verlo de nuevo");
        //window.location.href = '/index/index.html';
      } else {
        //alertify.error("Usuario y contraseña incorrectos");
        mostrarPopupRegistroConInc(e);
      }
    }
  });
});


// -- POPUP INICIO SESION EXITOSO -- \\
function mostrarPopupRegistro(event) {
    event.preventDefault();
    document.getElementById("popup-login").style.display = "flex";
}

function cerrarPopupRegistro() {
    document.getElementById("popup-login").style.display = "none";
    window.location.href = "/index/index.html";
}

// -- POPUP CONTRASEÑA O USUARIO NO COINCIDE -- \\
function mostrarPopupRegistroConInc(event) {
    event.preventDefault();
    document.getElementById("popup-login-Con-Inc").style.display = "flex";
}

function cerrarPopupRegistroConInc() {
    document.getElementById("popup-login-Con-Inc").style.display = "none";
}

// -- POPUP Datos faltantes NO COINCIDE -- \\
function mostrarPopupRegistroDatosFaltantes(event) {
    event.preventDefault();
    document.getElementById("popup-login-DatosFalt").style.display = "flex";
}

function cerrarPopupRegistroDatosFaltantes() {
    document.getElementById("popup-login-DatosFalt").style.display = "none";
}