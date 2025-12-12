document.addEventListener('DOMContentLoaded', function () {
  const tags = Array.from(document.querySelectorAll('.skill-tag'));
  const projects = Array.from(document.querySelectorAll('.project-card'));

  function clearActiveTags() {
    tags.forEach(t => {
      t.classList.remove('active');
      t.setAttribute('aria-pressed', 'false');
    });
  }

  function filterProjectsBySkill(skill) {
    if (!skill) {
      projects.forEach(p => p.removeAttribute('hidden'));
      return;
    }
    projects.forEach(p => {
      const skills = p.dataset.skills ? p.dataset.skills.split(',').map(s => s.trim().toLowerCase()) : [];
      if (skills.includes(skill.toLowerCase())) {
        p.removeAttribute('hidden');
      } else {
        p.setAttribute('hidden', '');
      }
    });
  }

  tags.forEach(tag => {
    // click handler
    tag.addEventListener('click', () => {
      const isPressed = tag.getAttribute('aria-pressed') === 'true';
      // toggle behavior: if already active, clear filter
      if (isPressed) {
        tag.classList.remove('active');
        tag.setAttribute('aria-pressed', 'false');
        filterProjectsBySkill(null);
      } else {
        clearActiveTags();
        tag.classList.add('active');
        tag.setAttribute('aria-pressed', 'true');
        filterProjectsBySkill(tag.dataset.skill);
      }
    });

    // keyboard accessibility: allow Enter/Space to activate
    tag.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        tag.click();
      }
    });
  });

  // support deep linking: ?skill=Python
  const params = new URLSearchParams(window.location.search);
  const skillParam = params.get('skill');
  if (skillParam) {
    const target = tags.find(t => t.dataset.skill.toLowerCase() === skillParam.toLowerCase());
    if (target) target.click();
  }

  // Header variant preview and selection
  const headerChoices = Array.from(document.querySelectorAll('.header-choice'));
  const headerVariants = Array.from(document.querySelectorAll('.header-variant'));
  const siteHeader = document.querySelector('.site-header');

  function setHeaderVariant(name, persist = true) {
    headerVariants.forEach(v => {
      const match = v.dataset.variant === name;
      v.classList.toggle('active', match);
      v.setAttribute('aria-hidden', match ? 'false' : 'true');
    });
    headerChoices.forEach(c => c.setAttribute('aria-selected', c.dataset.variant === name ? 'true' : 'false'));
    // apply bg-image as header background
    if (name === 'bg-image') {
      siteHeader.classList.add('bg-image');
      siteHeader.style.backgroundImage = 'url("header.png")';
    } else {
      siteHeader.classList.remove('bg-image');
      siteHeader.style.backgroundImage = '';
    }
    if (persist && window.localStorage) localStorage.setItem('headerVariant', name);
  }

  headerChoices.forEach(choice => {
    choice.addEventListener('click', () => setHeaderVariant(choice.dataset.variant));
  });

  // initialize from localStorage or default to logo-left
  const saved = (window.localStorage && localStorage.getItem('headerVariant')) || 'logo-left';
  setHeaderVariant(saved, false);
});
