// Full bookmarklet — loaded by the bookmarklet loader.
// Constructs a single tabbed FAB (Trips + Browse) for whichever Cap One site
// we're on. Both tabs lazy-load on activation; the default active tab is
// picked from detectMode() when we're on a canonical path.

import {
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

(async function () {
    'use strict';

    const currentSite = getCurrentSite();
    if (!currentSite) {
        alert('Please run this on capitaloneshopping.com or capitaloneoffers.com');
        return;
    }

    const mode = detectMode();
    const defaultTabId = mode === 'browse' ? 'browse' : 'trips';

    // If a FAB from an earlier click already exists, just re-open the modal.
    // The tabbed UI persists tab state across close/open, so nothing to tear
    // down like the old mode-aware version had to.
    if (document.getElementById('c1t-fab')) {
        document.getElementById('c1t-overlay')?.classList.add('open');
        return;
    }

    console.log('[C1 Tracker Bookmarklet] Running on', currentSite, 'defaultTab=', defaultTabId);

    // Forward declare so loadTrips's onProgress can push partial data into the
    // active tab as pages stream in. Assigned when createTabbedUI is called below.
    let ui: TabbedUIHandle;

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
            // paginator stops on a short page.
            return processTripsData(await fetchAllShoppingTrips({
                onProgress: (items, pages) => emitPartial(items, pages, 'items')
            }));
        }
        // Offers: walk all pages via hasMore, not just the first 100.
        return processTripsData(await fetchAllOffersTrips({
            onProgress: (items, pages) => emitPartial(items, pages, 'data')
        }));
    }

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
                    'Open DevTools console for diagnostics. The URL should look like ' +
                    '/feed/<userId>?viewInstanceId=<uuid>. Try clicking into the feed grid once, then re-run.'
            );
        }
        const result = await walkOffersFeed(ctx, { onPage, onProgress: emitBrowsePartial });
        const data = processBrowseData(result.items);
        data.stats.hitCap = result.hitCap;
        data.stats.pagesWalked = result.pagesWalked;
        return data;
    }

    const siteLabel = currentSite === 'offers' ? 'Cap One Offers' : 'Cap One Shopping';
    ui = createTabbedUI({
        title: `${siteLabel} Tracker`,
        defaultTabId,
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

    ui.ensureFab();
    ui.ensureOverlay();
    document.getElementById('c1t-overlay')?.classList.add('open');
    ui.setActiveTab(defaultTabId);
})();
