class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 50;
        this.speed = 5;
        this.health = 100;

        // PHYSICS
        this.dy = 0;
        this.jumpForce = -15;
        this.isGrounded = false;

        // ANIMATION STATE
        this.facing = 'right'; // Tracks which way we are looking

        this.controls = new Controls();
        this.canvas = document.getElementById('fight-canvas');
        this.config = { gravity: 0.8 };

        // rapid fire fix
        this.attackCooldown = 0; // 0 means "Ready to use"
        this.healCooldown = 0;
        this.CooldownRate = 60;

    }

    draw(ctx) {
        // Save the current context state before flipping
        ctx.save();

        // 1. Move the "camera" to the player's position
        // We add width/2 to rotate around the center
        ctx.translate(this.x + this.width / 2, this.y);

        // 2. Flip the canvas if facing left
        if (this.facing === 'left') {
            ctx.scale(-1, 1);
        }

        // --- DRAWING THE COOL PLAYER (Relative to 0,0 now) ---

        // Body (Shadow Ninja Style)
        ctx.fillStyle = '#222'; // Dark Charcoal
        ctx.fillRect(-this.width / 2, 0, this.width, this.height);

        // Headband (Red Anime Style)
        ctx.fillStyle = '#ff0000';
        ctx.beginPath();
        ctx.rect(-this.width / 2, 5, this.width, 10); // Band across head
        ctx.fill();

        // Headband Tails (Flowing behind)
        ctx.beginPath();
        ctx.moveTo(-this.width / 2, 10);
        ctx.lineTo(-this.width, 5); // Tail 1
        ctx.lineTo(-this.width - 10, 20); // Tail 2
        ctx.lineTo(-this.width / 2, 15);
        ctx.fill();

        // Glowing Eyes (Cyber/Intense Look)
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#00ffff'; // Cyan Glow
        ctx.fillStyle = '#00ffff';

        // Eye shape (Angry/Focused)
        ctx.beginPath();
        ctx.moveTo(0, 15);
        ctx.lineTo(15, 12);
        ctx.lineTo(15, 18);
        ctx.fill();

        // Sword (Sheathed on back)
        ctx.shadowBlur = 0; // Turn off glow for sword
        ctx.strokeStyle = '#888';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(-10, 10);
        ctx.lineTo(-20, -15); // Handle sticking up
        ctx.stroke();

        // Restore context to normal (so other things don't get flipped)
        ctx.restore();
    }

    update() {
        // --- Horizontal Movement & Facing Direction ---
        if (this.controls.moveleft) {
            this.x -= this.speed;
            this.facing = 'left'; // Look left
        }
        if (this.controls.moveright) {
            this.x += this.speed;
            this.facing = 'right'; // Look right
        }

        // --- Jumping ---
        if (this.controls.jump && this.isGrounded) {
            this.dy = this.jumpForce;
            this.isGrounded = false;
        }

        // --- Dialogs ---
        if (this.controls.attack) {
            if (this.attackCooldown === 0) {
                console.log("Omae wa mou shindeiru...")
                this.attackCooldown -= this.CooldownRate;
            }
        };
        if (this.controls.heal) {
            if (this.healCooldown === 0) {
                console.log("Ore wa kaizoku-ō ni naru!")
                this.healCooldown -= this.CooldownRate;
            }
        };

        // --- Physics ---
        this.dy += this.config.gravity;
        this.y += this.dy;

        // --- Boundary Checks ---
        if (this.x < 0) this.x = 0;
        else if (this.x + this.width > this.canvas.width) this.x = this.canvas.width - this.width;

        if (this.y < 0) {
            this.y = 0;
            this.dy = 0;
        }
        else if (this.y + this.height > this.canvas.height) {
            this.y = this.canvas.height - this.height;
            this.dy = 0;
            this.isGrounded = true;
        } else {
            this.isGrounded = false;
        }

        if (this.attackCooldown < 0) this.attackCooldown += 1;
        if (this.healCooldown < 0) this.healCooldown += 1;
    }
}