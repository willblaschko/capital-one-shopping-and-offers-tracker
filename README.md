# Capital One Shopping & Offers Tracker

View hidden trip data **and** browse every available offer with smart sorting on Capital One Shopping and Capital One Offers.

*From the makers of [UseYourCredits.com](https://useyourcredits.com/) — helping you get more from your credit cards.*

## What's New

**2026-07-30** — Track Cap One's offers-side refactor + real trips pagination
- Cap One Offers moved the trips page: `/c1-offers/shopping-trips` → `/shopping-trips`. FAB detection and the loader gate both follow suit.
- Trips XHR moved to `/xhr/shopping-trips` (from `/xhr/c1-offers/shopping-trips`) and now returns `{data, hasMore}` with a hard 100-per-page cap. We now actually paginate via `fetchAllOffersTrips()` (walks pages until `hasMore=false`, hard-capped at 50 pages / 5,000 trips as a safety net). No more silent 100-row truncation.
- Handle the renamed status: `Inactive` → `Ineligible`. Both collapse to `Canceled` for display.
- Fixed the React Router streamed-context regex used to discover userId on the bare `/feed` URL. The payload is a JSON-in-JS-string, so quotes are backslash-escaped (`\"maybeSelectedArid\",\"...\"`) — the old regex required raw quotes and never matched in production; the trips-API fallback had been silently carrying the load until that endpoint broke too.
- **Bookmarklet loader is now host-only.** Path-based gating moved entirely into the CDN-loaded bundle (which auto-updates). Cap One can move page paths without breaking already-installed bookmarklets. Existing bookmarklet users need to **re-drag the bookmarklet one last time** to pick up the new loader — after that, future URL moves propagate automatically.

**2026-06-01** — Browse Offers mode + TypeScript rewrite
- New **Browse Offers** mode on the Cap One Shopping homepage (`/`) and the Cap One Offers feed (`/feed`). Walks the cursor/token-paginated feeds, normalizes every tile to a canonical Offer, and shows them in collapsible value-tier buckets with search and quick-jump nav.
- Smart bucketing by reward unit and value range:
  - Multipliers — 30X+, 20–29X, 10–19X, 1–9X
  - Percent — 40%+, 20–39%, 10–19%, 1–9%
  - Cash — $50+, $25–49, under $25
  - Points — 10,000+, 5,000–9,999, 1,000–4,999, under 1,000
- Attribute categories (Events, Price Drops, New Customer, Recently Viewed) shown as inline badges so a 5% event still appears next to other 5% offers — no more hiding behind a separate tab.
- Deterministic click-to-activate: shopping rows open Cap One's pre-signed `href`; offers rows POST to `/feed/{userId}/offers/{tileId}` and navigate to the signed `redirectUrl` returned by Cap One. Variant-correct (HSN 5X vs HSN 90X are both clickable to the right offer).
- Codebase converted to TypeScript with a shared canonical type contract in `src/types.ts`.
- Vitest test suite (142 tests across core / browse / entry-points).

**2026-05-27**
- Cap One Offers (miles) site updated to handle the new response shape (`merchantDisplayName`, `payoutAmountCents`, `trxnTotalCents`, `Waiting`/`Inactive` statuses).
- Cap One Shopping (cashback) now falls back to `domain` when the `vendor` field is missing from a trip.

## Features

### Trips view (existing pages)
- Shows order amounts (often hidden in the UI)
- Shows actual cashback/miles earned
- Corrects misleading status labels ("Canceled" → "Completed" when cashback was paid)
- Distinguishes pending trips with assigned cashback vs uncertain ones
- Filter by status, tracked orders, or cashback amounts

### Browse Offers view (new — homepage + offers feed)
- Walks the full paginated feed (capped at 40 pages, dedupes same merchant + same reward)
- Sorts by value within each reward unit so "best deals" surface first
- Search across merchant, reward text, item type, and exclusions
- Click any row to activate the correct variant in a new tab
- Inline attribute badges: Events (limited time), Price Drops, New Customer, Recently Viewed
- Showcase tiles surface their rich subtitle/heading description

## Installation

### Option 1: Bookmarklet (Recommended)

1. Open the **[Install Page](https://willblaschko.github.io/capital-one-shopping-and-offers-tracker/install.html)**
2. Drag the button to your bookmarks bar
3. Click the bookmarklet on any of the four supported pages

### Option 2: Tampermonkey

1. Install [Tampermonkey](https://www.tampermonkey.net/) browser extension
2. Click to install: [tampermonkey.user.js](dist/tampermonkey.user.js)
3. The tracker FAB automatically appears on supported pages and switches between trips / browse modes based on the page

## Supported pages

| URL | Mode |
|-----|------|
| `capitaloneshopping.com/account-settings/shopping-trips` | Trips |
| `capitaloneoffers.com/shopping-trips` | Trips |
| `capitaloneshopping.com/` (homepage) | Browse |
| `capitaloneoffers.com/feed` | Browse |

## Status labels (trips view)

| Status | Meaning |
|--------|---------|
| **Completed** | Cashback was paid (even if API says "Canceled") |
| **Pending ✓** | Pending with cashback assigned — likely to succeed |
| **Pending ?** | Pending without cashback — uncertain outcome |
| **Created** | Click tracked, waiting for purchase confirmation |
| **Adjusted** | Order amount was modified |
| **Canceled** | No cashback paid, tracking ended |

## Development

```bash
# Install dependencies
npm install

# Run the test suite
npm test          # one-shot
npm run test:watch

# Strict typecheck (esbuild handles the actual transpilation during build)
npm run typecheck

# Build dist files
npm run build
```

The build outputs:
- `dist/tampermonkey.user.js` — Tampermonkey userscript
- `dist/bookmarklet-full.js` — Full bookmarklet code (loaded by the small bookmarklet via CDN)
- `dist/bookmarklet-loader.js` — Tiny loader bookmarklet URL
- `dist/bookmarklet-standalone.txt` — Self-contained bookmarklet (no CDN required)
- `dist/install.html` — Install page with drag-to-install buttons

A pre-push git hook automatically runs the build before pushing.

## Project structure

```
src/
├── types.ts            # Shared canonical type contract (Site, Mode, Offer,
│                       # Activation discriminated union, raw Cap One feed shapes)
├── core.ts             # CONFIG, detectMode, trip normalizers, generic createUI<TData>,
│                       # renderTripsToModal, shared STYLES blob
├── browse.ts           # Reward parsing, shopping + offers normalizers, bucketing,
│                       # cursor walkers, renderBrowseToModal
├── tampermonkey.ts     # Tampermonkey wrapper (API interception, persistent FAB,
│                       # dual trips/browse UI instances)
├── bookmarklet.ts      # Tiny loader bookmarklet
└── bookmarklet-full.ts # Full bookmarklet entry (direct fetch + UI bootstrap)
test/
├── core.test.ts        # Trip normalizers, detectMode, createUI wiring
├── browse.test.ts      # Reward parser, normalizers, bucketing, walkers, renderer
├── entry-points.test.ts# Loader gate, mode dispatch, FAB switching
└── sample.test.ts      # Pattern reference (fetch/DOM/location mocking)
scripts/
├── build.js            # esbuild bundler (picks .ts entry over .js per stem)
└── setup-hooks.js      # Git hook installer
```

## License

MIT
