// ============================================================
//  ROSWELL CRUZ — E-Portfolio JavaScript (jQuery Integrated)
//  jQuery & DOM Interaction Logic:
//   1. Dynamic scroll indicators and active section tracking (Intersection Observer)
//   2. Sticky navbar scroll behavior
//   3. Responsive stats counting animation
//   4. Mobile hamburger toggle animation
//   5. Staggered reveal entry states on page scroll
//   6. Skills progress animation triggered on view
//   7. Details project modal dynamically rendered
//   8. User contact form validation and alerts
//   9. CV preparation and local file download
//  10. Smooth back-to-top transition
// ============================================================

$(function () {

  // ── Set Dynamic Footer Year ────────────────────────────────
  $('#footerYear').text(new Date().getFullYear());

  // ── Navbar Scroll Behavior ─────────────────────────────────
  $(window).on('scroll', function () {
    if ($(window).scrollTop() > 30) {
      $('#navbar').addClass('scrolled');
    } else {
      $('#navbar').removeClass('scrolled');
    }
  });

  // ── Active nav link via Intersection Observer ─────────────
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
  }, { rootMargin: '-40% 0px -40% 0px' });

  sections.each(function () {
    navObserver.observe(this);
  });

  // ── Hamburger Menu Toggle ──────────────────────────────────
  $('#hamburger').on('click', function () {
    const $btn = $(this);
    const $navLinks = $('#navLinks');
    $navLinks.toggleClass('open');
    $btn.toggleClass('active');

    // Animate hamburger spans
    const $spans = $btn.find('span');
    if ($navLinks.hasClass('open')) {
      $spans.eq(0).css('transform', 'translateY(7px) rotate(45deg)');
      $spans.eq(1).css('opacity', '0');
      $spans.eq(2).css('transform', 'translateY(-7px) rotate(-45deg)');
    } else {
      $spans.eq(0).css('transform', '');
      $spans.eq(1).css('opacity', '');
      $spans.eq(2).css('transform', '');
    }
  });

  // Close nav on link click
  $('.nav-links .nav-link').on('click', function () {
    $('#navLinks').removeClass('open');
    $('#hamburger').removeClass('active');
    $('#hamburger span').css({ transform: '', opacity: '' });
  });

  // ── Skills bar animation on scroll ────────────────────────
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const $fill = $(entry.target);
        const width = $fill.data('width') || 0;
        $fill.css('width', width + '%');
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  $('.skill-fill').each(function () {
    skillObserver.observe(this);
  });

  // ── Staggered Entrance Animations ─────────────────────────
  const animEls = $('.skill-card, .project-card, .timeline-item, .contact-item, .detail-card');

  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const $target = $(entry.target);
        setTimeout(() => {
          $target.css({
            opacity: 1,
            transform: 'translateY(0)'
          });
        }, i * 65);
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  animEls.each(function () {
    $(this).css({
      opacity: 0,
      transform: 'translateY(30px)',
      transition: 'opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)'
    });
    fadeObserver.observe(this);
  });

  // ── Dynamic Counting Stats Animation ──────────────────────
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const $statCards = $(entry.target).find('.stat-card');
        $statCards.each(function () {
          const $num = $(this).find('.stat-num');
          const target = parseInt($num.data('target'));
          if (isNaN(target)) return; // skip CvSU card

          $({ countVal: 0 }).animate({ countVal: target }, {
            duration: 1800,
            easing: 'swing',
            step: function () {
              if (target === 100) {
                $num.text(Math.floor(this.countVal) + '%');
              } else {
                $num.text(Math.floor(this.countVal) + '+');
              }
            },
            complete: function () {
              if (target === 100) {
                $num.text(target + '%');
              } else {
                $num.text(target + '+');
              }
            }
          });
        });
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  if ($('.hero-stats').length) {
    statsObserver.observe($('.hero-stats')[0]);
  }

  // ── Back-to-Top Button Scroll Tracker ─────────────────────
  $(window).on('scroll', function () {
    if ($(window).scrollTop() > 400) {
      $('#backTop').addClass('show');
    } else {
      $('#backTop').removeClass('show');
    }
  });

  // ── Contact Form Validation ────────────────────────────────
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
        $submitBtn.prop('disabled', true).text('Sending…');

        setTimeout(() => {
          $form[0].reset();
          $success.addClass('show');
          $submitBtn.prop('disabled', false).text('Send Message');
          setTimeout(() => $success.removeClass('show'), 5000);
        }, 1200);
      }
    });

    // Clear error message on typing
    $form.find('input, textarea').on('input', function () {
      const $el = $(this);
      $el.removeClass('error');
      $('#' + $el.attr('id') + 'Error').text('');
    });
  }
});

