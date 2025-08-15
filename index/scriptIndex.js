// ========================== HERO VIDEO AUTOPLAY ==========================
// Espera a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    // Selecciona el elemento de video con la clase .hero__video
    const video = document.querySelector('.hero__video');
    // Silencia el video para permitir el autoplay en la mayoría de navegadores
    video.muted = true;
    // Intenta reproducir el video automáticamente
    video.play().catch(error => {
        // Si falla el autoplay, muestra una imagen de fallback y controles manuales
        video.poster = 'fallback-image.jpg'; // Imagen de respaldo si no se puede reproducir
        video.controls = true; // Permite al usuario reproducir manualmente
    });
    // Cuando el video termina, reinícialo automáticamente para loop infinito
    video.addEventListener('ended', () => {
        video.currentTime = 0;
        video.play();
    });
});
// ======================== FIN HERO VIDEO AUTOPLAY ========================


// ===================== CARRUSEL INFINITO DE MARCAS =======================
// Espera a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    // Selecciona el contenedor del carrusel de marcas
    const track = document.querySelector('.brands-carousel-track');
    // Evitar errores si no existe en la página
    if (!track) return;
    // Obtiene todos los slides (marcas) como un array
    let slides = Array.from(track.children);
    // Guarda el número original de slides
    const slideCount = slides.length;
    // Evitar errores si no hay slides
    if (slideCount === 0) return;

    // Duplica los slides al final para crear el efecto infinito
    slides.forEach(slide => track.appendChild(slide.cloneNode(true)));
    // Duplica los slides al inicio para permitir scroll infinito hacia atrás
    slides.forEach(slide => track.insertBefore(slide.cloneNode(true), track.firstChild));

    // Actualiza el array de slides después de duplicar
    slides = Array.from(track.children);
    // Establece el índice actual en el primer slide del set original (en el centro)
    let currentIndex = slideCount;

    // Función para obtener el ancho total de un slide (incluyendo márgenes)
    function getSlideWidth() {
        const slide = slides[0];
        const style = window.getComputedStyle(slide);
        return slide.offsetWidth + parseFloat(style.marginLeft) + parseFloat(style.marginRight);
    }

    // Calcula el ancho de un slide al inicio
    let slideWidth = getSlideWidth();

    // Función para mover el carrusel a un índice específico
    function moveCarousel(index, animate = true) {
        if (!animate) {
            // Desactiva la transición para saltos instantáneos
            track.style.transition = 'none';
        } else {
            // Activa la transición para animaciones suaves
            track.style.transition = 'transform 0.5s ease-in-out';
        }
        // Calcula el desplazamiento en píxeles
        const offset = slideWidth * index;
        // Aplica la transformación para mover el carrusel
        track.style.transform = `translateX(-${offset}px)`;

        if (!animate) {
            // Fuerza un repaint para que la siguiente animación funcione correctamente
            track.offsetHeight;
            track.style.transition = 'transform 0.5s ease-in-out';
        }
    }

    // Función para verificar y corregir los límites del carrusel (loop infinito)
    function checkBounds() {
        if (currentIndex >= slideCount * 2) {
            // Si se pasa del final, salta sin animación al inicio del set original
            currentIndex = slideCount;
            moveCarousel(currentIndex, false);
        } else if (currentIndex < slideCount) {
            // Si retrocede antes del inicio, salta al final real
            currentIndex = slideCount * 2 - 1;
            moveCarousel(currentIndex, false);
        }
    }

    // Función para avanzar al siguiente slide con animación
    function nextSlide() {
        currentIndex++;
        moveCarousel(currentIndex);
        // Espera a que termine la transición antes de corregir límites
        setTimeout(checkBounds, 600);
    }

    // Función para retroceder al slide anterior con animación
    function prevSlide() {
        currentIndex--;
        moveCarousel(currentIndex);
        setTimeout(checkBounds, 600);
    }

    // (Opcional) Añadir botones para controlar el carrusel manualmente
    /*
    document.querySelector('.brands-left').addEventListener('click', prevSlide);
    document.querySelector('.brands-right').addEventListener('click', nextSlide);
    */

    // Recalcula el ancho de los slides si la ventana cambia de tamaño
    window.addEventListener('resize', () => {
        slideWidth = getSlideWidth();
        moveCarousel(currentIndex, false);
    });

    // Inicializa el carrusel en la posición correcta sin animación
    moveCarousel(currentIndex, false);

    // Activa el autoplay del carrusel, avanzando cada 1000 ms (1 segundo)
    setInterval(nextSlide, 1000);
});
// =================== FIN CARRUSEL INFINITO DE MARCAS =====================


