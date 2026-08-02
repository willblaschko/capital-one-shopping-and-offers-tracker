//=============================================================================
// Tests for the three entry points:
//   - src/bookmarklet.ts        (URL gate helper + IIFE loader)
//   - src/bookmarklet-full.ts   (mode dispatch + data wiring)
//   - src/tampermonkey.ts       (dual-mode FAB + API pattern dispatch)
//
// bookmarklet-full.ts and tampermonkey.ts are top-level IIFEs that execute on
// import. We mock `./core.js` and `./browse.js` BEFORE dynamic-importing the
// entry module so we can:
//   1. Inject a known detectMode() / getCurrentSite() result
//   2. Capture the CreateUIOptions passed to createUI
//   3. Verify processBrowseData / walker wiring
//
// Tests use happy-dom; window.location is overridden via href assignment.
//=============================================================================

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { isBrowsePagePath } from '../src/bookmarklet.js';
import { CONFIG } from '../src/core.js';
import type { BrowseData, BrowseStats, TripsData } from '../src/types.js';

const originalHref = window.location.href;

afterEach(() => {
    window.location.href = originalHref;
    vi.resetModules();
    vi.restoreAllMocks();
    document.body.innerHTML = '';
    document.head.innerHTML = '';
});

beforeEach(() => {
    document.body.innerHTML = '';
    document.head.innerHTML = '';
});

//-----------------------------------------------------------------------------
// 1) Bookmarklet loader URL gate
//-----------------------------------------------------------------------------

describe('isBrowsePagePath (loader gate — host-only)', () => {
    // The loader gate is intentionally host-only. Per-mode routing lives in the
    // CDN-loaded bundle (which auto-updates) so Cap One can move page paths
    // without breaking already-installed bookmarklet URLs (which don't).
    it('accepts any capitaloneshopping path', () => {
        expect(isBrowsePagePath('capitaloneshopping.com', '/')).toBe(true);
        expect(isBrowsePagePath('capitaloneshopping.com', '/account-settings/shopping-trips')).toBe(true);
        expect(isBrowsePagePath('capitaloneshopping.com', '/cart')).toBe(true);
    });

    it('accepts any capitaloneoffers path', () => {
        expect(isBrowsePagePath('capitaloneoffers.com', '/feed')).toBe(true);
        expect(isBrowsePagePath('capitaloneoffers.com', '/shopping-trips')).toBe(true);
        expect(isBrowsePagePath('capitaloneoffers.com', '/anything-cap-one-invents-next')).toBe(true);
    });

    it('accepts www. host prefix', () => {
        expect(isBrowsePagePath('www.capitaloneshopping.com', '/')).toBe(true);
        expect(isBrowsePagePath('www.capitaloneoffers.com', '/feed')).toBe(true);
    });

    it('rejects unrelated hosts regardless of path', () => {
        expect(isBrowsePagePath('example.com', '/')).toBe(false);
        expect(isBrowsePagePath('example.com', '/feed')).toBe(false);
        expect(isBrowsePagePath('example.com', '/shopping-trips')).toBe(false);
    });
});

//-----------------------------------------------------------------------------
// 2) Tampermonkey API pattern dispatch (trips vs browse)
//-----------------------------------------------------------------------------

