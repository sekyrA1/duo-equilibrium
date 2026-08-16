(() => {
  const progress = document.querySelector('.company-progress');
  const updateProgress = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
  };
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  const links = [...document.querySelectorAll('.company-nav-link[href^="#"]')];
  const sections = links.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
  const activate = (sectionId) => links.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${sectionId}`));
  const observer = new IntersectionObserver(entries => {
    const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (visible) activate(visible.target.id);
  }, { rootMargin: '-32% 0px -55% 0px', threshold: [0.1, 0.35, 0.7] });
  sections.forEach(section => observer.observe(section));
})();
