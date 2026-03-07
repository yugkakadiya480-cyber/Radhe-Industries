document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const body = document.body;

    // Create a menu header with close button at the top of the nav-links panel
    // Only create it if it doesn't already exist (in case script runs twice)
    if (navLinks && !document.getElementById('mobileMenuHeader')) {
        const menuHeader = document.createElement('li'); // Must be an li since parent is ul
        menuHeader.id = 'mobileMenuHeader';
        menuHeader.style.cssText = `
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 1.2rem 1.5rem;
            border-bottom: 1px solid #eee;
            background: white;
            position: sticky;
            top: 0;
            z-index: 10;
            width: 100%;
            margin-bottom: 0.5rem;
        `;
        menuHeader.innerHTML = `
            <span style="font-size: 1rem; font-weight: 700; color: #1a1a1a; text-transform: uppercase; letter-spacing: 1px;">Menu</span>
            <button id="menuCloseBtn" aria-label="Close menu" style="
                background: none;
                border: none;
                font-size: 1.6rem;
                cursor: pointer;
                color: #333;
                padding: 0.2rem 0.4rem;
                line-height: 1;
                display: flex;
                align-items: center;
            ">&times;</button>
        `;

        // Insert header as first child of navLinks
        navLinks.insertBefore(menuHeader, navLinks.firstChild);

        // Ensure nav items have side padding directly via CSS (instead of a div wrapper)
        navLinks.querySelectorAll('.nav-item').forEach(item => {
            item.style.paddingLeft = '1.5rem';
            item.style.paddingRight = '1.5rem';
        });
    }

    function openMenu() {
        navLinks.classList.add('active');
        menuToggle.classList.add('open');
        body.style.overflow = 'hidden';
    }

    function closeMenu() {
        navLinks.classList.remove('active');
        menuToggle.classList.remove('open');
        body.style.overflow = '';
    }

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            if (navLinks.classList.contains('active')) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        // Close menu when clicking a link
        // Use a slight delay to allow navigation to trigger before hiding the menu
        navLinks.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                setTimeout(closeMenu, 50);
            });
        });

        // Close on close button click
        const closeBtn = document.getElementById('menuCloseBtn');
        if (closeBtn) {
            closeBtn.addEventListener('click', closeMenu);
        }

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (navLinks.classList.contains('active') && !navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
                closeMenu();
            }
        });
    }
});
