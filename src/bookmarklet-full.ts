// Full bookmarklet — loaded by the bookmarklet loader.
// Dispatches on detectMode():
//   - 'trips':  direct-fetch the trips API and render via renderTripsToModal
//   - 'browse': walk the catalog feed (shopping POST /api/v1/feed, offers GET /feed/{userId})
//               and render via renderBrowseToModal
//   - null:     alert telling user to navigate to a supported page

import {
    CONFIG,
    createUI,
    detectMode,
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

    if (mode === null) {
        const trips = CONFIG[currentSite].pages.trips;
        const browse = CONFIG[currentSite].pages.browse;
        alert(
            'Please navigate to a Capital One Shopping Trips or browse page:\n' +
                `${window.location.origin}${trips}\n` +
                `${window.location.origin}${browse}`
        );
        return;
    }

    // If already loaded, just open the modal
    if (document.getElementById('c1t-fab')) {
        const overlay = document.getElementById('c1t-overlay');
        if (overlay) overlay.classList.add('open');
        return;
    }

    console.log('[C1 Tracker Bookmarklet] Running on', currentSite, 'mode=', mode);

    if (mode === 'trips') {
        runTripsMode(currentSite);
    } else {
        runBrowseMode(currentSite);
    }
})();

//=============================================================================
// Trips mode
//=============================================================================

function runTripsMode(currentSite: 'shopping' | 'offers'): void {
    let processedData: TripsData | null = null;

    const ui = createUI<TripsData>({
        processedData: null,
        onOpen: () => {
            if (!processedData) {
                void fetchTripsData();
            }
        },
        render: renderTripsToModal,
        getBadgeCount: (d) => d?.stats?.withCredit ?? 0
    });

    ui.ensureFab();
    ui.ensureOverlay();

    // Open modal immediately
    const overlay = document.getElementById('c1t-overlay');
    if (overlay) overlay.classList.add('open');

    async function fetchTripsData(): Promise<void> {
        const content = document.querySelector('#c1t-content');
        if (content) {
            content.innerHTML = '<div id="c1t-loading">Fetching shopping trips data...</div>';
        }

        try {
            let data: unknown;
            if (currentSite === 'shopping') {
                const response = await fetch(CONFIG.shopping.trips.apiEndpoint, {
                    credentials: 'include'
                });
                if (!response.ok) throw new Error(`API returned ${response.status}`);
                data = await response.json();
            } else {
                const response = await fetch(CONFIG.offers.trips.apiEndpoint, {
                    method: 'POST',
                    credentials: 'include'
                });
                if (!response.ok) throw new Error(`API returned ${response.status}`);
                data = await response.json();
            }

            console.log('[C1 Tracker Bookmarklet] Fetched trips data');
            processedData = processTripsData(data);
            console.log('[C1 Tracker Bookmarklet] Processed:', processedData.stats);
            ui.updateData(processedData);
        } catch (error) {
            console.error('[C1 Tracker Bookmarklet] Trips error:', error);
            const msg = error instanceof Error ? error.message : String(error);
            if (content) {
                content.innerHTML = `
                    <div id="c1t-loading">
                        <p>Error fetching data: ${msg}</p>
                        <p style="margin-top: 10px; font-size: 12px; opacity: 0.8;">
                            Make sure you're logged in and try navigating to the Shopping Trips page first.
                        </p>
                    </div>
                `;
            }
        }
    }

    // Kick off fetch immediately
    void fetchTripsData();
}

//=============================================================================
// Browse mode
//=============================================================================

function runBrowseMode(currentSite: 'shopping' | 'offers'): void {
    const ui = createUI<BrowseData>({
        processedData: null,
        render: renderBrowseToModal,
        getBadgeCount: (d) => d?.stats?.total ?? 0,
        title: currentSite === 'offers' ? 'Browse Cap One Offers' : 'Browse Cap One Shopping',
        loadingText: 'Loading offers feed...'
    });

    ui.ensureFab();
    ui.ensureOverlay();

    const overlay = document.getElementById('c1t-overlay');
    if (overlay) overlay.classList.add('open');

    const setLoading = (msg: string): void => {
        const loading = document.querySelector('#c1t-loading');
        if (loading) {
            loading.textContent = msg;
            return;
        }
        // Replace whole content if the loading div is gone (e.g. already rendered)
        const content = document.querySelector('#c1t-content');
        if (content) {
            content.innerHTML = `<div id="c1t-loading">${msg}</div>`;
        }
    };

    setLoading('Walking offers feed... (0 pages)');

    void runBrowseWalk(currentSite, setLoading)
        .then((data) => {
            if (data) ui.updateData(data);
        })
        .catch((err) => {
            console.error('[C1 Tracker Bookmarklet] Browse error:', err);
            const msg = err instanceof Error ? err.message : String(err);
            setLoading('Error walking feed: ' + msg);
        });
}

async function runBrowseWalk(
    currentSite: 'shopping' | 'offers',
    setLoading: (msg: string) => void
): Promise<BrowseData | null> {
    const onPage = (pages: number, total: number): void => {
        setLoading(`Loaded ${pages} pages, ${total} offers...`);
    };

    if (currentSite === 'shopping') {
        const result = await walkShoppingFeed(onPage);
        const data = processBrowseData(result.items);
        data.stats.hitCap = result.hitCap;
        data.stats.pagesWalked = result.pagesWalked;
        return data;
    }

    // Offers — need context first (userId + viewInstanceId)
    const ctx = await fetchOffersBrowseContext();
    if (!ctx) {
        setLoading(
            'Could not capture offers feed context (userId + viewInstanceId). ' +
            'Open DevTools console for diagnostics. The URL should look like ' +
            '/feed/<userId>?viewInstanceId=<uuid>. Try clicking into the feed grid once, then re-run.'
        );
        return null;
    }

    const result = await walkOffersFeed(ctx, onPage);
    const data = processBrowseData(result.items);
    data.stats.hitCap = result.hitCap;
    data.stats.pagesWalked = result.pagesWalked;
    return data;
}
