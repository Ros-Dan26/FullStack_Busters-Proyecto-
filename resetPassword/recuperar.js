document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('recoverForm');
  const popup = document.getElementById('popup-reset');
  const popupMessage = document.getElementById('popup-message-reset');

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const email = document.getElementById('recoverEmail').value.trim();

    if (!email) {
      mostrarPopupReset("Por favor, ingresa tu correo electrónico", true);
      return;
    }

    if (!esCorreoValido(email)) {
      mostrarPopupReset("Este correo no es válido", true);
      return;
    }

    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const existe = usuarios.find(user => user.email === email);

    if (existe) {
      mostrarPopupReset("Se ha enviado un enlace de recuperación a " + email, false);
    } else {
      mostrarPopupReset("Este correo no está registrado", true);
    }
  });

  window.addEventListener('click', function (event) {
    if (event.target === popup) {
      cerrarPopupReset();
    }
  });
});

function mostrarPopupReset(mensaje, esError = false) {
  const popup = document.getElementById('popup-reset');
  const popupMessage = document.getElementById('popup-message-reset');

  popupMessage.textContent = mensaje;

  if (esError) {
    popupMessage.classList.add('popup-error');
  } else {
    popupMessage.classList.remove('popup-error');
  }

  popup.style.display = 'flex';
}

function cerrarPopupReset() {
  const popup = document.getElementById('popup-reset');
  popup.style.display = 'none';
}

function esCorreoValido(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}
