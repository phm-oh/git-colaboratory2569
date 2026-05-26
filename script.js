function getStudents() {
  const dataEl = document.getElementById('students-data');
  if (dataEl) {
    try {
      return JSON.parse(dataEl.textContent);
    } catch {
      return [];
    }
  }
  return [];
}

function getInitials(name) {
  const parts = name.replace(/^(นาย|นางสาว|นาง|เด็กชาย|เด็กหญิง)\s*/, '').trim().split(/\s+/);
  if (parts.length >= 2) {
    return parts[0].charAt(0) + parts[1].charAt(0);
  }
  return parts[0]?.charAt(0) || '?';
}
function initParticles() {
  const canvas = document.getElementById('particles');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let animationId;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createParticles() {
    const count = Math.min(Math.floor(window.innerWidth / 12), 80);
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.5 + 0.5,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.4 + 0.1,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p, i) => {
      p.x += p.speedX;
      p.y += p.speedY;

      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(129, 140, 248, ${p.opacity})`;
      ctx.fill();

      particles.slice(i + 1).forEach((p2) => {
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(129, 140, 248, ${0.08 * (1 - dist / 100)})`;
          ctx.stroke();
        }
      });
    });

    animationId = requestAnimationFrame(draw);
  }

  resize();
  createParticles();
  draw();

  window.addEventListener('resize', () => {
    resize();
    createParticles();
  });

  return () => cancelAnimationFrame(animationId);
}

/* ===== Counter Animation ===== */
function animateCounters() {
  const counters = document.querySelectorAll('.stat-number[data-count]');

  counters.forEach((el) => {
    const target = parseInt(el.dataset.count, 10);
    const duration = 1500;
    const start = performance.now();

    function update(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target;
      }
    }

    requestAnimationFrame(update);
  });
}

/* ===== Scroll Reveal ===== */
function initScrollReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.teacher-card, .student-card').forEach((el) => {
    observer.observe(el);
  });
}

/* ===== Student Cards ===== */
async function checkStudentPageExists(number) {
  try {
    const response = await fetch(`students/student${number}.html`, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
}

function createStudentCard(student, exists) {
  const { id: number, name, studentId } = student;
  const card = document.createElement('a');
  card.href = `students/student${number}/student${number}.html`;
  card.className = `student-card${exists ? ' ready' : ''}`;
  card.style.transitionDelay = `${(number - 1) * 0.05}s`;

  card.innerHTML = `
    <div class="student-number">STUDENT ${String(number).padStart(2, '0')}</div>
    <div class="student-avatar">${getInitials(name)}</div>
    <div class="student-name">${name}</div>
    ${studentId ? `<div class="student-id">${studentId}</div>` : ''}
    <div class="student-status">${exists ? 'พร้อมแล้ว' : 'รอสร้างหน้า...'}</div>
  `;

  if (!exists) {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      card.style.transform = 'scale(0.95)';
      setTimeout(() => {
        card.style.transform = '';
      }, 150);
    });
  }

  return card;
}

async function buildStudentGrid() {
  const grid = document.getElementById('studentsGrid');
  if (!grid) return;

  const students = getStudents();
  const checks = await Promise.all(
    students.map((s) => checkStudentPageExists(s.id))
  );

  students.forEach((student, index) => {
    grid.appendChild(createStudentCard(student, checks[index]));
  });

  initScrollReveal();
}

/* ===== Navbar ===== */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  });

  toggle?.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    toggle.classList.toggle('active', isOpen);
    toggle.setAttribute('aria-expanded', isOpen);
  });

  navLinks?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      toggle?.classList.remove('active');
      toggle?.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ===== Init ===== */
document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  animateCounters();
  initNavbar();
  buildStudentGrid();
});
