// --- Búsqueda por palabra clave ---
document.addEventListener('DOMContentLoaded', function() {
  const btnBuscar = document.getElementById('btnBuscarPalabra');
  if (btnBuscar) {
    btnBuscar.addEventListener('click', function() {
      let palabra = document.getElementById('inputBusqueda').value.trim();
      if (!palabra) {
        // Si está vacío, mostrar todos los productos
        fetch("http://jft314.ddns.net:8080/nso/api/v1/nso/product/all", requestOptions)
          .then(response => response.json())
          .then(productos => {
            productosGlobal = Array.isArray(productos) ? productos : [];
            renderizarProductos(productosGlobal);
          });
        return;
      }
  // Reemplaza espacios por guiones bajos
  palabra = palabra.replace(/\s+/g, '_');
  // Llama a la API de búsqueda por palabra (nuevo endpoint)
  fetch(`http://jft314.ddns.net:8080/nso/api/v1/nso/product/word?word=${encodeURIComponent(palabra)}`, requestOptions)
        .then(response => response.json())
        .then(productos => {
          productosGlobal = Array.isArray(productos) ? productos : [];
          renderizarProductos(productosGlobal);
        })
        .catch(() => {
          renderizarProductos([]);
        });
    });
  }
});


const requestOptions = {
  method: "GET",
  redirect: "follow"
};

// Genera el HTML de una tarjeta de producto
function crearTarjetaProducto(item, index) {
  const producto = item.products;
  const imagenes = item.images;
  const imagenesHtml = (imagenes && imagenes.length > 0)
    ? imagenes.map((img, i) => `
        <div class="carousel-item${i === 0 ? ' active' : ''}">
          <img src="${img.url}" class="d-block w-100 card-img-fixed" alt="${producto.name}">
        </div>
      `).join('')
    : `<div class="carousel-item active">
         <img class="d-block w-100 card-img-fixed" alt="${producto.name}">
       </div>`;
  return `
    <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4 d-flex align-items-stretch">
      <div class="card w-100">
        <div id="carousel-${index}" class="carousel slide" data-bs-ride="carousel">
          <div class="carousel-inner">
            ${imagenesHtml}
          </div>
          ${(imagenes && imagenes.length > 1) ? `
            <button class="carousel-control-prev" type="button" data-bs-target="#carousel-${index}" data-bs-slide="prev">
              <span class="carousel-control-prev-icon"></span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#carousel-${index}" data-bs-slide="next">
              <span class="carousel-control-next-icon"></span>
            </button>
          ` : ''}
        </div>
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${producto.brand || ''} - ${producto.name || ''}</h5>
          <p class="card-text"><strong>Modelo:</strong> ${producto.model || ''}</p>
          <p class="card-text flex-grow-1"><strong>Descripción:</strong> ${producto.description || ''}</p>
          <p class="card-text"><strong>Detalles:</strong> ${producto.details || ''}</p>
          <p class="card-text"><strong>Status:</strong> ${producto.status || ''}</p>
          <p class="card-text precio"><strong>Precio:</strong> $${producto.price ? producto.price.toFixed(2) : 'N/A'}</p>
          <label for="talla-select-${index}" class="form-label">Selecciona talla:</label>
          <select class="form-select mb-3" id="talla-select-${index}">
            <option value="${producto.size || ''}">${producto.size || ''}</option>
          </select>
          <label for="cantidad-input-${index}" class="form-label">Cantidad:</label>
          <input type="number" min="1" value="1" class="form-control mb-3" id="cantidad-input-${index}" />
          <button class="product-card__btn" onclick="verDetalles(${index})">Ver detalles</button>
          <button class="aniadir-carrito_btn" onclick="addCart(${index})"> Añadir al carrito </button>
        </div>
      </div>
    </div>
  `;
}

// Renderiza la lista de productos en el catálogo
function renderizarProductos(lista) {
  const contenedor = document.getElementById("catalogo-productos");
  contenedor.innerHTML = "";
  productosGlobal = lista;
  lista.forEach((item, index) => {
    contenedor.innerHTML += crearTarjetaProducto(item, index);
  });
}


// Llenar los selects de filtros desde la API

