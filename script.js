/* =========================================
   Bean & Bloom Café – JavaScript
   Plain JavaScript, no libraries needed.
   ========================================= */

/* ----- 1. Mobile navigation menu ----- */
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

navToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  navToggle.classList.toggle("open", isOpen);
  navToggle.setAttribute("aria-expanded", isOpen);
  navToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
});

// Close the mobile menu after a link is clicked
navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    navToggle.classList.remove("open");
    navToggle.setAttribute("aria-expanded", false);
  });
});

/* ----- 2. Header shadow, active link & back-to-top on scroll ----- */
const header = document.getElementById("header");
const backToTop = document.getElementById("backToTop");
const sections = document.querySelectorAll("main section[id]");

function onScroll() {
  const y = window.scrollY;
  header.classList.toggle("scrolled", y > 10);
  backToTop.classList.toggle("show", y > 500);

  // Highlight the nav link of the section currently on screen
  let current = "home";
  sections.forEach((section) => {
    if (y >= section.offsetTop - 120) current = section.id;
  });
  navLinks.querySelectorAll("a").forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === "#" + current);
  });
}

window.addEventListener("scroll", onScroll);
backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

/* ----- 3. Dark / light theme toggle (remembered in localStorage) ----- */
const themeToggle = document.getElementById("themeToggle");

function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  themeToggle.textContent = theme === "dark" ? "☀️" : "🌙";
  try {
    localStorage.setItem("theme", theme);
  } catch (e) {
    /* storage unavailable – ignore */
  }
}

let savedTheme = null;
try {
  savedTheme = localStorage.getItem("theme");
} catch (e) {
  /* storage unavailable – ignore */
}
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
setTheme(savedTheme || (prefersDark ? "dark" : "light"));

themeToggle.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme");
  setTheme(current === "dark" ? "light" : "dark");
});

/* ----- 4. "Open now" badge based on opening hours ----- */
// Index 0 = Sunday ... 6 = Saturday. Times are [open, close] in 24h hours.
const openingHours = [
  [9, 17],  // Sunday
  [7, 19],  // Monday
  [7, 19],  // Tuesday
  [7, 19],  // Wednesday
  [7, 19],  // Thursday
  [7, 19],  // Friday
  [8, 20],  // Saturday
];

function updateOpenStatus() {
  const status = document.getElementById("openStatus");
  const now = new Date();
  const [open, close] = openingHours[now.getDay()];
  const hour = now.getHours() + now.getMinutes() / 60;

  if (hour >= open && hour < close) {
    status.textContent = `🟢 Open now · until ${close}:00`;
    status.className = "status open";
  } else {
    status.textContent = `🔴 Closed now · opens at ${open}:00`;
    status.className = "status closed";
  }
}

updateOpenStatus();

/* ----- 5. Menu: build cards, filter by category, add to order ----- */
const menuItems = [
  { name: "Espresso", price: 2.5, category: "coffee", emoji: "☕", desc: "A rich, bold double shot of our house blend." },
  { name: "Flat White", price: 3.8, category: "coffee", emoji: "🥛", desc: "Silky micro-foam over a double ristretto." },
  { name: "Caramel Latte", price: 4.2, category: "coffee", emoji: "🍮", desc: "Espresso, steamed milk and homemade caramel." },
  { name: "Iced Cold Brew", price: 4.0, category: "coffee", emoji: "🧊", desc: "Steeped for 18 hours, smooth and refreshing." },
  { name: "Matcha Latte", price: 4.5, category: "tea", emoji: "🍵", desc: "Ceremonial-grade matcha whisked with oat milk." },
  { name: "Chai Latte", price: 3.9, category: "tea", emoji: "🫖", desc: "Spiced black tea with cinnamon and cardamom." },
  { name: "Hot Chocolate", price: 3.5, category: "tea", emoji: "🍫", desc: "Real dark chocolate, topped with cream." },
  { name: "Butter Croissant", price: 2.8, category: "bakery", emoji: "🥐", desc: "Flaky, golden and baked fresh every morning." },
  { name: "Blueberry Muffin", price: 3.0, category: "bakery", emoji: "🫐", desc: "Bursting with berries and a crumble top." },
  { name: "Cinnamon Roll", price: 3.4, category: "bakery", emoji: "🌀", desc: "Soft, gooey and glazed with cream cheese icing." },
];

