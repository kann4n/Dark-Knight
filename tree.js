/** @type {HTMLCanvasElement} */
class TreeScene {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.leaves = [];
        
        // --- CONFIGURATION ---
        this.config = {
            maxDepth: 8,
            leafSpawnRate: 0.0002,
            maxParticles: 50,
            windSpeed: 0.0005,
            colorTrunk: '#1a1a1a',
            colorLeaves: ['#1a1a1a', '#2d2d2d', '#4a2c2c', '#385a2cff']
        };

        // Bind methods to 'this' to avoid context issues
        this.resize = this.resize.bind(this);
        this.animate = this.animate.bind(this);

        // this.init();
    }

    init() {
        window.addEventListener('resize', this.resize);
        this.resize(); // Initial size
        this.animate(); // Start loop
    }

    // 🖥️ FULL SCREEN HANDLING
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    drawSun() {
        // Reset transform to draw in screen space
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);

        const sunX = this.canvas.width / 2;
        const sunY = this.canvas.height * 0.65; // Positioned behind the tree
        const sunRadius = Math.min(this.canvas.width, this.canvas.height) * 0.15;

        // Glow
        this.ctx.shadowBlur = 80;
        this.ctx.shadowColor = "rgba(255, 50, 50, 0.6)";

        // Sun Body
        this.ctx.fillStyle = "rgba(255, 95, 37, 0.8)";
        this.ctx.beginPath();
        this.ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
        this.ctx.fill();

        // Reset Shadow so it doesn't affect the tree
        this.ctx.shadowBlur = 0;
    }

    drawBranch(length, angle, depth, time) {
        if (depth === 0) return;

        this.ctx.strokeStyle = this.config.colorTrunk;
        this.ctx.lineWidth = depth < 2 ? 1.5 : depth * 0.7;

        this.ctx.beginPath();
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(0, -length);
        this.ctx.stroke();

        this.ctx.translate(0, -length);

        if (depth <= 2) {
            this.ctx.fillStyle = "#333";
            
            // Static leaves
            this.ctx.beginPath();
            this.ctx.arc(0, 0, 2, 0, Math.PI * 2);
            this.ctx.fill();

            // Falling particles
            if (this.leaves.length < this.config.maxParticles && Math.random() < this.config.leafSpawnRate) {
                const matrix = this.ctx.getTransform();
                this.leaves.push({
                    x: matrix.e,
                    y: matrix.f,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: Math.random() * 0.5 + 0.5,
                    size: Math.random() * 2 + 1,
                    life: Math.random() * 0.5 + 2
                });
            }
        }

        const noise = Math.sin(time + depth);
        const sway = noise * 0.02;
        const scale = 0.75;

        this.ctx.save();
        this.ctx.rotate(angle + 0.4 + sway);
        this.drawBranch(length * scale, angle, depth - 1, time);
        this.ctx.restore();

        this.ctx.save();
        this.ctx.rotate(angle - 0.4 + sway);
        this.drawBranch(length * scale, angle, depth - 1, time);
        this.ctx.restore();
    }

    updateParticles(wind) {
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.fillStyle = '#1a1a1a';

        for (let i = this.leaves.length - 1; i >= 0; i--) {
            const p = this.leaves[i];

            p.x += p.vx + wind * 10;
            p.y += p.vy;
            p.life -= 0.005;

            // Check against canvas.height (dynamic) instead of static size
            if (p.life <= 0 || p.y > this.canvas.height) {
                this.leaves.splice(i, 1);
                continue;
            }

            this.ctx.globalAlpha = p.life * 0.6;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fill();
        }
        this.ctx.globalAlpha = 1.0;
    }

    drawBackground() {
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);

        // 🌅 Gradient matches screen height
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, "#9af5faff");
        gradient.addColorStop(0.5, "#ffed65ff");
        gradient.addColorStop(1, "#ff0000ff");

        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // ☀️ Draw Sun (Added)
        this.drawSun();

        // ⛰️ Ground at bottom of screen
        this.ctx.fillStyle = "#0f0f0f";
        this.ctx.fillRect(0, this.canvas.height - 40, this.canvas.width, 40);
    }

    animate() {
        this.drawBackground();

        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        // 🌳 Plant tree at horizontal center, bottom of screen
        this.ctx.translate(this.canvas.width / 4, this.canvas.height - 20);

        const time = Date.now() * this.config.windSpeed;
        const baseWind = Math.sin(time) * 0.015;

        // Scale tree slightly based on screen height so it fits
        const treeSize = Math.min(this.canvas.height * 0.25, 100); 
        
        this.drawBranch(treeSize, baseWind, this.config.maxDepth, time);
        this.updateParticles(baseWind);

        requestAnimationFrame(this.animate);
    }
}
