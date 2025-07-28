// Crear usuario de prueba si no existe
if (!localStorage.getItem('usuarios')) {
  const usuarioPrueba = {
    email: "admin@netshop.com",
    password: "123456"
  };
  localStorage.setItem('usuarios', JSON.stringify([usuarioPrueba]));
}

document.getElementById('loginForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  // Validar campos vacíos
  if (email === "" || password === "") {
    alert("Por favor, completa todos los campos.");
    return;
  }

  const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

  const usuarioValido = usuarios.find(user => user.email === email && user.password === password);

  if (usuarioValido) {
    alert(`¡Bienvenido, ${email}!`);
    // Puedes redirigir si deseas: window.location.href = "home.html";
  } else {
    alert("Nombre de usuario o contraseña inválidos.");
  }
});
