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

  if (!email && !password) {
    alertify.error("Ingrese sus datos para continuar");
  } else if (!email) {
    alertify.error("El correo electrónico es necesario");
  } else if (!password) {
    alertify.error("La contraseña es necesaria");
  } else {
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const usuarioValido = usuarios.find(user => user.email === email && user.password === password);

    if (usuarioValido) {
      // Guardar usuario completo en localStorage
      localStorage.setItem('usuario', JSON.stringify(usuarioValido));

      // Mostrar mensaje y redirigir
      alertify.success(`Bienvenido ${usuarioValido.email}, es un gusto verlo de nuevo`);
      window.location.href = 'index.html';
    } else {
      alertify.error("Usuario y contraseña incorrectos");
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
