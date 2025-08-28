document.addEventListener('DOMContentLoaded', () => {

    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
            mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
            navLinks.classList.toggle('active');
        });

        // Close menu when a link is clicked
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    mobileMenuBtn.setAttribute('aria-expanded', 'false');
                }
            });
        });
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Header background on scroll
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // Fade-in animation on scroll
    const animatedElements = document.querySelectorAll('[data-animated]');
    if (animatedElements.length > 0) {
        const animatedObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    animatedObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        animatedElements.forEach(el => {
            animatedObserver.observe(el);
        });
    }

    // Animated counter for statistics
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        counters.forEach(counter => {
            const target = parseInt(counter.textContent, 10);
            counter.textContent = '0%'; // Start from 0
            const increment = target / 100;
            let current = 0;

            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.textContent = Math.ceil(current) + '%';
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target + '%';
                }
            };
            updateCounter();
        });
    }

// Replace it with this updated code
const researchGrid = document.querySelector('.research-grid'); // <-- Changed this line
if (researchGrid) {                                            // <-- Changed this line
    const researchObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 }); // <-- Lowered threshold for a quicker trigger

    researchObserver.observe(researchGrid); // <-- Changed this line
}
    // Mobile Carousel functionality
    const carouselContainer = document.getElementById('carouselContainer');
    const indicatorsContainer = document.getElementById('indicators');
    const gridCards = document.querySelectorAll('.detailed-services-grid .detailed-service-card');

    if (carouselContainer && indicatorsContainer && gridCards.length > 0) {
        // Populate carousel from grid cards
        gridCards.forEach((card, index) => {
            const slide = document.createElement('div');
            slide.classList.add('carousel-slide');
            slide.innerHTML = card.outerHTML;
            carouselContainer.appendChild(slide);

            const indicator = document.createElement('div');
            indicator.classList.add('indicator');
            if (index === 0) indicator.classList.add('active');
            indicator.onclick = () => goToSlide(index);
            indicatorsContainer.appendChild(indicator);
        });
        
        const slides = carouselContainer.querySelectorAll('.carousel-slide');
        const indicators = indicatorsContainer.querySelectorAll('.indicator');
        const totalSlides = slides.length;
        let currentSlide = 0;
        let autoPlayInterval;
        let startX = 0;

        const updateCarousel = () => {
            carouselContainer.style.transform = `translateX(-${currentSlide * 100}%)`;
            indicators.forEach((indicator, index) => {
                indicator.classList.toggle('active', index === currentSlide);
            });
        };

        const nextSlide = () => {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateCarousel();
        };

        const startAutoPlay = () => {
            stopAutoPlay();
            if (window.innerWidth <= 768) {
                autoPlayInterval = setInterval(nextSlide, 3000);
            }
        };

        const stopAutoPlay = () => {
            clearInterval(autoPlayInterval);
        };

        const goToSlide = (slideIndex) => {
            stopAutoPlay();
            currentSlide = slideIndex;
            updateCarousel();
            setTimeout(startAutoPlay, 5000); // Resume autoplay after manual interaction
        };

        // Touch/swipe functionality
        carouselContainer.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            stopAutoPlay();
        });

        carouselContainer.addEventListener('touchend', (e) => {
            const endX = e.changedTouches[0].clientX;
            const diffX = startX - endX;
            if (Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    // Swiped left
                    currentSlide = (currentSlide + 1) % totalSlides;
                } else {
                    // Swiped right
                    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
                }
                updateCarousel();
            }
            setTimeout(startAutoPlay, 3000);
        });

        window.addEventListener('resize', startAutoPlay);
        document.addEventListener('visibilitychange', () => {
            document.hidden ? stopAutoPlay() : startAutoPlay();
        });

        startAutoPlay();
    }
});
