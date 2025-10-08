class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.state = "idle";
        this.facing = 1; // 1 = right, -1 = left
        this.animationFrame = 0;
        
        // Body dimensions
        this.headRadius = 20;
        this.neckRadius = 8;
        this.bodyRadius = 25;
        
        // Limb properties (point + length + angle)
        this.limbs = {
            leftArm: { length: 35, angle: Math.PI / 4, width: 6 },
            rightArm: { length: 35, angle: -Math.PI / 4, width: 6 },
            leftLeg: { length: 40, angle: Math.PI / 6, width: 8 },
            rightLeg: { length: 40, angle: -Math.PI / 6, width: 8 }
        };
        
        // Body part positions (relative to x, y)
        this.parts = {
            head: { offsetY: 0 },
            neck: { offsetY: this.headRadius + this.neckRadius },
            body: { offsetY: this.headRadius + this.neckRadius * 2 + this.bodyRadius }
        };
    }

    // Calculate absolute positions
    getHeadPos() {
        return { x: this.x, y: this.y + this.parts.head.offsetY };
    }

    getNeckPos() {
        return { x: this.x, y: this.y + this.parts.neck.offsetY };
    }

    getBodyPos() {
        return { x: this.x, y: this.y + this.parts.body.offsetY };
    }

    getArmOrigin() {
        const body = this.getBodyPos();
        return { x: body.x, y: body.y - this.bodyRadius * 0.5 };
    }

    getLegOrigin() {
        const body = this.getBodyPos();
        return { x: body.x, y: body.y + this.bodyRadius * 0.7 };
    }

    // Draw methods
    drawHead(ctx) {
        const head = this.getHeadPos();
        
        // Head circle
        ctx.fillStyle = "#000000";
        ctx.beginPath();
        ctx.arc(head.x, head.y, this.headRadius, 0, Math.PI * 2);
        ctx.fill();
        
        // Red eyes
        ctx.fillStyle = "#ff0000";
        const eyeOffset = 7;
        const eyeRadius = 3;
        
        ctx.beginPath();
        ctx.arc(head.x - eyeOffset * this.facing, head.y - 3, eyeRadius, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(head.x + eyeOffset * this.facing, head.y - 3, eyeRadius, 0, Math.PI * 2);
        ctx.fill();
        
        // Scary smile
        ctx.strokeStyle = "#ff0000";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(head.x, head.y + 5, 10, 0.2, Math.PI - 0.2);
        ctx.stroke();
    }

    drawNeck(ctx) {
        const neck = this.getNeckPos();
        ctx.fillStyle = "#000000";
        ctx.beginPath();
        ctx.arc(neck.x, neck.y, this.neckRadius, 0, Math.PI * 2);
        ctx.fill();
    }

    drawBody(ctx) {
        const body = this.getBodyPos();
        ctx.fillStyle = "#000000";
        ctx.beginPath();
        ctx.arc(body.x, body.y, this.bodyRadius, 0, Math.PI * 2);
        ctx.fill();
    }

    drawLimb(ctx, originX, originY, length, angle, width) {
        const endX = originX + Math.cos(angle) * length * this.facing;
        const endY = originY + Math.sin(angle) * length;
        
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = width;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(originX, originY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
    }

    draw(ctx) {
        this.updateAnimation();
        
        const armOrigin = this.getArmOrigin();
        const legOrigin = this.getLegOrigin();
        
        // Draw in order: legs -> body -> arms -> neck -> head
        this.drawLimb(ctx, legOrigin.x - 10, legOrigin.y, 
                     this.limbs.leftLeg.length, this.limbs.leftLeg.angle, this.limbs.leftLeg.width);
        this.drawLimb(ctx, legOrigin.x + 10, legOrigin.y, 
                     this.limbs.rightLeg.length, this.limbs.rightLeg.angle, this.limbs.rightLeg.width);
        
        this.drawBody(ctx);
        
        this.drawLimb(ctx, armOrigin.x - 15, armOrigin.y, 
                     this.limbs.leftArm.length, this.limbs.leftArm.angle, this.limbs.leftArm.width);
        this.drawLimb(ctx, armOrigin.x + 15, armOrigin.y, 
                     this.limbs.rightArm.length, this.limbs.rightArm.angle, this.limbs.rightArm.width);
        
        this.drawNeck(ctx);
        this.drawHead(ctx);
    }

    // Animation updates
    updateAnimation() {
        switch(this.state) {
            case "punch":
                this.limbs.rightArm.angle = -Math.PI / 2;
                this.limbs.rightArm.length = 45;
                break;
            case "jump":
                this.limbs.leftLeg.angle = Math.PI / 3;
                this.limbs.rightLeg.angle = -Math.PI / 3;
                this.limbs.leftArm.angle = Math.PI / 2;
                this.limbs.rightArm.angle = -Math.PI / 2;
                break;
            case "walkLeft":
            case "walkRight":
                const walkCycle = Math.sin(this.animationFrame * 0.3);
                this.limbs.leftLeg.angle = Math.PI / 6 + walkCycle * 0.5;
                this.limbs.rightLeg.angle = -Math.PI / 6 - walkCycle * 0.5;
                this.limbs.leftArm.angle = Math.PI / 4 - walkCycle * 0.3;
                this.limbs.rightArm.angle = -Math.PI / 4 + walkCycle * 0.3;
                this.animationFrame++;
                break;
            case "idle":
            default:
                this.limbs.leftArm.angle = Math.PI / 4;
                this.limbs.rightArm.angle = -Math.PI / 4;
                this.limbs.leftArm.length = 35;
                this.limbs.rightArm.length = 35;
                this.limbs.leftLeg.angle = Math.PI / 6;
                this.limbs.rightLeg.angle = -Math.PI / 6;
                break;
        }
    }

    // Action methods
    punch() {
        this.state = "punch";
        setTimeout(() => {
            this.state = "idle";
        }, 200);
    }

    jump() {
        this.state = "jump";
        const jumpHeight = 100;
        const jumpDuration = 500;
        const startY = this.y;
        const startTime = Date.now();
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = elapsed / jumpDuration;
            
            if (progress < 1) {
                // Parabolic jump
                this.y = startY - jumpHeight * Math.sin(progress * Math.PI);
                requestAnimationFrame(animate);
            } else {
                this.y = startY;
                this.state = "idle";
            }
        };
        
        animate();
    }

    moveLeft(distance = 5) {
        this.x -= distance;
        this.facing = -1;
        this.state = "walkLeft";
    }

    moveRight(distance = 5) {
        this.x += distance;
        this.facing = 1;
        this.state = "walkRight";
    }

    stopMoving() {
        if (this.state === "walkLeft" || this.state === "walkRight") {
            this.state = "idle";
            this.animationFrame = 0;
        }
    }
}