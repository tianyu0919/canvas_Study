/*
 * @Author: 卢天宇
 * @Date: 2024-08-31 22:51:22
 * @Description:
 */
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.velocityX = Math.random() * 2 - 1;
    this.velocityY = Math.random() * 2 - 1;
    this.moved = false;
    this.sqrt = 0;
  }

  update() {
    this.sqrt -= 0.01;
    if (this.sqrt < 0) {
      this.sqrt = 0;
      this.moved = false;
    }
    this.x += this.velocityX + this.sqrt;
    this.y += this.velocityY + this.sqrt;

    // 边界检测
    if (this.x > canvas.width || this.x < 0) this.velocityX *= -1;
    if (this.y > canvas.height || this.y < 0) this.velocityY *= -1;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
    ctx.fillStyle = "#000";
    ctx.fill();
  }
}

const particles = [];
for (let i = 0; i < 100; i++) {
  particles.push(
    new Particle(Math.random() * canvas.width, Math.random() * canvas.height)
  );
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach((particle) => {
    particle.update();
    particle.draw();
  });
  requestAnimationFrame(animate);
}

animate();

canvas.addEventListener("mousemove", (event) => {
  const mouseX = event.clientX;
  const mouseY = event.clientY;

  particles.forEach((particle) => {
    const dx = particle.x - mouseX;
    const dy = particle.y - mouseY;
    const distance = Math.sqrt(dx * dy + dy * dy);

    if (distance < 30 && !particle.moved) {
      particle.velocityX = (dx / 10) * 0.1;
      particle.sqrt = Math.random() * 2 - 1;
      particle.velocityY = (dy / 10) * 0.1;
      particle.moved = true;
    }
  });
});
