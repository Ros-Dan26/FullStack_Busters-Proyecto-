const requestOptions = {
  method: "GET",
  redirect: "follow"
};

fetch("http://jft314.ddns.net:8080/nso/api/v1/nso/product/all", requestOptions)
  .then(response => response.json())
  .then(productos => {
    const contenedor = document.getElementById("catalogo-productos");
    contenedor.innerHTML = "";

    // Guardamos el arreglo globalmente para addCart y verDetalles
    window.productos = productos;

    productos.forEach((item, index) => {
      const producto = item.products;
      const imagenes = item.images;
      // Usar la primera imagen si existe, si no, imagen genérica
      const imagenPrincipal = imagenes && imagenes.length > 0
        ? imagenes[0].url
        : 'https://via.placeholder.com/300x200?text=Producto';

      contenedor.innerHTML += `
        <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4 d-flex align-items-stretch">
          <div class="card w-100">
            <img src="${imagenPrincipal}" class="card-img-top" alt="${producto.name}">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">${producto.brand} - ${producto.name}</h5>
              <p class="card-text"><strong>Modelo:</strong> ${producto.model}</p>
              <p class="card-text flex-grow-1"><strong>Descripción:</strong> ${producto.description}</p>
              <p class="card-text"><strong>Detalles:</strong> ${producto.details}</p>
              <p class="card-text"><strong>Status:</strong> ${producto.status}</p>
              <p class="card-text precio"><strong>Precio:</strong> $${producto.price ? producto.price.toFixed(2) : 'N/A'}</p>
              <label for="talla-select-${index}" class="form-label">Selecciona talla:</label>
              <select class="form-select mb-3" id="talla-select-${index}">
                <option value="${producto.size}">${producto.size}</option>
              </select>
              <label for="cantidad-input-${index}" class="form-label">Cantidad:</label>
              <input type="number" min="1" value="1" class="form-control mb-3" id="cantidad-input-${index}" />
              <button class="product-card__btn" onclick="verDetalles(${index})">Ver detalles</button>
              <button class="aniadir-carrito_btn" onclick="addCart(${index})"> Añadir al carrito </button>
            </div>
          </div>
        </div>
      `;
    });
  })
  .catch(error => console.error("Error al cargar productos:", error));

// 5. Función para añadir productos al carrito
function addCart(index) {
    const item = window.productos[index];
    const producto = item.products;

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
    const productoCarrito = {
        id: producto.id,
        brand: producto.brand,
        name: producto.name,
        model: producto.model,
        price: producto.price,
        talla: talla,
        cantidad: cantidad,
        total: producto.price * cantidad
    };

    // Obtiene el carrito actual del localStorage
    let cart = JSON.parse(localStorage.getItem("carrito")) || [];

    // Si el producto ya está en el carrito con la misma talla, suma la cantidad
    const existingIndex = cart.findIndex(item => item.name === productoCarrito.name && item.talla === talla);

    if (existingIndex !== -1) {
      cart[existingIndex].cantidad += cantidad;
      cart[existingIndex].total += producto.price * cantidad;
    } else {
      cart.push(productoCarrito);
    }

    // Guarda el carrito actualizado en localStorage
    localStorage.setItem("carrito", JSON.stringify(cart));
    crearPopUpUniversal(cantidad, producto.name, talla); // POP UP 
}

// 6. Función para mostrar los detalles del producto en un modal
function verDetalles(index) {
    const item = window.productos[index];
    const producto = item.products;
    const imagenes = item.images;
    const imagenPrincipal = imagenes && imagenes.length > 0
      ? imagenes[0].url
      : 'https://via.placeholder.com/300x200?text=Producto';

    // Asigna los datos del producto al modal
    document.getElementById('modalProductoImagen').src = imagenPrincipal;
    document.getElementById('modalProductoImagen').alt = producto.name;
    document.getElementById('modalProductoTitulo').textContent = `${producto.brand} - ${producto.name}`;
    document.getElementById('modalProductoDescripcion').textContent = producto.details || '';
    document.getElementById('modalProductoPrecio').textContent = `$${producto.price.toFixed(2)}`;

    // Muestra el modal usando Bootstrap 5
    const modal = new bootstrap.Modal(document.getElementById('productoModal'));
    modal.show();
}

// -- POP UP -- \\
function crearPopUpUniversal(cantidad, producto, talla){
  const contenedor = document.getElementById('PopUp-Universal');
  let palabra = cantidad > 1 ? "Unidades": "Unidad";

    contenedor.innerHTML = `
        <div class="popup-Diseño" id="popup-registro">
                <div class="popup-Diseño-Contenido">
                    <p><b> Su Producto ha sido añadido al carrito </b> </p>
                    <p>${producto}</p>
                    <button onclick="cerrarPopupUniversal()">Seguir Comprando</button>
                    <button onclick=window.location.href='/carrito/carrito.html'>Ir a carrito </button>
                </div>
        </div>
      `;
}

function cerrarPopupUniversal() {
    const contenedor = document.getElementById("PopUp-Universal");
    contenedor.innerHTML = '';
}