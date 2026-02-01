# Welcome to AI Jungle — Website

Landing page for AI Jungle — Loic's AI agency and content brand.

## Tech Stack

- Pure HTML + CSS + vanilla JS
- Google Fonts (Inter)
- No frameworks, no build step

## Local Preview

```bash
# Any static file server works:
python3 -m http.server 8000
# or
npx serve .
```

Open `http://localhost:8000`

## Deploy to GitHub Pages

### Option 1: Repository root

1. Push this folder's contents to a GitHub repo (e.g., `aijungle-website`)
2. Go to **Settings → Pages**
3. Source: **Deploy from a branch**
4. Branch: `main`, folder: `/ (root)`
5. Save — site will be live at `https://<username>.github.io/aijungle-website/`

### Option 2: Custom domain

1. Deploy as above
2. In **Settings → Pages → Custom domain**, enter your domain (e.g., `aijungle.com`)
3. Add a `CNAME` file with your domain, or configure DNS:
   - `A` records pointing to GitHub Pages IPs
   - Or `CNAME` record: `<username>.github.io`
4. Enable "Enforce HTTPS"

## Structure

```
├── index.html     # Single-page site
├── style.css      # All styles
├── main.js        # Minimal JS (nav, animations)
├── favicon.svg    # SVG favicon
└── README.md      # This file
```

## Extending

- **Portfolio section**: Uncomment the `<!-- PORTFOLIO -->` block in `index.html`
- **Blog**: Add a `/blog` directory with separate pages
- **Analytics**: Add your tracking snippet before `</head>`

## Brand Colors

| Color | Hex |
|-------|-----|
| Jungle Green | `#1B4332` |
| Jungle Teal | `#2D6A4F` |
| Bright Orange | `#F77F00` |
