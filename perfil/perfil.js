document.addEventListener('DOMContentLoaded', () => {
  /* === CONSTANTES - LLAVES LOCALSTORAGE === */
  const USUARIO_ACTIVO_KEY = 'usuarioActivo';
  const USUARIO_DATOS_KEY = 'perfil_usuario';
  const CARRITO_KEY = 'carrito';

  /* === ELEMENTOS DEL DOM === */
  const contenedorPerfil = document.getElementById('perfil-contenido');
  const enlacesMenu = document.querySelectorAll('.perfil-user .nav-link');
  const fotoPerfil = document.getElementById('foto-perfil');
  const inputFoto = document.getElementById('cargar-foto');

  /* === FUNCIONES DE SESIÓN === */
  function manejarSesion() {
    const usuarioJSON = localStorage.getItem(USUARIO_ACTIVO_KEY);
    const usuario = usuarioJSON ? JSON.parse(usuarioJSON) : null;

    if (usuario) {
      const dropdown = document.getElementById('userDropdown');
      const username = document.getElementById('usernameDisplay');
      const iniciarSesion = document.getElementById('user-name');
      const perfilLink = document.getElementById('perfilLink');
      const registroProducto = document.getElementById('registroProducto');

      if (dropdown) dropdown.style.display = 'block';
      if (username) username.textContent = usuario.email.split('@')[0];
      if (iniciarSesion) iniciarSesion.style.display = 'none';
      if (perfilLink) perfilLink.style.display = 'inline-block';
      if (registroProducto) registroProducto.style.display = 'block';
    } else {
      const dropdown = document.getElementById('userDropdown');
      const username = document.getElementById('usernameDisplay');
      const iniciarSesion = document.getElementById('user-name');
      const perfilLink = document.getElementById('perfilLink');
      const registroProducto = document.getElementById('registroProducto');

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
      e.preventDefault();
      cancelarCerrarSesion();
    }

    btnConfirmarCerrarSesion.addEventListener('click', confirmarCerrarSesion);
    btnCancelarCerrarSesion.addEventListener('click', cancelarCerrarSesion);
    popupCerrarSesion.addEventListener('cancel', onCancel);

    popupCerrarSesion.showModal();
  }

  /* === MAPEO gendersId ↔ género === */
  function mapGendersIdToGenero(gendersId) {
    switch (gendersId) {
      case 1: return 'Masculino';
      case 2: return 'Femenino';
      case 3: return 'Otro';
      default: return '';
    }
  }
  function mapGeneroToGendersId(genero) {
    switch (genero) {
      case 'Masculino': return 1;
      case 'Femenino': return 2;
      case 'Otro': return 3;
      default: return null;
    }
  }

  /* === FUNCIONES PARA DATOS DEL USUARIO CON BACKEND === */
  async function obtenerDatosUsuario() {
    const requestOptions = {
      method: "GET",
      redirect: "follow"
    };

    try {
      const response = await fetch("http://jft314.ddns.net:8080/nso/api/v1/nso/user/all", requestOptions);
      if (!response.ok) throw new Error('Error al obtener datos de usuario');
      const data = await response.json();

      const usuarioActivoJSON = localStorage.getItem(USUARIO_ACTIVO_KEY);
      const usuarioActivo = usuarioActivoJSON ? JSON.parse(usuarioActivoJSON) : null;
      const emailSesion = usuarioActivo ? usuarioActivo.email : null;

      let usuario;
      if (emailSesion) {
        usuario = data.find(u => u.email.toLowerCase() === emailSesion.toLowerCase());
      }
      if (!usuario) {
        usuario = data[0] || null;
      }
      if (!usuario) {
        return null; // No hay usuario encontrado
      }

      // Guardar datos en localStorage
      const datosUsuario = {
        id: usuario.id || null,
        created: usuario.created || null,
        nickname: usuario.nickname || '',
        genero: mapGendersIdToGenero(usuario.gendersId),
        nombre: usuario.firstName || '',
        apellidoPaterno: usuario.lastName || '',
        apellidoMaterno: usuario.middleName || '',
        telefono_fijo: usuario.phone || '',
        telefono_movil: usuario.mobile || '',
        email: usuario.email || '',
        foto: 'img/user.webp',
        preferences: usuario.preferences || ''
      };
      guardarDatosUsuarioLocalStorage(datosUsuario);

      return datosUsuario;

    } catch (error) {
      console.error(error);
      return null;
    }
  }

  function guardarDatosUsuarioLocalStorage(datos) {
    localStorage.setItem(USUARIO_DATOS_KEY, JSON.stringify(datos));
  }

  /**
   * Actualiza usuario enviando contraseña nueva si existe,
   * si la contraseña nueva está vacía, se omite el campo para mantener la actual en backend.
   */
  async function actualizarUsuario(datos) {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const passwordNueva = (datos.password && datos.password.trim() !== '') ? datos.password.trim() : null;

    const payload = {
      id: datos.id,
      gendersId: mapGeneroToGendersId(datos.genero),
      firstName: datos.nombre,
      lastName: datos.apellidoPaterno,
      middleName: datos.apellidoMaterno,
      preferences: datos.preferences || "",
      email: datos.email,
      phone: datos.telefono_fijo,
      mobile: datos.telefono_movil,
      nickname: datos.nickname,
      created: datos.created
    };
    if (passwordNueva) {
      payload.password = passwordNueva;
    }

    const raw = JSON.stringify(payload);

    const requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    const response = await fetch("http://jft314.ddns.net:8080/nso/api/v1/nso/user/update", requestOptions);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error('Error al actualizar usuario: ' + errorText);
    }
    return response.text();
  }

  /* === SECCIÓN 'MI CUENTA' === */
  async function cargarMiCuenta() {
    const data = await obtenerDatosUsuario();

    if (!data) {
      contenedorPerfil.innerHTML = `<p class="text-danger">No se pudo obtener información del usuario.</p>`;
      return;
    }

    fotoPerfil.src = data.foto || 'img/user.webp';

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
            <label for="input-apellido-paterno" class="form-label">Apellido paterno</label>
            <input type="text" class="form-control" id="input-apellido-paterno" value="${data.apellidoPaterno}" placeholder="Apellido paterno" required>
            <div class="invalid-feedback">Por favor ingresa tu apellido paterno.</div>
          </div>

          <div class="col-md-6">
            <label for="input-apellido-materno" class="form-label">Apellido materno</label>
            <input type="text" class="form-control" id="input-apellido-materno" value="${data.apellidoMaterno}" placeholder="Apellido materno" required>
            <div class="invalid-feedback">Por favor ingresa tu apellido materno.</div>
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

          <div class="col-12">
            <label for="input-preferences" class="form-label">Preferencias</label>
            <textarea id="input-preferences" class="form-control" placeholder="Tus preferencias...">${data.preferences || ''}</textarea>
          </div>

          <div class="col-md-6 position-relative">
            <label for="input-password" class="form-label">Nueva contraseña (Obligatorio, puede ser la misma)</label>
            <div class="input-group">
              <input type="password" class="form-control" id="input-password" placeholder="Cambiar la contraseña" aria-describedby="togglePassword">
              <button type="button" class="btn btn-outline-secondary" id="togglePassword" aria-label="Mostrar contraseña">
                <i class="bi bi-eye"></i>
              </button>
            </div>
          </div>
          <div class="col-md-6 position-relative">
            <label for="input-confirm-password" class="form-label">Confirmar nueva contraseña</label>
            <div class="input-group">
              <input type="password" class="form-control" id="input-confirm-password" placeholder="Confirma tu nueva contraseña" aria-describedby="toggleConfirmPassword">
              <button type="button" class="btn btn-outline-secondary" id="toggleConfirmPassword" aria-label="Mostrar confirmación de contraseña">
                <i class="bi bi-eye"></i>
              </button>
            </div>
          </div>

        </div>

        <div class="mt-4 d-flex justify-content-end">
          <button type="submit" class="btn btn-primary" id="btn-guardar">Guardar cambios</button>
        </div>
      </form>
    `;

    const formEditar = document.getElementById('form-editar');

    // Mostrar / ocultar contraseña
    const togglePassword = document.getElementById('togglePassword');
    const inputPassword = document.getElementById('input-password');
    const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
    const inputConfirmPassword = document.getElementById('input-confirm-password');

    togglePassword.addEventListener('click', () => {
      const type = inputPassword.type === 'password' ? 'text' : 'password';
      inputPassword.type = type;
      togglePassword.querySelector('i').classList.toggle('bi-eye');
      togglePassword.querySelector('i').classList.toggle('bi-eye-slash');
    });

    toggleConfirmPassword.addEventListener('click', () => {
      const type = inputConfirmPassword.type === 'password' ? 'text' : 'password';
      inputConfirmPassword.type = type;
      toggleConfirmPassword.querySelector('i').classList.toggle('bi-eye');
      toggleConfirmPassword.querySelector('i').classList.toggle('bi-eye-slash');
    });

    formEditar.addEventListener('submit', async e => {
      e.preventDefault();

      if (!formEditar.checkValidity()) {
        formEditar.classList.add('was-validated');
        alertify.error('Por favor, corrige los campos requeridos.');
        return;
      }

      const passwordNueva = inputPassword.value.trim();
      const confirmPassword = inputConfirmPassword.value.trim();

      if (passwordNueva !== '' && passwordNueva !== confirmPassword) {
        alertify.error('Las contraseñas no coinciden.');
        inputConfirmPassword.focus();
        return;
      }

      const datosGuardados = JSON.parse(localStorage.getItem(USUARIO_DATOS_KEY)) || {};

      const datosActualizados = {
        id: datosGuardados.id || null,
        created: datosGuardados.created || null,
        nickname: formEditar.querySelector('#input-nickname').value.trim(),
        genero: formEditar.querySelector('#input-genero').value,
        nombre: formEditar.querySelector('#input-nombre').value.trim(),
        apellidoPaterno: formEditar.querySelector('#input-apellido-paterno').value.trim(),
        apellidoMaterno: formEditar.querySelector('#input-apellido-materno').value.trim(),
        telefono_fijo: formEditar.querySelector('#input-telefono').value.trim(),
        telefono_movil: formEditar.querySelector('#input-movil').value.trim(),
        email: formEditar.querySelector('#input-email').value.trim(),
        preferences: formEditar.querySelector('#input-preferences').value.trim(),
        password: passwordNueva
      };

      try {
        await actualizarUsuario(datosActualizados);

        const toSave = { ...datosActualizados };
        delete toSave.password;
        guardarDatosUsuarioLocalStorage(toSave);

        const popupCambios = document.getElementById('popupCambios');
        popupCambios.showModal();

      } catch (error) {
        console.error(error);
        alertify.error('Error al guardar datos, intenta nuevamente');
      }
    });
  }

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

  /* === FUNCIONES PARA MOSTRAR DIRECCIÓN SOLO LECTURA DESDE BACKEND === */
  async function obtenerDireccionUsuarioPorIdUser(idUser) {
    const requestOptions = {
      method: "GET",
      redirect: "follow"
    };

    try {
      const response = await fetch("http://jft314.ddns.net:8080/nso/api/v1/nso/address/all", requestOptions);
      if (!response.ok) throw new Error('Error al obtener direcciones');
      const resultText = await response.text();
      const direcciones = JSON.parse(resultText);

      // Filtrar para la dirección asociada al usuario activo
      const direccion = direcciones.find(dir => dir.idUser === idUser);

      return direccion || null;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async function cargarDireccion() {
    const datosUsuario = await obtenerDatosUsuario();

    if (!datosUsuario || !datosUsuario.id) {
      contenedorPerfil.innerHTML = `<p class="text-danger">No se encontró usuario activo.</p>`;
      return;
    }

    const direccion = await obtenerDireccionUsuarioPorIdUser(datosUsuario.id);

    if (!direccion) {
      contenedorPerfil.innerHTML = `<p class="text-muted">No se encontró información de dirección para este usuario.</p>`;
      return;
    }

    contenedorPerfil.innerHTML = `
      <h4 class="mb-4">Dirección Registrada</h4>
      <div class="card p-3 bg-light">
        <p><strong>Calle / Nombre:</strong> ${direccion.name || '-'}</p>
        <p><strong>Número:</strong> ${direccion.number || '-'}</p>
        <p><strong>Código Postal:</strong> ${direccion.cpCode || '-'}</p>
        <p><strong>Ciudad:</strong> ${direccion.city || '-'}</p>
        <p><strong>Estado:</strong> ${direccion.state || '-'}</p>
        <p><strong>Tipo Dirección:</strong> ${direccion.type || direccion.typeId || '-'}</p>
        <p><strong>Dirección Completa:</strong> ${direccion.fullAddress || '-'}</p>
      </div>
    `;
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
        const datos = JSON.parse(localStorage.getItem(USUARIO_DATOS_KEY)) || {};
        datos.foto = e.target.result;
        guardarDatosUsuarioLocalStorage(datos);
        alertify.success('Foto actualizada');
      };
      reader.readAsDataURL(file);
    }
  });

  /* === CONTROL POPUP "CAMBIOS REALIZADOS" === */
  const popupCambios = document.getElementById('popupCambios');
  const btnCerrarPopupCambios = document.getElementById('btnCerrarPopupCambios');
  if (btnCerrarPopupCambios) {
    btnCerrarPopupCambios.addEventListener('click', () => {
      popupCambios.close();
      const btnGuardar = document.getElementById('btn-guardar');
      if (btnGuardar) btnGuardar.focus();
    });
  }
});
