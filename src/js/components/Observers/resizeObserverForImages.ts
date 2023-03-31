export default function resizeObserverForImages() {
  const imagesArray = Array.from(document.querySelectorAll("img"));

  window.addEventListener("resize", function () {
    if (this.innerWidth <= 550) {
      imagesArray.forEach((image) => {
        image.src = image.src.replace("desktop", "mobile");
      });
    } else {
      imagesArray.forEach((image) => {
        image.src = image.src.replace("mobile", "desktop");
      });
    }
  });
}
