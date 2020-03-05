export default class Particle {
	constructor(canvas, ctx, x, y, radius, color, velX, velY) {
		this.canvas = canvas;
		this.ctx = ctx;
		this.x = x;
		this.y = y;
		this.velocity = {
			x: (Math.random() - 0.5) * velX,
			y: (Math.random() - 0.5) * velY,
		};
		this.radius = radius;
		this.color = color;
		this.timeToLive = 250;
		this.opacity = 1;
		this.gravity = 0.25;
	}
	draw() {
		// This func. draws the particle
		this.ctx.save();
		this.ctx.beginPath();
		this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
		this.ctx.fillStyle = this.color;
		this.ctx.shadowColor = this.color;
		this.shadowBlur = 25;
		this.ctx.globalAlpha = this.opacity;
		this.ctx.fill();
		this.ctx.closePath();
		this.ctx.restore();
	}
	update() {
		// This func. updates the particle
		this.x += this.velocity.x;
		this.y += this.velocity.y;
		this.velocity.y += this.gravity;

		this.timeToLive -= 1;
		this.opacity -= 1 / this.timeToLive;
		this.draw();
	}
}
