/**
 * DotGrid - Vanilla JS/Canvas implementation
 * Inspired by react-bits DotGrid with matching props:
 *  dotSize, gap, baseColor, activeColor, proximity, speedTrigger,
 *  shockRadius, shockStrength, maxSpeed, resistance, returnDuration
 */
class DotGrid {
    constructor(container, options = {}) {
        this.container = container;
        this.opts = Object.assign({
            dotSize: 6,
            gap: 14,
            baseColor: '#800000',
            activeColor: '#ff0000',
            proximity: 120,
            speedTrigger: 100,
            shockRadius: 250,
            shockStrength: 5,
            maxSpeed: 5000,
            resistance: 750,
            returnDuration: 1.5,
        }, options);

        this.canvas = document.createElement('canvas');
        this.canvas.style.cssText = `
            position: absolute;
            top: 0; left: 0;
            width: 100%; height: 100%;
            pointer-events: none;
            z-index: 2;
        `;
        this.ctx = this.canvas.getContext('2d');
        this.dots = [];
        this.mouse = { x: -9999, y: -9999, vx: 0, vy: 0, lastX: -9999, lastY: -9999 };
        this.animFrame = null;
        this.resizeObserver = null;

        container.appendChild(this.canvas);
        this.resize();
        this.bindEvents();
        this.animate();
    }

    resize() {
        const rect = this.container.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        this.width = rect.width;
        this.height = rect.height;
        this.canvas.width = this.width * dpr;
        this.canvas.height = this.height * dpr;
        this.ctx.scale(dpr, dpr);
        this.buildGrid();
    }

    buildGrid() {
        const { dotSize, gap } = this.opts;
        const step = dotSize + gap;
        this.dots = [];
        const cols = Math.ceil(this.width / step) + 1;
        const rows = Math.ceil(this.height / step) + 1;
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const x = c * step;
                const y = r * step;
                this.dots.push({
                    ox: x, oy: y,
                    x, y,
                    vx: 0, vy: 0,
                    active: 0
                });
            }
        }
    }

    bindEvents() {
        const onMove = (e) => {
            const rect = this.container.getBoundingClientRect();
            const cx = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
            const cy = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
            this.mouse.vx = cx - this.mouse.lastX;
            this.mouse.vy = cy - this.mouse.lastY;
            this.mouse.lastX = this.mouse.x;
            this.mouse.lastY = this.mouse.y;
            this.mouse.x = cx;
            this.mouse.y = cy;
        };

        const onLeave = () => {
            this.mouse.x = -9999;
            this.mouse.y = -9999;
        };

        const onClick = (e) => {
            const rect = this.container.getBoundingClientRect();
            const cx = e.clientX - rect.left;
            const cy = e.clientY - rect.top;
            this.shock(cx, cy);
        };

        this.container.addEventListener('mousemove', onMove, { passive: true });
        this.container.addEventListener('touchmove', onMove, { passive: true });
        this.container.addEventListener('mouseleave', onLeave);
        this.container.addEventListener('click', onClick);

        this.resizeObserver = new ResizeObserver(() => this.resize());
        this.resizeObserver.observe(this.container);

        this._cleanup = () => {
            this.container.removeEventListener('mousemove', onMove);
            this.container.removeEventListener('touchmove', onMove);
            this.container.removeEventListener('mouseleave', onLeave);
            this.container.removeEventListener('click', onClick);
            if (this.resizeObserver) this.resizeObserver.disconnect();
            cancelAnimationFrame(this.animFrame);
        };
    }

    shock(cx, cy) {
        const { shockRadius, shockStrength, maxSpeed } = this.opts;
        for (const dot of this.dots) {
            const dx = dot.x - cx;
            const dy = dot.y - cy;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < shockRadius) {
                const force = (1 - dist / shockRadius) * shockStrength;
                const angle = Math.atan2(dy, dx);
                dot.vx += Math.cos(angle) * force * maxSpeed * 0.01;
                dot.vy += Math.sin(angle) * force * maxSpeed * 0.01;
            }
        }
    }

    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 128, g: 0, b: 0 };
    }

    lerpColor(c1, c2, t) {
        return {
            r: Math.round(c1.r + (c2.r - c1.r) * t),
            g: Math.round(c1.g + (c2.g - c1.g) * t),
            b: Math.round(c1.b + (c2.b - c1.b) * t),
        };
    }

    animate() {
        const { dotSize, proximity, resistance, returnDuration, baseColor, activeColor, speedTrigger } = this.opts;
        const dt = 1 / 60;
        const baseRgb = this.hexToRgb(baseColor);
        const activeRgb = this.hexToRgb(activeColor);
        const returnFactor = 1 - Math.exp(-1 / (returnDuration * 60));

        const loop = () => {
            this.ctx.clearRect(0, 0, this.width, this.height);

            const speed = Math.sqrt(this.mouse.vx ** 2 + this.mouse.vy ** 2);
            const mouseSpeed = Math.min(speed / speedTrigger, 1);

            for (const dot of this.dots) {
                const dx = dot.x - this.mouse.x;
                const dy = dot.y - this.mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                // proximity effect
                if (dist < proximity && dist > 0) {
                    const force = (1 - dist / proximity) * 3;
                    dot.vx += (dx / dist) * force * mouseSpeed;
                    dot.vy += (dy / dist) * force * mouseSpeed;
                }

                // apply velocity & resistance
                dot.vx *= (1 - dt * (resistance / 100));
                dot.vy *= (1 - dt * (resistance / 100));

                dot.x += dot.vx * dt;
                dot.y += dot.vy * dt;

                // return to origin
                dot.x += (dot.ox - dot.x) * returnFactor;
                dot.y += (dot.oy - dot.y) * returnFactor;

                // color based on distance to mouse
                const t = dist < proximity ? Math.max(0, 1 - dist / proximity) : 0;
                const c = this.lerpColor(baseRgb, activeRgb, t);

                this.ctx.beginPath();
                this.ctx.arc(dot.x, dot.y, dotSize / 2, 0, Math.PI * 2);
                this.ctx.fillStyle = `rgb(${c.r},${c.g},${c.b})`;
                this.ctx.globalAlpha = 0.55 + t * 0.45;
                this.ctx.fill();
                this.ctx.globalAlpha = 1;
            }

            this.animFrame = requestAnimationFrame(loop);
        };

        this.animFrame = requestAnimationFrame(loop);
    }

    destroy() {
        if (this._cleanup) this._cleanup();
        this.canvas.remove();
    }
}
