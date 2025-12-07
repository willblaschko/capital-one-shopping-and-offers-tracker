//=============================================================================
// CORE - Shared logic for Capital One Shopping & Offers Tracker
//=============================================================================

export const CONFIG = {
    offers: {
        hostname: 'capitaloneoffers',
        pagePath: '/c1-offers/shopping-trips',
        apiPattern: (url) => url.includes('shopping-trips') && url.includes('version=2') && url.includes('_data='),
        apiEndpoint: null // Offers uses intercepted calls only
    },
    shopping: {
        hostname: 'capitaloneshopping',
        pagePath: '/account-settings/shopping-trips',
        apiPattern: (url) => url.includes('/api/v1/trip_orders'),
        apiEndpoint: '/api/v1/trip_orders'
    }
};

export function getCurrentSite() {
    if (window.location.hostname.includes('capitaloneoffers')) return 'offers';
    if (window.location.hostname.includes('capitaloneshopping')) return 'shopping';
    return null;
}

export function isOnShoppingTripsPage() {
    const site = getCurrentSite();
    if (!site) return false;
    return window.location.pathname.startsWith(CONFIG[site].pagePath);
}

//=============================================================================
// DATA LAYER - Normalize API responses to standard format
//=============================================================================

export function extractTripsArray(data) {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.items)) return data.items;
    if (Array.isArray(data.shoppingTrips)) return data.shoppingTrips;
    if (Array.isArray(data.trip_orders)) return data.trip_orders;
    if (data.data && Array.isArray(data.data)) return data.data;
    if (data.data?.items && Array.isArray(data.data.items)) return data.data.items;
    return [];
}

export function normalizeTrip(raw) {
    const orderAmount = raw.orderAmount ?? raw.order_amount ?? null;
    const creditAmount = raw.creditAmount ?? raw.credit_amount ?? null;
    const orderId = raw.orderId ?? raw.order_id ?? null;
    const hasCreditAmount = creditAmount !== null && Number(creditAmount) > 0;

    // Derive display status based on credit amount and raw status
    let rawStatus = raw.status ?? 'Unknown';
    let displayStatus = rawStatus;
    if (hasCreditAmount && rawStatus.toLowerCase() === 'canceled') {
        displayStatus = 'Completed';
    } else if (rawStatus.toLowerCase() === 'pending') {
        displayStatus = hasCreditAmount ? 'Pending ✓' : 'Pending ?';
    }

    return {
        id: raw.id ?? raw.tripId ?? null,
        tripId: raw.tripId ?? raw.trip_id ?? raw.id ?? null,
        orderId: orderId,
        merchant: raw.vendor ?? raw.merchantName ?? raw.merchant ?? 'Unknown',
        domain: raw.domain ?? null,
        status: displayStatus,
        rawStatus: rawStatus,
        orderAmount: orderAmount !== null ? Number(orderAmount) : null,
        creditAmount: creditAmount !== null ? Number(creditAmount) : null,
        date: raw.createdAt ?? raw.created_at ?? raw.clickDate ?? null,
        hasOrderId: orderId !== null,
        hasAmount: orderAmount !== null && Number(orderAmount) > 0,
        hasCreditAmount: hasCreditAmount,
        raw: raw
    };
}

export function processTripsData(rawData) {
    const rawTrips = extractTripsArray(rawData);
    const trips = rawTrips.map(normalizeTrip);

    return {
        trips,
        stats: {
            total: trips.length,
            withOrderId: trips.filter(t => t.hasOrderId).length,
            withAmount: trips.filter(t => t.hasAmount).length,
            withCredit: trips.filter(t => t.hasCreditAmount).length,
            pending: trips.filter(t => t.status.toLowerCase().includes('pending')).length,
            created: trips.filter(t => t.status.toLowerCase() === 'created').length
        }
    };
}

//=============================================================================
// UI LAYER - Styles and Components
//=============================================================================

