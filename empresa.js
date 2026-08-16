(() => {
  const root = document.documentElement;
  root.classList.add('js-ready');

  const themeToggle = document.querySelector('.theme-toggle');
  const themeStorageKey = 'duo-equilibrium-theme';
  const systemTheme = window.matchMedia?.('(prefers-color-scheme: dark)');
  let storedTheme = null;
  try { storedTheme = localStorage.getItem(themeStorageKey); } catch {}

  function aplicarTema(theme, persist = false) {
    const temaAtual = theme === 'dark' ? 'dark' : 'light';
    root.dataset.theme = temaAtual;
    if (themeToggle) {
      const escuro = temaAtual === 'dark';
      themeToggle.setAttribute('aria-pressed', String(escuro));
      themeToggle.setAttribute('aria-label', escuro ? 'Ativar modo claro' : 'Ativar modo escuro');
      themeToggle.title = escuro ? 'Ativar modo claro' : 'Ativar modo escuro';
    }
    if (persist) {
      try { localStorage.setItem(themeStorageKey, temaAtual); } catch {}
    }
  }

  aplicarTema(storedTheme || (systemTheme?.matches ? 'dark' : 'light'));
  themeToggle?.addEventListener('click', () => aplicarTema(root.dataset.theme === 'dark' ? 'light' : 'dark', true));
  if (!storedTheme && systemTheme?.addEventListener) {
    systemTheme.addEventListener('change', event => aplicarTema(event.matches ? 'dark' : 'light'));
  }

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

  const revealTargets = document.querySelectorAll('.company-hero-copy, .company-hero-art, .manifesto-grid, .principles-heading, .principle-card, .founder-portrait, .founder-copy, .company-cta, .company-footer');
  revealTargets.forEach((element, index) => {
    element.dataset.reveal = element.classList.contains('company-hero-art') ? 'scale' : '';
    element.dataset.revealDelay = String(index % 4);
  });
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    }), { threshold: .14, rootMargin: '0px 0px -8% 0px' });
    revealTargets.forEach(element => revealObserver.observe(element));
  } else {
    revealTargets.forEach(element => element.classList.add('is-visible'));
  }

  const heroArt = document.querySelector('.company-hero-art');
  const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  if (heroArt && !reducedMotion) {
    const resetParallax = () => {
      heroArt.style.setProperty('--parallax-x-mid', '0px');
      heroArt.style.setProperty('--parallax-y-mid', '0px');
      heroArt.style.setProperty('--parallax-x-low', '0px');
      heroArt.style.setProperty('--parallax-y-low', '0px');
      heroArt.style.setProperty('--parallax-x-low-reverse', '0px');
      heroArt.style.setProperty('--parallax-y-low-reverse', '0px');
    };
    heroArt.addEventListener('pointermove', event => {
      const bounds = heroArt.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - .5;
      const y = (event.clientY - bounds.top) / bounds.height - .5;
      heroArt.style.setProperty('--parallax-x-mid', `${(x * 16).toFixed(2)}px`);
      heroArt.style.setProperty('--parallax-y-mid', `${(y * 16).toFixed(2)}px`);
      heroArt.style.setProperty('--parallax-x-low', `${(x * 9).toFixed(2)}px`);
      heroArt.style.setProperty('--parallax-y-low', `${(y * 9).toFixed(2)}px`);
      heroArt.style.setProperty('--parallax-x-low-reverse', `${(x * -7).toFixed(2)}px`);
      heroArt.style.setProperty('--parallax-y-low-reverse', `${(y * -7).toFixed(2)}px`);
    });
    heroArt.addEventListener('pointerleave', resetParallax);
  }

  document.querySelectorAll('.principle-card').forEach(card => {
    if (reducedMotion) return;
    card.addEventListener('pointermove', event => {
      const bounds = card.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - .5;
      const y = (event.clientY - bounds.top) / bounds.height - .5;
      card.style.setProperty('--card-tilt-x', `${(y * -5).toFixed(2)}deg`);
      card.style.setProperty('--card-tilt-y', `${(x * 5).toFixed(2)}deg`);
    });
    card.addEventListener('pointerleave', () => {
      card.style.setProperty('--card-tilt-x', '0deg');
      card.style.setProperty('--card-tilt-y', '0deg');
    });
  });

  const cursor = document.querySelector('.duo-cursor');
  const finePointer = window.matchMedia?.('(pointer: fine)').matches;
  if (cursor && finePointer) {
    root.classList.add('has-custom-cursor');
    let cursorX = -100;
    let cursorY = -100;
    let targetX = -100;
    let targetY = -100;
    let cursorFrame = null;
    const renderCursor = () => {
      if (reducedMotion) {
        cursorX = targetX;
        cursorY = targetY;
      } else {
        cursorX += (targetX - cursorX) * .2;
        cursorY += (targetY - cursorY) * .2;
      }
      cursor.style.transform = `translate3d(${cursorX - 19}px, ${cursorY - 19}px, 0)`;
      if (Math.abs(targetX - cursorX) > .1 || Math.abs(targetY - cursorY) > .1) {
        cursorFrame = requestAnimationFrame(renderCursor);
      } else {
        cursorFrame = null;
      }
    };
    window.addEventListener('pointermove', event => {
      targetX = event.clientX;
      targetY = event.clientY;
      cursor.classList.add('is-visible');
      if (cursorFrame === null) cursorFrame = requestAnimationFrame(renderCursor);
    }, { passive: true });
    window.addEventListener('blur', () => cursor.classList.remove('is-visible'));
    document.querySelectorAll('a, button, .company-hero-art, .principle-card').forEach(element => {
      element.addEventListener('pointerenter', () => cursor.classList.add('is-interactive'));
      element.addEventListener('pointerleave', () => cursor.classList.remove('is-interactive'));
    });
  }
})();
