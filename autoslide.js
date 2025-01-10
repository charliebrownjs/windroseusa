
document.addEventListener("DOMContentLoaded", function () {
    const images = [
        "/assets/slide/slide1.webp",
        "/assets/slide/slide2.webp",
        "/assets/slide/slide3.webp",
        "/assets/slide/slide4.webp",
        "/assets/slide/slide5.webp",
    ];

    const slideElement = document.getElementById("slide");
    const container = document.querySelector(".slide-container");
    const controls = document.querySelector(".slide-controls");
    let currentIndex = 0;
    let intervalId;
    let touchStartX = 0;

    // Preload images
    function preloadImages() {
        const preloadDiv = document.querySelector(".preload");
        images.forEach((src) => {
            const img = new Image();
            img.src = src;
            preloadDiv.appendChild(img);
        });
    }

    // Create dot controls
    function createDots() {
        images.forEach((_, index) => {
            const dot = document.createElement("button");
            dot.className = `slide-dot${index === 0 ? " active" : ""}`;
            dot.setAttribute("role", "tab");
            dot.setAttribute("aria-label", `Slide ${index + 1}`);
            dot.onclick = () => goToSlide(index);
            controls.appendChild(dot);
        });
    }

    function updateDots() {
        const dots = controls.getElementsByClassName("slide-dot");
        Array.from(dots).forEach((dot, index) => {
            dot.classList.toggle("active", index === currentIndex);
        });
    }

    function goToSlide(index) {
        currentIndex = index;
        updateSlide();
        resetInterval();
    }

    function updateSlide() {
        slideElement.style.backgroundImage = `url(${images[currentIndex]})`;
        slideElement.setAttribute(
            "aria-label",
            `Imagem ${currentIndex + 1} de ${images.length}`
        );
        updateDots();
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % images.length;
        updateSlide();
        resetInterval();
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        updateSlide();
        resetInterval();
    }

    function resetInterval() {
        clearInterval(intervalId);
        intervalId = setInterval(nextSlide, 3000);
    }

    // Touch events for mobile
    container.addEventListener("touchstart", (e) => {
        touchStartX = e.touches[0].clientX;
    });

    container.addEventListener("touchend", (e) => {
        const touchEndX = e.changedTouches[0].clientX;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > 50) {
            // Minimum swipe distance
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    });

    // Keyboard navigation
    document.addEventListener("keydown", (e) => {
        if (e.key === "ArrowLeft") {
            prevSlide();
        } else if (e.key === "ArrowRight") {
            nextSlide();
        }
    });

    // Initialize
    document.querySelector(".slide-prev").onclick = prevSlide;
    document.querySelector(".slide-next").onclick = nextSlide;
    createDots();
    preloadImages();
    updateSlide();
    resetInterval();
});