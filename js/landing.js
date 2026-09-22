document.addEventListener('DOMContentLoaded', () => {
  const revealItems = document.querySelectorAll('.landing-reveal');
  const year = document.getElementById('currentYear');
  const menuToggle = document.querySelector('.menu-toggle');
  const siteMenu = document.getElementById('site-menu');
  const header = document.querySelector('.site-header');

  const updateHeaderState = () => {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 5);
  };

  if (year) year.textContent = new Date().getFullYear();
  updateHeaderState();
  window.addEventListener('scroll', updateHeaderState, { passive: true });

  if (menuToggle && siteMenu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = siteMenu.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    siteMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        siteMenu.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  if (!('IntersectionObserver' in window)) {
    revealItems.forEach((item) => item.classList.add('is-visible'));
    return;
  }

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.14 });

  revealItems.forEach((item) => revealObserver.observe(item));
});