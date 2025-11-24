document.addEventListener('DOMContentLoaded', () => {
    const carouselSlide = document.querySelector('.carousel-slide');
    const carouselImages = document.querySelectorAll('.carousel-slide img');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    const dotsContainer = document.querySelector('.carousel-dots');
    const dots = document.querySelectorAll('.dot');

    let counter = 0;
    const size = carouselImages[0].clientWidth; // Ancho de una imagen
    let autoSlideInterval;

    // Ajustar el slide inicial
    carouselSlide.style.transform = 'translateX(' + (-size * counter) + 'px)';

    // Función para actualizar los indicadores de puntos
    function updateDots() {
        dots.forEach(dot => dot.classList.remove('active'));
        dots[counter].classList.add('active');
    }

    // Navegar a la siguiente imagen
    function nextSlide() {
        if (counter >= carouselImages.length - 1) {
            counter = 0; // Vuelve al inicio
        } else {
            counter++;
        }
        carouselSlide.style.transform = 'translateX(' + (-size * counter) + 'px)';
        updateDots();
    }

    // Navegar a la imagen anterior
    function prevSlide() {
        if (counter <= 0) {
            counter = carouselImages.length - 1; // Va al final
        } else {
            counter--;
        }
        carouselSlide.style.transform = 'translateX(' + (-size * counter) + 'px)';
        updateDots();
    }

    // Función para iniciar el pase automático
    function startAutoSlide() {
        autoSlideInterval = setInterval(nextSlide, 3000); // Cambia cada 3 segundos
    }

    // Función para detener el pase automático
    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }

    // Event Listeners para botones
    nextBtn.addEventListener('click', () => {
        stopAutoSlide(); // Detiene el auto-slide al interactuar
        nextSlide();
        startAutoSlide(); // Reinicia el auto-slide
    });

    prevBtn.addEventListener('click', () => {
        stopAutoSlide(); // Detiene el auto-slide al interactuar
        prevSlide();
        startAutoSlide(); // Reinicia el auto-slide
    });

    // Event Listeners para puntos
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            stopAutoSlide(); // Detiene el auto-slide al interactuar
            counter = index;
            carouselSlide.style.transform = 'translateX(' + (-size * counter) + 'px)';
            updateDots();
            startAutoSlide(); // Reinicia el auto-slide
        });
    });

    // Iniciar el pase automático al cargar la página
    startAutoSlide();

    // Detener y reiniciar el pase automático si el usuario interactúa con el carrusel directamente
    carouselSlide.addEventListener('mouseenter', stopAutoSlide);
    carouselSlide.addEventListener('mouseleave', startAutoSlide);

    // Actualizar el tamaño del slide si la ventana cambia de tamaño
    window.addEventListener('resize', () => {
        const newSize = carouselImages[0].clientWidth;
        carouselSlide.style.transform = 'translateX(' + (-newSize * counter) + 'px)';
    });
});