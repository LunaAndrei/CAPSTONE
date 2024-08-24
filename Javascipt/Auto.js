let currentSlide = 0;
const slides = document.querySelectorAll('.info-slide');
const totalSlides = slides.length;

function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.remove('active');
    if (i === index) {
      slide.classList.add('active');
    }
  });
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % totalSlides;
  showSlide(currentSlide);
}

document.querySelector('.right-arrow').addEventListener('click', nextSlide);

document.querySelector('.left-arrow').addEventListener('click', () => {
  currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
  showSlide(currentSlide);
});

setInterval(nextSlide, 5000); // Change slide every 5 seconds

// Initialize the first slide as active
showSlide(currentSlide);
