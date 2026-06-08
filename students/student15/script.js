const captions = [
  "แว้น ยกล้อ หมอบ ท่อดัง แต่งรถ จัดหนักทุกทางโค้ง",
  "ท่อดังไม่กลัวใคร แรงดีไม่มีตก ยกล้อซิ่งให้ครบ",
  "สายเดือด ต้องสายซิ่ง แต่งรถให้ลั่นถนน",
  "อยากเร็วต้องแว้น อยากดังต้องท่อดัง หมอบเล่นทุกมุม",
];

const captionEl = document.querySelector(".caption");
const button = document.getElementById("toggleCaption");
const clockEl = document.getElementById("clock");
const sparkleLayer = document.querySelector(".sparkle-layer");
const canvas = document.getElementById("matrixCanvas");
const ctx = canvas.getContext("2d");

let currentCaption = 0;
let columns = [];
let columnCount = 0;

function setCaption(index) {
  captionEl.textContent = captions[index];
  captionEl.animate(
    [
      { opacity: 0.25, transform: "translateY(6px)" },
      { opacity: 1, transform: "translateY(0)" },
    ],
    { duration: 240, easing: "ease-out" }
  );
}

button.addEventListener("click", () => {
  currentCaption = (currentCaption + 1) % captions.length;
  setCaption(currentCaption);
});

function updateClock() {
  const now = new Date();
  clockEl.textContent = now.toLocaleTimeString("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function createSparkles() {
  const total = 58;
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < total; i += 1) {
    const spark = document.createElement("span");
    spark.className = "spark";
    spark.style.left = `${Math.random() * 100}%`;
    spark.style.top = `${Math.random() * 100}%`;
    spark.style.animationDelay = `${Math.random() * 4}s`;
    spark.style.setProperty("--duration", `${2 + Math.random() * 3.5}s`);
    fragment.appendChild(spark);
  }

  sparkleLayer.appendChild(fragment);
}

function resizeMatrix() {
  const pixelRatio = window.devicePixelRatio || 1;
  canvas.width = Math.floor(window.innerWidth * pixelRatio);
  canvas.height = Math.floor(window.innerHeight * pixelRatio);
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

  columnCount = Math.ceil(window.innerWidth / 18);
  columns = Array.from({ length: columnCount }, () => Math.random() * window.innerHeight);
}

function drawMatrix() {
  const glyphs = "010101<>[]{}SYSTEMACCESSGRANTED";
  ctx.fillStyle = "rgba(2, 7, 2, 0.16)";
  ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
  ctx.fillStyle = "#65ff4f";
  ctx.font = "16px Share Tech Mono, Consolas, monospace";

  for (let i = 0; i < columnCount; i += 1) {
    const char = glyphs[Math.floor(Math.random() * glyphs.length)];
    const x = i * 18;
    const y = columns[i];
    ctx.fillText(char, x, y);

    if (y > window.innerHeight + Math.random() * 1200) {
      columns[i] = 0;
    } else {
      columns[i] = y + 18;
    }
  }

  requestAnimationFrame(drawMatrix);
}

window.addEventListener("resize", resizeMatrix);
resizeMatrix();
createSparkles();
updateClock();
setInterval(updateClock, 1000);
requestAnimationFrame(drawMatrix);
