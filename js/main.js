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
                    } else if (productName.includes('50-ml')) {
                        // 50ml Watti: very short
                        y1 = 160; y2 = 250; x = 355;
                    } else if (productName.includes('sunday')) {
                        // Sunday Cup: shift height upward
                        y1 = 130; y2 = 260; x = 355;
                    } else {
                        // Round Watti 100ml and similar
                        y1 = 150; y2 = 280; x = 355;
                    }
                } else if (category.includes('180') && productName.includes('plain')) {
                    // 180ml PLAIN: extend arrow to full cup span (top rim → base)
                    y1 = 85; y2 = 395; x = 360;
                } else if (category.includes('180') && productName.includes('spiral')) {
                    // 180ml SPIRAL: shift top of arrow upward to reach the cup rim
                    y1 = 65; y2 = 355; x = 360;
                } else if (productName.includes('mocktail')) {
                    // MOCKTAIL is centered and smaller; match its boundaries
                    y1 = 105; y2 = 295; x = 340;
                } else if (category.includes('200') && productName.includes('tower')) {
                    // 200ml TOWER: shift top of arrow upward, decrease from downward, and place near glass
                    y1 = 80; y2 = 330; x = 320;
                } else if (category.includes('200') && productName.includes('hexa')) {
                    // 200ml HEXA: shift top of arrow upward and decrease from downward
                    y1 = 90; y2 = 320; x = 350;
                } else if (category.includes('200') && productName.includes('check')) {
                    // 200ml CHECKS: move height arrow near the glass and decrease from downward
                    y1 = 110; y2 = 320; x = 310;
                } else if (category.includes('200') && productName.includes('plain')) {
                    // 200ml PLAIN: shift top of arrow upward and decrease from downward
                    y1 = 80; y2 = 330; x = 360;
                } else if (category.includes('200') && productName.includes('spiral')) {
                    // 200ml SPIRAL: shift top of arrow upward and decrease from downward
                    y1 = 80; y2 = 340; x = 360;
                } else if (category.includes('225') && productName.includes('spiral')) {
                    // 225ml SPIRAL: shift top of arrow upward and decrease from downward
                    y1 = 80; y2 = 340; x = 360;
                } else if (category.includes('250') && productName.includes('tower')) {
                    // 250ml TOWER: move height arrow near the glass
                    y1 = 80; y2 = 340; x = 320;
                } else if (category.includes('250') && productName.includes('spiral')) {
                    // 250ml SPIRAL: move height arrow near the glass
                    y1 = 80; y2 = 340; x = 330;
                } else if (category.includes('250') && (productName.includes('plain') || productName.includes('flower'))) {
                    // 250ml PLAIN/FLOWER: move height arrow near the glass and shift top upward
                    y1 = 110; y2 = 350; x = 310;
                } else if (category.includes('300') && productName.includes('plain heavy')) {
                    // 300ml PLAIN HEAVY: move height arrow near the glass and even shorter from below
                    y1 = 80; y2 = 330; x = 310;
                } else if (category.includes('300') && productName.includes('plain')) {
                    // 300ml PLAIN: move height arrow near the glass and shorten from below
                    y1 = 80; y2 = 360; x = 310;
                } else if (category.includes('300') && productName.includes('spiral')) {
                    // 300ml SPIRAL: move height arrow near the glass and shift top upward
                    y1 = 60; y2 = 350; x = 340;
                } else if (category.includes('300') && productName.includes('tower')) {
                    // 300ml TOWER: move height arrow near the glass and shift top upward
                    y1 = 60; y2 = 340; x = 320;
                } else if (category.includes('others') && productName.includes('tower')) {
                    // Others TOWER CUP: move height arrow near the image and decrease from downside
                    y1 = 110; y2 = 300; x = 320;
                } else if (productName.includes('bru')) {
                    // BRU product: move height arrow near the glass and decrease from downward
                    y1 = 100; y2 = 290; x = 320;
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
                    } else if (category.includes('180') && productName.includes('spiral')) {
                        // Shift diameter arrow further upward for 180ml SPIRAL
                        const newY = 35;
                        if (hLines[0]) { hLines[0].setAttribute('y1', newY); hLines[0].setAttribute('y2', newY); }
                        if (hLines[1]) { hLines[1].setAttribute('y1', newY - 5); hLines[1].setAttribute('y2', newY + 5); }
                        if (hLines[2]) { hLines[2].setAttribute('y1', newY - 5); hLines[2].setAttribute('y2', newY + 5); }
                        if (hLabel)    { hLabel.setAttribute('y', newY - 10); }
                    } else if (category.includes('200') && productName.includes('plain')) {
                        // Shift diameter arrow upward for 200ml PLAIN, keeping it visible
                        const newY = 30;
                        if (hLines[0]) { hLines[0].setAttribute('y1', newY); hLines[0].setAttribute('y2', newY); }
                        if (hLines[1]) { hLines[1].setAttribute('y1', newY - 5); hLines[1].setAttribute('y2', newY + 5); }
                        if (hLines[2]) { hLines[2].setAttribute('y1', newY - 5); hLines[2].setAttribute('y2', newY + 5); }
                        if (hLabel)    { hLabel.setAttribute('y', newY - 10); }
                    } else if (category.includes('200') && productName.includes('spiral')) {
                        // Shift diameter arrow upward for 200ml SPIRAL
                        const newY = 35;
                        if (hLines[0]) { hLines[0].setAttribute('y1', newY); hLines[0].setAttribute('y2', newY); }
                        if (hLines[1]) { hLines[1].setAttribute('y1', newY - 5); hLines[1].setAttribute('y2', newY + 5); }
                        if (hLines[2]) { hLines[2].setAttribute('y1', newY - 5); hLines[2].setAttribute('y2', newY + 5); }
                        if (hLabel)    { hLabel.setAttribute('y', newY - 10); }
                    } else if (category.includes('225') && productName.includes('spiral')) {
                        // Shift diameter arrow upward further for 225ml SPIRAL
                        const newY = 25;
                        if (hLines[0]) { hLines[0].setAttribute('y1', newY); hLines[0].setAttribute('y2', newY); }
                        if (hLines[1]) { hLines[1].setAttribute('y1', newY - 5); hLines[1].setAttribute('y2', newY + 5); }
                        if (hLines[2]) { hLines[2].setAttribute('y1', newY - 5); hLines[2].setAttribute('y2', newY + 5); }
                        if (hLabel)    { hLabel.setAttribute('y', newY - 10); }
                    } else if (category.includes('250') && productName.includes('tower')) {
                        // Shift diameter arrow upward for 250ml TOWER
                        const newY = 35;
                        if (hLines[0]) { hLines[0].setAttribute('y1', newY); hLines[0].setAttribute('y2', newY); }
                        if (hLines[1]) { hLines[1].setAttribute('y1', newY - 5); hLines[1].setAttribute('y2', newY + 5); }
                        if (hLines[2]) { hLines[2].setAttribute('y1', newY - 5); hLines[2].setAttribute('y2', newY + 5); }
                        if (hLabel)    { hLabel.setAttribute('y', newY - 10); }
                    } else if (category.includes('250') && productName.includes('spiral')) {
                        // Shift diameter arrow upward for 250ml SPIRAL
                        const newY = 35;
                        if (hLines[0]) { hLines[0].setAttribute('y1', newY); hLines[0].setAttribute('y2', newY); }
                        if (hLines[1]) { hLines[1].setAttribute('y1', newY - 5); hLines[1].setAttribute('y2', newY + 5); }
                        if (hLines[2]) { hLines[2].setAttribute('y1', newY - 5); hLines[2].setAttribute('y2', newY + 5); }
                        if (hLabel)    { hLabel.setAttribute('y', newY - 10); }
                    } else if (category.includes('250') && (productName.includes('plain') || productName.includes('flower'))) {
                        // Shift diameter arrow even higher above mouth for 250ml PLAIN/FLOWER
                        const newY = 85;
                        if (hLines[0]) { hLines[0].setAttribute('y1', newY); hLines[0].setAttribute('y2', newY); }
                        if (hLines[1]) { hLines[1].setAttribute('y1', newY - 5); hLines[1].setAttribute('y2', newY + 5); }
                        if (hLines[2]) { hLines[2].setAttribute('y1', newY - 5); hLines[2].setAttribute('y2', newY + 5); }
                        if (hLabel)    { hLabel.setAttribute('y', newY - 10); }
                    } else if (category.includes('300') && productName.includes('plain')) {
                        // Shift diameter arrow even higher above mouth for 300ml PLAIN
                        const newY = 65;
                        if (hLines[0]) { hLines[0].setAttribute('y1', newY); hLines[0].setAttribute('y2', newY); }
                        if (hLines[1]) { hLines[1].setAttribute('y1', newY - 5); hLines[1].setAttribute('y2', newY + 5); }
                        if (hLines[2]) { hLines[2].setAttribute('y1', newY - 5); hLines[2].setAttribute('y2', newY + 5); }
                        if (hLabel)    { hLabel.setAttribute('y', newY - 10); }
                    } else if (category.includes('300') && productName.includes('spiral')) {
                        // Shift diameter arrow even higher above mouth for 300ml SPIRAL
                        const newY = 25;
                        if (hLines[0]) { hLines[0].setAttribute('y1', newY); hLines[0].setAttribute('y2', newY); }
                        if (hLines[1]) { hLines[1].setAttribute('y1', newY - 5); hLines[1].setAttribute('y2', newY + 5); }
                        if (hLines[2]) { hLines[2].setAttribute('y1', newY - 5); hLines[2].setAttribute('y2', newY + 5); }
                        if (hLabel)    { hLabel.setAttribute('y', newY - 10); }
                    } else if (category.includes('300') && productName.includes('tower')) {
                        // Shift diameter arrow above mouth for 300ml TOWER
                        const newY = 45;
                        if (hLines[0]) { hLines[0].setAttribute('y1', newY); hLines[0].setAttribute('y2', newY); }
                        if (hLines[1]) { hLines[1].setAttribute('y1', newY - 5); hLines[1].setAttribute('y2', newY + 5); }
                        if (hLines[2]) { hLines[2].setAttribute('y1', newY - 5); hLines[2].setAttribute('y2', newY + 5); }
                        if (hLabel)    { hLabel.setAttribute('y', newY - 10); }
                    } else if (productName.includes('bru')) {
                        // BRU product: push diameter arrow downward for visibility
                        const newY = 90;
                        if (hLines[0]) { hLines[0].setAttribute('y1', newY); hLines[0].setAttribute('y2', newY); }
                        if (hLines[1]) { hLines[1].setAttribute('y1', newY - 5); hLines[1].setAttribute('y2', newY + 5); }
                        if (hLines[2]) { hLines[2].setAttribute('y1', newY - 5); hLines[2].setAttribute('y2', newY + 5); }
                        if (hLabel)    { hLabel.setAttribute('y', newY - 10); }
                    } else if (category.includes('others') && productName.includes('tower')) {
                        // Others TOWER CUP: push diameter arrow downward for visibility
                        const newY = 100;
                        if (hLines[0]) { hLines[0].setAttribute('y1', newY); hLines[0].setAttribute('y2', newY); }
                        if (hLines[1]) { hLines[1].setAttribute('y1', newY - 5); hLines[1].setAttribute('y2', newY + 5); }
                        if (hLines[2]) { hLines[2].setAttribute('y1', newY - 5); hLines[2].setAttribute('y2', newY + 5); }
                        if (hLabel)    { hLabel.setAttribute('y', newY - 10); }
                    } else if (category.includes('watti')) {
                        // Shift diameter arrow downward for Watti products
                        let newY = 80;
                        if (productName.includes('sunday')) {
                            // Sunday Cup: shift diameter upward from general Watti level
                            newY = 70;
                        } else if (productName.includes('square')) {
                            // Square Watti: shift diameter upward from general Watti level
                            newY = 100;
                        }
                        if (hLines[0]) { hLines[0].setAttribute('y1', newY); hLines[0].setAttribute('y2', newY); }
                        if (hLines[1]) { hLines[1].setAttribute('y1', newY - 5); hLines[1].setAttribute('y2', newY + 5); }
                        if (hLines[2]) { hLines[2].setAttribute('y1', newY - 5); hLines[2].setAttribute('y2', newY + 5); }
                        if (hLabel)    { hLabel.setAttribute('y', newY - 10); }
                    } else if (productName.includes('mocktail')) {
                        // Shift diameter arrow downward for MOCKTAIL
                        const newY = 95;
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