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
// 3) bookmarklet-full.ts mode dispatch
//
// We swap out ./core.js and ./browse.js with fakes so we can inspect what
// createUI is invoked with and confirm walker → processBrowseData → updateData
// data flow.
//-----------------------------------------------------------------------------

type CreateUICall = {
    /** Captured render fn — identity-checked against the renderer the entry passed */
    render: unknown;
    getBadgeCount: (d: unknown) => number;
    processedData: unknown;
    onOpen?: () => void | Promise<void>;
};

interface MockUIHandle<T> {
    ensureFab: () => HTMLElement;
    ensureOverlay: () => HTMLElement;
    ensureStyles: () => void;
    updateFabState: (fab: HTMLElement, data: T) => void;
    updateData: (data: T) => void;
}

interface MockCoreExports {
    CONFIG: typeof CONFIG;
    getCurrentSite: () => 'shopping' | 'offers' | null;
    detectMode: () => 'trips' | 'browse' | null;
    processTripsData: (raw: unknown) => TripsData;
    renderTripsToModal: unknown;
    createUI: <T>(opts: {
        onOpen?: () => void | Promise<void>;
        processedData?: T | null;
        render: unknown;
        getBadgeCount: (d: T) => number;
    }) => MockUIHandle<T>;
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
    createUICalls: CreateUICall[];
    updates: Array<{ which: 'trips' | 'browse'; data: unknown }>;
    tripsRenderer: object;
    browseRenderer: object;
} {
    const createUICalls: CreateUICall[] = [];
    const updates: Array<{ which: 'trips' | 'browse'; data: unknown }> = [];
    const tripsRenderer = { __id: 'renderTripsToModal' };
    const browseRenderer = { __id: 'renderBrowseToModal' };

    const createUI: MockCoreExports['createUI'] = (cfg) => {
        const which: 'trips' | 'browse' =
            cfg.render === tripsRenderer ? 'trips' : 'browse';
        createUICalls.push({
            render: cfg.render,
            getBadgeCount: cfg.getBadgeCount as (d: unknown) => number,
            processedData: cfg.processedData,
            ...(cfg.onOpen ? { onOpen: cfg.onOpen } : {})
        });
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
            updateFabState: () => {},
            updateData: (d) => {
                updates.push({ which, data: d });
            }
        };
    };

    const core: MockCoreExports = {
        CONFIG,
        getCurrentSite: () => opts.site,
        detectMode: () => opts.mode,
        processTripsData: (raw: unknown) => {
            // Stub: pretend input was already a TripsData shape.
            return raw as TripsData;
        },
        renderTripsToModal: tripsRenderer,
        createUI
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
        createUICalls,
        updates,
        tripsRenderer,
        browseRenderer
    };
}