// ===================== CARGA DE PRODUCTOS DESTACADOS =====================
// URL de la API para obtener todos los productos
const API_URL = "http://jft314.ddns.net:8080/nso/api/v1/nso/product/all";
// Opciones para la petición fetch
const requestOptions = { method: "GET", redirect: "follow" };

// Selecciona el contenedor donde se mostrarán los productos destacados
const featuredContainer = document.getElementById("featuredContainer");

// =================== ELEMENTOS DEL MODAL DE PRODUCTO =====================
// Selecciona el modal y sus elementos internos para mostrar detalles del producto
const modal = document.getElementById("productModal");
const modalClose = document.querySelector(".modal-close");
const modalImages = document.getElementById("modalImages");
const modalName = document.getElementById("modalName");
const modalPrice = document.getElementById("modalPrice");
const modalDescription = document.getElementById("modalDescription");
const modalDetails = document.getElementById("modalDetails");
const sizeSelect = document.getElementById("sizeSelect");
const quantityInput = document.getElementById("quantityInput");
const addToCartBtn = document.getElementById("addToCartBtn");

// Variable para guardar el producto actualmente mostrado en el modal
let currentProduct = null;

// ================== CARGA Y RENDER DE PRODUCTOS DESTACADOS ===============
// Realiza la petición a la API para obtener los productos
fetch(API_URL, requestOptions)
    .then(res => res.json()) // Convierte la respuesta a JSON
    .then(data => {
        // Verifica que la respuesta sea un array
        if (!Array.isArray(data)) return;
        // Selecciona 5 productos aleatorios para destacar
        const destacados = data.sort(() => 0.5 - Math.random()).slice(0, 6);

        // Itera sobre los productos destacados y crea una tarjeta para cada uno
        destacados.forEach(item => {
            const prod = item.products; // Datos del producto
            const imgs = item.images; // Imágenes del producto
            // Usa la primera imagen o una imagen por defecto si no hay
            const firstImg = imgs && imgs.length ? imgs[0].url : "https://via.placeholder.com/300x180?text=Sin+Imagen";

            // Crea el elemento de la tarjeta de producto
            const card = document.createElement("div");
            card.className = "card";
            card.innerHTML = `
            <img src="${firstImg}" alt="${prod.name}">
            <div class="card-content">
                <h3>${prod.name}</h3>
                <p class="price">$${parseFloat(prod.price).toFixed(2)}</p>
            </div>
            <button>Ver más</button>
        `;

            // Añade evento para mostrar el modal al hacer clic en "Ver más"
            card.querySelector("button").addEventListener("click", () => {
                mostrarModal(prod, imgs);
            });

            // Añade la tarjeta al contenedor de productos destacados
            featuredContainer.appendChild(card);
        });
    })
    .catch(err => console.error("Error:", err)); // Maneja errores de la petición

// =================== FUNCIÓN PARA MOSTRAR EL MODAL DE PRODUCTO ============
// Muestra el modal con los datos del producto y sus imágenes
function mostrarModal(prod, imgs) {
    // Guarda el producto actual y sus imágenes
    currentProduct = { ...prod, images: imgs };

    // Limpia el contenedor de imágenes del modal
    modalImages.innerHTML = "";
    if (imgs && imgs.length > 0) {
        // Si hay imágenes, las muestra todas
        imgs.forEach(img => {
            const el = document.createElement("img");
            el.src = img.url;
            modalImages.appendChild(el);
        });
    } else {
        // Si no hay imágenes, muestra una imagen por defecto
        modalImages.innerHTML = `<img src="https://via.placeholder.com/300x180?text=Sin+Imagen">`;
    }

    // Muestra los datos básicos del producto en el modal
    modalName.textContent = prod.name;
    modalPrice.textContent = `$${parseFloat(prod.price).toFixed(2)}`;
    modalDescription.textContent = prod.description || "Sin descripción";
    modalDetails.textContent = prod.details || "";

    // Llena el selector de tallas
    sizeSelect.innerHTML = "";
    if (prod.size) {
        // Si la talla viene como único valor desde la API
        let option = document.createElement("option");
        option.value = prod.size;
        option.textContent = prod.size;
        sizeSelect.appendChild(option);
    } else {
        // Si no hay talla, muestra opciones predeterminadas
        ["26", "27", "28", "29"].forEach(talla => {
            let option = document.createElement("option");
            option.value = talla;
            option.textContent = talla;
            sizeSelect.appendChild(option);
        });
    }

    // Inicializa la cantidad en 1
    quantityInput.value = 1;

    // Muestra el modal
    modal.style.display = "block";
}

