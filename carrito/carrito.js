const carritoPlano = JSON.parse(localStorage.getItem('carrito')) || [];

const carrito = [];

carritoPlano.forEach(prod => {
    const existente = carrito.find(p => p.imagen === prod.imagen);
    if (existente) {
        existente.cantidad += 1;
    } else {
        carrito.push({ ...prod, cantidad: 1 });
    }
});
