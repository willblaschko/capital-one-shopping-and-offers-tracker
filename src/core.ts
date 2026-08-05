//=============================================================================
// CORE - Shared logic for Capital One Shopping & Offers Tracker
//=============================================================================

import type {
    ConfigMap,
    Site,
    Mode,
    RawTrip,
    Trip,
    TripsData,
    CreateTabbedUIOptions,
    TabbedUIHandle,
    RenderFn
} from './types.js';

// Single source of truth for the userscript / bookmarklet version. Bumped on
// each release. scripts/build.js reads this via regex so the Tampermonkey
// @version header always matches whatever the modal's (i) popover displays.
export const C1T_VERSION = '3.7.0';

export const CONFIG: ConfigMap = {
    offers: {
        hostname: 'capitaloneoffers',
        pages: { trips: '/shopping-trips', browse: '/feed' },
        trips: {
            apiPattern: (url: string) => url.includes('/xhr/shopping-trips'),
            // First-page endpoint. For the full paginated set, use fetchAllOffersTrips().
            // Cap One's server keeps returning trips under BOTH the old status names
            // (Waiting/Inactive) and the new ones (Pending/Ineligible), plus Activated
            // for card-linked offers. Send every known value so nothing is silently dropped.
            apiEndpoint:
                '/xhr/shopping-trips?limit=100&offset=0' +
                '&status[]=Activated&status[]=Adjusted&status[]=Completed' +
                '&status[]=Inactive&status[]=Ineligible&status[]=Pending&status[]=Waiting'
        },
        browse: {
            apiPattern: (url: string) =>
                url.includes('/feed/') && url.includes('viewInstanceId=')
        }
    },
    shopping: {
        hostname: 'capitaloneshopping',
        pages: { trips: '/account-settings/shopping-trips', browse: '/' },
        trips: {
            apiPattern: (url: string) => url.includes('/api/v1/trip_orders'),
            apiEndpoint: '/api/v1/trip_orders'
        },
        browse: {
            apiPattern: (url: string) => url.endsWith('/api/v1/feed'),
            apiEndpoint: '/api/v1/feed'
        }
    }
};

export function getCurrentSite(): Site | null {
    if (window.location.hostname.includes('capitaloneoffers')) return 'offers';
    if (window.location.hostname.includes('capitaloneshopping')) return 'shopping';
    return null;
}

export function detectMode(): Mode | null {
    const site = getCurrentSite();
    if (!site) return null;
    const p = window.location.pathname;
    const pages = CONFIG[site].pages;
    if (p.startsWith(pages.trips)) return 'trips';
    if (site === 'shopping' && (p === '/' || p === '')) return 'browse';
    if (site === 'offers' && p.startsWith(pages.browse)) return 'browse';
    return null;
}

export function isOnShoppingTripsPage(): boolean {
    return detectMode() === 'trips';
}

export function isOnBrowsePage(): boolean {
    return detectMode() === 'browse';
}

//=============================================================================
// DATA LAYER - Normalize API responses to standard format
//=============================================================================

// `unknown` input — we probe the shape at runtime.
export function extractTripsArray(data: unknown): RawTrip[] {
    if (!data) return [];
    if (Array.isArray(data)) return data as RawTrip[];
    // After this point, treat `data` as an indexable object for shape probing.
    const obj = data as Record<string, unknown>;
    if (Array.isArray(obj.items)) return obj.items as RawTrip[];
    if (Array.isArray(obj.shoppingTrips)) return obj.shoppingTrips as RawTrip[];
    if (Array.isArray(obj.trip_orders)) return obj.trip_orders as RawTrip[];
    if (obj.data && Array.isArray(obj.data)) return obj.data as RawTrip[];
    if (
        obj.data &&
        typeof obj.data === 'object' &&
        Array.isArray((obj.data as Record<string, unknown>).items)
    ) {
        return (obj.data as { items: RawTrip[] }).items;
    }
    return [];
}

export function normalizeTrip(raw: RawTrip): Trip {
    const orderAmount =
        raw.orderAmount ??
        raw.order_amount ??
        (raw.trxnTotalCents != null ? raw.trxnTotalCents / 100 : null);
    const creditAmount =
        raw.creditAmount ??
        raw.credit_amount ??
        (raw.payoutAmountCents != null ? raw.payoutAmountCents / 100 : null);
    const orderId = raw.orderId ?? raw.order_id ?? null;
    const hasCreditAmount = creditAmount !== null && Number(creditAmount) > 0;

    // Derive display status based on credit amount and raw status.
    // Miles API used to use "Waiting"/"Inactive"; the newer /xhr/shopping-trips
    // endpoint returns "Pending"/"Ineligible" instead. Map both eras onto the
    // canonical labels the display logic already understands.
    let rawStatus = raw.status ?? 'Unknown';
    if (rawStatus === 'Waiting') rawStatus = 'Created';
    else if (rawStatus === 'Inactive' || rawStatus === 'Ineligible') rawStatus = 'Canceled';

    let displayStatus: string = rawStatus;
    if (hasCreditAmount && rawStatus.toLowerCase() === 'canceled') {
        displayStatus = 'Completed';
    } else if (rawStatus.toLowerCase() === 'pending') {
        displayStatus = hasCreditAmount ? 'Pending ✓' : 'Pending ?';
    }

    return {
        id: raw.id ?? raw.tripId ?? raw.activatedOfferId ?? null,
        tripId:
            raw.tripId ?? raw.trip_id ?? raw.id ?? raw.activatedOfferId ?? null,
        orderId: orderId,
        merchant:
            raw.vendor ??
            raw.merchantName ??
            raw.merchantDisplayName ??
            raw.merchant ??
            raw.domain ??
            'Unknown',
        domain: raw.domain ?? null,
        status: displayStatus,
        rawStatus: rawStatus,
        orderAmount: orderAmount !== null ? Number(orderAmount) : null,
        creditAmount: creditAmount !== null ? Number(creditAmount) : null,
        date:
            raw.createdAt ??
            raw.created_at ??
            raw.clickDate ??
            raw.date ??
            null,
        hasOrderId: orderId !== null,
        hasAmount: orderAmount !== null && Number(orderAmount) > 0,
        hasCreditAmount: hasCreditAmount,
        // Offers-side enrichment; shopping trips don't carry these, so default to "".
        // Prefer the summary rate; fall back to the top per-category rate; else blank.
        rewardDisplay:
            raw.rewardsSummaryDisplayRate ??
            (Array.isArray(raw.rewards) ? raw.rewards[0]?.displayRate : undefined) ??
            '',
        exclusions: raw.merchantExclusions ?? '',
        raw: raw
    };
}