// =================== EVENTOS DEL MODAL DE PRODUCTO ========================
// Evento para cerrar el modal al hacer clic en la X
modalClose.onclick = () => modal.style.display = "none";
// Evento para cerrar el modal al hacer clic fuera del contenido
window.onclick = (e) => { if (e.target === modal) modal.style.display = "none"; };

// =================== EVENTO AGREGAR AL CARRITO ============================
// Evento para agregar el producto actual al carrito
addToCartBtn.onclick = () => {
    // Si no hay producto seleccionado, no hace nada
    if (!currentProduct) return;

    // Obtiene la talla y cantidad seleccionadas
    const talla = sizeSelect.value;
    const cantidad = parseInt(quantityInput.value);

    // Validación de talla seleccionada
    if (!talla) {
        alert("Por favor selecciona una talla.");
        return;
    }
    // Validación de cantidad válida
    if (isNaN(cantidad) || cantidad < 1) {
        alert("Por favor ingresa una cantidad válida.");
        return;
    }

    // Crea el objeto del producto para el carrito
    const productoParaCarrito = {
        producto: currentProduct.name,
        categoria: currentProduct.categoria || "Hombres",
        descripcion: currentProduct.description,
        talla: talla,
        imagen: currentProduct.images && currentProduct.images.length > 0
            ? currentProduct.images[0].url
            : "https://via.placeholder.com/300x180?text=Sin+Imagen",
        precio: currentProduct.price,
        precioOferta: currentProduct.precioOferta || null,
        descuento: currentProduct.descuento || 0,
        cantidad: cantidad
    };

    // Obtiene el carrito actual del localStorage o crea uno nuevo
    let cart = JSON.parse(localStorage.getItem("carrito")) || [];

    // Busca si ya existe el mismo producto y talla en el carrito
    const existingIndex = cart.findIndex(item =>
        item.producto === productoParaCarrito.producto && item.talla === talla
    );

    // Si ya existe, suma la cantidad
    if (existingIndex !== -1) {
        cart[existingIndex].cantidad += cantidad;
    } else {
        // Si no existe, lo agrega al carrito
        cart.push(productoParaCarrito);
    }

    // Guarda el carrito actualizado en localStorage
    localStorage.setItem("carrito", JSON.stringify(cart));

    // Muestra el popup de confirmación
    crearPopUpUniversal(cantidad, currentProduct.name, talla);

    // Cierra el modal
    modal.style.display = "none";
};

// =================== POPUP UNIVERSAL DE CONFIRMACIÓN ======================
// Muestra un popup cuando se agrega un producto al carrito
function crearPopUpUniversal(cantidad, producto, talla) {
    // Selecciona el contenedor del popup
    const contenedor = document.getElementById('PopUp-Universal');
    // Determina si es "Unidad" o "Unidades"
    let palabra = cantidad > 1 ? "Unidades" : "Unidad";

    // Inserta el contenido del popup en el contenedor
    contenedor.innerHTML = `
      <div class="popup-Diseño" id="popup-registro">
          <div class="popup-Diseño-Contenido">
              <p><b> Su Producto ha sido añadido al carrito </b> </p>
              <p>${producto} - Talla ${talla} (${cantidad} ${palabra})</p>
              <button onclick="cerrarPopupUniversal()">Seguir Comprando</button>
              <button onclick=window.location.href='/carrito/carrito.html'>Ir a carrito </button>
          </div>
      </div>
  `;
}

