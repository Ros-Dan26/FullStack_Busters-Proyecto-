// /header-footer/header-footer.js
(function () {
  const HEADER_URL = "/header-footer/header.html";
  const FOOTER_URL = "/header-footer/footer.html";
  const SESSION_JS = "/Login/session.js";

  function ensureSessionLoaded(cb) {
    if (typeof window.manejarSesion === "function") {
      cb && cb();
      return;
    }
    const script = document.createElement("script");
    script.src = SESSION_JS;
    script.onload = () => cb && cb();
    document.body.appendChild(script);
  }

  window.cargarHeader = function () {
    return fetch(HEADER_URL)
      .then(r => r.text())
      .then(html => {
        const el = document.getElementById("header-container");
        if (el) el.innerHTML = html;
        ensureSessionLoaded(() => {
          if (typeof window.manejarSesion === "function") window.manejarSesion();
        });
      });
  };

  window.cargarFooter = function () {
    return fetch(FOOTER_URL)
      .then(r => r.text())
      .then(html => {
        const el = document.getElementById("footer-container");
        if (el) el.innerHTML = html;
      });
  };

  document.addEventListener("DOMContentLoaded", () => {
    // Llama a estas funciones en cada página que incluya este archivo
    cargarHeader();
    cargarFooter();
  });
})();
