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
                <img src="./assets/icono-minimalista.png" alt="Logo Sport Shop" width="150">
            </div>
        </div>
        <div class="footer-section">
            <p class="p-0">Categorías</p>
            <ul>
                <li><a href="Principal.html">Principal</a></li>
                <li><a href="mujer.html">Cambia1</a></li>
                <li><a href="hombre.html">Cambia2</a></li>
                <li><a href="nino.html">Cambia3</a></li>
            </ul>
        </div>
        <div class="footer-section">
            <p>General</p>
            <ul>
                <li><a href="aboutus.html">Sobre nosotros</a></li>
                <li><a href="contactanos.html">Contáctanos</a></li>
                <li><a href="terminos.html">Términos y condiciones</a></li>
            </ul>
        </div>
        <div class="footer-section contacto-section">
            <p>Contacto</p>
            <ul>
                <li>Teléfono: 55 1234 5678</li>
                <li>Correo: contacto@sportshop.com</li>
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
    <p class="copyright">&copy; 2025 Sport Shop. Todos los derechos reservados.</p>
    `;
    footerElement.innerHTML = footerContent;
};

function createNavbar() {
    const navbar = `
        <nav class="navbar navbar-expand-lg navbar-dark py-2 mb-3" style="background-color: #242424;">
            <div class="container-fluid">
                <a class="navbar-brand" href="index.html">
                    <img src="./assets/icono-minimalista.png" alt="logo" width="50">
                    <strong class="ms-2">Sport Shop</strong>
                </a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                    data-bs-target="#navbarMenu">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse justify-content-between" id="navbarMenu">
                    <div class="d-flex justify-content-lg-center justify-content-start w-100">
                        <ul class="navbar-nav mx-auto mb-2 mb-lg-0">
                            <li class="nav-item">
                                <a class="nav-link" href="Principal.html">Principal</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="hombre.html">Cambia1</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="mujer.html">Cambia2</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="nino.html">Cambia3</a>
                            </li>
                        </ul>
                    </div>
                    <div class="d-flex align-items-center">
                        <a href="login.html" class="text-white me-3"><i class="bi bi-person" style="font-size: 1.2rem;"></i></a>
                        <a href="carrito.html" class="text-white"><i class="bi bi-bag" style="font-size: 1.2rem;"></i></a>
                    </div>
                </div>
            </div>
        </nav>
    `;
    document.getElementById('navbar').innerHTML = navbar;
}