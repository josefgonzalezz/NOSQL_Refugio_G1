document.addEventListener('DOMContentLoaded', () => {
    const carouselSlide = document.querySelector('.carousel-slide');
    const carouselImages = document.querySelectorAll('.carousel-slide img');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    const dotsContainer = document.querySelector('.carousel-dots');
    const dots = document.querySelectorAll('.dot');

    let counter = 0;
    const size = carouselImages[0].clientWidth;
    let autoSlideInterval;

    carouselSlide.style.transform = 'translateX(' + (-size * counter) + 'px)';

    function updateDots() {
        dots.forEach(dot => dot.classList.remove('active'));
        dots[counter].classList.add('active');
    }

    function nextSlide() {
        if (counter >= carouselImages.length - 1) {
            counter = 0; 
        } else {
            counter++;
        }
        carouselSlide.style.transform = 'translateX(' + (-size * counter) + 'px)';
        updateDots();
    }

    function prevSlide() {
        if (counter <= 0) {
            counter = carouselImages.length - 1; 
        } else {
            counter--;
        }
        carouselSlide.style.transform = 'translateX(' + (-size * counter) + 'px)';
        updateDots();
    }

  
    function startAutoSlide() {
        autoSlideInterval = setInterval(nextSlide, 3000); 
    }

   
    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }

    nextBtn.addEventListener('click', () => {
        stopAutoSlide();
        nextSlide();
        startAutoSlide();
    });

    prevBtn.addEventListener('click', () => {
        stopAutoSlide(); 
        prevSlide();
        startAutoSlide();
    });

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            stopAutoSlide();
            counter = index;
            carouselSlide.style.transform = 'translateX(' + (-size * counter) + 'px)';
            updateDots();
            startAutoSlide();
        });
    });

    startAutoSlide();

    carouselSlide.addEventListener('mouseenter', stopAutoSlide);
    carouselSlide.addEventListener('mouseleave', startAutoSlide);

    window.addEventListener('resize', () => {
        const newSize = carouselImages[0].clientWidth;
        carouselSlide.style.transform = 'translateX(' + (-newSize * counter) + 'px)';
    });
});