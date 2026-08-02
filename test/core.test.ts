//=============================================================================
// Tests for src/core.ts — detectMode, normalizers, processTripsData,
// extractTripsArray, createUI, renderTripsToModal.
//=============================================================================

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import type { RawTrip, TripsData } from '../src/types.js';
import {
    detectMode,
    getCurrentSite,
    isOnShoppingTripsPage,
    isOnBrowsePage,
    extractTripsArray,
    normalizeTrip,
    processTripsData,
    createTabbedUI,
    renderTripsToModal,
    formatCurrency,
    formatDate,
    escapeHtml,
    getStatusClass,
    fetchAllOffersTrips,
    fetchAllShoppingTrips
} from '../src/core.js';

const originalHref = window.location.href;

function setUrl(url: string): void {
    window.location.href = url;
}

afterEach(() => {
    window.location.href = originalHref;
});

//-----------------------------------------------------------------------------
// detectMode — URL routing
//-----------------------------------------------------------------------------

describe('detectMode', () => {
    it('returns "trips" on capitaloneshopping shopping-trips path', () => {
        setUrl('https://capitaloneshopping.com/account-settings/shopping-trips');
        expect(detectMode()).toBe('trips');
    });

    it('returns "trips" on capitaloneoffers /shopping-trips path', () => {
        setUrl('https://capitaloneoffers.com/shopping-trips');
        expect(detectMode()).toBe('trips');
    });

    it('returns "browse" on capitaloneshopping root path', () => {
        setUrl('https://capitaloneshopping.com/');
        expect(detectMode()).toBe('browse');
    });

    it('returns "browse" on capitaloneshopping bare host (empty path treated as root)', () => {
        // happy-dom always populates `/` for "https://host"; explicitly verify the `/` branch.
        setUrl('https://capitaloneshopping.com');
        expect(detectMode()).toBe('browse');
    });

    it('returns "browse" on capitaloneoffers /feed', () => {
        setUrl('https://capitaloneoffers.com/feed');
        expect(detectMode()).toBe('browse');
    });

    it('returns "browse" on capitaloneoffers /feed/<anything>', () => {
        setUrl('https://capitaloneoffers.com/feed/whatever');
        expect(detectMode()).toBe('browse');
    });

    it('returns null on capitaloneshopping non-trips/non-root path', () => {
        setUrl('https://capitaloneshopping.com/account-settings/profile');
        expect(detectMode()).toBe(null);
    });

    it('returns null on unrelated host', () => {
        setUrl('https://example.com/');
        expect(detectMode()).toBe(null);
    });

    it('isOnShoppingTripsPage agrees with detectMode === "trips"', () => {
        setUrl('https://capitaloneshopping.com/account-settings/shopping-trips');
        expect(isOnShoppingTripsPage()).toBe(true);
        setUrl('https://capitaloneshopping.com/');
        expect(isOnShoppingTripsPage()).toBe(false);
    });

    it('isOnBrowsePage agrees with detectMode === "browse"', () => {
        setUrl('https://capitaloneoffers.com/feed');
        expect(isOnBrowsePage()).toBe(true);
        setUrl('https://capitaloneoffers.com/shopping-trips');
        expect(isOnBrowsePage()).toBe(false);
    });

    it('getCurrentSite distinguishes shopping vs offers vs unknown', () => {
        setUrl('https://capitaloneshopping.com/');
        expect(getCurrentSite()).toBe('shopping');
        setUrl('https://capitaloneoffers.com/feed');
        expect(getCurrentSite()).toBe('offers');
        setUrl('https://example.com/');
        expect(getCurrentSite()).toBe(null);
    });
});

//-----------------------------------------------------------------------------
// normalizeTrip — fallback chains and status mapping
//-----------------------------------------------------------------------------