export function processTripsData(rawData: unknown): TripsData {
    const rawTrips = extractTripsArray(rawData);
    const trips = rawTrips.map(normalizeTrip);

    return {
        trips,
        stats: {
            total: trips.length,
            withOrderId: trips.filter((t) => t.hasOrderId).length,
            withAmount: trips.filter((t) => t.hasAmount).length,
            withCredit: trips.filter((t) => t.hasCreditAmount).length,
            pending: trips.filter((t) =>
                t.status.toLowerCase().includes('pending')
            ).length,
            created: trips.filter((t) => t.status.toLowerCase() === 'created')
                .length
        }
    };
}

//=============================================================================
// Offers trips paginator — /xhr/shopping-trips returns { data, hasMore } and
// caps at 100 per page. Walk until hasMore=false (or a hard page cap for safety).
//=============================================================================

const OFFERS_TRIPS_PAGE_SIZE = 100;
const OFFERS_TRIPS_MAX_PAGES = 50; // 5,000 trip ceiling — safety net, not a real limit
// See CONFIG.offers.trips.apiEndpoint for why all seven status values are included.
const OFFERS_TRIPS_BASE =
    '/xhr/shopping-trips?limit=' + OFFERS_TRIPS_PAGE_SIZE +
    '&status[]=Activated&status[]=Adjusted&status[]=Completed' +
    '&status[]=Inactive&status[]=Ineligible&status[]=Pending&status[]=Waiting';

/**
 * Fetch every page of the offers trips API and return them in a single
 * {data: [...]} envelope compatible with processTripsData.
 *
 * Optional onProgress fires after each page with the accumulated items so
 * callers can render partial results as the walk unfolds (better TTFR on
 * long histories under the 750ms throttle).
 */
export async function fetchAllOffersTrips(
    opts: { onProgress?: (itemsSoFar: RawTrip[], pagesWalked: number) => void } = {}
): Promise<{ data: RawTrip[] }> {
    const all: RawTrip[] = [];
    for (let page = 0; page < OFFERS_TRIPS_MAX_PAGES; page++) {
        const url = OFFERS_TRIPS_BASE + '&offset=' + page * OFFERS_TRIPS_PAGE_SIZE;
        const r = await fetch(url, { method: 'POST', credentials: 'include' });
        if (!r.ok) throw new Error('shopping-trips returned ' + r.status);
        const body = (await r.json()) as { data?: RawTrip[]; hasMore?: boolean };
        const items = Array.isArray(body.data) ? body.data : [];
        all.push(...items);
        opts.onProgress?.(all, page + 1);
        if (body.hasMore !== true || items.length === 0) break;
    }
    return { data: all };
}

//=============================================================================
// Shopping trips paginator — /api/v1/trip_orders returns {items, offset, limit}
// with no hasMore field. Walk until a short page comes back (len < limit).
//=============================================================================

const SHOPPING_TRIPS_PAGE_SIZE = 100;
const SHOPPING_TRIPS_MAX_PAGES = 50; // 5,000 trip ceiling — safety net

/**
 * Fetch every page of the shopping trips API. Termination: any page shorter
 * than SHOPPING_TRIPS_PAGE_SIZE means we've hit the end. Response envelope is
 * {items: RawTrip[]}, which extractTripsArray already unwraps.
 *
 * onProgress fires after each page with accumulated items — same contract as
 * fetchAllOffersTrips, so callers can render partial data as it streams in.
 */
export async function fetchAllShoppingTrips(
    opts: { onProgress?: (itemsSoFar: RawTrip[], pagesWalked: number) => void } = {}
): Promise<{ items: RawTrip[] }> {
    const all: RawTrip[] = [];
    for (let page = 0; page < SHOPPING_TRIPS_MAX_PAGES; page++) {
        const offset = page * SHOPPING_TRIPS_PAGE_SIZE;
        const url =
            '/api/v1/trip_orders?limit=' + SHOPPING_TRIPS_PAGE_SIZE +
            '&offset=' + offset + '&sort=desc';
        const r = await fetch(url, { credentials: 'include' });
        if (!r.ok) throw new Error('trip_orders returned ' + r.status);
        const body = (await r.json()) as { items?: RawTrip[] };
        const items = Array.isArray(body.items) ? body.items : [];
        all.push(...items);
        opts.onProgress?.(all, page + 1);
        if (items.length < SHOPPING_TRIPS_PAGE_SIZE) break;
    }
    return { items: all };
}

//=============================================================================
// UI LAYER - Styles and Components
//=============================================================================

// Small bar-chart SVG used as the FAB icon and modal header mark. Uses
// currentColor so its color follows the surrounding CSS rules.
export const FAB_ICON_SVG =
    '<svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M4 15V10"/><path d="M10 15V5"/><path d="M16 15V8"/><path d="M3 17h14"/>' +
    '</svg>';

// Info (i) glyph used on the modal header's info button.
export const INFO_ICON_SVG =
    '<svg viewBox="0 0 20 20" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<circle cx="10" cy="10" r="8"/><path d="M10 9v5"/>' +
    '<circle cx="10" cy="6.25" r="0.6" fill="currentColor" stroke="none"/>' +
    '</svg>';

