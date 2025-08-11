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
//opciones para la peticion fetch (GET por defecto, pero lo indicamos igual)
const requestOptions = {
    method: 'GET',
    redirect: "follow"
};

// URL de la API que devuelve todos los productos en formato JSON
const API_URL = 'http://jft314.ddns.net:8080/nso/api/v1/nso/product/all'; 

/**
 * función que  obtiene los productos desde el backend y los muestra en la página
 */
function cargarProductos(){
    fetch(API_URL, requestOptions) // hacemos la peticion GET a la API
        .then(response => {
            if(!response.ok){
                throw new Error("Error en la solicitud: " + response.status);
            }
            return response.json(); // convertimos la respuesta a JSON
        })
        .then(data =>{
            //seleccionamos el contenedor donde iran las cards
            const container = document.getElementById('cardContainer');
            //validamos que data sea un array
            if(Array.isArray(data)){
                //recorremos cada producto en el array
                data.forEach(product => {
                    //creamos el div que sera la card
                    const card = document.createElement('div');
                    card.className = 'card'; //asignamos la clase css

                    //obtenemos las propiedades del objecto (adaptar segun la API)
                    let productDescription = product.description || 'Sin descripción disponible';
                    //insertamos el contenido HTML de la card
                    card.innerHTML = `
                        <h3>${product.name}</h3>
                        <p class="price">${product.price}</p>
                        <p>${product.description}</p>
                    `;
                    //agregamos la card al contenedor
                    container.appendChild(card);
                });
            }else{
                //si no es  un array, mostramos un mensaje de error
                container.textContent = 'No se encontraron productos.';
            }
        })
        .catch(error => {
            console.error("Error al cargar productos:", error);
            document.getElementById('cardContainer').textContent = 'Error al cargar productos.';
        });
}
// Llamamos a la función para cargar los productos al cargar la página
cargarProductos();
// Fin del script de productos destacados