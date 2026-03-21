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
                    y1 = 80; y2 = 370; x = 360;
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
                    y1 = 95; y2 = 345; x = 360;
                } else if (category.includes('200') && productName.includes('spiral')) {
                    // 200ml SPIRAL: shift top of arrow upward and decrease from downward
                    y1 = 95; y2 = 355; x = 360;
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
                } else if (productName.includes('tower')) {
                    // General TOWER CUP (including 120ml and larger): move height arrow near the image
                    y1 = 110; y2 = 310; x = 350;
                } else if (productName.includes('bru')) {
                    // BRU product: move height arrow near the glass and decrease from downward
                    y1 = 100; y2 = 290; x = 320;
                } else {
                    // Default for glasses (180ml, 200ml, 250ml, 300ml, etc.)
                    y1 = 110; y2 = 380; x = 360;
                }
                // Handle image shift and prepare SVG shift
                const lightboxImg = document.getElementById('lightbox-img');
                let shiftX = 0;
                let shiftAmount = '30px';
                if (category.includes('watti')) {
                    if (lightboxImg) lightboxImg.style.marginLeft = shiftAmount;
                    if (dimSvg) dimSvg.style.marginLeft = shiftAmount;
                } else {
                    if (lightboxImg) lightboxImg.style.marginLeft = '0';
                    if (dimSvg) dimSvg.style.marginLeft = '0';
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
                const hSpec = dimSvg ? dimSvg.querySelector('#h-spec') : null;
                if (hSpec) {
                    const hLines = hSpec.querySelectorAll('line');
                    const hLabel = hSpec.querySelector('text');

                    // Standard horizontal coordinates
                    let hX1 = 80;
                    let hX2 = 320;
                    let hY = 100; // Default baseline

                    if (category.includes('180') && productName.includes('plain')) {
                        hY = 30;
                    } else if (category.includes('180') && productName.includes('spiral')) {
                        hY = 45;
                    } else if (category.includes('180') && productName.includes('tower')) {
                        hY = 25; // More upward
                    } else if (category.includes('180') && productName.includes('hexa')) {
                        hY = 30; // Slightly down from before
                    } else if (category.includes('180') && productName.includes('checks')) {
                        hY = 25; // More upward
                    } else if (category.includes('200') && productName.includes('plain')) {
                        hY = 30;
                    } else if (category.includes('200') && (productName.includes('hexa') || productName.includes('tower') || productName.includes('checks'))) {
                        hY = 25;
                    } else if (category.includes('200') && productName.includes('spiral')) {
                        hY = 35;
                    } else if (category.includes('225') && (productName.includes('spiral') || productName.includes('tower'))) {
                        hY = 25;
                    } else if (category.includes('225') && productName.includes('checks')) {
                        hY = 25; hX1 = 55; hX2 = 345;
                    } else if (category.includes('250') && productName.includes('tower')) {
                        hY = 35;
                    } else if (category.includes('250') && productName.includes('spiral')) {
                        hY = 35;
                    } else if (category.includes('250') && (productName.includes('plain') || productName.includes('flower'))) {
                        hY = 30;
                    } else if (category.includes('300') && productName.includes('plain')) {
                        hY = 65;
                    } else if (category.includes('300') && productName.includes('spiral')) {
                        hY = 25;
                    } else if (category.includes('300') && productName.includes('tower')) {
                        hY = 45;
                    } else if (productName.includes('bru')) {
                        hY = 90;
                    } else if (productName.includes('tower')) {
                        hY = 100;
                    } else if (category.includes('watti')) {
                        hY = 110;
                        hX1 = 60; hX2 = 300; // Refined centering

                        if (productName.includes('sunday')) {
                            hY = 70;
                        } else if (productName.includes('square')) {
                            hY = 100;
                            hX1 = 55; hX2 = 295; // Refined centering for square
                        } else if (productName.includes('100-ml')) {
                            hY = 80;
                        }

                        // Custom X-position for 50ml variants
                        if (productName.includes('full size') || productName.includes('cut size')) {
                            hX1 = 10; hX2 = 250; // Refined centering
                        }
                    } else if (productName.includes('mocktail')) {
                        hY = 95;
                    }

                    // Global Phone/Mobile Adjustment
                    if (window.innerWidth <= 600) {
                        if (category.includes('180')) {
                            hY = hY + 30; // Move DOWN for 180ml on mobile
                        } else {
                            hY = Math.max(15, hY - 30); // Default: move UP for others
                        }
                    }

                    // Apply all coordinates at once
                    if (hLines[0]) {
                        hLines[0].setAttribute('x1', hX1); hLines[0].setAttribute('y1', hY);
                        hLines[0].setAttribute('x2', hX2); hLines[0].setAttribute('y2', hY);
                    }
                    if (hLines[1]) {
                        hLines[1].setAttribute('x1', hX1); hLines[1].setAttribute('y1', hY - 5);
                        hLines[1].setAttribute('x2', hX1); hLines[1].setAttribute('y2', hY + 5);
                    }
                    if (hLines[2]) {
                        hLines[2].setAttribute('x1', hX2); hLines[2].setAttribute('y1', hY - 5);
                        hLines[2].setAttribute('x2', hX2); hLines[2].setAttribute('y2', hY + 5);
                    }
                    if (hLabel) {
                        hLabel.setAttribute('x', (hX1 + hX2) / 2);
                        hLabel.setAttribute('y', hY - 10);
                    }
                }
            }, 50); // Small delay to ensure original scripts have finished
        }
    }, true); // Use capture phase to ensure it runs

});