//hero 
document.addEventListener('DOMContentLoaded', () => {
    const video = document.querySelector('.hero__video');
    //forzar autoplay en navegadores compatibles
    video.muted = true; // Silenciar el video para autoplay
    video.play().catch(error => {
        //mostar un fallback visual si el autoplay falla
        video.poster = 'fallback-image.jpg'; // Reemplaza con tu imagen de fallback
        video.controls = true; // Mostrar controles para que el usuario pueda reproducirlo manualmente
    });
    //reinicio seguro en caso de errores
    video.addEventListener('ended', () => {
        video.currentTime = 0;
        video.play();
    });
});
// Fin del script de hero

// Carrusel Infinito de Marcas - Nombres Unicos
document.addEventListener('DOMContentLoaded', () => {
    const track = document.querySelector('.brands-carousel-track');
    let slides = Array.from(track.children);
    const slideCount = slides.length;

    // Duplicar slides para efecto infinito
    slides.forEach(slide => track.appendChild(slide.cloneNode(true)));
    slides.forEach(slide => track.insertBefore(slide.cloneNode(true), track.firstChild));

    slides = Array.from(track.children); // actualizamos slides después de duplicar
    let currentIndex = slideCount; // empezamos en el 1er slide del set original del medio

    // Obtener ancho total de cada slide (incluye margen)
    function getSlideWidth() {
        const slide = slides[0];
        const style = window.getComputedStyle(slide);
        return slide.offsetWidth + parseFloat(style.marginLeft) + parseFloat(style.marginRight);
    }

    let slideWidth = getSlideWidth();

    // Función para mover carrusel
    function moveCarousel(index, animate = true) {
        if (!animate) {
            track.style.transition = 'none';
        } else {
            track.style.transition = 'transform 0.5s ease-in-out';
        }
        const offset = slideWidth * index;
        track.style.transform = `translateX(-${offset}px)`;

        if (!animate) {
            // Forzar repaint para que el siguiente cambio con animación funcione bien
            track.offsetHeight;
            track.style.transition = 'transform 0.5s ease-in-out';
        }
    }

    // Lógica para loop infinito
    function checkBounds() {
        if (currentIndex >= slideCount * 2) {
            // si pasamos el final, saltamos sin animación a la posición inicial
            currentIndex = slideCount;
            moveCarousel(currentIndex, false);
        } else if (currentIndex < slideCount) {
            // si retrocedemos antes del inicio, saltamos al final real
            currentIndex = slideCount * 2 - 1;
            moveCarousel(currentIndex, false);
        }
    }

    // Mover a siguiente slide con animación y luego revisar límites
    function nextSlide() {
        currentIndex++;
        moveCarousel(currentIndex);
        setTimeout(checkBounds, 600); // espera la transición antes de corregir
    }

    // Mover a slide anterior con animación y luego revisar límites
    function prevSlide() {
        currentIndex--;
        moveCarousel(currentIndex);
        setTimeout(checkBounds, 600);
    }

    // Opcional: añadir botones para controlar (ejemplo)
    // Puedes agregar botones con clases .brands-left y .brands-right y activar así:
    /*
    document.querySelector('.brands-left').addEventListener('click', prevSlide);
    document.querySelector('.brands-right').addEventListener('click', nextSlide);
    */

    // Resize handler para recalcular ancho si cambia la pantalla
    window.addEventListener('resize', () => {
        slideWidth = getSlideWidth();
        moveCarousel(currentIndex, false);
    });

    // Inicializamos posicionando en el primer slide original
    moveCarousel(currentIndex, false);

    // Si quieres autoplay automático cada 1000 milisegundos:
    setInterval(nextSlide, 1000);
});


// Script para cargar productos destacados
const API_URL = "http://jft314.ddns.net:8080/nso/api/v1/nso/product/all";
const requestOptions = { method: "GET", redirect: "follow" };

const featuredContainer = document.getElementById("featuredContainer");

// Modal elementos
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

