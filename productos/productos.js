// 1. Obtiene el contenedor donde se mostrarán los productos
const contenedor = document.getElementById('catalogo-productos');

// 2. Limpia el contenido previo del contenedor
contenedor.innerHTML = '';

// 3. Recorre el arreglo de productos y genera una tarjeta para cada uno
productos.forEach((producto, index) => {
    contenedor.innerHTML += `
    <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4 d-flex align-items-stretch">
      <div class="card w-100">
        <img src="${producto.imagen}" class="card-img-top" alt="${producto.producto}">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${producto.producto}</h5>
          <p class="card-text flex-grow-1">${producto.descripcion}</p>
          <p class="card-text precio">$${producto.precio.toFixed(2)}</p>

          <!-- Selector de talla -->
          <label for="talla-select-${index}" class="form-label">Selecciona talla:</label>
          <select class="form-select mb-3" id="talla-select-${index}">
            ${producto.tallas.map(talla => `<option value="${talla}">${talla}</option>`).join('')}
          </select>

          <!-- Selector de cantidad -->
          <label for="cantidad-input-${index}" class="form-label">Cantidad:</label>
          <input type="number" min="1" value="1" class="form-control mb-3" id="cantidad-input-${index}" />

          <!-- Botón para ver detalles del producto -->
          <button 
            class="btn btn-outline-secondary mb-2"
            onclick="verDetalles(${index})"
          >
            Ver detalles
          </button>

          <!-- Botón para añadir el producto al carrito -->
          <button 
            class="btn fondo-negro-medio d-flex align-items-center gap-2 add-to-cart mt-auto"
            onclick="addCart(${index})"
          >
            <span>Añadir al carrito</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                class="bi bi-cart-check-fill" viewBox="0 0 16 16">
                <path
                    d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0m7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0m-1.646-7.646-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L8 8.293l2.646-2.647a.5.5 0 0 1 .708.708" />
            </svg>
          </button>
        </div>
      </div>
    </div>
    `;
});

// 4. Función para añadir productos al carrito
function addCart(index) {
    const producto = productos[index];

    // Obtiene la talla y cantidad seleccionadas por el usuario
    const tallaSelect = document.getElementById(`talla-select-${index}`);
    const cantidadInput = document.getElementById(`cantidad-input-${index}`);

    const talla = tallaSelect.value;
    let cantidad = parseInt(cantidadInput.value);

    // Validación de talla y cantidad
    if (!talla) {
      alert("Por favor selecciona una talla.");
      return;
    }
    if (isNaN(cantidad) || cantidad < 1) {
      alert("Por favor ingresa una cantidad válida.");
      return;
    }

    // Crea el objeto del producto para el carrito
    const productoParaCarrito = {
        producto: producto.producto,
        categoria: producto.categoria || "Hombres",
        descripcion: producto.descripcion,
        talla: talla,
        imagen: producto.imagen,
        precio: producto.precio,
        precioOferta: producto.precioOferta,
        descuento: producto.descuento || 0,
        cantidad: cantidad
    };

    // Obtiene el carrito actual del localStorage
    let cart = JSON.parse(localStorage.getItem("carrito")) || [];

    // Si el producto ya está en el carrito con la misma talla, suma la cantidad
    const existingIndex = cart.findIndex(item => item.producto === productoParaCarrito.producto && item.talla === talla);

    if (existingIndex !== -1) {
      cart[existingIndex].cantidad += cantidad;
    } else {
      cart.push(productoParaCarrito);
    }

    // Guarda el carrito actualizado en localStorage
    localStorage.setItem("carrito", JSON.stringify(cart));
    alert(`${cantidad} unidad(es) de ${producto.producto} (Talla: ${talla}) agregada(s) al carrito.`);
}

// 5. Función para mostrar los detalles del producto en un modal
function verDetalles(index) {
    const producto = productos[index];

    // Asigna los datos del producto al modal
    document.getElementById('modalProductoImagen').src = producto.imagen;
    document.getElementById('modalProductoImagen').alt = producto.producto;
    document.getElementById('modalProductoTitulo').textContent = producto.producto;
    document.getElementById('modalProductoDescripcion').textContent = producto.descripcion;
    document.getElementById('modalProductoPrecio').textContent = `$${producto.precio.toFixed(2)}`;

    // Muestra el modal usando Bootstrap 5
    const modal = new bootstrap.Modal(document.getElementById('productoModal'));
    modal.show();
}

