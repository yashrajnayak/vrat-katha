# व्रत कथा (Vrat Katha)

A lightweight, mobile-first Progressive Web App (PWA) for reading weekly Hindu vrat kathas in Hindi.

<img width="1280" height="1280" alt="Screenshots" src="https://github.com/user-attachments/assets/610d2d7b-db88-4ff3-87a1-eee7a7fd9477" />

Live app sections include:
- व्रत कथा (Katha)
- व्रत विधि (Vidhi)
- आरती (Aarti)

The app is fully static and designed to run smoothly on modern mobile browsers and GitHub Pages.

## Highlights

- 7-day vrat catalog (Sunday to Saturday)
- Day-specific visuals and themed color palette
- “Today’s Katha” quick entry on home screen
- Readable typography with adjustable font size
- First-use mobile prompt to add the app to the home screen
- PWA install support (`manifest.json` + `sw.js`)
- Offline support via service worker caching
- Hash-based routing (`#/`) so deep links work on static hosting

## Tech Stack

- HTML, CSS and Vanilla JavaScript
- LocalStorage for user preferences and first-use prompt state
- Service Worker Cache API

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
├── js/
│   ├── app.js
│   ├── data.js
│   ├── icons.js
│   ├── install-prompt.js
│   ├── router.js
│   ├── router-utils.mjs
│   ├── storage.js
│   ├── utils/
│   │   └── color.mjs
│   └── views/
│       ├── home.js
│       ├── katha.js
│       └── templates/
│           ├── home-template.js
│           └── katha-template.js
├── scripts/
│   └── smoke-check.sh
└── tests/
    ├── color-utils.test.mjs
    └── router-utils.test.mjs
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

The app stores the following in `localStorage`:
- `font_size_preference`
- `a2hs_prompt_seen`

### Offline Support

`sw.js` warms the cache at install time and discovers module assets from the app entry graph so cache coverage stays aligned with current JS modules.

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

## Quality Checks

Run syntax and unit tests:

```bash
bash scripts/smoke-check.sh
node --test tests/*.test.mjs
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
- `js/views/templates/katha-template.js`
- `data/kathas.json`
- `css/styles.css`

## Security and Stability Notes

The local development server (`server.js`) includes:
- path traversal protection
- correct static 404 behavior
- SPA fallback only for route-like paths

The UI safely handles invalid/empty data and applies content text via `textContent`.

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

MIT License - see [LICENSE](LICENSE) file for details.

## Acknowledgements

Devanagari font: Google Fonts (`Noto Sans Devanagari`).
