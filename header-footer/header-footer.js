function cargarHeader() {
  fetch('/header-footer/header.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('header-container').innerHTML = data;

      // Ejecutar lógica de sesión una vez insertado el header
      manejarSesion(); // Esta función debe estar en session.js
    });
}

function cargarFooter() {
  fetch('/header-footer/footer.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('footer-container').innerHTML = data;
    });
}
