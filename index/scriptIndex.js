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
