/* ===================================================
   BORTEX BORDADOS JUCHITÁN — script.js
   Responsive Menu + Quoter Logic + Form Validation
   =================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Page Loader ──────────────────────────────── */
  const loader = document.querySelector('.page-loader');
  if (loader) {
    window.addEventListener('load', () => {
      loader.classList.add('hidden');
    });
    // Fallback: hide after 2s
    setTimeout(() => loader?.classList.add('hidden'), 2000);
  }

  /* ── Responsive Hamburger Menu ────────────────── */
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');
  const body = document.body;

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
      body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on nav link click
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        body.style.overflow = '';
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !mobileNav.contains(e.target)) {
        mobileNav.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        body.style.overflow = '';
      }
    });
  }

  /* ── Active Nav Link ──────────────────────────── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.site-nav a, .mobile-nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ── Scroll Reveal ────────────────────────────── */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  /* ── Cotizador (Quoter) Logic ─────────────────── */
  const categorySelect = document.getElementById('categoria');
  const subUniformes = document.getElementById('sub-uniformes');
  const subRopa = document.getElementById('sub-ropa');
  const subBlancos = document.getElementById('sub-blancos');
  const subLogotipos = document.getElementById('sub-logotipos');
  const subTrad = document.getElementById('sub-tradicional');
  const ubicacionGroup = document.getElementById('ubicacion-group');

  const allSubs = [subUniformes, subRopa, subBlancos, subLogotipos, subTrad, ubicacionGroup];

  function hideAllSubs() {
    allSubs.forEach(sub => sub && sub.classList.remove('visible'));
  }

  if (categorySelect) {
    categorySelect.addEventListener('change', () => {
      hideAllSubs();
      const val = categorySelect.value;

      if (val === 'uniformes' && subUniformes) subUniformes.classList.add('visible');
      if (val === 'ropa' && subRopa) {
        subRopa.classList.add('visible');
        if (ubicacionGroup) ubicacionGroup.classList.add('visible');
      }
      if (val === 'blancos' && subBlancos) subBlancos.classList.add('visible');
      if (val === 'logotipos' && subLogotipos) subLogotipos.classList.add('visible');
      if (val === 'tradicional' && subTrad) subTrad.classList.add('visible');
    });
  }

  /* ── Form Validation & Success ────────────────── */
  const quoteForm = document.getElementById('quote-form');
  const formSuccess = document.getElementById('form-success');

  if (quoteForm) {
    quoteForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Basic validation
      let valid = true;
      const required = quoteForm.querySelectorAll('[required]');

      required.forEach(field => {
        field.style.borderColor = '';
        if (!field.value.trim()) {
          field.style.borderColor = 'var(--red)';
          valid = false;
        }
      });

      if (!valid) {
        const firstError = quoteForm.querySelector('[required][style*="red"]');
        firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      // Email validation
      const emailField = quoteForm.querySelector('[type="email"]');
      if (emailField && emailField.value) {
        const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRx.test(emailField.value)) {
          emailField.style.borderColor = 'var(--red)';
          emailField.scrollIntoView({ behavior: 'smooth', block: 'center' });
          return;
        }
      }

      // Submit to Formspree via fetch
      const submitBtn = quoteForm.querySelector('[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;

      try {
        const response = await fetch(quoteForm.action, {
          method: 'POST',
          body: new FormData(quoteForm),
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          // Show success
          quoteForm.style.opacity = '0';
          quoteForm.style.transition = 'opacity .3s ease';
          setTimeout(() => {
            quoteForm.style.display = 'none';
            if (formSuccess) {
              formSuccess.style.display = 'block';
              formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }, 300);
        } else {
          alert('Hubo un error al enviar el formulario. Por favor inténtalo de nuevo.');
          if (submitBtn) submitBtn.disabled = false;
        }
      } catch (err) {
        alert('Error de conexión. Verifica tu internet e inténtalo de nuevo.');
        if (submitBtn) submitBtn.disabled = false;
      }
    });

    // Clear error styling on input
    quoteForm.querySelectorAll('input, select, textarea').forEach(field => {
      field.addEventListener('input', () => {
        field.style.borderColor = '';
      });
    });
  }

  /* ── File Upload Label ────────────────────────── */
  const fileInput = document.getElementById('archivo');
  const fileLabel = document.getElementById('file-label-text');

  if (fileInput && fileLabel) {
    fileInput.addEventListener('change', () => {
      const file = fileInput.files[0];
      fileLabel.textContent = file ? file.name : 'Adjuntar diseño o logo (PNG, AI, PDF)';
    });
  }

  /* ── Header shadow on scroll ──────────────────── */
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.style.boxShadow = window.scrollY > 10
        ? '0 4px 20px rgba(0,0,0,.12)'
        : '0 2px 12px rgba(0,0,0,.07)';
    }, { passive: true });
  }

  /* ── Smooth counter animation ─────────────────── */
  function animateCounter(el, target, duration = 1500) {
    let start = 0;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target).toLocaleString();
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target || '0', 10);
        animateCounter(el, target);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));

  /* ── Footer: dynamic year (year only, no time/date) ── */
  const yearEl = document.getElementById('current-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});
