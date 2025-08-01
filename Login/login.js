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

// Validar los datos del usuario antes de iniciar sesión
document.getElementById('loginForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  e.preventDefault();

  if (email.length == 0 && password.length == 0) {
    alertify.error("Ingrese sus datos para continuar");
  } else {
    if (email.length == 0) {
      alertify.error("El correo electronico es necesario");
    } else if (password.length == 0) {
      alertify.error("La contrasena es necesaria");
    } else {
      const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
      let usuarioValido = 0;
      usuarioValido =
        usuarios.find(user => user.email === email && user.password === password);

      if (usuarioValido) {

        // Guardar el usuario activo
        localStorage.setItem('usuarioActivo', email);

        // Redirigir a la página principal
        window.location.href = 'index.html';

        alertify.success("Bienvenido " +
          usuarioValido.email +
          ", es un gusto verlo de nuevo");
        // Guardar el usuario activo
        localStorage.setItem('usuarioActivo', email);
      } else {
        alertify.error("Usuario y contrasena incorrectos");
      }
    }
  }
});

// Mostrar/ocultar contraseña
document.addEventListener('DOMContentLoaded', function () {
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
});