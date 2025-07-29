document.addEventListener("DOMContentLoaded", () => {
  mostrarProductosCarrito();
});

function mostrarProductosCarrito() {
  const contenedor = document.getElementById("carrito-productos");
  const productos = JSON.parse(localStorage.getItem("carrito")) || [];

  contenedor.innerHTML = "";
  let total = 0;

  productos.forEach((producto, index) => {
    const cantidad = producto.cantidad || 1;
    const subtotal = producto.precio * cantidad;
    total += subtotal;

    const card = document.createElement("div");
    card.className = "col";
    card.innerHTML = `
      <div class="card h-100">
        <img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${producto.nombre}</h5>
          <p class="card-text"><strong>Talla:</strong> ${producto.talla || 'N/A'}</p>
          <p class="card-text"><strong>Precio:</strong> $${producto.precio.toFixed(2)}</p>
          <p class="card-text"><strong>Cantidad:</strong> ${cantidad}</p>
          <p class="card-text"><strong>Subtotal:</strong> $${subtotal.toFixed(2)}</p>
          <button class="btn btn-outline-danger mt-auto" onclick="eliminarProducto(${index})">
            <i class="bi bi-trash"></i> Eliminar
          </button>
        </div>
      </div>
    `;
    contenedor.appendChild(card);
  });

  const totalDiv = document.createElement("div");
  totalDiv.className = "col-12 mt-4 text-end";
  totalDiv.innerHTML = `<h5>Total: $${total.toFixed(2)}</h5>`;
  contenedor.appendChild(totalDiv);
}

function eliminarProducto(index) {
  const productos = JSON.parse(localStorage.getItem("carrito")) || [];
  productos.splice(index, 1);
  localStorage.setItem("carrito", JSON.stringify(productos));
  mostrarProductosCarrito();
}