export const STYLES = `
    /* --- Design tokens (scoped to our elements to avoid leaking to the host) --- */
    #c1t-fab, #c1t-overlay {
        --c1t-bg: #17181a;
        --c1t-bg-elevated: #1e2023;
        --c1t-bg-hover: #26292d;
        --c1t-border: #2d3138;
        --c1t-border-strong: #3a3f47;
        --c1t-text: #e6e8eb;
        --c1t-text-muted: #9ca0a5;
        --c1t-text-dim: #6b7076;
        --c1t-accent: #61afef;
        --c1t-positive: #7ec27a;
        --c1t-attention: #e5c07b;
        --c1t-negative: #e06c75;
        --c1t-font: -apple-system, BlinkMacSystemFont, 'SF Pro Text',
            'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        --c1t-font-mono: ui-monospace, 'SF Mono', Menlo, Consolas, monospace;
    }

    /* --- FAB --- */
    #c1t-fab {
        position: fixed !important;
        bottom: 20px !important;
        right: 20px !important;
        width: 44px !important;
        height: 44px !important;
        min-width: 44px !important;
        min-height: 44px !important;
        box-sizing: border-box !important;
        padding: 0 !important;
        margin: 0 !important;
        border-radius: 8px !important;
        background: var(--c1t-bg) !important;
        color: var(--c1t-text) !important;
        border: 1px solid var(--c1t-border-strong) !important;
        cursor: pointer !important;
        box-shadow: 0 4px 14px rgba(0,0,0,0.35) !important;
        z-index: 2147483647 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        font-family: var(--c1t-font) !important;
        transition: border-color 0.15s, transform 0.15s !important;
    }
    #c1t-fab:hover {
        border-color: var(--c1t-accent) !important;
        transform: translateY(-1px) !important;
    }
    #c1t-fab svg { display: block !important; }
    #c1t-fab.has-data svg { color: var(--c1t-accent) !important; }
    #c1t-fab .badge {
        position: absolute !important;
        top: -6px !important;
        right: -6px !important;
        background: var(--c1t-accent) !important;
        color: var(--c1t-bg) !important;
        font-size: 12px !important;
        font-weight: 600 !important;
        padding: 2px 6px !important;
        border-radius: 8px !important;
        min-width: 16px !important;
        text-align: center !important;
        box-shadow: 0 0 0 2px var(--c1t-bg) !important;
        line-height: 1.3 !important;
        font-family: var(--c1t-font) !important;
    }

    /* --- Overlay + modal --- */
    #c1t-overlay {
        position: fixed !important;
        inset: 0 !important;
        background: rgba(10, 12, 14, 0.55) !important;
        z-index: 2147483647 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        opacity: 0 !important;
        visibility: hidden !important;
        transition: opacity 0.15s !important;
        font-family: var(--c1t-font) !important;
        color: var(--c1t-text) !important;
    }
    #c1t-overlay.open { opacity: 1 !important; visibility: visible !important; }
    #c1t-modal {
        background: var(--c1t-bg) !important;
        color: var(--c1t-text) !important;
        border: 1px solid var(--c1t-border-strong) !important;
        border-radius: 8px !important;
        box-shadow: 0 12px 32px rgba(0,0,0,0.45) !important;
        width: 92% !important;
        max-width: 960px !important;
        max-height: 82vh !important;
        display: flex !important;
        flex-direction: column !important;
        transform: translateY(8px) !important;
        opacity: 0 !important;
        transition: transform 0.15s, opacity 0.15s !important;
    }
    #c1t-overlay.open #c1t-modal { transform: translateY(0) !important; opacity: 1 !important; }

    /* --- Header --- */
    #c1t-header {
        padding: 12px 16px !important;
        border-bottom: 1px solid var(--c1t-border) !important;
        display: flex !important;
        align-items: center !important;
        justify-content: space-between !important;
        flex-shrink: 0 !important;
    }
    #c1t-header h2 {
        margin: 0 !important;
        font-size: 15px !important;
        font-weight: 600 !important;
        color: var(--c1t-text) !important;
        letter-spacing: 0.01em !important;
        display: flex !important;
        align-items: center !important;
        gap: 8px !important;
    }
    #c1t-header h2 svg { color: var(--c1t-accent) !important; }
    #c1t-close {
        background: transparent !important;
        border: 1px solid var(--c1t-border) !important;
        color: var(--c1t-text-muted) !important;
        width: 24px !important;
        height: 24px !important;
        min-width: 24px !important;
        border-radius: 5px !important;
        cursor: pointer !important;
        font-size: 15px !important;
        line-height: 1 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        padding: 0 !important;
        box-sizing: border-box !important;
        font-family: var(--c1t-font) !important;
        transition: color 0.12s, border-color 0.12s !important;
    }
    #c1t-close:hover { color: var(--c1t-text) !important; border-color: var(--c1t-border-strong) !important; }
    #c1t-header-actions {
        display: flex !important;
        align-items: center !important;
        gap: 6px !important;
        position: relative !important;
    }
    #c1t-info {
        background: transparent !important;
        border: 1px solid var(--c1t-border) !important;
        color: var(--c1t-text-muted) !important;
        width: 24px !important;
        height: 24px !important;
        min-width: 24px !important;
        border-radius: 5px !important;
        cursor: pointer !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        padding: 0 !important;
        box-sizing: border-box !important;
        font-family: var(--c1t-font) !important;
        transition: color 0.12s, border-color 0.12s !important;
    }
    #c1t-info:hover { color: var(--c1t-text) !important; border-color: var(--c1t-border-strong) !important; }
    #c1t-info.c1t-active { color: var(--c1t-accent) !important; border-color: var(--c1t-accent) !important; }
    #c1t-info-popover {
        position: absolute !important;
        top: calc(100% + 8px) !important;
        right: 0 !important;
        background: var(--c1t-bg-elevated) !important;
        border: 1px solid var(--c1t-border-strong) !important;
        border-radius: 6px !important;
        padding: 12px 14px !important;
        font-size: 13px !important;
        color: var(--c1t-text) !important;
        box-shadow: 0 6px 20px rgba(0,0,0,0.5) !important;
        min-width: 220px !important;
        max-width: 300px !important;
        z-index: 2 !important;
        display: none !important;
        line-height: 1.5 !important;
    }
    #c1t-info-popover.c1t-visible { display: block !important; }
    #c1t-info-popover .c1t-info-row {
        display: flex !important;
        justify-content: space-between !important;
        gap: 12px !important;
        color: var(--c1t-text-muted) !important;
        font-size: 12px !important;
    }
    #c1t-info-popover .c1t-info-row + .c1t-info-row { margin-top: 4px !important; }
    #c1t-info-popover .c1t-info-value {
        color: var(--c1t-text) !important;
        font-variant-numeric: tabular-nums !important;
        font-family: var(--c1t-font-mono) !important;
        font-size: 12px !important;
    }
    #c1t-info-popover .c1t-info-title {
        font-weight: 600 !important;
        color: var(--c1t-text) !important;
        font-size: 13px !important;
        margin-bottom: 8px !important;
    }
    #c1t-info-popover a {
        color: var(--c1t-accent) !important;
        text-decoration: none !important;
    }
    #c1t-info-popover a:hover { text-decoration: underline !important; }
    #c1t-info-popover .c1t-info-footer {
        margin-top: 10px !important;
        padding-top: 8px !important;
        border-top: 1px solid var(--c1t-border) !important;
        font-size: 11px !important;
        color: var(--c1t-text-muted) !important;
    }

    /* --- Tabs --- */
    #c1t-tabs {
        display: flex !important;
        gap: 2px !important;
        padding: 0 12px !important;
        border-bottom: 1px solid var(--c1t-border) !important;
        background: var(--c1t-bg) !important;
        flex-shrink: 0 !important;
    }
    .c1t-tab {
        background: transparent !important;
        border: none !important;
        color: var(--c1t-text-muted) !important;
        padding: 9px 14px !important;
        cursor: pointer !important;
        font-size: 14px !important;
        font-weight: 500 !important;
        font-family: var(--c1t-font) !important;
        border-bottom: 2px solid transparent !important;
        margin-bottom: -1px !important;
        transition: color 0.12s, border-color 0.12s !important;
    }
    .c1t-tab:hover { color: var(--c1t-text) !important; }
    .c1t-tab.active { color: var(--c1t-text) !important; border-bottom-color: var(--c1t-accent) !important; }

    /* --- Loading banner (below tabs, above content) --- */
    #c1t-progress-banner {
        display: flex !important;
        align-items: center !important;
        gap: 10px !important;
        padding: 0 16px !important;
        background: rgba(97, 175, 239, 0.06) !important;
        border-bottom: 0 solid var(--c1t-border) !important;
        color: var(--c1t-text) !important;
        font-size: 13px !important;
        font-weight: 500 !important;
        flex-shrink: 0 !important;
        max-height: 0 !important;
        opacity: 0 !important;
        overflow: hidden !important;
        transition: max-height 0.2s ease, opacity 0.2s ease,
            padding 0.2s ease, border-bottom-width 0.2s ease !important;
    }
    #c1t-progress-banner.c1t-visible {
        max-height: 44px !important;
        opacity: 1 !important;
        padding-top: 10px !important;
        padding-bottom: 10px !important;
        border-bottom-width: 1px !important;
    }
    .c1t-spinner {
        width: 14px !important;
        height: 14px !important;
        border: 2px solid var(--c1t-border-strong) !important;
        border-top-color: var(--c1t-accent) !important;
        border-radius: 50% !important;
        display: inline-block !important;
        flex-shrink: 0 !important;
        animation: c1t-spin 0.8s linear infinite !important;
    }
    .c1t-progress-label { color: var(--c1t-text) !important; }
    .c1t-progress-label strong {
        color: var(--c1t-accent) !important;
        font-weight: 600 !important;
        font-variant-numeric: tabular-nums !important;
    }
    @keyframes c1t-spin { to { transform: rotate(360deg); } }

    /* --- Stats + loading pill --- */
    #c1t-stats {
        padding: 8px 16px !important;
        background: var(--c1t-bg-elevated) !important;
        border-bottom: 1px solid var(--c1t-border) !important;
        font-size: 14px !important;
        color: var(--c1t-text-muted) !important;
        flex-shrink: 0 !important;
        display: flex !important;
        flex-wrap: wrap !important;
        gap: 4px 18px !important;
        align-items: center !important;
    }
    #c1t-stats .stat { display: inline-flex !important; align-items: baseline !important; gap: 5px !important; }
    #c1t-stats strong { color: var(--c1t-text) !important; font-weight: 600 !important; font-variant-numeric: tabular-nums !important; }

    /* --- Filter chips --- */
    #c1t-filters {
        padding: 8px 14px !important;
        display: flex !important;
        gap: 4px !important;
        flex-wrap: wrap !important;
        border-bottom: 1px solid var(--c1t-border) !important;
        background: var(--c1t-bg) !important;
        flex-shrink: 0 !important;
    }
    .c1t-filter-btn {
        background: transparent !important;
        border: 1px solid var(--c1t-border) !important;
        color: var(--c1t-text-muted) !important;
        padding: 3px 10px !important;
        border-radius: 4px !important;
        cursor: pointer !important;
        font-size: 13px !important;
        font-family: var(--c1t-font) !important;
        transition: color 0.12s, border-color 0.12s, background 0.12s !important;
    }
    .c1t-filter-btn:hover { color: var(--c1t-text) !important; border-color: var(--c1t-border-strong) !important; }
    .c1t-filter-btn.active {
        color: var(--c1t-text) !important;
        border-color: var(--c1t-accent) !important;
        background: rgba(97, 175, 239, 0.08) !important;
    }

    /* --- Table --- */
    #c1t-table-wrap {
        flex: 1 !important;
        overflow-y: auto !important;
        padding: 0 !important;
    }
    #c1t-table {
        width: 100% !important;
        border-collapse: collapse !important;
        font-size: 14px !important;
        color: var(--c1t-text) !important;
    }
    #c1t-table.c1t-table-fixed { table-layout: fixed !important; }
    #c1t-table.c1t-table-fixed td {
        word-wrap: break-word !important;
        overflow-wrap: anywhere !important;
    }
    /* Zebra striping — subtle brightness lift on odd rows only. */
    #c1t-table tbody tr:nth-child(odd) { background: rgba(255,255,255,0.015) !important; }
    #c1t-table th {
        text-align: left !important;
        padding: 8px 12px !important;
        border-bottom: 1px solid var(--c1t-border) !important;
        font-weight: 500 !important;
        font-size: 12px !important;
        text-transform: uppercase !important;
        letter-spacing: 0.06em !important;
        position: sticky !important;
        top: 0 !important;
        background: var(--c1t-bg-elevated) !important;
        color: var(--c1t-text-muted) !important;
        z-index: 1 !important;
    }
    #c1t-table th.r { text-align: right !important; }
    #c1t-table th.c { text-align: center !important; }
    #c1t-table td {
        padding: 8px 12px !important;
        border-bottom: 1px solid var(--c1t-border) !important;
        color: var(--c1t-text) !important;
        vertical-align: top !important;
        font-variant-numeric: tabular-nums !important;
    }
    #c1t-table td.r { text-align: right !important; }
    #c1t-table td.c { text-align: center !important; }
    #c1t-table tbody tr:hover { background: var(--c1t-bg-hover) !important; }

    /* --- Status pill: 4 semantic buckets, outlined --- */
    .c1t-status {
        display: inline-block !important;
        padding: 2px 7px !important;
        border-radius: 4px !important;
        font-size: 12px !important;
        font-weight: 500 !important;
        letter-spacing: 0.02em !important;
        background: transparent !important;
        color: var(--c1t-text-muted) !important;
        border: 1px solid var(--c1t-border-strong) !important;
    }
    .c1t-status.completed,
    .c1t-status.pending-good {
        color: var(--c1t-positive) !important;
        border-color: rgba(126, 194, 122, 0.4) !important;
    }
    .c1t-status.pending-uncertain,
    .c1t-status.created {
        color: var(--c1t-attention) !important;
        border-color: rgba(229, 192, 123, 0.4) !important;
    }
    .c1t-status.activated,
    .c1t-status.adjusted {
        color: var(--c1t-accent) !important;
        border-color: rgba(97, 175, 239, 0.4) !important;
    }
    .c1t-status.canceled {
        color: var(--c1t-negative) !important;
        border-color: rgba(224, 108, 117, 0.4) !important;
    }
    .c1t-credit { color: var(--c1t-positive) !important; font-weight: 500 !important; }
    .c1t-amount { color: var(--c1t-text) !important; font-weight: 500 !important; }

    /* --- Footer + raw JSON --- */
    #c1t-footer {
        padding: 8px 16px !important;
        border-top: 1px solid var(--c1t-border) !important;
        background: var(--c1t-bg-elevated) !important;
        flex-shrink: 0 !important;
    }
    #c1t-footer details { font-size: 13px !important; color: var(--c1t-text-muted) !important; }
    #c1t-footer summary { cursor: pointer !important; color: var(--c1t-text-muted) !important; }
    #c1t-footer summary:hover { color: var(--c1t-text) !important; }
    #c1t-footer pre {
        background: var(--c1t-bg) !important;
        border: 1px solid var(--c1t-border) !important;
        padding: 10px !important;
        border-radius: 6px !important;
        overflow: auto !important;
        max-height: 220px !important;
        font-size: 13px !important;
        margin-top: 8px !important;
        color: var(--c1t-text) !important;
        font-family: var(--c1t-font-mono) !important;
        line-height: 1.5 !important;
    }

    #c1t-loading {
        padding: 40px 20px !important;
        text-align: center !important;
        color: var(--c1t-text-muted) !important;
        font-size: 14px !important;
    }
    #c1t-content {
        display: flex !important;
        flex-direction: column !important;
        flex: 1 !important;
        min-height: 0 !important;
        overflow: hidden !important;
    }

    /* --- Browse mode --- */
    #c1t-browse-search {
        padding: 10px 14px 6px !important;
        display: flex !important;
        gap: 6px !important;
        border-bottom: 1px solid var(--c1t-border) !important;
        flex-shrink: 0 !important;
    }
    #c1t-browse-search input {
        flex: 1 !important;
        padding: 6px 10px !important;
        border-radius: 6px !important;
        border: 1px solid var(--c1t-border) !important;
        background: var(--c1t-bg-elevated) !important;
        color: var(--c1t-text) !important;
        font-size: 14px !important;
        font-family: var(--c1t-font) !important;
        outline: none !important;
        transition: border-color 0.12s !important;
    }
    #c1t-browse-search input:focus { border-color: var(--c1t-accent) !important; }
    #c1t-browse-search input::placeholder { color: var(--c1t-text-dim) !important; }
    #c1t-browse-search button {
        background: transparent !important;
        border: 1px solid var(--c1t-border) !important;
        color: var(--c1t-text-muted) !important;
        padding: 0 10px !important;
        border-radius: 6px !important;
        cursor: pointer !important;
        font-size: 13px !important;
        font-family: var(--c1t-font) !important;
        transition: color 0.12s, border-color 0.12s !important;
    }
    #c1t-browse-search button:hover { color: var(--c1t-text) !important; border-color: var(--c1t-border-strong) !important; }
    #c1t-browse-nav {
        padding: 6px 14px !important;
        display: flex !important;
        gap: 4px !important;
        flex-wrap: wrap !important;
        border-bottom: 1px solid var(--c1t-border) !important;
        flex-shrink: 0 !important;
    }
    .c1t-jump-chip {
        background: transparent !important;
        border: 1px solid var(--c1t-border) !important;
        color: var(--c1t-text-muted) !important;
        padding: 3px 9px !important;
        border-radius: 4px !important;
        cursor: pointer !important;
        font-size: 13px !important;
        font-family: var(--c1t-font) !important;
        transition: color 0.12s, border-color 0.12s !important;
    }
    .c1t-jump-chip:hover { color: var(--c1t-text) !important; border-color: var(--c1t-border-strong) !important; }
    #c1t-browse-stats {
        padding: 6px 14px !important;
        font-size: 13px !important;
        color: var(--c1t-text-muted) !important;
        border-bottom: 1px solid var(--c1t-border) !important;
        flex-shrink: 0 !important;
    }
    #c1t-browse-body {
        flex: 1 !important;
        overflow-y: auto !important;
        padding: 8px !important;
    }
    .c1t-bucket {
        margin-bottom: 10px !important;
        background: var(--c1t-bg-elevated) !important;
        border: 1px solid var(--c1t-border) !important;
        border-radius: 6px !important;
    }
    /* Bucket group header — heavier hierarchy so it stands apart from the
       merchant rows inside. Accent-colored disclosure caret, larger label. */
    .c1t-bucket > summary {
        padding: 12px 14px !important;
        cursor: pointer !important;
        font-weight: 700 !important;
        font-size: 15px !important;
        color: var(--c1t-text) !important;
        list-style: none !important;
        user-select: none !important;
        display: flex !important;
        align-items: center !important;
        gap: 10px !important;
        letter-spacing: 0.01em !important;
        background: var(--c1t-bg-hover) !important;
        border-radius: 6px 6px 0 0 !important;
    }
    .c1t-bucket:not([open]) > summary { border-radius: 6px !important; }
    .c1t-bucket > summary:hover { background: rgba(97, 175, 239, 0.06) !important; }
    .c1t-bucket > summary::-webkit-details-marker { display: none !important; }
    .c1t-bucket > summary::before {
        content: '▸' !important;
        font-size: 13px !important;
        color: var(--c1t-accent) !important;
        transition: transform 0.12s !important;
        flex-shrink: 0 !important;
    }
    .c1t-bucket[open] > summary::before { transform: rotate(90deg) !important; }
    .c1t-bucket-count {
        color: var(--c1t-text-muted) !important;
        font-weight: 400 !important;
        font-size: 13px !important;
        margin-left: auto !important;
    }
    .c1t-bucket table {
        width: 100% !important;
        border-collapse: collapse !important;
        font-size: 14px !important;
        table-layout: fixed !important;
    }
    /* Fixed column widths for browse rows — merchant/reward/badge/ends/exclusions.
       Adjust in the renderer if the column list changes. */
    .c1t-bucket colgroup col.merchant  { width: 22% !important; }
    .c1t-bucket colgroup col.reward    { width: 15% !important; }
    .c1t-bucket colgroup col.badge     { width: 15% !important; }
    .c1t-bucket colgroup col.ends      { width: 12% !important; }
    .c1t-bucket colgroup col.exclusions { width: 36% !important; }
    .c1t-bucket th {
        text-align: left !important;
        padding: 8px 12px !important;
        border-top: 1px solid var(--c1t-border) !important;
        border-bottom: 1px solid var(--c1t-border) !important;
        font-weight: 500 !important;
        font-size: 12px !important;
        color: var(--c1t-text-muted) !important;
        text-transform: uppercase !important;
        letter-spacing: 0.06em !important;
        background: var(--c1t-bg) !important;
    }
    .c1t-bucket td {
        padding: 8px 12px !important;
        border-bottom: 1px solid var(--c1t-border) !important;
        color: var(--c1t-text) !important;
        font-variant-numeric: tabular-nums !important;
        word-wrap: break-word !important;
        overflow-wrap: anywhere !important;
        vertical-align: top !important;
    }
    /* Zebra rows to help scanning across long merchant names. */
    .c1t-bucket tbody tr:nth-child(odd) { background: rgba(255,255,255,0.015) !important; }
    .c1t-bucket tr:last-child td { border-bottom: none !important; }
    .c1t-row-click { cursor: pointer !important; }
    .c1t-row-click:hover { background: var(--c1t-bg-hover) !important; }
    .c1t-reward { font-weight: 500 !important; color: var(--c1t-positive) !important; }

    /* Attribute pills — outlined, single-accent-per-type */
    .c1t-pill {
        display: inline-block !important;
        padding: 1px 6px !important;
        border-radius: 3px !important;
        font-size: 12px !important;
        font-weight: 500 !important;
        background: transparent !important;
        color: var(--c1t-text-muted) !important;
        border: 1px solid var(--c1t-border-strong) !important;
        letter-spacing: 0.02em !important;
    }
    .c1t-pill.event { color: var(--c1t-positive) !important; border-color: rgba(126, 194, 122, 0.4) !important; }
    .c1t-pill.deal { color: var(--c1t-attention) !important; border-color: rgba(229, 192, 123, 0.4) !important; }
    .c1t-pill.new { color: var(--c1t-accent) !important; border-color: rgba(97, 175, 239, 0.4) !important; }

    .c1t-excl-cell {
        font-size: 13px !important;
        color: var(--c1t-text-muted) !important;
        display: flex !important;
        align-items: baseline !important;
        gap: 4px !important;
        max-width: 280px !important;
    }
    .c1t-excl-cell .c1t-excl-text {
        flex: 1 1 auto !important;
        min-width: 0 !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
        white-space: nowrap !important;
    }
    .c1t-excl-cell.c1t-excl-expanded { max-width: 420px !important; align-items: flex-start !important; }
    .c1t-excl-cell.c1t-excl-expanded .c1t-excl-text {
        white-space: normal !important;
        text-overflow: clip !important;
        overflow: visible !important;
    }
    .c1t-excl-toggle {
        flex: 0 0 auto !important;
        background: none !important;
        border: none !important;
        padding: 0 !important;
        color: var(--c1t-accent) !important;
        cursor: pointer !important;
        font: inherit !important;
        font-size: 13px !important;
        text-decoration: none !important;
    }
    .c1t-excl-toggle:hover { text-decoration: underline !important; }
    .c1t-event-end { font-size: 13px !important; color: var(--c1t-text-muted) !important; white-space: nowrap !important; }
    #c1t-browse-footer {
        padding: 8px 14px !important;
        font-size: 13px !important;
        color: var(--c1t-text-muted) !important;
        border-top: 1px solid var(--c1t-border) !important;
        background: var(--c1t-bg-elevated) !important;
        flex-shrink: 0 !important;
    }
`;

