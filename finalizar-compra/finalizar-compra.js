
document.addEventListener("DOMContentLoaded", () => {
    createResumen()
})

const metodoTarjeta = document.getElementById('pagoTarjeta');
const metodoPaypal = document.getElementById('pagoPaypal');
const campoTarjeta = document.getElementById('campoTarjeta');
const btnFinalizar = document.getElementById('btnFinalizar');

function actualizarMetodoPago() {
    if (metodoTarjeta.checked) {
        campoTarjeta.style.display = 'block';
        btnFinalizar.textContent = 'Finalizar compra';
    } else {
        campoTarjeta.style.display = 'none';
        btnFinalizar.textContent = 'Ir a PayPal para finalizar compra';
    }
}

// Escuchar cambios
metodoTarjeta.addEventListener('change', actualizarMetodoPago);
metodoPaypal.addEventListener('change', actualizarMetodoPago);

// Ejecutar al cargar
actualizarMetodoPago();

function finalizarCompra() {
    let timerInterval;
    Swal.fire({
        title: "Compra finalizada con éxito!",
        timer: 1500,
        timerProgressBar: true,
        icon: "success",
        willClose: () => {
            clearInterval(timerInterval);
        }
    }).then((result) => {
        if (result.dismiss === Swal.DismissReason.timer) {
            localStorage.clear();
            window.location.href = "index.html";
        }
    })
}

function createResumen() {
    let carrito = JSON.parse(localStorage.getItem("carrito"))
    const resumen = document.getElementById("resumen-pedido");
    let total = 0;

    if (carrito.length === 0) {
        resumen.innerHTML = "<p class='text-muted'>Tu carrito está vacío.</p>";
    } else {
        let listaItems = carrito.map(item => {
            const precioUnitario = item.precioOferta && item.precioOferta > 0 && item.precioOferta < item.precio
                ? item.precioOferta
                : item.precio;

            const subtotal = precioUnitario * item.cantidad;
            total += subtotal;

            return `
            <li class="list-group-item d-flex justify-content-between lh-sm">
            <div>
                <h6 class="my-0">${item.producto}</h6>
                <small class="text-muted">
                Cantidad: ${item.cantidad} <br>
                Precio: ${precioUnitario.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}
                ${item.precioOferta && item.precioOferta > 0 && item.precioOferta < item.precio 
                    ? `<br><span class="text-decoration-line-through">Original: ${item.precio.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</span>`
                    : ''}
                </small>
            </div>
            <span class="text-muted">${subtotal.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</span>
            </li>
            `;
        }).join("");

        resumen.innerHTML = `
    <div class="card p-4 bg-white">
      <h4 class="mb-3">Resumen del pedido</h4>
      <ul class="list-group mb-3">
        ${listaItems}
        <li class="list-group-item d-flex justify-content-between">
          <strong>Total (MXN)</strong>
          <strong>${total.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</strong>
        </li>
      </ul>
      <p class="text-muted small text-center mb-0">
        Los precios incluyen IVA. Envío gratis en pedidos mayores a $999.
      </p>
    </div>
  `;
    }
}