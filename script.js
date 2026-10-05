/**
 * ==========================================================================
 * PORTFOLIO JAVASCRIPT - MAAHERA NOUSHIN K M
 * AI & Data Science Student | Aspiring AI Engineer
 * Pure Vanilla JavaScript (ES6+) - Robust, Error-Free, Zero-Dependency
 * ==========================================================================
 */

'use strict';

// Safe execution whether DOM is already parsed or still loading
function initApp() {
  initHeroCanvas();
  initTypingAnimation();
  initNavigation();
  initThemeToggle();
  initScrollReveal();
  initAnimatedCounters();
  initSkillBars();
  initProjectFiltering();
  initModals();
  initContactForm();
  initBackToTop();
  initResumeActions();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  // If already interactive/complete (e.g. deferred ES module)
  initApp();
}

/* --------------------------------------------------------------------------
   Global Toast Notification Utility (Non-blocking, safe inside iframes)
   -------------------------------------------------------------------------- */
function showToast(title, desc, duration = 4500) {
  const toast = document.getElementById('contact-toast');
  if (!toast) return;

  const titleEl = toast.querySelector('.toast-text-title');
  const descEl = toast.querySelector('.toast-text-desc');

  if (titleEl) titleEl.textContent = title;
  if (descEl) descEl.textContent = desc;

  toast.classList.add('active');

  // Clear any existing timer
  if (toast.dataset.timeoutId) {
    clearTimeout(parseInt(toast.dataset.timeoutId, 10));
  }

  const timeoutId = setTimeout(() => {
    toast.classList.remove('active');
  }, duration);

  toast.dataset.timeoutId = String(timeoutId);
}

/* --------------------------------------------------------------------------
   1. Interactive Neural Network / Mesh Canvas (Hero Background)
   -------------------------------------------------------------------------- */
