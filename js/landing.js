document.addEventListener('DOMContentLoaded', () => {
  const revealItems = document.querySelectorAll('.landing-reveal');
  const year = document.getElementById('currentYear');

  if (year) year.textContent = new Date().getFullYear();

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