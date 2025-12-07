// Full bookmarklet version - loaded by the bookmarklet loader
// This fetches API data directly when executed

import { CONFIG, getCurrentSite, isOnShoppingTripsPage, processTripsData, createUI } from './core.js';

(async function() {
    'use strict';

    const currentSite = getCurrentSite();

    if (!currentSite) {
        alert('Please run this on capitaloneshopping.com or capitaloneoffers.com');
        return;
    }

    if (!isOnShoppingTripsPage()) {
        const path = CONFIG[currentSite].pagePath;
        alert(`Please navigate to the Shopping Trips page first:\n${window.location.origin}${path}`);
        return;
    }

    // Check if already loaded
    if (document.getElementById('c1t-fab')) {
        const overlay = document.getElementById('c1t-overlay');
        if (overlay) overlay.classList.add('open');
        return;
    }

    console.log('[C1 Tracker Bookmarklet] Running on', currentSite);

    let processedData = null;

    // Create UI immediately with loading state
    const ui = createUI({
        processedData: null,
        onOpen: () => {
            if (!processedData) {
                fetchData();
            }
        }
    });

    ui.ensureFab();
    ui.ensureOverlay();

    // Open modal immediately
    const overlay = document.getElementById('c1t-overlay');
    if (overlay) overlay.classList.add('open');

    async function fetchData() {
        const content = document.querySelector('#c1t-content');
        if (content) {
            content.innerHTML = '<div id="c1t-loading">Fetching shopping trips data...</div>';
        }

        try {
            let data;

            if (currentSite === 'shopping') {
                // Capital One Shopping - direct API call
                const response = await fetch('/api/v1/trip_orders', {
                    credentials: 'include'
                });

                if (!response.ok) {
                    throw new Error(`API returned ${response.status}`);
                }

                data = await response.json();
            } else {
                // Capital One Offers - need to find the right endpoint
                // Try the shopping-trips endpoint with common parameters
                const response = await fetch('/api/shopping-trips?version=2', {
                    credentials: 'include'
                });

                if (!response.ok) {
                    // Try alternate endpoint
                    const altResponse = await fetch('/shopping-trips?_data=routes%2Fshopping-trips&version=2', {
                        credentials: 'include'
                    });

                    if (!altResponse.ok) {
                        throw new Error('Could not fetch data. Navigate to Shopping Trips page and try again.');
                    }

                    data = await altResponse.json();
                } else {
                    data = await response.json();
                }
            }

            console.log('[C1 Tracker Bookmarklet] Fetched data:', data);
            processedData = processTripsData(data);
            console.log('[C1 Tracker Bookmarklet] Processed:', processedData.stats);

            ui.updateData(processedData);

        } catch (error) {
            console.error('[C1 Tracker Bookmarklet] Error:', error);

            if (content) {
                content.innerHTML = `
                    <div id="c1t-loading">
                        <p>Error fetching data: ${error.message}</p>
                        <p style="margin-top: 10px; font-size: 12px; opacity: 0.8;">
                            Make sure you're logged in and try navigating to the Shopping Trips page first.
                        </p>
                    </div>
                `;
            }
        }
    }

    // Fetch data immediately
    fetchData();
})();
