// AI Jungle — Main JS (minimal)

// Mobile nav toggle
const toggle = document.getElementById('navToggle');
const links = document.getElementById('navLinks');

toggle.addEventListener('click', () => {
  links.classList.toggle('active');
});

// Close nav on link click
links.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => links.classList.remove('active'));
});

// Scroll animations (intersection observer)
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger animation
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, i * 80);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.service-card, .content-card, .stat-card').forEach(el => {
    observer.observe(el);
  });
}

// Nav background on scroll
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    nav.style.background = 'rgba(10, 15, 13, 0.95)';
  } else {
    nav.style.background = 'rgba(10, 15, 13, 0.85)';
  }
}, { passive: true });
