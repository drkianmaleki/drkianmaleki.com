document.addEventListener('DOMContentLoaded', () => {
    // 1. Reveal Elements on Scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
            }
        });
    }, { threshold: 0.1 });

    const items = document.querySelectorAll('.bridge-card, .skill-card, .project-card, .timeline-item');
    items.forEach(item => {
        item.style.opacity = "0";
        item.style.transform = "translateY(20px)";
        item.style.transition = "all 0.6s ease-out";
        observer.observe(item);
    });

    // 2. Offset scroll for anchor links (sticky header fix)
    const header = document.querySelector('.site-header');
    const headerHeight = header ? header.offsetHeight : 0;
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href').slice(1);
            const target = document.getElementById(targetId);
            if (target) {
                e.preventDefault();
                const y = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 10;
                window.scrollTo({ top: y, behavior: 'smooth' });
            }
        });
    });
});