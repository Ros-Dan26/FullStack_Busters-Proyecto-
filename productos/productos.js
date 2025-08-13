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

      contenedor.innerHTML += `
        <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4 d-flex align-items-stretch">
          <div class="card w-100">
            <div id="carousel-${index}" class="carousel slide" data-bs-ride="carousel">
              <div class="carousel-inner">
                ${imagenes && imagenes.length > 0
                  ? imagenes.map((img, i) => `
                    <div class="carousel-item${i === 0 ? ' active' : ''}">
                      <img src="${img.url}" class="d-block w-100" alt="${producto.name}">
                    </div>
                  `).join('')
                  : `<div class="carousel-item active">
                      <img class="d-block w-100" alt="${producto.name}">
                    </div>`
                }
              </div>
              ${imagenes && imagenes.length > 1 ? `
                <button class="carousel-control-prev" type="button" data-bs-target="#carousel-${index}" data-bs-slide="prev">
                  <span class="carousel-control-prev-icon"></span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#carousel-${index}" data-bs-slide="next">
                  <span class="carousel-control-next-icon"></span>
                </button>
              ` : ''}
            </div>
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
    const imagenes = item.images; // Asegúrate de tener esto antes
    console.log(producto);

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
      id: producto.id, // <-- Aquí se guarda el id del producto
      nombre: producto.name,
      marca: producto.brand,
      modelo: producto.model,
      precio: Number(producto.price),
      talla: talla,
        cantidad: cantidad,
        imagen: (imagenes && imagenes.length > 0) ? imagenes[0].url : '', // <-- Aquí se guarda la primer imagen
        total: Number(producto.price) * cantidad
    };

    // Obtiene el carrito actual del localStorage
    let cart = JSON.parse(localStorage.getItem("carrito")) || [];

    // Si el producto ya está en el carrito con el mismo id, suma la cantidad
    const existingIndex = cart.findIndex(item => item.id === producto.id);

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