# ☕ Bean & Bloom Café

A modern, responsive multi-page website for a fictional neighbourhood café. It's built with plain **HTML, CSS and JavaScript**: no frameworks, no build tools and no backend.

🔗 **Live site:** https://chiranshee26-source.github.io/bloom-cafe/
📁 **Repository:** https://github.com/chiranshee26-source/bloom-cafe

---

## 💡 The Idea

**Bean & Bloom** is a cosy café on Maple Street that serves small-batch coffee and pastries baked every morning.

- **Purpose:** to give the café a warm, modern online home. Visitors can browse the menu, see the space, read what regulars say, check whether it's open right now, and get in touch.
- **Target audience:** local residents, university students looking for a study spot, and remote workers who want a calm place with great coffee.
- **Design direction:** a toned-down but welcoming palette (cream, espresso and a terracotta accent), bold modern headings, hand-written touches, and "browser window" photo cards floating over a coffee background. Sticky notes holding customer reviews are scattered across every page.

## ✨ Features

| Feature | Where | Description |
|---|---|---|
| 🧭 **Responsive navigation** | All pages | A floating "pill" navbar. On mobile it becomes a full-screen menu that opens with a circular reveal animation. |
| 🎬 **Page transitions** | All pages | A coffee-coloured curtain with a filling cup slides between pages. |
| 🖼️ **Parallax hero** | Home | Floating photo windows, coffee beans and notes drift with the mouse at different depths. |
| 📝 **Sticky-note reviews** | All pages | Random customer reviews on colourful notes. You can drag them around with a mouse. |
| 📌 **Kindness wall** | Home | Visitors can leave their own note with a star rating. It's saved in `localStorage` and can be removed. |
| 🎠 **Favourites carousel** | Home | Arrow buttons, drag/swipe, autoplay that pauses on hover, and a progress bar. |
| 🔢 **Counting stats & fanning polaroids** | Home | Animations that play when you scroll to them. |
| 🍰 **Interactive menu** | Menu | Filter tabs with a sliding pill. "+" buttons send a dot flying into the basket. The order drawer has quantity controls and a total, and is saved in `localStorage`. |
| 🔍 **Gallery + lightbox** | Gallery | Category filters and a masonry layout. Click a photo to open the lightbox, which supports keyboard arrows and swipe. |
| 📈 **Scroll timeline & flip cards** | About | The timeline line fills as you scroll, and team cards flip over. |
| 🟢 **"Open now" badge** | Home, Visit | Calculated live from the opening hours. Today's row is highlighted. |
| ✉️ **Contact form** | Visit | Topic chips, friendly validation messages and a success animation (frontend only). There's also a copy-address button and an FAQ accordion. |
| ♿ **Accessibility** | All pages | Semantic HTML, alt text, ARIA labels, keyboard support, and support for the `prefers-reduced-motion` setting. |

## 🛠️ Technology Stack

- **HTML5**: semantic structure across 5 pages
- **CSS3**: custom properties, Flexbox, Grid, CSS columns (masonry), keyframe animations, `clip-path`, `backdrop-filter`, 3D transforms and media queries
- **Vanilla JavaScript (ES6+)**: DOM manipulation, events, `IntersectionObserver`, the Web Animations API, `localStorage` and the Clipboard API
- **Google Fonts**: *Bricolage Grotesque* (headings), *Inter* (body) and *Caveat* (hand-written notes)
- **GitHub Pages**: hosting

## 📂 Project Structure

```
bloom-cafe/
├── index.html        # Home
├── menu.html         # Menu + order basket
├── gallery.html      # Photo gallery + lightbox
├── about.html        # Story, timeline, values, team
├── visit.html        # Hours, directions, contact form, FAQ
├── css/
│   └── style.css     # All styles (organised in numbered sections)
├── js/
│   ├── main.js       # Shared: nav, transitions, notes, lightbox, open status
│   ├── home.js       # Parallax, carousel, counters, notes wall
│   ├── menu.js       # Menu data, filters, basket
│   ├── gallery.js    # Gallery filters
│   ├── about.js      # Timeline, flip cards
│   └── visit.js      # Contact form, copy address
├── images/           # Photos (see images/README.md)
└── assets/
    └── favicon.svg
```

## 🚀 Setup Instructions

### Run locally
1. Clone the repository:
   ```bash
   git clone https://github.com/chiranshee26-source/bloom-cafe.git
   cd bloom-cafe
   ```
2. Open `index.html` in your browser, or use a local server such as the VS Code **Live Server** extension, or:
   ```bash
   python -m http.server 8000
   # then visit http://localhost:8000
   ```

No installation or build step is needed.

### Deploy with GitHub Pages
1. Push the code to GitHub.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source: Deploy from a branch**, then choose **`main`** and **`/ (root)`**, and click **Save**.
4. The site goes live at `https://<username>.github.io/<repo-name>/`.

## 📱 Responsiveness

Tested at desktop (1440px), tablet and mobile (390px) widths:
- **Desktop:** the hero collage sits beside the headline, with multi-column grids and the full navbar.
- **Tablet (< 900px):** the hero collage moves below the headline, and the layouts switch to a single column.
- **Mobile (< 600px):** a full-screen menu, swipeable carousel and lightbox, and sticky notes placed inside the page flow.

## 📄 Credits

Bean & Bloom Café is a fictional business created for a learning project. Photos are from free stock sites (Unsplash / Pexels).
