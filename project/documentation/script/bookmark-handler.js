// scroll-spy.js or inside your main script
let currentObserver = null;

export function InitScrollSpy() {
    // 1. Clean up old observer if it exists
    if (currentObserver) currentObserver.disconnect();

    const tocItems = document.querySelectorAll('.toc-item');
    const sections = [];

    // 2. Map TOC links to actual elements in the DOM
    tocItems.forEach(item => {
        const link = item.querySelector('a');
        if (link) {
            const targetId = link.getAttribute('href')?.slice(1);
            const section = document.getElementById(targetId);
            if (section) sections.push({ item, section });
        }
    });

    const options = {
        root: null,
        // Detects when the bookmark is roughly in the top 25% of the viewport
        rootMargin: '-10% 0px -80% 0px',
        threshold: 0
    };

    currentObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Remove active class from ALL items
                tocItems.forEach(i => i.classList.remove('active'));

                // Find the TOC item associated with this section and activate it
                const activeData = sections.find(s => s.section === entry.target);
                if (activeData) {
                    activeData.item.classList.add('active');

                    // Optional: Scroll the sidebar to keep the active item in view
                    activeData.item.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
                }
            }
        });
    }, options);

    // 3. Start observing
    sections.forEach(s => currentObserver.observe(s.section));
}