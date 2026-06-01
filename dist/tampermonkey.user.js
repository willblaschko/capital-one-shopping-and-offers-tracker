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

"use strict";
(() => {
  // src/core.ts
  var CONFIG = {
    offers: {
      hostname: "capitaloneoffers",
      pages: { trips: "/c1-offers/shopping-trips", browse: "/feed" },
      trips: {
        apiPattern: (url) => url.includes("shopping-trips") && url.includes("version=2") && url.includes("_data="),
        apiEndpoint: "/c1-offers/shopping-trips?limit=300&offset=0&version=2&_data=routes%2Fc1-offers.shopping-trips"
      },
      browse: {
        apiPattern: (url) => url.includes("/feed/") && url.includes("viewInstanceId=")
      }
    },
    shopping: {
      hostname: "capitaloneshopping",
      pages: { trips: "/account-settings/shopping-trips", browse: "/" },
      trips: {
        apiPattern: (url) => url.includes("/api/v1/trip_orders"),
        apiEndpoint: "/api/v1/trip_orders"
      },
      browse: {
        apiPattern: (url) => url.endsWith("/api/v1/feed"),
        apiEndpoint: "/api/v1/feed"
      }
    }
  };
  function getCurrentSite() {
    if (window.location.hostname.includes("capitaloneoffers")) return "offers";
    if (window.location.hostname.includes("capitaloneshopping")) return "shopping";
    return null;
  }
  function detectMode() {
    const site = getCurrentSite();
    if (!site) return null;
    const p = window.location.pathname;
    const pages = CONFIG[site].pages;
    if (p.startsWith(pages.trips)) return "trips";
    if (site === "shopping" && (p === "/" || p === "")) return "browse";
    if (site === "offers" && p.startsWith(pages.browse)) return "browse";
    return null;
  }
  function extractTripsArray(data) {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    const obj = data;
    if (Array.isArray(obj.items)) return obj.items;
    if (Array.isArray(obj.shoppingTrips)) return obj.shoppingTrips;
    if (Array.isArray(obj.trip_orders)) return obj.trip_orders;
    if (obj.data && Array.isArray(obj.data)) return obj.data;
    if (obj.data && typeof obj.data === "object" && Array.isArray(obj.data.items)) {
      return obj.data.items;
    }
    return [];
  }
  function normalizeTrip(raw) {
    const orderAmount = raw.orderAmount ?? raw.order_amount ?? (raw.trxnTotalCents != null ? raw.trxnTotalCents / 100 : null);
    const creditAmount = raw.creditAmount ?? raw.credit_amount ?? (raw.payoutAmountCents != null ? raw.payoutAmountCents / 100 : null);
    const orderId = raw.orderId ?? raw.order_id ?? null;
    const hasCreditAmount = creditAmount !== null && Number(creditAmount) > 0;
    let rawStatus = raw.status ?? "Unknown";
    if (rawStatus === "Waiting") rawStatus = "Created";
    else if (rawStatus === "Inactive") rawStatus = "Canceled";
    let displayStatus = rawStatus;
    if (hasCreditAmount && rawStatus.toLowerCase() === "canceled") {
      displayStatus = "Completed";
    } else if (rawStatus.toLowerCase() === "pending") {
      displayStatus = hasCreditAmount ? "Pending \u2713" : "Pending ?";
    }
    return {
      id: raw.id ?? raw.tripId ?? raw.activatedOfferId ?? null,
      tripId: raw.tripId ?? raw.trip_id ?? raw.id ?? raw.activatedOfferId ?? null,
      orderId,
      merchant: raw.vendor ?? raw.merchantName ?? raw.merchantDisplayName ?? raw.merchant ?? raw.domain ?? "Unknown",
      domain: raw.domain ?? null,
      status: displayStatus,
      rawStatus,
      orderAmount: orderAmount !== null ? Number(orderAmount) : null,
      creditAmount: creditAmount !== null ? Number(creditAmount) : null,
      date: raw.createdAt ?? raw.created_at ?? raw.clickDate ?? raw.date ?? null,
      hasOrderId: orderId !== null,
      hasAmount: orderAmount !== null && Number(orderAmount) > 0,
      hasCreditAmount,
      raw
    };
  }
  function processTripsData(rawData) {
    const rawTrips = extractTripsArray(rawData);
    const trips = rawTrips.map(normalizeTrip);
    return {
      trips,
      stats: {
        total: trips.length,
        withOrderId: trips.filter((t) => t.hasOrderId).length,
        withAmount: trips.filter((t) => t.hasAmount).length,
        withCredit: trips.filter((t) => t.hasCreditAmount).length,
        pending: trips.filter(
          (t) => t.status.toLowerCase().includes("pending")
        ).length,
        created: trips.filter((t) => t.status.toLowerCase() === "created").length
      }
    };
  }
  var STYLES = `
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

    /* Browse mode */
    #c1t-browse-search {
        padding: 12px 20px 8px !important;
        display: flex !important;
        gap: 8px !important;
        flex-shrink: 0 !important;
    }
    #c1t-browse-search input {
        flex: 1 !important;
        padding: 8px 12px !important;
        border-radius: 6px !important;
        border: 1px solid rgba(255,255,255,0.25) !important;
        background: rgba(0,0,0,0.2) !important;
        color: white !important;
        font-size: 13px !important;
        font-family: inherit !important;
    }
    #c1t-browse-search input::placeholder { color: rgba(255,255,255,0.55) !important; }
    #c1t-browse-search button {
        background: rgba(255,255,255,0.15) !important;
        border: 1px solid rgba(255,255,255,0.2) !important;
        color: white !important;
        padding: 0 12px !important;
        border-radius: 6px !important;
        cursor: pointer !important;
        font-size: 12px !important;
    }
    #c1t-browse-nav {
        padding: 4px 20px 10px !important;
        display: flex !important;
        gap: 6px !important;
        flex-wrap: wrap !important;
        flex-shrink: 0 !important;
    }
    .c1t-jump-chip {
        background: rgba(255,255,255,0.15) !important;
        border: 1px solid rgba(255,255,255,0.2) !important;
        color: white !important;
        padding: 4px 10px !important;
        border-radius: 12px !important;
        cursor: pointer !important;
        font-size: 11px !important;
    }
    .c1t-jump-chip:hover { background: rgba(255,255,255,0.25) !important; }
    #c1t-browse-stats {
        padding: 8px 20px !important;
        font-size: 13px !important;
        opacity: 0.85 !important;
        flex-shrink: 0 !important;
    }
    #c1t-browse-body {
        flex: 1 !important;
        overflow-y: auto !important;
        padding: 0 20px 20px !important;
    }
    .c1t-bucket {
        margin-bottom: 10px !important;
        background: rgba(0,0,0,0.15) !important;
        border-radius: 8px !important;
    }
    .c1t-bucket > summary {
        padding: 10px 14px !important;
        cursor: pointer !important;
        font-weight: 600 !important;
        font-size: 14px !important;
        list-style: none !important;
        user-select: none !important;
        display: flex !important;
        align-items: center !important;
        gap: 8px !important;
    }
    .c1t-bucket > summary::-webkit-details-marker { display: none !important; }
    .c1t-bucket > summary::before {
        content: '\u25B6' !important;
        font-size: 10px !important;
        transition: transform 0.15s !important;
        opacity: 0.7 !important;
    }
    .c1t-bucket[open] > summary::before { transform: rotate(90deg) !important; }
    .c1t-bucket-count {
        opacity: 0.7 !important;
        font-weight: 400 !important;
        font-size: 12px !important;
    }
    .c1t-bucket table {
        width: 100% !important;
        border-collapse: collapse !important;
        font-size: 13px !important;
    }
    .c1t-bucket th {
        text-align: left !important;
        padding: 8px !important;
        border-bottom: 1px solid rgba(255,255,255,0.15) !important;
        font-weight: 600 !important;
        font-size: 11px !important;
        opacity: 0.75 !important;
        text-transform: uppercase !important;
        letter-spacing: 0.05em !important;
    }
    .c1t-bucket td {
        padding: 8px !important;
        border-bottom: 1px solid rgba(255,255,255,0.06) !important;
    }
    .c1t-row-click { cursor: pointer !important; }
    .c1t-row-click:hover { background: rgba(255,255,255,0.08) !important; }
    .c1t-reward { font-weight: 600 !important; color: #69f0ae !important; }
    .c1t-pill {
        display: inline-block !important;
        padding: 2px 7px !important;
        border-radius: 10px !important;
        font-size: 10px !important;
        font-weight: 500 !important;
        background: rgba(255,255,255,0.2) !important;
    }
    .c1t-pill.event { background: #4caf50 !important; }
    .c1t-pill.deal { background: #ffb300 !important; color: #222 !important; }
    .c1t-pill.new { background: #2196f3 !important; }
    .c1t-pill.retarget { background: #9c27b0 !important; }
    .c1t-excl-cell {
        font-size: 11px !important;
        opacity: 0.7 !important;
        display: flex !important;
        align-items: baseline !important;
        gap: 4px !important;
        max-width: 280px !important;
    }
    .c1t-excl-cell .c1t-excl-text {
        flex: 1 1 auto !important;
        min-width: 0 !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
        white-space: nowrap !important;
    }
    .c1t-excl-cell.c1t-excl-expanded {
        max-width: 420px !important;
        align-items: flex-start !important;
    }
    .c1t-excl-cell.c1t-excl-expanded .c1t-excl-text {
        white-space: normal !important;
        text-overflow: clip !important;
        overflow: visible !important;
    }
    .c1t-excl-toggle {
        flex: 0 0 auto !important;
        background: none !important;
        border: none !important;
        padding: 0 !important;
        color: inherit !important;
        opacity: 0.9 !important;
        cursor: pointer !important;
        font: inherit !important;
        text-decoration: underline !important;
    }
    .c1t-excl-toggle:hover { opacity: 1 !important; }
    .c1t-event-end {
        font-size: 11px !important;
        opacity: 0.8 !important;
        white-space: nowrap !important;
    }
    #c1t-browse-footer {
        padding: 8px 20px !important;
        font-size: 11px !important;
        opacity: 0.7 !important;
        border-top: 1px solid rgba(255,255,255,0.1) !important;
        flex-shrink: 0 !important;
    }
`;
  function formatCurrency(amount) {
    if (amount === null || amount === void 0 || amount === 0) return "\u2014";
    return "$" + Number(amount).toFixed(2);
  }
  function formatDate(dateStr) {
    if (!dateStr) return "\u2014";
    try {
      return new Date(dateStr).toLocaleDateString();
    } catch {
      return "\u2014";
    }
  }
  function escapeHtml(str) {
    if (str == null) return "";
    const div = document.createElement("div");
    div.textContent = String(str);
    return div.innerHTML;
  }
  function getStatusClass(status) {
    const s = (status || "").toLowerCase();
    if (s.includes("completed")) return "completed";
    if (s === "pending \u2713") return "pending-good";
    if (s === "pending ?") return "pending-uncertain";
    if (s.includes("pending")) return "pending-uncertain";
    if (s.includes("created")) return "created";
    if (s.includes("cancel")) return "canceled";
    if (s.includes("adjust")) return "adjusted";
    return "";
  }
  var renderTripsToModal = (overlay, data) => {
    console.log(
      "[C1 Tracker] renderTripsToModal called - data:",
      !!data,
      "overlay:",
      !!overlay
    );
    if (!data) return;
    const { trips, stats } = data;
    const content = overlay.querySelector("#c1t-content");
    console.log(
      "[C1 Tracker] renderTripsToModal - content element:",
      !!content,
      "trips:",
      trips?.length
    );
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
                    ${trips.map((t) => {
      const rowClass = t.hasCreditAmount ? "amt" : t.hasOrderId ? "tracked" : "";
      const statusClass = getStatusClass(t.status);
      return `
                                <tr class="${rowClass}" data-filter-amount="${t.hasAmount}" data-filter-tracked="${t.hasOrderId}" data-filter-pending="${t.status.toLowerCase().includes("pending")}" data-filter-created="${t.status.toLowerCase() === "created"}">
                                    <td title="${escapeHtml(t.domain)}">${escapeHtml(t.merchant)}</td>
                                    <td class="c">${formatDate(t.date)}</td>
                                    <td class="r ${t.hasAmount ? "c1t-amount" : ""}">${formatCurrency(t.orderAmount)}</td>
                                    <td class="r ${t.hasCreditAmount ? "c1t-credit" : ""}">${formatCurrency(t.creditAmount)}</td>
                                    <td class="c"><span class="c1t-status ${statusClass}">${escapeHtml(t.status)}</span></td>
                                    <td class="c">${t.hasOrderId ? "\u2713" : "\u2014"}</td>
                                </tr>
                            `;
    }).join("")}
                </tbody>
            </table>
        </div>
        <div id="c1t-footer">
            <details>
                <summary>Show Raw JSON</summary>
                <pre>${escapeHtml(
      JSON.stringify(
        trips.slice(0, 30).map((t) => t.raw),
        null,
        2
      )
    )}${trips.length > 30 ? "\n\n... and " + (trips.length - 30) + " more" : ""}</pre>
            </details>
        </div>
    `;
    content.querySelectorAll(".c1t-filter-btn").forEach((btn) => {
      btn.addEventListener("click", function() {
        content.querySelectorAll(".c1t-filter-btn").forEach((b) => b.classList.remove("active"));
        this.classList.add("active");
        const filter = this.dataset.filter;
        content.querySelectorAll("#c1t-tbody tr").forEach((row) => {
          if (filter === "all") {
            row.style.display = "";
          } else if (filter) {
            const key = `filter${filter.charAt(0).toUpperCase() + filter.slice(1)}`;
            row.style.display = row.dataset[key] === "true" ? "" : "none";
          }
        });
      });
    });
  };
  function createUI(options) {
    const {
      onOpen,
      processedData: initialData,
      render,
      getBadgeCount,
      title = "Shopping Trips Tracker",
      loadingText = "Waiting for data... Navigate to Shopping Trips page and data will load automatically."
    } = options;
    let stylesInjected = false;
    let currentData = initialData;
    function ensureStyles() {
      if (stylesInjected && document.getElementById("c1t-styles")) return;
      let styleEl = document.getElementById("c1t-styles");
      if (!styleEl) {
        styleEl = document.createElement("style");
        styleEl.id = "c1t-styles";
        styleEl.textContent = STYLES;
        (document.head || document.documentElement).appendChild(styleEl);
      }
      stylesInjected = true;
    }
    function ensureFab() {
      ensureStyles();
      const existing = document.getElementById("c1t-fab");
      if (existing) return existing;
      const fab = document.createElement("button");
      fab.id = "c1t-fab";
      fab.innerHTML = "\u{1F4CB}";
      fab.title = title;
      fab.addEventListener("click", async () => {
        const overlay = ensureOverlay();
        overlay.classList.add("open");
        if (!currentData && onOpen) {
          await onOpen();
          if (currentData) {
            render(overlay, currentData);
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
      let overlay = document.getElementById("c1t-overlay");
      let isNew = false;
      console.log(
        "[C1 Tracker] ensureOverlay - existing:",
        !!overlay,
        "currentData:",
        !!currentData
      );
      if (!overlay) {
        isNew = true;
        overlay = document.createElement("div");
        overlay.id = "c1t-overlay";
        overlay.innerHTML = `
                <div id="c1t-modal">
                    <div id="c1t-header">
                        <h2>\u{1F4CB} ${escapeHtml(title)}</h2>
                        <button id="c1t-close">\u2715</button>
                    </div>
                    <div id="c1t-content">
                        <div id="c1t-loading">${escapeHtml(loadingText)}</div>
                    </div>
                </div>
            `;
        document.body.appendChild(overlay);
        const overlayEl = overlay;
        const closeBtn = overlayEl.querySelector("#c1t-close");
        if (closeBtn) {
          closeBtn.addEventListener(
            "click",
            () => overlayEl.classList.remove("open")
          );
        }
        overlayEl.addEventListener("click", (e) => {
          if (e.target === overlayEl) overlayEl.classList.remove("open");
        });
      }
      console.log(
        "[C1 Tracker] ensureOverlay - isNew:",
        isNew,
        "currentData:",
        !!currentData
      );
      if (currentData) {
        render(overlay, currentData);
      }
      return overlay;
    }
    function updateFabState(fab, data) {
      if (!data) return;
      fab.classList.add("has-data");
      const count = getBadgeCount(data);
      if (count > 0) {
        fab.innerHTML = `\u{1F4CB}<span class="badge">${count}</span>`;
      } else {
        fab.innerHTML = "\u{1F4CB}";
      }
    }
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        const overlay = document.getElementById("c1t-overlay");
        if (overlay) overlay.classList.remove("open");
      }
    });
    return {
      ensureStyles,
      ensureFab,
      ensureOverlay,
      updateFabState,
      updateData(data) {
        console.log("[C1 Tracker] updateData called");
        currentData = data;
        const fab = document.getElementById("c1t-fab");
        if (fab) updateFabState(fab, data);
        const overlay = document.getElementById("c1t-overlay");
        if (overlay) render(overlay, data);
      }
    };
  }

  // src/browse.ts
  var MULTIPLIER_RE = /(\d+(?:\.\d+)?)X/i;
  var PERCENT_RE = /(\d+(?:\.\d+)?)%/;
  var FIXED_CASH_RE = /\$([\d,]+(?:\.\d+)?)/;
  var FIXED_POINTS_RE = /([\d,]+)\s*(miles|points)/i;
  function parseRewardDisplay(str) {
    const display = String(str ?? "");
    const s = display.trim();
    if (!s) return { type: "unknown", value: 0, display };
    const mMult = s.match(MULTIPLIER_RE);
    if (mMult && mMult[1] !== void 0) {
      return { type: "multiplier", value: parseFloat(mMult[1]), display };
    }
    const mCash = s.match(FIXED_CASH_RE);
    if (mCash && mCash[1] !== void 0) {
      return { type: "fixed-cash", value: parseFloat(mCash[1].replace(/,/g, "")), display };
    }
    const mPts = s.match(FIXED_POINTS_RE);
    if (mPts && mPts[1] !== void 0) {
      return { type: "fixed-points", value: parseFloat(mPts[1].replace(/,/g, "")), display };
    }
    const mPct = s.match(PERCENT_RE);
    if (mPct && mPct[1] !== void 0) {
      return { type: "percent", value: parseFloat(mPct[1]), display };
    }
    return { type: "unknown", value: 0, display };
  }
  function pickShoppingRewardDisplay(item) {
    const stats = item.stats ?? {};
    return stats.cashbackV2 ?? stats.cashback ?? stats.cashbackAmount ?? "";
  }
  function maxCutTier(categories) {
    if (!categories || !categories.length) return null;
    let best = null;
    for (const cat of categories) {
      const parsed = parseRewardDisplay(cat.cashback);
      if (parsed.value > 0) {
        if (!best || parsed.value > best.value) {
          best = { value: parsed.value, display: cat.cashback };
        }
      }
    }
    return best;
  }
  function shoppingBucketCategory(itemType) {
    switch (itemType) {
      case "great_deal":
        return "price-drops";
      case "event_placement":
        return "events";
      case "nca_deal":
        return "new-customer";
      case "retarget":
      case "retarget_non_product":
        return "recently-viewed";
      default:
        return "value";
    }
  }
  function normalizeShoppingOffer(raw) {
    if (!raw.href) return null;
    const merchant = raw.merchantName ?? "";
    const domain = raw.domain ?? "";
    if (!merchant && !domain) return null;
    const stats = raw.stats ?? {};
    const isCut = stats.isCutType === true || stats.rewardType === "cut";
    let rewardType;
    let rewardValue;
    let rewardDisplay;
    if (isCut) {
      const best = maxCutTier(stats.cashbackCategories);
      if (best) {
        rewardType = "percent";
        rewardValue = best.value;
        const trimmedDisplay = best.display.trim();
        rewardDisplay = trimmedDisplay.toLowerCase().startsWith("up to") ? trimmedDisplay : "Up to " + trimmedDisplay;
      } else {
        const parsed = parseRewardDisplay(pickShoppingRewardDisplay(raw));
        rewardType = parsed.type;
        rewardValue = parsed.value;
        rewardDisplay = parsed.display.toLowerCase().startsWith("up to") ? parsed.display : parsed.value ? "Up to " + parsed.display : parsed.display;
      }
    } else {
      const parsed = parseRewardDisplay(pickShoppingRewardDisplay(raw));
      rewardType = parsed.type;
      rewardValue = parsed.value;
      rewardDisplay = parsed.display;
    }
    const activation = { method: "href", url: raw.href };
    const bucketCategory = shoppingBucketCategory(raw.type);
    const rawId = raw.id ?? null;
    const id = rawId !== null ? String(rawId) : `shopping|${merchant || domain}|${rewardDisplay}|${raw.type}`;
    return {
      id,
      source: "shopping",
      itemType: raw.type,
      merchant: merchant || domain,
      domain: domain || merchant,
      rewardType,
      rewardValue,
      rewardDisplay,
      activation,
      bucketCategory,
      pill: raw.pill?.text ?? null,
      exclusions: stats.exclusionsText ?? "",
      eventEnd: raw.end ?? null,
      priceHistory: stats.priceHistory ?? null,
      raw
    };
  }
  function offersActivationUrl(ctx, tileId) {
    return `https://capitaloneoffers.com/feed/${encodeURIComponent(ctx.userId)}/offers/${tileId}?_data`;
  }
  function normalizeOffersFeedTile(raw, ctx) {
    if (raw.type === "Carousel") {
      const children = raw.tiles ?? [];
      const out = [];
      for (const child of children) {
        for (const o of normalizeOffersFeedTile(child, ctx)) out.push(o);
      }
      return out;
    }
    const tileId = raw.id;
    const merchantTLD = raw.merchantTLD;
    if (!tileId || !merchantTLD) return [];
    const buttonText = raw.buttonText ?? "";
    const parsed = parseRewardDisplay(buttonText);
    const description = raw.subText && raw.headingText ? `${raw.headingText} \u2014 ${raw.subText}` : raw.subText ?? raw.headingText ?? raw.text ?? "";
    return [
      {
        id: tileId,
        source: "offers",
        itemType: raw.type,
        merchant: merchantTLD,
        domain: merchantTLD,
        rewardType: parsed.type,
        rewardValue: parsed.value,
        rewardDisplay: parsed.display,
        activation: { method: "post-offers", url: offersActivationUrl(ctx, tileId) },
        bucketCategory: "value",
        pill: raw.badge?.text ?? null,
        exclusions: description,
        eventEnd: null,
        priceHistory: null,
        raw
      }
    ];
  }
  function bucketize(offer) {
    const v = offer.rewardValue;
    switch (offer.rewardType) {
      case "multiplier":
        if (v >= 30) return "mult-30";
        if (v >= 20) return "mult-20";
        if (v >= 10) return "mult-10";
        return "mult-1";
      case "percent":
      case "cut":
        if (v >= 40) return "pct-40";
        if (v >= 20) return "pct-20";
        if (v >= 10) return "pct-10";
        return "pct-1";
      case "fixed-cash":
        if (v >= 50) return "cash-50";
        if (v >= 25) return "cash-25";
        return "cash-0";
      case "fixed-points":
        if (v >= 1e4) return "pts-10k";
        if (v >= 5e3) return "pts-5k";
        if (v >= 1e3) return "pts-1k";
        return "pts-lt-1k";
      case "unknown":
      default:
        return "pct-1";
    }
  }
  var BUCKET_META = [
    { id: "mult-30", label: "Multipliers \xB7 30X+", group: "multiplier", initiallyOpen: true },
    { id: "mult-20", label: "Multipliers \xB7 20\u201329X", group: "multiplier", initiallyOpen: true },
    { id: "mult-10", label: "Multipliers \xB7 10\u201319X", group: "multiplier", initiallyOpen: false },
    { id: "mult-1", label: "Multipliers \xB7 1\u20139X", group: "multiplier", initiallyOpen: false },
    { id: "pct-40", label: "Percent \xB7 40%+", group: "percent", initiallyOpen: true },
    { id: "pct-20", label: "Percent \xB7 20\u201339%", group: "percent", initiallyOpen: true },
    { id: "pct-10", label: "Percent \xB7 10\u201319%", group: "percent", initiallyOpen: false },
    { id: "pct-1", label: "Percent \xB7 1\u20139%", group: "percent", initiallyOpen: false },
    { id: "cash-50", label: "Fixed Cash \xB7 $50+", group: "fixed-cash", initiallyOpen: true },
    { id: "cash-25", label: "Fixed Cash \xB7 $25\u201349", group: "fixed-cash", initiallyOpen: true },
    { id: "cash-0", label: "Fixed Cash \xB7 under $25", group: "fixed-cash", initiallyOpen: false },
    { id: "pts-10k", label: "Fixed Points \xB7 10,000+", group: "fixed-points", initiallyOpen: true },
    { id: "pts-5k", label: "Fixed Points \xB7 5,000\u20139,999", group: "fixed-points", initiallyOpen: true },
    { id: "pts-1k", label: "Fixed Points \xB7 1,000\u20134,999", group: "fixed-points", initiallyOpen: false },
    { id: "pts-lt-1k", label: "Fixed Points \xB7 under 1,000", group: "fixed-points", initiallyOpen: false }
  ];
  var BUCKET_META_BY_ID = (() => {
    const out = {};
    for (const m of BUCKET_META) out[m.id] = m;
    return out;
  })();
  function processBrowseData(offers) {
    const buckets = {};
    for (const o of offers) {
      const b = bucketize(o);
      (buckets[b] ?? (buckets[b] = [])).push(o);
    }
    for (const k of Object.keys(buckets)) {
      buckets[k].sort((a, b) => b.rewardValue - a.rewardValue);
    }
    const bucketOrder = [];
    const byBucket = {};
    for (const meta of BUCKET_META) {
      const arr = buckets[meta.id];
      if (arr && arr.length) {
        bucketOrder.push(meta.id);
        byBucket[meta.id] = arr.length;
      }
    }
    const stats = {
      total: offers.length,
      byBucket
    };
    return { offers, buckets, bucketOrder, stats };
  }
  async function walkFeed(cfg) {
    const maxPages = cfg.maxPages ?? 40;
    const seen = /* @__PURE__ */ new Set();
    const out = [];
    let cursor = null;
    let pages = 0;
    while (pages < maxPages) {
      const page = await cfg.fetchPage(cursor);
      if (!page) break;
      for (const it of cfg.getItems(page)) {
        const k = cfg.dedupeKey(it);
        if (k && seen.has(k)) continue;
        if (k) seen.add(k);
        out.push(it);
      }
      pages++;
      cfg.onPage?.(pages, out.length);
      const next = cfg.getNextCursor(page);
      if (!next) break;
      cursor = next;
    }
    return { items: out, hitCap: pages >= maxPages, pagesWalked: pages };
  }
  function shoppingFeedBody(cursor) {
    const pagination = { limit: 25 };
    if (cursor) pagination.nextPageToken = cursor;
    return JSON.stringify({
      contentProps: { pagination },
      context: {
        device: {
          model: typeof navigator !== "undefined" && /Mac/.test(navigator.platform) ? "Macintosh" : "Unknown",
          manufacturer: "Unknown",
          memory: "8",
          concurrency: String(
            typeof navigator !== "undefined" && navigator.hardwareConcurrency || 4
          )
        },
        browser: { name: "Chrome", version: "0", major: "0" },
        os: { name: "unknown", version: "0" },
        screen: { width: 1920, height: 1080, density: 2 },
        locale: typeof navigator !== "undefined" && navigator.language ? navigator.language : "en-US",
        country: "US",
        location: { state: "", zipcode: "", latitude: null, longitude: null, isInCensusData: false },
        page: {
          path: typeof window !== "undefined" ? window.location.pathname : "/",
          url: typeof window !== "undefined" ? window.location.href : "",
          referrer: typeof document !== "undefined" ? document.referrer : "",
          search: typeof window !== "undefined" ? window.location.search : "",
          title: typeof document !== "undefined" ? document.title : ""
        },
        userAgent: typeof navigator !== "undefined" ? navigator.userAgent : ""
      }
    });
  }
  function shoppingDedupeKey(item) {
    const anyItem = item;
    if (anyItem.id !== void 0 && anyItem.id !== null && anyItem.id !== "") {
      return String(anyItem.id);
    }
    const merch = item.merchantName ?? "";
    const reward = item.stats?.cashbackV2 ?? item.stats?.cashback ?? "";
    if (!merch && !reward) return null;
    return `${merch}|${reward}|${item.type}`;
  }
  async function walkShoppingFeed(onPage) {
    const cfg = {
      fetchPage: async (cursor) => {
        const r = await fetch("/api/v1/feed", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: shoppingFeedBody(cursor)
        });
        if (!r.ok) {
          console.warn("[C1 Tracker] shopping feed POST failed", {
            status: r.status,
            statusText: r.statusText,
            cursor
          });
          return null;
        }
        const page = await r.json();
        if (!cursor) {
          console.log("[C1 Tracker] shopping feed first page", {
            count: page.count,
            itemCount: page.items?.length ?? 0,
            nextPageToken: page.pagination?.nextPageToken
          });
        }
        return page;
      },
      getNextCursor: (page) => page.pagination?.nextPageToken ?? null,
      getItems: (page) => page.items ?? [],
      dedupeKey: shoppingDedupeKey,
      ...onPage ? { onPage } : {},
      maxPages: 40
    };
    const walked = await walkFeed(cfg);
    const offers = [];
    let dropped = 0;
    for (const it of walked.items) {
      const o = normalizeShoppingOffer(it);
      if (o) offers.push(o);
      else dropped++;
    }
    console.log("[C1 Tracker] shopping walk done", {
      rawItems: walked.items.length,
      normalized: offers.length,
      droppedDuringNormalize: dropped,
      pagesWalked: walked.pagesWalked,
      hitCap: walked.hitCap
    });
    return { items: offers, hitCap: walked.hitCap, pagesWalked: walked.pagesWalked };
  }
  function offersFeedUrl(ctx, cursor) {
    const base = `https://capitaloneoffers.com/feed/${encodeURIComponent(ctx.userId)}`;
    const params = `?numberOfColumnsInGrid=5&viewInstanceId=${ctx.viewInstanceId}&contentSlug=ease-web-l1`;
    return cursor ? `${base}${params}&cursor=${cursor}` : `${base}${params}`;
  }
  function offersDedupeKey(item) {
    const tld = item.merchantTLD ?? "";
    const bt = item.buttonText ?? "";
    if (tld && bt) return `${tld}|${bt}`;
    return item.id ?? null;
  }
  function flattenOffersTiles(tiles) {
    const out = [];
    for (const t of tiles) {
      if (t.type === "Carousel") {
        for (const child of t.tiles ?? []) out.push(child);
      } else {
        out.push(t);
      }
    }
    return out;
  }
  async function walkOffersFeed(ctx, onPage) {
    const cfg = {
      fetchPage: async (cursor) => {
        const r = await fetch(offersFeedUrl(ctx, cursor), {
          method: "GET",
          credentials: "include",
          headers: { Accept: "application/json" }
        });
        if (!r.ok) return null;
        return await r.json();
      },
      getNextCursor: (page) => page.cursor ?? null,
      getItems: (page) => flattenOffersTiles(page.data ?? []),
      dedupeKey: offersDedupeKey,
      ...onPage ? { onPage } : {},
      maxPages: 40
    };
    const walked = await walkFeed(cfg);
    const offers = [];
    for (const it of walked.items) {
      for (const o of normalizeOffersFeedTile(it, ctx)) offers.push(o);
    }
    return { items: offers, hitCap: walked.hitCap, pagesWalked: walked.pagesWalked };
  }
  function findKeyRecursive(obj, keys, depth = 0) {
    if (depth > 6 || obj === null || typeof obj !== "object") return null;
    const record = obj;
    for (const k of keys) {
      const v = record[k];
      if (typeof v === "string" && v.length > 0) return v;
    }
    for (const k of Object.keys(record)) {
      const child = record[k];
      if (child && typeof child === "object") {
        const found = findKeyRecursive(child, keys, depth + 1);
        if (found) return found;
      }
    }
    return null;
  }
  function getOffersBrowseContext() {
    let userId = null;
    let viewInstanceId = null;
    try {
      const params = new URLSearchParams(window.location.search);
      viewInstanceId = params.get("viewInstanceId");
    } catch {
    }
    const pathMatch = window.location.pathname.match(/^\/feed\/([^/?#]+)/);
    if (pathMatch && pathMatch[1]) userId = decodeURIComponent(pathMatch[1]);
    if (!userId || !viewInstanceId) {
      try {
        const el = document.getElementById("__NEXT_DATA__");
        if (el?.textContent) {
          const parsed = JSON.parse(el.textContent);
          if (!userId) userId = findKeyRecursive(parsed, ["userId", "accountReferenceId"]);
          if (!viewInstanceId) viewInstanceId = findKeyRecursive(parsed, ["viewInstanceId"]);
        }
      } catch {
      }
    }
    if (!viewInstanceId && userId) {
      try {
        if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
          viewInstanceId = crypto.randomUUID();
        }
      } catch {
      }
    }
    if (userId && viewInstanceId) return { userId, viewInstanceId };
    console.warn("[C1 Tracker] getOffersBrowseContext (sync) failed", {
      pathname: window.location.pathname,
      search: window.location.search,
      userId,
      viewInstanceId,
      hasNextData: !!document.getElementById("__NEXT_DATA__")
    });
    return null;
  }
  async function fetchOffersBrowseContext() {
    const sync = getOffersBrowseContext();
    if (sync) return sync;
    let userId = null;
    let viewInstanceId = null;
    try {
      const params = new URLSearchParams(window.location.search);
      viewInstanceId = params.get("viewInstanceId");
    } catch {
    }
    try {
      const r = await fetch(
        "/c1-offers/shopping-trips?limit=1&offset=0&version=2&_data=routes%2Fc1-offers.shopping-trips",
        { method: "POST", credentials: "include" }
      );
      if (r.ok) {
        const data = await r.json();
        if (Array.isArray(data) && data.length > 0 && typeof data[0]?.accountReferenceId === "string") {
          userId = data[0].accountReferenceId;
        }
      }
    } catch (e) {
      console.warn("[C1 Tracker] trips-API fallback for userId failed:", e);
    }
    if (!viewInstanceId && userId) {
      try {
        if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
          viewInstanceId = crypto.randomUUID();
        }
      } catch {
      }
    }
    if (userId && viewInstanceId) return { userId, viewInstanceId };
    console.warn("[C1 Tracker] fetchOffersBrowseContext failed", { userId, viewInstanceId });
    return null;
  }
  function pillClass(itemType, bucketCategory) {
    if (bucketCategory === "events") return "event";
    if (bucketCategory === "price-drops") return "deal";
    if (bucketCategory === "new-customer") return "new";
    if (bucketCategory === "recently-viewed") return "retarget";
    if (itemType === "great_deal") return "deal";
    return "";
  }
  function rowSearchString(o) {
    return `${o.merchant} ${o.domain} ${o.rewardDisplay} ${o.itemType} ${o.exclusions}`.toLowerCase();
  }
  function eventEndDisplay(iso) {
    if (!iso) return "";
    try {
      const d = new Date(iso);
      return d.toLocaleDateString(void 0, { month: "short", day: "numeric" });
    } catch {
      return "";
    }
  }
  function renderBucket(meta, offers) {
    const rows = offers.map((o) => {
      const search = escapeHtml(rowSearchString(o));
      const pillHtml = o.pill ? `<span class="c1t-pill ${pillClass(o.itemType, o.bucketCategory)}">${escapeHtml(o.pill)}</span>` : "";
      const endHtml = o.eventEnd ? `<span class="c1t-event-end">ends ${escapeHtml(eventEndDisplay(o.eventEnd))}</span>` : "";
      const exclText = o.exclusions ?? "";
      const exclTitle = exclText ? ` title="${escapeHtml(exclText)}"` : "";
      const exclShort = exclText ? escapeHtml(exclText) : "";
      const exclLong = exclText.length > 60;
      const exclHtml = !exclShort ? "" : exclLong ? `<div class="c1t-excl-cell"${exclTitle}>
                       <span class="c1t-excl-text">${exclShort}</span><button type="button" class="c1t-excl-toggle">(more)</button>
                   </div>` : `<div class="c1t-excl-cell"${exclTitle}><span class="c1t-excl-text">${exclShort}</span></div>`;
      return `<tr class="c1t-row-click"
            data-merchant="${escapeHtml(o.merchant)}"
            data-bucket-id="${escapeHtml(meta.id)}"
            data-search="${search}"
            data-method="${escapeHtml(o.activation.method)}"
            data-activation-url="${escapeHtml(o.activation.url)}">
            <td>${escapeHtml(o.merchant)}</td>
            <td><span class="c1t-reward">${escapeHtml(o.rewardDisplay)}</span></td>
            <td>${pillHtml}</td>
            <td>${endHtml}</td>
            <td>${exclHtml}</td>
        </tr>`;
    }).join("");
    const openAttr = meta.initiallyOpen ? " open" : "";
    return `<details class="c1t-bucket" data-bucket-id="${meta.id}"${openAttr}>
        <summary>${escapeHtml(meta.label)} <span class="c1t-bucket-count">(${offers.length})</span></summary>
        <table>
            <thead>
                <tr><th>Merchant</th><th>Reward</th><th>Badge</th><th>Ends</th><th>Exclusions</th></tr>
            </thead>
            <tbody>${rows}</tbody>
        </table>
    </details>`;
  }
  function groupChipLabel(group) {
    switch (group) {
      case "multiplier":
        return "Multipliers";
      case "percent":
        return "Percent";
      case "fixed-cash":
        return "Cash";
      case "fixed-points":
        return "Points";
    }
  }
  function buildQuickJumpChips(data) {
    const chips = [];
    const seenGroup = /* @__PURE__ */ new Set();
    for (const id of data.bucketOrder) {
      const meta = BUCKET_META_BY_ID[id];
      if (!meta) continue;
      if (seenGroup.has(meta.group)) continue;
      seenGroup.add(meta.group);
      chips.push(`<button class="c1t-jump-chip" data-jump-to="${meta.id}">${escapeHtml(groupChipLabel(meta.group))}</button>`);
    }
    return chips.join("");
  }
  function handleHrefClick(row) {
    const url = row.dataset.activationUrl;
    if (!url) return;
    window.open(url, "_blank", "noopener");
  }
  async function handlePostOffersClick(row) {
    const url = row.dataset.activationUrl;
    if (!url) return;
    const tab = window.open("about:blank", "_blank");
    try {
      const r = await fetch(url, { method: "POST", credentials: "include" });
      const data = await r.json();
      const redirect = data?.affiliate?.redirectUrl;
      if (redirect && tab) {
        tab.location = redirect;
      } else if (tab) {
        tab.close?.();
        alert("Activation failed \u2014 try clicking the tile on Cap One directly.");
      }
    } catch (e) {
      tab?.close?.();
      alert("Activation failed: " + (e instanceof Error ? e.message : String(e)));
    }
  }
  function attachRowClickDelegation(root) {
    root.addEventListener("click", (ev) => {
      const target = ev.target;
      if (!target) return;
      const toggle = target.closest(".c1t-excl-toggle");
      if (toggle) {
        ev.stopPropagation();
        ev.preventDefault();
        const cell = toggle.closest(".c1t-excl-cell");
        if (cell) {
          const expanded = cell.classList.toggle("c1t-excl-expanded");
          toggle.textContent = expanded ? "(less)" : "(more)";
        }
        return;
      }
      const row = target.closest("tr[data-method]");
      if (!row) return;
      if (row.dataset.method === "href") {
        handleHrefClick(row);
      } else if (row.dataset.method === "post-offers") {
        void handlePostOffersClick(row);
      }
    });
  }
  function attachSearch(root) {
    const input = root.querySelector("#c1t-browse-search input");
    const clearBtn = root.querySelector("#c1t-browse-search button");
    if (!input) return;
    const openStateCache = /* @__PURE__ */ new Map();
    root.querySelectorAll("details[data-bucket-id]").forEach((d) => {
      const det = d;
      const id = det.dataset.bucketId ?? "";
      openStateCache.set(id, det.open);
    });
    let timer = null;
    const applyFilter = (q) => {
      const query = q.trim().toLowerCase();
      const isEmpty = query.length === 0;
      const buckets = root.querySelectorAll("details[data-bucket-id]");
      buckets.forEach((detail) => {
        const det = detail;
        const id = det.dataset.bucketId ?? "";
        const rows = det.querySelectorAll("tr[data-search]");
        let visibleCount = 0;
        rows.forEach((row) => {
          const search = row.dataset.search ?? "";
          const match = isEmpty || search.includes(query);
          row.style.display = match ? "" : "none";
          if (match) visibleCount++;
        });
        if (visibleCount === 0 && !isEmpty) {
          det.style.display = "none";
        } else {
          det.style.display = "";
          if (!isEmpty) {
            det.open = true;
          } else {
            det.open = openStateCache.get(id) ?? false;
          }
        }
      });
    };
    input.addEventListener("input", () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => applyFilter(input.value), 100);
    });
    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        input.value = "";
        applyFilter("");
      });
    }
  }
  function attachQuickJump(root) {
    const nav = root.querySelector("#c1t-browse-nav");
    if (!nav) return;
    nav.addEventListener("click", (ev) => {
      const t = ev.target;
      if (!t) return;
      const chip = t.closest("[data-jump-to]");
      if (!chip) return;
      const id = chip.dataset.jumpTo;
      if (!id) return;
      const detail = root.querySelector(`details[data-bucket-id="${id}"]`);
      if (!detail) return;
      detail.open = true;
      detail.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }
  var renderBrowseToModal = (overlay, data) => {
    const content = overlay.querySelector("#c1t-content");
    if (!content) return;
    const bucketHtml = data.bucketOrder.map((id) => {
      const meta = BUCKET_META_BY_ID[id];
      if (!meta) return "";
      const offers = data.buckets[id];
      if (!offers || !offers.length) return "";
      return renderBucket(meta, offers);
    }).join("");
    const chips = buildQuickJumpChips(data);
    const footerNote = data.stats.hitCap ? `Stopped at ${data.stats.total} items (max pages reached)` : `${data.stats.total} offers across ${data.bucketOrder.length} buckets`;
    content.innerHTML = `
        <div id="c1t-browse-search">
            <input type="search" placeholder="Search merchant / reward / type..." />
            <button type="button">Clear</button>
        </div>
        <div id="c1t-browse-nav">${chips}</div>
        <div id="c1t-browse-stats">${escapeHtml(footerNote)}</div>
        <div id="c1t-browse-body">${bucketHtml || '<div style="padding:40px;text-align:center;opacity:0.7;">No offers found.</div>'}</div>
        <div id="c1t-browse-footer">Click a row to activate. Shopping rows open the pre-signed href; offers rows POST then redirect.</div>
    `;
    const body = content.querySelector("#c1t-browse-body");
    if (body) attachRowClickDelegation(body);
    attachSearch(content);
    attachQuickJump(content);
  };

  // src/tampermonkey.ts
  (function() {
    "use strict";
    const maybeSite = getCurrentSite();
    if (!maybeSite) return;
    const currentSite = maybeSite;
    console.log("[C1 Tracker] Initialized on", currentSite, "site");
    let tripsProcessed = null;
    const tripsUI = createUI({
      processedData: null,
      onOpen: () => {
        if (!tripsProcessed) void fetchTripsFallback();
      },
      render: renderTripsToModal,
      getBadgeCount: (d) => d?.stats?.withCredit ?? 0
    });
    function handleTripsApiData(data) {
      console.log("[C1 Tracker] Captured trips API data");
      tripsProcessed = processTripsData(data);
      console.log("[C1 Tracker] Processed trips:", tripsProcessed.stats);
      tripsUI.updateData(tripsProcessed);
    }
    async function fetchTripsFallback() {
      if (tripsProcessed) return;
      console.log("[C1 Tracker] No intercepted trips data, fetching directly...");
      try {
        let data;
        if (currentSite === "shopping") {
          const r = await fetch(CONFIG.shopping.trips.apiEndpoint, {
            credentials: "include"
          });
          if (!r.ok) throw new Error(`API returned ${r.status}`);
          data = await r.json();
        } else {
          const r = await fetch(CONFIG.offers.trips.apiEndpoint, {
            method: "POST",
            credentials: "include"
          });
          if (!r.ok) throw new Error(`API returned ${r.status}`);
          data = await r.json();
        }
        handleTripsApiData(data);
      } catch (e) {
        console.error("[C1 Tracker] Trips fallback fetch failed:", e);
      }
    }
    let browseProcessed = null;
    let browseWalking = false;
    const browseUI = createUI({
      processedData: null,
      onOpen: () => {
        if (!browseProcessed && !browseWalking) void runBrowseWalk();
      },
      render: renderBrowseToModal,
      getBadgeCount: (d) => d?.stats?.total ?? 0,
      title: currentSite === "offers" ? "Browse Cap One Offers" : "Browse Cap One Shopping",
      loadingText: "Loading offers feed..."
    });
    async function runBrowseWalk() {
      if (browseWalking) return;
      browseWalking = true;
      const setLoading = (msg) => {
        const loading = document.querySelector("#c1t-loading");
        if (loading) {
          loading.textContent = msg;
          return;
        }
        const content = document.querySelector("#c1t-content");
        if (content) {
          content.innerHTML = `<div id="c1t-loading">${msg}</div>`;
        }
      };
      setLoading("Walking offers feed... (0 pages)");
      const onPage = (pages, total) => {
        setLoading(`Loaded ${pages} pages, ${total} offers...`);
      };
      try {
        if (currentSite === "shopping") {
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
              "Could not capture offers feed context (userId + viewInstanceId). Open DevTools console for diagnostics."
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
        console.error("[C1 Tracker] Browse walk failed:", e);
        const msg = e instanceof Error ? e.message : String(e);
        setLoading("Error walking feed: " + msg);
      } finally {
        browseWalking = false;
      }
    }
    function isTripsAPI(url) {
      if (!url) return false;
      return CONFIG[currentSite].trips.apiPattern(String(url));
    }
    function isBrowseAPI(url) {
      if (!url) return false;
      return CONFIG[currentSite].browse.apiPattern(String(url));
    }
    const originalFetch = window.fetch;
    window.fetch = async function(...args) {
      const response = await originalFetch.apply(this, args);
      const first = args[0];
      let url = null;
      if (typeof first === "string") {
        url = first;
      } else if (first instanceof URL) {
        url = first.toString();
      } else if (first && typeof first.url === "string") {
        url = first.url;
      }
      if (isTripsAPI(url)) {
        try {
          const cloned = response.clone();
          const data = await cloned.json();
          handleTripsApiData(data);
        } catch (e) {
          console.error("[C1 Tracker] Error parsing trips response:", e);
        }
      }
      return response;
    };
    const originalXHROpen = XMLHttpRequest.prototype.open;
    const originalXHRSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.open = function(method, url, ...rest) {
      this._c1tUrl = typeof url === "string" ? url : url.toString();
      return originalXHROpen.apply(this, [method, url, ...rest]);
    };
    XMLHttpRequest.prototype.send = function(...args) {
      this.addEventListener("load", function() {
        if (isTripsAPI(this._c1tUrl)) {
          try {
            handleTripsApiData(JSON.parse(this.responseText));
          } catch (e) {
            console.error("[C1 Tracker] Error parsing XHR:", e);
          }
        }
      });
      return originalXHRSend.apply(this, args);
    };
    let lastMode = void 0;
    function ensureFabForMode(mode) {
      if (lastMode !== mode) {
        const stale = document.getElementById("c1t-fab");
        if (stale) stale.remove();
        const overlay = document.getElementById("c1t-overlay");
        if (overlay) overlay.remove();
        lastMode = mode;
      }
      if (mode === "trips") {
        tripsUI.ensureFab();
      } else if (mode === "browse") {
        browseUI.ensureFab();
      }
    }
    function keepAlive() {
      if (!document.body) return;
      ensureFabForMode(detectMode());
    }
    function initUI() {
      setInterval(keepAlive, 1e3);
      const observer = new MutationObserver(() => {
        const mode = detectMode();
        if (mode && !document.getElementById("c1t-fab")) {
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
    function initOnce() {
      if (initialized) return;
      initialized = true;
      initUI();
    }
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initOnce);
    } else {
      initOnce();
    }
    window.addEventListener("load", initOnce);
    console.log("[C1 Tracker] Script loaded \u2014 FAB will persist");
  })();
})();