export const STYLES = `
    #c1t-fab {
        position: fixed !important;
        bottom: 24px !important;
        right: 24px !important;
        width: 56px !important;
        height: 56px !important;
        min-width: 56px !important;
        max-width: 56px !important;
        min-height: 56px !important;
        max-height: 56px !important;
        box-sizing: border-box !important;
        padding: 0 !important;
        margin: 0 !important;
        border-radius: 28px !important;
        background: linear-gradient(135deg, #1a237e, #3949ab) !important;
        color: white !important;
        border: none !important;
        cursor: pointer !important;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3) !important;
        z-index: 2147483647 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        font-size: 24px !important;
        line-height: 1 !important;
        transition: transform 0.2s, box-shadow 0.2s !important;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
    }
    #c1t-fab:hover {
        transform: scale(1.1) !important;
        box-shadow: 0 6px 16px rgba(0,0,0,0.4) !important;
    }
    #c1t-fab.has-data {
        background: linear-gradient(135deg, #2e7d32, #4caf50) !important;
    }
    #c1t-fab .badge {
        position: absolute !important;
        top: -4px !important;
        right: -4px !important;
        background: #f44336 !important;
        color: white !important;
        font-size: 11px !important;
        font-weight: 600 !important;
        padding: 2px 6px !important;
        border-radius: 10px !important;
        min-width: 18px !important;
        text-align: center !important;
    }

    #c1t-overlay {
        position: fixed !important;
        inset: 0 !important;
        background: rgba(0,0,0,0.6) !important;
        z-index: 2147483647 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        opacity: 0 !important;
        visibility: hidden !important;
        transition: opacity 0.2s, visibility 0.2s !important;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
    }
    #c1t-overlay.open {
        opacity: 1 !important;
        visibility: visible !important;
    }

    #c1t-modal {
        background: linear-gradient(135deg, #1a237e, #3949ab) !important;
        color: white !important;
        border-radius: 16px !important;
        box-shadow: 0 8px 32px rgba(0,0,0,0.4) !important;
        width: 90% !important;
        max-width: 900px !important;
        max-height: 80vh !important;
        display: flex !important;
        flex-direction: column !important;
        transform: scale(0.9) !important;
        transition: transform 0.2s !important;
    }
    #c1t-overlay.open #c1t-modal {
        transform: scale(1) !important;
    }

    #c1t-header {
        padding: 20px !important;
        border-bottom: 1px solid rgba(255,255,255,0.1) !important;
        display: flex !important;
        align-items: center !important;
        justify-content: space-between !important;
        flex-shrink: 0 !important;
    }
    #c1t-header h2 {
        margin: 0 !important;
        font-size: 20px !important;
        font-weight: 600 !important;
        color: white !important;
    }
    #c1t-close {
        background: rgba(255,255,255,0.2) !important;
        border: none !important;
        color: white !important;
        width: 32px !important;
        height: 32px !important;
        min-width: 32px !important;
        max-width: 32px !important;
        border-radius: 16px !important;
        cursor: pointer !important;
        font-size: 18px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        padding: 0 !important;
        box-sizing: border-box !important;
    }
    #c1t-close:hover {
        background: rgba(255,255,255,0.3) !important;
    }

    #c1t-stats {
        padding: 15px 20px !important;
        background: rgba(0,0,0,0.15) !important;
        font-size: 14px !important;
        flex-shrink: 0 !important;
    }
    #c1t-stats .stat {
        display: inline-block !important;
        margin-right: 20px !important;
    }
    #c1t-stats strong {
        color: #69f0ae !important;
    }

    #c1t-filters {
        padding: 10px 20px !important;
        display: flex !important;
        gap: 8px !important;
        flex-wrap: wrap !important;
        flex-shrink: 0 !important;
    }
    .c1t-filter-btn {
        background: rgba(255,255,255,0.15) !important;
        border: 1px solid rgba(255,255,255,0.2) !important;
        color: white !important;
        padding: 6px 12px !important;
        border-radius: 6px !important;
        cursor: pointer !important;
        font-size: 12px !important;
        transition: background 0.15s !important;
    }
    .c1t-filter-btn:hover {
        background: rgba(255,255,255,0.25) !important;
    }
    .c1t-filter-btn.active {
        background: rgba(255,255,255,0.35) !important;
        font-weight: 600 !important;
    }

    #c1t-table-wrap {
        flex: 1 !important;
        overflow-y: auto !important;
        padding: 0 20px 20px !important;
    }
    #c1t-table {
        width: 100% !important;
        border-collapse: collapse !important;
        font-size: 13px !important;
    }
    #c1t-table th {
        text-align: left !important;
        padding: 12px 8px !important;
        border-bottom: 2px solid rgba(255,255,255,0.2) !important;
        font-weight: 600 !important;
        position: sticky !important;
        top: 0 !important;
        background: #2c3590 !important;
        color: white !important;
    }
    #c1t-table th.r { text-align: right !important; }
    #c1t-table th.c { text-align: center !important; }
    #c1t-table td {
        padding: 10px 8px !important;
        border-bottom: 1px solid rgba(255,255,255,0.08) !important;
        color: white !important;
    }
    #c1t-table td.r { text-align: right !important; }
    #c1t-table td.c { text-align: center !important; }
    #c1t-table tr.amt {
        background: rgba(76, 175, 80, 0.35) !important;
    }
    #c1t-table tr.tracked {
        background: rgba(76, 175, 80, 0.18) !important;
    }
    .c1t-status {
        display: inline-block !important;
        padding: 3px 8px !important;
        border-radius: 4px !important;
        font-size: 11px !important;
        font-weight: 500 !important;
        color: white !important;
    }
    .c1t-status.pending-good { background: #4caf50 !important; }
    .c1t-status.pending-uncertain { background: #ff9800 !important; }
    .c1t-status.completed { background: #2e7d32 !important; }
    .c1t-status.created { background: #ff9800 !important; }
    .c1t-status.canceled { background: #f44336 !important; }
    .c1t-status.adjusted { background: #2196f3 !important; }
    .c1t-credit { color: #69f0ae !important; font-weight: 600 !important; }
    .c1t-amount { font-weight: 600 !important; }

    #c1t-footer {
        padding: 15px 20px !important;
        border-top: 1px solid rgba(255,255,255,0.1) !important;
        flex-shrink: 0 !important;
    }
    #c1t-footer details {
        font-size: 13px !important;
        color: white !important;
    }
    #c1t-footer summary {
        cursor: pointer !important;
        opacity: 0.8 !important;
    }
    #c1t-footer pre {
        background: rgba(0,0,0,0.3) !important;
        padding: 12px !important;
        border-radius: 8px !important;
        overflow: auto !important;
        max-height: 200px !important;
        font-size: 11px !important;
        margin-top: 10px !important;
        color: white !important;
    }

    #c1t-loading {
        padding: 40px !important;
        text-align: center !important;
        opacity: 0.8 !important;
        color: white !important;
    }

    #c1t-content {
        display: flex !important;
        flex-direction: column !important;
        flex: 1 !important;
        min-height: 0 !important;
        overflow: hidden !important;
    }
`;

