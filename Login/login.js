document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    // Validación de inicio de sesión
    if (email === "" || password === "") {
        alert("Por favor, completa todos los campos.");
        return;
    }

    // Simulación de autenticación
    const username = email.split('@')[0]; // Extraer nombre de usuario

    // Guardar sesión en localStorage
    localStorage.setItem('usuarioActivo', JSON.stringify({
        nombre: username,
        email: email
    }));

    alert("¡Inicio de sesión exitoso! Redirigiendo a la página principal");
    window.location.href = 'index.html';
});
