document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.site-header');
    const headerHeight = header ? header.offsetHeight : 0;

    const navToggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('.nav');
    if (navToggle && nav) {
        navToggle.addEventListener('click', () => {
            const isOpen = nav.classList.toggle('open');
            navToggle.setAttribute('aria-expanded', String(isOpen));
        });
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.proof-card, .skill-card, .project-card, .timeline-item, .contact-panel, .document-card').forEach(item => {
        item.classList.add('reveal');
        observer.observe(item);
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href').slice(1);
            const target = document.getElementById(targetId);
            if (target) {
                e.preventDefault();
                const y = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 12;
                window.scrollTo({ top: y, behavior: 'smooth' });
                if (nav && nav.classList.contains('open')) {
                    nav.classList.remove('open');
                    navToggle?.setAttribute('aria-expanded', 'false');
                }
            }
        });
    });

    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-pressed', 'false');
            });
            button.classList.add('active');
            button.setAttribute('aria-pressed', 'true');

            projectCards.forEach(card => {
                const categories = card.dataset.category || '';
                const shouldShow = filter === 'all' || categories.split(' ').includes(filter);
                card.hidden = !shouldShow;
            });
        });
    });
});
