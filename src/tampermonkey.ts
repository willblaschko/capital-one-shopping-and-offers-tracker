// Tampermonkey userscript — persistent FAB across SPA navigation.
//
// Dual-mode: shows a trips FAB on trips pages, a browse FAB on browse pages.
// Only one FAB visible at a time; both are created lazily and torn down when
// detectMode() shifts.
//
// The Tampermonkey header (// ==UserScript==) is prepended by scripts/build.js.
// Do not include it here — esbuild would strip it and the build adds a fresh one.

import {
    CONFIG,
    createUI,
    detectMode,
    fetchAllOffersTrips,
    getCurrentSite,
    processTripsData,
    renderTripsToModal
} from './core.js';
import {
    fetchOffersBrowseContext,
    processBrowseData,
    renderBrowseToModal,
    walkOffersFeed,
    walkShoppingFeed
} from './browse.js';
import type { BrowseData, Mode, TripsData } from './types.js';

(function () {
    'use strict';

    const maybeSite = getCurrentSite();
    if (!maybeSite) return;
    const currentSite: 'shopping' | 'offers' = maybeSite;

    console.log('[C1 Tracker] Initialized on', currentSite, 'site');

    //-------------------------------------------------------------------------
    // Trips state + UI
    //-------------------------------------------------------------------------

    let tripsProcessed: TripsData | null = null;

    const tripsUI = createUI<TripsData>({
        processedData: null,
        onOpen: () => {
            if (!tripsProcessed) void fetchTripsFallback();
        },
        render: renderTripsToModal,
        getBadgeCount: (d) => d?.stats?.withCredit ?? 0
    });

    function handleTripsApiData(data: unknown): void {
        // On offers, the API returns {data, hasMore}. If hasMore=true, the page
        // only fetched the first slice — don't cache it as complete, or the FAB
        // will show a truncated list. Fall through to fetchTripsFallback which
        // walks every page.
        if (currentSite === 'offers') {
            const wrapped = data as { hasMore?: boolean } | null | undefined;
            if (wrapped && wrapped.hasMore === true) {
                console.log('[C1 Tracker] Intercepted trips page 1 with hasMore=true; will paginate on open');
                return;
            }
        }
        console.log('[C1 Tracker] Captured trips API data');
        tripsProcessed = processTripsData(data);
        console.log('[C1 Tracker] Processed trips:', tripsProcessed.stats);
        tripsUI.updateData(tripsProcessed);
    }

    async function fetchTripsFallback(): Promise<void> {
        if (tripsProcessed) return;
        console.log('[C1 Tracker] No intercepted trips data, fetching directly...');
        try {
            let data: unknown;
            if (currentSite === 'shopping') {
                const r = await fetch(CONFIG.shopping.trips.apiEndpoint, {
                    credentials: 'include'
                });
                if (!r.ok) throw new Error(`API returned ${r.status}`);
                data = await r.json();
            } else {
                // Offers: walk all pages via hasMore, not just the first 100.
                data = await fetchAllOffersTrips();
            }
            handleTripsApiData(data);
        } catch (e) {
            console.error('[C1 Tracker] Trips fallback fetch failed:', e);
        }
    }

    //-------------------------------------------------------------------------
    // Browse state + UI
    //-------------------------------------------------------------------------

    let browseProcessed: BrowseData | null = null;
    let browseWalking = false;

    const browseUI = createUI<BrowseData>({
        processedData: null,
        onOpen: () => {
            if (!browseProcessed && !browseWalking) void runBrowseWalk();
        },
        render: renderBrowseToModal,
        getBadgeCount: (d) => d?.stats?.total ?? 0,
        title: currentSite === 'offers' ? 'Browse Cap One Offers' : 'Browse Cap One Shopping',
        loadingText: 'Loading offers feed...'
    });

    async function runBrowseWalk(): Promise<void> {
        if (browseWalking) return;
        browseWalking = true;

        const setLoading = (msg: string): void => {
            const loading = document.querySelector('#c1t-loading');
            if (loading) {
                loading.textContent = msg;
                return;
            }
            const content = document.querySelector('#c1t-content');
            if (content) {
                content.innerHTML = `<div id="c1t-loading">${msg}</div>`;
            }
        };
        setLoading('Walking offers feed... (0 pages)');

        const onPage = (pages: number, total: number): void => {
            setLoading(`Loaded ${pages} pages, ${total} offers...`);
        };

        try {
            if (currentSite === 'shopping') {
                const result = await walkShoppingFeed(onPage);
                const data = processBrowseData(result.items);
                data.stats.hitCap = result.hitCap;
                data.stats.pagesWalked = result.pagesWalked;
                browseProcessed = data;
                browseUI.updateData(data);
            } else {
                const ctx = await fetchOffersBrowseContext();
                if (!ctx) {
                    setLoading(
                        'Could not capture offers feed context (userId + viewInstanceId). ' +
                        'Open DevTools console for diagnostics.'
                    );
                    return;
                }
                const result = await walkOffersFeed(ctx, onPage);
                const data = processBrowseData(result.items);
                data.stats.hitCap = result.hitCap;
                data.stats.pagesWalked = result.pagesWalked;
                browseProcessed = data;
                browseUI.updateData(data);
            }
        } catch (e) {
            console.error('[C1 Tracker] Browse walk failed:', e);
            const msg = e instanceof Error ? e.message : String(e);
            setLoading('Error walking feed: ' + msg);
        } finally {
            browseWalking = false;
        }
    }

    //-------------------------------------------------------------------------
    // API interception (trips only — browse runs actively from the FAB)
    //-------------------------------------------------------------------------

    function isTripsAPI(url: string | null | undefined): boolean {
        if (!url) return false;
        return CONFIG[currentSite].trips.apiPattern(String(url));
    }

    // We expose this for the test suite to assert pattern dispatch even though
    // we don't use it in the runtime interceptor below.
    function isBrowseAPI(url: string | null | undefined): boolean {
        if (!url) return false;
        return CONFIG[currentSite].browse.apiPattern(String(url));
    }
    // Touch reference so noUnusedLocals doesn't complain.
    void isBrowseAPI;

    // Intercept fetch
    const originalFetch = window.fetch;
    window.fetch = async function (...args: Parameters<typeof fetch>): Promise<Response> {
        const response = await originalFetch.apply(this, args);
        const first = args[0];
        let url: string | null = null;
        if (typeof first === 'string') {
            url = first;
        } else if (first instanceof URL) {
            url = first.toString();
        } else if (first && typeof (first as Request).url === 'string') {
            url = (first as Request).url;
        }

        if (isTripsAPI(url)) {
            try {
                const cloned = response.clone();
                const data = await cloned.json();
                handleTripsApiData(data);
            } catch (e) {
                console.error('[C1 Tracker] Error parsing trips response:', e);
            }
        }
        return response;
    };

    // Intercept XHR
    const originalXHROpen = XMLHttpRequest.prototype.open;
    const originalXHRSend = XMLHttpRequest.prototype.send;

    type XHRWithUrl = XMLHttpRequest & { _c1tUrl?: string };

    XMLHttpRequest.prototype.open = function (
        this: XHRWithUrl,
        method: string,
        url: string | URL,
        ...rest: unknown[]
    ): void {
        this._c1tUrl = typeof url === 'string' ? url : url.toString();
        // Reuse the original signature via apply — rest typed loosely to satisfy DOM lib.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (originalXHROpen as any).apply(this, [method, url, ...rest]);
    };

    XMLHttpRequest.prototype.send = function (this: XHRWithUrl, ...args: unknown[]): void {
        this.addEventListener('load', function (this: XHRWithUrl) {
            if (isTripsAPI(this._c1tUrl)) {
                try {
                    handleTripsApiData(JSON.parse(this.responseText));
                } catch (e) {
                    console.error('[C1 Tracker] Error parsing XHR:', e);
                }
            }
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (originalXHRSend as any).apply(this, args);
    };

    //-------------------------------------------------------------------------
    // Mode-aware FAB lifecycle — only one FAB visible at a time.
    //-------------------------------------------------------------------------

    let lastMode: Mode | null | undefined = undefined;

    function ensureFabForMode(mode: Mode | null): void {
        // Tear down stale FAB if mode changed
        if (lastMode !== mode) {
            const stale = document.getElementById('c1t-fab');
            if (stale) stale.remove();
            const overlay = document.getElementById('c1t-overlay');
            if (overlay) overlay.remove();
            lastMode = mode;
        }

        if (mode === 'trips') {
            tripsUI.ensureFab();
        } else if (mode === 'browse') {
            browseUI.ensureFab();
        }
        // null: no FAB
    }

    function keepAlive(): void {
        if (!document.body) return;
        ensureFabForMode(detectMode());
    }

    function initUI(): void {
        setInterval(keepAlive, 1000);

        const observer = new MutationObserver(() => {
            const mode = detectMode();
            if (mode && !document.getElementById('c1t-fab')) {
                ensureFabForMode(mode);
            } else if (lastMode !== mode) {
                ensureFabForMode(mode);
            }
        });

        if (document.body) {
            observer.observe(document.body, { childList: true, subtree: true });
            keepAlive();
        }
    }

    let initialized = false;
    function initOnce(): void {
        if (initialized) return;
        initialized = true;
        initUI();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initOnce);
    } else {
        initOnce();
    }

    window.addEventListener('load', initOnce);

    console.log('[C1 Tracker] Script loaded — FAB will persist');
})();
