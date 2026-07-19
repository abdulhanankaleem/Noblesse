# Noblesse — Luxury Clothing E-Commerce Site

A front-end e-commerce experience for **Noblesse**, a fictional luxury tailoring house. Built as a static, dependency-free single-page app: vanilla HTML/CSS/JS with hash-based client-side routing and an in-memory shopping cart.

**[Live preview →](index.html)** (open directly in a browser, or serve locally — see below)

![Style](https://img.shields.io/badge/style-vanilla%20JS-5b1d2e) ![No build step](https://img.shields.io/badge/build%20step-none-a9875d)

---

## Features

- **Six views, one page** — Home, Shop, Product Detail, Cart, The House (about), and Lookbook, all client-side routed via `location.hash` (no framework, no bundler)
- **Working cart** — add pieces with a chosen size and quantity, adjust or remove line items, live subtotal/total
- **Category filtering** on the Shop page
- **Product gallery** with swappable thumbnails on the Product Detail page
- **Fully responsive**, down to small mobile widths
- **Reduced-motion support** and visible keyboard focus states

## Project structure

```
noblesse-shop/
├── index.html          # Markup + view containers for all six routes
├── css/
│   └── styles.css       # Design tokens (CSS custom properties) + all styling
├── js/
│   ├── data.js           # Product catalog and journal/lookbook content
│   └── app.js             # Rendering, cart logic, and the hash router
├── LICENSE
└── README.md
```

## Getting started

No build tools, package manager, or dependencies are required — this is a static site.

### Option 1: Open directly
Double-click `index.html`, or open it in a browser via `File → Open`.

### Option 2: Serve locally (recommended, avoids any local file restrictions)
```bash
# Python
python3 -m http.server 8000

# Node
npx serve .
```
Then visit `http://localhost:8000`.

### Option 3: Deploy
Since it's a static site, it deploys as-is to **GitHub Pages**, **Netlify**, **Vercel**, or any static host — just point them at this folder, with `index.html` as the entry point.

## Customizing

| To change...                     | Edit...                                   |
|-----------------------------------|--------------------------------------------|
| Colors, type, spacing              | CSS custom properties at the top of `css/styles.css` (`:root`) |
| Products, prices, fabrics          | `js/data.js` → `PRODUCTS` array |
| Journal / lookbook entries         | `js/data.js` → `JOURNAL` array |
| Copy (hero, about, footer)         | `index.html` |
| Cart, filtering, routing behavior  | `js/app.js` |

Product photography currently points to Unsplash placeholder URLs with a duotone CSS filter applied for a unified archival look. Replace the `img` / `img2` fields in `js/data.js` with your own asset paths (e.g. `assets/products/wool-overcoat-1.jpg`) when you have real photography.

## Known limitations

- **Checkout is a UI stub.** The "Checkout" button shows a confirmation toast rather than processing a real order — there's no payment integration.
- **Cart state is in-memory only.** It resets on page reload. Wiring up `localStorage` or a backend cart is a natural next step.
- **No CMS/backend.** Product and content data lives in `js/data.js`; a real deployment would likely move this to a headless CMS or API.

## License

MIT — see [LICENSE](LICENSE).
