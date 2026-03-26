const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'js', 'main.js');
let content = fs.readFileSync(filePath, 'utf8');

const startStr = "                // Handle image shift and prepare SVG shift";
const endStr = "            }, 50); // Small delay to ensure original scripts have finished";

const startIndex = content.indexOf(startStr);
const endIndex = content.indexOf(endStr);

if (startIndex === -1 || endIndex === -1) {
    console.error("Could not find blocks");
    process.exit(1);
}

const replacement = `                const lightboxImg = document.getElementById('lightbox-img');
                if (!lightboxImg || !lightboxImg.naturalWidth) return;

                const parent = lightboxImg.parentElement;
                const cw = parent.clientWidth;
                const ch = parent.clientHeight;
                const ir = lightboxImg.naturalWidth / lightboxImg.naturalHeight;
                const cr = cw / ch;

                let rw = cw, rh = ch;
                if (ir > cr) {
                    rh = cw / ir;
                } else {
                    rw = ch * ir;
                }
                const imgTop = (ch - rh) / 2;
                const imgLeft = (cw - rw) / 2;

                // Adjust dimSvg to match parent container and use absolute pixel coordinates
                if (dimSvg) {
                    dimSvg.style.width = '100%';
                    dimSvg.style.height = '100%';
                    dimSvg.style.marginLeft = '0';
                    lightboxImg.style.marginLeft = '0';
                    dimSvg.setAttribute('viewBox', \`0 0 \${cw} \${ch}\`);
                }

                // Function to map the original 0-400 coordinates onto the true rendered image
                const mapX = (oldX) => imgLeft + (oldX / 400) * rw;
                const mapY = (oldY) => imgTop + (oldY / 400) * rh;

                const trueX = mapX(x);
                const trueY1 = mapY(y1);
                const trueY2 = mapY(y2);

                // Adjust the height line (the one with markers)
                lines[0].setAttribute('x1', trueX);
                lines[0].setAttribute('y1', trueY1);
                lines[0].setAttribute('x2', trueX);
                lines[0].setAttribute('y2', trueY2);

                lines[1].setAttribute('x1', trueX - 5);
                lines[1].setAttribute('y1', trueY1);
                lines[1].setAttribute('x2', trueX + 5);
                lines[1].setAttribute('y2', trueY1);

                lines[2].setAttribute('x1', trueX - 5);
                lines[2].setAttribute('y1', trueY2);
                lines[2].setAttribute('x2', trueX + 5);
                lines[2].setAttribute('y2', trueY2);

                // Adjust the label
                if (label) {
                    const midY = (trueY1 + trueY2) / 2;
                    const labelX = trueX + 20;
                    label.setAttribute('x', labelX);
                    label.setAttribute('y', midY);
                    label.setAttribute('transform', \`rotate(90, \${labelX}, \${midY})\`);
                }

                // Product-specific diameter (h-spec) arrow adjustments
                const hSpec = dimSvg ? dimSvg.querySelector('#h-spec') : null;
                if (hSpec) {
                    const hLines = hSpec.querySelectorAll('line');
                    const hLabel = hSpec.querySelector('text');

                    // Global variables (from earlier if-statements)
                    // We map hX1, hX2, hY
                    const trueHX1 = mapX(hX1);
                    const trueHX2 = mapX(hX2);
                    const trueHY = mapY(hY);

                    if (hLines[0]) {
                        hLines[0].setAttribute('x1', trueHX1); hLines[0].setAttribute('y1', trueHY);
                        hLines[0].setAttribute('x2', trueHX2); hLines[0].setAttribute('y2', trueHY);
                    }
                    if (hLines[1]) {
                        hLines[1].setAttribute('x1', trueHX1); hLines[1].setAttribute('y1', trueHY - 5);
                        hLines[1].setAttribute('x2', trueHX1); hLines[1].setAttribute('y2', trueHY + 5);
                    }
                    if (hLines[2]) {
                        hLines[2].setAttribute('x1', trueHX2); hLines[2].setAttribute('y1', trueHY - 5);
                        hLines[2].setAttribute('x2', trueHX2); hLines[2].setAttribute('y2', trueHY + 5);
                    }
                    if (hLabel) {
                        hLabel.setAttribute('x', (trueHX1 + trueHX2) / 2);
                        hLabel.setAttribute('y', trueHY - 10);
                    }
                }
`;

const newContent = content.substring(0, startIndex) + replacement + content.substring(endIndex);
fs.writeFileSync(filePath, newContent, 'utf8');
console.log("Successfully rebuilt main.js with responsive relative coordinates");