// Función para cerrar el popup universal
function cerrarPopupUniversal() {
    const contenedor = document.getElementById("PopUp-Universal");
    contenedor.innerHTML = '';
}
// ================= FIN POPUP UNIVERSAL DE CONFIRMACIÓN ===================


// ===================== CARGA DE TESTIMONIOS DE USUARIOS ==================
// URL de la API para obtener todos los usuarios
const API_USERS = "http://jft314.ddns.net:8080/nso/api/v1/nso/user/all";
// Opciones para la petición fetch de testimonios
const requestOptionsTestimonials = { method: "GET", redirect: "follow" };
// Selecciona el contenedor donde se mostrarán los testimonios
const container = document.getElementById("testimonialsContainer");

// Array de comentarios predeterminados para los testimonios
const sampleComments = [
    "Excelente servicio, muy satisfecho.",
    "Me encantó mi compra, volveré pronto.",
    "Productos de gran calidad, recomendados.",
    "Atención al cliente impecable.",
    "Muy rápido y seguro, gracias.",
    "No puedo estar más feliz con mi pedido.",
    "Superó mis expectativas en todo sentido.",
    "La variedad de productos es impresionante.",
    "Me ayudaron a elegir el mejor producto.",
    "La experiencia de compra fue muy agradable.",
    "Recomiendo esta tienda a todos mis amigos.",
    "Los precios son muy competitivos.",
    "La entrega fue más rápida de lo esperado.",
    "El sitio web es muy fácil de usar.",
    "Me encanta la calidad de los productos.",
    "El proceso de compra fue muy sencillo.",
    "Los productos llegaron en perfectas condiciones."
];

// =================== FUNCIÓN PARA GENERAR ESTRELLAS ======================
// Devuelve una cadena de estrellas según la calificación (rating)
function generateStars(rating) {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
}

// =================== FUNCIÓN PARA RENDERIZAR TESTIMONIOS ================
// Muestra 3 testimonios aleatorios de usuarios en el contenedor
function renderTestimonials(users) {
    // Añade clase para animar la salida de los testimonios actuales
    const currentCards = container.querySelectorAll(".testimonial-card");
    currentCards.forEach(card => card.classList.add("fade-out"));

    // Espera a que termine la animación antes de cambiar el contenido
    setTimeout(() => {
        // Limpia el contenedor de testimonios
        container.innerHTML = "";
        // Selecciona 3 usuarios aleatorios
        const randomUsers = [...users].sort(() => 0.5 - Math.random()).slice(0, 3);

        // Crea una tarjeta para cada usuario seleccionado
        randomUsers.forEach(user => {
            // Construye el nombre completo del usuario
            const fullName = `${user.firstName} ${user.lastName || ""}`.trim();
            // Usa el avatar del usuario o una imagen por defecto
            const avatar = user.avatar || "https://via.placeholder.com/80x80?text=User";
            // Selecciona un comentario aleatorio
            const comment = sampleComments[Math.floor(Math.random() * sampleComments.length)];
            // Genera una calificación aleatoria entre 3 y 5 estrellas
            const rating = Math.floor(Math.random() * 3) + 3;

            // Crea el elemento de la tarjeta de testimonio
            const card = document.createElement("div");
            card.className = "testimonial-card";
            card.innerHTML = `
        <img src="${avatar}" alt="${fullName}">
        <h3>${fullName}</h3>
        <p>"${comment}"</p>
        <div class="stars">${generateStars(rating)}</div>
      `;
            // Añade la tarjeta al contenedor
            container.appendChild(card);
        });
    }, 500); // Tiempo igual a la duración de la animación fade-out
}

// =================== CARGA Y ACTUALIZACIÓN DE TESTIMONIOS ================
// Realiza la petición a la API para obtener los usuarios
fetch(API_USERS, requestOptionsTestimonials)
    .then(res => res.json()) // Convierte la respuesta a JSON
    .then(data => {
        // Verifica que la respuesta sea un array
        if (!Array.isArray(data)) return;

        // Muestra los testimonios iniciales
        renderTestimonials(data);

        // Actualiza los testimonios cada 6 segundos automáticamente
        setInterval(() => renderTestimonials(data), 6000);
    })
    .catch(err => console.error("Error cargando testimonios:", err)); // Maneja errores de la petición
// =================== FIN CARGA DE TESTIMONIOS DE USUARIOS ================