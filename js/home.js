/* ==========================================================
   Home page: hero parallax, favourites carousel,
   counting stats and the "leave a note" wall
   ========================================================== */

/* ---------- 1. Hero parallax: layers drift with the mouse ---------- */
const stage = document.getElementById("heroStage");
const layers = stage.querySelectorAll(".layer");
const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

if (canHover) {
  window.addEventListener("mousemove", (e) => {
    // -0.5 … 0.5 depending on where the mouse is
    const x = e.clientX / window.innerWidth - 0.5;
    const y = e.clientY / window.innerHeight - 0.5;
    layers.forEach((layer) => {
      const depth = Number(layer.dataset.depth);
      layer.style.transform = `translate(${-x * depth}px, ${-y * depth}px)`;
    });
  });
}

/* ---------- 2. Favourites carousel ---------- */
const track = document.getElementById("favTrack");
const progress = document.getElementById("favProgress");
const cardStep = () => track.querySelector(".fav-card").offsetWidth + 22; // card width + gap

function slide(direction) {
  const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 5;
  const atStart = track.scrollLeft <= 5;

  // Loop around at both ends
  if (direction > 0 && atEnd) track.scrollTo({ left: 0, behavior: "smooth" });
  else if (direction < 0 && atStart) track.scrollTo({ left: track.scrollWidth, behavior: "smooth" });
  else track.scrollBy({ left: direction * cardStep(), behavior: "smooth" });
}

document.getElementById("favPrev").addEventListener("click", () => slide(-1));
document.getElementById("favNext").addEventListener("click", () => slide(1));

// Progress bar under the carousel
function updateProgress() {
  const visible = track.clientWidth / track.scrollWidth;
  const scrolled = track.scrollLeft / (track.scrollWidth - track.clientWidth || 1);
  progress.style.width = `${(visible + (1 - visible) * scrolled) * 100}%`;
}
track.addEventListener("scroll", updateProgress, { passive: true });
window.addEventListener("resize", updateProgress);
updateProgress();

// Click-and-drag scrolling with a mouse
let isDown = false;
let startX = 0;
let startScroll = 0;

track.addEventListener("mousedown", (e) => {
  isDown = true;
  startX = e.pageX;
  startScroll = track.scrollLeft;
  track.classList.add("dragging");
});

window.addEventListener("mousemove", (e) => {
  if (!isDown) return;
  e.preventDefault();
  track.scrollLeft = startScroll - (e.pageX - startX);
});

window.addEventListener("mouseup", () => {
  if (!isDown) return;
  isDown = false;
  track.classList.remove("dragging");
});

// Gentle autoplay that pauses while the mouse is over the carousel
let autoplay = setInterval(() => slide(1), 4500);
track.addEventListener("mouseenter", () => clearInterval(autoplay));
track.addEventListener("mouseleave", () => (autoplay = setInterval(() => slide(1), 4500)));
track.addEventListener("touchstart", () => clearInterval(autoplay), { passive: true });

/* ---------- 3. Numbers count up when they appear ---------- */
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = Number(el.dataset.count);
    const decimals = Number(el.dataset.decimals || 0);
    const suffix = el.dataset.suffix || "";
    const start = performance.now();
    const duration = 1600;

    function tick(now) {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3); // ease-out
      el.textContent = (target * eased).toFixed(decimals) + suffix;
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.6 });

document.querySelectorAll("[data-count]").forEach((el) => counterObserver.observe(el));

/* ---------- 4. Notes wall: leave your own note ---------- */
const wall = document.getElementById("wall");
const modal = document.getElementById("noteModal");
const form = document.getElementById("noteForm");
const starButtons = document.querySelectorAll("#starInput button");
let rating = 5;
let myNotes = BB.load("bb-notes", []);

function setRating(value) {
  rating = value;
  starButtons.forEach((b) => b.classList.toggle("on", Number(b.dataset.value) <= value));
}
starButtons.forEach((b) => b.addEventListener("click", () => setRating(Number(b.dataset.value))));
setRating(5);

function pinNote(note, animate) {
  const el = BB.makeNote(note);
  el.querySelector(".note-name").insertAdjacentHTML("beforeend", '<span class="note-mine">you</span>');
  el.insertAdjacentHTML("afterbegin", '<button class="note-remove" aria-label="Remove note">✕</button>');
  if (animate) el.classList.add("drop-in");

  el.querySelector(".note-remove").addEventListener("click", () => {
    myNotes = myNotes.filter((n) => n.id !== note.id);
    BB.save("bb-notes", myNotes);
    el.remove();
  });

  wall.prepend(el);
}

// Show notes saved on a previous visit
myNotes.forEach((note) => pinNote(note, false));

function openModal(open) {
  modal.classList.toggle("open", open);
  if (open) document.getElementById("noteName").focus();
}

document.getElementById("openNoteForm").addEventListener("click", () => openModal(true));
modal.querySelector(".modal-close").addEventListener("click", () => openModal(false));
modal.addEventListener("click", (e) => e.target === modal && openModal(false));
document.addEventListener("keydown", (e) => e.key === "Escape" && openModal(false));

function check(input, ok, message) {
  input.parentElement.classList.toggle("invalid", !ok);
  input.parentElement.querySelector(".error").textContent = ok ? "" : message;
  return ok;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const nameInput = document.getElementById("noteName");
  const textInput = document.getElementById("noteText");
  const nameOk = check(nameInput, nameInput.value.trim().length >= 2, "Tell us your name ☺");
  const textOk = check(textInput, textInput.value.trim().length >= 5, "Write a few words at least");
  if (!nameOk || !textOk) return;

  const note = { id: Date.now(), name: nameInput.value.trim(), text: textInput.value.trim(), rating };
  myNotes.push(note);
  BB.save("bb-notes", myNotes);

  openModal(false);
  form.reset();
  setRating(5);
  wall.scrollIntoView({ behavior: "smooth", block: "start" });
  setTimeout(() => pinNote(note, true), 350);
  BB.toast("Your note is on the wall. Thank you! ☕");
});
