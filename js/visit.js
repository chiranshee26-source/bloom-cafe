/* ==========================================================
   Visit page: copy address, topic chips, contact form
   (no backend: the form only checks the input and says thanks)
   ========================================================== */

/* ---------- Copy the address ---------- */
document.getElementById("copyAddress").addEventListener("click", async () => {
  const text = document.getElementById("address").innerText.replace(/\n/g, " ");
  try {
    await navigator.clipboard.writeText(text);
    BB.toast("Address copied. See you soon! 📍");
  } catch (e) {
    BB.toast(text);
  }
});

/* ---------- Topic chips (pick one) ---------- */
const chips = document.querySelectorAll("#topicChips .chip");
chips.forEach((chip) =>
  chip.addEventListener("click", () => {
    chips.forEach((c) => c.classList.remove("active"));
    chip.classList.add("active");
  })
);

/* ---------- Contact form validation ---------- */
const form = document.getElementById("contactForm");
const sendBtn = document.getElementById("sendBtn");

function check(id, ok, message) {
  const field = document.getElementById(id).parentElement;
  field.classList.toggle("invalid", !ok);
  field.querySelector(".error").textContent = ok ? "" : message;
  return ok;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();

  const valid = [
    check("name", name.length >= 2, "Please tell us your name."),
    check("email", /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), "That email doesn't look quite right."),
    check("message", message.length >= 10, "A few more words please (10+ characters)."),
  ].every(Boolean);

  if (!valid) return;

  const topic = document.querySelector("#topicChips .active").textContent;
  sendBtn.classList.add("sent");
  sendBtn.innerHTML = "Sent ✓";
  BB.toast(`Thanks ${name}! We got your "${topic}" message ☕`);
  form.reset();

  setTimeout(() => {
    sendBtn.classList.remove("sent");
    sendBtn.innerHTML = 'Send message <span class="arrow">→</span>';
  }, 3000);
});
