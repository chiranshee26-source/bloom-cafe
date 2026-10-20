/* ==========================================================
   Bean & Bloom Café – shared JavaScript (used on every page)
   1. Helpers           5. Scroll reveal
   2. Page transitions  6. "Open now" badge
   3. Navigation        7. Sticky notes
   4. Header on scroll  8. Lightbox
   ========================================================== */

/* ---------- 1. Helpers ---------- */
const BB = {}; // a small namespace other scripts can use

// Read/write localStorage safely (it can be blocked in private windows)
BB.load = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch (e) {
    return fallback;
  }
};

BB.save = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    /* storage unavailable – ignore */
  }
};

// Show a short message at the bottom of the screen
BB.toast = (message) => {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    toast.setAttribute("role", "status");
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(BB.toastTimer);
  BB.toastTimer = setTimeout(() => toast.classList.remove("show"), 3200);
};

BB.stars = (rating) =>
  "★".repeat(rating) + `<span class="off">${"★".repeat(5 - rating)}</span>`;

BB.escape = (text) =>
  text.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

/* ---------- 2. Page transitions ---------- */
const curtain = document.querySelector(".curtain");

document.addEventListener("click", (event) => {
  const link = event.target.closest("a");
  if (!link || !curtain) return;

  const url = new URL(link.href, location.href);
  const isOtherPage = url.origin === location.origin && url.pathname !== location.pathname;
  const newTab = link.target === "_blank" || event.ctrlKey || event.metaKey || event.shiftKey;
  if (!isOtherPage || newTab) return;

  event.preventDefault();
  curtain.classList.add("closing");
  setTimeout(() => (location.href = link.href), 500);
});

// When coming back with the browser's back button, open the curtain again
window.addEventListener("pageshow", (event) => {
  if (event.persisted && curtain) curtain.classList.remove("closing");
});

/* ---------- 3. Navigation ---------- */
const navToggle = document.querySelector(".nav-toggle");
const mobileMenu = document.querySelector(".mobile-menu");

function setMenu(open) {
  navToggle.classList.toggle("open", open);
  mobileMenu.classList.toggle("open", open);
  navToggle.setAttribute("aria-expanded", open);
  navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  document.body.style.overflow = open ? "hidden" : "";
}

if (navToggle && mobileMenu) {
  navToggle.addEventListener("click", () => setMenu(!mobileMenu.classList.contains("open")));
  document.addEventListener("keydown", (e) => e.key === "Escape" && setMenu(false));
}

/* ---------- 4. Header shadow on scroll ---------- */
const header = document.querySelector(".site-header");
const onScroll = () => header && header.classList.toggle("scrolled", window.scrollY > 20);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* ---------- 5. Reveal elements as they scroll into view ---------- */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

BB.observeReveal = (root = document) =>
  root.querySelectorAll("[data-reveal], [data-inview]").forEach((el) => revealObserver.observe(el));
BB.observeReveal();

/* ---------- 6. "Open now" badge ---------- */
// Index 0 = Sunday … 6 = Saturday. [opening hour, closing hour]
BB.hours = [
  [9, 17],
  [7, 19],
  [7, 19],
  [7, 19],
  [7, 19],
  [7, 19],
  [8, 20],
];

function updateOpenStatus() {
  const now = new Date();
  const [open, close] = BB.hours[now.getDay()];
  const hour = now.getHours() + now.getMinutes() / 60;
  const isOpen = hour >= open && hour < close;

  document.querySelectorAll("[data-open-status]").forEach((el) => {
    el.textContent = isOpen ? `Open now · until ${close}:00` : `Closed · opens ${open}:00`;
    el.classList.toggle("open", isOpen);
    el.classList.toggle("closed", !isOpen);
  });

  // Highlight today's row in any opening-hours list
  document.querySelectorAll("[data-day]").forEach((row) => {
    row.classList.toggle("today", row.dataset.day.split(",").includes(String(now.getDay())));
  });
}

updateOpenStatus();
setInterval(updateOpenStatus, 60000);

/* ---------- 7. Sticky notes ---------- */
BB.reviews = [
  { name: "Priya", rating: 5, text: "Best flat white in town. My official study spot!" },
  { name: "Daniel", rating: 5, text: "The almond croissant is honestly life-changing." },
  { name: "Sam", rating: 4, text: "Quiet, bright & the wifi actually works ☺" },
  { name: "Aisha", rating: 5, text: "They remembered my order on my 2nd visit!!" },
  { name: "Leo", rating: 5, text: "Cold brew so smooth I had two. No regrets." },
  { name: "Mei", rating: 4, text: "Cosy corner + rainy day + chai = perfect." },
  { name: "Tom", rating: 5, text: "Came for coffee, stayed for 4 hours. Oops." },
  { name: "Grace", rating: 5, text: "Cinnamon rolls sell out by 10. Go early!" },
  { name: "Arjun", rating: 4, text: "Oat milk at no extra cost?? Respect." },
  { name: "Nora", rating: 5, text: "The latte art makes my whole morning." },
  { name: "Kai", rating: 5, text: "Friendliest baristas on Maple Street ♡" },
  { name: "Elena", rating: 4, text: "Matcha latte is the real deal, not too sweet." },
];

const noteColors = ["yellow", "peach", "mint", "pink", "blue"];

