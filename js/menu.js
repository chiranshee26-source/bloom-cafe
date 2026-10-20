/* ==========================================================
   Menu page: build the menu, filter tabs, order basket
   ========================================================== */

const menuItems = [
  { id: "espresso", name: "Espresso", price: 150, category: "espresso", desc: "A rich double shot of our house blend, Bloom No. 1.", badges: [] },
  { id: "flat-white", name: "Flat White", price: 220, category: "espresso", desc: "Silky micro-foam over a double ristretto.", badges: ["Bestseller"] },
  { id: "cappuccino", name: "Cappuccino", price: 200, category: "espresso", desc: "Equal parts espresso, steamed milk and fluffy foam.", badges: [] },
  { id: "caramel-latte", name: "Salted Caramel Latte", price: 260, category: "espresso", desc: "Espresso, steamed milk and our homemade salted caramel.", badges: [] },
  { id: "mocha", name: "Mocha", price: 250, category: "espresso", desc: "Espresso with 70% dark chocolate and steamed milk.", badges: [] },
  { id: "cold-brew", name: "Cold Brew", price: 240, category: "cold", desc: "Steeped for 18 hours. Smooth, chocolatey and refreshing.", badges: ["Vegan"] },
  { id: "pour-over", name: "Pour-Over", price: 280, category: "cold", desc: "Single-origin beans, brewed by hand. Ask what's on this week.", badges: ["Vegan"] },
  { id: "iced-latte", name: "Iced Oat Latte", price: 270, category: "cold", desc: "Double espresso over ice with creamy oat milk.", badges: ["Vegan"] },
  { id: "matcha", name: "Matcha Latte", price: 290, category: "tea", desc: "Ceremonial-grade matcha whisked with oat milk.", badges: ["New", "Vegan"] },
  { id: "chai", name: "Dirty Chai", price: 230, category: "tea", desc: "House-spiced chai with a shot of espresso.", badges: [] },
  { id: "hot-choc", name: "Hot Chocolate", price: 210, category: "tea", desc: "Real dark chocolate, topped with whipped cream.", badges: [] },
  { id: "croissant", name: "Butter Croissant", price: 160, category: "bakery", desc: "Flaky, golden and out of the oven at 6am.", badges: [] },
  { id: "almond-croissant", name: "Almond Croissant", price: 200, category: "bakery", desc: "Twice-baked with frangipane and toasted almonds.", badges: ["Bestseller"] },
  { id: "cinnamon-roll", name: "Cinnamon Roll", price: 190, category: "bakery", desc: "Soft and gooey, with cream-cheese icing.", badges: [] },
  { id: "banana-bread", name: "Banana Bread", price: 170, category: "bakery", desc: "Toasted, with a little salted butter on the side.", badges: ["Vegan"] },
  { id: "lemon-cake", name: "Lemon Drizzle Cake", price: 220, category: "bakery", desc: "Zesty, soft and soaked in lemon syrup.", badges: [] },
  { id: "avocado-toast", name: "Avocado Toast", price: 350, category: "bakery", desc: "Smashed avocado, chilli flakes and lemon on toasted sourdough.", badges: ["Vegan"] },
];

// Format a number as Indian rupees, e.g. 1250 -> "₹1,250"
const rupees = (amount) => "₹" + amount.toLocaleString("en-IN");

const grid = document.getElementById("menuGrid");
const tabs = document.querySelectorAll("#menuTabs button");
const pill = document.querySelector(".tab-pill");

/* ---------- 1. Show the menu ---------- */
function renderMenu(filter) {
  const items = filter === "all" ? menuItems : menuItems.filter((item) => item.category === filter);

  grid.innerHTML = items
    .map((item, i) => {
      const badges = item.badges
        .map((b) => `<span class="badge ${b === "Vegan" ? "vegan" : ""}">${b}</span>`)
        .join("");
      return `
        <article class="menu-item" style="animation-delay:${i * 0.05}s">
          <div>
            <div class="menu-item-head">
              <h3>${item.name}</h3><span class="dots"></span><span class="price">${rupees(item.price)}</span>
            </div>
            <p>${item.desc}</p>
            ${badges ? `<div class="badges">${badges}</div>` : ""}
          </div>
          <button class="add-btn" data-id="${item.id}" aria-label="Add ${item.name} to order">+</button>
        </article>`;
    })
    .join("");
}

