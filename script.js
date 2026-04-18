// ============================================================
//  ROSWELL CRUZ — E-Portfolio JavaScript
//  DOM & JavaScript Features:
//   1. Navbar scroll + active link tracking (Intersection Observer)
//   2. Skill bar animations on scroll
//   3. Project detail modal (show/hide dynamic content)
//   4. Contact form validation
//   5. Download CV button feedback
//   6. Mobile hamburger menu
//   7. Back-to-top button
//   8. Animated entrance on scroll
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  // ── Footer year ──────────────────────────────────────────
  const yearEl = document.getElementById('footerYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ── Navbar scroll shadow ──────────────────────────────────
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.style.boxShadow = window.scrollY > 30
      ? '0 4px 24px rgba(0,0,0,0.25)'
      : 'none';
  });

  // ── Active nav link via Intersection Observer ─────────────
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-links .nav-link');

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.nav-links .nav-link[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { rootMargin: '-50% 0px -50% 0px' });

  sections.forEach(s => navObserver.observe(s));

  // ── Hamburger menu toggle ─────────────────────────────────
  const hamburger = document.getElementById('hamburger');
  const navLinksEl = document.getElementById('navLinks');

  if (hamburger && navLinksEl) {
    hamburger.addEventListener('click', () => {
      navLinksEl.classList.toggle('open');
      // animate hamburger lines
      const spans = hamburger.querySelectorAll('span');
      if (navLinksEl.classList.contains('open')) {
        spans[0].style.transform = 'translateY(7px) rotate(45deg)';
        spans[1].style.opacity   = '0';
        spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
      } else {
        spans[0].style.transform = '';
        spans[1].style.opacity   = '';
        spans[2].style.transform = '';
      }
    });

    // Close on nav link click (mobile)
    navLinksEl.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinksEl.classList.remove('open');
        const spans = hamburger.querySelectorAll('span');
        spans[0].style.transform = '';
        spans[1].style.opacity   = '';
        spans[2].style.transform = '';
      });
    });
  }

  // ── Skill bar animation on scroll ────────────────────────
  const skillFills = document.querySelectorAll('.skill-fill');

  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill  = entry.target;
        const width = fill.getAttribute('data-width') || '0';
        fill.style.width = width + '%';
        skillObserver.unobserve(fill);
      }
    });
  }, { threshold: 0.3 });

  skillFills.forEach(fill => skillObserver.observe(fill));

  // ── Fade-in entrance animations ──────────────────────────
  const animEls = document.querySelectorAll(
    '.skill-card, .project-card, .timeline-item, .contact-item, .kpi-card'
  );

  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity   = '1';
          entry.target.style.transform = 'translateY(0)';
        }, i * 60);
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  animEls.forEach(el => {
    el.style.opacity   = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    fadeObserver.observe(el);
  });

  // ── Back to top ───────────────────────────────────────────
  const backTop = document.getElementById('backTop');
  window.addEventListener('scroll', () => {
    backTop.classList.toggle('show', window.scrollY > 400);
  });

  // ── Contact form validation ───────────────────────────────
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      const fields = [
        { id: 'fname',    errId: 'fnameError',    label: 'Full name',     type: 'text'  },
        { id: 'femail',   errId: 'femailError',   label: 'Email address', type: 'email' },
        { id: 'fsubject', errId: 'fsubjectError', label: 'Subject',       type: 'text'  },
        { id: 'fmessage', errId: 'fmessageError', label: 'Message',       type: 'text'  },
      ];

      fields.forEach(f => {
        const el    = document.getElementById(f.id);
        const errEl = document.getElementById(f.errId);
        const val   = el.value.trim();

        // Clear previous
        el.classList.remove('error');
        errEl.textContent = '';

        if (!val) {
          el.classList.add('error');
          errEl.textContent = `${f.label} is required.`;
          valid = false;
          return;
        }

        if (f.type === 'email') {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(val)) {
            el.classList.add('error');
            errEl.textContent = 'Please enter a valid email address.';
            valid = false;
          }
        }

        if (f.id === 'fmessage' && val.length < 10) {
          el.classList.add('error');
          errEl.textContent = 'Message must be at least 10 characters.';
          valid = false;
        }
      });

      if (valid) {
        // Simulate send
        const submitBtn = form.querySelector('[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending…';

        setTimeout(() => {
          form.reset();
          success.classList.add('show');
          submitBtn.disabled   = false;
          submitBtn.textContent = 'Send Message';
          setTimeout(() => success.classList.remove('show'), 5000);
        }, 1200);
      }
    });

    // Clear error on input
    form.querySelectorAll('input, textarea').forEach(el => {
      el.addEventListener('input', () => {
        el.classList.remove('error');
        const errId = el.id + 'Error';
        const errEl = document.getElementById(errId);
        if (errEl) errEl.textContent = '';
      });
    });
  }
});

// ── Project modal data ────────────────────────────────────
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
  const p       = projects[index];
  const modal   = document.getElementById('projectModal');
  const content = document.getElementById('modalContent');

  content.innerHTML = `
    <img src="${p.img}" alt="${p.title}"
      style="width:100%;border-radius:10px;margin-bottom:1.5rem;object-fit:cover;max-height:220px;"/>
    <span style="font-size:0.7rem;font-weight:700;color:#c9a84c;letter-spacing:0.08em;text-transform:uppercase;">
      ${p.tag}
    </span>
    <h3 style="margin:0.4rem 0 0.75rem;">${p.title}</h3>
    <p>${p.desc}</p>
    <div style="display:flex;flex-wrap:wrap;gap:0.5rem;margin:1rem 0 1.5rem;">
      ${p.tech.map(t => `<span style="background:#eef0f3;color:#4a5260;font-size:0.75rem;font-weight:600;padding:0.3rem 0.7rem;border-radius:6px;">${t}</span>`).join('')}
    </div>
    <a href="${p.link}" target="_blank" class="btn btn-primary btn-sm">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
        <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
      </svg>
      View Live Project
    </a>
  `;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('projectModal').classList.remove('active');
  document.body.style.overflow = '';
}

// Close modal on overlay click
document.getElementById('projectModal')?.addEventListener('click', (e) => {
  if (e.target === e.currentTarget) closeModal();
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

// ── Download CV ───────────────────────────────────────────
function downloadCV() {
  const btn = document.getElementById('downloadCvBtn') ||
              document.querySelector('[onclick="downloadCV()"]');

  // Visual feedback
  if (btn) {
    const original = btn.innerHTML;
    btn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
      Preparing CV…
    `;
    btn.disabled = true;

    setTimeout(() => {
      btn.innerHTML = original;
      btn.disabled  = false;

      // Create a simple downloadable text CV
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
General Trias, Cavite
2019 – 2023

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
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = url;
      a.download = 'Roswell_Cruz_CV.txt';
      a.click();
      URL.revokeObjectURL(url);
    }, 900);
  }
}

// ── Scroll to top ─────────────────────────────────────────
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
