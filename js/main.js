document.addEventListener('DOMContentLoaded', () => {
    console.log('Disposable CUPS website loaded');

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Global Product Dimension Fixing Logic
    // This script intercepts lightbox openings and adjusts the SVG dimension arrows
    // to match the specific product framing in each category.
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('zoom-img') || e.target.classList.contains('lightbox-trigger')) {
            const img = e.target;
            const category = (img.getAttribute('data-category') || document.title || '').toLowerCase();
            const productName = (img.getAttribute('data-name') || img.getAttribute('data-title') || '').toLowerCase();
            
            // Wait for the local lightbox script to run and populate the SVG
            setTimeout(() => {
                const dimSvg = document.getElementById('dim-svg');
                if (!dimSvg || dimSvg.style.display === 'none') return;

                const vSpec = dimSvg.querySelector('#v-spec');
                if (!vSpec) return;

                const lines = vSpec.querySelectorAll('line');
                const label = vSpec.querySelector('text');

                // Determine coordinates based on category
                let x, y1, y2;
                if (category.includes('bowl')) {
                    y1 = 140; y2 = 280; x = 370;
                } else if (category.includes('watti')) {
                    if (productName.includes('square')) {
                        // Square Watti: y1=top rim, y2=cup base
                        y1 = 115; y2 = 275; x = 310;
                    } else {
                        // Round Watti 100ml and similar
                        y1 = 150; y2 = 280; x = 355;
                    }
                } else if (category.includes('180') && productName.includes('plain')) {
                    // 180ml PLAIN: extend arrow to full cup span (top rim → base)
                    y1 = 85; y2 = 395; x = 360;
                } else {
                    // Default for glasses (180ml, 200ml, 250ml, 300ml, etc.)
                    y1 = 110; y2 = 380; x = 360;
                }

                // Adjust the height line (the one with markers)
                lines[0].setAttribute('x1', x);
                lines[0].setAttribute('y1', y1);
                lines[0].setAttribute('x2', x);
                lines[0].setAttribute('y2', y2);

                // Adjust the top tick
                lines[1].setAttribute('x1', x - 5);
                lines[1].setAttribute('y1', y1);
                lines[1].setAttribute('x2', x + 5);
                lines[1].setAttribute('y2', y1);

                // Adjust the bottom tick
                lines[2].setAttribute('x1', x - 5);
                lines[2].setAttribute('y1', y2);
                lines[2].setAttribute('x2', x + 5);
                lines[2].setAttribute('y2', y2);

                // Adjust the label
                if (label) {
                    const midY = (y1 + y2) / 2;
                    const labelX = x + 20;
                    label.setAttribute('x', labelX);
                    label.setAttribute('y', midY);
                    label.setAttribute('transform', `rotate(90, ${labelX}, ${midY})`);
                }

                // Product-specific diameter (h-spec) arrow adjustments
                const hSpec = dimSvg.querySelector('#h-spec');
                if (hSpec) {
                    const hLines = hSpec.querySelectorAll('line');
                    const hLabel = hSpec.querySelector('text');

                    if (category.includes('180') && productName.includes('plain')) {
                        // Shift diameter arrow upward by 15 units for 180ml PLAIN
                        const newY = 35;
                        if (hLines[0]) { hLines[0].setAttribute('y1', newY); hLines[0].setAttribute('y2', newY); }
                        if (hLines[1]) { hLines[1].setAttribute('y1', newY - 5); hLines[1].setAttribute('y2', newY + 5); }
                        if (hLines[2]) { hLines[2].setAttribute('y1', newY - 5); hLines[2].setAttribute('y2', newY + 5); }
                        if (hLabel)    { hLabel.setAttribute('y', newY - 10); }
                    }
                }
            }, 50); // Small delay to ensure original scripts have finished
        }
    }, true); // Use capture phase to ensure it runs

});