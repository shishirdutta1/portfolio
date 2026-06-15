const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-button');
const nav = document.querySelector('.main-nav');
const toast = document.getElementById('toast');

document.getElementById('year').textContent = new Date().getFullYear();

menuButton?.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
});

nav?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('in-view');
  });
}, { threshold: 0.16 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove('show'), 2800);
}

document.querySelectorAll('.pending').forEach(link => {
  link.addEventListener('click', event => {
    const message = link.dataset.pending;
    if (message) {
      event.preventDefault();
      showToast(message);
    }
  });
});

const canvas = document.getElementById('ambient-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let width = 0;
let height = 0;
let mouse = { x: 0, y: 0, active: false };

function resizeCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  width = canvas.width = Math.floor(window.innerWidth * dpr);
  height = canvas.height = Math.floor(window.innerHeight * dpr);
  canvas.style.width = window.innerWidth + 'px';
  canvas.style.height = window.innerHeight + 'px';
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const count = reduceMotion ? 0 : Math.min(54, Math.max(22, Math.floor(window.innerWidth / 34)));
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: Math.random() * 1.8 + .7,
    vx: (Math.random() - .5) * .18,
    vy: (Math.random() - .5) * .18,
    a: Math.random() * .20 + .06
  }));
}

function animateCanvas() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  const scrollFactor = window.scrollY * 0.0008;
  particles.forEach((p, i) => {
    p.x += p.vx + Math.sin(scrollFactor + i) * .045;
    p.y += p.vy + Math.cos(scrollFactor + i) * .035;
    if (p.x < -20) p.x = window.innerWidth + 20;
    if (p.x > window.innerWidth + 20) p.x = -20;
    if (p.y < -20) p.y = window.innerHeight + 20;
    if (p.y > window.innerHeight + 20) p.y = -20;
    const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 8);
    gradient.addColorStop(0, `rgba(21, 202, 121, ${p.a})`);
    gradient.addColorStop(1, 'rgba(21, 202, 121, 0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r * 6, 0, Math.PI * 2);
    ctx.fill();
    for (let j = i + 1; j < particles.length; j++) {
      const q = particles[j];
      const dx = p.x - q.x;
      const dy = p.y - q.y;
      const distance = Math.hypot(dx, dy);
      if (distance < 92) {
        ctx.strokeStyle = `rgba(8, 122, 77, ${(1 - distance / 92) * .07})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(q.x, q.y);
        ctx.stroke();
      }
    }
  });
  if (!window.matchMedia || !window.matchMedia('(prefers-reduced-motion: reduce)').matches) requestAnimationFrame(animateCanvas);
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();
animateCanvas();

const tiltCards = document.querySelectorAll('.tilt-card');
tiltCards.forEach(card => {
  card.addEventListener('pointermove', event => {
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - .5;
    const y = (event.clientY - rect.top) / rect.height - .5;
    card.style.transform = `perspective(1000px) rotateY(${x * 7}deg) rotateX(${-y * 7}deg)`;
  });
  card.addEventListener('pointerleave', () => {
    card.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg)';
  });
});

let lastY = window.scrollY;
window.addEventListener('scroll', () => {
  const currentY = window.scrollY;
  header.style.transform = currentY > lastY && currentY > 220 ? 'translateX(-50%) translateY(-88px)' : 'translateX(-50%) translateY(0)';
  lastY = currentY;
}, { passive: true });


// Homepage navigation, animated section accents, and back-to-top control.
const brandHome = document.querySelector('.brand');
const backToTop = document.getElementById('back-to-top');
const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)');

function scrollToPageTop() {
  window.scrollTo({
    top: 0,
    behavior: prefersReducedMotion?.matches ? 'auto' : 'smooth'
  });
}

brandHome?.addEventListener('click', event => {
  event.preventDefault();
  nav?.classList.remove('open');
  menuButton?.setAttribute('aria-expanded', 'false');
  scrollToPageTop();
  if (window.location.hash) {
    try { history.replaceState(null, '', window.location.href.split('#')[0]); } catch (_) { /* scrolling still succeeds */ }
  }
});

backToTop?.addEventListener('click', scrollToPageTop);

function updateBackToTop() {
  backToTop?.classList.toggle('is-visible', window.scrollY > 520);
}

window.addEventListener('scroll', updateBackToTop, { passive: true });
updateBackToTop();

if (!prefersReducedMotion?.matches) {
  document.querySelectorAll('.section-shell:not(.hero)').forEach((section, index) => {
    if (section.querySelector(':scope > .motion-graphics')) return;
    const layer = document.createElement('div');
    layer.className = 'motion-graphics';
    layer.setAttribute('aria-hidden', 'true');
    layer.style.setProperty('--motion-delay', `${index * -1.15}s`);
    layer.innerHTML = `
      <span class="motion-shape motion-shape--ring"></span>
      <span class="motion-shape motion-shape--dot"></span>
      <span class="motion-shape motion-shape--diamond"></span>
    `;
    section.prepend(layer);
  });
}

// Portfolio Assistant: a private, static knowledge assistant for this website.
(() => {
  const knowledge = window.SHISHIR_ASSISTANT_KNOWLEDGE;
  const launcher = document.getElementById('assistant-launcher');
  const panel = document.getElementById('portfolio-assistant');
  const closeButton = document.getElementById('assistant-close');
  const messages = document.getElementById('assistant-messages');
  const suggestions = document.getElementById('assistant-suggestions');
  const form = document.getElementById('assistant-form');
  const input = document.getElementById('assistant-input');

  if (!knowledge || !launcher || !panel || !messages || !form || !input) return;

  const joinNatural = (items) => {
    if (!items.length) return '';
    if (items.length === 1) return items[0];
    if (items.length === 2) return `${items[0]} and ${items[1]}`;
    return `${items.slice(0, -1).join(', ')}, and ${items.at(-1)}`;
  };

  const numbered = (items) => items.map((item, index) => `${index + 1}. ${item}`).join('\n');
  const pairs = (items) => numbered(items.map(([title, issuer]) => `${title} — ${issuer}`));
  const normalize = (value) => value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // Match complete words or complete multi-word phrases. This prevents short
  // greetings such as "hi" from matching unrelated words such as "his" or "him".
  const hasPhrase = (text, phrase) => {
    const normalizedPhrase = normalize(phrase);
    if (!normalizedPhrase) return false;
    return (` ${text} `).includes(` ${normalizedPhrase} `);
  };

  const containsAny = (text, terms) => terms.some(term => hasPhrase(text, term));
  const wordCount = (text) => text ? text.split(' ').length : 0;

  const intents = {
    contact: [
      'contact', 'contact details', 'contact information', 'whatsapp', 'whats app',
      'whatsapp number', 'phone', 'phone number', 'mobile', 'mobile number',
      'number', 'contact number', 'contact no', 'whatsapp no', 'mobile no', 'telephone', 'reach', 'reach him', 'get in touch', 'connect with him',
      'upwork', 'behance', 'facebook', 'linkedin', 'email'
    ],
    authors: ['author', 'authors', 'coauthor', 'coauthors', 'co author', 'co authors', 'first author', 'third author', 'publication team'],
    publication: ['publication', 'publications', 'paper', 'journal', 'article', 'research paper', 'molecular pharming', 'doi'],
    education: ['education', 'educational background', 'degree', 'msc', 'masters', 'university', 'study', 'studied', 'academic background', 'qualification', 'qualifications'],
    about: ['who is he', 'what does he do', 'who is shishir', 'who is shishir dutta', 'about shishir', 'about him', 'introduce shishir', 'introduce him', 'profile', 'background', 'tell me about him', 'tell me about shishir'],
    skills: ['skill', 'skills', 'software', 'tools', 'technical skill', 'technical skills', 'illustrator', 'qgis', 'canva', 'biovia', 'microsoft office', 'soft skill', 'soft skills'],
    programming: ['python', 'r programming', 'machine learning', 'coding', 'programming'],
    design: ['graphic', 'graphics', 'graphic design', 'design', 'design work', 'logo', 'banner', 'poster', 'packaging', 'invitation'],
    projects: ['academic project', 'academic projects', 'project', 'projects', 'soil project', 'greenhouse', 'nursery', 'tds', 'wetland', 'salt', 'soil profile'],
    writing: ['poem', 'poems', 'poetry', 'story', 'stories', 'writer', 'writing', 'creative writing'],
    internships: ['internship', 'internships', 'intern', 'ysse', 'codealpha', 'biopc internship', 'professional exposure'],
    research: ['research', 'research role', 'research roles', 'research assistant', 'research associate', 'research experience', 'research activity', 'research work'],
    leadership: ['leadership', 'member', 'membership', 'secretary', 'coordinator', 'ambassador', 'cocurricular', 'co curricular'],
    social: ['social work', 'social activity', 'social activities', 'volunteer', 'volunteering', 'waste for hope', 'nistobdotar hasi', 'community'],
    certifications: ['certificate', 'certificates', 'certification', 'certifications', 'course', 'courses', 'training'],
    achievements: ['achievement', 'achievements', 'achivement', 'achivements', 'award', 'awards', 'honor', 'honors', 'honour', 'honours', 'contest', 'best volunteer', 'best intern', 'dedicated member'],
    availability: ['available', 'availability', 'hire', 'work with', 'collaborate', 'collaboration', 'opportunity', 'opportunities', 'freelance', 'freelancer'],
    overview: ['everything', 'all about', 'summary', 'overview', 'full profile']
  };

  function answerQuestion(rawQuestion) {
    const q = normalize(rawQuestion);
    const p = knowledge.profile;
    const pub = knowledge.publication;

    if (!q) return 'Please type a question about Shishir.';

    // Specific intents are checked before greetings so questions such as
    // "What is his WhatsApp number?" always receive the requested information.
    if (containsAny(q, intents.contact)) {
      if (containsAny(q, ['whatsapp', 'whats app', 'phone', 'phone number', 'mobile', 'mobile number', 'number'])) {
        return `Shishir Dutta's WhatsApp number is ${knowledge.contact.whatsappDisplay}. You can also use the WhatsApp button in the Contact section to message him directly.`;
      }
      if (hasPhrase(q, 'facebook')) {
        return `Shishir's Facebook profile is available at ${knowledge.contact.facebook}.`;
      }
      if (hasPhrase(q, 'linkedin')) {
        return `Shishir's LinkedIn profile is available at ${knowledge.contact.linkedin}.`;
      }
      if (hasPhrase(q, 'behance')) {
        return `Shishir's Behance portfolio is available at ${knowledge.contact.behance}.`;
      }
      if (hasPhrase(q, 'upwork')) {
        return `Shishir's Upwork profile is available at ${knowledge.contact.upwork}.`;
      }
      if (hasPhrase(q, 'email')) {
        return 'An email address is not currently listed in the approved portfolio information. You can contact Shishir through WhatsApp, Facebook, LinkedIn, Behance, or Upwork.';
      }
      return `You can contact Shishir on WhatsApp at ${knowledge.contact.whatsappDisplay}. His Facebook, LinkedIn, Behance, and Upwork profiles are linked in the Contact section.`;
    }

    if (containsAny(q, intents.authors) && containsAny(q, intents.publication)) {
      return `Publication: “${pub.title}”\nJournal: ${pub.journal}\n${pub.authorshipNote}\n\nComplete author list:\n${numbered(pub.authors)}\n\nThe paper can be opened from the View Paper button in the Academic Projects section.`;
    }

    if (containsAny(q, intents.authors)) {
      return `${pub.authorshipNote}\n\nComplete author list:\n${numbered(pub.authors)}`;
    }

    if (containsAny(q, intents.publication)) {
      return `Publication: “${pub.title}”\nJournal: ${pub.journal}\n${pub.authorshipNote}\nAuthors: ${pub.authors.join(', ')}\nThe paper can be opened from the View Paper button in the Academic Projects section.`;
    }

    if (containsAny(q, intents.education)) {
      return p.education;
    }

    if (containsAny(q, intents.about)) {
      return `${p.summary} ${p.education} ${p.interests}`;
    }

    if (containsAny(q, intents.skills)) {
      return `Technical skills: ${joinNatural(knowledge.skills.technical)}.\n\nSoft skills: ${joinNatural(knowledge.skills.soft)}.`;
    }

    if (containsAny(q, intents.programming)) {
      return 'The portfolio records certifications in R Programming for Beginners from Simplilearn and Python Machine Learning from Creative IT Institute. These are documented certifications; the website does not claim a specific advanced proficiency level beyond the approved portfolio information.';
    }

    if (containsAny(q, intents.design)) {
      return `Shishir’s graphics portfolio includes ${joinNatural(knowledge.graphics)}. His Behance portfolio is linked in the Graphics Projects and Contact sections.`;
    }

    if (containsAny(q, intents.projects)) {
      return `Academic projects:\n${numbered(knowledge.academicProjects)}`;
    }

    if (containsAny(q, intents.writing)) {
      return `Writing work includes:\n${numbered(knowledge.writing)}\nThe published poem and story link is available in the Writing Projects section.`;
    }

    if (containsAny(q, intents.internships)) {
      return `Internship and professional exposure:\n${numbered(knowledge.internships.map(item => `${item.role} — ${item.organization}`))}`;
    }

    if (containsAny(q, intents.research)) {
      return `Research roles:\n${numbered(knowledge.researchRoles)}`;
    }

    if (containsAny(q, intents.leadership)) {
      return `Leadership and membership roles:\n${numbered(knowledge.leadership)}`;
    }

    if (containsAny(q, intents.social)) {
      return `Social and community activity:\n${numbered(knowledge.socialActivities)}`;
    }

    if (containsAny(q, intents.certifications)) {
      return `Shishir has ${knowledge.certifications.length} listed certifications:\n${pairs(knowledge.certifications)}`;
    }

    if (containsAny(q, intents.achievements)) {
      return `Shishir has ${knowledge.achievements.length} listed achievements and honors:\n${pairs(knowledge.achievements)}`;
    }

    if (containsAny(q, intents.availability)) {
      return p.availability;
    }

    if (containsAny(q, intents.overview)) {
      return `${p.summary}\n\nEducation: ${p.education}\nTechnical skills: ${joinNatural(knowledge.skills.technical)}.\nResearch roles: ${knowledge.researchRoles.join('; ')}.\nInternships: ${knowledge.internships.map(item => item.organization).join(', ')}.\nPublication: “${pub.title}” in ${pub.journal}.\nThe portfolio also includes design work, writing, certifications, achievements, leadership, and social activities.`;
    }

    const greetingTerms = ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'assalamu alaikum', 'salam'];
    if (wordCount(q) <= 4 && containsAny(q, greetingTerms)) {
      return `Hello! I can answer questions about ${p.name}'s education, skills, projects, publication, internships, activities, certifications, achievements, and contact details.`;
    }

    if (containsAny(q, ['help', 'what can you do', 'what can i ask', 'how do you work'])) {
      return 'You can ask about Shishir’s background, education, technical or soft skills, design work, academic projects, publication and co-authors, writing, internships, research roles, leadership, social activities, certifications, achievements, availability, or contact details.';
    }

    return 'I could not match that question to the approved portfolio information. Try asking about Shishir’s education, skills, projects, publication, authors, internships, research, certifications, achievements, writing, availability, or contact details.';
  }

  // Expose the pure answer function for simple browser-console testing and
  // future maintenance without exposing any private service credentials.
  window.SHISHIR_ASSISTANT_ANSWER = answerQuestion;

  function appendMessage(text, sender) {
    const row = document.createElement('div');
    row.className = `assistant-message assistant-message--${sender}`;
    const bubble = document.createElement('div');
    bubble.className = 'assistant-bubble';
    bubble.textContent = text;
    row.appendChild(bubble);
    messages.appendChild(row);
    messages.scrollTop = messages.scrollHeight;
    return row;
  }

  function appendTyping() {
    const row = document.createElement('div');
    row.className = 'assistant-message assistant-message--bot assistant-typing';
    row.setAttribute('aria-label', 'Assistant is typing');
    const bubble = document.createElement('div');
    bubble.className = 'assistant-bubble';
    bubble.innerHTML = '<i></i><i></i><i></i>';
    row.appendChild(bubble);
    messages.appendChild(row);
    messages.scrollTop = messages.scrollHeight;
    return row;
  }

  function submitQuestion(question) {
    const cleanQuestion = question.trim();
    if (!cleanQuestion) return;
    appendMessage(cleanQuestion, 'user');
    input.value = '';
    input.disabled = true;
    const typing = appendTyping();
    const delay = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ? 0 : 360;
    window.setTimeout(() => {
      typing.remove();
      appendMessage(answerQuestion(cleanQuestion), 'bot');
      input.disabled = false;
      input.focus();
    }, delay);
  }

  function openAssistant() {
    panel.classList.add('is-open');
    panel.setAttribute('aria-hidden', 'false');
    launcher.setAttribute('aria-expanded', 'true');
    document.body.classList.add('assistant-open');
    window.setTimeout(() => input.focus(), 120);
  }

  function closeAssistant() {
    panel.classList.remove('is-open');
    panel.setAttribute('aria-hidden', 'true');
    launcher.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('assistant-open');
    launcher.focus();
  }

  launcher.addEventListener('click', openAssistant);
  closeButton?.addEventListener('click', closeAssistant);
  form.addEventListener('submit', event => {
    event.preventDefault();
    submitQuestion(input.value);
  });
  suggestions?.addEventListener('click', event => {
    const button = event.target.closest('[data-question]');
    if (button) submitQuestion(button.dataset.question || button.textContent);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && panel.classList.contains('is-open')) closeAssistant();
  });
})();