export function formatCurrency(amount) {
    if (amount === null || amount === undefined || amount === 0) return '—';
    return '$' + Number(amount).toFixed(2);
}

export function formatDate(dateStr) {
    if (!dateStr) return '—';
    try {
        return new Date(dateStr).toLocaleDateString();
    } catch {
        return '—';
    }
}

export function escapeHtml(str) {
    if (str == null) return '';
    const div = document.createElement('div');
    div.textContent = String(str);
    return div.innerHTML;
}

export function getStatusClass(status) {
    const s = (status || '').toLowerCase();
    if (s.includes('completed')) return 'completed';
    if (s === 'pending ✓') return 'pending-good';
    if (s === 'pending ?') return 'pending-uncertain';
    if (s.includes('pending')) return 'pending-uncertain';
    if (s.includes('created')) return 'created';
    if (s.includes('cancel')) return 'canceled';
    if (s.includes('adjust')) return 'adjusted';
    return '';
}

export function createUI({ onOpen, processedData: initialData }) {
    let stylesInjected = false;
    let currentData = initialData; // Mutable reference to current data

    function ensureStyles() {
        if (stylesInjected && document.getElementById('c1t-styles')) return;

        let styleEl = document.getElementById('c1t-styles');
        if (!styleEl) {
            styleEl = document.createElement('style');
            styleEl.id = 'c1t-styles';
            styleEl.textContent = STYLES;
            (document.head || document.documentElement).appendChild(styleEl);
        }
        stylesInjected = true;
    }

    function ensureFab() {
        ensureStyles();

        let fab = document.getElementById('c1t-fab');
        if (fab) return fab;

        fab = document.createElement('button');
        fab.id = 'c1t-fab';
        fab.innerHTML = '📋';
        fab.title = 'Shopping Trips Tracker';

        fab.addEventListener('click', async () => {
            ensureOverlay();
            const overlay = document.getElementById('c1t-overlay');
            if (overlay) overlay.classList.add('open');

            // If we don't have data, trigger fetch and wait for it
            if (!currentData && onOpen) {
                await onOpen();
                // Re-render after data arrives
                if (currentData) {
                    renderDataToModal(overlay, currentData);
                }
            }
        });

        document.body.appendChild(fab);

        if (currentData) {
            updateFabState(fab, currentData);
        }

        return fab;
    }

    function ensureOverlay() {
        ensureStyles();

        let overlay = document.getElementById('c1t-overlay');
        let isNew = false;

        console.log('[C1 Tracker] ensureOverlay - existing:', !!overlay, 'currentData:', !!currentData, 'stats:', currentData?.stats);

        if (!overlay) {
            isNew = true;
            overlay = document.createElement('div');
            overlay.id = 'c1t-overlay';
            overlay.innerHTML = `
                <div id="c1t-modal">
                    <div id="c1t-header">
                        <h2>📋 Shopping Trips Tracker</h2>
                        <button id="c1t-close">✕</button>
                    </div>
                    <div id="c1t-content">
                        <div id="c1t-loading">Waiting for data... Navigate to Shopping Trips page and data will load automatically.</div>
                    </div>
                </div>
            `;
            document.body.appendChild(overlay);

            overlay.querySelector('#c1t-close').addEventListener('click', () => overlay.classList.remove('open'));
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) overlay.classList.remove('open');
            });
        }

        // Always render data if we have it (handles case where data arrived after overlay was created)
        console.log('[C1 Tracker] ensureOverlay - isNew:', isNew, 'currentData:', !!currentData, 'stats:', currentData?.stats);
        if (currentData) {
            renderDataToModal(overlay, currentData);
        }

        return overlay;
    }

    function updateFabState(fab, data) {
        if (!data) return;

        fab.classList.add('has-data');
        if (data.stats.withCredit > 0) {
            fab.innerHTML = `📋<span class="badge">${data.stats.withCredit}</span>`;
        } else {
            fab.innerHTML = '📋';
        }
    }

    function renderDataToModal(overlay, data) {
        console.log('[C1 Tracker] renderDataToModal called - data:', !!data, 'overlay:', !!overlay);
        if (!data) return;

        const { trips, stats } = data;
        const content = overlay.querySelector('#c1t-content');
        console.log('[C1 Tracker] renderDataToModal - content element:', !!content, 'trips:', trips?.length);
        if (!content) return;

        content.innerHTML = `
            <div id="c1t-stats">
                <span class="stat"><strong>${stats.total}</strong> total</span>
                <span class="stat"><strong>${stats.withOrderId}</strong> tracked</span>
                <span class="stat"><strong>${stats.withAmount}</strong> with amount</span>
                <span class="stat"><strong>${stats.withCredit}</strong> with cashback</span>
            </div>
            <div id="c1t-filters">
                <button class="c1t-filter-btn active" data-filter="all">All (${stats.total})</button>
                <button class="c1t-filter-btn" data-filter="amount">With Amount (${stats.withAmount})</button>
                <button class="c1t-filter-btn" data-filter="tracked">Tracked (${stats.withOrderId})</button>
                <button class="c1t-filter-btn" data-filter="pending">Pending (${stats.pending})</button>
                <button class="c1t-filter-btn" data-filter="created">Waiting (${stats.created})</button>
            </div>
            <div id="c1t-table-wrap">
                <table id="c1t-table">
                    <thead>
                        <tr>
                            <th>Merchant</th>
                            <th class="c">Date</th>
                            <th class="r">Order</th>
                            <th class="r">Cash Back</th>
                            <th class="c">Status</th>
                            <th class="c">Tracked</th>
                        </tr>
                    </thead>
                    <tbody id="c1t-tbody">
                        ${trips.map(t => {
                            const rowClass = t.hasCreditAmount ? 'amt' : (t.hasOrderId ? 'tracked' : '');
                            const statusClass = getStatusClass(t.status);
                            return `
                                <tr class="${rowClass}" data-filter-amount="${t.hasAmount}" data-filter-tracked="${t.hasOrderId}" data-filter-pending="${t.status.toLowerCase().includes('pending')}" data-filter-created="${t.status.toLowerCase() === 'created'}">
                                    <td title="${escapeHtml(t.domain)}">${escapeHtml(t.merchant)}</td>
                                    <td class="c">${formatDate(t.date)}</td>
                                    <td class="r ${t.hasAmount ? 'c1t-amount' : ''}">${formatCurrency(t.orderAmount)}</td>
                                    <td class="r ${t.hasCreditAmount ? 'c1t-credit' : ''}">${formatCurrency(t.creditAmount)}</td>
                                    <td class="c"><span class="c1t-status ${statusClass}">${escapeHtml(t.status)}</span></td>
                                    <td class="c">${t.hasOrderId ? '✓' : '—'}</td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
            <div id="c1t-footer">
                <details>
                    <summary>Show Raw JSON</summary>
                    <pre>${escapeHtml(JSON.stringify(trips.slice(0, 30).map(t => t.raw), null, 2))}${trips.length > 30 ? '\n\n... and ' + (trips.length - 30) + ' more' : ''}</pre>
                </details>
            </div>
        `;

        content.querySelectorAll('.c1t-filter-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                content.querySelectorAll('.c1t-filter-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');

                const filter = this.dataset.filter;
                content.querySelectorAll('#c1t-tbody tr').forEach(row => {
                    if (filter === 'all') {
                        row.style.display = '';
                    } else {
                        const key = `filter${filter.charAt(0).toUpperCase() + filter.slice(1)}`;
                        row.style.display = row.dataset[key] === 'true' ? '' : 'none';
                    }
                });
            });
        });
    }

    // Escape key handler
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const overlay = document.getElementById('c1t-overlay');
            if (overlay) overlay.classList.remove('open');
        }
    });

    return {
        ensureStyles,
        ensureFab,
        ensureOverlay,
        updateFabState,
        renderDataToModal,
        updateData(data) {
            console.log('[C1 Tracker] updateData called with stats:', data?.stats);
            currentData = data; // Update the mutable reference
            const fab = document.getElementById('c1t-fab');
            if (fab) updateFabState(fab, data);
            const overlay = document.getElementById('c1t-overlay');
            if (overlay) renderDataToModal(overlay, data);
        }
    };
}
