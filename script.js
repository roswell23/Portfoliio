$(function () {
  'use strict';

  // ── 1. Set Dynamic Footer Year ────────────────────────────────
  $('#footerYear').text(new Date().getFullYear());

  // ── 2. Scroll Progress Bar & Navbar Scroll Effect ─────────────
  $(window).on('scroll', function () {
    const scrollTop = $(window).scrollTop();
    const docHeight = $(document).height() - $(window).height();
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    $('#scrollProgressBar').css('width', scrollPercent + '%');

    if (scrollTop > 30) {
      $('#navbar').addClass('scrolled');
    } else {
      $('#navbar').removeClass('scrolled');
    }

    // Back to top button visibility
    if (scrollTop > 350) {
      $('#backTop').addClass('show');
    } else {
      $('#backTop').removeClass('show');
    }
  });

  // ── 3. Active Nav Link via Intersection Observer ─────────────
  const sections = $('section[id]');
  const navLinks = $('.nav-links .nav-link');

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.removeClass('active');
        const activeLink = $(`.nav-links .nav-link[href="#${entry.target.id}"]`);
        if (activeLink.length) activeLink.addClass('active');
      }
    });
  }, { rootMargin: '-30% 0px -50% 0px' });

  sections.each(function () {
    navObserver.observe(this);
  });

  // ── 4. Hamburger Menu Toggle ──────────────────────────────────
  $('#hamburger').on('click', function () {
    const $btn = $(this);
    const $navLinks = $('#navLinks');
    $navLinks.toggleClass('open');
    $btn.toggleClass('active');
  });

  // Close mobile nav menu when a link is clicked
  $('.nav-links .nav-link').on('click', function () {
    $('#navLinks').removeClass('open');
    $('#hamburger').removeClass('active');
  });

  // ── 5. Staggered Entrance Animations ─────────────────────────
  const animEls = $(
    '.stat-card, .tech-card, .project-card, .project-card-featured, .feature-box, .timeline-item, .service-card, .contact-info-card, .contact-form'
  );

  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const $target = $(entry.target);
        setTimeout(() => {
          $target.css({
            opacity: 1,
            transform: 'translateY(0)'
          });
        }, 40);
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05 });

  animEls.each(function () {
    $(this).css({
      opacity: 0,
      transform: 'translateY(24px)',
      transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
    });
    fadeObserver.observe(this);
  });

  // ── 6. Dynamic Counting Stats Animation ──────────────────────
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const $statCards = $(entry.target).find('.stat-card');
        $statCards.each(function () {
          const $num = $(this).find('.stat-num');
          const target = parseInt($num.data('target'));
          if (isNaN(target)) return;

          $({ countVal: 0 }).animate({ countVal: target }, {
            duration: 1600,
            easing: 'swing',
            step: function () {
              $num.text(Math.floor(this.countVal) + '+');
            },
            complete: function () {
              $num.text(target + '+');
            }
          });
        });
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  if ($('.stats-grid').length) {
    statsObserver.observe($('.stats-grid')[0]);
  }

  // ── 7. Contact Form Validation ────────────────────────────────
  const $form = $('#contactForm');
  const $success = $('#formSuccess');

  if ($form.length) {
    $form.on('submit', function (e) {
      e.preventDefault();
      let valid = true;

      const fields = [
        { id: 'fname', errId: 'fnameError', label: 'Full name', type: 'text' },
        { id: 'femail', errId: 'femailError', label: 'Email address', type: 'email' },
        { id: 'fsubject', errId: 'fsubjectError', label: 'Subject', type: 'text' },
        { id: 'fmessage', errId: 'fmessageError', label: 'Message', type: 'text' },
      ];

      fields.forEach(f => {
        const $el = $('#' + f.id);
        const $errEl = $('#' + f.errId);
        const val = $el.val().trim();

        $el.removeClass('error');
        $errEl.text('');

        if (!val) {
          $el.addClass('error');
          $errEl.text(`${f.label} is required.`);
          valid = false;
          return;
        }

        if (f.type === 'email') {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(val)) {
            $el.addClass('error');
            $errEl.text('Please enter a valid email address.');
            valid = false;
          }
        }

        if (f.id === 'fmessage' && val.length < 10) {
          $el.addClass('error');
          $errEl.text('Message must be at least 10 characters.');
          valid = false;
        }
      });

      if (valid) {
        const $submitBtn = $form.find('[type="submit"]');
        const originalBtnHtml = $submitBtn.html();
        $submitBtn.prop('disabled', true).text('Sending Message…');

        setTimeout(() => {
          $form[0].reset();
          $success.addClass('show');
          $submitBtn.prop('disabled', false).html(originalBtnHtml);
          setTimeout(() => $success.removeClass('show'), 6000);
        }, 1000);
      }
    });

    $form.find('input, textarea').on('input', function () {
      const $el = $(this);
      $el.removeClass('error');
      $('#' + $el.attr('id') + 'Error').text('');
    });
  }

  // Close modal when clicking close button or backdrop overlay
  $('#modalCloseBtn, #projectModal').on('click', function (e) {
    if (e.target === this || $(e.target).hasClass('modal-close')) {
      closeModal();
    }
  });

  $(document).on('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
  });
});

