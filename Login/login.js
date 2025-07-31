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

//valida los datos del usuario antes de inicar sesion
document.getElementById('loginForm').addEventListener('submit', function (e) {
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

    // Validacion de Inicio de Sesion
    if (email === "" || password === "") {
        alert("Por favor, completa todos los campos.");
        return;
    }

    // Aquí puedes agregar la lógica de autenticación
    alert("¡Inicio de sesión exitoso!, Redirigiendo a la pagina principal");
    window.location.href = 'index.html';
});