describe('normalizeTrip', () => {
    it('falls back through vendor → merchantName → merchantDisplayName → merchant → domain → "Unknown"', () => {
        // vendor wins
        expect(
            normalizeTrip({ vendor: 'V', merchantName: 'M', domain: 'd.com' }).merchant
        ).toBe('V');
        // merchantName when vendor missing
        expect(
            normalizeTrip({ merchantName: 'M', merchantDisplayName: 'MD' }).merchant
        ).toBe('M');
        // merchantDisplayName when vendor + merchantName missing
        expect(normalizeTrip({ merchantDisplayName: 'MD' }).merchant).toBe('MD');
        // merchant when above all missing
        expect(normalizeTrip({ merchant: 'MX' }).merchant).toBe('MX');
        // domain as next fallback
        expect(normalizeTrip({ domain: 'shop.example.com' }).merchant).toBe(
            'shop.example.com'
        );
        // "Unknown" when literally nothing
        expect(normalizeTrip({}).merchant).toBe('Unknown');
    });

    it('handles miles-side fields: payoutAmountCents/trxnTotalCents cents→dollars, activatedOfferId id, date', () => {
        const raw: RawTrip = {
            activatedOfferId: 'offer-abc',
            merchantDisplayName: 'Marriott',
            trxnTotalCents: 12345, // → $123.45
            payoutAmountCents: 678, // → $6.78
            date: '2025-04-01T00:00:00Z',
            status: 'Waiting',
            accountCurrency: 'miles'
        };
        const t = normalizeTrip(raw);
        expect(t.merchant).toBe('Marriott');
        expect(t.orderAmount).toBe(123.45);
        expect(t.creditAmount).toBe(6.78);
        expect(t.id).toBe('offer-abc');
        expect(t.tripId).toBe('offer-abc');
        expect(t.date).toBe('2025-04-01T00:00:00Z');
    });

    it('maps raw status "Waiting" → "Created" and "Inactive"/"Ineligible" → "Canceled"', () => {
        const waiting = normalizeTrip({ vendor: 'V', status: 'Waiting' });
        expect(waiting.rawStatus).toBe('Created');
        expect(waiting.status).toBe('Created');

        const inactive = normalizeTrip({ vendor: 'V', status: 'Inactive' });
        expect(inactive.rawStatus).toBe('Canceled');
        expect(inactive.status).toBe('Canceled');

        // /xhr/shopping-trips renamed Inactive → Ineligible; must also collapse to Canceled.
        const ineligible = normalizeTrip({ vendor: 'V', status: 'Ineligible' });
        expect(ineligible.rawStatus).toBe('Canceled');
        expect(ineligible.status).toBe('Canceled');
    });

    it('Pending with credit becomes "Pending ✓"; without credit becomes "Pending ?"', () => {
        const good = normalizeTrip({
            vendor: 'V',
            status: 'Pending',
            creditAmount: 5
        });
        expect(good.status).toBe('Pending ✓');

        const uncertain = normalizeTrip({ vendor: 'V', status: 'Pending' });
        expect(uncertain.status).toBe('Pending ?');
    });

    it('extracts offers-side rewardDisplay + exclusions when present', () => {
        const t = normalizeTrip({
            merchantDisplayName: 'Woot',
            status: 'Completed',
            rewardsSummaryDisplayRate: 'Up to 3X miles',
            merchantExclusions: 'Not eligible for the purchase of wine or gourmet items.',
            rewards: [
                { categoryName: 'Everything Else', displayRate: '3X miles' },
                { categoryName: 'PC/Electronics', displayRate: '1X miles' }
            ]
        });
        expect(t.rewardDisplay).toBe('Up to 3X miles');
        expect(t.exclusions).toBe('Not eligible for the purchase of wine or gourmet items.');
    });

    it('falls back to first rewards[].displayRate when rewardsSummaryDisplayRate absent', () => {
        const t = normalizeTrip({
            merchantDisplayName: 'X',
            rewards: [{ categoryName: 'A', displayRate: '5,000 miles' }]
        });
        expect(t.rewardDisplay).toBe('5,000 miles');
    });

    it('rewardDisplay + exclusions default to "" on shopping-side raw trips (no such fields)', () => {
        const t = normalizeTrip({ vendor: 'V', orderId: '1' });
        expect(t.rewardDisplay).toBe('');
        expect(t.exclusions).toBe('');
    });

    it('Canceled (lowercase) with credit becomes "Completed"', () => {
        const t = normalizeTrip({
            vendor: 'V',
            status: 'canceled',
            creditAmount: 9.99
        });
        expect(t.status).toBe('Completed');
    });

    it('preserves raw object and computes hasAmount/hasCreditAmount/hasOrderId flags', () => {
        const raw: RawTrip = {
            vendor: 'V',
            orderId: 'o-1',
            orderAmount: 50,
            creditAmount: 2
        };
        const t = normalizeTrip(raw);
        expect(t.raw).toBe(raw);
        expect(t.hasOrderId).toBe(true);
        expect(t.hasAmount).toBe(true);
        expect(t.hasCreditAmount).toBe(true);
    });
});

