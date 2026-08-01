/* ==========================================================================
   Amazon-Style Checkout with Clean Lightbox & Rate Matching (No Rotation)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // --- Official Product Catalog with Lightbox Specs ---
    const products = [
        // --- 180-ML Category ---
        {
            id: '180-tower',
            category: '180ml',
            code: 'TW1840',
            name: '180-ML TOWER Design Paper Cups',
            desc: '80 Pcs / Pack × 100 Packs | 1 Carton (Box) = 8,000 Pcs',
            pcsPerCarton: 8000,
            pricePerCarton: 3080.00,
            pricePerPiece: (3080 / 8000).toFixed(3),
            image: 'images/uploads/TOWER2 180-ML.png',
            diameter: '70MM',
            height: '80MM',
            cartons: 2
        },
        {
            id: '180-hexa-cut',
            category: '180ml',
            code: 'HX1800',
            name: '180-ML HEXA (Cut Size) Paper Cups',
            desc: '80 Pcs / Pack × 100 Packs | 1 Carton (Box) = 8,000 Pcs',
            pcsPerCarton: 8000,
            pricePerCarton: 2860.00,
            pricePerPiece: (2860 / 8000).toFixed(3),
            image: 'images/uploads/hexa-180ml.jpeg',
            diameter: '70MM',
            height: '78MM',
            cartons: 0
        },
        {
            id: '180-hexa-med',
            category: '180ml',
            code: 'HX1810',
            name: '180-ML HEXA (Medium Size) Paper Cups',
            desc: '80 Pcs / Pack × 100 Packs | 1 Carton (Box) = 8,000 Pcs',
            pcsPerCarton: 8000,
            pricePerCarton: 3080.00,
            pricePerPiece: (3080 / 8000).toFixed(3),
            image: 'images/uploads/HEXA2 180-ML.jpeg',
            diameter: '70MM',
            height: '80MM',
            cartons: 0
        },
        {
            id: '180-checks-med',
            category: '180ml',
            code: 'CH1830',
            name: '180-ML CHECKS Medium Paper Cups',
            desc: '80 Pcs / Pack × 100 Packs | 1 Carton (Box) = 8,000 Pcs',
            pcsPerCarton: 8000,
            pricePerCarton: 2860.00,
            pricePerPiece: (2860 / 8000).toFixed(3),
            image: 'images/uploads/CHECKS2 180-ML.png',
            diameter: '70MM',
            height: '80MM',
            cartons: 0
        },
        {
            id: '180-checks-cut',
            category: '180ml',
            code: 'CH1825',
            name: '180-ML CHECKS Cut Size Paper Cups',
            desc: '80 Pcs / Pack × 100 Packs | 1 Carton (Box) = 8,000 Pcs',
            pcsPerCarton: 8000,
            pricePerCarton: 2640.00,
            pricePerPiece: (2640 / 8000).toFixed(3),
            image: 'images/uploads/CHECKS2.png',
            diameter: '70MM',
            height: '75MM',
            cartons: 0
        },
        {
            id: '180-plain',
            category: '180ml',
            code: 'PL1818',
            name: '180-ML PLAIN Eco White Paper Cups',
            desc: '80 Pcs / Pack × 100 Packs | 1 Carton (Box) = 8,000 Pcs',
            pcsPerCarton: 8000,
            pricePerCarton: 3960.00,
            pricePerPiece: (3960 / 8000).toFixed(3),
            image: 'images/plain-180ml.png',
            diameter: '70MM',
            height: '80MM',
            cartons: 0
        },
        {
            id: '180-spiral',
            category: '180ml',
            code: 'SP1816',
            name: '180-ML SPIRAL Printed Paper Cups',
            desc: '80 Pcs / Pack × 100 Packs | 1 Carton (Box) = 8,000 Pcs',
            pcsPerCarton: 8000,
            pricePerCarton: 3080.00,
            pricePerPiece: (3080 / 8000).toFixed(3),
            image: 'images/uploads/SPIRAL2.png',
            diameter: '70MM',
            height: '80MM',
            cartons: 0
        },
        {
            id: '180-mocktail',
            category: '180ml',
            code: 'TW1823',
            name: '180-ML MOCKTAIL Party Cups',
            desc: '50 Pcs / Pack × 100 Packs | 1 Carton (Box) = 5,000 Pcs',
            pcsPerCarton: 5000,
            pricePerCarton: 3165.00,
            pricePerPiece: (3165 / 5000).toFixed(3),
            image: 'images/MOCKTAIL.png',
            diameter: '70MM',
            height: '80MM',
            cartons: 0
        },

        // --- 200-ML Category ---
        {
            id: '200-tower-med',
            category: '200ml',
            code: 'TW1850',
            name: '200-ML TOWER Medium Paper Cups',
            desc: '80 Pcs / Pack × 100 Packs | 1 Carton (Box) = 8,000 Pcs',
            pcsPerCarton: 8000,
            pricePerCarton: 3300.00,
            pricePerPiece: (3300 / 8000).toFixed(3),
            image: 'images/uploads/TOWER 180-ML.png',
            diameter: '70MM',
            height: '85MM',
            cartons: 0
        },
        {
            id: '200-tower-lrg',
            category: '200ml',
            code: 'TW2025',
            name: '200-ML TOWER Large Paper Cups',
            desc: '50 Pcs / Pack × 100 Packs | 1 Carton (Box) = 5,000 Pcs',
            pcsPerCarton: 5000,
            pricePerCarton: 3440.00,
            pricePerPiece: (3440 / 5000).toFixed(3),
            image: 'images/uploads/TOWER 200-ML.png',
            diameter: '80MM',
            height: '85MM',
            cartons: 0
        },
        {
            id: '200-hexa-full',
            category: '200ml',
            code: 'HX2012',
            name: '200-ML HEXA Full Size Paper Cups',
            desc: '80 Pcs / Pack × 100 Packs | 1 Carton (Box) = 8,000 Pcs',
            pcsPerCarton: 8000,
            pricePerCarton: 3300.00,
            pricePerPiece: (3300 / 8000).toFixed(3),
            image: 'images/uploads/HEXA4 180-ML.jpeg',
            diameter: '70MM',
            height: '85MM',
            cartons: 0
        },
        {
            id: '200-hexa-lrg',
            category: '200ml',
            code: 'HX2029',
            name: '200-ML HEXA Large Size Paper Cups',
            desc: '50 Pcs / Pack × 108 Packs | 1 Carton (Box) = 5,400 Pcs',
            pcsPerCarton: 5400,
            pricePerCarton: 4455.00,
            pricePerPiece: (4455 / 5400).toFixed(3),
            image: 'images/uploads/HEXA6 180-ML.jpg',
            diameter: '80MM',
            height: '85MM',
            cartons: 0
        },
        {
            id: '200-checks-full',
            category: '200ml',
            code: 'CH1817',
            name: '200-ML CHECKS Full Size Paper Cups',
            desc: '80 Pcs / Pack × 100 Packs | 1 Carton (Box) = 8,000 Pcs',
            pcsPerCarton: 8000,
            pricePerCarton: 3520.00,
            pricePerPiece: (3520 / 8000).toFixed(3),
            image: 'images/uploads/CKECKS FULL.png',
            diameter: '70MM',
            height: '85MM',
            cartons: 0
        },
        {
            id: '200-plain',
            category: '200ml',
            code: 'PL2017',
            name: '200-ML PLAIN Eco Paper Cups',
            desc: '80 Pcs / Pack × 100 Packs | 1 Carton (Box) = 8,000 Pcs',
            pcsPerCarton: 8000,
            pricePerCarton: 3960.00,
            pricePerPiece: (3960 / 8000).toFixed(3),
            image: 'images/uploads/PLAIN 200-ML.png',
            diameter: '70MM',
            height: '85MM',
            cartons: 0
        },
        {
            id: '200-spiral',
            category: '200ml',
            code: 'SP1815',
            name: '200-ML SPIRAL Paper Cups',
            desc: '80 Pcs / Pack × 100 Packs | 1 Carton (Box) = 8,000 Pcs',
            pcsPerCarton: 8000,
            pricePerCarton: 3300.00,
            pricePerPiece: (3300 / 8000).toFixed(3),
            image: 'images/uploads/SPIRAL200ML3.png',
            diameter: '70MM',
            height: '85MM',
            cartons: 0
        },

        // --- 225-ML Category ---
        {
            id: '225-tower',
            category: '225ml',
            code: 'TW2250',
            name: '225-ML TOWER Paper Cups',
            desc: '80 Pcs / Pack × 100 Packs | 1 Carton (Box) = 8,000 Pcs',
            pcsPerCarton: 8000,
            pricePerCarton: 3300.00,
            pricePerPiece: (3300 / 8000).toFixed(3),
            image: 'images/uploads/TOWER 225-ML.png',
            diameter: '70MM',
            height: '90MM',
            cartons: 0
        },
        {
            id: '225-checks',
            category: '225ml',
            code: 'CH2214',
            name: '225-ML CHECKS Paper Cups',
            desc: '80 Pcs / Pack × 100 Packs | 1 Carton (Box) = 8,000 Pcs',
            pcsPerCarton: 8000,
            pricePerCarton: 3330.00,
            pricePerPiece: (3330 / 8000).toFixed(3),
            image: 'images/uploads/CHECKS 225-ML.png',
            diameter: '70MM',
            height: '90MM',
            cartons: 0
        },
        {
            id: '225-spiral1',
            category: '225ml',
            code: 'SP2236',
            name: '225-ML SPIRAL Design 1 Cups',
            desc: '80 Pcs / Pack × 100 Packs | 1 Carton (Box) = 8,000 Pcs',
            pcsPerCarton: 8000,
            pricePerCarton: 3740.00,
            pricePerPiece: (3740 / 8000).toFixed(3),
            image: 'images/uploads/SPIRAL 225-ML.png',
            diameter: '74MM',
            height: '90MM',
            cartons: 0
        },
        {
            id: '225-spiral2',
            category: '225ml',
            code: 'SP2215',
            name: '225-ML SPIRAL Design 2 Cups',
            desc: '80 Pcs / Pack × 100 Packs | 1 Carton (Box) = 8,000 Pcs',
            pcsPerCarton: 8000,
            pricePerCarton: 3520.00,
            pricePerPiece: (3520 / 8000).toFixed(3),
            image: 'images/uploads/SPIRAL2 225-ML.png',
            diameter: '70MM',
            height: '90MM',
            cartons: 0
        },

        // --- 250-ML Category ---
        {
            id: '250-tower',
            category: '250ml',
            code: 'TW2240',
            name: '250-ML TOWER Paper Cups',
            desc: '50 Pcs / Pack × 100 Packs | 1 Carton (Box) = 5,000 Pcs',
            pcsPerCarton: 5000,
            pricePerCarton: 3440.00,
            pricePerPiece: (3440 / 5000).toFixed(3),
            image: 'images/uploads/TOWER 225-ML.png',
            diameter: '80MM',
            height: '95MM',
            cartons: 0
        },
        {
            id: '250-spiral1',
            category: '250ml',
            code: 'SP2525',
            name: '250-ML SPIRAL (80mm Rim) Cups',
            desc: '50 Pcs / Pack × 100 Packs | 1 Carton (Box) = 5,000 Pcs',
            pcsPerCarton: 5000,
            pricePerCarton: 3440.00,
            pricePerPiece: (3440 / 5000).toFixed(3),
            image: 'images/uploads/SPIRAL 225-ML.png',
            diameter: '80MM',
            height: '95MM',
            cartons: 0
        },
        {
            id: '250-spiral2',
            category: '250ml',
            code: 'SP2517',
            name: '250-ML SPIRAL (74mm Slim) Cups',
            desc: '80 Pcs / Pack × 100 Packs | 1 Carton (Box) = 8,000 Pcs',
            pcsPerCarton: 8000,
            pricePerCarton: 4180.00,
            pricePerPiece: (4180 / 8000).toFixed(3),
            image: 'images/uploads/SPIRAL 250ML.png',
            diameter: '74MM',
            height: '98MM',
            cartons: 0
        },
        {
            id: '250-plain-med',
            category: '250ml',
            code: 'PL2550',
            name: '250-ML PLAIN Medium Paper Cups',
            desc: '50 Pcs / Pack × 100 Packs | 1 Carton (Box) = 5,000 Pcs',
            pcsPerCarton: 5000,
            pricePerCarton: 3440.00,
            pricePerPiece: (3440 / 5000).toFixed(3),
            image: 'images/uploads/PLAIN 250-ML.png',
            diameter: '80MM',
            height: '95MM',
            cartons: 0
        },
        {
            id: '250-plain-hvy',
            category: '250ml',
            code: 'PL2540',
            name: '250-ML PLAIN Heavy Paper Cups',
            desc: '50 Pcs / Pack × 100 Packs | 1 Carton (Box) = 5,000 Pcs',
            pcsPerCarton: 5000,
            pricePerCarton: 5500.00,
            pricePerPiece: (5500 / 5000).toFixed(3),
            image: 'images/uploads/plain 3.png',
            diameter: '80MM',
            height: '95MM',
            cartons: 0
        },
        {
            id: '250-plain-lgt',
            category: '250ml',
            code: 'PL2515',
            name: '250-ML PLAIN Light Paper Cups',
            desc: '50 Pcs / Pack × 100 Packs | 1 Carton (Box) = 5,000 Pcs',
            pcsPerCarton: 5000,
            pricePerCarton: 3165.00,
            pricePerPiece: (3165 / 5000).toFixed(3),
            image: 'images/uploads/PLAIN LIGHT.png',
            diameter: '80MM',
            height: '95MM',
            cartons: 0
        },

        // --- 300-ML Category ---
        {
            id: '300-plain-med',
            category: '300ml',
            code: 'PL3050',
            name: '300-ML PLAIN Medium Paper Cups',
            desc: '50 Pcs / Pack × 100 Packs | 1 Carton (Box) = 5,000 Pcs',
            pcsPerCarton: 5000,
            pricePerCarton: 3440.00,
            pricePerPiece: (3440 / 5000).toFixed(3),
            image: 'images/uploads/300-ML plain.png',
            diameter: '80MM',
            height: '110MM',
            cartons: 0
        },
        {
            id: '300-spiral',
            category: '300ml',
            code: 'SP3025',
            name: '300-ML SPIRAL Paper Cups',
            desc: '50 Pcs / Pack × 100 Packs | 1 Carton (Box) = 5,000 Pcs',
            pcsPerCarton: 5000,
            pricePerCarton: 3440.00,
            pricePerPiece: (3440 / 5000).toFixed(3),
            image: 'images/uploads/300-ML spiral.png',
            diameter: '80MM',
            height: '110MM',
            cartons: 0
        },
        {
            id: '300-tower',
            category: '300ml',
            code: 'TW3070',
            name: '300-ML TOWER Paper Cups',
            desc: '50 Pcs / Pack × 100 Packs | 1 Carton (Box) = 5,000 Pcs',
            pcsPerCarton: 5000,
            pricePerCarton: 3440.00,
            pricePerPiece: (3440 / 5000).toFixed(3),
            image: 'images/uploads/300-ML TOWER.png',
            diameter: '80MM',
            height: '105MM',
            cartons: 0
        },
        {
            id: '300-plain-hvy',
            category: '300ml',
            code: 'PL3040',
            name: '300-ML PLAIN Heavy Paper Cups',
            desc: '50 Pcs / Pack × 100 Packs | 1 Carton (Box) = 5,000 Pcs',
            pcsPerCarton: 5000,
            pricePerCarton: 5500.00,
            pricePerPiece: (5500 / 5000).toFixed(3),
            image: 'images/uploads/PLAIN 300.png',
            diameter: '80MM',
            height: '110MM',
            cartons: 0
        },

        // --- WATTI Category ---
        {
            id: 'watti-40',
            category: 'WATTI',
            code: 'PL4070',
            name: 'WATTI 40-ML Dessert Containers',
            desc: '70 Pcs / Pack × 190 Packs | 1 Carton (Box) = 13,300 Pcs',
            pcsPerCarton: 13300,
            pricePerCarton: 3610.00,
            pricePerPiece: (3610 / 13300).toFixed(3),
            image: 'images/uploads/PL 4070.png',
            diameter: '62MM',
            height: '30MM',
            cartons: 0
        },
        {
            id: 'watti-50-full',
            category: 'WATTI',
            code: 'PL5090',
            name: 'WATTI 50-ML (Full Size) Containers',
            desc: '80 Pcs / Pack × 100 Packs | 1 Carton (Box) = 8,000 Pcs',
            pcsPerCarton: 8000,
            pricePerCarton: 2550.00,
            pricePerPiece: (2550 / 8000).toFixed(3),
            image: 'images/uploads/PLAIN watti 50-ml.png',
            diameter: '70MM',
            height: '28MM',
            cartons: 0
        },
        {
            id: 'watti-50-med',
            category: 'WATTI',
            code: 'PL5060',
            name: 'WATTI 50-ML (Medium Size) Containers',
            desc: '80 Pcs / Pack × 100 Packs | 1 Carton (Box) = 8,000 Pcs',
            pcsPerCarton: 8000,
            pricePerCarton: 2300.00,
            pricePerPiece: (2300 / 8000).toFixed(3),
            image: 'images/uploads/PL 5060.png',
            diameter: '67MM',
            height: '30MM',
            cartons: 0
        },
        {
            id: 'watti-50-cut',
            category: 'WATTI',
            code: 'PL5080',
            name: 'WATTI 50-ML (Cut Size) Containers',
            desc: '80 Pcs / Pack × 100 Packs | 1 Carton (Box) = 8,000 Pcs',
            pcsPerCarton: 8000,
            pricePerCarton: 2300.00,
            pricePerPiece: (2300 / 8000).toFixed(3),
            image: 'images/uploads/50-ML WATTI.png',
            diameter: '67MM',
            height: '23MM',
            cartons: 0
        },
        {
            id: 'watti-100',
            category: 'WATTI',
            code: 'PL1018',
            name: 'WATTI 100-ML Ice Cream Bowls',
            desc: '50 Pcs / Pack × 100 Packs | 1 Carton (Box) = 5,000 Pcs',
            pcsPerCarton: 5000,
            pricePerCarton: 2750.00,
            pricePerPiece: (2750 / 5000).toFixed(3),
            image: 'images/uploads/WATTI 100-ML.png',
            diameter: '80MM',
            height: '40MM',
            cartons: 0
        },
        {
            id: 'watti-square',
            category: 'WATTI',
            code: 'SQ1010',
            name: 'SQUARE WATTI 100-ML Containers',
            desc: '50 Pcs / Pack × 160 Packs | 1 Carton (Box) = 8,000 Pcs',
            pcsPerCarton: 8000,
            pricePerCarton: 5760.00,
            pricePerPiece: (5760 / 8000).toFixed(3),
            image: 'images/uploads/SQUARE WATTI.png',
            diameter: '68×68MM',
            height: '40MM',
            cartons: 0
        },
        {
            id: 'watti-sunday',
            category: 'WATTI',
            code: 'PL1027',
            name: 'SUNDAY CUP 100-ML Bowls',
            desc: '50 Pcs / Pack × 100 Packs | 1 Carton (Box) = 5,000 Pcs',
            pcsPerCarton: 5000,
            pricePerCarton: 3715.00,
            pricePerPiece: (3715 / 5000).toFixed(3),
            image: 'images/uploads/Sunday cup.png',
            diameter: '80MM',
            height: '45MM',
            cartons: 0
        },

        // --- BOWL Category ---
        {
            id: 'bowl-105',
            category: 'BOWL',
            code: 'PL2015',
            name: 'BOWL 105mm Catering Bowls',
            desc: '50 Pcs / Pack × 50 Packs | 1 Carton (Box) = 2,500 Pcs',
            pcsPerCarton: 2500,
            pricePerCarton: 2250.00,
            pricePerPiece: (2250 / 2500).toFixed(3),
            image: 'images/uploads/BOWL.png',
            diameter: '105MM',
            height: '40MM',
            cartons: 0
        },

        // --- Vending & BRU / Others Category ---
        {
            id: 'vending-bru',
            category: 'Vending',
            code: 'T1270',
            name: 'BRU Vending Coffee Cups (120-ML)',
            desc: '70 Pcs / Pack × 190 Packs | 1 Carton (Box) = 13,300 Pcs',
            pcsPerCarton: 13300,
            pricePerCarton: 3990.00,
            pricePerPiece: (3990 / 13300).toFixed(3),
            image: 'images/uploads/BRU.png',
            diameter: '62MM',
            height: '65MM',
            cartons: 0
        },
        {
            id: 'vending-tower-120',
            category: 'Vending',
            code: 'T1271',
            name: '120-ML TOWER Vending Cups',
            desc: '70 Pcs / Pack × 190 Packs | 1 Carton (Box) = 13,300 Pcs',
            pcsPerCarton: 13300,
            pricePerCarton: 3990.00,
            pricePerPiece: (3990 / 13300).toFixed(3),
            image: 'images/uploads/TOWER2 120-ML.png',
            diameter: '62MM',
            height: '65MM',
            cartons: 0
        }
    ];

    let activeFilter = 'all';
    let currentStep = 1;
    let maxReachedStep = 1;
    let selectedDeliveryFee = 0;
    let selectedDeliveryName = 'Standard Freight (Free Delivery)';

    // Check URL parameters if redirected from price list e.g. ?code=PL3050
    const urlParams = new URLSearchParams(window.location.search);
    const preselectedCode = urlParams.get('code');
    if (preselectedCode) {
        const found = products.find(p => p.code.toUpperCase() === preselectedCode.toUpperCase());
        if (found) {
            found.cartons = 1;
        }
    }

    // --- DOM Elements ---
    const stepCards = {
        1: document.getElementById('amz-step-1'),
        2: document.getElementById('amz-step-2'),
        3: document.getElementById('amz-step-3'),
        4: document.getElementById('amz-step-4')
    };

    const stepItems = {
        1: document.getElementById('step-indicator-1'),
        2: document.getElementById('step-indicator-2'),
        3: document.getElementById('step-indicator-3'),
        4: document.getElementById('step-indicator-4')
    };

    // --- Filter Tabs for Product Selection ---
    function renderFilterTabs() {
        const filterContainer = document.getElementById('amz-category-filters');
        if (!filterContainer) return;

        const categories = [
            { id: 'all', label: 'All Products' },
            { id: '180ml', label: '📦 180-ML' },
            { id: '200ml', label: '📦 200-ML' },
            { id: '225ml', label: '📦 225-ML' },
            { id: '250ml', label: '📦 250-ML' },
            { id: '300ml', label: '📦 300-ML' },
            { id: 'WATTI', label: '🍧 WATTI' },
            { id: 'BOWL', label: '🍲 BOWL' },
            { id: 'Vending', label: '☕ BRU & Vending' }
        ];

        filterContainer.innerHTML = categories.map(cat => `
            <button type="button" class="amz-filter-btn ${activeFilter === cat.id ? 'active' : ''}" data-cat="${cat.id}">
                ${cat.label}
            </button>
        `).join('');

        filterContainer.querySelectorAll('.amz-filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                activeFilter = e.target.getAttribute('data-cat');
                renderFilterTabs();
                renderProducts();
            });
        });
    }

    // --- Render Products in Step 2 ---
    function renderProducts() {
        const container = document.getElementById('amz-product-list');
        if (!container) return;

        const filtered = activeFilter === 'all' 
            ? products 
            : products.filter(p => p.category === activeFilter);

        if (filtered.length === 0) {
            container.innerHTML = `<p style="padding: 2rem; text-align: center; color: var(--amz-text-muted);">No products found in this category.</p>`;
            return;
        }

        container.innerHTML = filtered.map((prod) => {
            const globalIndex = products.findIndex(p => p.id === prod.id);
            const lineTotal = prod.pricePerCarton * prod.cartons;
            const totalCups = prod.pcsPerCarton * prod.cartons;

            return `
                <div class="amz-product-item" data-id="${prod.id}">
                    <div class="amz-product-img-wrapper" title="Click to view product details & specifications">
                        <img src="${prod.image}" 
                             alt="${prod.name}" 
                             class="amz-product-img lightbox-trigger" 
                             data-name="${prod.name}"
                             data-code="${prod.code}"
                             data-category="${prod.category}"
                             data-diameter="${prod.diameter || '70MM'}"
                             data-height="${prod.height || '80MM'}"
                             data-src="${prod.image}"
                             onerror="this.onerror=null; this.src='images/plain-180ml.png';">
                    </div>
                    <div class="amz-product-details">
                        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 2px; flex-wrap: wrap;">
                            <h4>${prod.name}</h4>
                            <span class="amz-code-badge">CODE: ${prod.code}</span>
                        </div>
                        <p>${prod.desc}</p>
                        <div class="amz-pack-info">
                            <span><i class="fa-solid fa-box"></i> <strong>Carton Packing:</strong> ${prod.pcsPerCarton.toLocaleString('en-IN')} Pcs / Box</span>
                            <span style="margin-left: 12px; color: var(--amz-green); font-weight: 700;"><i class="fa-solid fa-eye"></i> Click photo to expand</span>
                        </div>
                    </div>
                    <div class="amz-product-controls">
                        <div style="text-align: right;">
                            <label class="amz-label" style="margin-bottom: 4px;">Quantity (Cartons/Boxes):</label>
                            <div class="amz-qty-picker">
                                <button type="button" class="amz-qty-btn decrease-btn" data-index="${globalIndex}">-</button>
                                <input type="number" class="amz-qty-input" value="${prod.cartons}" min="0" data-index="${globalIndex}" readonly>
                                <button type="button" class="amz-qty-btn increase-btn" data-index="${globalIndex}">+</button>
                            </div>
                            <small style="color: var(--amz-text-muted); display: block; margin-top: 4px;">
                                ${prod.cartons > 0 ? `${prod.cartons} Box(es) = ${totalCups.toLocaleString('en-IN')} Cups` : '0 Boxes selected'}
                            </small>
                        </div>
                        <div class="amz-price-tag">
                            ₹${lineTotal.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                            <small>₹${prod.pricePerCarton.toLocaleString('en-IN')} / Carton (Box)</small>
                            <small style="font-size: 0.7rem; color: #888;">(₹${prod.pricePerPiece} / piece)</small>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        attachQtyListeners();
        calculateTotals();
    }

    function attachQtyListeners() {
        document.querySelectorAll('.decrease-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(e.target.getAttribute('data-index'));
                if (products[idx].cartons > 0) {
                    products[idx].cartons -= 1;
                    renderProducts();
                }
            });
        });

        document.querySelectorAll('.increase-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(e.target.getAttribute('data-index'));
                products[idx].cartons += 1;
                renderProducts();
            });
        });
    }

    // --- Dynamic Cost Calculations ---
    function calculateTotals() {
        let itemsSubtotal = 0;
        let totalCartons = 0;
        let totalPieces = 0;

        products.forEach(p => {
            const lineTotal = p.pricePerCarton * p.cartons;
            itemsSubtotal += lineTotal;
            totalCartons += p.cartons;
            totalPieces += (p.cartons * p.pcsPerCarton);
        });

        // Bulk Discount Logic: 5% off over 5 Cartons (Boxes), 10% off over 15 Cartons
        let discountPct = 0;
        if (totalCartons >= 15) {
            discountPct = 0.10;
        } else if (totalCartons >= 5) {
            discountPct = 0.05;
        }

        const discountAmount = itemsSubtotal * discountPct;
        const discountedSubtotal = itemsSubtotal - discountAmount;
        const gstAmount = discountedSubtotal * 0.18; // 18% GST
        const grandTotal = discountedSubtotal + gstAmount + selectedDeliveryFee;

        // Update UI Elements
        document.getElementById('summary-items-subtotal').textContent = `₹${itemsSubtotal.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
        
        const discountRow = document.getElementById('summary-discount-row');
        if (discountAmount > 0) {
            discountRow.style.display = 'flex';
            document.getElementById('summary-discount').textContent = `- ₹${discountAmount.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})} (${discountPct*100}% Volume Discount)`;
        } else {
            discountRow.style.display = 'none';
        }

        document.getElementById('summary-shipping').textContent = selectedDeliveryFee === 0 ? 'FREE' : (selectedDeliveryFee < 0 ? `- ₹${Math.abs(selectedDeliveryFee)}` : `₹${selectedDeliveryFee.toLocaleString('en-IN')}`);
        document.getElementById('summary-gst').textContent = `₹${gstAmount.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
        document.getElementById('summary-total').textContent = `₹${grandTotal.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
        
        // Header mini summary
        document.getElementById('header-items-count').textContent = `${totalCartons} Box(es) / ${totalPieces.toLocaleString('en-IN')} Pcs`;
    }

    // --- Accordion Navigation Logic ---
    function goToStep(stepNumber) {
        maxReachedStep = Math.max(maxReachedStep, stepNumber);
        currentStep = stepNumber;

        for (let i = 1; i <= 4; i++) {
            const card = stepCards[i];
            const indicator = stepItems[i];
            const changeBtn = card?.querySelector('.amz-btn-change');

            if (i === stepNumber) {
                card.classList.add('active');
                card.querySelector('.amz-step-body').style.display = 'block';
                if (changeBtn) changeBtn.style.display = 'none';
                if (indicator) {
                    indicator.classList.add('active');
                    indicator.classList.remove('completed');
                }
            } else if (i < stepNumber) {
                card.classList.remove('active');
                card.querySelector('.amz-step-body').style.display = 'none';
                if (changeBtn) changeBtn.style.display = 'inline-block';
                if (indicator) {
                    indicator.classList.remove('active');
                    indicator.classList.add('completed');
                }
            } else {
                card.classList.remove('active');
                card.querySelector('.amz-step-body').style.display = 'none';
                if (changeBtn) changeBtn.style.display = (i <= maxReachedStep) ? 'inline-block' : 'none';
                if (indicator) {
                    indicator.classList.remove('active');
                    indicator.classList.remove('completed');
                }
            }
        }

        // Scroll smoothly to active step header
        stepCards[stepNumber]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Direct Header Click Handlers for all 4 Accordion Step Cards
    for (let s = 1; s <= 4; s++) {
        const header = stepCards[s]?.querySelector('.amz-step-header');
        if (header) {
            header.addEventListener('click', (e) => {
                if (!e.target.classList.contains('amz-btn-change')) {
                    if (s <= maxReachedStep) {
                        goToStep(s);
                    }
                }
            });
        }

        if (stepItems[s]) {
            stepItems[s].style.cursor = 'pointer';
            stepItems[s].addEventListener('click', () => {
                if (s <= maxReachedStep) {
                    goToStep(s);
                }
            });
        }
    }

    // --- Step 1: Address Card Selection ---
    const addressCards = document.querySelectorAll('.amz-address-card');
    addressCards.forEach(card => {
        card.addEventListener('click', () => {
            addressCards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            const radio = card.querySelector('input[type="radio"]');
            if (radio) radio.checked = true;
        });
    });

    // Step 1 Continue Button
    document.getElementById('btn-continue-step-1')?.addEventListener('click', () => {
        const fullName = document.getElementById('full-name')?.value.trim();
        const city = document.getElementById('city')?.value.trim();
        const pincode = document.getElementById('pincode')?.value.trim();
        
        let summaryText = 'Delivery address entered';
        if (fullName && city) {
            summaryText = `Delivering to ${fullName}, ${city}${pincode ? ' (' + pincode + ')' : ''}`;
        } else if (fullName) {
            summaryText = `Delivering to ${fullName}`;
        }
        document.getElementById('step-1-summary').textContent = summaryText;
        goToStep(2);
    });

    // Step 2 Continue Button
    document.getElementById('btn-continue-step-2')?.addEventListener('click', () => {
        let totalCartonsSelected = products.reduce((acc, p) => acc + p.cartons, 0);
        let totalPiecesSelected = products.reduce((acc, p) => acc + (p.cartons * p.pcsPerCarton), 0);

        if (totalCartonsSelected === 0) {
            alert('Please select at least 1 Carton / Box to proceed.');
            return;
        }
        document.getElementById('step-2-summary').textContent = `${totalCartonsSelected} Carton(s) (${totalPiecesSelected.toLocaleString('en-IN')} Pcs) selected`;
        goToStep(3);
    });

    // Step 3 Delivery Radio Options
    const deliveryOptions = document.querySelectorAll('.amz-delivery-option');
    deliveryOptions.forEach(opt => {
        opt.addEventListener('click', () => {
            deliveryOptions.forEach(o => o.classList.remove('selected'));
            opt.classList.add('selected');
            const radio = opt.querySelector('input[type="radio"]');
            if (radio) radio.checked = true;
            
            selectedDeliveryFee = parseFloat(opt.getAttribute('data-fee') || '0');
            selectedDeliveryName = opt.querySelector('strong, .amz-delivery-date').textContent;
            calculateTotals();
        });
    });

    // Step 3 Continue Button
    document.getElementById('btn-continue-step-3')?.addEventListener('click', () => {
        document.getElementById('step-3-summary').textContent = selectedDeliveryName;
        goToStep(4);
    });

    // Payment Option selection styling
    const paymentOptions = document.querySelectorAll('.amz-payment-option');
    paymentOptions.forEach(opt => {
        opt.addEventListener('click', () => {
            paymentOptions.forEach(p => p.classList.remove('selected'));
            opt.classList.add('selected');
            const radio = opt.querySelector('input[type="radio"]');
            if (radio) radio.checked = true;
        });
    });

    // "Change" buttons handler
    document.querySelectorAll('.amz-btn-change').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const stepToEdit = parseInt(btn.getAttribute('data-step'));
            goToStep(stepToEdit);
        });
    });

    // --- Place Order Final Handler ---
    const placeOrderBtn = document.getElementById('amz-btn-place-order');
    if (placeOrderBtn) {
        placeOrderBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            
            let totalCartonsSelected = products.reduce((acc, p) => acc + p.cartons, 0);
            let totalPiecesSelected = products.reduce((acc, p) => acc + (p.cartons * p.pcsPerCarton), 0);

            if (totalCartonsSelected === 0) {
                alert('Your order cart is empty. Please select products first.');
                goToStep(2);
                return;
            }

            placeOrderBtn.disabled = true;
            placeOrderBtn.textContent = 'Processing Order...';

            const orderNumber = 'RAD-' + Math.floor(100 + Math.random() * 900) + '-' + Math.floor(100000 + Math.random() * 900000);
            const totalText = document.getElementById('summary-total').textContent;

            // Delivery estimate date (4 days from today)
            const deliveryDate = new Date();
            deliveryDate.setDate(deliveryDate.getDate() + 4);
            const dateString = deliveryDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });

            try {
                // Submit inquiry/order to backend contact API
                await fetch('/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: 'Amazon Customer (Checkout)',
                        email: 'customer@radhedisposable.com',
                        phone: '+91 99136 00800',
                        country: 'India',
                        message: `AMAZON CHECKOUT ORDER #${orderNumber} | Total: ${totalText} | Items: ${totalCartonsSelected} Cartons (${totalPiecesSelected.toLocaleString('en-IN')} Cups)`
                    })
                });
            } catch (err) {
                console.log('Order logged locally (Offline/Simulated mode)');
            }

            // Populate Modal Content
            document.getElementById('modal-order-id').textContent = orderNumber;
            document.getElementById('modal-delivery-date').textContent = dateString;
            document.getElementById('modal-order-total').textContent = totalText;

            // Show Confirmation Modal
            const modal = document.getElementById('amz-success-modal');
            if (modal) {
                modal.classList.add('show');
            }

            placeOrderBtn.disabled = false;
            placeOrderBtn.textContent = 'Place Your Order';
        });
    }

    // Modal Close / Print Handlers
    document.getElementById('modal-close-btn')?.addEventListener('click', () => {
        document.getElementById('amz-success-modal')?.classList.remove('show');
        window.location.href = 'index.html';
    });

    document.getElementById('modal-print-btn')?.addEventListener('click', () => {
        window.print();
    });

    // ==========================================================================
    // CLEAN LIGHTBOX MODAL HANDLERS (No 360 Rotation)
    // ==========================================================================
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.querySelector('.lightbox-close');

    const closeLightbox = () => {
        if (!lightbox) return;
        lightbox.style.display = 'none';
        document.body.style.overflow = '';
        const dimSvg = document.getElementById('dim-svg');
        if (dimSvg) dimSvg.style.display = 'none';
    };

    // Open Lightbox when clicking any product image in checkout list
    document.addEventListener('click', (e) => {
        const target = e.target;
        if (target.classList.contains('amz-product-img') || target.classList.contains('lightbox-trigger')) {
            const name = target.getAttribute('data-name');
            const code = target.getAttribute('data-code');
            const category = target.getAttribute('data-category');
            const diameter = target.getAttribute('data-diameter');
            const height = target.getAttribute('data-height');
            const src = target.getAttribute('data-src') || target.src;

            if (lightboxImg) lightboxImg.src = src;

            const titleEl = document.getElementById('lightbox-title');
            const codeHeaderEl = document.getElementById('lightbox-code');
            const categoryEl = document.getElementById('lightbox-category');
            const detailList = document.getElementById('lightbox-detail-list');
            const dimSvg = document.getElementById('dim-svg');

            if (titleEl) titleEl.textContent = name ? name.toUpperCase() : 'PREMIUM PRODUCT';
            if (codeHeaderEl) codeHeaderEl.textContent = code ? 'CODE: ' + code.toUpperCase() : '';
            if (categoryEl) categoryEl.textContent = category ? category.toUpperCase() : 'PRODUCT';

            if (name || diameter || height || code) {
                let listHtml = '';
                if (name) listHtml += `<li><strong>NAME:</strong> ${name.toUpperCase()}</li>`;
                if (diameter) listHtml += `<li><strong>DIAMETER:</strong> ${diameter.toUpperCase()}</li>`;
                if (height) listHtml += `<li><strong>HEIGHT:</strong> ${height.toUpperCase()}</li>`;
                if (code) listHtml += `<li><strong>CODE:</strong> ${code.toUpperCase()}</li>`;
                listHtml += `<li><strong>MATERIAL:</strong> FOOD-GRADE VIRGIN POLYPROPYLENE</li>`;
                listHtml += `<li><strong>FEATURES:</strong> LEAK-PROOF, RECYCLABLE, HYGIENIC</li>`;
                if (detailList) detailList.innerHTML = listHtml;

                if (dimSvg && (diameter || height)) {
                    dimSvg.style.display = 'block';
                    if (diameter) document.getElementById('dim-h-label').textContent = 'DIAMETER ' + diameter.toUpperCase();
                    if (height) document.getElementById('dim-v-label').textContent = 'HEIGHT ' + height.toUpperCase();
                } else if (dimSvg) {
                    dimSvg.style.display = 'none';
                }
            }

            if (lightbox) {
                lightbox.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            }
        }
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            closeLightbox();
        });
    }

    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox && lightbox.style.display === 'flex') closeLightbox();
    });

    // Initialize UI
    renderFilterTabs();
    renderProducts();
    goToStep(1);
});
