document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById('carrito-productos');
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    if (carrito.length === 0) {
        container.innerHTML = '<p class="text-center">No hay productos en el carrito.</p>';
        return;
    }

    renderizarCarrito();

    function renderizarCarrito() {
        container.innerHTML = "";
        let total = 0;

        carrito.forEach((producto, index) => {
            const subtotal = producto.precio * producto.cantidad;
            total += subtotal;

            const col = document.createElement('div');
            col.className = "col d-flex justify-content-center";

            col.innerHTML = `
                <div class="card h-100">
                    <img src="${producto.imagen}" class="card-img-top" alt="${producto.producto}">
                    <div class="card-body d-flex flex-column justify-content-between">
                        <div>
                            <h5 class="card-title">${producto.producto}</h5>
                            <p class="card-text"><strong>Talla:</strong> ${producto.talla || "No especificada"}</p>
                            <p class="card-text"><strong>Precio:</strong> $${producto.precio.toFixed(2)}</p>
                            <p class="card-text"><strong>Cantidad:</strong> ${producto.cantidad}</p>
                            <p class="card-text"><strong>Subtotal:</strong> $${subtotal.toFixed(2)}</p>
                        </div>
                        <button class="btn btn-outline-danger w-100 mt-3 eliminar-item" data-index="${index}">
                            <i class="bi bi-trash-fill"></i> Eliminar
                        </button>
                    </div>
                </div>
            `;
            container.appendChild(col);
        });

        const resumen = document.createElement('div');
        resumen.className = 'text-center w-100 mt-5';
        resumen.innerHTML = `
            <h4 class="mb-3">Total a pagar: <span class="text-success">$${total.toFixed(2)}</span></h4>
            <button class="btn btn-success btn-lg" id="finalizar-compra">
                <i class="bi bi-cart-check-fill"></i> Finalizar compra
            </button>
        `;
        container.appendChild(resumen);
    }

    container.addEventListener('click', e => {
        if (e.target.closest('.eliminar-item')) {
            const index = parseInt(e.target.closest('.eliminar-item').dataset.index);
            carrito.splice(index, 1);
            localStorage.setItem('carrito', JSON.stringify(carrito));
            renderizarCarrito();
        }
    });

    document.addEventListener('click', e => {
        if (e.target.id === 'finalizar-compra') {
            window.location.href = "finalizar-compra.html";
        }
    });
});
