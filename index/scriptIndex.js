// 1. Seleccionamos elementos clave
const track = document.querySelector('.carousel__track');
const slides = Array.from(track.children);
const prevButton = document.querySelector('.carousel__button--prev');
const nextButton = document.querySelector('.carousel__button--next');

// 2. Calculamos el ancho de cada slide (incluye margen derecho)
const slideWidth = slides[0].getBoundingClientRect().width +
    parseFloat(getComputedStyle(slides[0]).marginRight);

// 3. Función para mover la pista al índice dado
function moveToSlide(index) {
    const offset = slideWidth * index;
    track.style.transform = `translateX(-${offset}px)`;
}

// 4. Índice de la slide actualmente visible
let currentIndex = 0;

// 5. Manejar clic en “Siguiente” con loop
nextButton.addEventListener('click', () => {
    // (currentIndex + 1) modulo total de slides → vuelve a 0 al pasar el último
    currentIndex = (currentIndex + 1) % slides.length;
    moveToSlide(currentIndex);
});

// 6. Manejar clic en “Anterior” con loop
prevButton.addEventListener('click', () => {
    // (currentIndex - 1 + total) modulo total → va al último si estamos en 0
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    moveToSlide(currentIndex);
});

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
