const cards =
document.querySelectorAll(".weapon-card");

const preview =
document.querySelector(".preview");

const previewImage =
document.getElementById("previewImage");

const previewTitle =
document.getElementById("previewTitle");

const mouseLight =
document.querySelector(".mouse-light");

/* =========================
   CHANGE CHARACTER
========================= */

cards.forEach(card => {

  card.addEventListener("click", () => {

    cards.forEach(c =>
      c.classList.remove("active")
    );

    card.classList.add("active");

    const name = card.dataset.name;

    const img = card.dataset.img;

    /* FADE OUT */

    previewImage.style.opacity = 0;

    setTimeout(() => {

      previewImage.src = img;

      previewTitle.textContent = name;

      previewImage.style.opacity = 1;

    }, 250);

  });

});

/* =========================
   AAA 3D PARALLAX
========================= */

preview.addEventListener("mousemove", (e) => {

  const rect =
  preview.getBoundingClientRect();

  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const centerX = rect.width / 2;
  const centerY = rect.height / 2;

  const rotateX =
  ((y - centerY) / centerY) * -12;

  const rotateY =
  ((x - centerX) / centerX) * 12;

  preview.style.transform = `
    perspective(1200px)
    rotateX(${rotateX}deg)
    rotateY(${rotateY}deg)
    scale(1.03)
  `;

  previewImage.style.transform = `
    scale(1.1)
    translateX(${rotateY * 1.5}px)
    translateY(${rotateX * 1.5}px)
  `;

  /* LIGHT FOLLOW */

  mouseLight.style.left = `${x}px`;
  mouseLight.style.top = `${y}px`;

});

/* RESET */

preview.addEventListener("mouseleave", () => {

  preview.style.transform = `
    perspective(1200px)
    rotateX(0deg)
    rotateY(0deg)
    scale(1)
  `;

  previewImage.style.transform = `
    scale(1)
    translateX(0px)
    translateY(0px)
  `;

});