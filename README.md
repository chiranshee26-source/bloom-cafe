# ☕ Bean & Bloom Café

A beginner-friendly, fully responsive website for a fictional neighbourhood café, built with plain **HTML, CSS and JavaScript**: no frameworks, no build step, no backend.

🔗 **Live site:** https://YOUR-USERNAME.github.io/bean-and-bloom-cafe/
📁 **Repository:** https://github.com/YOUR-USERNAME/bean-and-bloom-cafe

---

## 💡 The Idea

**Bean & Bloom Café** is a small, cozy café that serves specialty coffee and fresh pastries.

- **Purpose:** Give the café an online home where people can browse the menu, see what the place looks like, check opening hours and get in touch.
- **Target audience:** Local residents, university students looking for a study spot, and remote workers who want a quiet place with good coffee and Wi-Fi.

## ✨ Features

| Feature | Description |
|---|---|
| 📱 **Responsive navigation** | A full menu bar on desktop that turns into an animated hamburger menu on mobile. The current section is highlighted as you scroll. |
| 🟢 **"Open now" badge** | Shows whether the café is open right now, based on the visitor's local time and the opening hours. |
| 🍰 **Interactive menu** | Menu cards are generated from a JavaScript list. Category filter buttons (All / Coffee / Tea / Bakery) and **+ Add** buttons keep a running order count and total. |
| 🖼️ **Image carousel** | Previous/next arrows, clickable dots, 5-second autoplay (pauses on hover) and swipe support on touch screens. |
| 🌙 **Dark mode** | A toggle in the navbar switches themes. It follows the system preference by default and remembers your choice. |
| ✉️ **Contact form validation** | Checks name, email and message on the client side and shows friendly error and success messages. Nothing is sent to a server. |
| ⬆️ **Back-to-top button** | Appears after scrolling down. |
| ♿ **Accessibility** | Semantic HTML, alt text, ARIA labels and good colour contrast. |

## 🛠️ Technology Stack

- **HTML5**: semantic page structure
- **CSS3**: custom properties (variables) for theming, Flexbox, CSS Grid, media queries, keyframe animations
- **JavaScript (ES6)**: DOM manipulation, event handling and `localStorage`
- **Google Fonts**: *Fraunces* (headings) and *Inter* (body)
- **SVG**: hand-made illustrations for the carousel and favicon, so there are no external image dependencies
- **GitHub Pages**: hosting

## 📂 Project Structure

```
bean-and-bloom-cafe/
├── index.html      # Page structure and content
├── style.css       # All styles, including the dark theme and responsive breakpoints
├── script.js       # Navigation, carousel, menu, theme, form logic
├── assets/         # SVG images and favicon
└── README.md
```

## 🚀 Setup Instructions

### Run locally

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR-USERNAME/bean-and-bloom-cafe.git
   cd bean-and-bloom-cafe
   ```
2. **Open the site.** Either:
   - double-click `index.html` to open it in your browser, **or**
   - use a local server (recommended), for example the VS Code **Live Server** extension, or:
     ```bash
     python3 -m http.server 8000
     # then visit http://localhost:8000
     ```

No installation or build step is needed.

### Deploy with GitHub Pages

1. Push the code to a GitHub repository.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, choose **Source: Deploy from a branch**, then select branch **`main`** and folder **`/ (root)`**, and click **Save**.
4. After a minute your site is live at `https://YOUR-USERNAME.github.io/bean-and-bloom-cafe/`.

## 📱 Responsiveness

The layout was tested at these widths:

- **Desktop (> 900px):** multi-column grids and a horizontal navbar
- **Tablet (720–900px):** two-column cards, with the contact section stacked
- **Mobile (< 720px):** single column, hamburger menu, smaller hero and carousel controls

## 📄 License

Free to use for learning purposes. Bean & Bloom Café is a fictional business.