/* ---------- 2. Filter tabs with a sliding pill ---------- */
function movePill(button) {
  pill.style.width = button.offsetWidth + "px";
  pill.style.transform = `translateX(${button.offsetLeft}px)`;
}

tabs.forEach((button) => {
  button.addEventListener("click", () => {
    tabs.forEach((b) => b.classList.remove("active"));
    button.classList.add("active");
    movePill(button);
    renderMenu(button.dataset.filter);
  });
});

window.addEventListener("resize", () => movePill(document.querySelector("#menuTabs .active")));
document.fonts.ready.then(() => movePill(document.querySelector("#menuTabs .active")));
renderMenu("all");

/* ---------- 3. Order basket (saved in localStorage) ---------- */
let basket = BB.load("bb-basket", {}); // { itemId: quantity }

const basketBtn = document.getElementById("basketBtn");
const basketCount = document.getElementById("basketCount");
const drawer = document.getElementById("drawer");
const backdrop = document.getElementById("drawerBackdrop");
const list = document.getElementById("drawerList");
const totalEl = document.getElementById("drawerTotal");

function updateBasket() {
  BB.save("bb-basket", basket);
  const entries = Object.entries(basket);
  const count = entries.reduce((sum, [, qty]) => sum + qty, 0);
  const total = entries.reduce((sum, [id, qty]) => sum + menuItems.find((i) => i.id === id).price * qty, 0);

  basketCount.textContent = count;
  totalEl.textContent = rupees(total);

  list.innerHTML = entries.length
    ? entries
        .map(([id, qty]) => {
          const item = menuItems.find((i) => i.id === id);
          return `
          <li>
            <strong>${item.name}</strong>
            <div class="qty">
              <button data-change="-1" data-id="${id}" aria-label="Remove one">−</button>
              <span>${qty}</span>
              <button data-change="1" data-id="${id}" aria-label="Add one">+</button>
            </div>
            <small>${rupees(item.price * qty)}</small>
          </li>`;
        })
        .join("")
    : `<li class="drawer-empty"><span class="hand">Nothing here yet…</span>tap the + next to anything that looks tasty</li>`;
}

function changeQty(id, change) {
  basket[id] = (basket[id] || 0) + change;
  if (basket[id] <= 0) delete basket[id];
  updateBasket();
}

// A little dot flies from the + button into the basket
function flyToBasket(button) {
  const from = button.getBoundingClientRect();
  const to = basketBtn.getBoundingClientRect();
  const dot = document.createElement("span");
  dot.className = "fly-dot";
  dot.style.left = from.left + from.width / 2 - 9 + "px";
  dot.style.top = from.top + from.height / 2 - 9 + "px";
  document.body.appendChild(dot);

  const dx = to.left + 30 - (from.left + from.width / 2);
  const dy = to.top + to.height / 2 - (from.top + from.height / 2);
  dot
    .animate(
      [
        { transform: "translate(0, 0) scale(1)" },
        { transform: `translate(${dx * 0.5}px, ${dy * 0.5 - 120}px) scale(1.3)`, offset: 0.5 },
        { transform: `translate(${dx}px, ${dy}px) scale(0.4)` },
      ],
      { duration: 700, easing: "cubic-bezier(.5,0,.5,1)" }
    )
    .finished.then(() => {
      dot.remove();
      basketBtn.classList.remove("bump");
      void basketBtn.offsetWidth; // restart the animation
      basketBtn.classList.add("bump");
    });
}

grid.addEventListener("click", (e) => {
  const button = e.target.closest(".add-btn");
  if (!button) return;
  changeQty(button.dataset.id, 1);
  flyToBasket(button);
});

list.addEventListener("click", (e) => {
  const button = e.target.closest("[data-change]");
  if (button) changeQty(button.dataset.id, Number(button.dataset.change));
});

function openDrawer(open) {
  drawer.classList.toggle("open", open);
  backdrop.classList.toggle("open", open);
}

basketBtn.addEventListener("click", () => openDrawer(true));
document.getElementById("drawerClose").addEventListener("click", () => openDrawer(false));
backdrop.addEventListener("click", () => openDrawer(false));
document.addEventListener("keydown", (e) => e.key === "Escape" && openDrawer(false));

document.getElementById("placeOrder").addEventListener("click", () => {
  if (!Object.keys(basket).length) {
    BB.toast("Your basket is empty. Add something first ☺");
    return;
  }
  basket = {};
  updateBasket();
  openDrawer(false);
  BB.toast("Order placed! (Demo only. Nothing was actually ordered ☕)");
});

updateBasket();
