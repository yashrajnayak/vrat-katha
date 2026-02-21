# व्रत कथा (Vrat Katha)

A lightweight, mobile-first Progressive Web App (PWA) for reading weekly Hindu vrat kathas in Hindi.

Live app sections include:
- व्रत कथा (Katha)
- व्रत विधि (Vidhi)
- आरती (Aarti)

The app is fully static and designed to run smoothly on modern mobile browsers and GitHub Pages.

## Highlights

- 7-day vrat catalog (Sunday to Saturday)
- Day-specific deity visuals and themed color palette
- “Today’s Katha” quick entry on home screen
- Readable typography with adjustable font size
- In-app content editing with local persistence
- Per-tab “reset to original” support
- PWA install support (`manifest.json` + `sw.js`)
- Offline-first behavior through service worker cache
- Hash-based routing (`#/`) so deep links work on static hosting

## Tech Stack

- HTML5
- CSS3 (custom, no framework)
- Vanilla JavaScript (ES modules)
- LocalStorage for user edits/preferences
- Service Worker Cache API
- Optional Node.js static server (`server.js`) for local development

## Project Structure

```text
.
├── index.html
├── manifest.json
├── sw.js
├── server.js
├── README.md
├── css/
│   └── styles.css
├── data/
│   └── kathas.json
├── icons/
│   ├── icon-192.png
│   └── icon-512.png
└── js/
    ├── app.js
    ├── data.js
    ├── icons.js
    ├── router.js
    ├── storage.js
    └── views/
        ├── home.js
        └── katha.js
```

## How It Works

### Routing

The app uses hash routing:
- Home: `#/`
- Detail page: `#/katha/<dayIndex>`

This avoids 404 issues on static hosts like GitHub Pages.

### Data Model

All core content lives in `data/kathas.json`.
Each day entry includes:
- `dayIndex`
- `dayNameHindi` / `dayNameEnglish`
- `deity`
- `deityIcon`
- `color` and `colorLight`
- `title`
- `katha`, `vidhi`, `aarti`

### Local Persistence

User edits and font size are saved in localStorage:
- `vrat_katha_custom_content`
- `font_size_preference`

### Offline Support

`sw.js` pre-caches app shell + content assets and serves cached responses when offline.

## Run Locally

### Option 1: Node static server (recommended)

Requirements:
- Node.js 18+ (or compatible)

Run:

```bash
node server.js
```

Then open:

```text
http://localhost:3456
```

### Option 2: Any static file server

You can serve this folder using any static server (`npx serve`, `python -m http.server`, etc.).

## Deploy to GitHub Pages

Because this app is static, no build step is required.

1. Push repository to GitHub.
2. Open repository settings.
3. Go to **Settings → Pages**.
4. Under **Build and deployment**, select:
   - **Source:** Deploy from a branch
   - **Branch:** `main`
   - **Folder:** `/ (root)`
5. Save.

Your site URL will be:

```text
https://yashrajnayak.github.io/vrat-katha/
```

## Customize Content

### Update kathas or aarti text

Edit:

- `data/kathas.json`

### Change theme or typography

Edit:

- `css/styles.css`

### Change icons

Edit:

- `js/icons.js`
- `icons/icon-192.png`
- `icons/icon-512.png`

### Add a new tab/section

Update:

- `js/views/katha.js`
- `data/kathas.json`
- `css/styles.css`

## Security and Stability Notes

The local development server (`server.js`) includes:
- path traversal protection
- correct static 404 behavior
- SPA fallback only for route-like paths

The UI also handles empty or invalid data safely and escapes rendered user content before injecting it into HTML.

## PWA Notes

For production updates, if users see stale content due to cache:
- bump `CACHE_NAME` in `sw.js`
- redeploy

## Browser Support

- Latest Chrome (Android/Desktop)
- Latest Edge
- Latest Firefox
- Safari iOS 16+

## License

No license file is included yet. If you want this open-source, add a `LICENSE` file (for example MIT).

## Acknowledgements

Devnagari font: Google Fonts (`Noto Sans Devanagari`).
