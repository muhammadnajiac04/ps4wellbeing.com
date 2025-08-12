// Mobile menu toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
        const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true' || false;
        mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
        navLinks.classList.toggle('active');
    });

    // Close menu when a link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
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
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Header background on scroll
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Fade-in animation on scroll
const animatedObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            animatedObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('[data-animated]').forEach(el => {
    animatedObserver.observe(el);
});

// Animated counter for statistics
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
        const target = parseInt(counter.textContent);
        const increment = target / 100;
        let current = 0;

        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.ceil(current) + '%';
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target + '%';
            }
        };

        updateCounter();
    });
}

const researchSection = document.querySelector('.research');
const researchObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            researchObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

if (researchSection) {
    researchObserver.observe(researchSection);
}

// Mobile Carousel functionality
let currentSlide = 0;
const totalSlides = 4;
const carouselContainer = document.getElementById('carouselContainer');
const indicators = document.querySelectorAll('.indicator');
let autoPlayInterval;
let isAutoPlaying = true;

function startAutoPlay() {
    if (window.innerWidth <= 768) {
        autoPlayInterval = setInterval(() => {
            if (isAutoPlaying) {
                nextSlide();
            }
        }, 3000);
    }
}

function stopAutoPlay() {
    clearInterval(autoPlayInterval);
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateCarousel();
}

function goToSlide(slideIndex) {
    currentSlide = slideIndex;
    updateCarousel();
    isAutoPlaying = false;
    stopAutoPlay();
    setTimeout(() => {
        isAutoPlaying = true;
        startAutoPlay();
    }, 5000);
}

function updateCarousel() {
    if (carouselContainer) {
        const translateX = -currentSlide * 25;
        carouselContainer.style.transform = `translateX(${translateX}%)`;
        
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentSlide);
        });
    }
}

// Touch/swipe functionality
let startX = 0;
let startY = 0;
let isDragging = false;

if (carouselContainer) {
    carouselContainer.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        isDragging = true;
        isAutoPlaying = false;
        stopAutoPlay();
    });

    carouselContainer.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
    });

    carouselContainer.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        isDragging = false;
        
        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        const diffX = startX - endX;
        const diffY = startY - endY;
        
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
            if (diffX > 0) {
                currentSlide = (currentSlide + 1) % totalSlides;
            } else {
                currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            }
            updateCarousel();
        }
        
        setTimeout(() => {
            isAutoPlaying = true;
            startAutoPlay();
        }, 3000);
    });
}

// Handle window resize
window.addEventListener('resize', () => {
    stopAutoPlay();
    if (window.innerWidth <= 768) {
        startAutoPlay();
    }
});

// Initialize carousel
if (window.innerWidth <= 768) {
    startAutoPlay();
}

// Pause auto-play when page is not visible
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        stopAutoPlay();
    } else if (window.innerWidth <= 768) {
        startAutoPlay();
    }
});