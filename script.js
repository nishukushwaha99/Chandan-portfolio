/**
 * CHANDAN KUSHWAHA - INTERACTIVE PORTFOLIO & BIO-DATA ENGINE
 * Vanilla JavaScript Architecture
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ==========================================================================
     1. Web Audio API Synthesizer (Subtle UI Sound FX)
     ========================================================================== */
  class SoundFX {
    constructor() {
      this.enabled = false;
      this.ctx = null;
    }

    init() {
      if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioCtx();
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    playBlip(freq = 520, type = 'sine', duration = 0.06) {
      if (!this.enabled || !this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
      } catch (e) {
        // Audio error silent fallback
      }
    }

    playSwoosh() {
      if (!this.enabled || !this.ctx) return;
      this.playBlip(880, 'triangle', 0.12);
    }
  }

  const sfx = new SoundFX();
  const audioToggleBtn = document.getElementById('audio-toggle-btn');
  const audioIcon = document.getElementById('audio-icon');

  if (audioToggleBtn) {
    audioToggleBtn.addEventListener('click', () => {
      sfx.init();
      sfx.enabled = !sfx.enabled;
      if (sfx.enabled) {
        audioIcon.textContent = '🔊';
        audioIcon.classList.remove('muted');
        sfx.playBlip(640, 'sine', 0.1);
        showToast('Audio Effects Activated', 'info');
      } else {
        audioIcon.textContent = '🔇';
        audioIcon.classList.add('muted');
        showToast('Audio Effects Muted', 'info');
      }
    });
  }

  /* ==========================================================================
     2. Accent Theme Switcher
     ========================================================================== */
  const accentButtons = document.querySelectorAll('.accent-btn');
  const currentAccent = localStorage.getItem('chandan_theme_accent') || 'cyan';

  function applyAccent(theme) {
    document.documentElement.setAttribute('data-accent', theme);
    localStorage.setItem('chandan_theme_accent', theme);
    accentButtons.forEach((btn) => {
      if (btn.dataset.accent === theme) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
    sfx.playBlip(720, 'sine', 0.08);
  }

  applyAccent(currentAccent);

  accentButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const theme = btn.dataset.accent;
      applyAccent(theme);
    });
  });

  /* ==========================================================================
     3. Particle & Constellation Neural Canvas
     ========================================================================== */
  const canvas = document.getElementById('bg-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let particles = [];
    const particleCount = Math.min(Math.floor((width * height) / 14000), 75);
    const mouse = { x: null, y: null, radius: 140 };

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    });

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener('mouseout', () => {
      mouse.x = null;
      mouse.y = null;
    });

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.7;
        this.vy = (Math.random() - 0.5) * 0.7;
        this.size = Math.random() * 2 + 1;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx = -this.vx;
        if (this.y < 0 || this.y > height) this.vy = -this.vy;

        // Mouse interaction
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            this.x -= (dx / dist) * force * 2;
            this.y -= (dy / dist) * force * 2;
          }
        }
      }

      draw() {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function initParticles() {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    }

    initParticles();

    function animateParticles() {
      ctx.clearRect(0, 0, width, height);

      // Draw connection lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            const alpha = (1 - dist / 120) * 0.18;
            ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Mouse connections
      if (mouse.x !== null && mouse.y !== null) {
        for (let i = 0; i < particles.length; i++) {
          const dx = mouse.x - particles[i].x;
          const dy = mouse.y - particles[i].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            const alpha = (1 - dist / mouse.radius) * 0.35;
            ctx.strokeStyle = `rgba(168, 85, 247, ${alpha})`;
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.moveTo(mouse.x, mouse.y);
            ctx.lineTo(particles[i].x, particles[i].y);
            ctx.stroke();
          }
        }
      }

      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      requestAnimationFrame(animateParticles);
    }

    animateParticles();
  }

  /* ==========================================================================
     4. Dynamic Typing Text Effect (Chandan's Focus Areas)
     ========================================================================== */
  const typedTarget = document.getElementById('typed-text');
  if (typedTarget) {
    const roles = [
      'BCA Student & Tech Scholar',
      'Data Analytics & Power BI',
      'Python & Software Engineering',
      'SQL & Database Management (DBMS)',
      'C, C++ & Java Programming'
    ];
    let roleIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    const typingSpeed = 70;
    const deletingSpeed = 35;
    const pauseTime = 1800;

    function typeLoop() {
      const currentRole = roles[roleIdx];
      if (isDeleting) {
        typedTarget.textContent = currentRole.substring(0, charIdx - 1);
        charIdx--;
      } else {
        typedTarget.textContent = currentRole.substring(0, charIdx + 1);
        charIdx++;
      }

      let timeout = isDeleting ? deletingSpeed : typingSpeed;

      if (!isDeleting && charIdx === currentRole.length) {
        timeout = pauseTime;
        isDeleting = true;
      } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
        timeout = 400;
      }

      setTimeout(typeLoop, timeout);
    }

    typeLoop();
  }

  /* ==========================================================================
     5. 3D Card Tilt Interaction for Chandan's Portrait
     ========================================================================== */
  const heroCard = document.getElementById('hero-card');
  const heroContainer = document.getElementById('hero-card-container');

  if (heroCard && heroContainer) {
    heroContainer.addEventListener('mousemove', (e) => {
      const rect = heroContainer.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -12;
      const rotateY = ((x - centerX) / centerX) * 12;

      heroCard.querySelector('.avatar-card-inner').style.transform = 
        `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    heroContainer.addEventListener('mouseleave', () => {
      heroCard.querySelector('.avatar-card-inner').style.transform = 
        `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    });
  }

  /* ==========================================================================
     6. Scroll Progress & Sticky Navbar Navigation Tracking
     ========================================================================== */
  const scrollProgress = document.getElementById('scroll-progress');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    // Scroll progress bar
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    if (scrollProgress) {
      scrollProgress.style.width = `${scrolled}%`;
    }

    // Nav active link tracking
    let currentSectionId = '';
    sections.forEach((sec) => {
      const secTop = sec.offsetTop - 140;
      const secHeight = sec.offsetHeight;
      if (winScroll >= secTop && winScroll < secTop + secHeight) {
        currentSectionId = sec.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  });

  // Mobile Menu Toggle
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('nav-open');
      mobileToggle.classList.toggle('active', isOpen);
      mobileToggle.setAttribute('aria-expanded', isOpen);
      sfx.playBlip(500, 'sine', 0.05);
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('nav-open');
        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ==========================================================================
     7. Skills Filter Tabs
     ========================================================================== */
  const skillTabs = document.querySelectorAll('.skill-tab-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  skillTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      skillTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      const targetCat = tab.dataset.tab;

      skillCards.forEach((card) => {
        if (targetCat === 'all' || card.dataset.category === targetCat) {
          card.style.display = 'block';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
        }
      });
      sfx.playBlip(600, 'sine', 0.05);
    });
  });

  /* ==========================================================================
     8. Project Case Study Modal System
     ========================================================================== */
  const projectModal = document.getElementById('project-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalBody = document.getElementById('modal-body-content');

  const projectData = {
    analytics: {
      tag: 'Data Analytics & Power BI',
      title: 'Business Analytics & Sales KPI Dashboard',
      banner: './assets/images/project-fintech.jpg',
      overview: 'Interactive business intelligence dashboard engineered with Power BI and SQL to deliver automated insights into sales revenues, customer segments, regional growth, and profit margins.',
      architecture: 'Raw transactional datasets are cleaned and transformed using Python and SQL views, then loaded into Power BI with DAX calculations for live drill-down visualization.',
      keyWins: [
        'Designed multi-page interactive visual dashboards highlighting critical monthly revenue KPIs.',
        'Created optimized SQL queries to aggregate transactional data with sub-second execution.',
        'Integrated automated anomaly markers for low-performing sales territories.'
      ],
      stack: ['Power BI', 'SQL Server / MySQL', 'Python', 'Excel', 'Data Modeling']
    },
    dbms: {
      tag: 'Database & Java Development',
      title: 'Student & College Records Management System',
      banner: './assets/images/project-cloud.jpg',
      overview: 'Desktop and relational database software developed to manage comprehensive student academic records, marks, attendance, and fee status for college administration.',
      architecture: 'Structured in Java using Object-Oriented Programming (OOP) concepts, connected via JDBC to a normalized MySQL relational database following strict 3NF database design.',
      keyWins: [
        'Normalized schema with foreign key constraints eliminating duplicate academic records.',
        'Implemented secure role-based student and faculty data access.',
        'Fast query reports for semester results and CGPA computations.'
      ],
      stack: ['Java', 'MySQL', 'DBMS', 'JDBC', 'Software Engineering']
    },
    python: {
      tag: 'Python Automation & Scripting',
      title: 'Automated Data Extraction & File Parser',
      banner: './assets/images/project-ai.jpg',
      overview: 'Automated Python utility designed to parse messy spreadsheets, extract structured records, validate data integrity, and export clean database-ready CSVs and SQL inserts.',
      architecture: 'Built using Python 3, Pandas, and regular expressions with automated logging and error exception handlers to ensure reliable file processing.',
      keyWins: [
        'Saved hours of manual data entry by converting thousands of records in seconds.',
        'Zero data corruption through rigorous column data-type validation checks.',
        'Hosted and version controlled on GitHub.'
      ],
      stack: ['Python 3', 'Pandas', 'Regular Expressions', 'File I/O', 'GitHub']
    }
  };

  function openProjectModal(projectId) {
    const data = projectData[projectId];
    if (!data) return;

    modalBody.innerHTML = `
      <div class="modal-header-section">
        <span class="modal-badge">${data.tag}</span>
        <h2 class="modal-title">${data.title}</h2>
      </div>
      <img src="${data.banner}" alt="${data.title}" class="modal-img-banner">
      <div class="modal-body-section">
        <div>
          <h3 class="modal-sub-heading">Project Overview</h3>
          <p style="color: var(--text-muted); line-height: 1.7;">${data.overview}</p>
        </div>
        <div>
          <h3 class="modal-sub-heading">Technical Architecture</h3>
          <p style="color: var(--text-muted); line-height: 1.7;">${data.architecture}</p>
        </div>
        <div>
          <h3 class="modal-sub-heading">Key Accomplishments</h3>
          <ul class="modal-feature-list">
            ${data.keyWins.map((win) => `<li>${win}</li>`).join('')}
          </ul>
        </div>
        <div>
          <h3 class="modal-sub-heading">Technologies Used</h3>
          <div class="project-tech-tags" style="margin-top: 0.5rem;">
            ${data.stack.map((t) => `<span class="tech-tag">${t}</span>`).join('')}
          </div>
        </div>
      </div>
    `;

    projectModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    sfx.playSwoosh();
  }

  function closeProjectModal() {
    projectModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.btn-view-modal').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const id = btn.dataset.projectId;
      openProjectModal(id);
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeProjectModal);
  }

  projectModal.addEventListener('click', (e) => {
    if (e.target === projectModal) closeProjectModal();
  });

  /* ==========================================================================
     9. Resume & Bio-Data Modal
     ========================================================================== */
  const resumeModal = document.getElementById('resume-modal');
  const btnOpenResume = document.getElementById('btn-open-resume');
  const resumeCloseBtn = document.getElementById('resume-close-btn');
  const btnPrintResume = document.getElementById('btn-print-resume');

  function openResume() {
    resumeModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    sfx.playSwoosh();
  }

  function closeResume() {
    resumeModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (btnOpenResume) btnOpenResume.addEventListener('click', openResume);
  if (resumeCloseBtn) resumeCloseBtn.addEventListener('click', closeResume);
  if (resumeModal) {
    resumeModal.addEventListener('click', (e) => {
      if (e.target === resumeModal) closeResume();
    });
  }

  if (btnPrintResume) {
    btnPrintResume.addEventListener('click', () => {
      window.print();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeProjectModal();
      closeResume();
    }
  });

  /* ==========================================================================
     10. Interactive Developer Terminal (Tailored for Chandan)
     ========================================================================== */
  const termForm = document.getElementById('terminal-form');
  const termInput = document.getElementById('terminal-input');
  const termOutput = document.getElementById('terminal-output');
  const chipButtons = document.querySelectorAll('.chip-cmd');

  const commands = {
    help: () => `
      <div class="term-line"><span class="term-highlight">COMMANDS AVAILABLE:</span></div>
      <div class="term-line">  <span class="term-prompt-cmd">whoami</span>        - Chandan Kushwaha's identity & summary</div>
      <div class="term-line">  <span class="term-prompt-cmd">education</span>     - BCA (CGPA 8.36), 12th & 10th details</div>
      <div class="term-line">  <span class="term-prompt-cmd">biodata</span>       - Full personal bio-data & address</div>
      <div class="term-line">  <span class="term-prompt-cmd">family</span>        - Parents & sibling particulars</div>
      <div class="term-line">  <span class="term-prompt-cmd">skills</span>        - Technical skills & competencies</div>
      <div class="term-line">  <span class="term-prompt-cmd">contact</span>       - Mobile, WhatsApp, Email, & Address</div>
      <div class="term-line">  <span class="term-prompt-cmd">clear</span>         - Clear the terminal console</div>
    `,
    whoami: () => `
      <div class="term-line"><strong style="color:#ffffff;">Mr. Chandan Kushwaha</strong></div>
      <div class="term-line">BCA Student (1st Year) @ Shri Ram Group of College, Muzaffarnagar (Delhi NCR)</div>
      <div class="term-line term-success">Academic Performance: 8.36 CGPA (2nd Semester)</div>
      <div class="term-line muted-line">Native: Sarna Bhanpur, Dinara, Rohtas, Bihar - 802213</div>
    `,
    education: () => `
      <div class="term-line"><span class="term-highlight">ACADEMIC QUALIFICATIONS:</span></div>
      <div class="term-line">  1. <strong>BCA (Graduation):</strong> Shri Ram Group of College, Delhi NCR (2026-2029) | <span style="color:#34d399;">CGPA: 8.36</span></div>
      <div class="term-line">  2. <strong>12th (Intermediate):</strong> BSEB Patna (2025) | Score: 56.4%</div>
      <div class="term-line">  3. <strong>10th (Matriculation):</strong> BSEB Patna (2023) | Score: 57.6%</div>
    `,
    biodata: () => `
      <div class="term-line"><span class="term-highlight">PERSONAL BIO-DATA:</span></div>
      <div class="term-line">  • Name: Mr. Chandan Kushwaha</div>
      <div class="term-line">  • Date of Birth: 27 March 2007</div>
      <div class="term-line">  • Religion / Caste: Hindu / Kushwaha</div>
      <div class="term-line">  • Marital Status: Single</div>
      <div class="term-line">  • Permanent Address: Sarna Bhanpur, Dinara, Rohtas, Bihar - 802213</div>
    `,
    family: () => `
      <div class="term-line"><span class="term-highlight">FAMILY PARTICULARS:</span></div>
      <div class="term-line">  • Father: Mr. Jagnarayan Singh (Farmer)</div>
      <div class="term-line">  • Mother: Mrs. Rina Devi (House Maker)</div>
      <div class="term-line">  • Elder Sister: Soni Kushwaha</div>
      <div class="term-line">  • Younger Brother: Vishal Kumar Kushwaha</div>
    `,
    skills: () => `
      <div class="term-line"><span class="term-highlight">TECHNICAL ARSENAL:</span></div>
      <div class="term-line">  • Programming: Python, C / C++, Java, SQL</div>
      <div class="term-line">  • Analytics & DBMS: Power BI, MySQL, DBMS, Excel</div>
      <div class="term-line">  • Core CS: Software Engineering, Networks, Operating Systems, GitHub</div>
      <div class="term-line">  • Soft Skills: Communication & Customer Handling, Problem Solving</div>
    `,
    contact: () => `
      <div class="term-line"><span class="term-highlight">CONTACT DETAILS:</span></div>
      <div class="term-line">  • Phone: <a href="tel:+917061350981" style="color:var(--accent-primary);">+91 7061350981</a></div>
      <div class="term-line">  • WhatsApp: <a href="https://wa.me/917061350981" target="_blank" style="color:var(--accent-primary);">wa.me/917061350981</a></div>
      <div class="term-line">  • Email: <a href="mailto:ckchandankumar272@gmail.com" style="color:var(--accent-primary);">ckchandankumar272@gmail.com</a></div>
      <div class="term-line">  • Address: Sarna Bhanpur, Dinara, Rohtas, Bihar - 802213</div>
    `,
    clear: () => 'CLEAR'
  };

  function executeCommand(rawCmd) {
    const cmd = rawCmd.trim().toLowerCase();
    sfx.playBlip(440, 'sine', 0.04);

    const userLine = document.createElement('div');
    userLine.className = 'term-line';
    userLine.innerHTML = `<span class="term-prompt-cmd">chandan@bca:~$</span> ${escapeHTML(rawCmd)}`;
    termOutput.appendChild(userLine);

    if (cmd === '') {
      termOutput.scrollTop = termOutput.scrollHeight;
      return;
    }

    let responseHTML = '';
    if (cmd === 'clear') {
      termOutput.innerHTML = '';
      return;
    } else if (commands[cmd]) {
      responseHTML = commands[cmd]();
    } else {
      responseHTML = `<div class="term-line term-error">sh: command not found: ${escapeHTML(cmd)}. Type <span class="term-highlight">'help'</span> for options.</div>`;
    }

    const resContainer = document.createElement('div');
    resContainer.innerHTML = responseHTML;
    termOutput.appendChild(resContainer);
    termOutput.scrollTop = termOutput.scrollHeight;
  }

  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      (tag) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  }

  if (termForm && termInput) {
    termForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = termInput.value;
      if (val) {
        executeCommand(val);
        termInput.value = '';
      }
    });
  }

  chipButtons.forEach((chip) => {
    chip.addEventListener('click', () => {
      const cmd = chip.dataset.cmd;
      if (cmd) executeCommand(cmd);
    });
  });

  /* ==========================================================================
     11. Interactive Contact Form with Validation & Feedback
     ========================================================================== */
  const contactForm = document.getElementById('contact-form');
  const submitBtn = document.getElementById('contact-submit-btn');

  if (contactForm && submitBtn) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('contact-name');
      const emailInput = document.getElementById('contact-email');
      const subjectInput = document.getElementById('contact-subject');
      const messageInput = document.getElementById('contact-message');

      const nameError = document.getElementById('name-error');
      const emailError = document.getElementById('email-error');
      const messageError = document.getElementById('message-error');

      nameError.textContent = '';
      emailError.textContent = '';
      messageError.textContent = '';

      let isValid = true;

      if (!nameInput.value.trim()) {
        nameError.textContent = 'Please enter your name.';
        isValid = false;
      }

      if (!emailInput.value.trim()) {
        emailError.textContent = 'Please provide an email or phone number.';
        isValid = false;
      }

      if (!messageInput.value.trim() || messageInput.value.trim().length < 8) {
        messageError.textContent = 'Please enter at least 8 characters in your message.';
        isValid = false;
      }

      if (!isValid) {
        sfx.playBlip(320, 'square', 0.1);
        return;
      }

      const btnText = submitBtn.querySelector('.btn-text');
      const btnSpinner = submitBtn.querySelector('.btn-spinner');
      const btnIcon = submitBtn.querySelector('.btn-icon');

      btnText.textContent = 'Sending...';
      btnSpinner.style.display = 'inline-block';
      btnIcon.style.display = 'none';
      submitBtn.disabled = true;

      setTimeout(() => {
        const messagePayload = {
          name: nameInput.value.trim(),
          contact: emailInput.value.trim(),
          subject: subjectInput.value,
          message: messageInput.value.trim(),
          timestamp: new Date().toISOString()
        };

        const existingMessages = JSON.parse(localStorage.getItem('chandan_messages') || '[]');
        existingMessages.push(messagePayload);
        localStorage.setItem('chandan_messages', JSON.stringify(existingMessages));

        contactForm.reset();
        btnText.textContent = 'Message Sent Successfully!';
        btnSpinner.style.display = 'none';
        btnIcon.style.display = 'inline-block';
        submitBtn.disabled = false;

        sfx.playBlip(880, 'sine', 0.15);
        showToast(`Thank you, ${messagePayload.name}! Message sent to Chandan Kushwaha.`, 'success');

        setTimeout(() => {
          btnText.textContent = 'Send Message to Chandan';
        }, 3500);
      }, 1000);
    });
  }

  /* ==========================================================================
     12. Dynamic Toast Notifications
     ========================================================================== */
  function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    const icon = type === 'success' ? '⚡' : '✨';
    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('removing');
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  /* ==========================================================================
     13. Live Indian Standard Time (IST) Clock
     ========================================================================== */
  const liveClock = document.getElementById('live-clock');
  function updateClock() {
    if (!liveClock) return;
    const now = new Date();
    const options = {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    };
    liveClock.textContent = new Intl.DateTimeFormat('en-US', options).format(now);
  }
  updateClock();
  setInterval(updateClock, 1000);

  /* ==========================================================================
     14. Back to Top Smooth Trigger
     ========================================================================== */
  const backToTopBtn = document.getElementById('btn-back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});