//-----------------------------------------------------------------------------
// processTripsData — stats across a mixed fixture
//-----------------------------------------------------------------------------

describe('processTripsData', () => {
    it('computes stats over a mixed-status fixture', () => {
        const raw = [
            // tracked w/ credit (counts: total, withOrderId, withAmount, withCredit, NOT pending, NOT created)
            { vendor: 'A', orderId: '1', orderAmount: 10, creditAmount: 1, status: 'Completed' },
            // tracked, amount, no credit (counts: total, withOrderId, withAmount)
            { vendor: 'B', orderId: '2', orderAmount: 20, creditAmount: 0, status: 'Created' },
            // pending w/ credit
            { vendor: 'C', orderId: '3', orderAmount: 30, creditAmount: 1.5, status: 'Pending' },
            // pending no credit
            { vendor: 'D', orderId: '4', orderAmount: 0, creditAmount: 0, status: 'Pending' },
            // no orderId, no amount (i.e. minimal raw)
            { vendor: 'E', status: 'Canceled' }
        ];
        const out = processTripsData(raw);
        expect(out.stats.total).toBe(5);
        expect(out.stats.withOrderId).toBe(4);
        expect(out.stats.withAmount).toBe(3); // A, B, C
        expect(out.stats.withCredit).toBe(2); // A, C
        expect(out.stats.pending).toBe(2); // C ("Pending ✓"), D ("Pending ?")
        expect(out.stats.created).toBe(1); // B
        expect(out.trips).toHaveLength(5);
    });

    it('returns zeroed stats for empty input', () => {
        const out = processTripsData({});
        expect(out.trips).toEqual([]);
        expect(out.stats).toEqual({
            total: 0,
            withOrderId: 0,
            withAmount: 0,
            withCredit: 0,
            pending: 0,
            created: 0
        });
    });
});

//-----------------------------------------------------------------------------
// extractTripsArray — six nested shapes
//-----------------------------------------------------------------------------

describe('extractTripsArray', () => {
    const sentinel: RawTrip[] = [{ vendor: 'X' }];

    it('returns top-level array as-is', () => {
        expect(extractTripsArray(sentinel)).toBe(sentinel);
    });

    it('unwraps data.items', () => {
        expect(extractTripsArray({ items: sentinel })).toBe(sentinel);
    });

    it('unwraps data.shoppingTrips', () => {
        expect(extractTripsArray({ shoppingTrips: sentinel })).toBe(sentinel);
    });

    it('unwraps data.trip_orders', () => {
        expect(extractTripsArray({ trip_orders: sentinel })).toBe(sentinel);
    });

    it('unwraps data.data when data.data is an array', () => {
        expect(extractTripsArray({ data: sentinel })).toBe(sentinel);
    });

    it('unwraps data.data.items', () => {
        expect(extractTripsArray({ data: { items: sentinel } })).toBe(sentinel);
    });

    it('returns [] on null / undefined / non-matching shape', () => {
        expect(extractTripsArray(null)).toEqual([]);
        expect(extractTripsArray(undefined)).toEqual([]);
        expect(extractTripsArray({ unrelated: 1 })).toEqual([]);
    });
});

