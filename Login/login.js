// Crear usuarios de prueba si no existen
if (!localStorage.getItem('usuarios')) {
  const usuariosPrueba = [
    { email: "admin@netshop.com", password: "123456" },
    { email: "jesustema@netshop.com", password: "cliente123" },
    { email: "Benedicto@netshop.com", password: "userpass1" },
    { email: "Rebecams@netshop.com", password: "userpass2" },
    { email: "Alfred12@netshop.com", password: "userpass2" }
  ];
  localStorage.setItem('usuarios', JSON.stringify(usuariosPrueba));
}

// Validar login al enviar el formulario
document.getElementById('loginForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  // Validar campos vacíos
  if (email === "" || password === "") {
    alert("Por favor, completa todos los campos.");
    return;
  }

  const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
  const usuarioValido = usuarios.find(user => user.email === email && user.password === password);

  if (usuarioValido) {
    alert("¡Inicio de sesión exitoso!, Redirigiendo a la página principal");

    // Guardar el usuario activo
    localStorage.setItem('usuarioActivo', email);

    // Redirigir a la página principal
    window.location.href = 'index.html';
  } else {
    alert("Nombre de usuario o contraseña inválidos.");
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