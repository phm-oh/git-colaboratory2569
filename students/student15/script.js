const captions = [
  "แว้น ยกล้อ หมอบ ท่อดัง แต่งรถ จัดหนักทุกทางโค้ง",
  "ท่อดังไม่กลัวใคร แรงดีไม่มีตก ยกล้อซิ่งให้ครบ",
  "สายเดือด ต้องสายซิ่ง แต่งรถให้ลั่นถนน",
  "อยากเร็วต้องแว้น อยากดังต้องท่อดัง หมอบเล่นทุกมุม",
];
const captionEl = document.querySelector('.caption');
const button = document.getElementById('toggleCaption');
let current = 0;
button.addEventListener('click', () => {
  current = (current + 1) % captions.length;
  captionEl.textContent = captions[current];
});