describe('CONFIG api patterns (tampermonkey URL classification)', () => {
    it('shopping trips pattern matches the trip_orders endpoint, not /api/v1/feed', () => {
        const t = CONFIG.shopping.trips.apiPattern;
        expect(t('https://capitaloneshopping.com/api/v1/trip_orders')).toBe(true);
        expect(t('https://capitaloneshopping.com/api/v1/feed')).toBe(false);
    });

    it('shopping browse pattern matches /api/v1/feed exactly, not trip_orders', () => {
        const b = CONFIG.shopping.browse.apiPattern;
        expect(b('https://capitaloneshopping.com/api/v1/feed')).toBe(true);
        expect(b('https://capitaloneshopping.com/api/v1/trip_orders')).toBe(false);
        // partial-prefix tail rejection
        expect(b('https://capitaloneshopping.com/api/v1/feed/other')).toBe(false);
    });

    it('offers trips pattern matches the /xhr/shopping-trips endpoint, not /feed/{id}', () => {
        const t = CONFIG.offers.trips.apiPattern;
        expect(
            t('https://capitaloneoffers.com/xhr/shopping-trips?limit=100&offset=0')
        ).toBe(true);
        expect(
            t(
                'https://capitaloneoffers.com/feed/user-abc?numberOfColumnsInGrid=5&viewInstanceId=xyz'
            )
        ).toBe(false);
    });

    it('offers browse pattern matches /feed/{userId}?...viewInstanceId=..., not trips', () => {
        const b = CONFIG.offers.browse.apiPattern;
        expect(
            b(
                'https://capitaloneoffers.com/feed/user-abc?numberOfColumnsInGrid=5&viewInstanceId=xyz'
            )
        ).toBe(true);
        // trips URL has no viewInstanceId — must reject
        expect(
            b('https://capitaloneoffers.com/xhr/shopping-trips?limit=100&offset=0')
        ).toBe(false);
    });
});

//-----------------------------------------------------------------------------
// 3) Entry-point dispatch (bookmarklet-full + tampermonkey)
//
// Both entries call `createTabbedUI({ tabs: [Trips, Browse], defaultTabId })`.
// We mock ./core.js and ./browse.js so we can capture the call and drive the
// tab loaders directly to verify walker/fetch wiring.
//-----------------------------------------------------------------------------

interface CapturedTab {
    id: string;
    label: string;
    render: unknown;
    getBadgeCount?: (d: unknown) => number;
    onActivate?: () => Promise<unknown>;
    loadingText?: string;
}

interface CreateTabbedUICall {
    title: string;
    defaultTabId: string;
    tabs: CapturedTab[];
}

interface MockTabbedHandle {
    ensureFab: () => HTMLElement;
    ensureOverlay: () => HTMLElement;
    ensureStyles: () => void;
    setActiveTab: (id: string) => void;
    setTabData: (id: string, data: unknown) => void;
    getActiveTabId: () => string;
}

interface MockCoreExports {
    CONFIG: typeof CONFIG;
    getCurrentSite: () => 'shopping' | 'offers' | null;
    detectMode: () => 'trips' | 'browse' | null;
    processTripsData: (raw: unknown) => TripsData;
    renderTripsToModal: unknown;
    fetchAllOffersTrips: ReturnType<typeof vi.fn>;
    fetchAllShoppingTrips: ReturnType<typeof vi.fn>;
    createTabbedUI: (opts: {
        title: string;
        defaultTabId: string;
        tabs: CapturedTab[];
    }) => MockTabbedHandle;
}

interface MockBrowseExports {
    walkShoppingFeed: ReturnType<typeof vi.fn>;
    walkOffersFeed: ReturnType<typeof vi.fn>;
    getOffersBrowseContext: ReturnType<typeof vi.fn>;
    fetchOffersBrowseContext: ReturnType<typeof vi.fn>;
    processBrowseData: ReturnType<typeof vi.fn>;
    renderBrowseToModal: unknown;
}

/**
 * Build a fresh set of mocks plus a captured-calls registry. Each test
 * vi.mocks('./core.js' / './browse.js') with these before importing the entry.
 */