function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  let animationFrameId;
  let isCanvasVisible = true;

  // Track cursor position accurately relative to canvas bounds
  const mouse = {
    x: null,
    y: null,
    radius: 130,
  };

  window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    if (
      e.clientX >= rect.left &&
      e.clientX <= rect.right &&
      e.clientY >= rect.top &&
      e.clientY <= rect.bottom
    ) {
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    } else {
      mouse.x = null;
      mouse.y = null;
    }
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Handle window resizing safely
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      createNodes();
    }, 150);
  });

  // Node class for Neural Synaptic Mesh
  class Node {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.7;
      this.vy = (Math.random() - 0.5) * 0.7;
      this.radius = Math.random() * 1.8 + 1.2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      // Bounce at viewport edges
      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Gentle mouse interaction
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius && dist > 0) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 2.5;
          this.y -= (dy / dist) * force * 2.5;
        }
      }
    }

    draw(themeIsLight) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = themeIsLight ? 'rgba(2, 132, 199, 0.7)' : 'rgba(56, 189, 248, 0.75)';
      ctx.fill();
    }
  }

  let nodes = [];
  function createNodes() {
    nodes = [];
    const count = Math.floor((width * height) / 16000);
    const total = Math.min(Math.max(count, 30), 80);
    for (let i = 0; i < total; i++) {
      nodes.push(new Node());
    }
  }

  createNodes();

  // Animation Loop
  function animate() {
    if (!isCanvasVisible) {
      animationFrameId = requestAnimationFrame(animate);
      return;
    }

    ctx.clearRect(0, 0, width, height);
    const themeIsLight = document.documentElement.getAttribute('data-theme') === 'light';

    // Draw connecting synapses
    const maxDist = 135;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.26;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = themeIsLight
            ? `rgba(79, 70, 229, ${alpha * 0.8})`
            : `rgba(56, 189, 248, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    // Update and draw each node
    for (let i = 0; i < nodes.length; i++) {
      nodes[i].update();
      nodes[i].draw(themeIsLight);
    }

    animationFrameId = requestAnimationFrame(animate);
  }

  animate();

  // Pause canvas when hero is out of view to save battery and GPU
  const heroSection = document.getElementById('home');
  if (heroSection && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        isCanvasVisible = entries[0].isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(heroSection);
  }
}

/* --------------------------------------------------------------------------
   2. Dynamic Typing Animation
   -------------------------------------------------------------------------- */
function initTypingAnimation() {
  const typingElement = document.getElementById('typing-text');
  if (!typingElement) return;

  const roles = [
    'AI & Data Science Student',
    'Aspiring AI Engineer',
    'Creator of MediShield AI',
    'Machine Learning Enthusiast',
    'Deep Learning Explorer',
    'Intelligent Systems Developer',
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function type() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      typingElement.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 40;
    } else {
      typingElement.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 90;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      typingSpeed = 1800; // Pause at end of text
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 350;
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

/* --------------------------------------------------------------------------
   3. Sticky Navigation, Scroll Spy & Mobile Menu
   -------------------------------------------------------------------------- */
function initNavigation() {
  const navbar = document.getElementById('navbar');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navLinks = document.getElementById('nav-links');
  const navLinkItems = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Sticky Navbar on Scroll
  function checkNavScroll() {
    if (window.scrollY > 40) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', checkNavScroll, { passive: true });
  checkNavScroll();

  // Mobile Menu Toggle
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      mobileToggle.classList.toggle('active', isOpen);
      mobileToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navLinkItems.forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('click', (e) => {
      if (
        navLinks.classList.contains('open') &&
        !navLinks.contains(e.target) &&
        !mobileToggle.contains(e.target)
      ) {
        navLinks.classList.remove('open');
        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Active Section Indicator (Scroll Spy) using accurate bounding checks
  function highlightActiveNav() {
    const scrollPos = window.scrollY + 160;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinkItems.forEach((link) => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', highlightActiveNav, { passive: true });
  highlightActiveNav();
}

/* --------------------------------------------------------------------------
   4. Dark / Light Mode Switcher
   -------------------------------------------------------------------------- */
function initThemeToggle() {
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  if (!themeToggleBtn) return;

  const savedTheme = localStorage.getItem('portfolio-theme');
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

  if (savedTheme === 'light' || (!savedTheme && prefersLight)) {
    document.documentElement.setAttribute('data-theme', 'light');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }

  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    if (currentTheme === 'light') {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('portfolio-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('portfolio-theme', 'light');
    }
  });
}

/* --------------------------------------------------------------------------
   5. Scroll Reveal Animations
   -------------------------------------------------------------------------- */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if (!revealElements.length) return;

  // Immediately reveal elements that are already visible in viewport
  function checkReveal() {
    const windowBottom = window.scrollY + window.innerHeight;
    revealElements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const elementTop = rect.top + window.scrollY;
      if (elementTop < windowBottom - 40) {
        el.classList.add('revealed');
      }
    });
  }

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries, observerInstance) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observerInstance.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -20px 0px' }
    );

    revealElements.forEach((el) => observer.observe(el));
  } else {
    window.addEventListener('scroll', checkReveal, { passive: true });
  }

  // Initial check
  checkReveal();
}

/* --------------------------------------------------------------------------
   6. Animated Counters for Statistics & Achievements
   -------------------------------------------------------------------------- */
function initAnimatedCounters() {
  const counterElements = document.querySelectorAll('[data-counter]');
  if (!counterElements.length) return;

  const animateCounter = (el) => {
    if (el.dataset.animated === 'true') return;
    el.dataset.animated = 'true';

    const target = parseInt(el.getAttribute('data-counter'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1500;
    const startTime = performance.now();

    function updateCount(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentVal = Math.floor(easeProgress * target);

      el.textContent = currentVal + suffix;

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        el.textContent = target + suffix;
      }
    }

    requestAnimationFrame(updateCount);
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries, observerInstance) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observerInstance.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    counterElements.forEach((counter) => observer.observe(counter));
  } else {
    counterElements.forEach((counter) => animateCounter(counter));
  }
}

/* --------------------------------------------------------------------------
   7. Animated Skill Bars
   -------------------------------------------------------------------------- */
function initSkillBars() {
  const skillBars = document.querySelectorAll('.skill-bar-fill');
  if (!skillBars.length) return;

  const triggerBar = (bar) => {
    if (bar.dataset.animated === 'true') return;
    bar.dataset.animated = 'true';
    const percent = bar.getAttribute('data-percent') || '0';
    bar.style.width = `${percent}%`;
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries, observerInstance) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            triggerBar(entry.target);
            observerInstance.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    skillBars.forEach((bar) => observer.observe(bar));
  } else {
    skillBars.forEach((bar) => triggerBar(bar));
  }
}

/* --------------------------------------------------------------------------
   8. Project Filtering (All | AI | Data Science | Web Development)
   -------------------------------------------------------------------------- */
function initProjectFiltering() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (!filterButtons.length || !projectCards.length) return;

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const cardCategory = card.getAttribute('data-category');
        const isMatch =
          filterValue === 'all' ||
          cardCategory === filterValue ||
          (filterValue === 'ai' && (cardCategory === 'ai' || cardCategory === 'healthcare')) ||
          (filterValue === 'datascience' && (cardCategory === 'datascience' || cardCategory === 'healthcare'));

        if (isMatch) {
          card.classList.remove('hidden');
          card.style.opacity = '0';
          card.style.transform = 'translateY(12px)';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 30);
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   9. Modals System (Project Details, Certificate Verification, Resume View)
   -------------------------------------------------------------------------- */
const PROJECT_DATA = {
  medishield: {
    title: 'MediShield AI — Intelligent Healthcare Defense & Diagnostic Triage',
    category: 'Healthcare AI & Cybersecurity',
    image: './assets/images/project-medishield.jpg',
    description:
      'MediShield AI is an intelligent healthcare platform engineered to protect sensitive medical telemetry, provide automated clinical anomaly classification, and secure electronic health records against manipulation and fraud.',
    technologies: ['Python', 'Machine Learning', 'Healthcare AI', 'Anomaly Detection', 'Predictive Triage', 'Cloud AI'],
    features: [
      'Live deployed production application hosted at https://medishield-ai.ai.studio/',
      'Automated multi-parameter biomarker anomaly screening and risk stratification',
      'Electronic medical record (EMR) cryptographic integrity checks preventing tampering',
      'Interactive clinical visualization suite with responsive patient risk heatmaps',
      'Optimized low-latency neural inference pipelines for real-time triage assistance',
    ],
    githubUrl: 'https://github.com/maahera',
    demoUrl: 'https://medishield-ai.ai.studio/',
  },
  drone: {
    title: 'AI Search & Rescue Drone',
    category: 'Artificial Intelligence & Robotics',
    image: './assets/images/project-drone.jpg',
    description:
      'An intelligent unmanned aerial vehicle (UAV) pathfinding engine built for disaster relief operations. The system computes dynamic, collision-free flight corridors across smoke-filled, earthquake-damaged terrains using an optimized A* search algorithm combined with heuristic obstacle cost fields.',
    technologies: ['Python', 'A* Search Algorithm', 'Computer Vision', 'Pathfinding', 'Simulation'],
    features: [
      'Heuristic 3D terrain exploration with obstacle cost gradients',
      'Dynamic re-routing upon detecting structural collapses',
      'Low computational footprint designed for edge UAV microcontrollers',
      'Tested across 20+ simulated disaster topologies with zero mission-critical collisions',
    ],
    githubUrl: 'https://github.com/maahera',
    demoUrl: 'https://medishield-ai.ai.studio/',
  },
  deepfake: {
    title: 'Deepfake Predictor',
    category: 'Machine Learning & Media Forensics',
    image: './assets/images/project-deepfake.jpg',
    description:
      'A machine learning pipeline engineered to distinguish authentic video and audio recordings from synthetically generated deepfakes. Analyzes micro-inconsistencies in biological facial blinking rates, lighting reflection continuity, and audio frequency anomalies.',
    technologies: ['Python', 'PyTorch / Scikit-Learn', 'OpenCV', 'Feature Extraction', 'Data Science'],
    features: [
      'Spatial-temporal facial landmark tracking across video frames',
      'Dual-stream architecture evaluating both visual and audio spectrograms',
      'High detection accuracy on benchmark deepfake challenge datasets',
      'Real-time confidence scoring with visual highlight heatmaps',
    ],
    githubUrl: 'https://github.com/maahera',
    demoUrl: 'https://medishield-ai.ai.studio/',
  },
  edge: {
    title: 'Autonomous Edge Vision System',
    category: 'Edge AI & Embedded Computing',
    image: './assets/images/project-edge-vision.jpg',
    description:
      'An ongoing research and engineering project implementing lightweight object detection and semantic anomaly localization directly on resource-constrained embedded processors.',
    technologies: ['Python', 'Embedded AI', 'TensorFlow Lite', 'Edge Computing', 'IoT'],
    features: [
      'Model quantization reducing model footprint by 65%',
      'Optimized integer inference pipelines running at 30+ FPS',
      'Modular sensor integration for industrial automation inspection',
      'Customizable threshold tuning for safety-critical edge alerts',
    ],
    githubUrl: 'https://github.com/maahera',
    demoUrl: 'https://medishield-ai.ai.studio/',
  },
  healthcare: {
    title: 'Predictive Healthcare Analytics',
    category: 'Data Science & Predictive Modeling',
    image: './assets/images/project-medishield.jpg',
    description:
      'A data-driven risk assessment dashboard analyzing longitudinal patient biomarkers to predict early cardiac risk indicators. Utilizes statistical imputation, outlier detection, and ensemble classifiers.',
    technologies: ['Python', 'Pandas', 'Scikit-Learn', 'Data Visualization', 'Clinical Data'],
    features: [
      'Comprehensive exploratory data analysis and correlation heatmaps',
      'Ensemble model achieving 89% sensitivity on validation splits',
      'SHAP value feature explainability for medical transparency',
      'Interactive risk stratification dashboard for clinicians',
    ],
    githubUrl: 'https://github.com/maahera',
    demoUrl: 'https://medishield-ai.ai.studio/',
  },
};

const CERTIFICATE_DATA = {
  matlab: {
    title: 'MATLAB Fundamentals & Applied Computing',
    issuer: 'MathWorks',
    date: 'August 2025',
    id: 'MW-77492-AI',
    description:
      'Comprehensive certification covering numerical computation, data analysis, matrix algorithms, and scientific visualization using MATLAB.',
  },
  ai: {
    title: 'Artificial Intelligence & Deep Learning Foundations',
    issuer: 'DeepLearning.AI',
    date: 'November 2025',
    id: 'DL-88210-FD',
    description:
      'Specialized coursework on neural network architectures, backpropagation, convolutional layers, and loss optimization.',
  },
  python: {
    title: 'Python for Data Science and Machine Learning',
    issuer: 'Coursera / IBM',
    date: 'May 2025',
    id: 'PY-43901-DS',
    description:
      'Practical training on Python libraries including NumPy, Pandas, Matplotlib, and Scikit-Learn with hands-on capstone projects.',
  },
  datascience: {
    title: 'Data Science Professional Certificate',
    issuer: 'IBM',
    date: 'January 2026',
    id: 'IBM-90112-PC',
    description:
      'Rigorous series covering the full data science lifecycle: data preparation, relational databases, statistical hypothesis testing, and model deployment.',
  },
  ml: {
    title: 'Supervised Machine Learning: Regression and Classification',
    issuer: 'Stanford Online / DeepLearning.AI',
    date: 'July 2025',
    id: 'ST-10398-ML',
    description:
      'In-depth mastery of linear regression, logistic regression, gradient descent, regularizations, decision trees, and validation metrics.',
  },
  web: {
    title: 'Modern Responsive Web Development',
    issuer: 'freeCodeCamp',
    date: 'March 2025',
    id: 'FCC-88301-WD',
    description:
      'Hands-on validation of semantic HTML5, modern CSS3 layout systems (Flexbox, Grid, Custom Properties), and accessibility standards.',
  },
};

function initModals() {
  const modalOverlay = document.getElementById('details-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');

  if (!modalOverlay || !modalCloseBtn) return;

  function closeModal() {
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  function openModal() {
    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  modalCloseBtn.addEventListener('click', closeModal);

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('open')) {
      closeModal();
    }
  });

  // Project "View Details" buttons
  const projectDetailButtons = document.querySelectorAll('[data-project-key]');
  projectDetailButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const key = btn.getAttribute('data-project-key');
      const project = PROJECT_DATA[key];
      if (!project) return;

      modalTitle.textContent = project.title;

      modalBody.innerHTML = `
        <div style="border-radius: var(--radius-md); overflow: hidden; max-height: 280px; background: var(--bg-secondary); border: 1px solid var(--border-subtle);">
          <img src="${project.image}" alt="${project.title}" style="width: 100%; height: 100%; object-fit: cover;" />
        </div>
        <div>
          <div style="font-size: 0.8rem; font-family: var(--font-mono); color: var(--accent-primary); margin-bottom: 6px; text-transform: uppercase;">
            ${project.category}
          </div>
          <p style="font-size: 1rem; line-height: 1.7; color: var(--text-secondary); margin-bottom: 18px;">
            ${project.description}
          </p>
        </div>
        <div style="border-top: 1px solid var(--border-subtle); padding-top: 16px;">
          <h4 style="font-size: 1rem; font-weight: 700; margin-bottom: 12px; color: var(--text-primary);">
            Key Highlights & Engineering Focus:
          </h4>
          <ul style="display: flex; flex-direction: column; gap: 8px; font-size: 0.92rem; color: var(--text-secondary);">
            ${project.features
              .map(
                (f) =>
                  `<li style="display: flex; align-items: flex-start; gap: 10px;">
                    <span style="color: var(--accent-primary); font-weight: bold;">✓</span>
                    <span>${f}</span>
                  </li>`
              )
              .join('')}
          </ul>
        </div>
        <div style="border-top: 1px solid var(--border-subtle); padding-top: 16px;">
          <div style="font-size: 0.82rem; color: var(--text-muted); margin-bottom: 8px;">Technologies Used:</div>
          <div style="display: flex; flex-wrap: wrap; gap: 6px; font-size: 0.85rem; color: var(--text-primary);">
            ${project.technologies.join(' · ')}
          </div>
        </div>
        <div style="display: flex; gap: 12px; margin-top: 14px; flex-wrap: wrap;">
          <a href="${project.demoUrl}" target="_blank" rel="noopener noreferrer" class="btn-primary" style="padding: 10px 20px; font-size: 0.88rem;">
            <span>Open Live App</span> →
          </a>
          <a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer" class="btn-secondary" style="padding: 10px 20px; font-size: 0.88rem;">
            <span>GitHub Code</span>
          </a>
          <button class="btn-secondary" onclick="document.getElementById('details-modal').classList.remove('open'); document.body.style.overflow='';" style="padding: 10px 18px; font-size: 0.88rem; margin-left: auto;">
            Close Preview
          </button>
        </div>
      `;

      openModal();
    });
  });

  // Certificate "View Certificate" buttons
  const certButtons = document.querySelectorAll('[data-cert-key]');
  certButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const key = btn.getAttribute('data-cert-key');
      const cert = CERTIFICATE_DATA[key];
      if (!cert) return;

      modalTitle.textContent = 'Certificate Verification';

      modalBody.innerHTML = `
        <div style="padding: 30px 24px; text-align: center; background: var(--bg-card); border: 1px dashed var(--accent-primary); border-radius: var(--radius-lg);">
          <div style="font-size: 2.5rem; margin-bottom: 12px;">🎓</div>
          <h3 style="font-size: 1.35rem; font-weight: 800; color: var(--text-primary); margin-bottom: 8px;">
            ${cert.title}
          </h3>
          <p style="font-size: 0.95rem; color: var(--text-secondary); margin-bottom: 16px;">
            Issued by <strong style="color: var(--accent-primary);">${cert.issuer}</strong> · ${cert.date}
          </p>
          <div style="display: inline-block; font-family: var(--font-mono); font-size: 0.82rem; background: var(--bg-secondary); padding: 6px 14px; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle); color: var(--text-muted); margin-bottom: 18px;">
            Credential ID: ${cert.id}
          </div>
          <p style="font-size: 0.9rem; line-height: 1.6; color: var(--text-secondary); max-width: 480px; margin: 0 auto;">
            ${cert.description}
          </p>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-subtle); padding-top: 18px;">
          <span style="font-size: 0.82rem; color: var(--accent-emerald); font-weight: 600;">
            ● Verified Student Credential
          </span>
          <button class="btn-secondary" onclick="document.getElementById('details-modal').classList.remove('open'); document.body.style.overflow='';" style="padding: 8px 18px; font-size: 0.86rem;">
            Done
          </button>
        </div>
      `;

      openModal();
    });
  });
}

/* --------------------------------------------------------------------------
   10. Resume Actions & Modal (Without window.alert)
   -------------------------------------------------------------------------- */
function initResumeActions() {
  const downloadBtn = document.getElementById('btn-download-resume');
  const viewResumeBtn = document.getElementById('btn-view-resume');
  const modalOverlay = document.getElementById('details-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');

  if (downloadBtn) {
    downloadBtn.addEventListener('click', (e) => {
      // If href is still a placeholder hash
      if (downloadBtn.getAttribute('href') === '#') {
        e.preventDefault();
        showToast(
          'Resume File Placeholder',
          'To link your actual PDF, place your file in /assets and update href in index.html.'
        );
      }
    });
  }

  if (viewResumeBtn && modalOverlay && modalTitle && modalBody) {
    viewResumeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      modalTitle.textContent = 'Maahera Noushin K M — Curriculum Vitae';

      modalBody.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 18px;">
          <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 22px;">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; border-bottom: 1px solid var(--border-subtle); padding-bottom: 12px; margin-bottom: 14px;">
              <div>
                <h3 style="font-size: 1.25rem; font-weight: 800; color: var(--text-primary);">MAAHERA NOUSHIN K M</h3>
                <p style="font-size: 0.85rem; color: var(--accent-primary);">AI & Data Science Student · Aspiring AI Engineer</p>
              </div>
              <div style="font-size: 0.82rem; color: var(--text-muted); font-family: var(--font-mono);">
                maahera2007@gmail.com
              </div>
            </div>

            <div style="margin-bottom: 14px;">
              <h4 style="font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-primary); font-weight: 700; margin-bottom: 6px;">
                Summary
              </h4>
              <p style="font-size: 0.88rem; line-height: 1.6; color: var(--text-secondary);">
                Undergraduate scholar in Artificial Intelligence & Data Science passionate about machine learning, computer vision, pathfinding algorithms, and building robust, real-world intelligent systems like MediShield AI.
              </p>
            </div>

            <div style="margin-bottom: 14px;">
              <h4 style="font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-primary); font-weight: 700; margin-bottom: 6px;">
                Core Technical Skills
              </h4>
              <p style="font-size: 0.88rem; color: var(--text-secondary);">
                <strong>Languages:</strong> Python, Java, C, JavaScript<br/>
                <strong>AI & DS:</strong> Machine Learning, Deep Learning, A* Search, Scikit-Learn, OpenCV, Anomaly Detection<br/>
                <strong>Tools:</strong> MATLAB, Google Colab, Jupyter Notebook, Git, GitHub
              </p>
            </div>

            <div>
              <h4 style="font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-primary); font-weight: 700; margin-bottom: 6px;">
                Featured Project Highlights
              </h4>
              <p style="font-size: 0.88rem; color: var(--text-secondary);">
                • <strong>MediShield AI:</strong> Real-time healthcare defense and clinical anomaly triage engine (Live at medishield-ai.ai.studio).<br/>
                • <strong>AI Search & Rescue Drone:</strong> Obstacle avoidance and terrain exploration using modified A* search.<br/>
                • <strong>Deepfake Predictor:</strong> Media forensics identifying synthetic facial manipulation.
              </p>
            </div>
          </div>

          <div style="display: flex; gap: 14px; justify-content: flex-end; flex-wrap: wrap;">
            <a href="https://medishield-ai.ai.studio/" target="_blank" rel="noopener noreferrer" class="btn-primary" style="padding: 10px 20px; font-size: 0.88rem;">
              <span>View MediShield AI Live</span>
            </a>
            <button class="btn-secondary" onclick="document.getElementById('details-modal').classList.remove('open'); document.body.style.overflow='';" style="padding: 10px 18px; font-size: 0.88rem;">
              Close
            </button>
          </div>
        </div>
      `;

      modalOverlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  }
}

