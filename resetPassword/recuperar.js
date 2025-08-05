// Espera a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function () {

  // Captura el formulario por su ID y agrega un evento de submit
  document.getElementById('recoverForm').addEventListener('submit', function (e) {
    e.preventDefault(); // Evita que se recargue la página

    // Obtiene el valor del campo de email y lo limpia de espacios
    const email = document.getElementById('recoverEmail').value.trim();

    // Validación básica: si el campo está vacío, mostrar error
    if (!email) {
      alertify.error("Por favor, ingresa tu correo electrónico");
      return;
    }

    // Recupera la lista de usuarios desde localStorage (si existe)
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

    // Verifica si el correo ingresado existe en la base local
    const existe = usuarios.find(user => user.email === email);

    if (existe) {
      // Si existe, simula el envío del correo de recuperación
      alertify.success("Se ha enviado un enlace de recuperación a " + email);
      // Aquí podrías generar un token o redirigir a una página "reset-password"
    } else {
      // Si no existe el correo, muestra mensaje de error
      alertify.error("Este correo no está registrado");
    }
  });
});