export function formatCurrency(amount: number | null | undefined): string {
    if (amount === null || amount === undefined || amount === 0) return '—';
    return '$' + Number(amount).toFixed(2);
}

export function formatDate(dateStr: string | null | undefined): string {
    if (!dateStr) return '—';
    try {
        return new Date(dateStr).toLocaleDateString();
    } catch {
        return '—';
    }
}

export function escapeHtml(str: unknown): string {
    if (str == null) return '';
    const div = document.createElement('div');
    div.textContent = String(str);
    return div.innerHTML;
}

export function getStatusClass(status: string | null | undefined): string {
    const s = (status || '').toLowerCase();
    if (s.includes('completed')) return 'completed';
    if (s === 'pending ✓') return 'pending-good';
    if (s === 'pending ?') return 'pending-uncertain';
    if (s.includes('pending')) return 'pending-uncertain';
    if (s.includes('created')) return 'created';
    if (s.includes('activated')) return 'activated';
    if (s.includes('cancel')) return 'canceled';
    if (s.includes('adjust')) return 'adjusted';
    return '';
}

//=============================================================================
// Trips renderer — extracted from the old inline `renderDataToModal`.
// Signature matches RenderFn<TripsData> so it can be plugged into a TabDef.
//=============================================================================

export const renderTripsToModal: RenderFn<TripsData> = (overlay, data) => {
    console.log(
        '[C1 Tracker] renderTripsToModal called - data:',
        !!data,
        'overlay:',
        !!overlay
    );
    if (!data) return;

    const { trips, stats } = data;
    const content = overlay.querySelector('#c1t-content');
    console.log(
        '[C1 Tracker] renderTripsToModal - content element:',
        !!content,
        'trips:',
        trips?.length
    );
    if (!content) return;

    // Preserve table scroll position across incremental renders so streaming
    // updates don't jump the user back to the top on every page.
    const prevWrap = content.querySelector<HTMLElement>('#c1t-table-wrap');
    const prevScroll = prevWrap?.scrollTop ?? 0;

    // Loading state lives in createTabbedUI's #c1t-progress-banner (below tabs,
    // above content) — no inline pill here anymore.
    content.innerHTML = `
        <div id="c1t-stats">
            <span class="stat"><strong>${stats.total}</strong> total</span>
            <span class="stat"><strong>${stats.withOrderId}</strong> tracked</span>
            <span class="stat"><strong>${stats.withAmount}</strong> with amount</span>
            <span class="stat"><strong>${stats.withCredit}</strong> with cashback</span>
        </div>
        <div id="c1t-filters">
            <button class="c1t-filter-btn active" data-filter="all">All (${stats.total})</button>
            <button class="c1t-filter-btn" data-filter="amount">With Amount (${stats.withAmount})</button>
            <button class="c1t-filter-btn" data-filter="tracked">Tracked (${stats.withOrderId})</button>
            <button class="c1t-filter-btn" data-filter="pending">Pending (${stats.pending})</button>
            <button class="c1t-filter-btn" data-filter="created">Waiting (${stats.created})</button>
        </div>
        <div id="c1t-table-wrap">
            <table id="c1t-table" class="c1t-table-fixed">
                <colgroup>
                    <col style="width: 18%" />
                    <col style="width: 9%" />
                    <col style="width: 12%" />
                    <col style="width: 12%" />
                    <col style="width: 14%" />
                    <col style="width: 10%" />
                    <col style="width: 7%" />
                    <col style="width: 18%" />
                </colgroup>
                <thead>
                    <tr>
                        <th>Merchant</th>
                        <th class="c">Date</th>
                        <th class="r">Order</th>
                        <th class="r">Cash Back</th>
                        <th>Rate</th>
                        <th class="c">Status</th>
                        <th class="c">Tracked</th>
                        <th>Exclusions</th>
                    </tr>
                </thead>
                <tbody id="c1t-tbody">
                    ${trips
                        .map((t) => {
                            const rowClass = t.hasCreditAmount
                                ? 'amt'
                                : t.hasOrderId
                                ? 'tracked'
                                : '';
                            const statusClass = getStatusClass(t.status);
                            const exclText = t.exclusions ?? '';
                            const exclLong = exclText.length > 60;
                            const exclHtml = !exclText
                                ? '<span style="opacity:0.4">—</span>'
                                : exclLong
                                    ? `<div class="c1t-excl-cell" title="${escapeHtml(exclText)}"><span class="c1t-excl-text">${escapeHtml(exclText)}</span><button type="button" class="c1t-excl-toggle">(more)</button></div>`
                                    : `<div class="c1t-excl-cell" title="${escapeHtml(exclText)}"><span class="c1t-excl-text">${escapeHtml(exclText)}</span></div>`;
                            return `
                                <tr class="${rowClass}" data-filter-amount="${t.hasAmount}" data-filter-tracked="${t.hasOrderId}" data-filter-pending="${t.status
                                .toLowerCase()
                                .includes('pending')}" data-filter-created="${
                                t.status.toLowerCase() === 'created'
                            }">
                                    <td title="${escapeHtml(t.domain)}">${escapeHtml(t.merchant)}</td>
                                    <td class="c">${formatDate(t.date)}</td>
                                    <td class="r ${t.hasAmount ? 'c1t-amount' : ''}">${formatCurrency(t.orderAmount)}</td>
                                    <td class="r ${t.hasCreditAmount ? 'c1t-credit' : ''}">${formatCurrency(t.creditAmount)}</td>
                                    <td>${escapeHtml(t.rewardDisplay) || '<span style="opacity:0.4">—</span>'}</td>
                                    <td class="c"><span class="c1t-status ${statusClass}">${escapeHtml(t.status)}</span></td>
                                    <td class="c">${t.hasOrderId ? '✓' : '—'}</td>
                                    <td>${exclHtml}</td>
                                </tr>
                            `;
                        })
                        .join('')}
                </tbody>
            </table>
        </div>
        <div id="c1t-footer">
            <details>
                <summary>Show Raw JSON</summary>
                <pre>${escapeHtml(
                    JSON.stringify(
                        trips.slice(0, 30).map((t) => t.raw),
                        null,
                        2
                    )
                )}${
        trips.length > 30
            ? '\n\n... and ' + (trips.length - 30) + ' more'
            : ''
    }</pre>
            </details>
        </div>
    `;

    // Restore prior scroll position — makes streaming updates non-jumpy.
    const nextWrap = content.querySelector<HTMLElement>('#c1t-table-wrap');
    if (nextWrap && prevScroll > 0) nextWrap.scrollTop = prevScroll;

    content.querySelectorAll<HTMLButtonElement>('.c1t-filter-btn').forEach((btn) => {
        btn.addEventListener('click', function (this: HTMLButtonElement) {
            content
                .querySelectorAll<HTMLButtonElement>('.c1t-filter-btn')
                .forEach((b) => b.classList.remove('active'));
            this.classList.add('active');

            const filter = this.dataset.filter;
            content
                .querySelectorAll<HTMLTableRowElement>('#c1t-tbody tr')
                .forEach((row) => {
                    if (filter === 'all') {
                        row.style.display = '';
                    } else if (filter) {
                        const key = `filter${
                            filter.charAt(0).toUpperCase() + filter.slice(1)
                        }`;
                        row.style.display =
                            row.dataset[key] === 'true' ? '' : 'none';
                    }
                });
        });
    });

    // Exclusions (more)/(less) toggle — mirrors the browse-side pattern.
    content.querySelectorAll<HTMLButtonElement>('.c1t-excl-toggle').forEach((toggle) => {
        toggle.addEventListener('click', (ev) => {
            ev.stopPropagation();
            ev.preventDefault();
            const cell = toggle.closest('.c1t-excl-cell') as HTMLElement | null;
            if (!cell) return;
            const expanded = cell.classList.toggle('c1t-excl-expanded');
            toggle.textContent = expanded ? '(less)' : '(more)';
        });
    });
};