//-----------------------------------------------------------------------------
// fetchAllOffersTrips — pagination via hasMore
//-----------------------------------------------------------------------------

describe('fetchAllOffersTrips', () => {
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('walks pages until hasMore=false and concatenates data', async () => {
        const calls: string[] = [];
        const fetchMock = vi.fn(async (url: unknown) => {
            calls.push(String(url));
            const offsetMatch = String(url).match(/offset=(\d+)/);
            const offset = Number(offsetMatch?.[1] ?? 0);
            // Three pages of 100, then a short final page of 30 with hasMore=false
            if (offset === 0) return { ok: true, json: async () => ({ data: Array.from({ length: 100 }, (_, i) => ({ vendor: 'p0-' + i })), hasMore: true }) };
            if (offset === 100) return { ok: true, json: async () => ({ data: Array.from({ length: 100 }, (_, i) => ({ vendor: 'p1-' + i })), hasMore: true }) };
            if (offset === 200) return { ok: true, json: async () => ({ data: Array.from({ length: 30 }, (_, i) => ({ vendor: 'p2-' + i })), hasMore: false }) };
            throw new Error('unexpected offset ' + offset);
        });
        vi.stubGlobal('fetch', fetchMock);

        const result = await fetchAllOffersTrips();
        expect(result.data.length).toBe(230);
        expect(calls.length).toBe(3);
        expect(calls[0]).toContain('offset=0');
        expect(calls[1]).toContain('offset=100');
        expect(calls[2]).toContain('offset=200');
        // Sanity: correct URL shape (POST verb enforced elsewhere via the mock's call args)
        expect(calls[0]).toContain('/xhr/shopping-trips');
        expect(calls[0]).toContain('limit=100');
    });

    it('stops after one page when hasMore=false on page 1', async () => {
        const fetchMock = vi.fn(async () => ({
            ok: true,
            json: async () => ({ data: [{ vendor: 'only' }], hasMore: false })
        }));
        vi.stubGlobal('fetch', fetchMock);

        const result = await fetchAllOffersTrips();
        expect(result.data).toEqual([{ vendor: 'only' }]);
        expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it('throws on non-ok response', async () => {
        vi.stubGlobal('fetch', vi.fn(async () => ({ ok: false, status: 500 })));
        await expect(fetchAllOffersTrips()).rejects.toThrow(/500/);
    });

    it('onProgress fires after each page with accumulated items', async () => {
        const fetchMock = vi.fn(async (url: unknown) => {
            const offset = Number(String(url).match(/offset=(\d+)/)?.[1] ?? 0);
            if (offset === 0) return { ok: true, json: async () => ({ data: [{ vendor: 'a' }, { vendor: 'b' }], hasMore: true }) };
            if (offset === 100) return { ok: true, json: async () => ({ data: [{ vendor: 'c' }], hasMore: false }) };
            throw new Error('unexpected offset');
        });
        vi.stubGlobal('fetch', fetchMock);

        const snapshots: Array<{ len: number; pages: number }> = [];
        const result = await fetchAllOffersTrips({
            onProgress: (items, pages) => snapshots.push({ len: items.length, pages })
        });
        expect(snapshots).toEqual([{ len: 2, pages: 1 }, { len: 3, pages: 2 }]);
        expect(result.data.length).toBe(3);
    });
});

//-----------------------------------------------------------------------------
// fetchAllShoppingTrips — pagination via short-page termination
//-----------------------------------------------------------------------------

describe('fetchAllShoppingTrips', () => {
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('walks pages until a short page (len < limit) and concatenates items', async () => {
        const calls: string[] = [];
        // Paginator uses limit=100. Return 100 twice, then 30 to signal end.
        const fetchMock = vi.fn(async (url: unknown) => {
            calls.push(String(url));
            const offsetMatch = String(url).match(/offset=(\d+)/);
            const offset = Number(offsetMatch?.[1] ?? 0);
            if (offset === 0) return { ok: true, json: async () => ({ items: Array.from({ length: 100 }, (_, i) => ({ vendor: 'p0-' + i })) }) };
            if (offset === 100) return { ok: true, json: async () => ({ items: Array.from({ length: 100 }, (_, i) => ({ vendor: 'p1-' + i })) }) };
            if (offset === 200) return { ok: true, json: async () => ({ items: Array.from({ length: 30 }, (_, i) => ({ vendor: 'p2-' + i })) }) };
            throw new Error('unexpected offset ' + offset);
        });
        vi.stubGlobal('fetch', fetchMock);

        const result = await fetchAllShoppingTrips();
        expect(result.items.length).toBe(230);
        expect(calls.length).toBe(3);
        expect(calls[0]).toContain('offset=0');
        expect(calls[0]).toContain('limit=100');
        expect(calls[0]).toContain('/api/v1/trip_orders');
        expect(calls[1]).toContain('offset=100');
        expect(calls[2]).toContain('offset=200');
    });

    it('stops after one short page when nothing is present', async () => {
        const fetchMock = vi.fn(async () => ({
            ok: true,
            json: async () => ({ items: [{ vendor: 'only' }] })
        }));
        vi.stubGlobal('fetch', fetchMock);

        const result = await fetchAllShoppingTrips();
        expect(result.items).toEqual([{ vendor: 'only' }]);
        expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it('throws on non-ok response', async () => {
        vi.stubGlobal('fetch', vi.fn(async () => ({ ok: false, status: 500 })));
        await expect(fetchAllShoppingTrips()).rejects.toThrow(/500/);
    });

    it('onProgress fires after each page with accumulated items', async () => {
        const fetchMock = vi.fn(async (url: unknown) => {
            const offset = Number(String(url).match(/offset=(\d+)/)?.[1] ?? 0);
            if (offset === 0) return { ok: true, json: async () => ({ items: Array.from({ length: 100 }, (_, i) => ({ vendor: 'a' + i })) }) };
            if (offset === 100) return { ok: true, json: async () => ({ items: [{ vendor: 'z' }] }) };
            throw new Error('unexpected offset');
        });
        vi.stubGlobal('fetch', fetchMock);

        const snapshots: Array<{ len: number; pages: number }> = [];
        await fetchAllShoppingTrips({
            onProgress: (items, pages) => snapshots.push({ len: items.length, pages })
        });
        expect(snapshots).toEqual([{ len: 100, pages: 1 }, { len: 101, pages: 2 }]);
    });
});

//-----------------------------------------------------------------------------
// createTabbedUI — tab activation, caching, badge from Trips tab only
//-----------------------------------------------------------------------------

describe('createTabbedUI', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
        document.head.innerHTML = '';
    });

    function makeTabDef<T>(id: string, extra: Partial<{ label: string; render: (o: HTMLElement, d: T) => void; getBadgeCount: (d: T) => number; onActivate: () => Promise<T | null>; loadingText: string }> = {}) {
        return {
            id,
            label: extra.label ?? id.toUpperCase(),
            render: (extra.render ?? vi.fn()) as (o: HTMLElement, d: unknown) => void,
            getBadgeCount: extra.getBadgeCount as ((d: unknown) => number) | undefined,
            onActivate: extra.onActivate as (() => Promise<unknown>) | undefined,
            loadingText: extra.loadingText
        };
    }

    it('renders a tab bar with all tab labels + marks defaultTabId active', () => {
        const ui = createTabbedUI({
            title: 'X',
            defaultTabId: 'trips',
            tabs: [makeTabDef('trips', { label: 'Trips' }), makeTabDef('browse', { label: 'Browse' })]
        });
        ui.ensureOverlay();
        const tabs = document.querySelectorAll<HTMLButtonElement>('.c1t-tab');
        expect(tabs.length).toBe(2);
        expect(tabs[0].textContent).toBe('Trips');
        expect(tabs[1].textContent).toBe('Browse');
        expect(tabs[0].classList.contains('active')).toBe(true);
        expect(tabs[1].classList.contains('active')).toBe(false);
    });

    it('setActiveTab fires onActivate exactly once, caches result, and renders on second activation', async () => {
        const renderTrips = vi.fn();
        const loadTrips = vi.fn(async () => ({ n: 3 }));
        const ui = createTabbedUI({
            title: 'X',
            defaultTabId: 'trips',
            tabs: [
                makeTabDef<{ n: number }>('trips', { render: renderTrips, onActivate: loadTrips }),
                makeTabDef('browse')
            ]
        });
        ui.ensureOverlay();

        ui.setActiveTab('trips');
        // Give the async chain a tick to complete
        await new Promise((r) => setTimeout(r, 0));
        await new Promise((r) => setTimeout(r, 0));

        expect(loadTrips).toHaveBeenCalledTimes(1);
        expect(renderTrips).toHaveBeenCalled();
        expect(renderTrips.mock.calls[renderTrips.mock.calls.length - 1][1]).toEqual({ n: 3 });

        // Activate away then back — loader should NOT re-fire; render SHOULD re-fire
        ui.setActiveTab('browse');
        await new Promise((r) => setTimeout(r, 0));
        renderTrips.mockClear();
        ui.setActiveTab('trips');
        await new Promise((r) => setTimeout(r, 0));

        expect(loadTrips).toHaveBeenCalledTimes(1);
        expect(renderTrips).toHaveBeenCalledTimes(1);
    });

    it('setTabData warms cache and re-renders when the tab is currently active', () => {
        const renderTrips = vi.fn();
        const loadTrips = vi.fn(async () => ({ n: 0 }));
        const ui = createTabbedUI({
            title: 'X',
            defaultTabId: 'trips',
            tabs: [
                makeTabDef<{ n: number }>('trips', { render: renderTrips, onActivate: loadTrips })
            ]
        });
        ui.ensureOverlay();
        // Interceptor path: bypass onActivate
        ui.setTabData('trips', { n: 42 });
        expect(loadTrips).not.toHaveBeenCalled();
        expect(renderTrips).toHaveBeenCalled();
        expect(renderTrips.mock.calls[0][1]).toEqual({ n: 42 });
    });

    it('badge comes from Trips tab getBadgeCount only when its data is present', () => {
        const ui = createTabbedUI({
            title: 'X',
            defaultTabId: 'trips',
            tabs: [
                makeTabDef<{ withCredit: number }>('trips', { getBadgeCount: (d) => d.withCredit }),
                makeTabDef<{ total: number }>('browse')
            ]
        });
        const fab = ui.ensureFab();

        // No data yet → no badge, no has-data class. Icon renders as an SVG.
        expect(fab.classList.contains('has-data')).toBe(false);
        expect(fab.innerHTML).toContain('<svg');
        expect(fab.innerHTML).not.toContain('class="badge"');

        // Trips data with count > 0 → badge appears alongside the icon
        ui.setTabData('trips', { withCredit: 7 });
        expect(fab.classList.contains('has-data')).toBe(true);
        expect(fab.innerHTML).toContain('<svg');
        expect(fab.innerHTML).toContain('class="badge"');
        expect(fab.innerHTML).toContain('7');

        // Trips data with count === 0 → has-data but no badge
        ui.setTabData('trips', { withCredit: 0 });
        expect(fab.classList.contains('has-data')).toBe(true);
        expect(fab.innerHTML).toContain('<svg');
        expect(fab.innerHTML).not.toContain('class="badge"');
    });

    it('clicking a tab button in the overlay switches active tab', async () => {
        const renderTrips = vi.fn();
        const renderBrowse = vi.fn();
        const ui = createTabbedUI({
            title: 'X',
            defaultTabId: 'trips',
            tabs: [
                makeTabDef('trips', { render: renderTrips }),
                makeTabDef('browse', { render: renderBrowse })
            ]
        });
        ui.ensureOverlay();
        expect(ui.getActiveTabId()).toBe('trips');

        const browseBtn = document.querySelector<HTMLButtonElement>('.c1t-tab[data-tab-id="browse"]');
        expect(browseBtn).not.toBeNull();
        browseBtn!.click();
        await new Promise((r) => setTimeout(r, 0));

        expect(ui.getActiveTabId()).toBe('browse');
        expect(browseBtn!.classList.contains('active')).toBe(true);
    });

    it('setTabLoading shows the banner with text on the active tab and hides it when nulled', () => {
        const ui = createTabbedUI({
            title: 'X',
            defaultTabId: 'trips',
            tabs: [makeTabDef('trips'), makeTabDef('browse')]
        });
        ui.ensureOverlay();
        const banner = document.getElementById('c1t-progress-banner')!;
        const label = banner.querySelector('.c1t-progress-label')!;
        // Banner starts hidden
        expect(banner.classList.contains('c1t-visible')).toBe(false);

        ui.setTabLoading('trips', 'Loading page 3 · 250 trips');
        expect(banner.classList.contains('c1t-visible')).toBe(true);
        expect(label.textContent).toBe('Loading page 3 · 250 trips');

        ui.setTabLoading('trips', null);
        expect(banner.classList.contains('c1t-visible')).toBe(false);
    });

    it('setTabLoading on a non-active tab does not surface the banner until switched', async () => {
        const ui = createTabbedUI({
            title: 'X',
            defaultTabId: 'trips',
            tabs: [makeTabDef('trips'), makeTabDef('browse')]
        });
        ui.ensureOverlay();
        const banner = document.getElementById('c1t-progress-banner')!;

        // Loading state set on browse while trips is active — banner stays hidden.
        ui.setTabLoading('browse', 'Loading page 2 · 40 offers');
        expect(banner.classList.contains('c1t-visible')).toBe(false);

        // Switch to browse — banner surfaces with the stored text.
        const browseBtn = document.querySelector<HTMLButtonElement>('.c1t-tab[data-tab-id="browse"]')!;
        browseBtn.click();
        await new Promise((r) => setTimeout(r, 0));
        expect(banner.classList.contains('c1t-visible')).toBe(true);
        expect(banner.querySelector('.c1t-progress-label')!.textContent).toBe('Loading page 2 · 40 offers');
    });

    it('banner auto-clears when a tab\'s onActivate promise resolves', async () => {
        const ui = createTabbedUI({
            title: 'X',
            defaultTabId: 'trips',
            tabs: [
                makeTabDef<{ n: number }>('trips', {
                    onActivate: async () => {
                        // Simulate a streaming loader that sets the banner during its work
                        ui.setTabLoading('trips', 'Loading page 1 · 5 trips');
                        return { n: 5 };
                    }
                })
            ]
        });
        ui.ensureOverlay();
        ui.setActiveTab('trips');
        await new Promise((r) => setTimeout(r, 0));
        await new Promise((r) => setTimeout(r, 0));

        const banner = document.getElementById('c1t-progress-banner')!;
        // After onActivate resolved, banner should be hidden (auto-cleared in finally)
        expect(banner.classList.contains('c1t-visible')).toBe(false);
    });
});

//-----------------------------------------------------------------------------
// renderTripsToModal — actual DOM output for a small trips fixture
//-----------------------------------------------------------------------------

describe('renderTripsToModal', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
    });

    it('renders merchant names and stats into #c1t-content', () => {
        const overlay = document.createElement('div');
        overlay.id = 'c1t-overlay';
        overlay.innerHTML = '<div id="c1t-content"></div>';
        document.body.appendChild(overlay);

        const data: TripsData = processTripsData([
            { vendor: 'Chewy', orderId: '1', orderAmount: 50, creditAmount: 2, status: 'Completed' },
            { vendor: 'Marriott', orderId: '2', orderAmount: 200, creditAmount: 0, status: 'Created' }
        ]);

        renderTripsToModal(overlay, data);

        const html = overlay.innerHTML;
        expect(html).toContain('Chewy');
        expect(html).toContain('Marriott');
        // stats reflected
        expect(html).toContain('<strong>2</strong> total');
        expect(html).toContain('<strong>2</strong> tracked');
        expect(html).toContain('<strong>1</strong> with cashback');
        // table body wired
        expect(overlay.querySelector('#c1t-tbody')).not.toBeNull();
        const rows = overlay.querySelectorAll('#c1t-tbody tr');
        expect(rows.length).toBe(2);
    });

    it('returns early without throwing if overlay has no #c1t-content', () => {
        const overlay = document.createElement('div');
        const data: TripsData = processTripsData([]);
        expect(() => renderTripsToModal(overlay, data)).not.toThrow();
    });

    // NB: The inline loading pill in #c1t-stats was removed; loading state is
    // now surfaced by createTabbedUI's #c1t-progress-banner (below the tabs),
    // driven by ui.setTabLoading(id, text). Covered in the createTabbedUI suite.

    it('preserves table-wrap scrollTop across incremental re-renders', () => {
        const overlay = document.createElement('div');
        overlay.id = 'c1t-overlay';
        overlay.innerHTML = '<div id="c1t-content"></div>';
        document.body.appendChild(overlay);

        // First render — plenty of rows so the wrap has scrollable height.
        const many = Array.from({ length: 30 }, (_, i) => ({
            vendor: 'V' + i, orderId: String(i), orderAmount: 10, creditAmount: 1, status: 'Completed'
        }));
        renderTripsToModal(overlay, processTripsData(many));

        const wrap = overlay.querySelector<HTMLElement>('#c1t-table-wrap')!;
        // happy-dom doesn't compute real layout, so simulate scroll by assigning.
        wrap.scrollTop = 123;

        // Second render — same data, should preserve scroll.
        renderTripsToModal(overlay, processTripsData(many));

        const wrap2 = overlay.querySelector<HTMLElement>('#c1t-table-wrap')!;
        expect(wrap2.scrollTop).toBe(123);
    });
});

