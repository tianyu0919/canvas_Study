let canvas = document.querySelector("#canvas"); // 获取canvas元素
let ctx = canvas.getContext("2d"); // 获取2D绘图上下文

const debounce = (fn, ms = 200) => { // 防抖函数
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
  function init() { // 初始化函数
    const w = window.innerWidth; // 窗口宽度
    const h = window.innerHeight; // 窗口高度
    const ratio = window.devicePixelRatio; // 设备像素比

    canvas.width = w * ratio; // 设置canvas宽度
    canvas.height = h * ratio; // 设置canvas高度
    ctx.scale(ratio, ratio); // 缩放canvas
    canvas.style.cssText = `width: ${w}px; height: ${h}px;`; // 设置canvas样式
  }
  init();
  window.addEventListener("resize", debounce(init)); // 监听窗口大小变化事件
})();

function randomColor() { // 生成随机颜色
  return `rgba(${~~(Math.random() * 255)}, ${~~(Math.random() * 255)}, ${~~(
    Math.random() * 255
  )}, 1)`;
}

class Particle { // 粒子类
  constructor() {
    const r = this.random(2, 1); // 随机半径
    this.r = r; // 当前半径
    this.oldR = r; // 原始半径
    this.scale = 1; // 缩放比例
    this.x = this.random(canvas.width, this.r / 2); // x坐标
    this.y = this.random(canvas.height, this.r / 2); // y坐标
    this.vx = this.random(2, -2); // x轴速度
    this.vy = this.random(2, -2); // y轴速度
    this.color = randomColor(); // 颜色
  }

  random = (max, min) => { // 生成指定范围内的随机数
    return Math.random() * (max - min) + min;
  };

  update = () => { // 更新粒子状态
    this.r = this.oldR * this.scale; // 更新半径
    this.x += this.vx; // 更新x坐标
    this.y += this.vy; // 更新y坐标
    if (this.x + this.r > canvas.width || this.x - this.r < 0) { // 边界碰撞检测
      this.vx = -this.vx; // 反转x轴速度
    }
    if (this.y + this.r > canvas.height || this.y - this.r < 0) { // 边界碰撞检测
      this.vy = -this.vy; // 反转y轴速度
    }
  };

  draw() { // 绘制粒子
    ctx.fillStyle = this.color; // 设置填充颜色
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false); // 绘制圆形
    ctx.closePath();
    ctx.fill();
  }
}

const particles = [];

function createParticles(nums = 100) { // 创建粒子
  for (let i = 0; i < nums; i++) {
    particles.push(new Particle());
  }
}

createParticles(300);

const distance = 160; // 连线距离阈值
const Events = {
  x: null,
  y: null,
};

document.addEventListener("mousemove", (e) => { // 监听鼠标移动事件
  Events.x = e.clientX; // 鼠标x坐标
  Events.y = e.clientY; // 鼠标y坐标
});

document.addEventListener("mouseout", () => { // 监听鼠标移出事件
  Events.x = null;
  Events.y = null;
});

function pointDistance(Events, Particle) { // 计算两点之间的距离
  return Math.sqrt(
    Math.pow(Events.x - Particle.x, 2) + Math.pow(Events.y - Particle.y, 2)
  );
}

let reg = /^rgba\((?<color>.*)\)$/;

function drawLine(item1, item2) { // 绘制连线
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

function animate() { // 动画循环
  ctx.clearRect(0, 0, canvas.width, canvas.height); // 清空画布
  particles.forEach((particle) => {
    if (
      Events.x !== null &&
      Events.y !== null &&
      pointDistance(Events, particle) < distance
    ) {
      drawLine(Events, particle); // 绘制鼠标与粒子之间的连线
      particle.scale = (1 - pointDistance(Events, particle) / distance) * 10; // 根据距离设置缩放比例
    } else {
      particle.scale = 1;
    }
    particles.forEach((item2) => {
      if (pointDistance(particle, item2) < distance) {
        drawLine(particle, item2); // 绘制粒子之间的连线
      }
    });
    particle.update(); // 更新粒子状态
    particle.draw(); // 绘制粒子
  });
  window.requestAnimationFrame(animate); // 请求下一帧动画
}
animate();
