# Capital One Shopping & Offers Tracker

View hidden trip data **and** browse every available offer with smart sorting on Capital One Shopping and Capital One Offers.

*From the makers of [UseYourCredits.com](https://useyourcredits.com/) — helping you get more from your credit cards.*

## What's New

**2026-08-02** — Streaming render, dev-tool dark theme, offers activation refactor, real shopping-trips pagination
- **Streaming**: both trips and browse walk-and-render — the modal fills in as each page arrives instead of waiting for the whole walk. New `onProgress(items, pages)` callback in every paginator (`fetchAllOffersTrips`, `fetchAllShoppingTrips`, `walkOffersFeed`, `walkShoppingFeed`) → both entry points wire it to `ui.setTabData(...)`. Renderers show an amber "Loading page N (X so far)" pill, preserve table scroll position, and preserve the browse search box's value / focus / selection across incremental re-renders. Big TTFR win under the 750ms throttle + CF 1015 retries.
- **Dev-tool dark theme**: dropped the indigo gradient + emoji brand for a compact Linear/VS-Code aesthetic. Solid dark surfaces (`#17181a` base, `#1e2023` elevated), one accent (One Dark blue `#61afef`), outlined status pills (4 semantic buckets instead of 7 hues), tabular-nums, monospace raw-JSON block, and an SVG bar-chart icon (`FAB_ICON_SVG`) in place of 📋. FAB shrinks 56px round → 44px rounded square with a border-accent hover.
- **Offers activation, take three**: `POST /xhr/feed/{userId}/offers/{tileId}` (dropped the retired `?_data` loader URL). Response is discriminated: `{affiliate: {redirectUrl, loyaltyTripReferenceId, shoppingTripId, welcomeBackMarkdownText}}` for affiliate offers, `{cardLinked: {cardLinkedOfferDetail: {isActivated, activationId, activationLimitsReached}}}` for card-linked. Handler tolerates both flat and `{success, offer: {...}}` wrapped shapes since Cap One emits either at different times.
- **Shopping-trips paginator**: `/api/v1/trip_orders` returns `{items, offset, limit}` with no `hasMore` field. `fetchAllShoppingTrips()` walks `?limit=100&offset=N&sort=desc` and terminates on a short page. Interceptor gate mirrors the offers logic: if the intercepted response has ≥50 items (Cap One's default page size), treat as page-1-of-many and defer to the paginator.
- **Broader trips status filter**: `Activated`, `Adjusted`, `Completed`, `Inactive`, `Ineligible`, `Pending`, `Waiting` — Cap One serves trips under both old and new status names simultaneously, and we were dropping several of them. `Activated` (card-linked offers live on a card, waiting for a swipe) gets its own accent-colored outline; older `Inactive` collapses onto `Canceled` alongside the newer `Ineligible`.
- **Trips modal enrichment**: two new columns from the `/xhr/shopping-trips` payload we were already fetching but not reading — **Rate** (summary display rate, e.g. "Up to 3X miles") and **Exclusions** (one-line truncated with `(more)/(less)` toggle mirroring the browse-side pattern). Shopping trips get em-dashes for these fields since the shopping API doesn't carry them.
- **Rate-limit hardening**: 300 → 750ms inter-page throttle, backoff base bumped from 500ms to 5s (5s → 10s → 20s → 40s per retry). `fetchWithRetry` now honors Cloudflare 1015's `retry_after` field from the JSON body when the `Retry-After` header is absent.

**2026-07-31** — Tabbed modal + always-on FAB per site
- One FAB per site now, always visible on any `capitaloneshopping.com` or `capitaloneoffers.com` URL. No more mode-switching between separate Trips and Browse FABs, no more "wrong page" gates. When Cap One shuffles page paths, we stop caring.
- Opening the FAB shows a tabbed modal with **Trips** and **Browse**. Each tab lazy-loads on first activation and caches for the rest of the session (no re-fetching on tab switches).
- The default active tab is picked from `detectMode()`: on a trips path → Trips tab; on the browse feed → Browse tab; on any other page → Trips tab (previously the FAB just wouldn't appear).
- Trips XHR interceptor still warms the Trips tab passively when the user happens to be on the trips page. On offers, if the intercepted response has `hasMore: true`, we skip the partial cache and let the paginator fetch the full set.
- Internally: `createUI<TData>` → `createTabbedUI` (tabs described declaratively; per-tab data cache and in-flight coalescing built in). Tampermonkey and bookmarklet-full both collapse from two-instance dispatch to one construction.

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

### Trips view
- Shows order amounts (often hidden in the UI)
- Shows actual cashback/miles earned + the offer's advertised **Rate** (e.g. "Up to 3X miles")
- Shows per-offer **Exclusions** with `(more)/(less)` expand toggle
- Corrects misleading status labels ("Canceled" → "Completed" when cashback was paid)
- Distinguishes pending trips with assigned cashback vs uncertain ones
- Filter by status, tracked orders, or cashback amounts
- **Streams** — rows appear as pagination pages arrive; amber loading pill in the stats bar shows current page

### Browse Offers view
- Walks the full paginated feed (capped at 40 pages, dedupes same merchant + same reward)
- Sorts by value within each reward unit so "best deals" surface first
- Search across merchant, reward text, item type, and exclusions
- Click any row to activate the correct variant in a new tab (affiliate offers → merchant redirect; card-linked → activated on-card with a confirmation)
- Inline attribute badges: Events (limited time), Price Drops, New Customer, Recently Viewed
- Showcase tiles surface their rich subtitle/heading description
- **Streams** — offers appear in their value buckets as each page returns; search input value + focus preserved across incremental re-renders

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

The FAB now appears on **any** URL of `capitaloneshopping.com` or `capitaloneoffers.com` and gives you both views via tabs. On the following canonical paths, the modal opens on the tab most relevant to the current page:

| URL | Default tab |
|-----|-------------|
| `capitaloneshopping.com/account-settings/shopping-trips` | Trips |
| `capitaloneoffers.com/shopping-trips` | Trips |
| `capitaloneshopping.com/` (homepage) | Browse |
| `capitaloneoffers.com/feed` | Browse |
| any other page on either site | Trips |

## Status labels (trips view)

| Status | Meaning |
|--------|---------|
| **Completed** | Cashback / miles were paid (even if API says "Canceled") |
| **Pending ✓** | Pending with cashback assigned — likely to succeed |
| **Pending ?** | Pending without cashback — uncertain outcome |
| **Created** | Click tracked, waiting for purchase confirmation (legacy "Waiting") |
| **Activated** | Card-linked offer live on your card, waiting for a qualifying swipe |
| **Adjusted** | Order amount was modified |
| **Canceled** | No cashback paid, tracking ended (also legacy "Inactive" / "Ineligible") |

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
