// /Login/session.js
(function () {
  // ===== Helpers de sesión (globales) =====
  window.saveSession = function (user) {
    if (!user || !user.id) throw new Error("Usuario inválido: falta id");
    const clean = {
      id: Number(user.id),
      email: user.email || "",
      firstName: user.firstName || "",
      lastName: user.lastName || ""
    };
    localStorage.setItem("usuarioActivo", JSON.stringify(clean));
  };

  window.getSessionUser = function () {
    try {
      const raw = localStorage.getItem("usuarioActivo");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  };

  window.isLoggedIn = function () {
    const u = getSessionUser();
    return !!(u && Number.isInteger(Number(u.id)) && Number(u.id) > 0);
  };

  window.logout = function () {
    localStorage.removeItem("usuarioActivo");
  };

  // ===== UI del header según sesión (global) =====
  window.manejarSesion = function () {
    const usuario = getSessionUser();

    const dropdown = document.getElementById('userDropdown');
    const username = document.getElementById('usernameDisplay');
    const iniciarSesion = document.getElementById('user-name');
    const registroProducto = document.getElementById('registroProducto');

    if (usuario) {
      if (dropdown) dropdown.style.display = 'block';
      if (username) username.textContent = (usuario.email || "").split('@')[0];
      if (iniciarSesion) iniciarSesion.style.display = 'none';
      if (registroProducto) registroProducto.style.display = 'block';
    } else {
      if (dropdown) dropdown.style.display = 'none';
      if (username) username.textContent = '';
      if (iniciarSesion) iniciarSesion.style.display = 'block';
      if (registroProducto) registroProducto.style.display = 'none';
    }
  };

  // ===== Enlace global de logout si existe un #btn-logout en el header =====
  document.addEventListener('DOMContentLoaded', () => {
    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
      btnLogout.addEventListener('click', (e) => {
        e.preventDefault();
        logout();
        manejarSesion();
        window.location.href = "/Login/login.html";
      });
    }
    // Aplica visibilidad al cargar
    manejarSesion();
  });
})();
