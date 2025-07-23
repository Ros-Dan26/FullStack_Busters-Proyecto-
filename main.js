document.addEventListener("DOMContentLoaded", () => {
    createFooter();
    createNavbar();
});

const createFooter = () => {
    let footerElement = document.querySelector("footer");
    const footerContent = `
    <div class="footer-content">
        <div class="footer-section logo-container">
            <div class="logo-image-footer">
                <img src="./assets/tenisbuena.png" alt="Logo Net-Shopping Online" width="200">
            </div>
        </div>
        <div class="footer-section">
            <p class="p-0">Categorías</p>
            <ul>
                <li><a href="index.html">Principal</a></li>
                <li><a href="productos.html">Productos</a></li>
                <li><a href="registroproductos.html">Agregar Productos</a></li>
                <li><a href="carrito.html">Carrito</a></li>
            </ul>
        </div>
        <div class="footer-section">
            <p>General</p>
            <ul>
                <li><a href="aboutus.html">Sobre nosotros</a></li>
                <li><a href="aboutus.html">Contáctanos</a></li>
                <li><a href="registro2.html">Registrate</a></li>
            </ul>
        </div>
        <div class="footer-section contacto-section">
            <p>Contacto</p>
            <ul>
                <li>Teléfono: 55 1234 5678</li>
                <li>Correo: contacto@netshopping.com</li>
                <li>CDMX, México</li>
            </ul>
        </div>
        <div class="footer-section">
            <p>Síguenos</p>
            <ul class="social-icons">
                <li><a href="#"><i class="bi bi-facebook"></i></a></li>
                <li><a href="#"><i class="bi bi-instagram"></i></a></li>
                <li><a href="#"><i class="bi bi-tiktok"></i></a></li>
            </ul>
        </div>
    </div>
    <p class="copyright">&copy; 2025 Net-Shopping Online. Todos los derechos reservados.</p>
    `;
    footerElement.innerHTML = footerContent;
};

function createNavbar() {
    const navbar = `
        <nav class="navbar navbar-expand-lg navbar-dark py-2 mb-3>
            <div class="container-fluid">
                <a class="navbar-brand" href="index.html">
                    <img src="./assets/tenisbuena.png" alt="logo" width="100">
                    <strong class="ms-2">Net-Shopping Online</strong>
                </a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                    data-bs-target="#navbarMenu">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse justify-content-between" id="navbarMenu">
                    <div class="d-flex justify-content-lg-center justify-content-start w-100">
                        <ul class="navbar-nav mx-auto mb-2 mb-lg-0">
                            <li class="nav-item">
                                <a class="nav-link" href="index.html">Principal</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="aboutus.html">Contáctanos</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="aboutus.html">Sobre nosotros</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="productos.html">Productos</a>
                            </li>
                              <li class="nav-item">
                                <a class="nav-link" href="registroproductos.html">Agregar Productos</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="registro2.html">Registro</a>
                            </li>
                        </ul>
                    </div>
                    <div class="d-flex align-items-center">
                        <a href="login.html" class="text-white me-3"><i class="bi bi-person" style="font-size: 1.2rem;"></i></a>
                        <a href="carrito.html" class="text-white"><i class="bi bi-bag" style="font-size: 1.2rem;"></i></a>
                    </div>
                </div>
            </+div>
        </nav>
    `;
    document.getElementById('navbar').innerHTML = navbar;
}