// ── Project Modal Data & Dynamic View Render ───────────────────
const projects = [
  {
    title: 'Basic Calculator',
    tag: 'CALC — Project 01',
    desc: 'A clean, functional web-based calculator featuring arithmetic operations, keyboard support, and a modern dark-themed interface. Built with vanilla HTML, CSS, and JavaScript.',
    tech: ['HTML5', 'CSS3', 'JavaScript', 'Responsive Design'],
    link: 'https://calculatorniross.netlify.app',
    img: 'https://wellportfolio.netlify.app/img/basic cal.png',
  },
  {
    title: 'Coffee Website',
    tag: 'KAPE — Project 02',
    desc: 'An elegant, immersive website showcasing coffee varieties, brewing tips, and a modern café aesthetic. Features smooth scroll animations and a fully responsive layout.',
    tech: ['HTML5', 'CSS3', 'Responsive Design', 'Animations'],
    link: 'https://kapeniross.netlify.app',
    img: 'https://wellportfolio.netlify.app/img/kapeniross.png',
  },
  {
    title: 'To-Do List App',
    tag: 'TODO — Project 03',
    desc: 'A modern task management application with local storage persistence. Users can add, complete, and delete tasks — all saved between sessions. Clean, minimal UI with smooth interactions.',
    tech: ['HTML5', 'CSS3', 'JavaScript', 'LocalStorage API'],
    link: 'https://todopart2.netlify.app/',
    img: 'https://wellportfolio.netlify.app/img/image.png',
  },
];

function showProjectDetail(index) {
  const p = projects[index];
  const $modal = $('#projectModal');
  const $content = $('#modalContent');

  const techBadges = p.tech.map(t => `
    <span style="background:rgba(255,255,255,0.03); border:1px solid #334155; color:#cbd5e1; font-family:'Outfit'; font-size:0.75rem; font-weight:500; padding:0.25rem 0.65rem; border-radius:6px;">
      ${t}
    </span>
  `).join('');

  $content.html(`
    <img src="${p.img}" alt="${p.title}"
      style="width:100%; border-radius:8px; margin-bottom:1.25rem; object-fit:cover; max-height:220px; border:1px solid #334155;"/>
    <span style="font-family:'Outfit'; font-size:0.72rem; font-weight:600; color:#64748b; letter-spacing:0.08em; text-transform:uppercase; display:block; margin-bottom:0.35rem;">
      ${p.tag}
    </span>
    <h3 style="margin:0 0 0.65rem; font-family:'Outfit'; font-weight:600; font-size:1.4rem; color:#f8fafc;">${p.title}</h3>
    <p style="color:#cbd5e1; font-size:0.88rem; line-height:1.6; margin-bottom:1.25rem;">${p.desc}</p>
    <div style="display:flex; flex-wrap:wrap; gap:0.4rem; margin-bottom:1.75rem;">
      ${techBadges}
    </div>
    <a href="${p.link}" target="_blank" class="btn btn-primary btn-sm">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:-1px;">
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
        <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
      </svg>
      View Live Project
    </a>
  `);

  $modal.addClass('active');
  $('body').css('overflow', 'hidden');
}

function closeModal() {
  $('#projectModal').removeClass('active');
  $('body').css('overflow', '');
}

// ── Download CV Button Handler ──────────────────────────────
function downloadCV() {
  const $btn = $('#downloadCvBtn');
  const original = $btn.html();

  $btn.html(`
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
    Preparing CV…
  `).prop('disabled', true);

  setTimeout(() => {
    $btn.html(original).prop('disabled', false);

    const cvContent = `ROSWELL CRUZ
Frontend Developer
General Trias, Cavite, Philippines
Email: cryefionacruz@gmail.com
Portfolio: https://wellportfolio.netlify.app/

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EDUCATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Bachelor of Science in Information Technology
Cavite State University – Tanza Campus
2023 – Present

Senior High School – ICT Track
Tanza National Trade School
2022 – 2023

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SKILLS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
HTML5, CSS3, JavaScript, Bootstrap, Python, Java
Responsive Design, DOM Manipulation, Git, Netlify

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PROJECTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Basic Calculator     — https://calculatorniross.netlify.app
Coffee Website       — https://kapeniross.netlify.app
To-Do List App       — https://todopart2.netlify.app/
`;

    const blob = new Blob([cvContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Roswell_Cruz_CV.txt';
    a.click();
    URL.revokeObjectURL(url);
  }, 900);
}

// ── Back-to-Top Click Handler ────────────────────────────────
function scrollToTop() {
  $('html, body').animate({ scrollTop: 0 }, 600);
}
