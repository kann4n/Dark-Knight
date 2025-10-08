/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("canvas");

/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext("2d");

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;
console.log(width, height);

// Create player at ground level
const groundY = height * 0.6;
const player = new Player(200, groundY - 80); // Subtract height so feet touch ground

// Keyboard controls
const keys = {};

window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    
    // Action triggers
    if (e.key === ' ' && player.state === 'idle') {
        player.punch();
    }
    if (e.key === 'w' && player.state === 'idle') {
        player.jump();
    }
});

window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
    
    // Stop walking when keys released
    if ((e.key === 'a' || e.key === 'd') && 
        (player.state === 'walkLeft' || player.state === 'walkRight')) {
        player.stopMoving();
    }
});

function loop() {
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Red sky
    ctx.fillStyle = "#ff0000";
    ctx.fillRect(0, 0, width, height * 0.6);
    
    // Black ground
    ctx.fillStyle = "#000";
    ctx.fillRect(0, height * 0.6, width, height);
    
    // Handle continuous movement
    if (keys['a'] && player.state !== 'jump' && player.state !== 'punch') {
        player.moveLeft(3);
    }
    if (keys['d'] && player.state !== 'jump' && player.state !== 'punch') {
        player.moveRight(3);
    }
    
    // Draw player
    player.draw(ctx);
    
    requestAnimationFrame(loop);
}

loop();

// Instructions (optional - remove if not needed)
console.log('Controls:');
console.log('A/D - Move left/right');
console.log('W - Jump');
console.log('Space - Punch');