describe('bookmarklet-full entry — mode dispatch', () => {
    it('mode==="trips" on shopping wires renderTripsToModal and fetches trip_orders', async () => {
        window.location.href =
            'https://capitaloneshopping.com/account-settings/shopping-trips';
        const m = makeMocks({ site: 'shopping', mode: 'trips' });
        const fetchMock = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => ({ items: [{ vendor: 'X', orderId: '1' }] })
        } as Response);
        vi.stubGlobal('fetch', fetchMock);
        vi.doMock('../src/core.js', () => m.core);
        vi.doMock('../src/browse.js', () => m.browse);

        await import('../src/bookmarklet-full.js');
        // Yield microtasks so the inner async fetch chain completes.
        await new Promise((r) => setTimeout(r, 0));
        await new Promise((r) => setTimeout(r, 0));

        // Trips createUI registered with the trips renderer
        const trips = m.createUICalls.find((c) => c.render === m.tripsRenderer);
        expect(trips).toBeDefined();
        // Badge count function comes from stats.withCredit
        const stats: TripsData['stats'] = {
            total: 0,
            withOrderId: 0,
            withAmount: 0,
            withCredit: 7,
            pending: 0,
            created: 0
        };
        expect(
            trips!.getBadgeCount({ trips: [], stats } as TripsData)
        ).toBe(7);

        // fetch was called against the shopping trips endpoint
        expect(fetchMock).toHaveBeenCalled();
        const callArg = fetchMock.mock.calls[0]![0];
        expect(String(callArg)).toContain('/api/v1/trip_orders');

        // No browse walkers invoked in trips mode
        expect(m.browse.walkShoppingFeed).not.toHaveBeenCalled();
        expect(m.browse.walkOffersFeed).not.toHaveBeenCalled();
    });

    it('mode==="browse" on shopping wires renderBrowseToModal, calls walkShoppingFeed and pipes items through processBrowseData', async () => {
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
        await new Promise((r) => setTimeout(r, 0));

        const browseCall = m.createUICalls.find(
            (c) => c.render === m.browseRenderer
        );
        expect(browseCall).toBeDefined();

        // Badge function reads stats.total
        const fakeData: BrowseData = {
            offers: [],
            buckets: {},
            bucketOrder: [],
            stats: { total: 12, byBucket: {} }
        };
        expect(browseCall!.getBadgeCount(fakeData)).toBe(12);

        // walkShoppingFeed kicked off, walkOffersFeed not
        expect(m.browse.walkShoppingFeed).toHaveBeenCalled();
        expect(m.browse.walkOffersFeed).not.toHaveBeenCalled();

        // walker items piped through processBrowseData
        expect(m.browse.processBrowseData).toHaveBeenCalledWith(fakeOffers);

        // updateData called once with the processed BrowseData on the browse UI
        const browseUpdates = m.updates.filter((u) => u.which === 'browse');
        expect(browseUpdates.length).toBe(1);
        const updateData = browseUpdates[0]!.data as BrowseData;
        expect(updateData.stats.total).toBe(fakeOffers.length);
        expect(updateData.stats.pagesWalked).toBe(4);
        expect(updateData.stats.hitCap).toBe(false);
    });

    it('mode==="browse" on offers with no context shows error and does NOT walk', async () => {
        window.location.href = 'https://capitaloneoffers.com/feed';
        const m = makeMocks({ site: 'offers', mode: 'browse' });
        m.browse.fetchOffersBrowseContext.mockResolvedValue(null);
        vi.doMock('../src/core.js', () => m.core);
        vi.doMock('../src/browse.js', () => m.browse);

        await import('../src/bookmarklet-full.js');
        await new Promise((r) => setTimeout(r, 0));
        await new Promise((r) => setTimeout(r, 0));

        expect(m.browse.fetchOffersBrowseContext).toHaveBeenCalled();
        expect(m.browse.walkOffersFeed).not.toHaveBeenCalled();

        const loading = document.querySelector('#c1t-loading');
        expect(loading?.textContent ?? '').toMatch(/context|userId|diagnostics/i);
    });

    it('mode==="browse" on offers WITH context calls walkOffersFeed(ctx, onPage)', async () => {
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
        await new Promise((r) => setTimeout(r, 0));
        await new Promise((r) => setTimeout(r, 0));

        expect(m.browse.walkOffersFeed).toHaveBeenCalledTimes(1);
        const args = m.browse.walkOffersFeed.mock.calls[0]!;
        expect(args[0]).toEqual(ctx);
        expect(typeof args[1]).toBe('function'); // onPage callback

        const browseUpdates = m.updates.filter((u) => u.which === 'browse');
        expect(browseUpdates.length).toBe(1);
        const data = browseUpdates[0]!.data as BrowseData;
        expect(data.stats.hitCap).toBe(true);
        expect(data.stats.pagesWalked).toBe(40);
    });

    it('mode===null alerts the user instead of doing anything', async () => {
        window.location.href =
            'https://capitaloneshopping.com/account-settings/profile';
        const m = makeMocks({ site: 'shopping', mode: null });
        const alertMock = vi.fn();
        vi.stubGlobal('alert', alertMock);
        vi.doMock('../src/core.js', () => m.core);
        vi.doMock('../src/browse.js', () => m.browse);

        await import('../src/bookmarklet-full.js');
        await new Promise((r) => setTimeout(r, 0));

        expect(alertMock).toHaveBeenCalledTimes(1);
        const alertMsg = String(alertMock.mock.calls[0]![0]);
        expect(alertMsg.toLowerCase()).toMatch(/trips|browse|navigate/);
        // No createUI invocations
        expect(m.createUICalls.length).toBe(0);
    });
});