function makeMocks(opts: {
    site: 'shopping' | 'offers';
    mode: 'trips' | 'browse' | null;
}): {
    core: MockCoreExports;
    browse: MockBrowseExports;
    createTabbedUICalls: CreateTabbedUICall[];
    tabDataSet: Array<{ id: string; data: unknown }>;
    tripsRenderer: object;
    browseRenderer: object;
} {
    const createTabbedUICalls: CreateTabbedUICall[] = [];
    const tabDataSet: Array<{ id: string; data: unknown }> = [];
    const tripsRenderer = { __id: 'renderTripsToModal' };
    const browseRenderer = { __id: 'renderBrowseToModal' };

    const createTabbedUI: MockCoreExports['createTabbedUI'] = (cfg) => {
        createTabbedUICalls.push({
            title: cfg.title,
            defaultTabId: cfg.defaultTabId,
            tabs: cfg.tabs
        });
        let active = cfg.defaultTabId;
        return {
            ensureFab: () => {
                let fab = document.getElementById('c1t-fab');
                if (!fab) {
                    fab = document.createElement('button');
                    fab.id = 'c1t-fab';
                    document.body.appendChild(fab);
                }
                return fab;
            },
            ensureOverlay: () => {
                let overlay = document.getElementById('c1t-overlay');
                if (!overlay) {
                    overlay = document.createElement('div');
                    overlay.id = 'c1t-overlay';
                    overlay.innerHTML =
                        '<div id="c1t-content"><div id="c1t-loading">Initial</div></div>';
                    document.body.appendChild(overlay);
                }
                return overlay;
            },
            ensureStyles: () => {},
            setActiveTab: (id: string) => {
                active = id;
                const tab = cfg.tabs.find((t) => t.id === id);
                if (tab?.onActivate) {
                    // Fire loader; test observes side effects via mocks.
                    void tab.onActivate().catch((e) => {
                        const c = document.querySelector('#c1t-loading');
                        if (c) c.textContent = e instanceof Error ? e.message : String(e);
                    });
                }
            },
            setTabData: (id: string, data: unknown) => {
                tabDataSet.push({ id, data });
            },
            getActiveTabId: () => active
        };
    };

    const core: MockCoreExports = {
        CONFIG,
        getCurrentSite: () => opts.site,
        detectMode: () => opts.mode,
        processTripsData: (raw: unknown) => raw as TripsData,
        renderTripsToModal: tripsRenderer,
        fetchAllOffersTrips: vi.fn(async () => ({ data: [] })),
        fetchAllShoppingTrips: vi.fn(async () => ({ items: [] })),
        createTabbedUI
    };

    const browse: MockBrowseExports = {
        walkShoppingFeed: vi.fn(),
        walkOffersFeed: vi.fn(),
        getOffersBrowseContext: vi.fn(),
        fetchOffersBrowseContext: vi.fn(),
        processBrowseData: vi.fn((offers: unknown[]) => {
            const stats: BrowseStats = { total: offers.length, byBucket: {} };
            const data: BrowseData = {
                offers: [],
                buckets: {},
                bucketOrder: [],
                stats
            };
            return data;
        }),
        renderBrowseToModal: browseRenderer
    };

    return {
        core,
        browse,
        createTabbedUICalls,
        tabDataSet,
        tripsRenderer,
        browseRenderer
    };
}

