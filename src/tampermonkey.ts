// Tampermonkey userscript — persistent tabbed FAB across SPA navigation.
//
// One FAB per Cap One site (shopping or offers). The FAB opens a modal with
// two tabs (Trips + Browse). Each tab lazy-loads its data on first activation
// and caches for the session. The trips-API interceptor pre-warms the Trips
// tab when the user happens to be on the trips page.
//
// The Tampermonkey header (// ==UserScript==) is prepended by scripts/build.js.
// Do not include it here — esbuild would strip it and the build adds a fresh one.

import {
    CONFIG,
    createTabbedUI,
    detectMode,
    fetchAllOffersTrips,
    fetchAllShoppingTrips,
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
import type { BrowseData, Offer, TabbedUIHandle, TripsData } from './types.js';

(function () {
    'use strict';

    const maybeSite = getCurrentSite();
    if (!maybeSite) return;
    const currentSite: 'shopping' | 'offers' = maybeSite;

    console.log('[C1 Tracker] Initialized on', currentSite, 'site');

    //-------------------------------------------------------------------------
    // Tab loaders — reused by the FAB (lazy on activate) and the interceptor
    // fallback (when hasMore=true means the page only loaded a partial set).
    //-------------------------------------------------------------------------

    // Forward declare so loadTrips's onProgress can push partial data into the
    // active tab as pages stream in. Assigned after createTabbedUI below.
    let ui: TabbedUIHandle;

    // Wraps accumulated raw items into a partial TripsData and updates the
    // loading banner text. The banner + spinner live in createTabbedUI's
    // #c1t-progress-banner; auto-cleared when onActivate resolves.
    function emitPartial(itemsSoFar: unknown, pagesWalked: number, envelopeKey: 'data' | 'items'): void {
        if (!ui) return;
        const envelope = envelopeKey === 'data' ? { data: itemsSoFar } : { items: itemsSoFar };
        const partial = processTripsData(envelope);
        ui.setTabData('trips', partial);
        ui.setTabLoading('trips', `Loading page ${pagesWalked} · ${partial.stats.total} trips`);
    }

    async function loadTrips(): Promise<TripsData> {
        if (currentSite === 'shopping') {
            // Walk all pages of /api/v1/trip_orders — no hasMore field, so the
            // paginator stops on a short page. onProgress streams partial data
            // into the trips tab so the user sees rows as they arrive.
            return processTripsData(await fetchAllShoppingTrips({
                onProgress: (items, pages) => emitPartial(items, pages, 'items')
            }));
        }
        // Offers: walk all pages via hasMore, not just the first 100.
        return processTripsData(await fetchAllOffersTrips({
            onProgress: (items, pages) => emitPartial(items, pages, 'data')
        }));
    }

    // Emits partial BrowseData after each browse page + updates the banner text.
    function emitBrowsePartial(offers: Offer[], pages: number): void {
        if (!ui) return;
        const partial = processBrowseData(offers);
        ui.setTabData('browse', partial);
        ui.setTabLoading('browse', `Loading page ${pages} · ${partial.stats.total} offers`);
    }

    async function loadBrowse(): Promise<BrowseData> {
        const onPage = (pages: number, total: number): void => {
            const loading = document.querySelector('#c1t-loading');
            if (loading) loading.textContent = `Loaded ${pages} pages, ${total} offers...`;
        };
        if (currentSite === 'shopping') {
            const result = await walkShoppingFeed({ onPage, onProgress: emitBrowsePartial });
            const data = processBrowseData(result.items);
            data.stats.hitCap = result.hitCap;
            data.stats.pagesWalked = result.pagesWalked;
            return data;
        }
        const ctx = await fetchOffersBrowseContext();
        if (!ctx) {
            throw new Error(
                'Could not capture offers feed context (userId + viewInstanceId). ' +
                    'Open DevTools console for diagnostics.'
            );
        }
        const result = await walkOffersFeed(ctx, { onPage, onProgress: emitBrowsePartial });
        const data = processBrowseData(result.items);
        data.stats.hitCap = result.hitCap;
        data.stats.pagesWalked = result.pagesWalked;
        return data;
    }

    //-------------------------------------------------------------------------
    // Tabbed UI — single FAB, two tabs, default picked by current mode.
    //-------------------------------------------------------------------------

    const initialMode = detectMode();
    const siteLabel = currentSite === 'offers' ? 'Cap One Offers' : 'Cap One Shopping';
    ui = createTabbedUI({
        title: `${siteLabel} Tracker`,
        defaultTabId: initialMode === 'browse' ? 'browse' : 'trips',
        tabs: [
            {
                id: 'trips',
                label: 'Trips',
                render: renderTripsToModal as (o: HTMLElement, d: unknown) => void,
                getBadgeCount: (d) => (d as TripsData)?.stats?.withCredit ?? 0,
                onActivate: loadTrips as () => Promise<unknown>,
                loadingText: 'Fetching shopping trips data...'
            },
            {
                id: 'browse',
                label: 'Browse',
                render: renderBrowseToModal as (o: HTMLElement, d: unknown) => void,
                onActivate: loadBrowse as () => Promise<unknown>,
                loadingText: 'Walking offers feed... (0 pages)'
            }
        ]
    });

    //-------------------------------------------------------------------------
    // Trips API interception — pre-warms the Trips tab when the user is on the
    // trips page and Cap One's SPA fires the request. Free warm cache.
    //-------------------------------------------------------------------------

    function handleTripsApiData(data: unknown): void {
        // On offers, the API returns {data, hasMore}. If hasMore=true, the page
        // only fetched the first slice — skip caching so the FAB doesn't show
        // a truncated list; the tab's onActivate will paginate fully.
        if (currentSite === 'offers') {
            const wrapped = data as { hasMore?: boolean } | null | undefined;
            if (wrapped && wrapped.hasMore === true) {
                console.log('[C1 Tracker] Intercepted offers trips page 1 with hasMore=true; deferring to paginator');
                return;
            }
        }
        // On shopping, the response is {items, offset, limit} — no hasMore. If we
        // got a full page (Cap One's SPA typically requests limit=50), assume
        // there's more and let the paginator take over on FAB open.
        if (currentSite === 'shopping') {
            const wrapped = data as { items?: unknown[] } | null | undefined;
            const itemCount = Array.isArray(wrapped?.items) ? wrapped.items.length : 0;
            if (itemCount >= 50) {
                console.log('[C1 Tracker] Intercepted shopping trips page appears full (', itemCount, '); deferring to paginator');
                return;
            }
        }
        console.log('[C1 Tracker] Captured trips API data');
        const processed = processTripsData(data);
        console.log('[C1 Tracker] Processed trips:', processed.stats);
        ui.setTabData('trips', processed);
    }

    function isTripsAPI(url: string | null | undefined): boolean {
        if (!url) return false;
        return CONFIG[currentSite].trips.apiPattern(String(url));
    }

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
    // Persistent FAB — no more mode teardown, just keep it alive on the page.
    //-------------------------------------------------------------------------

    function keepAlive(): void {
        if (!document.body) return;
        ui.ensureFab();
    }

    function initUI(): void {
        setInterval(keepAlive, 1000);

        const observer = new MutationObserver(() => {
            if (!document.getElementById('c1t-fab')) ui.ensureFab();
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

    console.log('[C1 Tracker] Script loaded — tabbed FAB will persist');
})();