BB.makeNote = (note, el = document.createElement("div")) => {
  el.classList.add("note", noteColors[Math.floor(Math.random() * noteColors.length)]);
  el.style.setProperty("--rot", (Math.random() * 10 - 5).toFixed(1) + "deg");
  el.innerHTML = `
    <div class="note-stars" aria-label="${note.rating} out of 5 stars">${BB.stars(note.rating)}</div>
    <p>“${BB.escape(note.text)}”</p>
    <span class="note-name">— ${BB.escape(note.name)}</span>`;
  makeDraggable(el);
  return el;
};

// Fill every empty [data-note] slot with a random, non-repeating review
const shuffled = [...BB.reviews].sort(() => Math.random() - 0.5);
document.querySelectorAll("[data-note]").forEach((slot, i) => {
  BB.makeNote(shuffled[i % shuffled.length], slot);
});

// Let people drag notes anywhere on the page with a mouse or pen
// (on touch screens notes stay put so the page can still scroll)
function makeDraggable(note) {
  let grabX, grabY;

  function moveTo(e) {
    // Keep the note inside the page
    const maxX = document.documentElement.clientWidth - note.offsetWidth;
    const maxY = document.documentElement.scrollHeight - note.offsetHeight;
    const x = Math.min(Math.max(e.pageX - grabX, 0), maxX);
    const y = Math.min(Math.max(e.pageY - grabY, 0), maxY);
    note.style.left = x + "px";
    note.style.top = y + "px";
  }

  note.addEventListener("pointerdown", (e) => {
    if (e.pointerType === "touch" || e.target.closest("button")) return;
    e.preventDefault();
    const rect = note.getBoundingClientRect();
    grabX = e.clientX - rect.left;
    grabY = e.clientY - rect.top;

    // First grab: lift the note out of its section so it can go anywhere
    if (!note.classList.contains("free")) {
      note.style.width = rect.width + "px";
      Object.assign(note.style, { position: "absolute", right: "auto", bottom: "auto", margin: "0" });
      note.classList.add("free");
      document.body.appendChild(note);
    }

    moveTo(e);
    note.setPointerCapture(e.pointerId);
    note.classList.add("dragging");
  });

  note.addEventListener("pointermove", (e) => {
    if (note.classList.contains("dragging")) moveTo(e);
  });

  const stop = () => note.classList.remove("dragging");
  note.addEventListener("pointerup", stop);
  note.addEventListener("pointercancel", stop);
}

/* ---------- 8. Lightbox for photos marked [data-lightbox] ---------- */
const lightboxItems = [...document.querySelectorAll("[data-lightbox]")];

if (lightboxItems.length) {
  const box = document.createElement("div");
  box.className = "lightbox";
  box.setAttribute("role", "dialog");
  box.setAttribute("aria-modal", "true");
  box.setAttribute("aria-label", "Photo viewer");
  box.innerHTML = `
    <button class="lb-btn lb-close" aria-label="Close">✕</button>
    <button class="lb-btn lb-prev" aria-label="Previous photo">←</button>
    <figure>
      <div class="photo"><img alt="" /></div>
      <figcaption></figcaption>
    </figure>
    <button class="lb-btn lb-next" aria-label="Next photo">→</button>`;
  document.body.appendChild(box);

  const boxImg = box.querySelector("img");
  const boxPhoto = box.querySelector(".photo");
  const boxCaption = box.querySelector("figcaption");
  let index = 0;

  // Only cycle through the photos that are currently visible (gallery filters)
  const visibleItems = () => lightboxItems.filter((item) => item.offsetParent !== null);

  function show(i) {
    const items = visibleItems();
    index = (i + items.length) % items.length;
    const img = items[index].querySelector("img");
    boxImg.classList.remove("img-missing");
    boxImg.src = img.getAttribute("src");
    boxImg.alt = img.alt;
    boxPhoto.dataset.label = img.getAttribute("src");
    boxCaption.textContent = items[index].dataset.caption || img.alt;
  }

  function open(item) {
    show(visibleItems().indexOf(item));
    box.classList.add("open");
    document.body.style.overflow = "hidden";
    box.querySelector(".lb-close").focus();
  }

  function close() {
    box.classList.remove("open");
    document.body.style.overflow = "";
  }

  lightboxItems.forEach((item) => {
    item.setAttribute("tabindex", "0");
    item.addEventListener("click", () => open(item));
    item.addEventListener("keydown", (e) => e.key === "Enter" && open(item));
  });

  boxImg.addEventListener("error", () => boxImg.classList.add("img-missing"));
  box.querySelector(".lb-close").addEventListener("click", close);
  box.querySelector(".lb-prev").addEventListener("click", () => show(index - 1));
  box.querySelector(".lb-next").addEventListener("click", () => show(index + 1));
  box.addEventListener("click", (e) => e.target === box && close());

  document.addEventListener("keydown", (e) => {
    if (!box.classList.contains("open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") show(index - 1);
    if (e.key === "ArrowRight") show(index + 1);
  });

  // Swipe left/right on phones
  let touchX = 0;
  box.addEventListener("touchstart", (e) => (touchX = e.touches[0].clientX), { passive: true });
  box.addEventListener("touchend", (e) => {
    const diff = e.changedTouches[0].clientX - touchX;
    if (Math.abs(diff) > 50) show(index + (diff < 0 ? 1 : -1));
  });
}

/* ---------- Footer year ---------- */
document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));

/* ---------- "Back to top" link ---------- */
document.querySelectorAll("[data-top]").forEach((link) =>
  link.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  })
);
