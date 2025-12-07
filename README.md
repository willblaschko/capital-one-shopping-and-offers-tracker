# Capital One Shopping & Offers Tracker

View hidden order amounts and cashback data for your Capital One Shopping trips.

*From the makers of [UseYourCredits.com](https://useyourcredits.com/) — helping you get more from your credit cards.*

## Features

- Shows order amounts (often hidden in the UI)
- Shows actual cashback/miles earned
- Corrects misleading status labels ("Canceled" → "Completed" when cashback was paid)
- Distinguishes pending trips with assigned cashback vs uncertain ones
- Filter by status, tracked orders, or cashback amounts

## Installation

### Option 1: Bookmarklet (Recommended)

1. Open the **[Install Page](https://willblaschko.github.io/capital-one-shopping-and-offers-tracker/install.html)**
2. Drag the button to your bookmarks bar
3. Navigate to your Shopping Trips page and click the bookmarklet

### Option 2: Tampermonkey

1. Install [Tampermonkey](https://www.tampermonkey.net/) browser extension
2. Click to install: [tampermonkey.user.js](dist/tampermonkey.user.js)
3. The tracker will automatically appear on Shopping Trips pages

## Usage

1. Log in to [Capital One Shopping](https://capitaloneshopping.com/account-settings/shopping-trips) or [Capital One Offers](https://capitaloneoffers.com/c1-offers/shopping-trips)
2. Navigate to your Shopping Trips page
3. Click the floating button (or bookmarklet) to view your data

## Status Labels

| Status | Meaning |
|--------|---------|
| **Completed** | Cashback was paid (even if API says "Canceled") |
| **Pending ✓** | Pending with cashback assigned - likely to succeed |
| **Pending ?** | Pending without cashback - uncertain outcome |
| **Created** | Click tracked, waiting for purchase confirmation |
| **Adjusted** | Order amount was modified |
| **Canceled** | No cashback paid, tracking ended |

## Development

```bash
# Install dependencies
npm install

# Build dist files
npm run build
```

The build outputs:
- `dist/tampermonkey.user.js` - Tampermonkey userscript
- `dist/bookmarklet-full.js` - Full bookmarklet code
- `dist/bookmarklet-loader.js` - Tiny loader that fetches from CDN
- `dist/install.html` - Install page with drag-to-install buttons

A pre-push git hook automatically runs the build before pushing.

## Project Structure

```
src/
├── core.js           # Shared data processing and UI
├── tampermonkey.js   # Tampermonkey wrapper (API interception)
├── bookmarklet.js    # Bookmarklet loader
└── bookmarklet-full.js  # Full bookmarklet (direct API fetch)
scripts/
├── build.js          # esbuild bundler
└── setup-hooks.js    # Git hook installer
```

## License

MIT
