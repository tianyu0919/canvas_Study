(() => {
  let cavnas = document.querySelector("#canvas");
  let ctx = canvas.getContext("2d");

  const debounce = (fn, ms = 200) => {
    // 防抖函数
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

  function init() {
    // 初始化函数
    const ratio = window.devicePixelRatio; // 设备像素比
    const w = window.innerWidth * ratio; // 窗口宽度
    const h = window.innerHeight * ratio; // 窗口高度

    canvas.width = w; // 设置canvas宽度
    canvas.height = h; // 设置canvas高度
    ctx.scale(ratio, ratio); // 缩放canvas
    canvas.style.cssText = `width: ${w}px; height: ${h}px;`; // 设置canvas样式

    let x = 0;
    let y = 0;

    ctx.strokeStyle = "#ccc";

    while (x < w) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
      ctx.strokeText(x.toFixed(0), x, 10);
      x += 25;
    }
    while (y < h) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
      ctx.strokeText(y.toFixed(0), 0, y);
      y += 25;
    }
  }
  init();
  window.addEventListener("resize", debounce(init)); // 监听窗口大小变化事件
})();