// ── 8. Project Modal Data & Renderer ──────────────────────────
const projectData = [
  {
    title: 'Genesis — AI Sales & Inventory System',
    tag: 'FEATURED SAAS — Project 01',
    desc: 'An AI-driven inventory management and sales optimization platform. Designed with real-time stock alerts, sales analytics dashboard, automated reports engine, customer CRM features, and predictive demand modeling.',
    tech: ['HTML5', 'CSS3', 'Bootstrap', 'JavaScript', 'Figma'],
    link: '#genesis',
    img: 'img/genesis-preview.jpg',
  },
  {
    title: 'Coffee Website (Kape Ni Ross)',
    tag: 'WEB STORE — Project 02',
    desc: 'An elegant web presentation showcasing coffee bean roasts, brewing guides, and café highlights. Designed with clean layout grids, warm visuals, and mobile responsive controls.',
    tech: ['HTML5', 'CSS3', 'Responsive Layout', 'UI Design'],
    link: 'https://kapeniross.netlify.app',
    img: 'img/kapeniross.png',
  },
  {
    title: 'To-Do List App',
    tag: 'PRODUCTIVITY — Project 03',
    desc: 'A modern task management web application built with persistent browser local storage logic. Supports real-time task creation, completion toggles, state filtering, and quick deletion.',
    tech: ['HTML5', 'CSS3', 'JavaScript', 'LocalStorage API'],
    link: 'https://todopart2.netlify.app/',
    img: 'img/image.png',
  },
  {
    title: 'Basic Calculator',
    tag: 'UTILITY — Project 04',
    desc: 'A clean web-based arithmetic calculator supporting keyboard input listeners, display overflow prevention, clear key commands, and a responsive dark theme keypad layout.',
    tech: ['HTML5', 'CSS3', 'JavaScript', 'Keyboard Events'],
    link: 'https://calculatorniross.netlify.app',
    img: 'img/basic cal.png',
  },
];

function showProjectDetail(index) {
  const p = projectData[index];
  const $modal = $('#projectModal');
  const $content = $('#modalContent');

  const techBadges = p.tech.map(t => `
    <span style="background: rgba(255,255,255,0.05); border: 1px solid var(--border-color); color: var(--text-secondary); font-family: var(--ff-title); font-size: 0.75rem; font-weight: 500; padding: 0.3rem 0.7rem; border-radius: 6px;">
      ${t}
    </span>
  `).join('');

  const actionBtn = p.link.startsWith('#')
    ? `<a href="${p.link}" onclick="closeModal()" class="btn btn-primary btn-sm">View Full Case Study Section</a>`
    : `<a href="${p.link}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:-2px; margin-right:4px;">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
        </svg>
        Launch Live Application
       </a>`;

  $content.html(`
    <img src="${p.img}" alt="${p.title}" style="width:100%; border-radius:12px; margin-bottom:1.25rem; object-fit:cover; max-height:260px; border:1px solid var(--border-color);"/>
    <span style="font-family:var(--ff-title); font-size:0.75rem; font-weight:700; color:var(--primary); letter-spacing:0.08em; text-transform:uppercase; display:block; margin-bottom:0.4rem;">
      ${p.tag}
    </span>
    <h3 style="margin:0 0 0.75rem; font-family:var(--ff-title); font-weight:700; font-size:1.45rem; color:var(--text-primary);">${p.title}</h3>
    <p style="color:var(--text-secondary); font-size:0.92rem; line-height:1.65; margin-bottom:1.25rem;">${p.desc}</p>
    <div style="display:flex; flex-wrap:wrap; gap:0.5rem; margin-bottom:1.75rem;">
      ${techBadges}
    </div>
    <div style="display:flex; gap:0.75rem;">
      ${actionBtn}
    </div>
  `);

  $modal.addClass('active').attr('aria-hidden', 'false');
  $('body').css('overflow', 'hidden');
}

function closeModal() {
  $('#projectModal').removeClass('active').attr('aria-hidden', 'true');
  $('body').css('overflow', '');
}

// ── 9. Download CV Button Handler ──────────────────────────────
function downloadCV() {
  const $btn = $('#downloadCvBtn');
  const originalHtml = $btn.html();

  $btn.html(`
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
    <span>Preparing CV Download…</span>
  `).prop('disabled', true);

  setTimeout(() => {
    $btn.html(originalHtml).prop('disabled', false);

    const cvText = `================================================================
ROSWELL CRUZ — FRONTEND DEVELOPER CV
================================================================
Location: General Trias, Cavite, Philippines
Email: cryefionacruz@gmail.com
Education: Bachelor of Science in Information Technology (BSIT)
University: Cavite State University – Tanza Campus (2023 – Present)

----------------------------------------------------------------
PROFILE SUMMARY
----------------------------------------------------------------
Aspiring Frontend Developer dedicated to building responsive, modern,
and high-performance web applications. Strong foundations in HTML5, CSS3,
JavaScript ES6+, Bootstrap, and React, combined with a passion for clean UI engineering.

----------------------------------------------------------------
TECHNICAL SKILLS & COMPETENCIES
----------------------------------------------------------------
• Frontend: HTML5, CSS3, JavaScript (ES6+), Bootstrap 5, React, Flexbox/Grid
• Programming: Java, Python
• Databases: MySQL, SQL Relational Schemas
• Tools & Workflow: Git, GitHub, VS Code, Figma UI Design

----------------------------------------------------------------
FEATURED PROJECTS
----------------------------------------------------------------
1. Genesis — AI Sales & Inventory Optimization System
   • Prototype UI design created in Figma and built using HTML5, CSS3, Bootstrap, and JavaScript.

2. Coffee Website (Kape Ni Ross) — https://kapeniross.netlify.app
   • Elegant responsive web store for coffee roasts & brewing guides.

3. To-Do List App — https://todopart2.netlify.app/
   • Productivity task manager with persistent LocalStorage API logic.

4. Basic Calculator — https://calculatorniross.netlify.app
   • Web calculator supporting keyboard shortcut listeners and responsive design.

================================================================
`;

    const blob = new Blob([cvText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Roswell_Cruz_CV.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 800);
}

// ── 10. Smooth Scroll to Top ───────────────────────────────────
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