const menuGrid = document.getElementById("menuGrid");
const filterButtons = document.querySelectorAll(".filter-btn");
const orderCount = document.getElementById("orderCount");
const orderTotal = document.getElementById("orderTotal");
let order = [];

function renderMenu(filter) {
  const items = filter === "all" ? menuItems : menuItems.filter((item) => item.category === filter);

  menuGrid.innerHTML = items
    .map(
      (item) => `
      <article class="menu-card">
        <span class="emoji" aria-hidden="true">${item.emoji}</span>
        <div class="menu-card-head">
          <h3>${item.name}</h3>
          <span class="price">$${item.price.toFixed(2)}</span>
        </div>
        <p>${item.desc}</p>
        <button class="add-btn" data-name="${item.name}">+ Add</button>
      </article>`
    )
    .join("");
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((b) => b.classList.remove("active"));
    button.classList.add("active");
    renderMenu(button.dataset.filter);
  });
});

// One listener on the grid handles every "Add" button (event delegation)
menuGrid.addEventListener("click", (event) => {
  const button = event.target.closest(".add-btn");
  if (!button) return;

  const item = menuItems.find((i) => i.name === button.dataset.name);
  order.push(item);
  updateOrder();

  button.textContent = "✓ Added";
  button.classList.add("added");
  setTimeout(() => {
    button.textContent = "+ Add";
    button.classList.remove("added");
  }, 1000);
});

function updateOrder() {
  const total = order.reduce((sum, item) => sum + item.price, 0);
  orderCount.textContent = order.length;
  orderTotal.textContent = "$" + total.toFixed(2);
}

document.getElementById("clearOrder").addEventListener("click", () => {
  order = [];
  updateOrder();
});

renderMenu("all");

/* ----- 6. Image carousel (buttons, dots, autoplay, swipe) ----- */
const track = document.getElementById("carouselTrack");
const slides = track.querySelectorAll(".slide");
const dotsContainer = document.getElementById("carouselDots");
const carousel = document.getElementById("carousel");
let currentSlide = 0;
let autoplay;

// Create one dot per slide
slides.forEach((_, index) => {
  const dot = document.createElement("button");
  dot.setAttribute("aria-label", `Go to slide ${index + 1}`);
  dot.addEventListener("click", () => goToSlide(index));
  dotsContainer.appendChild(dot);
});
const dots = dotsContainer.querySelectorAll("button");

function goToSlide(index) {
  // Wrap around at both ends
  currentSlide = (index + slides.length) % slides.length;
  track.style.transform = `translateX(-${currentSlide * 100}%)`;
  dots.forEach((dot, i) => dot.classList.toggle("active", i === currentSlide));
  restartAutoplay();
}

function restartAutoplay() {
  clearInterval(autoplay);
  autoplay = setInterval(() => goToSlide(currentSlide + 1), 5000);
}

document.getElementById("prevSlide").addEventListener("click", () => goToSlide(currentSlide - 1));
document.getElementById("nextSlide").addEventListener("click", () => goToSlide(currentSlide + 1));

// Pause while the mouse is over the carousel
carousel.addEventListener("mouseenter", () => clearInterval(autoplay));
carousel.addEventListener("mouseleave", restartAutoplay);

// Swipe support for touch screens
let touchStartX = 0;
carousel.addEventListener("touchstart", (e) => (touchStartX = e.touches[0].clientX), { passive: true });
carousel.addEventListener("touchend", (e) => {
  const diff = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(diff) > 50) goToSlide(currentSlide + (diff < 0 ? 1 : -1));
});

goToSlide(0);

/* ----- 7. Contact form validation (no backend – just a friendly message) ----- */
const form = document.getElementById("contactForm");
const formSuccess = document.getElementById("formSuccess");

function showError(field, message) {
  document.getElementById(field + "Error").textContent = message;
  document.getElementById(field).classList.toggle("invalid", message !== "");
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();
  let valid = true;

  showError("name", "");
  showError("email", "");
  showError("message", "");
  formSuccess.textContent = "";

  if (name.length < 2) {
    showError("name", "Please enter your name.");
    valid = false;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showError("email", "Please enter a valid email address.");
    valid = false;
  }
  if (message.length < 10) {
    showError("message", "Your message should be at least 10 characters.");
    valid = false;
  }

  if (valid) {
    formSuccess.textContent = `Thanks, ${name}! We'll get back to you soon. ☕`;
    form.reset();
  }
});

/* ----- 8. Footer year ----- */
document.getElementById("year").textContent = new Date().getFullYear();
