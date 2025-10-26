/* ------------------------------------------------------------------
   LUMO PORTFOLIO – assets/js/script.js
   ---------------------------------------------------------------
   Functionality covered:
   1️⃣ Header becomes opaque after scrolling past the hero.
   2️⃣ Navigation links scroll smoothly to their targets.
   3️⃣ Portfolio cards open a modal; the modal can be closed.
   4️⃣ Contact form posts to Web3Forms and shows a status message.
   ------------------------------------------------------------------ */

/* -------------------- 1️⃣ HEADER SCROLL EFFECT -------------------- */
(function () {
  const header = document.getElementById('site-header');

  // Add / remove the .scrolled class based on scroll position
  function onScroll() {
    if (window.scrollY > 80) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  // Run on load + on every scroll event (throttled for performance)
  window.addEventListener('load', onScroll);
  window.addEventListener('scroll', onScroll);
})();

/* -------------------- 2️⃣ SMOOTH SCROLL LINKS -------------------- */
(function () {
  // For browsers that ignore CSS `scroll-behavior: smooth`
  const links = document.querySelectorAll('a[href^="#"]:not([href="#"])');

  links.forEach(link => {
    link.addEventListener('click', function (e) {
      const targetID = this.getAttribute('href').substring(1);
      const targetEl = document.getElementById(targetID);
      if (!targetEl) return; // safety

      e.preventDefault();
      targetEl.scrollIntoView({ behavior: 'smooth' });
    });
  });
})();

/* -------------------- 3️⃣ PORTFOLIO MODALS -------------------- */
(function () {
  // Open modal when a portfolio card is clicked
  const cards = document.querySelectorAll('.card[data-modal]');
  const modals = document.querySelectorAll('.modal');

  cards.forEach(card => {
    card.addEventListener('click', () => {
      const modalID = card.dataset.modal;
      const modal = document.getElementById(modalID);
      if (modal) {
        modal.style.display = 'flex';
      }
    });
  });

  // Close modal when clicking the × or outside the content area
  modals.forEach(modal => {
    const closeBtn = modal.querySelector('.close');

    // Click on ×
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
      });
    }

    // Click outside the modal‑content
    modal.addEventListener('click', e => {
      if (e.target === modal) {
        modal.style.display = 'none';
      }
    });
  });
})();

/* -------------------- 4️⃣ CONTACT FORM SUBMISSION -------------------- */
(function () {
  const form = document.getElementById('contact-form');
  const statusEl = document.getElementById('form-status');

  if (!form) return; // safety – the page always has the form, but guard anyway

  form.addEventListener('submit', async e => {
    e.preventDefault(); // stop normal POST navigation

    // Show a temporary “sending…” message
    statusEl.textContent = 'Sending…';
    statusEl.style.color = '#fff';

    // Gather form data – Web3Forms expects URL‑encoded payload
    const formData = new FormData(form);
    const payload = new URLSearchParams(formData);

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: payload
      });

      const result = await response.json();

      if (response.ok && result.success) {
        statusEl.textContent = '✅ Message sent! I’ll get back to you soon.';
        statusEl.style.color = '#4caf50'; // green
        form.reset(); // clear fields
      } else {
        // Web3Forms returns an error object; fall back to generic text
        const errMsg = result?.error || 'Something went wrong. Please try again later.';
        statusEl.textContent = `❌ ${errMsg}`;
        statusEl.style.color = '#ff5252'; // red
      }
    } catch (err) {
      console.error('Form submission error:', err);
      statusEl.textContent = '❌ Network error – please check your connection.';
      statusEl.style.color = '#ff5252';
    }
  });
})();