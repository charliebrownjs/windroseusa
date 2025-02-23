
document.addEventListener("DOMContentLoaded", function () {
    const config = {
        images: [
            "/assets/slide/slide1.webp",
            "/assets/slide/slide2.webp",
            "/assets/slide/slide3.webp",
            "/assets/slide/slide4.webp",
            "/assets/slide/slide5.webp",
        ],
        slideContent: [
            { title: "Handyman Services", subtitle: "Professional and Reliable" },
            { title: "Quality Work", subtitle: "Satisfaction Guaranteed" },
            { title: "Expert Team", subtitle: "Years of Experience" },
            { title: "Home Repairs", subtitle: "All Services Available" },
            { title: "Best Solutions", subtitle: "For Your Home" }
        ],
        interval: 3000,
        swipeThreshold: 50
    };

    class Slideshow {
        constructor(config) {
            this.images = config.images;
            this.interval = config.interval;
            this.swipeThreshold = config.swipeThreshold;
            this.currentIndex = 0;
            this.intervalId = null;
            this.touchStartX = 0;
            this.isPaused = false;

            this.elements = {
                slide: document.getElementById("slide"),
                container: document.querySelector(".slide-container"),
                controls: document.querySelector(".slide-controls"),
                preload: document.querySelector(".preload")
            };

            this.init();
        }

        init() {
            this.createDots();
            this.preloadImages();
            this.updateSlide();
            this.bindEvents();
            this.resetInterval();
        }

        bindEvents() {
            // Touch events
            this.elements.container.addEventListener("touchstart", this.handleTouchStart.bind(this));
            this.elements.container.addEventListener("touchend", this.handleTouchEnd.bind(this));

            // Keyboard navigation
            document.addEventListener("keydown", this.handleKeydown.bind(this));

            // Button controls
            document.querySelector(".slide-prev").addEventListener("click", () => this.prevSlide());
            document.querySelector(".slide-next").addEventListener("click", () => this.nextSlide());

            // Pause on hover
            this.elements.container.addEventListener("mouseenter", () => this.pause());
            this.elements.container.addEventListener("mouseleave", () => this.resume());

            // Cleanup on page unload
            window.addEventListener("unload", () => this.cleanup());
        }

        preloadImages() {
            this.images.forEach((src) => {
                const img = new Image();
                img.onerror = () => console.error(`Failed to load image: ${src}`);
                img.src = src;
                this.elements.preload.appendChild(img);
            });
        }

        createDots() {
            this.images.forEach((_, index) => {
                const dot = document.createElement("button");
                dot.className = `slide-dot${index === 0 ? " active" : ""}`;
                dot.setAttribute("role", "tab");
                dot.setAttribute("aria-label", `Slide ${index + 1}`);
                dot.addEventListener("click", () => this.goToSlide(index));
                this.elements.controls.appendChild(dot);
            });
        }

        updateDots() {
            const dots = this.elements.controls.getElementsByClassName("slide-dot");
            Array.from(dots).forEach((dot, index) => {
                dot.classList.toggle("active", index === this.currentIndex);
            });
        }

        updateSlide() {
            this.elements.slide.style.backgroundImage = `url(${this.images[this.currentIndex]})`;
            this.elements.slide.setAttribute(
                "aria-label",
                `Imagem ${this.currentIndex + 1} de ${this.images.length}`
            );
            
            // Update slide content
            const content = config.slideContent[this.currentIndex];
            const titleElement = document.querySelector('.slide-content h1');
            const subtitleElement = document.querySelector('.slide-content p');
            
            titleElement.textContent = content.title;
            subtitleElement.textContent = content.subtitle;
            
            this.updateDots();
        }

        goToSlide(index) {
            this.currentIndex = index;
            this.updateSlide();
            this.resetInterval();
        }

        nextSlide() {
            this.currentIndex = (this.currentIndex + 1) % this.images.length;
            this.updateSlide();
            this.resetInterval();
        }

        prevSlide() {
            this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
            this.updateSlide();
            this.resetInterval();
        }

        handleTouchStart(e) {
            this.touchStartX = e.touches[0].clientX;
        }

        handleTouchEnd(e) {
            const touchEndX = e.changedTouches[0].clientX;
            const diff = this.touchStartX - touchEndX;

            if (Math.abs(diff) > this.swipeThreshold) {
                diff > 0 ? this.nextSlide() : this.prevSlide();
            }
        }

        handleKeydown(e) {
            if (e.key === "ArrowLeft") {
                this.prevSlide();
            } else if (e.key === "ArrowRight") {
                this.nextSlide();
            }
        }

        pause() {
            this.isPaused = true;
            clearInterval(this.intervalId);
        }

        resume() {
            if (this.isPaused) {
                this.isPaused = false;
                this.resetInterval();
            }
        }

        resetInterval() {
            if (!this.isPaused) {
                clearInterval(this.intervalId);
                this.intervalId = setInterval(() => this.nextSlide(), this.interval);
            }
        }

        cleanup() {
            clearInterval(this.intervalId);
        }
    }

    // Initialize slideshow
    new Slideshow(config);
});