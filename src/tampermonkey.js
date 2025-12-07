// ==UserScript==
// @name         Capital One Shopping & Offers - Tracker FAB
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Shows hidden orderAmount and creditAmount data for shopping trips via a floating action button
// @author       You
// @match        https://capitaloneoffers.com/*
// @match        https://www.capitaloneoffers.com/*
// @match        https://capitaloneshopping.com/*
// @match        https://www.capitaloneshopping.com/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

import { CONFIG, getCurrentSite, isOnShoppingTripsPage, processTripsData, createUI } from './core.js';

(function() {
    'use strict';

    const currentSite = getCurrentSite();
    if (!currentSite) return;

    console.log('[C1 Tracker] Initialized on', currentSite, 'site');

    // Persistent data store
    let tripsData = null;
    let processedData = null;
    let ui = null;

    function handleApiData(data) {
        console.log('[C1 Tracker] Captured API data:', data);
        tripsData = data;
        processedData = processTripsData(data);
        console.log('[C1 Tracker] Processed:', processedData.stats);

        if (ui) {
            ui.updateData(processedData);
        }
    }

    function isTargetAPI(url) {
        if (!url) return false;
        const urlStr = url.toString();
        return CONFIG[currentSite].apiPattern(urlStr);
    }

    // Intercept fetch
    const originalFetch = window.fetch;
    window.fetch = async function(...args) {
        const response = await originalFetch.apply(this, args);
        const url = args[0]?.url || args[0]?.toString() || args[0];

        if (isTargetAPI(url)) {
            try {
                const clonedResponse = response.clone();
                const data = await clonedResponse.json();
                handleApiData(data);
            } catch (e) {
                console.error('[C1 Tracker] Error parsing response:', e);
            }
        }
        return response;
    };

    // Intercept XHR
    const originalXHROpen = XMLHttpRequest.prototype.open;
    const originalXHRSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function(method, url, ...rest) {
        this._url = url;
        return originalXHROpen.apply(this, [method, url, ...rest]);
    };

    XMLHttpRequest.prototype.send = function(...args) {
        this.addEventListener('load', function() {
            if (isTargetAPI(this._url)) {
                try {
                    handleApiData(JSON.parse(this.responseText));
                } catch (e) {
                    console.error('[C1 Tracker] Error parsing XHR:', e);
                }
            }
        });
        return originalXHRSend.apply(this, args);
    };

    // Fallback: fetch data directly if we missed the API call (e.g., page reload)
    async function fetchDataFallback() {
        if (processedData) return; // Already have data

        console.log('[C1 Tracker] No intercepted data, fetching directly...');

        try {
            let data;

            if (currentSite === 'shopping') {
                const response = await fetch('/api/v1/trip_orders', {
                    credentials: 'include'
                });
                if (!response.ok) throw new Error(`API returned ${response.status}`);
                data = await response.json();
            } else {
                // Offers site - uses POST with specific URL pattern
                const response = await fetch('/c1-offers/shopping-trips?limit=300&offset=0&version=2&_data=routes%2Fc1-offers.shopping-trips', {
                    method: 'POST',
                    credentials: 'include'
                });
                if (!response.ok) throw new Error(`API returned ${response.status}`);
                data = await response.json();
            }

            handleApiData(data);
        } catch (e) {
            console.error('[C1 Tracker] Fallback fetch failed:', e);
        }
    }

    // Initialize UI
    function initUI() {
        ui = createUI({
            processedData,
            onOpen: fetchDataFallback // Fetch data when modal opens if we don't have it
        });

        function keepAlive() {
            // Only show FAB on shopping trips pages
            if (document.body && isOnShoppingTripsPage()) {
                ui.ensureFab();
            } else {
                // Remove FAB if we navigated away
                const fab = document.getElementById('c1t-fab');
                if (fab) fab.remove();
            }
        }

        setInterval(keepAlive, 1000);

        const observer = new MutationObserver(() => {
            if (!document.getElementById('c1t-fab') && document.body && isOnShoppingTripsPage()) {
                ui.ensureFab();
            }
        });

        if (document.body) {
            observer.observe(document.body, { childList: true, subtree: true });
            keepAlive();
        }
    }

    let initialized = false;
    function initOnce() {
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

    console.log('[C1 Tracker] Script loaded - FAB will persist');
})();
