// Full bookmarklet — loaded by the bookmarklet loader.
// Constructs a single tabbed FAB (Trips + Browse) for whichever Cap One site
// we're on. Both tabs lazy-load on activation; the default active tab is
// picked from detectMode() when we're on a canonical path.

import {
    CONFIG,
    createTabbedUI,
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
import type { BrowseData, TripsData } from './types.js';

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

    async function loadTrips(): Promise<TripsData> {
        if (currentSite === 'shopping') {
            const response = await fetch(CONFIG.shopping.trips.apiEndpoint, {
                credentials: 'include'
            });
            if (!response.ok) throw new Error(`API returned ${response.status}`);
            return processTripsData(await response.json());
        }
        // Offers: walk all pages via hasMore, not just the first 100.
        return processTripsData(await fetchAllOffersTrips());
    }

    async function loadBrowse(): Promise<BrowseData> {
        const onPage = (pages: number, total: number): void => {
            const loading = document.querySelector('#c1t-loading');
            if (loading) loading.textContent = `Loaded ${pages} pages, ${total} offers...`;
        };
        if (currentSite === 'shopping') {
            const result = await walkShoppingFeed(onPage);
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
        const result = await walkOffersFeed(ctx, onPage);
        const data = processBrowseData(result.items);
        data.stats.hitCap = result.hitCap;
        data.stats.pagesWalked = result.pagesWalked;
        return data;
    }

    const siteLabel = currentSite === 'offers' ? 'Cap One Offers' : 'Cap One Shopping';
    const ui = createTabbedUI({
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
