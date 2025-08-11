function cargarHeader() {
  return fetch('/header-footer/header.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('header-container').innerHTML = data;

      // Cargar session.js y luego llamar manejarSesion
      const script = document.createElement('script');
      script.src = '/Login/session.js';
      script.onload = () => {
        manejarSesion();
      };
      document.body.appendChild(script);
    });
}

function cargarFooter() {
  return fetch('/header-footer/footer.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('footer-container').innerHTML = data;
    });
}

document.addEventListener('DOMContentLoaded', () => {
  cargarHeader();
  cargarFooter();
});
