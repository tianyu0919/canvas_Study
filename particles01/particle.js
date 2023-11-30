let canvas = document.querySelector("#canvas");
let ctx = canvas.getContext("2d");

const debounce = (fn, ms = 200) => {
  let timer;
  return (...args) => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, ms);
  };
};

(() => {
  function init() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const ratio = window.devicePixelRatio;

    canvas.width = w * ratio;
    canvas.height = h * ratio;
    ctx.scale(ratio, ratio);
    canvas.style.cssText = `width: ${w}px; height: ${h}px;`;
  }
  init();
  window.addEventListener("resize", debounce(init));
})();

function randomColor() {
  return `rgba(${~~(Math.random() * 255)}, ${~~(Math.random() * 255)}, ${~~(
    Math.random() * 255
  )}, 1)`;
}

class Particle {
  constructor() {
    const r = this.random(2, 1);
    this.r = r;
    this.oldR = r;
    this.scale = 1;
    this.x = this.random(canvas.width, this.r / 2);
    this.y = this.random(canvas.height, this.r / 2);
    this.vx = this.random(2, -2);
    this.vy = this.random(2, -2);
    this.color = randomColor();
  }

  random = (max, min) => {
    return Math.random() * (max - min) + min;
  };

  update = () => {
    this.r = this.oldR * this.scale;
    this.x += this.vx;
    this.y += this.vy;
    if (this.x + this.r > canvas.width || this.x - this.r < 0) {
      this.vx = -this.vx;
    }
    if (this.y + this.r > canvas.height || this.y - this.r < 0) {
      this.vy = -this.vy;
    }
  };

  draw() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
  }
}

const particles = [];

function createParticles(nums = 100) {
  for (let i = 0; i < nums; i++) {
    particles.push(new Particle());
  }
}

createParticles(300);

const distance = 160;
const Events = {
  x: null,
  y: null,
};

document.addEventListener("mousemove", (e) => {
  Events.x = e.clientX;
  Events.y = e.clientY;
});

document.addEventListener("mouseout", () => {
  Events.x = null;
  Events.y = null;
});

function pointDistance(Events, Particle) {
  return Math.sqrt(
    Math.pow(Events.x - Particle.x, 2) + Math.pow(Events.y - Particle.y, 2)
  );
}

let reg = /^rgba\((?<color>.*)\)$/;

function drawLine(item1, item2) {
  ctx.beginPath();
  ctx.moveTo(item1.x, item1.y);
  ctx.lineTo(item2.x, item2.y);
  let [r, g, b] = [0, 0, 0];
  if (item2.color) {
    const { color } = item2.color.match(reg).groups;
    [r, g, b] = color.split(",");
  }
  ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${
    1 -
    Math.sqrt(Math.pow(item1.x - item2.x, 2) + Math.pow(item1.y - item2.y, 2)) /
      distance
  })`;
  ctx.stroke();
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach((particle) => {
    if (
      Events.x !== null &&
      Events.y !== null &&
      pointDistance(Events, particle) < distance
    ) {
      drawLine(Events, particle);
      particle.scale = (1 - pointDistance(Events, particle) / distance) * 10;
    } else {
      particle.scale = 1;
    }
    particles.forEach((item2) => {
      if (pointDistance(particle, item2) < distance) {
        drawLine(particle, item2);
      }
    });
    particle.update();
    particle.draw();
  });
  window.requestAnimationFrame(animate);
}
animate();
