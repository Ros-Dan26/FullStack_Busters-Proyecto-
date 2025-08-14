// Espera a que todo el DOM esté cargado antes de ejecutar el script
document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById('carrito-productos');
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    // Mostrar mensaje si el carrito está vacío
    if (carrito.length === 0) {
        container.innerHTML = '<p class="text-center">No hay productos en el carrito.</p>';
        return;
    }

    // Renderizar el contenido del carrito
    renderizarCarrito();

    /**
     * Recorre los productos del carrito y los muestra en tarjetas tipo Bootstrap.
     * También muestra el total y el botón de finalizar compra.
     */
    function renderizarCarrito() {
        container.innerHTML = "";
        let total = 0;

        carrito.forEach((producto, index) => {
            const subtotal = producto.precio * producto.cantidad;
            total += subtotal;

            const col = document.createElement('div');
            col.className = "col d-flex justify-content-center";

            col.innerHTML = `
                <div class="card h-100" style="width: 18rem;">
                    <img src="${producto.imagen}" class="card-img-top img-fluid" alt="${producto.nombre}" style="height: 200px; object-fit: contain;">
                    <div class="card-body d-flex flex-column justify-content-between">
                        <div>
                            <h5 class="card-title">${producto.nombre}</h5>
                            <p class="card-text"><strong>Talla:</strong> ${producto.talla || "No especificada"}</p>
                            <p class="card-text"><strong>Precio:</strong> $${producto.precio ? producto.precio.toFixed(2) : '0.00'}</p>
                            <p class="card-text"><strong>Cantidad:</strong> ${producto.cantidad}</p>
                        </div>
                        <button class="btn btn-outline-danger w-100 mt-3 eliminar-item" data-index="${index}">
                            <i class="bi bi-trash-fill"></i> Eliminar
                        </button>
                    </div>
                </div>
            `;
            container.appendChild(col);
        });

        // Crear resumen con total y botón de finalizar compra
        const resumen = document.createElement('div');
        resumen.className = 'text-center w-100 mt-5';
        resumen.innerHTML = `
            <h4 class="mb-3">Total a pagar: <span class="text-success">$${carrito.reduce((acc, producto) => acc + (Number(producto.total) || 0), 0).toFixed(2)}</span></h4>
            <button class="btn btn-success btn-lg" id="finalizar-compra">
                <i class="bi bi-cart-check-fill"></i> Finalizar compra
            </button>
        `;
        container.appendChild(resumen);
    }

    /**
     * Escucha clics en el contenedor del carrito.
     * Si se hace clic en el botón "Eliminar", se elimina ese producto del carrito.
     */
    container.addEventListener('click', e => {
        if (e.target.closest('.eliminar-item')) {
            const index = parseInt(e.target.closest('.eliminar-item').dataset.index);
            carrito.splice(index, 1);
            localStorage.setItem('carrito', JSON.stringify(carrito));
            renderizarCarrito();
        }
    });

    /**
     * Redirige al usuario a la página de finalización de compra
     * cuando hace clic en el botón "Finalizar compra".
     */
    document.addEventListener('click', e => {
        if (e.target.id === 'finalizar-compra') {
            window.location.href = "/finalizar-compra/finalizar-compra.html";
        }
    });

    // Crea el objeto del producto para el carrito con los nombres esperados
    const productoCarrito = {
        producto: producto.name, // nombre del producto
        marca: producto.brand,   // marca
        modelo: producto.model,  // modelo
        precio: producto.price,  // precio
        talla: talla,            // talla seleccionada
        cantidad: cantidad,      // cantidad seleccionada
        imagen: (imagenes && imagenes.length > 0) ? imagenes[0].url : '', // primera imagen
        total: producto.precio && cantidad ? producto.precio * cantidad : 0
    };

    // Obtiene el carrito actual del localStorage
    let cart = JSON.parse(localStorage.getItem("carrito")) || [];

    // Si el producto ya está en el carrito con la misma talla, suma la cantidad
    const existingIndex = cart.findIndex(item => item.producto === productoCarrito.producto && item.talla === talla);

    if (existingIndex !== -1) {
      cart[existingIndex].cantidad += cantidad;
      cart[existingIndex].total += producto.price * cantidad;
    } else {
      cart.push(productoCarrito);
    }

    // Guarda el carrito actualizado en localStorage
    localStorage.setItem("carrito", JSON.stringify(cart));
    crearPopUpUniversal(cantidad, producto.name, talla); // POP UP

    // Elimina el carrito del localStorage
    localStorage.removeItem("carrito");

    let totalPagar = 0;
    carrito.forEach(producto => {
      totalPagar += Number(producto.total) || 0;
    });
    document.getElementById("total-pagar").textContent = totalPagar.toFixed(2);
});
