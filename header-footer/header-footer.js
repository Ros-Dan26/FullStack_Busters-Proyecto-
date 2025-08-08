function cargarHeader() {
  return fetch('/header-footer/header.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('header-container').innerHTML = data;
    });
}

function cargarFooter() {
  return fetch('/header-footer/footer.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('footer-container').innerHTML = data;
    });
}

