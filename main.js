
document.addEventListener("DOMContentLoaded", () => {
    createFooter()
    createNavbar()
})

const createFooter = () => {
    let footerElement = document.querySelector("footer");
    const footerContent = `
    <div class="">
        <div class="footer-section logo-container">
            <div class="logo-image-footer">
                <img src="./assets/logo-footer.jpg" alt="" srcset="">
            </div>
            </ul>
        </div>
        <div class="footer-section">
            <p class="p-0">Categorias</p>
            <ul class="">
                <li><a href="lo-nuevo.html">Lo mas nuevo</a></li>
                <li><a href="mujer.html">Mujer</a></li>
                <li><a href="hombres.html">Hombre</a></li>
                <li><a href="Niño.html">Niño/a</a></li>
                <li><a href="ofertas.html">Ofertas</a></li>
            </ul>
        </div>
        <div class="footer-section">
            <p>General</p>
            <ul class="list-unstyled">
                <li><a href="#">Sobre nosotros</a></li>
                <li><a href="contactanos.html">Contactanos</a></li>
                <li><a href="#">Términos y condiciones</a></li>
                <li><a href="#">Política de privacidad</a></li>
            </ul>
        </div>
        <div class="footer-section contacto-section">
            <p>Información de contacto</p>
            <ul class="list-unstyled">
                <li>Teléfono:55 1234 5678</li>
                <li>Correo:contacto@empresa.com</li>
                <li>Dirección: Calle Ficticia 123, CDMX, México</li>
            </ul>
        </div>
        <div class="footer-section">
            <p>Redes sociales</p>
            <ul class="list-unstyled">
                <li><a href="#">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                            class="bi bi-facebook" viewBox="0 0 16 16">
                            <path
                                d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951" />
                        </svg>
                    </a></li>
                <li><a href="#">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                            class="bi bi-instagram" viewBox="0 0 16 16">
                            <path
                                d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334" />
                        </svg>
                    </a></li>
                <li><a href="#">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                            class="bi bi-tiktok" viewBox="0 0 16 16">
                            <path
                                d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2a3 3 0 1 0 3 3z" />
                        </svg>
                    </a></li>
            </ul>
        </div>
    </div>
    <p class="store-name">&copy; 2025 Sport Shop. Todos los derechos reservados.</p>
     `

    footerElement.innerHTML = footerContent;
}
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

    Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Añadido al carrito!",
        text: `"${producto.producto}" se ha añadido al carrito.`,
        showConfirmButton: false,
        timer: 1500
    });
}

function seleccionarTalla(element) {
    const todas = document.querySelectorAll('.talla-option');
    todas.forEach(t => t.classList.remove('bg-primary', 'text-white'));

    element.classList.add('bg-dark', 'text-white');
}

function createNavbar() {
    const vistaGuardada = localStorage.getItem('vistaActual');
    const links = document.querySelectorAll('#navLinks .nav-link');

    const navbar = `
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark py-2 mb-3">
            <div class="container-fluid">
                <a onclick="guardarVistaActual('')" class="navbar-brand" href="index.html">
                <img src="./assets/icono-minimalista.png" alt="logo" width="50">
                <strong class="ms-2">Net/Shopping</strong>
                </a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                    data-bs-target="#navbarMenu">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse  justify-content-between" id="navbarMenu">
                    <div class="d-flex justify-content-lg-center justify-content-start w-100">
                        <ul class="navbar-nav mx-auto mb-2 mb-lg-0">
                            <li class="nav-item">
                                <a 
                                class="nav-link ${localStorage.getItem('vistaActual') === 'lo-nuevo.html' ? 'active' : ''}" 
                                href="lo-nuevo.html" 
                                onclick="guardarVistaActual('lo-nuevo.html')"
                                >Lo Nuevo</a>
                            </li>
                            <li class="nav-item">
                                <a 
                                class="nav-link ${localStorage.getItem('vistaActual') === 'hombres.html' ? 'active' : ''}" 
                                href="hombres.html" 
                                onclick="guardarVistaActual('hombres.html')"
                                >Hombre</a>
                            </li>
                            <li class="nav-item">
                                <a 
                                class="nav-link ${localStorage.getItem('vistaActual') === 'mujer.html' ? 'active' : ''}" 
                                href="mujer.html" 
                                onclick="guardarVistaActual('mujer.html')"
                                >Mujer</a>
                            </li>
                            <li class="nav-item">
                                <a 
                                class="nav-link ${localStorage.getItem('vistaActual') === 'niños.html' ? 'active' : ''}" 
                                href="niños.html" 
                                onclick="guardarVistaActual('niños.html')"
                                >Niño/a</a>
                            </li>
                            <li class="nav-item">
                                <a 
                                class="nav-link text-danger ${localStorage.getItem('vistaActual') === 'ofertas.html' ? 'active' : ''}" 
                                href="ofertas.html" 
                                onclick="guardarVistaActual('ofertas.html')"
                                >Ofertas</a>
                            </li>
                        </ul>
                    </div>
                    <form class="d-flex align-items-center">
                        <input class="form-control form-control-sm me-2 d-none d-lg-block" type="search"
                            placeholder="Buscar">
                        <button  onclick="guardarVistaActual('')" class="btn btn-light btn-sm me-3 d-none d-lg-block" type="submit">
                            <i class="bi bi-search"></i>
                        </button>
                        <a  onclick="guardarVistaActual('')" href="login.html" class="text-white me-3"><i class="bi bi-person"
                                style="font-size: 1.2rem;"></i></a>
                        <a type="button" onclick="mostrarProximaFuncion(); return false;" class="text-danger me-3"><i class="bi bi-heart"
                                style="font-size: 1.2rem;"></i></a>
                        <a  onclick="guardarVistaActual('')" href="carrito.html" class="text-white"><i class="bi bi-bag"
                                style="font-size: 1.2rem;"></i></a>
                    </form>
                </div>
            </div>
        </nav>
    `;
    document.getElementById('navbar').innerHTML = navbar;
}

const mensajes = [
    { texto: "🚚 Envío gratis en compras mayores a $999", enlace: "index.html" },
    { texto: "🔥 Unete para recibir informacion sobre productos exclusivos disponibles solo esta semana", enlace: "login.html" },
    { texto: "🎁 Ofertas exclusivas de todos los productos", enlace: "ofertas.html" },
];

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
    Swal.fire({
        icon: 'info',
        title: '¡Muy pronto!',
        text: 'La función de favoritos estará disponible próximamente.',
        confirmButtonText: 'OK',
    });
}