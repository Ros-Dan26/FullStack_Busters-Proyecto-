document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();
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
