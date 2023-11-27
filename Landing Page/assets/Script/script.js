const carouselContents = document.querySelectorAll('.carousel-content');

let currentIndex = 0;

function showContent(index) {
    carouselContents.forEach((content, i) => {
        if (i === index) {
            content.classList.remove('inactive');
            content.classList.add('active');
        } else {
            content.classList.remove('active');
            content.classList.add('inactive');
        }
    });
}

function nextSlide() {
    currentIndex = (currentIndex + 1) % carouselContents.length;
    showContent(currentIndex);
}

function prevSlide() {
    currentIndex = (currentIndex - 1 + carouselContents.length) % carouselContents.length;
    showContent(currentIndex);
}

setInterval(nextSlide, 15000);