describe('bookmarklet-full entry — tabbed UI construction', () => {
    it('constructs a two-tab UI (Trips + Browse) with defaultTab=trips on a trips path', async () => {
        window.location.href =
            'https://capitaloneshopping.com/account-settings/shopping-trips';
        const m = makeMocks({ site: 'shopping', mode: 'trips' });
        vi.doMock('../src/core.js', () => m.core);
        vi.doMock('../src/browse.js', () => m.browse);

        await import('../src/bookmarklet-full.js');
        await new Promise((r) => setTimeout(r, 0));

        expect(m.createTabbedUICalls.length).toBe(1);
        const call = m.createTabbedUICalls[0]!;
        expect(call.defaultTabId).toBe('trips');
        expect(call.tabs.map((t) => t.id)).toEqual(['trips', 'browse']);
        expect(call.tabs.find((t) => t.id === 'trips')!.render).toBe(m.tripsRenderer);
        expect(call.tabs.find((t) => t.id === 'browse')!.render).toBe(m.browseRenderer);
    });

    it('picks defaultTab=browse when detectMode() is "browse"', async () => {
        window.location.href = 'https://capitaloneshopping.com/';
        const m = makeMocks({ site: 'shopping', mode: 'browse' });
        vi.doMock('../src/core.js', () => m.core);
        vi.doMock('../src/browse.js', () => m.browse);

        await import('../src/bookmarklet-full.js');
        await new Promise((r) => setTimeout(r, 0));

        expect(m.createTabbedUICalls[0]!.defaultTabId).toBe('browse');
    });

    it('falls back to defaultTab=trips on a non-canonical Cap One path (no alert)', async () => {
        window.location.href =
            'https://capitaloneshopping.com/account-settings/profile';
        const m = makeMocks({ site: 'shopping', mode: null });
        const alertMock = vi.fn();
        vi.stubGlobal('alert', alertMock);
        vi.doMock('../src/core.js', () => m.core);
        vi.doMock('../src/browse.js', () => m.browse);

        await import('../src/bookmarklet-full.js');
        await new Promise((r) => setTimeout(r, 0));

        expect(alertMock).not.toHaveBeenCalled();
        expect(m.createTabbedUICalls.length).toBe(1);
        expect(m.createTabbedUICalls[0]!.defaultTabId).toBe('trips');
    });

    it('Trips tab on shopping routes through fetchAllShoppingTrips (pagination)', async () => {
        window.location.href = 'https://capitaloneshopping.com/';
        const m = makeMocks({ site: 'shopping', mode: 'trips' });
        m.core.fetchAllShoppingTrips.mockResolvedValue({ items: [{ vendor: 'X', orderId: '1' }] });
        vi.doMock('../src/core.js', () => m.core);
        vi.doMock('../src/browse.js', () => m.browse);

        await import('../src/bookmarklet-full.js');
        await new Promise((r) => setTimeout(r, 0));

        const tripsTab = m.createTabbedUICalls[0]!.tabs.find((t) => t.id === 'trips')!;
        expect(tripsTab.onActivate).toBeDefined();
        const data = await tripsTab.onActivate!();
        expect(m.core.fetchAllShoppingTrips).toHaveBeenCalled();
        expect(data).toBeTruthy();
    });

    it('Trips tab on offers routes through fetchAllOffersTrips (pagination)', async () => {
        window.location.href = 'https://capitaloneoffers.com/shopping-trips';
        const m = makeMocks({ site: 'offers', mode: 'trips' });
        m.core.fetchAllOffersTrips.mockResolvedValue({ data: [{ vendor: 'V' }] });
        vi.doMock('../src/core.js', () => m.core);
        vi.doMock('../src/browse.js', () => m.browse);

        await import('../src/bookmarklet-full.js');
        await new Promise((r) => setTimeout(r, 0));

        const tripsTab = m.createTabbedUICalls[0]!.tabs.find((t) => t.id === 'trips')!;
        await tripsTab.onActivate!();
        expect(m.core.fetchAllOffersTrips).toHaveBeenCalled();
    });

    it('Browse tab getBadgeCount is NOT defined (trips tab drives the badge)', async () => {
        window.location.href = 'https://capitaloneoffers.com/feed';
        const m = makeMocks({ site: 'offers', mode: 'browse' });
        vi.doMock('../src/core.js', () => m.core);
        vi.doMock('../src/browse.js', () => m.browse);

        await import('../src/bookmarklet-full.js');
        await new Promise((r) => setTimeout(r, 0));

        const tabs = m.createTabbedUICalls[0]!.tabs;
        const tripsTab = tabs.find((t) => t.id === 'trips')!;
        const browseTab = tabs.find((t) => t.id === 'browse')!;
        expect(tripsTab.getBadgeCount).toBeDefined();
        const stats: TripsData['stats'] = {
            total: 0,
            withOrderId: 0,
            withAmount: 0,
            withCredit: 9,
            pending: 0,
            created: 0
        };
        expect(tripsTab.getBadgeCount!({ trips: [], stats } as TripsData)).toBe(9);
        expect(browseTab.getBadgeCount).toBeUndefined();
    });

    it('Browse tab on shopping calls walkShoppingFeed → processBrowseData', async () => {
        window.location.href = 'https://capitaloneshopping.com/';
        const m = makeMocks({ site: 'shopping', mode: 'browse' });
        const fakeOffers = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];
        m.browse.walkShoppingFeed.mockResolvedValue({
            items: fakeOffers,
            hitCap: false,
            pagesWalked: 4
        });
        vi.doMock('../src/core.js', () => m.core);
        vi.doMock('../src/browse.js', () => m.browse);

        await import('../src/bookmarklet-full.js');
        await new Promise((r) => setTimeout(r, 0));

        const browseTab = m.createTabbedUICalls[0]!.tabs.find((t) => t.id === 'browse')!;
        const data = (await browseTab.onActivate!()) as BrowseData;
        expect(m.browse.walkShoppingFeed).toHaveBeenCalled();
        expect(m.browse.processBrowseData).toHaveBeenCalledWith(fakeOffers);
        expect(data.stats.pagesWalked).toBe(4);
        expect(data.stats.hitCap).toBe(false);
    });

    it('Browse tab on offers with no context throws (surfaces error to modal)', async () => {
        window.location.href = 'https://capitaloneoffers.com/feed';
        const m = makeMocks({ site: 'offers', mode: 'browse' });
        m.browse.fetchOffersBrowseContext.mockResolvedValue(null);
        vi.doMock('../src/core.js', () => m.core);
        vi.doMock('../src/browse.js', () => m.browse);

        await import('../src/bookmarklet-full.js');
        await new Promise((r) => setTimeout(r, 0));

        const browseTab = m.createTabbedUICalls[0]!.tabs.find((t) => t.id === 'browse')!;
        await expect(browseTab.onActivate!()).rejects.toThrow(/context|userId/i);
        expect(m.browse.walkOffersFeed).not.toHaveBeenCalled();
    });

    it('Browse tab on offers WITH context calls walkOffersFeed(ctx, {onPage, onProgress}) on mount', async () => {
        window.location.href = 'https://capitaloneoffers.com/feed';
        const m = makeMocks({ site: 'offers', mode: 'browse' });
        const ctx = { userId: 'u-1', viewInstanceId: 'v-1' };
        m.browse.fetchOffersBrowseContext.mockResolvedValue(ctx);
        m.browse.walkOffersFeed.mockResolvedValue({
            items: [{ id: 'tile-1' }],
            hitCap: true,
            pagesWalked: 40
        });
        vi.doMock('../src/core.js', () => m.core);
        vi.doMock('../src/browse.js', () => m.browse);

        await import('../src/bookmarklet-full.js');
        // Let the default-tab onActivate promise chain drain.
        await new Promise((r) => setTimeout(r, 0));
        await new Promise((r) => setTimeout(r, 0));

        // defaultTab='browse' → setActiveTab fires the browse loader once on mount.
        expect(m.browse.walkOffersFeed).toHaveBeenCalledTimes(1);
        const args = m.browse.walkOffersFeed.mock.calls[0]!;
        expect(args[0]).toEqual(ctx);
        // Second arg is now an options object with onPage AND onProgress
        expect(typeof args[1]).toBe('object');
        expect(typeof (args[1] as { onPage?: unknown }).onPage).toBe('function');
        expect(typeof (args[1] as { onProgress?: unknown }).onProgress).toBe('function');
    });
});