// Llenar los selects de filtros desde los productos cargados (frontend-only)
function cargarTallasDesdeProductos() {
  const select = document.getElementById('filtroTalla');
  select.innerHTML = '<option value="">Todas</option>';
  const tallasUnicas = [...new Set(productosGlobal.map(item => item.products && item.products.size).filter(Boolean))];
  tallasUnicas.forEach(talla => {
    select.innerHTML += `<option value="${talla}">${talla}</option>`;
  });
}


function cargarMarcasDesdeProductos() {
  const select = document.getElementById('filtroMarca');
  select.innerHTML = '<option value="">Todas</option>';
  const marcasUnicas = [...new Set(productosGlobal.map(item => item.products && item.products.brand).filter(Boolean))];
  marcasUnicas.forEach(marca => {
    select.innerHTML += `<option value="${marca}">${marca}</option>`;
  });
}
// --- NUEVA LÓGICA DE FILTRADO ÚNICO ---
function limpiarSelectsMenos(idActivo) {
  const ids = ['filtroEstado', 'filtroTalla', 'filtroMarca'];
  ids.forEach(id => {
    if (id !== idActivo) {
      document.getElementById(id).selectedIndex = 0;
    }
  });
}



function filtroUnicoHandler(e) {
  const id = e.target.id;
  // Limpiar los otros selects
  const ids = ['filtroEstado', 'filtroTalla', 'filtroMarca'];
  ids.forEach(oid => {
    if (oid !== id) {
      document.getElementById(oid).selectedIndex = 0;
    }
  });
  // Limpiar catálogo antes de mostrar nuevos productos
  document.getElementById("catalogo-productos").innerHTML = "";
  let url = null;
  let valor = e.target.value;
  if (!valor) {
    // Si es 'Todos/Todas', mostrar todos los productos
    fetch("http://jft314.ddns.net:8080/nso/api/v1/nso/product/all", requestOptions)
      .then(response => response.json())
      .then(productos => {
        productosGlobal = Array.isArray(productos) ? productos : [];
        renderizarProductos(productosGlobal);
      });
    return;
  }
  if (id === 'filtroEstado') {
    url = `http://jft314.ddns.net:8080/nso/api/v1/nso/product/filter/status/${encodeURIComponent(valor)}`;
  } else if (id === 'filtroTalla') {
    url = `http://jft314.ddns.net:8080/nso/api/v1/nso/product/filter/size/${encodeURIComponent(valor)}`;
  } else if (id === 'filtroMarca') {
    url = `http://jft314.ddns.net:8080/nso/api/v1/nso/product/filter/brand/${encodeURIComponent(valor)}`;
  }
  if (url) {
    fetch(url, requestOptions)
      .then(response => response.json())
      .then(productos => {
        productosGlobal = Array.isArray(productos) ? productos : [];
        renderizarProductos(productosGlobal);
      })
      .catch(() => {
        renderizarProductos([]);
      });
  }
}


function addCart(index) {
    const item = productosGlobal[index];
    const producto = item.products;
    const imagenes = item.images;
    const tallaSelect = document.getElementById(`talla-select-${index}`);
    const cantidadInput = document.getElementById(`cantidad-input-${index}`);
    const talla = tallaSelect ? tallaSelect.value : '';
    let cantidad = cantidadInput ? parseInt(cantidadInput.value) : 1;
    if (!talla) {
      alert("Por favor selecciona una talla.");
      return;
    }
    if (isNaN(cantidad) || cantidad < 1) {
      alert("Por favor ingresa una cantidad válida.");
      return;
    }
    const productoCarrito = {
      id: producto.id,
      nombre: producto.name || '',
      marca: producto.brand || '',
      modelo: producto.model || '',
      precio: producto.price ? Number(producto.price) : 0,
      talla: talla || '',
      cantidad: cantidad,
      imagen: (imagenes && imagenes.length > 0 && imagenes[0].url) ? imagenes[0].url : 'https://via.placeholder.com/300x200?text=Producto',
      total: producto.price ? Number(producto.price) * cantidad : 0
    };
    let cart = JSON.parse(localStorage.getItem("carrito")) || [];
    const existingIndex = cart.findIndex(item => item.id === producto.id);
    if (existingIndex !== -1) {
      cart[existingIndex].cantidad += cantidad;
      cart[existingIndex].total += producto.price * cantidad;
    } else {
      cart.push(productoCarrito);
    }
    localStorage.setItem("carrito", JSON.stringify(cart));
    crearPopUpUniversal(cantidad, producto.name, talla);
}



