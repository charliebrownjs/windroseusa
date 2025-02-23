export class Slider {
    constructor(selector, config) {
        // Add error checking
        if (!selector || !config) {
            throw new Error('Slider requires both selector and configuration');
        }

        this.element = document.querySelector(selector);
        if (!this.element) {
            throw new Error(`Element not found: ${selector}`);
        }

        this.config = {
            interval: 5000,
            transitionDuration: 400,
            ...config
        };
        
        if (!this.config.images || !this.config.images.length) {
            throw new Error('No images provided in configuration');
        }

        this.currentIndex = 0;
        this.isTransitioning = false;
        this.intervalId = null;
        this.touchStartX = 0;
        this.isPaused = false;

        // Initialize immediately
        this.init();
    }

    init() {
        this.createSlides();
        this.createDots();
        this.setupEventListeners();
        this.showSlide(0);
        this.startAutoPlay();
    }

    createSlides() {
        const slidesContainer = this.element.querySelector('.slider__slides');
        
        this.config.images.forEach((src, index) => {
            const slide = document.createElement('div');
            slide.className = 'slider__slide';
            slide.style.backgroundImage = `url(${src})`;
            slidesContainer.appendChild(slide);
        });

        this.slides = Array.from(slidesContainer.children);
    }

    createDots() {
        const controls = this.element.querySelector('.slider__controls');
        
        this.config.images.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.className = 'slider__dot';
            dot.setAttribute('aria-label', `Slide ${index + 1}`);
            controls.appendChild(dot);
        });

        this.dots = Array.from(controls.children);
    }

    setupEventListeners() {
        // Navigation buttons
        this.element.querySelector('.slider__button--prev').addEventListener('click', () => this.prevSlide());
        this.element.querySelector('.slider__button--next').addEventListener('click', () => this.nextSlide());

        // Dots
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });

        // Touch events
        this.element.addEventListener('touchstart', e => this.handleTouchStart(e), { passive: true });
        this.element.addEventListener('touchend', e => this.handleTouchEnd(e));

        // Pause on hover
        this.element.addEventListener('mouseenter', () => this.pause());
        this.element.addEventListener('mouseleave', () => this.resume());

        // Keyboard navigation
        document.addEventListener('keydown', e => this.handleKeydown(e));

        // Visibility change
        document.addEventListener('visibilitychange', () => {
            document.hidden ? this.pause() : this.resume();
        });
    }

    showSlide(index) {
        if (this.isTransitioning) return;

        const content = this.config.content[index];
        const title = this.element.querySelector('.slider__title');
        const subtitle = this.element.querySelector('.slider__subtitle');

        // Update slides
        this.slides.forEach(slide => slide.classList.remove('active'));
        this.slides[index].classList.add('active');

        // Update dots
        this.dots.forEach(dot => dot.classList.remove('active'));
        this.dots[index].classList.add('active');

        // Update content
        title.textContent = content.title;
        subtitle.textContent = content.subtitle;

        this.currentIndex = index;
    }

    nextSlide() {
        this.goToSlide((this.currentIndex + 1) % this.slides.length);
    }

    prevSlide() {
        this.goToSlide((this.currentIndex - 1 + this.slides.length) % this.slides.length);
    }

    goToSlide(index) {
        if (index === this.currentIndex) return;
        
        this.isTransitioning = true;
        this.showSlide(index);
        
        setTimeout(() => {
            this.isTransitioning = false;
        }, this.config.transitionDuration);

        this.resetAutoPlay();
    }

    handleTouchStart(e) {
        this.touchStartX = e.touches[0].clientX;
    }

    handleTouchEnd(e) {
        const touchEndX = e.changedTouches[0].clientX;
        const diff = this.touchStartX - touchEndX;

        if (Math.abs(diff) > 50) {
            diff > 0 ? this.nextSlide() : this.prevSlide();
        }
    }

    handleKeydown(e) {
        if (e.key === 'ArrowLeft') {
            this.prevSlide();
        } else if (e.key === 'ArrowRight') {
            this.nextSlide();
        }
    }

    startAutoPlay() {
        this.intervalId = setInterval(() => {
            if (!this.isPaused) {
                this.nextSlide();
            }
        }, this.config.interval);
    }

    resetAutoPlay() {
        clearInterval(this.intervalId);
        this.startAutoPlay();
    }

    pause() {
        this.isPaused = true;
    }

    resume() {
        this.isPaused = false;
    }
}