document.addEventListener('DOMContentLoaded', () => {
  // ====== Constantes / Config ======
  const API_BASE = 'http://jft314.ddns.net:8080/nso/api/v1/nso';
  const KEYS = { USUARIO_ACTIVO: 'usuarioActivo', USUARIO_DATOS: 'perfil_usuario', CARRITO: 'carrito' };

  // ====== Helpers DOM ======
  const qs = (s, r = document) => r.querySelector(s);
  const qsa = (s, r = document) => [...r.querySelectorAll(s)];

  // ====== Elementos ======
  const containerPerfil = qs('#perfil-contenido');
  const enlacesMenu = qsa('.perfil-user .nav-link');
  const fotoPerfil = qs('#foto-perfil');
  const inputFoto = qs('#cargar-foto');
  const containerCarrito = qs('#carrito-productos');

  // ====== Utilidades ======
  const safeJSON = (str, fallback = null) => { try { return JSON.parse(str); } catch { return fallback; } };
  const fromLS = (k, d = null) => safeJSON(localStorage.getItem(k), d);
  const toLS = (k, v) => localStorage.setItem(k, JSON.stringify(v));
  const setDisplay = (el, show) => { if (el) el.style.display = show ? 'block' : 'none'; };
  const fetchJSON = async (url, opts = {}) => {
    const res = await fetch(url, opts);
    const txt = await res.text();
    const data = safeJSON(txt, txt);
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${typeof data === 'string' ? data : JSON.stringify(data)}`);
    return data;
  };

  // ====== Sesión ======
  function manejarSesion() {
    const usuario = fromLS(KEYS.USUARIO_ACTIVO);
    const dropdown = qs('#userDropdown');
    const username = qs('#usernameDisplay');
    const iniciarSesion = qs('#user-name');
    const perfilLink = qs('#perfilLink');
    const registroProducto = qs('#registroProducto');
    if (usuario) {
      setDisplay(dropdown, true);
      if (username) username.textContent = usuario.email?.split('@')[0] || '';
      if (iniciarSesion) iniciarSesion.style.display = 'none';
      if (perfilLink) perfilLink.style.display = 'inline-block';
      setDisplay(registroProducto, true);
    } else {
      setDisplay(dropdown, false);
      if (username) username.textContent = '';
      if (iniciarSesion) iniciarSesion.style.display = 'inline-block';
      if (perfilLink) perfilLink.style.display = 'none';
      setDisplay(registroProducto, false);
    }
  }

  const logout = () => {
    localStorage.removeItem(KEYS.USUARIO_ACTIVO);
    sessionStorage.clear();
    window.location.href = '/Login/login.html';
  };

  // ====== Popup cerrar sesión ======
  function cerrarSesion() {
    const dlg = qs('#popupCerrarSesion');
    const btnOk = qs('#btnConfirmarCerrarSesion');
    const btnCancel = qs('#btnCancelarCerrarSesion');

    const close = () => {
      dlg.close();
      btnOk.removeEventListener('click', onOk);
      btnCancel.removeEventListener('click', onCancelClick);
      dlg.removeEventListener('cancel', onCancelEvt);
      qs('.perfil-user .nav-link[data-section="logout"]')?.focus();
    };
    const onOk = () => { close(); logout(); };
    const onCancelClick = () => close();
    const onCancelEvt = (e) => { e.preventDefault(); close(); };

    btnOk.addEventListener('click', onOk);
    btnCancel.addEventListener('click', onCancelClick);
    dlg.addEventListener('cancel', onCancelEvt);

    dlg.showModal();
  }

  // ====== Mapas de género ======
  const GENDER_BY_ID = {1:'Masculino',2:'Femenino',3:'Otro'};
  const ID_BY_GENDER = {Masculino:1,Femenino:2,Otro:3};
  const mapGendersIdToGenero = id => GENDER_BY_ID[id] || '';
  const mapGeneroToGendersId = g => ID_BY_GENDER[g] ?? null;

  // ====== Datos usuario (API) ======
  async function obtenerDatosUsuario() {
    try {
      const lista = await fetchJSON(`${API_BASE}/user/all`);
      const email = fromLS(KEYS.USUARIO_ACTIVO)?.email?.toLowerCase();
      const usuario = email ? lista.find(u => u.email?.toLowerCase() === email) : lista[0];
      if (!usuario) return null;

      const datos = {
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
        preferences: usuario.preferences || '',
      };
      toLS(KEYS.USUARIO_DATOS, datos);
      return datos;
    } catch (err) {
      console.error('obtenerDatosUsuario:', err);
      return null;
    }
  }

  async function actualizarUsuario(datos) {
    const payload = {
      id: datos.id,
      gendersId: mapGeneroToGendersId(datos.genero),
      firstName: datos.nombre,
      lastName: datos.apellidoPaterno,
      middleName: datos.apellidoMaterno,
      preferences: datos.preferences || '',
      email: datos.email,
      phone: datos.telefono_fijo,
      mobile: datos.telefono_movil,
      nickname: datos.nickname,
      created: datos.created,
      ...(datos.password?.trim() ? {password: datos.password.trim()} : {}),
    };
    return fetchJSON(`${API_BASE}/user/update`, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(payload)
    });
  }

  // ====== Sección "Mi cuenta" ======
  async function cargarMiCuenta() {
    const data = await obtenerDatosUsuario();
    if (!data) {
      containerPerfil.innerHTML = `<p class="text-danger">No se pudo obtener información del usuario.</p>`;
      return;
    }

    fotoPerfil.src = data.foto || 'img/user.webp';

    containerPerfil.innerHTML = `
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
            <textarea id="input-preferences" class="form-control" placeholder="Tus preferencias...">${data.preferences}</textarea>
          </div>
          <div class="col-md-6 position-relative">
            <label for="input-password" class="form-label">Nueva contraseña (Obligatorio, puede ser la misma)</label>
            <div class="input-group">
              <input type="password" class="form-control" id="input-password" placeholder="Cambiar la contraseña" aria-describedby="togglePassword" required>
              <button type="button" class="btn btn-outline-secondary" id="togglePassword" aria-label="Mostrar contraseña">
                <i class="bi bi-eye"></i>
              </button>
            </div>
            <div class="invalid-feedback">Por favor ingresa una contraseña.</div>
          </div>
          <div class="col-md-6 position-relative">
            <label for="input-confirm-password" class="form-label">Confirmar nueva contraseña</label>
            <div class="input-group">
              <input type="password" class="form-control" id="input-confirm-password" placeholder="Confirma tu nueva contraseña" aria-describedby="toggleConfirmPassword" required>
              <button type="button" class="btn btn-outline-secondary" id="toggleConfirmPassword" aria-label="Mostrar confirmación de contraseña">
                <i class="bi bi-eye"></i>
              </button>
            </div>
            <div class="invalid-feedback">Por favor confirma tu contraseña.</div>
          </div>
        </div>
        <div class="mt-4 d-flex justify-content-between">
          <button type="button" class="btn btn-danger" id="btn-eliminar-cuenta">Eliminar cuenta</button>
          <button type="submit" class="btn btn-primary" id="btn-guardar">Guardar cambios</button>
        </div>
      </form>
    `;

    // Mostrar / ocultar contraseñas
    const toggle = (btnId, inputId) => {
      const btn = qs(btnId);
      const input = qs(inputId);
      btn.addEventListener('click', () => {
        const isPwd = input.type === 'password';
        input.type = isPwd ? 'text' : 'password';
        const icon = btn.querySelector('i');
        icon.classList.toggle('bi-eye', !isPwd);
        icon.classList.toggle('bi-eye-slash', isPwd);
      });
    };
    toggle('#togglePassword', '#input-password');
    toggle('#toggleConfirmPassword', '#input-confirm-password');

    // Guardar cambios
    const form = qs('#form-editar');
    form.addEventListener('submit', async e => {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.classList.add('was-validated');
        alertify?.error?.('Por favor, corrige los campos requeridos.');
        return;
      }
      const pass = qs('#input-password').value.trim();
      if (pass !== qs('#input-confirm-password').value.trim()) {
        alertify?.error?.('Las contraseñas no coinciden.');
        qs('#input-confirm-password').focus();
        return;
      }
      const guardado = fromLS(KEYS.USUARIO_DATOS, {});
      const datosActualizados = {
        id: guardado.id || null,
        created: guardado.created || null,
        nickname: qs('#input-nickname').value.trim(),
        genero: qs('#input-genero').value,
        nombre: qs('#input-nombre').value.trim(),
        apellidoPaterno: qs('#input-apellido-paterno').value.trim(),
        apellidoMaterno: qs('#input-apellido-materno').value.trim(),
        telefono_fijo: qs('#input-telefono').value.trim(),
        telefono_movil: qs('#input-movil').value.trim(),
        email: qs('#input-email').value.trim(),
        preferences: qs('#input-preferences').value.trim(),
        password: pass,
      };

      try {
        await actualizarUsuario(datosActualizados);
        const saveCopy = {...datosActualizados};
        delete saveCopy.password;
        toLS(KEYS.USUARIO_DATOS, saveCopy);
        qs('#popupCambios')?.showModal();
      } catch (err) {
        console.error(err);
        alertify?.error?.('Error al guardar datos, intenta nuevamente');
      }
    });

    // Eliminar cuenta
    qs('#btn-eliminar-cuenta').addEventListener('click', async () => {
      if (!confirm('¿Seguro que quieres eliminar tu cuenta? Esta acción no se puede deshacer.')) return;

      const datos = fromLS(KEYS.USUARIO_DATOS);
      if (!datos?.id) {
        alert('No se encontró usuario activo para eliminar.');
        return;
      }
      try {
        await fetchJSON(`${API_BASE}/user/hdelete/id/${datos.id}`, { method: 'DELETE' });
        alert('Cuenta eliminada correctamente. Se cerrará la sesión.');
        localStorage.removeItem(KEYS.USUARIO_ACTIVO);
        localStorage.removeItem(KEYS.USUARIO_DATOS);
        sessionStorage.clear();
        window.location.href = '/Login/login.html';
      } catch (err) {
        console.error(err);
        alert('Error al eliminar la cuenta, por favor intenta nuevamente.');
      }
    });
  }

  // ====== Sección "Mis pedidos" (Carrito) sin tallas ======
  function cargarMisPedidos() {
    let carrito = fromLS(KEYS.CARRITO, []);
    if (carrito.length === 0) {
      containerPerfil.innerHTML = `<p class='text-muted'>No tienes pedidos recientes.</p>`;
      return;
    }

    let total = 0;
    const moneda = n => n.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });

    const fila = (item, i) => {
      const unit = (item.precioOferta && item.precioOferta > 0 && item.precioOferta < item.precio)
        ? item.precioOferta : item.precio;
      const subtotal = unit * item.cantidad;
      total += subtotal;

      return `
        <li class="list-group-item d-flex justify-content-between align-items-center gap-3">
          <div class="flex-grow-1">
            <h6 class="my-0">${item.nombre}</h6>
            <small class="text-muted">Precio unitario: ${moneda(unit)}${(item.precioOferta && item.precioOferta > 0 && item.precioOferta < item.precio) ? `<br><span class="text-decoration-line-through">Original: ${moneda(item.precio)}</span>` : ''}</small>
          </div>
          <div class="d-flex align-items-center gap-2 me-3">
            <button class="btn btn-sm btn-outline-secondary" data-accion="menos" data-index="${i}" aria-label="Disminuir">−</button>
            <input type="text" readonly class="form-control form-control-sm text-center" style="width: 50px;" value="${item.cantidad}">
            <button class="btn btn-sm btn-outline-secondary" data-accion="mas" data-index="${i}" aria-label="Aumentar">+</button>
          </div>
          <div class="d-flex flex-column align-items-end">
            <strong class="me-3">${moneda(subtotal)}</strong>
            <button class="btn btn-sm btn-danger mt-2" data-accion="eliminar" data-index="${i}" title="Eliminar producto">Eliminar</button>
          </div>
        </li>`;
    };

    containerPerfil.innerHTML = `
      <div class="card p-4 bg-white">
        <h4 class="mb-3">Mis pedidos (Resumen actual del carrito)</h4>
        <ul class="list-group mb-3">${carrito.map(fila).join('')}
          <li class="list-group-item d-flex justify-content-between align-items-center">
            <strong>Total (MXN)</strong><strong>${moneda(total)}</strong>
          </li>
        </ul>
        <div class="text-end">
          <button id="btn-pagar" class="btn btn-success">Pagar</button>
        </div>
        <p class="text-muted small text-center mb-0 mt-3">Los precios incluyen IVA. Envío gratis en pedidos mayores a $999.</p>
      </div>
    `;

    const guardarYCargar = () => { toLS(KEYS.CARRITO, carrito); cargarMisPedidos(); };

    // Delegación eventos (cantidad y eliminar)
    containerPerfil.onclick = e => {
      const btn = e.target.closest('button');
      if (!btn) return;
      const idx = Number(btn.dataset.index);
      const action = btn.dataset.accion;
      if (action === 'menos' && carrito[idx].cantidad > 1) {
        carrito[idx].cantidad--;
        guardarYCargar();
      } else if (action === 'mas') {
        carrito[idx].cantidad++;
        guardarYCargar();
      } else if (action === 'eliminar') {
        carrito.splice(idx, 1);
        guardarYCargar();
        alertify?.success?.('Producto eliminado del carrito');
      }
    };

    qs('#btn-pagar')?.addEventListener('click', () => {
      window.location.href = '/finalizar-compra/finalizar-compra.html';
    });
  }

  // ====== Dirección (solo lectura) ======
  async function obtenerDireccionUsuarioPorIdUser(idUser) {
    try {
      const lista = await fetchJSON(`${API_BASE}/address/all`);
      return lista.find(d => d.idUser === idUser) || null;
    } catch (err) {
      console.error('obtenerDireccionUsuarioPorIdUser:', err);
      return null;
    }
  }

  async function cargarDireccion() {
    const datos = await obtenerDatosUsuario();
    if (!datos?.id) {
      containerPerfil.innerHTML = `<p class="text-danger">No se encontró usuario activo.</p>`;
      return;
    }
    const dir = await obtenerDireccionUsuarioPorIdUser(datos.id);
    if (!dir) {
      containerPerfil.innerHTML = `<p class="text-muted">No se encontró información de dirección para este usuario.</p>`;
      return;
    }
    containerPerfil.innerHTML = `
      <h4 class="mb-4">Dirección Registrada</h4>
      <div class="card p-3 bg-light">
        <p><strong>Calle / Nombre:</strong> ${dir.name || '-'}</p>
        <p><strong>Número:</strong> ${dir.number || '-'}</p>
        <p><strong>Código Postal:</strong> ${dir.cpCode || '-'}</p>
        <p><strong>Ciudad:</strong> ${dir.city || '-'}</p>
        <p><strong>Estado:</strong> ${dir.state || '-'}</p>
        <p><strong>Tipo Dirección:</strong> ${dir.type || dir.typeId || '-'}</p>
        <p><strong>Dirección Completa:</strong> ${dir.fullAddress || '-'}</p>
      </div>`;
  }

  // ====== Navegación lateral ======
  const secciones = { cuenta: cargarMiCuenta, pedidos: cargarMisPedidos, direccion: cargarDireccion, logout: cerrarSesion };
  enlacesMenu.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      enlacesMenu.forEach(l => { l.classList.remove('active'); l.removeAttribute('aria-current'); });
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
      secciones[link.dataset.section]?.();
    });
  });

  // ====== Carga inicial ======
  manejarSesion();
  cargarMiCuenta();

  // ====== Foto de perfil ======
  inputFoto.addEventListener('change', () => {
    const file = inputFoto.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alertify?.error?.('Por favor, selecciona una imagen válida.');
      inputFoto.value = ''; return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alertify?.error?.('La imagen debe ser menor a 2MB.');
      inputFoto.value = ''; return;
    }
    const reader = new FileReader();
    reader.onload = e => {
      fotoPerfil.src = e.target.result;
      const datos = fromLS(KEYS.USUARIO_DATOS, {});
      datos.foto = e.target.result;
      toLS(KEYS.USUARIO_DATOS, datos);
      alertify?.success?.('Foto actualizada');
    };
    reader.readAsDataURL(file);
  });

  // ====== Popup "Cambios realizados" ======
  qs('#btnCerrarPopupCambios')?.addEventListener('click', () => {
    qs('#popupCambios')?.close();
    qs('#btn-guardar')?.focus();
  });

  // ====== Funciones carrito simplificadas ======
  function agregarProductoAlCarrito(producto, cantidad = 1) {
    if (!producto?.name) { console.error('Producto inválido'); return; }
    const productoCarrito = {
      nombre: producto.name,
      marca: producto.brand || '',
      modelo: producto.model || '',
      precio: producto.price || 0,
      cantidad,
      imagen: (producto.imagenes && producto.imagenes.length > 0) ? (producto.imagenes[0].url || producto.imagenes[0]) : '',
      total: (producto.price || 0) * cantidad,
    };
    let cart = fromLS(KEYS.CARRITO, []);
    const existingIndex = cart.findIndex(item => item.nombre === productoCarrito.nombre);
    if (existingIndex !== -1) {
      cart[existingIndex].cantidad += cantidad;
      cart[existingIndex].total = cart[existingIndex].precio * cart[existingIndex].cantidad;
    } else {
      cart.push(productoCarrito);
    }
    toLS(KEYS.CARRITO, cart);
    if (containerCarrito) renderizarCarritoEnContenedor(containerCarrito);
  }

  function renderizarCarritoEnContenedor(container) {
    let carrito = fromLS(KEYS.CARRITO, []);
    if (!container) return;
    if (carrito.length === 0) {
      container.innerHTML = '<p class="text-center">No hay productos en el carrito.</p>';
      return;
    }
    container.innerHTML = "";
    let total = 0;
    carrito.forEach((producto, i) => {
      const subtotal = (producto.precio || 0) * (producto.cantidad || 0);
      total += subtotal;
      const col = document.createElement('div');
      col.className = "col d-flex justify-content-center";
      col.innerHTML = `
        <div class="card h-100" style="width: 18rem;">
          <img src="${producto.imagen}" class="card-img-top img-fluid" alt="${producto.nombre}" style="height: 200px; object-fit: contain;">
          <div class="card-body d-flex flex-column justify-content-between">
            <div>
              <h5 class="card-title">${producto.nombre}</h5>
              <p class="card-text"><strong>Precio:</strong> $${producto.precio.toFixed(2)}</p>
              <p class="card-text"><strong>Cantidad:</strong> ${producto.cantidad}</p>
            </div>
            <button class="btn btn-outline-danger w-100 mt-3 eliminar-item" data-index="${i}">
              <i class="bi bi-trash-fill"></i> Eliminar
            </button>
          </div>
        </div>`;
      container.appendChild(col);
    });
    const resumen = document.createElement('div');
    resumen.className = 'text-center w-100 mt-5';
    resumen.innerHTML = `
      <h4 class="mb-3">Total a pagar: <span class="text-success">$${total.toFixed(2)}</span></h4>
      <button class="btn btn-success btn-lg" id="finalizar-compra">
        <i class="bi bi-cart-check-fill"></i> Finalizar compra
      </button>`;
    container.appendChild(resumen);
  }

  if (containerCarrito) {
    containerCarrito.addEventListener('click', e => {
      const btn = e.target.closest('.eliminar-item');
      if (btn) {
        const index = Number(btn.dataset.index);
        let cart = fromLS(KEYS.CARRITO, []);
        cart.splice(index, 1);
        toLS(KEYS.CARRITO, cart);
        renderizarCarritoEnContenedor(containerCarrito);
        alertify?.success?.('Producto eliminado del carrito');
      }
    });
  }

  document.addEventListener('click', e => {
    if (e.target.id === 'finalizar-compra') {
      window.location.href = "/finalizar-compra/finalizar-compra.html";
    }
  });

});
