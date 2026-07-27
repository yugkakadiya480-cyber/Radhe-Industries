document.addEventListener('DOMContentLoaded', () => {
    const fileUpload = document.getElementById('file-upload');
    const gallery = document.getElementById('gallery');
    const downloadAllBtn = document.getElementById('download-all-btn');
    const loading = document.getElementById('loading');

    let processedImages = [];

    fileUpload.addEventListener('change', async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        loading.classList.remove('hidden');
        downloadAllBtn.classList.add('hidden');
        gallery.innerHTML = '';
        processedImages = [];

        for (const file of files) {
            await processImage(file);
        }

        loading.classList.add('hidden');
        if (processedImages.length > 0) {
            downloadAllBtn.classList.remove('hidden');
        }
    });

    async function processImage(file) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    // Create an offscreen canvas to analyze
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0);

                    const bbox = getBoundingBox(ctx, canvas.width, canvas.height);
                    
                    createGalleryItem(file.name, img, bbox);
                    resolve();
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        });
    }

    function getBoundingBox(ctx, width, height) {
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;
        let minX = width, minY = height, maxX = 0, maxY = 0;
        
        // Sample background from top-left pixel
        const bgR = data[0], bgG = data[1], bgB = data[2], bgA = data[3];

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const i = (y * width + x) * 4;
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];
                const a = data[i + 3];
                
                // Ignore transparent pixels
                if (a < 20) continue; 
                
                let isForeground = false;
                
                // If background is transparent, anything opaque is foreground
                if (bgA < 20) {
                    isForeground = true;
                } else {
                    // Calculate color distance from the background color
                    const dist = Math.sqrt(Math.pow(r - bgR, 2) + Math.pow(g - bgG, 2) + Math.pow(b - bgB, 2));
                    // Tolerance of 30 for gradient/compression artifacts
                    if (dist > 30) {
                        isForeground = true;
                    }
                }
                
                if (isForeground) {
                    if (x < minX) minX = x;
                    if (x > maxX) maxX = x;
                    if (y < minY) minY = y;
                    if (y > maxY) maxY = y;
                }
            }
        }
        
        // Ensure some padding fallback if image is empty or no difference found
        if (minX > maxX) {
            minX = width * 0.1; maxX = width * 0.9;
            minY = height * 0.1; maxY = height * 0.9;
        }
        
        return { minX, maxX, minY, maxY };
    }

    function createGalleryItem(filename, img, bbox) {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'image-card bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col gap-3';
        
        const id = 'canvas_' + Math.random().toString(36).substr(2, 9);
        
        itemDiv.innerHTML = `
            <div class="font-medium text-sm text-gray-700 truncate" title="${filename}">${filename}</div>
            <div class="relative w-full canvas-container">
                <canvas id="${id}"></canvas>
            </div>
            <div class="flex gap-2 mt-2">
                <div class="flex-1">
                    <label class="text-xs text-gray-500 block mb-1">Diameter Text</label>
                    <input type="text" class="dia-input w-full p-2 border border-gray-300 rounded text-sm" placeholder="e.g. 80 mm" value="Top Dia">
                </div>
                <div class="flex-1">
                    <label class="text-xs text-gray-500 block mb-1">Height Text</label>
                    <input type="text" class="height-input w-full p-2 border border-gray-300 rounded text-sm" placeholder="e.g. 90 mm" value="Height">
                </div>
            </div>
            <div class="flex gap-2">
                <div class="flex-1">
                    <label class="text-xs text-gray-500 block mb-1">Dia Y Offset</label>
                    <input type="number" class="dia-offset-input w-full p-2 border border-gray-300 rounded text-sm" value="40">
                </div>
                <div class="flex-1">
                    <label class="text-xs text-gray-500 block mb-1">Height X Offset</label>
                    <input type="number" class="height-offset-input w-full p-2 border border-gray-300 rounded text-sm" value="30">
                </div>
            </div>
            <div class="mt-2 border-t pt-2">
                <p class="text-xs font-semibold text-gray-600 mb-2">Adjust Cup Boundaries (if detection fails)</p>
                <div class="grid grid-cols-2 gap-x-3 gap-y-2">
                    <div>
                        <label class="text-xs text-gray-500">Left Edge</label>
                        <input type="range" class="left-bound w-full" min="0" max="100" value="0">
                    </div>
                    <div>
                        <label class="text-xs text-gray-500">Right Edge</label>
                        <input type="range" class="right-bound w-full" min="0" max="100" value="100">
                    </div>
                    <div>
                        <label class="text-xs text-gray-500">Top Edge</label>
                        <input type="range" class="top-bound w-full" min="0" max="100" value="0">
                    </div>
                    <div>
                        <label class="text-xs text-gray-500">Bottom Edge</label>
                        <input type="range" class="bottom-bound w-full" min="0" max="100" value="100">
                    </div>
                </div>
            </div>
        `;

        gallery.appendChild(itemDiv);

        const canvas = document.getElementById(id);
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;

        const diaInput = itemDiv.querySelector('.dia-input');
        const heightInput = itemDiv.querySelector('.height-input');
        const diaOffsetInput = itemDiv.querySelector('.dia-offset-input');
        const heightOffsetInput = itemDiv.querySelector('.height-offset-input');
        
        const leftBound = itemDiv.querySelector('.left-bound');
        const rightBound = itemDiv.querySelector('.right-bound');
        const topBound = itemDiv.querySelector('.top-bound');
        const bottomBound = itemDiv.querySelector('.bottom-bound');

        leftBound.max = img.width; leftBound.value = bbox.minX;
        rightBound.max = img.width; rightBound.value = bbox.maxX;
        topBound.max = img.height; topBound.value = bbox.minY;
        bottomBound.max = img.height; bottomBound.value = bbox.maxY;

        const render = () => {
            const currentBbox = {
                minX: parseInt(leftBound.value),
                maxX: parseInt(rightBound.value),
                minY: parseInt(topBound.value),
                maxY: parseInt(bottomBound.value)
            };
            renderCanvas(canvas, ctx, img, currentBbox, diaInput.value, heightInput.value, parseInt(diaOffsetInput.value) || 30, parseInt(heightOffsetInput.value) || 30);
        };

        // Render initially
        render();

        // Re-render on input changes
        const inputs = [diaInput, heightInput, diaOffsetInput, heightOffsetInput, leftBound, rightBound, topBound, bottomBound];
        inputs.forEach(input => input.addEventListener('input', render));

        processedImages.push({
            filename: filename,
            getCanvas: () => canvas
        });
    }

    function renderCanvas(canvas, ctx, img, bbox, diaText, heightText, diaOffset, heightOffset) {
        // Clear and draw original image
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);

        // Arrow styling based on user request (thick white lines with arrowheads, bold uppercase text)
        const arrowColor = '#ffffff';
        ctx.lineWidth = 6; // Thicker lines
        ctx.font = 'bold 24px Arial, sans-serif'; // Bold sans-serif
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = arrowColor;
        ctx.strokeStyle = arrowColor;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';

        const drawText = (text, x, y, angle = 0) => {
            if (!text) return;
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(angle);
            ctx.fillText(text.toUpperCase(), 0, 0); // Force uppercase
            ctx.restore();
        };

        const drawArrowLine = (x1, y1, x2, y2) => {
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();

            // Arrowheads
            const dx = x2 - x1;
            const dy = y2 - y1;
            const angle = Math.atan2(dy, dx);
            const headlen = 22; // Increased arrowhead length
            const headAngle = Math.PI / 6;

            // Arrowhead at (x1, y1) pointing away
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x1 + headlen * Math.cos(angle + headAngle), y1 + headlen * Math.sin(angle + headAngle));
            ctx.moveTo(x1, y1);
            ctx.lineTo(x1 + headlen * Math.cos(angle - headAngle), y1 + headlen * Math.sin(angle - headAngle));
            ctx.stroke();

            // Arrowhead at (x2, y2) pointing towards
            ctx.beginPath();
            ctx.moveTo(x2, y2);
            ctx.lineTo(x2 - headlen * Math.cos(angle - headAngle), y2 - headlen * Math.sin(angle - headAngle));
            ctx.moveTo(x2, y2);
            ctx.lineTo(x2 - headlen * Math.cos(angle + headAngle), y2 - headlen * Math.sin(angle + headAngle));
            ctx.stroke();
        };

        // Draw Diameter Arrow
        const diaY = bbox.minY + diaOffset; // + means downside
        if (diaY > 30) { // Make sure it's inside canvas
            drawArrowLine(bbox.minX, diaY, bbox.maxX, diaY);
            drawText(diaText, (bbox.minX + bbox.maxX) / 2, diaY - 25);
        } else {
            drawArrowLine(bbox.minX, 30, bbox.maxX, 30);
            drawText(diaText, (bbox.minX + bbox.maxX) / 2, 60);
        }

        // Draw Height Arrow
        const heightX = bbox.maxX + heightOffset;
        if (heightX < canvas.width - 30) {
            drawArrowLine(heightX, bbox.minY, heightX, bbox.maxY);
            drawText(heightText, heightX + 25, (bbox.minY + bbox.maxY) / 2, Math.PI / 2);
        } else {
            drawArrowLine(canvas.width - 30, bbox.minY, canvas.width - 30, bbox.maxY);
            drawText(heightText, canvas.width - 60, (bbox.minY + bbox.maxY) / 2, Math.PI / 2);
        }
    }

    downloadAllBtn.addEventListener('click', async () => {
        if (processedImages.length === 0) return;
        
        const zip = new JSZip();
        
        processedImages.forEach((imgObj, index) => {
            const canvas = imgObj.getCanvas();
            // Data URL to blob
            const dataURL = canvas.toDataURL('image/png');
            const base64Data = dataURL.split(',')[1];
            
            // Add to zip, suffix to avoid overwriting if duplicate names exist
            const nameParts = imgObj.filename.split('.');
            const ext = nameParts.pop();
            const base = nameParts.join('.');
            const newName = `${base}-dimensions.png`;
            
            zip.file(newName, base64Data, {base64: true});
        });
        
        const content = await zip.generateAsync({type: 'blob'});
        
        // Trigger download
        const a = document.createElement('a');
        a.href = URL.createObjectURL(content);
        a.download = 'dimension_images.zip';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });
});