//-----------------------------------------------------------------------------
// Small helpers (defensive coverage — they're used by both renderers)
//-----------------------------------------------------------------------------

describe('helpers', () => {
    it('formatCurrency renders dash for null/0 and dollars otherwise', () => {
        expect(formatCurrency(null)).toBe('—');
        expect(formatCurrency(undefined)).toBe('—');
        expect(formatCurrency(0)).toBe('—');
        expect(formatCurrency(12.5)).toBe('$12.50');
    });

    it('formatDate returns dash for null/empty', () => {
        expect(formatDate(null)).toBe('—');
        expect(formatDate('')).toBe('—');
    });

    it('escapeHtml escapes angle brackets and treats null as empty', () => {
        expect(escapeHtml('<script>')).toBe('&lt;script&gt;');
        expect(escapeHtml(null)).toBe('');
    });

    it('getStatusClass maps known labels to CSS classes', () => {
        expect(getStatusClass('Completed')).toBe('completed');
        expect(getStatusClass('Pending ✓')).toBe('pending-good');
        expect(getStatusClass('Pending ?')).toBe('pending-uncertain');
        expect(getStatusClass('Created')).toBe('created');
        expect(getStatusClass('Canceled')).toBe('canceled');
        expect(getStatusClass('Adjusted')).toBe('adjusted');
        expect(getStatusClass('Unknown')).toBe('');
    });
});