//-----------------------------------------------------------------------------
// 4) Tampermonkey entry — mode-aware FAB management
//-----------------------------------------------------------------------------

describe('tampermonkey entry — dual-mode FAB', () => {
    it('on trips page: creates trips-mode createUI and ensures FAB exists', async () => {
        window.location.href =
            'https://capitaloneshopping.com/account-settings/shopping-trips';
        const m = makeMocks({ site: 'shopping', mode: 'trips' });
        vi.doMock('../src/core.js', () => m.core);
        vi.doMock('../src/browse.js', () => m.browse);

        await import('../src/tampermonkey.js');
        // Allow the keepAlive timer + observer to settle
        await new Promise((r) => setTimeout(r, 0));

        // Both createUI instances were constructed (trips + browse) — that's
        // intentional, per the dual-instance plan. The trips one should be present.
        const trips = m.createUICalls.find((c) => c.render === m.tripsRenderer);
        const browse = m.createUICalls.find((c) => c.render === m.browseRenderer);
        expect(trips).toBeDefined();
        expect(browse).toBeDefined();

        // FAB rendered (trips ensureFab was called on init via keepAlive)
        expect(document.getElementById('c1t-fab')).not.toBeNull();
    });

    it('on browse page: creates browse-mode createUI with stats.total badge fn', async () => {
        window.location.href = 'https://capitaloneshopping.com/';
        const m = makeMocks({ site: 'shopping', mode: 'browse' });
        vi.doMock('../src/core.js', () => m.core);
        vi.doMock('../src/browse.js', () => m.browse);

        await import('../src/tampermonkey.js');
        await new Promise((r) => setTimeout(r, 0));

        const browse = m.createUICalls.find((c) => c.render === m.browseRenderer);
        expect(browse).toBeDefined();
        const data: BrowseData = {
            offers: [],
            buckets: {},
            bucketOrder: [],
            stats: { total: 42, byBucket: {} }
        };
        expect(browse!.getBadgeCount(data)).toBe(42);

        expect(document.getElementById('c1t-fab')).not.toBeNull();
    });

    it('on a non-target path: both createUI instances still register (but neither FAB is ensured)', async () => {
        window.location.href =
            'https://capitaloneshopping.com/account-settings/profile';
        const m = makeMocks({ site: 'shopping', mode: null });
        vi.doMock('../src/core.js', () => m.core);
        vi.doMock('../src/browse.js', () => m.browse);

        await import('../src/tampermonkey.js');
        await new Promise((r) => setTimeout(r, 0));

        // Both createUI instances should have been constructed eagerly, so
        // the renderer/badge wiring is in place even on a non-target route.
        // The mode-aware keepAlive simply doesn't call ensureFab() for either
        // until detectMode() resolves to trips or browse.
        const trips = m.createUICalls.find((c) => c.render === m.tripsRenderer);
        const browse = m.createUICalls.find((c) => c.render === m.browseRenderer);
        expect(trips).toBeDefined();
        expect(browse).toBeDefined();
    });

    it('fetch interception only fires trips API handler on trips-pattern URLs', async () => {
        window.location.href =
            'https://capitaloneshopping.com/account-settings/shopping-trips';
        const m = makeMocks({ site: 'shopping', mode: 'trips' });

        // Capture the trips updateData path indirectly: processTripsData mock
        const seen: unknown[] = [];
        m.core.processTripsData = (raw: unknown) => {
            seen.push(raw);
            return raw as TripsData;
        };

        // Make the fetched response shape easy to clone
        const tripsBody = { items: [{ vendor: 'Z' }] };
        const browseBody = { items: [{ type: 'great_deal' }] };

        // The interceptor wraps the real window.fetch. We stub the underlying
        // fetch the interceptor will call.
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

        // Now exercise the wrapped fetch
        await window.fetch('https://capitaloneshopping.com/api/v1/trip_orders');
        await window.fetch('https://capitaloneshopping.com/api/v1/feed');
        // Yield for the clone().json() chain
        await new Promise((r) => setTimeout(r, 0));
        await new Promise((r) => setTimeout(r, 0));

        // Only the trips URL went through processTripsData
        expect(seen.length).toBe(1);
        expect(seen[0]).toEqual(tripsBody);
    });
});
