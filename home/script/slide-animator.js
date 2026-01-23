const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
    });
}, { threshold: 0.1 });

document.querySelectorAll('section').forEach(s => observer.observe(s));

// Nav Scroll Effect
window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    window.scrollY > 50 ? nav.classList.add('scrolled') : nav.classList.remove('scrolled');
});

// Parallax effect on hero for that terminal feel
document.addEventListener('mousemove', (e) => {
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
        const moveY = (e.clientY - window.innerHeight / 2) * 0.01;
        heroContent.style.transform = `translate(${moveX}px, ${moveY}px)`;
    }
});

let currentSlide = 0;
let totalSlides = 0;
const wrapper = document.getElementById('projectWrapper');

function updateSlider() {
    wrapper.style.transform = `translateX(-${currentSlide * 100}%)`;

    document.querySelectorAll(".project-dot").forEach((dot, index) => {
        dot.classList.toggle("active", index === currentSlide);
    });
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateSlider();
}

function goToSlide(index) {
    currentSlide = index;
    updateSlider();
    resetTimer(); // Reset auto-play when user clicks
}

let slideTimer = setInterval(nextSlide, 5000);

function resetTimer() {
    clearInterval(slideTimer);
    slideTimer = setInterval(nextSlide, 5000);
}

let currentArticlePage = 0;
const articleWrapper = document.getElementById('articleWrapper');
const articleDots = document.querySelectorAll('#articleDots .article-dot');

function goToArticleSlide(pageIndex) {
    currentArticlePage = pageIndex;

    // We move by 50% because we are showing 4 out of 6 items
    // This calculation ensures the last items align to the right
    const moveAmount = pageIndex === 0 ? 0 : 50;
    articleWrapper.style.transform = `translateX(-${moveAmount}%)`;

    // Update dots
    articleDots.forEach((dot, index) => {
        dot.classList.toggle('active', index === pageIndex);
    });
}