let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

ctx.beginPath();
ctx.moveTo(100, 100);
ctx.arcTo(150, 100, 100, 150, 50);
ctx.closePath();

// ctx.arc(100, 100, 40, 0, (Math.PI / 180) * 90, false);

ctx.fillStyle = "red";
ctx.strokeStyle = "blue";
ctx.fill();
ctx.stroke();

ctx.beginPath();
ctx.arc(300, 300, 50, 0, (Math.PI / 180) * 180, false);
ctx.fill();

ctx.beginPath();
ctx.arc(75, 50, 25, 0, Math.PI / 180 * 110);
ctx.moveTo(100,50)
ctx.lineTo(75, 50)
ctx.lineTo(75, 75);
ctx.closePath()
ctx.fill()