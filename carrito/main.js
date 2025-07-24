document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById('carrito-productos');
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    console.log(carrito);

    if (carrito.length === 0) {
        container.innerHTML = '<p class="text-center">No hay productos en el carrito.</p>';
        return;
    }

    let total = 0;
    let contenidoHTML = '';

    carrito.forEach((producto, index) => {
        const subtotal = producto.precio * producto.cantidad;
        total += subtotal;

        contenidoHTML += `
    <div class="col-12 col-sm-6 col-md-4 col-lg-3 d-flex justify-content-center mb-3">
        <div class="card h-100" style="width: 100%;">
            <img src="${producto.imagen}" class="card-img-top img-fluid" alt="${producto.producto}">
            <div class="card-body">
                <h5 class="card-title">${producto.producto}</h5>
                <p class="card-text">${producto.descripcion}</p>
                <p class="card-text"><strong>Precio:</strong> $${producto.precio.toFixed(2)}</p>
                <p class="card-text"><strong>Cantidad:</strong> ${producto.cantidad}</p>
                <p class="card-text"><strong>Subtotal:</strong> $${subtotal.toFixed(2)}</p>
                <button class="btn btn-danger eliminar-item" data-index="${index}">Eliminar</button>
            </div>
        </div>
    </div>
`;

    });

    container.innerHTML = contenidoHTML;

    // Mostrar total y botón de finalizar compra
    const resumen = document.createElement('div');
    resumen.innerHTML = `
        <div class="text-center mt-5">
            <h4>Total a pagar: $${total.toFixed(2)}</h4>
            <button class="btn btn-success btn-lg mt-3" id="finalizar-compra">Finalizar compra</button>
        </div>
    `;
    container.parentElement.appendChild(resumen);

    // Evento para eliminar productos
    container.addEventListener('click', e => {
        if (e.target.classList.contains('eliminar-item')) {
            const index = parseInt(e.target.getAttribute('data-index'));

            let carritoPlano = JSON.parse(localStorage.getItem('carrito')) || [];
            const productoAEliminar = carrito[index];

            carritoPlano = carritoPlano.filter(p => p.producto !== productoAEliminar.producto);

            localStorage.setItem('carrito', JSON.stringify(carritoPlano));
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Eliminado del carrito!",
                showConfirmButton: false,
                timer: 1000
            }).then(() => {
                location.reload();
            });
        }
    });

    // Finalizar compra
    document.addEventListener('click', e => {
        if (e.target.id === 'finalizar-compra') {
            window.location.href = "finalizar-compra.html";
        }
    });

});