/* --------------------------------------------------------------------------
   11. Contact Form Validation & Feedback
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const subjectInput = document.getElementById('contact-subject');
  const messageInput = document.getElementById('contact-message');
  const submitBtn = document.getElementById('contact-submit-btn');

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }

  function setError(input, message) {
    input.classList.add('error');
    const errorDisplay = input.parentElement?.querySelector('.form-error-msg');
    if (errorDisplay) {
      errorDisplay.textContent = message;
      errorDisplay.classList.add('visible');
    }
  }

  function clearError(input) {
    input.classList.remove('error');
    const errorDisplay = input.parentElement?.querySelector('.form-error-msg');
    if (errorDisplay) {
      errorDisplay.textContent = '';
      errorDisplay.classList.remove('visible');
    }
  }

  [nameInput, emailInput, subjectInput, messageInput].forEach((input) => {
    if (!input) return;
    input.addEventListener('input', () => clearError(input));
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;

    // Validate Name
    if (!nameInput.value.trim()) {
      setError(nameInput, 'Please provide your full name.');
      isValid = false;
    } else if (nameInput.value.trim().length < 2) {
      setError(nameInput, 'Name must be at least 2 characters.');
      isValid = false;
    } else {
      clearError(nameInput);
    }

    // Validate Email
    if (!emailInput.value.trim()) {
      setError(emailInput, 'Email address is required.');
      isValid = false;
    } else if (!validateEmail(emailInput.value.trim())) {
      setError(emailInput, 'Please enter a valid email address.');
      isValid = false;
    } else {
      clearError(emailInput);
    }

    // Validate Subject
    if (!subjectInput.value.trim()) {
      setError(subjectInput, 'Please provide a subject for your message.');
      isValid = false;
    } else {
      clearError(subjectInput);
    }

    // Validate Message
    if (!messageInput.value.trim()) {
      setError(messageInput, 'Message cannot be empty.');
      isValid = false;
    } else if (messageInput.value.trim().length < 10) {
      setError(messageInput, 'Message should be at least 10 characters.');
      isValid = false;
    } else {
      clearError(messageInput);
    }

    if (!isValid) return;

    // Button loading state
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span>Sending Message...</span>`;

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;

      showToast(
        'Message Sent Successfully!',
        'Thank you for reaching out. I will respond to your email shortly.'
      );

      form.reset();
    }, 1000);
  });
}

/* --------------------------------------------------------------------------
   12. Back to Top Button
   -------------------------------------------------------------------------- */
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  if (!backToTopBtn) return;

  function toggleBackToTop() {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', toggleBackToTop, { passive: true });
  toggleBackToTop();

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  });
}
