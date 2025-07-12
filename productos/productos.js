const contenedor = document.getElementById('catalogo-productos');

productos.map((producto) => {
    contenedor.innerHTML += `
        <div class="card m-2" style="width: 18rem;">
        <img src="${producto.imagen}" class="card-img-top" alt="${producto.producto}">
        <div class="card-body">
            <h5 class="card-title">${producto.producto}</h5>
            <p class="card-text">${producto.descripcion}</p>
            <p class="card-text">$${producto.precio.toFixed(2)}</p>
            <div class="mb-3">
                <h6>Tallas disponibles:</h6>
                <div class="d-flex flex-wrap">
                    ${producto.tallas.map(talla => 
                        `<span class="badge bg-secondary tallas-badge m-1">${talla}</span>`
                    ).join('')}
                </div>
            </div>
            <button 
                onclick="verDetalles(this)"
                class="btn btn-outline-secondary mb-2"
                data-producto="${producto.producto}"
                data-categoria="${"Hombres"}"
                data-descripcion="${producto.descripcion.replace(/"/g, '&quot;')}"
                data-tallas='${JSON.stringify(producto.tallas)}'
                data-imagen="${producto.imagen}"
                data-precio="${producto.precio}"
                data-preciooferta="${producto.precioOferta}"
                data-descuento="${producto.descuento || 0}"
            >
                Ver detalles
            </button>
            <button 
                onclick="addCart(this)", 
                class="btn fondo-negro-medio d-flex align-items-center gap-2 add-to-cart"
                data-producto="${producto.producto}"
                data-categoria="${producto.categoria}"
                data-descripcion="${producto.descripcion.replace(/"/g, '&quot;')}"
                data-tallas='${JSON.stringify(producto.tallas)}'
                data-imagen="${producto.imagen}"
                data-precio="${producto.precio}"
                data-preciooferta="${producto.precioOferta}"
                data-descuento="${producto.descuento}"
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
    `;
});