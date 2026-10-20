/* ==========================================================
   About page: timeline line fills as you scroll,
   team cards flip when tapped on touch screens
   ========================================================== */

const timeline = document.getElementById("timeline");
const fill = document.getElementById("timelineFill");

function updateTimeline() {
  const rect = timeline.getBoundingClientRect();
  const middle = window.innerHeight * 0.6; // the line "follows" this point on screen
  const progress = Math.min(Math.max((middle - rect.top) / rect.height, 0), 1);
  fill.style.height = progress * rect.height + "px";
}

window.addEventListener("scroll", updateTimeline, { passive: true });
window.addEventListener("resize", updateTimeline);
updateTimeline();

document.querySelectorAll(".member").forEach((card) => {
  card.addEventListener("click", () => card.classList.toggle("flipped"));
});
