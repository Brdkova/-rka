// Upravená část pro Slider (bod 6)
function moveSlider() {
    const s = document.getElementById('testimonial-slider');
    if (!s) return;
    const slides = document.querySelectorAll('.testimonial-slide');
    if (slides.length === 0) return; // Ochrana proti chybě

    const isMob = window.innerWidth <= 768;
    const maxIndex = isMob ? slides.length - 1 : slides.length - 2;

    currentSlide++;
    if (currentSlide > maxIndex) {
        currentSlide = 0; // Restart na začátek
    }

    const moveAmount = isMob ? 100 : 51.5; 
    s.style.transform = `translateX(-${currentSlide * moveAmount}%)`;
}