//=============================================================================
// UI factory — generic over TData so the same skeleton powers trips & browse.
//=============================================================================

export function createTabbedUI(options: CreateTabbedUIOptions): TabbedUIHandle {
    const { title, tabs, defaultTabId } = options;

    if (tabs.length === 0) throw new Error('createTabbedUI: tabs must be non-empty');
    if (!tabs.find((t) => t.id === defaultTabId)) {
        throw new Error(`createTabbedUI: defaultTabId "${defaultTabId}" not in tabs`);
    }

    // Per-tab data cache. Populated by onActivate (lazy) or setTabData (interceptor).
    const dataByTab = new Map<string, unknown>();
    // Per-tab in-flight promise so double-clicks don't fire multiple loaders.
    const inFlightByTab = new Map<string, Promise<void>>();
    // Per-tab loading banner text ("Loading page 3 (46 offers)"). Renamed from
    // the old loadingByTab (which was the in-flight promise map) to avoid confusion.
    const progressTextByTab = new Map<string, string>();

    let stylesInjected = false;
    let activeTabId = defaultTabId;

    function findTab(id: string) {
        return tabs.find((t) => t.id === id) ?? null;
    }

    function ensureStyles(): void {
        if (stylesInjected && document.getElementById('c1t-styles')) return;
        let styleEl = document.getElementById('c1t-styles');
        if (!styleEl) {
            styleEl = document.createElement('style');
            styleEl.id = 'c1t-styles';
            styleEl.textContent = STYLES;
            (document.head || document.documentElement).appendChild(styleEl);
        }
        stylesInjected = true;
    }

    function ensureFab(): HTMLElement {
        ensureStyles();
        const existing = document.getElementById('c1t-fab');
        if (existing) return existing;

        const fab = document.createElement('button');
        fab.id = 'c1t-fab';
        fab.innerHTML = FAB_ICON_SVG;
        fab.title = title;
        fab.addEventListener('click', () => {
            const overlay = ensureOverlay();
            overlay.classList.add('open');
            // Ensure the active tab renders (or begins loading) whenever we open.
            void activateTab(activeTabId);
        });
        document.body.appendChild(fab);
        refreshBadge();
        return fab;
    }

    function ensureOverlay(): HTMLElement {
        ensureStyles();
        let overlay = document.getElementById('c1t-overlay');
        if (overlay) return overlay;

        overlay = document.createElement('div');
        overlay.id = 'c1t-overlay';
        overlay.innerHTML = `
            <div id="c1t-modal">
                <div id="c1t-header">
                    <h2>${FAB_ICON_SVG}<span>${escapeHtml(title)}</span></h2>
                    <div id="c1t-header-actions">
                        <button id="c1t-info" aria-label="About / version" title="About">${INFO_ICON_SVG}</button>
                        <button id="c1t-close" aria-label="Close">✕</button>
                        <div id="c1t-info-popover" role="dialog" aria-label="About">
                            <div class="c1t-info-title">Cap One Shopping &amp; Offers Tracker</div>
                            <div class="c1t-info-row">
                                <span>Version</span>
                                <span class="c1t-info-value">${escapeHtml(C1T_VERSION)}</span>
                            </div>
                            <div class="c1t-info-row">
                                <span>Site</span>
                                <span class="c1t-info-value">${escapeHtml(getCurrentSite() ?? 'unknown')}</span>
                            </div>
                            <div class="c1t-info-footer">
                                <a href="https://github.com/willblaschko/capital-one-shopping-and-offers-tracker" target="_blank" rel="noopener">GitHub</a>
                                &middot; From
                                <a href="https://useyourcredits.com/" target="_blank" rel="noopener">UseYourCredits.com</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="c1t-tabs">
                    ${tabs
                        .map(
                            (t) =>
                                `<button class="c1t-tab${t.id === activeTabId ? ' active' : ''}" data-tab-id="${escapeHtml(t.id)}">${escapeHtml(t.label)}</button>`
                        )
                        .join('')}
                </div>
                <div id="c1t-progress-banner" role="status" aria-live="polite">
                    <span class="c1t-spinner"></span>
                    <span class="c1t-progress-label"></span>
                </div>
                <div id="c1t-content"></div>
            </div>
        `;
        document.body.appendChild(overlay);

        const overlayEl = overlay;
        overlayEl.querySelector('#c1t-close')?.addEventListener('click', () => {
            overlayEl.classList.remove('open');
        });
        overlayEl.addEventListener('click', (e) => {
            if (e.target === overlayEl) overlayEl.classList.remove('open');
        });

        // Info popover toggle. Click the (i) to show/hide; clicking elsewhere
        // in the modal hides it too. Popover stops propagation on its own
        // clicks so interacting with the links doesn't dismiss it.
        const infoBtn = overlayEl.querySelector<HTMLButtonElement>('#c1t-info');
        const popover = overlayEl.querySelector<HTMLElement>('#c1t-info-popover');
        infoBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            popover?.classList.toggle('c1t-visible');
            infoBtn.classList.toggle('c1t-active');
        });
        popover?.addEventListener('click', (e) => e.stopPropagation());
        overlayEl.addEventListener('click', () => {
            if (popover?.classList.contains('c1t-visible')) {
                popover.classList.remove('c1t-visible');
                infoBtn?.classList.remove('c1t-active');
            }
        });

        overlayEl.querySelectorAll<HTMLButtonElement>('.c1t-tab').forEach((btn) => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.tabId;
                if (id) void activateTab(id);
            });
        });

        return overlay;
    }

    async function activateTab(id: string): Promise<void> {
        const tab = findTab(id);
        if (!tab) return;
        activeTabId = id;

        const overlay = document.getElementById('c1t-overlay');
        if (overlay) {
            overlay.querySelectorAll<HTMLButtonElement>('.c1t-tab').forEach((btn) => {
                btn.classList.toggle('active', btn.dataset.tabId === id);
            });
        }
        // Banner state is per-tab; refresh so switching tabs shows/hides
        // the banner based on the destination tab's loading state.
        refreshProgressBanner();

        const content = overlay?.querySelector<HTMLElement>('#c1t-content');

        // Already-cached data → render immediately.
        if (dataByTab.has(id)) {
            if (content) tab.render(overlay!, dataByTab.get(id));
            return;
        }

        // No data + no loader → show placeholder and stop.
        if (!tab.onActivate) {
            if (content) {
                content.innerHTML = `<div id="c1t-loading">${escapeHtml(tab.loadingText ?? 'No data.')}</div>`;
            }
            return;
        }

        // Coalesce concurrent activations of the same tab.
        if (inFlightByTab.has(id)) {
            await inFlightByTab.get(id);
            return;
        }

        if (content) {
            content.innerHTML = `<div id="c1t-loading">${escapeHtml(tab.loadingText ?? 'Loading…')}</div>`;
        }

        const loadPromise = (async () => {
            try {
                const data = await tab.onActivate!();
                if (data != null) {
                    setTabData(id, data);
                }
            } catch (e) {
                console.error('[C1 Tracker] tab loader threw:', e);
                const msg = e instanceof Error ? e.message : String(e);
                const c = document.getElementById('c1t-content');
                if (c && activeTabId === id) {
                    c.innerHTML = `<div id="c1t-loading">Error loading data: ${escapeHtml(msg)}</div>`;
                }
            } finally {
                inFlightByTab.delete(id);
                // Whatever the loader was streaming is now done — clear the banner.
                setTabLoading(id, null);
            }
        })();
        inFlightByTab.set(id, loadPromise);
        await loadPromise;
    }

    function setActiveTab(id: string): void {
        void activateTab(id);
    }

    function setTabData(id: string, data: unknown): void {
        const tab = findTab(id);
        if (!tab) return;
        dataByTab.set(id, data);
        refreshBadge();
        // Re-render only if this tab is currently visible.
        const overlay = document.getElementById('c1t-overlay');
        if (overlay && activeTabId === id) {
            tab.render(overlay, data);
        }
    }

    function setTabLoading(id: string, text: string | null): void {
        if (text == null) progressTextByTab.delete(id);
        else progressTextByTab.set(id, text);
        if (activeTabId === id) refreshProgressBanner();
    }

    function refreshProgressBanner(): void {
        const banner = document.getElementById('c1t-progress-banner');
        if (!banner) return;
        const text = progressTextByTab.get(activeTabId);
        const label = banner.querySelector('.c1t-progress-label');
        if (text) {
            if (label) label.textContent = text;
            banner.classList.add('c1t-visible');
        } else {
            banner.classList.remove('c1t-visible');
        }
    }

    function refreshBadge(): void {
        const fab = document.getElementById('c1t-fab');
        if (!fab) return;
        let count = 0;
        let hasAnyData = false;
        for (const tab of tabs) {
            if (!dataByTab.has(tab.id)) continue;
            hasAnyData = true;
            if (!tab.getBadgeCount) continue;
            const n = tab.getBadgeCount(dataByTab.get(tab.id));
            if (n > count) count = n;
        }
        if (hasAnyData) fab.classList.add('has-data');
        else fab.classList.remove('has-data');
        fab.innerHTML =
            count > 0
                ? `${FAB_ICON_SVG}<span class="badge">${count}</span>`
                : FAB_ICON_SVG;
    }

    // Escape key handler — module-level (not bound to a specific overlay).
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const overlay = document.getElementById('c1t-overlay');
            if (overlay) overlay.classList.remove('open');
        }
    });

    return {
        ensureStyles,
        ensureFab,
        ensureOverlay,
        setActiveTab,
        setTabData,
        setTabLoading,
        getActiveTabId: () => activeTabId
    };
}