let currentProduct = null; // Guardará el producto actual que se abrió en el modal

// Carga de productos destacados
fetch(API_URL, requestOptions)
    .then(res => res.json())
    .then(data => {
        if (!Array.isArray(data)) return;
        const destacados = data.sort(() => 0.5 - Math.random()).slice(0, 5);

        destacados.forEach(item => {
            const prod = item.products;
            const imgs = item.images;
            const firstImg = imgs && imgs.length ? imgs[0].url : "https://via.placeholder.com/300x180?text=Sin+Imagen";

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

            card.querySelector("button").addEventListener("click", () => {
                mostrarModal(prod, imgs);
            });

            featuredContainer.appendChild(card);
        });
    })
    .catch(err => console.error("Error:", err));

// Mostrar modal con datos y campos de talla/cantidad
function mostrarModal(prod, imgs) {
    currentProduct = { ...prod, images: imgs };

    // Imágenes
    modalImages.innerHTML = "";
    if (imgs && imgs.length > 0) {
        imgs.forEach(img => {
            const el = document.createElement("img");
            el.src = img.url;
            modalImages.appendChild(el);
        });
    } else {
        modalImages.innerHTML = `<img src="https://via.placeholder.com/300x180?text=Sin+Imagen">`;
    }

    // Datos básicos
    modalName.textContent = prod.name;
    modalPrice.textContent = `$${parseFloat(prod.price).toFixed(2)}`;
    modalDescription.textContent = prod.description || "Sin descripción";
    modalDetails.textContent = prod.details || "";

    // Llenar opciones de talla
    sizeSelect.innerHTML = "";
    if (prod.size) {
        // Si en la API la talla viene como único valor
        let option = document.createElement("option");
        option.value = prod.size;
        option.textContent = prod.size;
        sizeSelect.appendChild(option);
    } else {
        // Si quieres manejar tallas por catálogo se podría poner manual
        ["26", "27", "28", "29"].forEach(talla => {
            let option = document.createElement("option");
            option.value = talla;
            option.textContent = talla;
            sizeSelect.appendChild(option);
        });
    }

    quantityInput.value = 1;

    modal.style.display = "block";
}

// Evento cerrar modal
modalClose.onclick = () => modal.style.display = "none";
window.onclick = (e) => { if (e.target === modal) modal.style.display = "none"; };

// Evento agregar al carrito
addToCartBtn.onclick = () => {
    if (!currentProduct) return;

    const talla = sizeSelect.value;
    const cantidad = parseInt(quantityInput.value);

    // Validaciones
    if (!talla) {
        alert("Por favor selecciona una talla.");
        return;
    }
    if (isNaN(cantidad) || cantidad < 1) {
        alert("Por favor ingresa una cantidad válida.");
        return;
    }

    // Crear objeto para el carrito
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

    // Obtener carrito actual del localStorage
    let cart = JSON.parse(localStorage.getItem("carrito")) || [];

    // Buscar si ya existe el mismo producto y talla (comparación correcta)
    const existingIndex = cart.findIndex(item => 
        item.producto === productoParaCarrito.producto && item.talla === talla
    );

    // Si ya existe, solo aumentar cantidad
    if (existingIndex !== -1) {
        cart[existingIndex].cantidad += cantidad;
    } else {
        cart.push(productoParaCarrito);
    }

    // Guardar carrito actualizado
    localStorage.setItem("carrito", JSON.stringify(cart));

    // Mostrar popup
    crearPopUpUniversal(cantidad, currentProduct.name, talla);

    // Cerrar modal
    modal.style.display = "none";
};

// POP UP universal
function crearPopUpUniversal(cantidad, producto, talla) {
    const contenedor = document.getElementById('PopUp-Universal');
    let palabra = cantidad > 1 ? "Unidades" : "Unidad";

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

function cerrarPopupUniversal() {
    const contenedor = document.getElementById("PopUp-Universal");
    contenedor.innerHTML = '';
}
// Fin del script de productos destacados