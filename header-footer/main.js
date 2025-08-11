document.addEventListener('DOMContentLoaded', () => {
  cargarHeader();
  cargarFooter();
});



const verDetalles = (e) => {
    console.log(e.dataset);
    const producto = {
        producto: e.dataset.producto,
        descripcion: e.dataset.descripcion,
        categoria: e.dataset.categoria,
        tallas: JSON.parse(e.dataset.tallas),
        imagen: e.dataset.imagen,
        precio: Number(e.dataset.precio),
        precioOferta: Number(e.dataset.preciooferta),
        descuento: Number(e.dataset.descuento),
    };
    localStorage.setItem("productoSeleccionado", JSON.stringify(producto));
    window.location.href = "detalles-del-producto.html";
}

const addCart = (e) => {
    const producto = {
        producto: e.dataset.producto,
        categoria: e.dataset.categoria,
        descripcion: e.dataset.descripcion,
        tallas: JSON.parse(e.dataset.tallas),
        imagen: e.dataset.imagen,
        precio: Number(e.dataset.precio),
        precioOferta: Number(e.dataset.preciooferta),
        descuento: Number(e.dataset.descuento),
    };
    let cart = JSON.parse(localStorage.getItem("carrito")) || [];
    const existingProductIndex = cart.findIndex(item => item.producto === producto.producto);
    if (existingProductIndex !== -1) {
        cart[existingProductIndex].cantidad += 1;
    } else {
        producto.cantidad = 1;
        cart.push(producto);
    }
    localStorage.setItem("carrito", JSON.stringify(cart));

    alert("Producto agregadd al carrito que esta en la cookie");
}

function seleccionarTalla(element) {
    const todas = document.querySelectorAll('.talla-option');
    todas.forEach(t => t.classList.remove('bg-primary', 'text-white'));

    element.classList.add('bg-dark', 'text-white');
}


let indice = 0;
const ticker = document.getElementById("mensaje-ticker");

function mostrarMensaje() {
    ticker.textContent = mensajes[indice].texto;
    ticker.href = mensajes[indice].enlace;
    indice = (indice + 1) % mensajes.length;
}

// Inicializa
mostrarMensaje();
// Cambia cada 5 segundos
setInterval(mostrarMensaje, 5000);

function guardarVistaActual(vista) {
    if (vista.length > 0) {
        localStorage.setItem('vistaActual', vista);
    } else {
        localStorage.removeItem('vistaActual'); // Elimina si no se pasa nada
    }
}

function mostrarProximaFuncion() {
    alert("Producto agregadd al carrito que esta en la cookie");
}