function verDetalles(index) {
    const item = productosGlobal[index];
    const producto = item.products;
    const imagenes = item.images;
    const imagenPrincipal = (imagenes && imagenes.length > 0 && imagenes[0].url)
      ? imagenes[0].url
      : 'https://via.placeholder.com/300x200?text=Producto';
    document.getElementById('modalProductoImagen').src = imagenPrincipal;
    document.getElementById('modalProductoImagen').alt = producto.name || '';
    document.getElementById('modalProductoTitulo').textContent = `${producto.brand || ''} - ${producto.name || ''}`;
    document.getElementById('modalProductoDescripcion').textContent = producto.details || '';
    document.getElementById('modalProductoPrecio').textContent = producto.price ? `$${producto.price.toFixed(2)}` : '';
    const modal = new bootstrap.Modal(document.getElementById('productoModal'));
    modal.show();
}

// -- POP UP -- \\
function crearPopUpUniversal(cantidad, producto, talla = null, mensaje = null) {
  const contenedor = document.getElementById('PopUp-Universal');
  // Elimina cualquier popup anterior
  contenedor.innerHTML = '';
  // Mensaje por defecto
  const texto = mensaje || '¡Su producto ha sido añadido al carrito!';
  // Info extra
  let detalles = `<p class='mb-1'><b>${producto}</b></p>`;
  if (talla) detalles += `<p class='mb-1'>Talla: <b>${talla}</b></p>`;
  if (cantidad) detalles += `<p class='mb-2'>Cantidad: <b>${cantidad}</b></p>`;

  contenedor.innerHTML = `
    <div class="popup-Diseño" id="popup-registro" role="dialog" aria-modal="true" tabindex="-1">
      <div class="popup-Diseño-Contenido text-center">
        <p class="fw-bold fs-5">${texto}</p>
        ${detalles}
        <div class="d-flex gap-2 justify-content-center mt-2">
          <button class="btn-azul-custom" onclick="cerrarPopupUniversal()" autofocus>Seguir comprando</button>
          <button class="btn-azul-custom" onclick="window.location.href='/carrito/carrito.html'">Ir a carrito</button>
        </div>
      </div>
    </div>
  `;
  // Enfoca el popup para accesibilidad
  setTimeout(() => {
    const popup = document.getElementById('popup-registro');
    if (popup) popup.focus();
  }, 100);
}

function cerrarPopupUniversal() {
    const contenedor = document.getElementById("PopUp-Universal");
    contenedor.innerHTML = '';
}

// Guardar los productos globalmente
let productosGlobal = [];



function cargarEstadosDesdeAPI() {
  fetch("http://jft314.ddns.net:8080/nso/api/v1/nso/product/lookup/status", requestOptions)
    .then(response => response.json())
    .then(estados => {
      const select = document.getElementById('filtroEstado');
      select.innerHTML = '<option value="">Todos</option>';
      estados.forEach(estado => {
        select.innerHTML += `<option value="${estado.name}">${estado.name}</option>`;
      });
    });
}

// 2. Filtrar productos por estado seleccionado




// Listeners para filtros independientes

document.getElementById('filtroEstado').addEventListener('change', filtroUnicoHandler);
document.getElementById('filtroTalla').addEventListener('change', filtroUnicoHandler);
document.getElementById('filtroMarca').addEventListener('change', filtroUnicoHandler);
document.getElementById('filtroTalla').addEventListener('change', filtroUnicoHandler);
document.getElementById('filtroMarca').addEventListener('change', filtroUnicoHandler);





fetch("http://jft314.ddns.net:8080/nso/api/v1/nso/product/all", requestOptions)
  .then(response => response.json())
  .then(productos => {
    productosGlobal = Array.isArray(productos) ? productos : [];
    renderizarProductos(productosGlobal);
    cargarEstadosDesdeAPI();
    cargarTallasDesdeProductos();
    cargarMarcasDesdeProductos();
  });
