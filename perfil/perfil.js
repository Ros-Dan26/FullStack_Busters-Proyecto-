document.addEventListener('DOMContentLoaded', () => {
  /* === CONSTANTES - LLAVES LOCALSTORAGE === */
  const USUARIO_ACTIVO_KEY = 'usuarioActivo';
  const USUARIO_DATOS_KEY = 'perfil_usuario';
  const DIRECCION_KEY = 'perfil_direccion';
  const CARRITO_KEY = 'carrito';

  /* === ELEMENTOS DEL DOM === */
  const contenedorPerfil = document.getElementById('perfil-contenido');
  const enlacesMenu = document.querySelectorAll('.perfil-user .nav-link');
  const fotoPerfil = document.getElementById('foto-perfil');
  const inputFoto = document.getElementById('cargar-foto');

  /* Elementos Navbar */
  const dropdown = document.getElementById('userDropdown');
  const username = document.getElementById('usernameDisplay');
  const iniciarSesion = document.getElementById('user-name');
  const perfilLink = document.getElementById('perfilLink');
  const registroProducto = document.getElementById('registroProducto');

  /* === FUNCIONES DE SESIÓN === */
  function manejarSesion() {
    const usuarioJSON = localStorage.getItem(USUARIO_ACTIVO_KEY);
    const usuario = usuarioJSON ? JSON.parse(usuarioJSON) : null;

    if (usuario) {
      if (dropdown) dropdown.style.display = 'block';
      if (username) username.textContent = usuario.email.split('@')[0];
      if (iniciarSesion) iniciarSesion.style.display = 'none';
      if (perfilLink) perfilLink.style.display = 'inline-block';
      if (registroProducto) registroProducto.style.display = 'block';
    } else {
      if (dropdown) dropdown.style.display = 'none';
      if (username) username.textContent = '';
      if (iniciarSesion) iniciarSesion.style.display = 'inline-block';
      if (perfilLink) perfilLink.style.display = 'none';
      if (registroProducto) registroProducto.style.display = 'none';
    }
  }

  /* === FUNCIONES DE CERRAR SESIÓN === */
  function logout() {
    localStorage.removeItem(USUARIO_ACTIVO_KEY);
    sessionStorage.clear();
    window.location.href = '/Login/login.html';
  }

  /* === POPUP DE CIERRE DE SESIÓN CON DIALOG === */
  function cerrarSesion() {
    const popupCerrarSesion = document.getElementById('popupCerrarSesion');
    const btnConfirmarCerrarSesion = document.getElementById('btnConfirmarCerrarSesion');
    const btnCancelarCerrarSesion = document.getElementById('btnCancelarCerrarSesion');

    function cerrarPopup() {
      popupCerrarSesion.close();
      btnConfirmarCerrarSesion.removeEventListener('click', confirmarCerrarSesion);
      btnCancelarCerrarSesion.removeEventListener('click', cancelarCerrarSesion);
      popupCerrarSesion.removeEventListener('cancel', onCancel);
      // Regresa foco al enlace logout para accesibilidad
      const enlaceLogout = document.querySelector('.perfil-user .nav-link[data-section="logout"]');
      if (enlaceLogout) enlaceLogout.focus();
    }

    function confirmarCerrarSesion() {
      cerrarPopup();
      logout();
    }

    function cancelarCerrarSesion() {
      cerrarPopup();
    }

    function onCancel(e) {
      e.preventDefault(); // evita cerrar sin controlar
      cancelarCerrarSesion();
    }

    btnConfirmarCerrarSesion.addEventListener('click', confirmarCerrarSesion);
    btnCancelarCerrarSesion.addEventListener('click', cancelarCerrarSesion);
    popupCerrarSesion.addEventListener('cancel', onCancel);

    popupCerrarSesion.showModal();
  }

  /* === FUNCIONES PARA DATOS DE USUARIO === */
  function obtenerDatosUsuario() {
    let datos = localStorage.getItem(USUARIO_DATOS_KEY);
    let perfil = datos ? JSON.parse(datos) : null;

    const usuarioActivoJSON = localStorage.getItem(USUARIO_ACTIVO_KEY);
    const usuarioActivo = usuarioActivoJSON ? JSON.parse(usuarioActivoJSON) : null;
    const correoSesion = usuarioActivo ? usuarioActivo.email : '';

    if (!perfil) {
      perfil = {
        nickname: '',
        genero: '',
        nombre: '',
        apellidos: '',
        telefono_fijo: '',
        telefono_movil: '',
        email: correoSesion,
        foto: 'img/user1.png'
      };
    } else {
      perfil.email = correoSesion;
    }

    localStorage.setItem(USUARIO_DATOS_KEY, JSON.stringify(perfil));

    return perfil;
  }

  function guardarDatosUsuario(datos) {
    localStorage.setItem(USUARIO_DATOS_KEY, JSON.stringify(datos));
  }

  /* === FUNCIONES PARA DIRECCIÓN === */
  function obtenerDatosDireccion() {
    const datos = localStorage.getItem(DIRECCION_KEY);
    return datos ? JSON.parse(datos) : { calle: '', colonia: '', estado: '', ciudad: '' };
  }
  function guardarDatosDireccion(datos) {
    localStorage.setItem(DIRECCION_KEY, JSON.stringify(datos));
  }

  /* === SECCIÓN 'MI CUENTA' === */
  function cargarMiCuenta() {
    const data = obtenerDatosUsuario();
    fotoPerfil.src = data.foto || 'img/user1.png';

    contenedorPerfil.innerHTML = `
      <h4 class="mb-4">EDITAR PERFIL</h4>
      <form id="form-editar" novalidate>
        <div class="row g-3">
          <div class="col-md-6">
            <label for="input-nickname" class="form-label">Nickname</label>
            <input type="text" class="form-control" id="input-nickname" value="${data.nickname}" placeholder="Tu nickname">
          </div>
          <div class="col-md-6">
            <label for="input-genero" class="form-label">Género</label>
            <select id="input-genero" class="form-select" required>
              <option value="" ${!data.genero ? 'selected' : ''}>Selecciona género</option>
              <option value="Masculino" ${data.genero === 'Masculino' ? 'selected' : ''}>Masculino</option>
              <option value="Femenino" ${data.genero === 'Femenino' ? 'selected' : ''}>Femenino</option>
              <option value="Otro" ${data.genero === 'Otro' ? 'selected' : ''}>Otro</option>
            </select>
            <div class="invalid-feedback">Por favor selecciona un género válido.</div>
          </div>

          <div class="col-md-6">
            <label for="input-nombre" class="form-label">Nombre</label>
            <input type="text" class="form-control" id="input-nombre" value="${data.nombre}" placeholder="Tu nombre completo" required>
            <div class="invalid-feedback">Por favor ingresa tu nombre.</div>
          </div>
          <div class="col-md-6">
            <label for="input-apellidos" class="form-label">Apellidos</label>
            <input type="text" class="form-control" id="input-apellidos" value="${data.apellidos}" placeholder="Tus apellidos" required>
            <div class="invalid-feedback">Por favor ingresa tus apellidos.</div>
          </div>

          <div class="col-md-6">
            <label for="input-telefono" class="form-label">Teléfono fijo</label>
            <input type="text" class="form-control" id="input-telefono" value="${data.telefono_fijo}" placeholder="Número de teléfono fijo">
          </div>
          <div class="col-md-6">
            <label for="input-movil" class="form-label">Teléfono móvil</label>
            <input type="text" class="form-control" id="input-movil" value="${data.telefono_movil}" placeholder="Número de teléfono móvil" required>
            <div class="invalid-feedback">Por favor ingresa tu número de móvil.</div>
          </div>

          <div class="col-12">
            <label for="input-email" class="form-label">Correo electrónico</label>
            <input type="email" class="form-control" id="input-email" value="${data.email}" placeholder="ejemplo@correo.com" required>
            <div class="invalid-feedback">Por favor ingresa un correo válido.</div>
          </div>
        </div>

        <div class="mt-4 d-flex justify-content-end">
          <button type="submit" class="btn btn-primary" id="btn-guardar">Guardar cambios</button>
        </div>
      </form>
    `;

    document.getElementById('form-editar').addEventListener('submit', e => {
      e.preventDefault();
      const form = e.target;
      if (!form.checkValidity()) {
        form.classList.add('was-validated');
        alertify.error('Por favor, corrige los campos requeridos.');
        return;
      }

      const datos = {
        nickname: form.querySelector('#input-nickname').value.trim(),
        genero: form.querySelector('#input-genero').value,
        nombre: form.querySelector('#input-nombre').value.trim(),
        apellidos: form.querySelector('#input-apellidos').value.trim(),
        telefono_fijo: form.querySelector('#input-telefono').value.trim(),
        telefono_movil: form.querySelector('#input-movil').value.trim(),
        email: form.querySelector('#input-email').value.trim(),
        foto: fotoPerfil.src
      };

      guardarDatosUsuario(datos);
      alertify.success('Datos guardados correctamente');
    });
  }

  /* === CARGAR Y GUARDAR FOTO DE PERFIL === */
  inputFoto.addEventListener('change', () => {
    const file = inputFoto.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alertify.error('Por favor, selecciona una imagen válida.');
        inputFoto.value = '';
        return;
      }
      if (file.size > 2097152) {
        alertify.error('La imagen debe ser menor a 2MB.');
        inputFoto.value = '';
        return;
      }
      const reader = new FileReader();
      reader.onload = e => {
        fotoPerfil.src = e.target.result;
        const datos = obtenerDatosUsuario();
        datos.foto = e.target.result;
        guardarDatosUsuario(datos);
        alertify.success('Foto actualizada');
      };
      reader.readAsDataURL(file);
    }
  });

  /* === SECCIÓN 'MIS PEDIDOS' === */
  function cargarMisPedidos() {
    let carrito = JSON.parse(localStorage.getItem(CARRITO_KEY)) || [];
    if (carrito.length === 0) {
      contenedorPerfil.innerHTML = `<p class='text-muted'>No tienes pedidos recientes.</p>`;
      return;
    }

    let total = 0;
    const listaItems = carrito.map((item, index) => {
      const precioUnitario = (item.precioOferta && item.precioOferta > 0 && item.precioOferta < item.precio)
        ? item.precioOferta
        : item.precio;
      const subtotal = precioUnitario * item.cantidad;
      total += subtotal;

      let selectorTallas = '';
      if (item.tallasDisponibles && item.tallasDisponibles.length > 0) {
        selectorTallas = `
          <label for="talla-${index}" class="form-label me-2">Talla:</label>
          <select id="talla-${index}" class="form-select form-select-sm d-inline-block" style="width: auto;">
            ${item.tallasDisponibles.map(t => `
              <option value="${t}" ${t === item.talla ? 'selected' : ''}>${t}</option>
            `).join('')}
          </select>
        `;
      }

      return `
        <li class="list-group-item d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
          <div class="flex-grow-1">
            <h6 class="my-0">${item.producto}</h6>
            <small class="text-muted">
              Precio unitario: ${precioUnitario.toLocaleString('es-MX', {style: 'currency', currency: 'MXN'})}
              ${item.precioOferta && item.precioOferta > 0 && item.precioOferta < item.precio
                ? `<br><span class="text-decoration-line-through">Original: ${item.precio.toLocaleString('es-MX', {style: 'currency', currency: 'MXN'})}</span>`
                : ''}
            </small>
            <div class="mt-2">${selectorTallas}</div>
          </div>

          <div class="d-flex align-items-center gap-2 me-3">
            <button class="btn btn-sm btn-outline-secondary btn-disminuir" data-index="${index}" aria-label="Disminuir cantidad">−</button>
            <input type="text" readonly class="form-control form-control-sm text-center" style="width: 50px;" value="${item.cantidad}" id="cantidad-${index}">
            <button class="btn btn-sm btn-outline-secondary btn-aumentar" data-index="${index}" aria-label="Aumentar cantidad">+</button>
          </div>

          <div class="d-flex flex-column align-items-end">
            <strong class="me-3">${subtotal.toLocaleString('es-MX', {style: 'currency', currency: 'MXN'})}</strong>
            <button class="btn btn-sm btn-danger btn-eliminar mt-2" data-index="${index}" title="Eliminar producto">Eliminar</button>
          </div>
        </li>
      `;
    }).join('');

    contenedorPerfil.innerHTML = `
      <div class="card p-4 bg-white">
        <h4 class="mb-3">Mis pedidos (Resumen actual del carrito)</h4>
        <ul class="list-group mb-3">
          ${listaItems}
          <li class="list-group-item d-flex justify-content-between align-items-center">
            <strong>Total (MXN)</strong>
            <strong>${total.toLocaleString('es-MX', {style: 'currency', currency: 'MXN'})}</strong>
          </li>
        </ul>
        <div class="text-end">
          <button id="btn-pagar" class="btn btn-success">Pagar</button>
        </div>
        <p class="text-muted small text-center mb-0 mt-3">Los precios incluyen IVA. Envío gratis en pedidos mayores a $999.</p>
      </div>
    `;

    function guardarYCargar() {
      localStorage.setItem(CARRITO_KEY, JSON.stringify(carrito));
      cargarMisPedidos();
    }

    contenedorPerfil.querySelectorAll('.btn-disminuir').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = Number(btn.getAttribute('data-index'));
        if (carrito[idx].cantidad > 1) {
          carrito[idx].cantidad--;
          guardarYCargar();
        }
      });
    });

    contenedorPerfil.querySelectorAll('.btn-aumentar').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = Number(btn.getAttribute('data-index'));
        carrito[idx].cantidad++;
        guardarYCargar();
      });
    });

    contenedorPerfil.querySelectorAll('.btn-eliminar').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = Number(btn.getAttribute('data-index'));
        carrito.splice(idx, 1);
        guardarYCargar();
        alertify.success('Producto eliminado del carrito');
      });
    });

    contenedorPerfil.querySelectorAll('select[id^="talla-"]').forEach(select => {
      select.addEventListener('change', () => {
        const idx = Number(select.id.split('-')[1]);
        carrito[idx].talla = select.value;
        guardarYCargar();
        alertify.success('Talla actualizada');
      });
    });

    const btnPagar = document.getElementById('btn-pagar');
    if (btnPagar) {
      btnPagar.addEventListener('click', () => {
        window.location.href = '/finalizar-compra/finalizar-compra.html';
      });
    }
  }

  /* === SECCIÓN 'DIRECCIÓN' === */
  function cargarDireccion() {
    const data = obtenerDatosDireccion();

    contenedorPerfil.innerHTML = `
      <h4 class="mb-4">Editar Dirección</h4>
      <form id="form-direccion" novalidate>
        <div class="mb-3">
          <label for="input-calle" class="form-label">Calle</label>
          <input type="text" class="form-control" id="input-calle" value="${data.calle}" required>
          <div class="invalid-feedback">Por favor ingresa la calle.</div>
        </div>
        <div class="mb-3">
          <label for="input-colonia" class="form-label">Colonia</label>
          <input type="text" class="form-control" id="input-colonia" value="${data.colonia}" required>
          <div class="invalid-feedback">Por favor ingresa la colonia.</div>
        </div>
        <div class="mb-3">
          <label for="input-estado" class="form-label">Estado</label>
          <input type="text" class="form-control" id="input-estado" value="${data.estado}" required>
          <div class="invalid-feedback">Por favor ingresa el estado.</div>
        </div>
        <div class="mb-3">
          <label for="input-ciudad" class="form-label">Ciudad/Municipio</label>
          <input type="text" class="form-control" id="input-ciudad" value="${data.ciudad}" required>
          <div class="invalid-feedback">Por favor ingresa la ciudad o municipio.</div>
        </div>
        <button type="submit" class="btn btn-primary" id="btn-guardar-direccion">Guardar Dirección</button>
      </form>
    `;

    const formDireccion = document.getElementById('form-direccion');
    formDireccion.addEventListener('submit', e => {
      e.preventDefault();

      if (!formDireccion.checkValidity()) {
        formDireccion.classList.add('was-validated');
        alertify.error('Por favor, completa todos los campos correctamente.');
        return;
      }

      const datosDireccion = {
        calle: formDireccion.querySelector('#input-calle').value.trim(),
        colonia: formDireccion.querySelector('#input-colonia').value.trim(),
        estado: formDireccion.querySelector('#input-estado').value.trim(),
        ciudad: formDireccion.querySelector('#input-ciudad').value.trim()
      };

      guardarDatosDireccion(datosDireccion);
      alertify.success('Dirección guardada correctamente');
    });
  }

  /* === MAPEO DE SECCIONES === */
  const secciones = {
    cuenta: cargarMiCuenta,
    pedidos: cargarMisPedidos,
    direccion: cargarDireccion,
    logout: cerrarSesion
  };

  /* === EVENTOS MENÚ LATERAL === */
  enlacesMenu.forEach(enlace => {
    enlace.addEventListener('click', e => {
      e.preventDefault();

      enlacesMenu.forEach(link => {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
      });

      enlace.classList.add('active');
      enlace.setAttribute('aria-current', 'page');

      const seccion = enlace.getAttribute('data-section');
      if (typeof secciones[seccion] === 'function') {
        secciones[seccion]();
      }
    });
  });

  /* === CARGA INICIAL === */
  manejarSesion();
  cargarMiCuenta();
});
