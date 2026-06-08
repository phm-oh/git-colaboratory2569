// ✨ typing
const texts = ["พวกกั่ย 💗", "ชิชิงอน 🌸", "กั่ยอ้วน 🌷"];
let i = 0, j = 0;
const el = document.querySelector(".typing");

function type() {
  if (j < texts[i].length) {
    el.innerHTML += texts[i][j];
    j++;
    setTimeout(type, 100);
  } else {
    setTimeout(() => {
      el.innerHTML = "";
      j = 0;
      i = (i + 1) % texts.length;
      type();
    }, 1500);
  }
}
type();


// 🌸 bubble background
const canvas = document.getElementById("bg");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let bubbles = [];

class Bubble {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height;
    this.size = Math.random() * 5 + 2;
    this.speed = Math.random() * 2 + 1;
  }

  update() {
    this.y -= this.speed;
  }

  draw() {
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (bubbles.length < 100) {
    bubbles.push(new Bubble());
  }

  bubbles.forEach((b, i) => {
    b.update();
    b.draw();
    if (b.y < 0) bubbles.splice(i, 1);
  });

  requestAnimationFrame(animate);
}
animate();


// 🎵 music
const audio = document.getElementById("bgm");

function toggleMusic() {
  if (audio.paused) {
    audio.play();
  } else {
    audio.pause();
  }
}

// คลิกครั้งแรกให้เล่น
document.addEventListener("click", () => {
  audio.play();
}, { once: true });


// 📱 resize
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});