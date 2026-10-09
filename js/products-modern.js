/* ==========================================================================
   RADHE INDUSTRIES — MODERN PRODUCTS PAGE JS
   Interactive Category Filtering & Real-Time Search Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    const filterPills = document.querySelectorAll('.filter-pill-btn');
    const searchInput = document.getElementById('productSearchInput');
    const productCards = document.querySelectorAll('.mod-product-card');

    let currentFilter = 'all';
    let currentSearchText = '';

    const filterProducts = () => {
        productCards.forEach(card => {
            const category = card.getAttribute('data-category') || 'beverage';
            const title = (card.getAttribute('data-title') || '').toLowerCase();
            const desc = (card.getAttribute('data-desc') || '').toLowerCase();

            const matchesCategory = (currentFilter === 'all') || (category === currentFilter);
            const matchesSearch = (currentSearchText === '') || 
                title.includes(currentSearchText) || 
                desc.includes(currentSearchText);

            if (matchesCategory && matchesSearch) {
                if (card.classList.contains('hidden-by-filter')) {
                    card.classList.remove('hidden-by-filter');
                    card.classList.add('animate-in');
                    setTimeout(() => card.classList.remove('animate-in'), 400);
                }
            } else {
                card.classList.add('hidden-by-filter');
                card.classList.remove('animate-in');
            }
        });
    };

    // Filter pill click events
    filterPills.forEach(pill => {
        pill.addEventListener('click', () => {
            filterPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            currentFilter = pill.getAttribute('data-filter') || 'all';
            filterProducts();
        });
    });

    // Real-time search input event
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentSearchText = e.target.value.trim().toLowerCase();
            filterProducts();
        });
    }
});
