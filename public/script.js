const toggle = document.querySelector('.nav-toggle');
const menu = document.getElementById('primary-menu');

if (toggle && menu) {
  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    menu.hidden = expanded;
  });

  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menu.hidden = true;
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// Smooth scroll for in-page anchors
const internalLinks = document.querySelectorAll('a[href^="#"]');
internalLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    const targetId = link.getAttribute('href');
    if (!targetId || targetId === '#') return;
    const target = document.querySelector(targetId);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

const carousel = document.getElementById('project-carousel');
const slides = carousel ? Array.from(carousel.querySelectorAll('[data-project]')) : [];
const dots = Array.from(document.querySelectorAll('[data-carousel-dot]'));
const prevButton = document.querySelector('[data-carousel-prev]');
const nextButton = document.querySelector('[data-carousel-next]');

if (carousel && slides.length > 0) {
  let activeIndex = 0;
  let autoRotate;
  let dragStartX = null;

  const renderCarousel = (index) => {
    activeIndex = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.classList.toggle('is-active', i === activeIndex));
    dots.forEach((dot, i) => {
      const isActive = i === activeIndex;
      dot.classList.toggle('is-active', isActive);
      dot.setAttribute('aria-selected', String(isActive));
    });
  };

  const stopAutoRotate = () => {
    if (autoRotate) window.clearInterval(autoRotate);
  };

  const startAutoRotate = () => {
    stopAutoRotate();
    autoRotate = window.setInterval(() => renderCarousel(activeIndex + 1), 5000);
  };

  const handleDragEnd = (clientX) => {
    if (dragStartX === null) return;
    const delta = clientX - dragStartX;
    carousel.classList.remove('is-dragging');
    dragStartX = null;
    if (Math.abs(delta) < 30) return;
    renderCarousel(activeIndex + (delta < 0 ? 1 : -1));
    startAutoRotate();
  };

  prevButton?.addEventListener('click', () => {
    renderCarousel(activeIndex - 1);
    startAutoRotate();
  });

  nextButton?.addEventListener('click', () => {
    renderCarousel(activeIndex + 1);
    startAutoRotate();
  });

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      renderCarousel(index);
      startAutoRotate();
    });
  });

  carousel.addEventListener('mousedown', (event) => {
    dragStartX = event.clientX;
    carousel.classList.add('is-dragging');
    stopAutoRotate();
  });

  carousel.addEventListener('mouseup', (event) => handleDragEnd(event.clientX));
  carousel.addEventListener('mouseleave', (event) => handleDragEnd(event.clientX));
  carousel.addEventListener('touchstart', (event) => {
    dragStartX = event.touches[0].clientX;
    stopAutoRotate();
  }, { passive: true });
  carousel.addEventListener('touchend', (event) => {
    const touch = event.changedTouches[0];
    handleDragEnd(touch.clientX);
  });

  carousel.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') {
      renderCarousel(activeIndex + 1);
      startAutoRotate();
    } else if (event.key === 'ArrowLeft') {
      renderCarousel(activeIndex - 1);
      startAutoRotate();
    }
  });

  renderCarousel(0);
  startAutoRotate();
}
