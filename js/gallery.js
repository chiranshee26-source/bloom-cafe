/* ==========================================================
   Gallery page: filter photos by category
   (the lightbox itself lives in main.js)
   ========================================================== */

const filterButtons = document.querySelectorAll("#galleryFilters .chip");
const photos = document.querySelectorAll("#masonry .window");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((b) => b.classList.remove("active"));
    button.classList.add("active");

    const filter = button.dataset.filter;
    photos.forEach((photo) => {
      const show = filter === "all" || photo.dataset.cat === filter;
      photo.classList.toggle("hide", !show);
      if (show) {
        // replay the fade-in for photos that come back
        photo.classList.remove("in-view");
        requestAnimationFrame(() => requestAnimationFrame(() => photo.classList.add("in-view")));
      }
    });
  });
});