//-----------------------------------------------------------------------------
// 4) Tampermonkey entry — persistent tabbed FAB + trips interceptor
//-----------------------------------------------------------------------------

describe('tampermonkey entry — tabbed FAB + interceptor', () => {
    it('constructs the tabbed UI and ensures a FAB on any Cap One page', async () => {
        window.location.href = 'https://capitaloneoffers.com/anything';
        const m = makeMocks({ site: 'offers', mode: null });
        vi.doMock('../src/core.js', () => m.core);
        vi.doMock('../src/browse.js', () => m.browse);

        await import('../src/tampermonkey.js');
        await new Promise((r) => setTimeout(r, 0));

        expect(m.createTabbedUICalls.length).toBe(1);
        expect(m.createTabbedUICalls[0]!.tabs.map((t) => t.id)).toEqual(['trips', 'browse']);
        expect(document.getElementById('c1t-fab')).not.toBeNull();
    });

    it('picks the default active tab from detectMode() (browse on /feed)', async () => {
        window.location.href = 'https://capitaloneoffers.com/feed';
        const m = makeMocks({ site: 'offers', mode: 'browse' });
        vi.doMock('../src/core.js', () => m.core);
        vi.doMock('../src/browse.js', () => m.browse);

        await import('../src/tampermonkey.js');
        await new Promise((r) => setTimeout(r, 0));

        expect(m.createTabbedUICalls[0]!.defaultTabId).toBe('browse');
    });

    it('fetch interception warms the Trips tab via setTabData, only on trips URLs', async () => {
        window.location.href =
            'https://capitaloneshopping.com/account-settings/shopping-trips';
        const m = makeMocks({ site: 'shopping', mode: 'trips' });

        const tripsBody = { items: [{ vendor: 'Z' }] };
        const browseBody = { items: [{ type: 'great_deal' }] };
        const baseFetch = vi.fn(async (req: unknown): Promise<Response> => {
            const url = String(req);
            const body = url.includes('/api/v1/feed') ? browseBody : tripsBody;
            return new Response(JSON.stringify(body), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
        });
        vi.stubGlobal('fetch', baseFetch);

        vi.doMock('../src/core.js', () => m.core);
        vi.doMock('../src/browse.js', () => m.browse);

        await import('../src/tampermonkey.js');
        await new Promise((r) => setTimeout(r, 0));

        await window.fetch('https://capitaloneshopping.com/api/v1/trip_orders');
        await window.fetch('https://capitaloneshopping.com/api/v1/feed');
        await new Promise((r) => setTimeout(r, 0));
        await new Promise((r) => setTimeout(r, 0));

        // Only the trips URL warmed the trips tab
        const tripsWarms = m.tabDataSet.filter((d) => d.id === 'trips');
        expect(tripsWarms.length).toBe(1);
        expect(tripsWarms[0]!.data).toEqual(tripsBody);
        expect(m.tabDataSet.filter((d) => d.id === 'browse').length).toBe(0);
    });

    it('offers trips interceptor does NOT warm cache when response has hasMore=true (defers to paginator)', async () => {
        window.location.href = 'https://capitaloneoffers.com/shopping-trips';
        const m = makeMocks({ site: 'offers', mode: 'trips' });

        // Simulate a partial page-1 response
        const baseFetch = vi.fn(async (): Promise<Response> => {
            return new Response(JSON.stringify({ data: [{ vendor: 'X' }], hasMore: true }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
        });
        vi.stubGlobal('fetch', baseFetch);

        vi.doMock('../src/core.js', () => m.core);
        vi.doMock('../src/browse.js', () => m.browse);

        await import('../src/tampermonkey.js');
        await new Promise((r) => setTimeout(r, 0));

        await window.fetch('https://capitaloneoffers.com/xhr/shopping-trips?limit=100&offset=0');
        await new Promise((r) => setTimeout(r, 0));
        await new Promise((r) => setTimeout(r, 0));

        // Interceptor saw the response but did NOT warm the cache — hasMore=true
        expect(m.tabDataSet.filter((d) => d.id === 'trips').length).toBe(0);
    });
});
