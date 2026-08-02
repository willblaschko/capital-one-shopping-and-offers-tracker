"use strict";(()=>{var Q={offers:{hostname:"capitaloneoffers",pages:{trips:"/shopping-trips",browse:"/feed"},trips:{apiPattern:t=>t.includes("/xhr/shopping-trips"),apiEndpoint:"/xhr/shopping-trips?limit=100&offset=0&status[]=Activated&status[]=Adjusted&status[]=Completed&status[]=Inactive&status[]=Ineligible&status[]=Pending&status[]=Waiting"},browse:{apiPattern:t=>t.includes("/feed/")&&t.includes("viewInstanceId=")}},shopping:{hostname:"capitaloneshopping",pages:{trips:"/account-settings/shopping-trips",browse:"/"},trips:{apiPattern:t=>t.includes("/api/v1/trip_orders"),apiEndpoint:"/api/v1/trip_orders"},browse:{apiPattern:t=>t.endsWith("/api/v1/feed"),apiEndpoint:"/api/v1/feed"}}};function S(){return window.location.hostname.includes("capitaloneoffers")?"offers":window.location.hostname.includes("capitaloneshopping")?"shopping":null}function L(){let t=S();if(!t)return null;let e=window.location.pathname,n=Q[t].pages;return e.startsWith(n.trips)?"trips":t==="shopping"&&(e==="/"||e==="")||t==="offers"&&e.startsWith(n.browse)?"browse":null}function Z(t){if(!t)return[];if(Array.isArray(t))return t;let e=t;return Array.isArray(e.items)?e.items:Array.isArray(e.shoppingTrips)?e.shoppingTrips:Array.isArray(e.trip_orders)?e.trip_orders:e.data&&Array.isArray(e.data)?e.data:e.data&&typeof e.data=="object"&&Array.isArray(e.data.items)?e.data.items:[]}function tt(t){let e=t.orderAmount??t.order_amount??(t.trxnTotalCents!=null?t.trxnTotalCents/100:null),n=t.creditAmount??t.credit_amount??(t.payoutAmountCents!=null?t.payoutAmountCents/100:null),r=t.orderId??t.order_id??null,a=n!==null&&Number(n)>0,o=t.status??"Unknown";o==="Waiting"?o="Created":(o==="Inactive"||o==="Ineligible")&&(o="Canceled");let i=o;return a&&o.toLowerCase()==="canceled"?i="Completed":o.toLowerCase()==="pending"&&(i=a?"Pending \u2713":"Pending ?"),{id:t.id??t.tripId??t.activatedOfferId??null,tripId:t.tripId??t.trip_id??t.id??t.activatedOfferId??null,orderId:r,merchant:t.vendor??t.merchantName??t.merchantDisplayName??t.merchant??t.domain??"Unknown",domain:t.domain??null,status:i,rawStatus:o,orderAmount:e!==null?Number(e):null,creditAmount:n!==null?Number(n):null,date:t.createdAt??t.created_at??t.clickDate??t.date??null,hasOrderId:r!==null,hasAmount:e!==null&&Number(e)>0,hasCreditAmount:a,rewardDisplay:t.rewardsSummaryDisplayRate??(Array.isArray(t.rewards)?t.rewards[0]?.displayRate:void 0)??"",exclusions:t.merchantExclusions??"",raw:t}}function I(t){let n=Z(t).map(tt);return{trips:n,stats:{total:n.length,withOrderId:n.filter(r=>r.hasOrderId).length,withAmount:n.filter(r=>r.hasAmount).length,withCredit:n.filter(r=>r.hasCreditAmount).length,pending:n.filter(r=>r.status.toLowerCase().includes("pending")).length,created:n.filter(r=>r.status.toLowerCase()==="created").length}}}var M=100,et=50,nt="/xhr/shopping-trips?limit="+M+"&status[]=Activated&status[]=Adjusted&status[]=Completed&status[]=Inactive&status[]=Ineligible&status[]=Pending&status[]=Waiting";async function P(t={}){let e=[];for(let n=0;n<et;n++){let r=nt+"&offset="+n*M,a=await fetch(r,{method:"POST",credentials:"include"});if(!a.ok)throw new Error("shopping-trips returned "+a.status);let o=await a.json(),i=Array.isArray(o.data)?o.data:[];if(e.push(...i),t.onProgress?.(e,n+1),o.hasMore!==!0||i.length===0)break}return{data:e}}var E=100,rt=50;async function B(t={}){let e=[];for(let n=0;n<rt;n++){let r=n*E,a="/api/v1/trip_orders?limit="+E+"&offset="+r+"&sort=desc",o=await fetch(a,{credentials:"include"});if(!o.ok)throw new Error("trip_orders returned "+o.status);let i=await o.json(),l=Array.isArray(i.items)?i.items:[];if(e.push(...l),t.onProgress?.(e,n+1),l.length<E)break}return{items:e}}var T='<svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 15V10"/><path d="M10 15V5"/><path d="M16 15V8"/><path d="M3 17h14"/></svg>',ot=`
    /* --- Design tokens (scoped to our elements to avoid leaking to the host) --- */
    #c1t-fab, #c1t-overlay {
        --c1t-bg: #17181a;
        --c1t-bg-elevated: #1e2023;
        --c1t-bg-hover: #26292d;
        --c1t-border: #2d3138;
        --c1t-border-strong: #3a3f47;
        --c1t-text: #e6e8eb;
        --c1t-text-muted: #9ca0a5;
        --c1t-text-dim: #6b7076;
        --c1t-accent: #61afef;
        --c1t-positive: #7ec27a;
        --c1t-attention: #e5c07b;
        --c1t-negative: #e06c75;
        --c1t-font: -apple-system, BlinkMacSystemFont, 'SF Pro Text',
            'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        --c1t-font-mono: ui-monospace, 'SF Mono', Menlo, Consolas, monospace;
    }

    /* --- FAB --- */
    #c1t-fab {
        position: fixed !important;
        bottom: 20px !important;
        right: 20px !important;
        width: 44px !important;
        height: 44px !important;
        min-width: 44px !important;
        min-height: 44px !important;
        box-sizing: border-box !important;
        padding: 0 !important;
        margin: 0 !important;
        border-radius: 8px !important;
        background: var(--c1t-bg) !important;
        color: var(--c1t-text) !important;
        border: 1px solid var(--c1t-border-strong) !important;
        cursor: pointer !important;
        box-shadow: 0 4px 14px rgba(0,0,0,0.35) !important;
        z-index: 2147483647 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        font-family: var(--c1t-font) !important;
        transition: border-color 0.15s, transform 0.15s !important;
    }
    #c1t-fab:hover {
        border-color: var(--c1t-accent) !important;
        transform: translateY(-1px) !important;
    }
    #c1t-fab svg { display: block !important; }
    #c1t-fab.has-data svg { color: var(--c1t-accent) !important; }
    #c1t-fab .badge {
        position: absolute !important;
        top: -6px !important;
        right: -6px !important;
        background: var(--c1t-accent) !important;
        color: var(--c1t-bg) !important;
        font-size: 10px !important;
        font-weight: 600 !important;
        padding: 2px 6px !important;
        border-radius: 8px !important;
        min-width: 16px !important;
        text-align: center !important;
        box-shadow: 0 0 0 2px var(--c1t-bg) !important;
        line-height: 1.3 !important;
        font-family: var(--c1t-font) !important;
    }

    /* --- Overlay + modal --- */
    #c1t-overlay {
        position: fixed !important;
        inset: 0 !important;
        background: rgba(10, 12, 14, 0.55) !important;
        z-index: 2147483647 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        opacity: 0 !important;
        visibility: hidden !important;
        transition: opacity 0.15s !important;
        font-family: var(--c1t-font) !important;
        color: var(--c1t-text) !important;
    }
    #c1t-overlay.open { opacity: 1 !important; visibility: visible !important; }
    #c1t-modal {
        background: var(--c1t-bg) !important;
        color: var(--c1t-text) !important;
        border: 1px solid var(--c1t-border-strong) !important;
        border-radius: 8px !important;
        box-shadow: 0 12px 32px rgba(0,0,0,0.45) !important;
        width: 92% !important;
        max-width: 960px !important;
        max-height: 82vh !important;
        display: flex !important;
        flex-direction: column !important;
        transform: translateY(8px) !important;
        opacity: 0 !important;
        transition: transform 0.15s, opacity 0.15s !important;
    }
    #c1t-overlay.open #c1t-modal { transform: translateY(0) !important; opacity: 1 !important; }

    /* --- Header --- */
    #c1t-header {
        padding: 12px 16px !important;
        border-bottom: 1px solid var(--c1t-border) !important;
        display: flex !important;
        align-items: center !important;
        justify-content: space-between !important;
        flex-shrink: 0 !important;
    }
    #c1t-header h2 {
        margin: 0 !important;
        font-size: 13px !important;
        font-weight: 600 !important;
        color: var(--c1t-text) !important;
        letter-spacing: 0.01em !important;
        display: flex !important;
        align-items: center !important;
        gap: 8px !important;
    }
    #c1t-header h2 svg { color: var(--c1t-accent) !important; }
    #c1t-close {
        background: transparent !important;
        border: 1px solid var(--c1t-border) !important;
        color: var(--c1t-text-muted) !important;
        width: 24px !important;
        height: 24px !important;
        min-width: 24px !important;
        border-radius: 5px !important;
        cursor: pointer !important;
        font-size: 13px !important;
        line-height: 1 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        padding: 0 !important;
        box-sizing: border-box !important;
        font-family: var(--c1t-font) !important;
        transition: color 0.12s, border-color 0.12s !important;
    }
    #c1t-close:hover { color: var(--c1t-text) !important; border-color: var(--c1t-border-strong) !important; }

    /* --- Tabs --- */
    #c1t-tabs {
        display: flex !important;
        gap: 2px !important;
        padding: 0 12px !important;
        border-bottom: 1px solid var(--c1t-border) !important;
        background: var(--c1t-bg) !important;
        flex-shrink: 0 !important;
    }
    .c1t-tab {
        background: transparent !important;
        border: none !important;
        color: var(--c1t-text-muted) !important;
        padding: 9px 14px !important;
        cursor: pointer !important;
        font-size: 12px !important;
        font-weight: 500 !important;
        font-family: var(--c1t-font) !important;
        border-bottom: 2px solid transparent !important;
        margin-bottom: -1px !important;
        transition: color 0.12s, border-color 0.12s !important;
    }
    .c1t-tab:hover { color: var(--c1t-text) !important; }
    .c1t-tab.active { color: var(--c1t-text) !important; border-bottom-color: var(--c1t-accent) !important; }

    /* --- Stats + loading pill --- */
    #c1t-stats {
        padding: 8px 16px !important;
        background: var(--c1t-bg-elevated) !important;
        border-bottom: 1px solid var(--c1t-border) !important;
        font-size: 12px !important;
        color: var(--c1t-text-muted) !important;
        flex-shrink: 0 !important;
        display: flex !important;
        flex-wrap: wrap !important;
        gap: 4px 18px !important;
        align-items: center !important;
    }
    #c1t-stats .stat { display: inline-flex !important; align-items: baseline !important; gap: 5px !important; }
    #c1t-stats strong { color: var(--c1t-text) !important; font-weight: 600 !important; font-variant-numeric: tabular-nums !important; }
    #c1t-stats .c1t-loading-pill {
        border: 1px solid var(--c1t-attention) !important;
        color: var(--c1t-attention) !important;
        padding: 2px 8px !important;
        border-radius: 4px !important;
        font-size: 11px !important;
        font-weight: 500 !important;
        margin-left: auto !important;
        background: transparent !important;
    }

    /* --- Filter chips --- */
    #c1t-filters {
        padding: 8px 14px !important;
        display: flex !important;
        gap: 4px !important;
        flex-wrap: wrap !important;
        border-bottom: 1px solid var(--c1t-border) !important;
        background: var(--c1t-bg) !important;
        flex-shrink: 0 !important;
    }
    .c1t-filter-btn {
        background: transparent !important;
        border: 1px solid var(--c1t-border) !important;
        color: var(--c1t-text-muted) !important;
        padding: 3px 10px !important;
        border-radius: 4px !important;
        cursor: pointer !important;
        font-size: 11px !important;
        font-family: var(--c1t-font) !important;
        transition: color 0.12s, border-color 0.12s, background 0.12s !important;
    }
    .c1t-filter-btn:hover { color: var(--c1t-text) !important; border-color: var(--c1t-border-strong) !important; }
    .c1t-filter-btn.active {
        color: var(--c1t-text) !important;
        border-color: var(--c1t-accent) !important;
        background: rgba(97, 175, 239, 0.08) !important;
    }

    /* --- Table --- */
    #c1t-table-wrap {
        flex: 1 !important;
        overflow-y: auto !important;
        padding: 0 !important;
    }
    #c1t-table {
        width: 100% !important;
        border-collapse: collapse !important;
        font-size: 12px !important;
        color: var(--c1t-text) !important;
    }
    #c1t-table th {
        text-align: left !important;
        padding: 8px 12px !important;
        border-bottom: 1px solid var(--c1t-border) !important;
        font-weight: 500 !important;
        font-size: 10px !important;
        text-transform: uppercase !important;
        letter-spacing: 0.06em !important;
        position: sticky !important;
        top: 0 !important;
        background: var(--c1t-bg-elevated) !important;
        color: var(--c1t-text-muted) !important;
        z-index: 1 !important;
    }
    #c1t-table th.r { text-align: right !important; }
    #c1t-table th.c { text-align: center !important; }
    #c1t-table td {
        padding: 8px 12px !important;
        border-bottom: 1px solid var(--c1t-border) !important;
        color: var(--c1t-text) !important;
        vertical-align: top !important;
        font-variant-numeric: tabular-nums !important;
    }
    #c1t-table td.r { text-align: right !important; }
    #c1t-table td.c { text-align: center !important; }
    #c1t-table tbody tr:hover { background: var(--c1t-bg-hover) !important; }

    /* --- Status pill: 4 semantic buckets, outlined --- */
    .c1t-status {
        display: inline-block !important;
        padding: 2px 7px !important;
        border-radius: 4px !important;
        font-size: 10px !important;
        font-weight: 500 !important;
        letter-spacing: 0.02em !important;
        background: transparent !important;
        color: var(--c1t-text-muted) !important;
        border: 1px solid var(--c1t-border-strong) !important;
    }
    .c1t-status.completed,
    .c1t-status.pending-good {
        color: var(--c1t-positive) !important;
        border-color: rgba(126, 194, 122, 0.4) !important;
    }
    .c1t-status.pending-uncertain,
    .c1t-status.created {
        color: var(--c1t-attention) !important;
        border-color: rgba(229, 192, 123, 0.4) !important;
    }
    .c1t-status.activated,
    .c1t-status.adjusted {
        color: var(--c1t-accent) !important;
        border-color: rgba(97, 175, 239, 0.4) !important;
    }
    .c1t-status.canceled {
        color: var(--c1t-negative) !important;
        border-color: rgba(224, 108, 117, 0.4) !important;
    }
    .c1t-credit { color: var(--c1t-positive) !important; font-weight: 500 !important; }
    .c1t-amount { color: var(--c1t-text) !important; font-weight: 500 !important; }

    /* --- Footer + raw JSON --- */
    #c1t-footer {
        padding: 8px 16px !important;
        border-top: 1px solid var(--c1t-border) !important;
        background: var(--c1t-bg-elevated) !important;
        flex-shrink: 0 !important;
    }
    #c1t-footer details { font-size: 11px !important; color: var(--c1t-text-muted) !important; }
    #c1t-footer summary { cursor: pointer !important; color: var(--c1t-text-muted) !important; }
    #c1t-footer summary:hover { color: var(--c1t-text) !important; }
    #c1t-footer pre {
        background: var(--c1t-bg) !important;
        border: 1px solid var(--c1t-border) !important;
        padding: 10px !important;
        border-radius: 6px !important;
        overflow: auto !important;
        max-height: 220px !important;
        font-size: 11px !important;
        margin-top: 8px !important;
        color: var(--c1t-text) !important;
        font-family: var(--c1t-font-mono) !important;
        line-height: 1.5 !important;
    }

    #c1t-loading {
        padding: 40px 20px !important;
        text-align: center !important;
        color: var(--c1t-text-muted) !important;
        font-size: 12px !important;
    }
    #c1t-content {
        display: flex !important;
        flex-direction: column !important;
        flex: 1 !important;
        min-height: 0 !important;
        overflow: hidden !important;
    }

    /* --- Browse mode --- */
    #c1t-browse-search {
        padding: 10px 14px 6px !important;
        display: flex !important;
        gap: 6px !important;
        border-bottom: 1px solid var(--c1t-border) !important;
        flex-shrink: 0 !important;
    }
    #c1t-browse-search input {
        flex: 1 !important;
        padding: 6px 10px !important;
        border-radius: 6px !important;
        border: 1px solid var(--c1t-border) !important;
        background: var(--c1t-bg-elevated) !important;
        color: var(--c1t-text) !important;
        font-size: 12px !important;
        font-family: var(--c1t-font) !important;
        outline: none !important;
        transition: border-color 0.12s !important;
    }
    #c1t-browse-search input:focus { border-color: var(--c1t-accent) !important; }
    #c1t-browse-search input::placeholder { color: var(--c1t-text-dim) !important; }
    #c1t-browse-search button {
        background: transparent !important;
        border: 1px solid var(--c1t-border) !important;
        color: var(--c1t-text-muted) !important;
        padding: 0 10px !important;
        border-radius: 6px !important;
        cursor: pointer !important;
        font-size: 11px !important;
        font-family: var(--c1t-font) !important;
        transition: color 0.12s, border-color 0.12s !important;
    }
    #c1t-browse-search button:hover { color: var(--c1t-text) !important; border-color: var(--c1t-border-strong) !important; }
    #c1t-browse-nav {
        padding: 6px 14px !important;
        display: flex !important;
        gap: 4px !important;
        flex-wrap: wrap !important;
        border-bottom: 1px solid var(--c1t-border) !important;
        flex-shrink: 0 !important;
    }
    .c1t-jump-chip {
        background: transparent !important;
        border: 1px solid var(--c1t-border) !important;
        color: var(--c1t-text-muted) !important;
        padding: 3px 9px !important;
        border-radius: 4px !important;
        cursor: pointer !important;
        font-size: 11px !important;
        font-family: var(--c1t-font) !important;
        transition: color 0.12s, border-color 0.12s !important;
    }
    .c1t-jump-chip:hover { color: var(--c1t-text) !important; border-color: var(--c1t-border-strong) !important; }
    #c1t-browse-stats {
        padding: 6px 14px !important;
        font-size: 11px !important;
        color: var(--c1t-text-muted) !important;
        border-bottom: 1px solid var(--c1t-border) !important;
        flex-shrink: 0 !important;
    }
    #c1t-browse-body {
        flex: 1 !important;
        overflow-y: auto !important;
        padding: 8px !important;
    }
    .c1t-bucket {
        margin-bottom: 6px !important;
        background: var(--c1t-bg-elevated) !important;
        border: 1px solid var(--c1t-border) !important;
        border-radius: 6px !important;
    }
    .c1t-bucket > summary {
        padding: 8px 12px !important;
        cursor: pointer !important;
        font-weight: 500 !important;
        font-size: 12px !important;
        color: var(--c1t-text) !important;
        list-style: none !important;
        user-select: none !important;
        display: flex !important;
        align-items: center !important;
        gap: 8px !important;
    }
    .c1t-bucket > summary::-webkit-details-marker { display: none !important; }
    .c1t-bucket > summary::before {
        content: '\u25B8' !important;
        font-size: 10px !important;
        color: var(--c1t-text-muted) !important;
        transition: transform 0.12s !important;
    }
    .c1t-bucket[open] > summary::before { transform: rotate(90deg) !important; }
    .c1t-bucket-count { color: var(--c1t-text-muted) !important; font-weight: 400 !important; font-size: 11px !important; }
    .c1t-bucket table { width: 100% !important; border-collapse: collapse !important; font-size: 12px !important; }
    .c1t-bucket th {
        text-align: left !important;
        padding: 6px 10px !important;
        border-top: 1px solid var(--c1t-border) !important;
        border-bottom: 1px solid var(--c1t-border) !important;
        font-weight: 500 !important;
        font-size: 10px !important;
        color: var(--c1t-text-muted) !important;
        text-transform: uppercase !important;
        letter-spacing: 0.06em !important;
        background: var(--c1t-bg) !important;
    }
    .c1t-bucket td {
        padding: 7px 10px !important;
        border-bottom: 1px solid var(--c1t-border) !important;
        color: var(--c1t-text) !important;
        font-variant-numeric: tabular-nums !important;
    }
    .c1t-bucket tr:last-child td { border-bottom: none !important; }
    .c1t-row-click { cursor: pointer !important; }
    .c1t-row-click:hover { background: var(--c1t-bg-hover) !important; }
    .c1t-reward { font-weight: 500 !important; color: var(--c1t-positive) !important; }

    /* Attribute pills \u2014 outlined, single-accent-per-type */
    .c1t-pill {
        display: inline-block !important;
        padding: 1px 6px !important;
        border-radius: 3px !important;
        font-size: 10px !important;
        font-weight: 500 !important;
        background: transparent !important;
        color: var(--c1t-text-muted) !important;
        border: 1px solid var(--c1t-border-strong) !important;
        letter-spacing: 0.02em !important;
    }
    .c1t-pill.event { color: var(--c1t-positive) !important; border-color: rgba(126, 194, 122, 0.4) !important; }
    .c1t-pill.deal { color: var(--c1t-attention) !important; border-color: rgba(229, 192, 123, 0.4) !important; }
    .c1t-pill.new { color: var(--c1t-accent) !important; border-color: rgba(97, 175, 239, 0.4) !important; }

    .c1t-excl-cell {
        font-size: 11px !important;
        color: var(--c1t-text-muted) !important;
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
    .c1t-excl-cell.c1t-excl-expanded { max-width: 420px !important; align-items: flex-start !important; }
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
        color: var(--c1t-accent) !important;
        cursor: pointer !important;
        font: inherit !important;
        font-size: 11px !important;
        text-decoration: none !important;
    }
    .c1t-excl-toggle:hover { text-decoration: underline !important; }
    .c1t-event-end { font-size: 11px !important; color: var(--c1t-text-muted) !important; white-space: nowrap !important; }
    #c1t-browse-footer {
        padding: 8px 14px !important;
        font-size: 11px !important;
        color: var(--c1t-text-muted) !important;
        border-top: 1px solid var(--c1t-border) !important;
        background: var(--c1t-bg-elevated) !important;
        flex-shrink: 0 !important;
    }
`;function R(t){return t==null||t===0?"\u2014":"$"+Number(t).toFixed(2)}function at(t){if(!t)return"\u2014";try{return new Date(t).toLocaleDateString()}catch{return"\u2014"}}function m(t){if(t==null)return"";let e=document.createElement("div");return e.textContent=String(t),e.innerHTML}function it(t){let e=(t||"").toLowerCase();return e.includes("completed")?"completed":e==="pending \u2713"?"pending-good":e==="pending ?"||e.includes("pending")?"pending-uncertain":e.includes("created")?"created":e.includes("activated")?"activated":e.includes("cancel")?"canceled":e.includes("adjust")?"adjusted":""}var F=(t,e)=>{if(console.log("[C1 Tracker] renderTripsToModal called - data:",!!e,"overlay:",!!t),!e)return;let{trips:n,stats:r}=e,a=t.querySelector("#c1t-content");if(console.log("[C1 Tracker] renderTripsToModal - content element:",!!a,"trips:",n?.length),!a)return;let i=a.querySelector("#c1t-table-wrap")?.scrollTop??0,l=r.isLoading?`<span class="stat c1t-loading-pill">\u23F3 ${m(r.loadingText??"Loading\u2026")}</span>`:"";a.innerHTML=`
        <div id="c1t-stats">
            <span class="stat"><strong>${r.total}</strong> total</span>
            <span class="stat"><strong>${r.withOrderId}</strong> tracked</span>
            <span class="stat"><strong>${r.withAmount}</strong> with amount</span>
            <span class="stat"><strong>${r.withCredit}</strong> with cashback</span>
            ${l}
        </div>
        <div id="c1t-filters">
            <button class="c1t-filter-btn active" data-filter="all">All (${r.total})</button>
            <button class="c1t-filter-btn" data-filter="amount">With Amount (${r.withAmount})</button>
            <button class="c1t-filter-btn" data-filter="tracked">Tracked (${r.withOrderId})</button>
            <button class="c1t-filter-btn" data-filter="pending">Pending (${r.pending})</button>
            <button class="c1t-filter-btn" data-filter="created">Waiting (${r.created})</button>
        </div>
        <div id="c1t-table-wrap">
            <table id="c1t-table">
                <thead>
                    <tr>
                        <th>Merchant</th>
                        <th class="c">Date</th>
                        <th class="r">Order</th>
                        <th class="r">Cash Back</th>
                        <th>Rate</th>
                        <th class="c">Status</th>
                        <th class="c">Tracked</th>
                        <th>Exclusions</th>
                    </tr>
                </thead>
                <tbody id="c1t-tbody">
                    ${n.map(s=>{let f=s.hasCreditAmount?"amt":s.hasOrderId?"tracked":"",g=it(s.status),d=s.exclusions??"",b=d.length>60,v=d?b?`<div class="c1t-excl-cell" title="${m(d)}"><span class="c1t-excl-text">${m(d)}</span><button type="button" class="c1t-excl-toggle">(more)</button></div>`:`<div class="c1t-excl-cell" title="${m(d)}"><span class="c1t-excl-text">${m(d)}</span></div>`:'<span style="opacity:0.4">\u2014</span>';return`
                                <tr class="${f}" data-filter-amount="${s.hasAmount}" data-filter-tracked="${s.hasOrderId}" data-filter-pending="${s.status.toLowerCase().includes("pending")}" data-filter-created="${s.status.toLowerCase()==="created"}">
                                    <td title="${m(s.domain)}">${m(s.merchant)}</td>
                                    <td class="c">${at(s.date)}</td>
                                    <td class="r ${s.hasAmount?"c1t-amount":""}">${R(s.orderAmount)}</td>
                                    <td class="r ${s.hasCreditAmount?"c1t-credit":""}">${R(s.creditAmount)}</td>
                                    <td>${m(s.rewardDisplay)||'<span style="opacity:0.4">\u2014</span>'}</td>
                                    <td class="c"><span class="c1t-status ${g}">${m(s.status)}</span></td>
                                    <td class="c">${s.hasOrderId?"\u2713":"\u2014"}</td>
                                    <td>${v}</td>
                                </tr>
                            `}).join("")}
                </tbody>
            </table>
        </div>
        <div id="c1t-footer">
            <details>
                <summary>Show Raw JSON</summary>
                <pre>${m(JSON.stringify(n.slice(0,30).map(s=>s.raw),null,2))}${n.length>30?`

... and `+(n.length-30)+" more":""}</pre>
            </details>
        </div>
    `;let p=a.querySelector("#c1t-table-wrap");p&&i>0&&(p.scrollTop=i),a.querySelectorAll(".c1t-filter-btn").forEach(s=>{s.addEventListener("click",function(){a.querySelectorAll(".c1t-filter-btn").forEach(g=>g.classList.remove("active")),this.classList.add("active");let f=this.dataset.filter;a.querySelectorAll("#c1t-tbody tr").forEach(g=>{if(f==="all")g.style.display="";else if(f){let d=`filter${f.charAt(0).toUpperCase()+f.slice(1)}`;g.style.display=g.dataset[d]==="true"?"":"none"}})})}),a.querySelectorAll(".c1t-excl-toggle").forEach(s=>{s.addEventListener("click",f=>{f.stopPropagation(),f.preventDefault();let g=s.closest(".c1t-excl-cell");if(!g)return;let d=g.classList.toggle("c1t-excl-expanded");s.textContent=d?"(less)":"(more)"})})};function _(t){let{title:e,tabs:n,defaultTabId:r}=t;if(n.length===0)throw new Error("createTabbedUI: tabs must be non-empty");if(!n.find(c=>c.id===r))throw new Error(`createTabbedUI: defaultTabId "${r}" not in tabs`);let a=new Map,o=new Map,i=!1,l=r;function p(c){return n.find(u=>u.id===c)??null}function s(){if(i&&document.getElementById("c1t-styles"))return;let c=document.getElementById("c1t-styles");c||(c=document.createElement("style"),c.id="c1t-styles",c.textContent=ot,(document.head||document.documentElement).appendChild(c)),i=!0}function f(){s();let c=document.getElementById("c1t-fab");if(c)return c;let u=document.createElement("button");return u.id="c1t-fab",u.innerHTML=T,u.title=e,u.addEventListener("click",()=>{g().classList.add("open"),d(l)}),document.body.appendChild(u),w(),u}function g(){s();let c=document.getElementById("c1t-overlay");if(c)return c;c=document.createElement("div"),c.id="c1t-overlay",c.innerHTML=`
            <div id="c1t-modal">
                <div id="c1t-header">
                    <h2>${T}<span>${m(e)}</span></h2>
                    <button id="c1t-close" aria-label="Close">\u2715</button>
                </div>
                <div id="c1t-tabs">
                    ${n.map(h=>`<button class="c1t-tab${h.id===l?" active":""}" data-tab-id="${m(h.id)}">${m(h.label)}</button>`).join("")}
                </div>
                <div id="c1t-content"></div>
            </div>
        `,document.body.appendChild(c);let u=c;return u.querySelector("#c1t-close")?.addEventListener("click",()=>{u.classList.remove("open")}),u.addEventListener("click",h=>{h.target===u&&u.classList.remove("open")}),u.querySelectorAll(".c1t-tab").forEach(h=>{h.addEventListener("click",()=>{let x=h.dataset.tabId;x&&d(x)})}),c}async function d(c){let u=p(c);if(!u)return;l=c;let h=document.getElementById("c1t-overlay");h&&h.querySelectorAll(".c1t-tab").forEach(y=>{y.classList.toggle("active",y.dataset.tabId===c)});let x=h?.querySelector("#c1t-content");if(a.has(c)){x&&u.render(h,a.get(c));return}if(!u.onActivate){x&&(x.innerHTML=`<div id="c1t-loading">${m(u.loadingText??"No data.")}</div>`);return}if(o.has(c)){await o.get(c);return}x&&(x.innerHTML=`<div id="c1t-loading">${m(u.loadingText??"Loading\u2026")}</div>`);let k=(async()=>{try{let y=await u.onActivate();y!=null&&v(c,y)}catch(y){console.error("[C1 Tracker] tab loader threw:",y);let Y=y instanceof Error?y.message:String(y),$=document.getElementById("c1t-content");$&&l===c&&($.innerHTML=`<div id="c1t-loading">Error loading data: ${m(Y)}</div>`)}finally{o.delete(c)}})();o.set(c,k),await k}function b(c){d(c)}function v(c,u){let h=p(c);if(!h)return;a.set(c,u),w();let x=document.getElementById("c1t-overlay");x&&l===c&&h.render(x,u)}function w(){let c=document.getElementById("c1t-fab");if(!c)return;let u=0,h=!1;for(let x of n){if(!a.has(x.id)||(h=!0,!x.getBadgeCount))continue;let k=x.getBadgeCount(a.get(x.id));k>u&&(u=k)}h?c.classList.add("has-data"):c.classList.remove("has-data"),c.innerHTML=u>0?`${T}<span class="badge">${u}</span>`:T}return document.addEventListener("keydown",c=>{if(c.key==="Escape"){let u=document.getElementById("c1t-overlay");u&&u.classList.remove("open")}}),{ensureStyles:s,ensureFab:f,ensureOverlay:g,setActiveTab:b,setTabData:v,getActiveTabId:()=>l}}var st=750,D=4,ct=5e3;function j(t){return new Promise(e=>setTimeout(e,t))}function lt(t){if(!t)return null;let e=Number(t);return Number.isFinite(e)&&e>=0?Math.min(e*1e3,3e4):null}async function z(t,e){for(let n=0;n<=D;n++)try{let r=await fetch(t,e);if(r.status!==429)return r;if(n===D)return console.warn("[C1 Tracker] 429 retries exhausted",{url:t}),r;let a=lt(r.headers.get("Retry-After"));if(a==null)try{let p=await r.clone().json();typeof p?.retry_after=="number"&&p.retry_after>=0&&(a=Math.min(p.retry_after*1e3,6e4))}catch{}let o=a??ct*Math.pow(2,n),i=Math.floor(Math.random()*500),l=o+i;console.warn("[C1 Tracker] 429 rate-limited; waiting",l,"ms",{attempt:n+1,url:t}),await j(l)}catch(r){return console.warn("[C1 Tracker] fetch threw",r),null}return null}var pt=/(\d+(?:\.\d+)?)X/i,dt=/(\d+(?:\.\d+)?)%/,ut=/\$([\d,]+(?:\.\d+)?)/,mt=/([\d,]+)\s*(miles|points)/i;function C(t){let e=String(t??""),n=e.trim();if(!n)return{type:"unknown",value:0,display:e};let r=n.match(pt);if(r&&r[1]!==void 0)return{type:"multiplier",value:parseFloat(r[1]),display:e};let a=n.match(ut);if(a&&a[1]!==void 0)return{type:"fixed-cash",value:parseFloat(a[1].replace(/,/g,"")),display:e};let o=n.match(mt);if(o&&o[1]!==void 0)return{type:"fixed-points",value:parseFloat(o[1].replace(/,/g,"")),display:e};let i=n.match(dt);return i&&i[1]!==void 0?{type:"percent",value:parseFloat(i[1]),display:e}:{type:"unknown",value:0,display:e}}function H(t){let e=t.stats??{};return e.cashbackV2??e.cashback??e.cashbackAmount??""}function ft(t){if(!t||!t.length)return null;let e=null;for(let n of t){let r=C(n.cashback);r.value>0&&(!e||r.value>e.value)&&(e={type:r.type,value:r.value,display:n.cashback})}return e}function gt(t){switch(t){case"great_deal":return"price-drops";case"event_placement":return"events";case"nca_deal":return"new-customer";case"retarget":case"retarget_non_product":return"recently-viewed";default:return"value"}}function bt(t){if(!t.href)return null;let e=t.merchantName??"",n=t.domain??"";if(!e&&!n)return null;let r=t.stats??{},a=r.isCutType===!0||r.rewardType==="cut",o,i,l;if(a){let d=ft(r.cashbackCategories);if(d){o=d.type,i=d.value;let b=d.display.trim();l=b.toLowerCase().startsWith("up to")?b:"Up to "+b}else{let b=C(H(t));o=b.type,i=b.value,l=b.display.toLowerCase().startsWith("up to")?b.display:b.value?"Up to "+b.display:b.display}}else{let d=C(H(t));o=d.type,i=d.value,l=d.display}let p={method:"href",url:t.href},s=gt(t.type),f=t.id??null;return{id:f!==null?String(f):`shopping|${e||n}|${l}|${t.type}`,source:"shopping",itemType:t.type,merchant:e||n,domain:n||e,rewardType:o,rewardValue:i,rewardDisplay:l,activation:p,bucketCategory:s,pill:t.pill?.text??null,exclusions:r.exclusionsText??"",eventEnd:t.end??null,priceHistory:r.priceHistory??null,raw:t}}function ht(t,e){return`https://capitaloneoffers.com/xhr/feed/${encodeURIComponent(t.userId)}/offers/${e}`}function W(t,e){if(t.type==="Carousel"){let l=t.tiles??[],p=[];for(let s of l)for(let f of W(s,e))p.push(f);return p}let n=t.id,r=t.merchantTLD;if(!n||!r)return[];let a=t.buttonText??"",o=C(a),i=t.subText&&t.headingText?`${t.headingText} \u2014 ${t.subText}`:t.subText??t.headingText??t.text??"";return[{id:n,source:"offers",itemType:t.type,merchant:r,domain:r,rewardType:o.type,rewardValue:o.value,rewardDisplay:o.display,activation:{method:"post-offers",url:ht(e,n)},bucketCategory:"value",pill:t.badge?.text??null,exclusions:i,eventEnd:null,priceHistory:null,raw:t}]}function xt(t){let e=t.rewardValue;switch(t.rewardType){case"multiplier":return e>=30?"mult-30":e>=20?"mult-20":e>=10?"mult-10":"mult-1";case"percent":case"cut":return e>=40?"pct-40":e>=20?"pct-20":e>=10?"pct-10":"pct-1";case"fixed-cash":return e>=50?"cash-50":e>=25?"cash-25":"cash-0";case"fixed-points":return e>=1e4?"pts-10k":e>=5e3?"pts-5k":e>=1e3?"pts-1k":"pts-lt-1k";case"unknown":default:return"pct-1"}}var N=[{id:"mult-30",label:"Multipliers \xB7 30X+",group:"multiplier",initiallyOpen:!0},{id:"mult-20",label:"Multipliers \xB7 20\u201329X",group:"multiplier",initiallyOpen:!0},{id:"mult-10",label:"Multipliers \xB7 10\u201319X",group:"multiplier",initiallyOpen:!1},{id:"mult-1",label:"Multipliers \xB7 1\u20139X",group:"multiplier",initiallyOpen:!1},{id:"pct-40",label:"Percent \xB7 40%+",group:"percent",initiallyOpen:!0},{id:"pct-20",label:"Percent \xB7 20\u201339%",group:"percent",initiallyOpen:!0},{id:"pct-10",label:"Percent \xB7 10\u201319%",group:"percent",initiallyOpen:!1},{id:"pct-1",label:"Percent \xB7 1\u20139%",group:"percent",initiallyOpen:!1},{id:"cash-50",label:"Fixed Cash \xB7 $50+",group:"fixed-cash",initiallyOpen:!0},{id:"cash-25",label:"Fixed Cash \xB7 $25\u201349",group:"fixed-cash",initiallyOpen:!0},{id:"cash-0",label:"Fixed Cash \xB7 under $25",group:"fixed-cash",initiallyOpen:!1},{id:"pts-10k",label:"Fixed Points \xB7 10,000+",group:"fixed-points",initiallyOpen:!0},{id:"pts-5k",label:"Fixed Points \xB7 5,000\u20139,999",group:"fixed-points",initiallyOpen:!0},{id:"pts-1k",label:"Fixed Points \xB7 1,000\u20134,999",group:"fixed-points",initiallyOpen:!1},{id:"pts-lt-1k",label:"Fixed Points \xB7 under 1,000",group:"fixed-points",initiallyOpen:!1}],q=(()=>{let t={};for(let e of N)t[e.id]=e;return t})();function A(t){let e={};for(let o of t){let i=xt(o);(e[i]??(e[i]=[])).push(o)}for(let o of Object.keys(e))e[o].sort((i,l)=>l.rewardValue-i.rewardValue);let n=[],r={};for(let o of N){let i=e[o.id];i&&i.length&&(n.push(o.id),r[o.id]=i.length)}let a={total:t.length,byBucket:r};return{offers:t,buckets:e,bucketOrder:n,stats:a}}async function V(t){let e=t.maxPages??40,n=new Set,r=[],a=null,o=0;for(;o<e;){o>0&&await j(st);let i=await t.fetchPage(a);if(!i)break;for(let p of t.getItems(i)){let s=t.dedupeKey(p);s&&n.has(s)||(s&&n.add(s),r.push(p))}o++,t.onPage?.(o,r.length);let l=t.getNextCursor(i);if(!l)break;a=l}return{items:r,hitCap:o>=e,pagesWalked:o}}function vt(t){let e={limit:25};return t&&(e.nextPageToken=t),JSON.stringify({contentProps:{pagination:e},context:{device:{model:typeof navigator<"u"&&/Mac/.test(navigator.platform)?"Macintosh":"Unknown",manufacturer:"Unknown",memory:"8",concurrency:String(typeof navigator<"u"&&navigator.hardwareConcurrency||4)},browser:{name:"Chrome",version:"0",major:"0"},os:{name:"unknown",version:"0"},screen:{width:1920,height:1080,density:2},locale:typeof navigator<"u"&&navigator.language?navigator.language:"en-US",country:"US",location:{state:"",zipcode:"",latitude:null,longitude:null,isInCensusData:!1},page:{path:typeof window<"u"?window.location.pathname:"/",url:typeof window<"u"?window.location.href:"",referrer:typeof document<"u"?document.referrer:"",search:typeof window<"u"?window.location.search:"",title:typeof document<"u"?document.title:""},userAgent:typeof navigator<"u"?navigator.userAgent:""}})}function yt(t){let e=t;if(e.id!==void 0&&e.id!==null&&e.id!=="")return String(e.id);let n=t.merchantName??"",r=t.stats?.cashbackV2??t.stats?.cashback??"";return!n&&!r?null:`${n}|${r}|${t.type}`}async function G(t){let e={fetchPage:async o=>{let i=await z("/api/v1/feed",{method:"POST",credentials:"include",headers:{"Content-Type":"application/json"},body:vt(o)});if(!i||!i.ok)return console.warn("[C1 Tracker] shopping feed POST failed",{status:i?.status,statusText:i?.statusText,cursor:o}),null;let l=await i.json();return o||console.log("[C1 Tracker] shopping feed first page",{count:l.count,itemCount:l.items?.length??0,nextPageToken:l.pagination?.nextPageToken}),l},getNextCursor:o=>o.pagination?.nextPageToken??null,getItems:o=>o.items??[],dedupeKey:yt,...t?{onPage:t}:{},maxPages:40},n=await V(e),r=[],a=0;for(let o of n.items){let i=bt(o);i?r.push(i):a++}return console.log("[C1 Tracker] shopping walk done",{rawItems:n.items.length,normalized:r.length,droppedDuringNormalize:a,pagesWalked:n.pagesWalked,hitCap:n.hitCap}),{items:r,hitCap:n.hitCap,pagesWalked:n.pagesWalked}}function wt(t,e){let n=`https://capitaloneoffers.com/feed/${encodeURIComponent(t.userId)}`,r=`?numberOfColumnsInGrid=5&viewInstanceId=${t.viewInstanceId}&contentSlug=ease-web-l1`;return e?`${n}${r}&cursor=${e}`:`${n}${r}`}function kt(t){let e=t.merchantTLD??"",n=t.buttonText??"";return e&&n?`${e}|${n}`:t.id??null}function Tt(t){let e=[];for(let n of t)if(n.type==="Carousel")for(let r of n.tiles??[])e.push(r);else e.push(n);return e}async function X(t,e){let n={fetchPage:async o=>{let i=await z(wt(t,o),{method:"GET",credentials:"include",headers:{Accept:"application/json"}});return!i||!i.ok?(console.warn("[C1 Tracker] offers feed GET failed",{status:i?.status,statusText:i?.statusText,cursor:o}),null):await i.json()},getNextCursor:o=>o.cursor??null,getItems:o=>Tt(o.data??[]),dedupeKey:kt,...e?{onPage:e}:{},maxPages:40},r=await V(n),a=[];for(let o of r.items)for(let i of W(o,t))a.push(i);return{items:a,hitCap:r.hitCap,pagesWalked:r.pagesWalked}}function O(t,e,n=0){if(n>6||t===null||typeof t!="object")return null;let r=t;for(let a of e){let o=r[a];if(typeof o=="string"&&o.length>0)return o}for(let a of Object.keys(r)){let o=r[a];if(o&&typeof o=="object"){let i=O(o,e,n+1);if(i)return i}}return null}function U(t){let e=new RegExp(`\\\\?"${t}\\\\?"\\s*,\\s*\\\\?"([^"\\\\]+)\\\\?"`),n=document.getElementsByTagName("script");for(let r=0;r<n.length;r++){let a=n[r].textContent;if(!a||a.indexOf(t)<0)continue;let o=a.match(e);if(o&&o[1])return o[1]}return null}function It(){let t=null,e=null;try{e=new URLSearchParams(window.location.search).get("viewInstanceId")}catch{}let n=window.location.pathname.match(/^\/feed\/([^/?#]+)/);if(n&&n[1]&&(t=decodeURIComponent(n[1])),t||(t=U("maybeSelectedArid")),e||(e=U("viewInstanceId")),!t||!e)try{let r=document.getElementById("__NEXT_DATA__");if(r?.textContent){let a=JSON.parse(r.textContent);t||(t=O(a,["userId","accountReferenceId"])),e||(e=O(a,["viewInstanceId"]))}}catch{}if(!e&&t)try{typeof crypto<"u"&&typeof crypto.randomUUID=="function"&&(e=crypto.randomUUID())}catch{}return t&&e?{userId:t,viewInstanceId:e}:(console.warn("[C1 Tracker] getOffersBrowseContext (sync) failed",{pathname:window.location.pathname,search:window.location.search,userId:t,viewInstanceId:e,hasNextData:!!document.getElementById("__NEXT_DATA__")}),null)}async function K(){let t=It();if(t)return t;let e=null,n=null;try{n=new URLSearchParams(window.location.search).get("viewInstanceId")}catch{}try{let r=await fetch("/xhr/shopping-trips?limit=1&offset=0&status[]=Activated&status[]=Adjusted&status[]=Completed&status[]=Inactive&status[]=Ineligible&status[]=Pending&status[]=Waiting",{method:"POST",credentials:"include"});if(r.ok){let o=(await r.json())?.data?.[0];o&&typeof o.accountReferenceId=="string"&&(e=o.accountReferenceId)}}catch(r){console.warn("[C1 Tracker] trips-API fallback for userId failed:",r)}if(!n&&e)try{typeof crypto<"u"&&typeof crypto.randomUUID=="function"&&(n=crypto.randomUUID())}catch{}return e&&n?{userId:e,viewInstanceId:n}:(console.warn("[C1 Tracker] fetchOffersBrowseContext failed",{userId:e,viewInstanceId:n}),null)}function Ct(t,e){return e==="events"?"event":e==="price-drops"?"deal":e==="new-customer"?"new":e==="recently-viewed"?"retarget":t==="great_deal"?"deal":""}function Et(t){return`${t.merchant} ${t.domain} ${t.rewardDisplay} ${t.itemType} ${t.exclusions}`.toLowerCase()}function St(t){if(!t)return"";try{return new Date(t).toLocaleDateString(void 0,{month:"short",day:"numeric"})}catch{return""}}function Ot(t,e){let n=e.map(a=>{let o=m(Et(a)),i=a.pill?`<span class="c1t-pill ${Ct(a.itemType,a.bucketCategory)}">${m(a.pill)}</span>`:"",l=a.eventEnd?`<span class="c1t-event-end">ends ${m(St(a.eventEnd))}</span>`:"",p=a.exclusions??"",s=p?` title="${m(p)}"`:"",f=p?m(p):"",g=p.length>60,d=f?g?`<div class="c1t-excl-cell"${s}>
                       <span class="c1t-excl-text">${f}</span><button type="button" class="c1t-excl-toggle">(more)</button>
                   </div>`:`<div class="c1t-excl-cell"${s}><span class="c1t-excl-text">${f}</span></div>`:"";return`<tr class="c1t-row-click"
            data-merchant="${m(a.merchant)}"
            data-bucket-id="${m(t.id)}"
            data-search="${o}"
            data-method="${m(a.activation.method)}"
            data-activation-url="${m(a.activation.url)}">
            <td>${m(a.merchant)}</td>
            <td><span class="c1t-reward">${m(a.rewardDisplay)}</span></td>
            <td>${i}</td>
            <td>${l}</td>
            <td>${d}</td>
        </tr>`}).join(""),r=t.initiallyOpen?" open":"";return`<details class="c1t-bucket" data-bucket-id="${t.id}"${r}>
        <summary>${m(t.label)} <span class="c1t-bucket-count">(${e.length})</span></summary>
        <table>
            <thead>
                <tr><th>Merchant</th><th>Reward</th><th>Badge</th><th>Ends</th><th>Exclusions</th></tr>
            </thead>
            <tbody>${n}</tbody>
        </table>
    </details>`}function At(t){switch(t){case"multiplier":return"Multipliers";case"percent":return"Percent";case"fixed-cash":return"Cash";case"fixed-points":return"Points"}}function $t(t){let e=[],n=new Set;for(let r of t.bucketOrder){let a=q[r];a&&(n.has(a.group)||(n.add(a.group),e.push(`<button class="c1t-jump-chip" data-jump-to="${a.id}">${m(At(a.group))}</button>`)))}return e.join("")}function Rt(t){let e=t.dataset.activationUrl;e&&window.open(e,"_blank","noopener")}async function Lt(t){let e=t.dataset.activationUrl;if(!e)return;let n=t.dataset.merchant??"merchant",r=window.open("about:blank","_blank");try{let a=await fetch(e,{method:"POST",credentials:"include"});if(!a.ok)throw new Error(`Activation returned ${a.status}`);let o=await a.json(),i=o?.offer?o.offer:o,l=i?.affiliate?.redirectUrl;if(l&&r){r.location=l;return}let p=i?.cardLinked?.cardLinkedOfferDetail;if(i?.cardLinked&&p?.isActivated){r?.close?.(),alert(`${n} card-linked offer activated. Use your card as usual \u2014 no redirect needed.`);return}if(i?.cardLinked?.cardLinkedOfferDetail?.activationLimitsReached){r?.close?.(),alert("Card-linked activation limit reached \u2014 cancel an existing activation and try again.");return}console.warn("[C1 Tracker] Activation POST returned detail shape (no redirectUrl)",i),r?.close?.(),alert("Activation failed \u2014 response had no redirect and no card-linked activation.")}catch(a){r?.close?.(),alert("Activation failed: "+(a instanceof Error?a.message:String(a)))}}function Mt(t){t.addEventListener("click",e=>{let n=e.target;if(!n)return;let r=n.closest(".c1t-excl-toggle");if(r){e.stopPropagation(),e.preventDefault();let o=r.closest(".c1t-excl-cell");if(o){let i=o.classList.toggle("c1t-excl-expanded");r.textContent=i?"(less)":"(more)"}return}let a=n.closest("tr[data-method]");a&&(a.dataset.method==="href"?Rt(a):a.dataset.method==="post-offers"&&Lt(a))})}function Pt(t){let e=t.querySelector("#c1t-browse-search input"),n=t.querySelector("#c1t-browse-search button");if(!e)return;let r=new Map;t.querySelectorAll("details[data-bucket-id]").forEach(i=>{let l=i,p=l.dataset.bucketId??"";r.set(p,l.open)});let a=null,o=i=>{let l=i.trim().toLowerCase(),p=l.length===0;t.querySelectorAll("details[data-bucket-id]").forEach(f=>{let g=f,d=g.dataset.bucketId??"",b=g.querySelectorAll("tr[data-search]"),v=0;b.forEach(w=>{let c=w.dataset.search??"",u=p||c.includes(l);w.style.display=u?"":"none",u&&v++}),v===0&&!p?g.style.display="none":(g.style.display="",p?g.open=r.get(d)??!1:g.open=!0)})};e.addEventListener("input",()=>{a&&clearTimeout(a),a=setTimeout(()=>o(e.value),100)}),n&&n.addEventListener("click",()=>{e.value="",o("")})}function Bt(t){let e=t.querySelector("#c1t-browse-nav");e&&e.addEventListener("click",n=>{let r=n.target;if(!r)return;let a=r.closest("[data-jump-to]");if(!a)return;let o=a.dataset.jumpTo;if(!o)return;let i=t.querySelector(`details[data-bucket-id="${o}"]`);i&&(i.open=!0,i.scrollIntoView({behavior:"smooth",block:"start"}))})}var J=(t,e)=>{let n=t.querySelector("#c1t-content");if(!n)return;let r=e.bucketOrder.map(l=>{let p=q[l];if(!p)return"";let s=e.buckets[l];return!s||!s.length?"":Ot(p,s)}).join(""),a=$t(e),o=e.stats.hitCap?`Stopped at ${e.stats.total} items (max pages reached)`:`${e.stats.total} offers across ${e.bucketOrder.length} buckets`;n.innerHTML=`
        <div id="c1t-browse-search">
            <input type="search" placeholder="Search merchant / reward / type..." />
            <button type="button">Clear</button>
        </div>
        <div id="c1t-browse-nav">${a}</div>
        <div id="c1t-browse-stats">${m(o)}</div>
        <div id="c1t-browse-body">${r||'<div style="padding:40px;text-align:center;opacity:0.7;">No offers found.</div>'}</div>
        <div id="c1t-browse-footer">Click a row to activate. Shopping rows open the pre-signed href; offers rows POST then redirect.</div>
    `;let i=n.querySelector("#c1t-browse-body");i&&Mt(i),Pt(n),Bt(n)};(async function(){"use strict";let t=S();if(!t){alert("Please run this on capitaloneshopping.com or capitaloneoffers.com");return}let n=L()==="browse"?"browse":"trips";if(document.getElementById("c1t-fab")){document.getElementById("c1t-overlay")?.classList.add("open");return}console.log("[C1 Tracker Bookmarklet] Running on",t,"defaultTab=",n);let r;function a(p,s,f){if(!r)return;let d=I(f==="data"?{data:p}:{items:p});d.stats.isLoading=!0,d.stats.loadingText=`Loading page ${s} (${d.stats.total} trips)`,r.setTabData("trips",d)}async function o(){return t==="shopping"?I(await B({onProgress:(p,s)=>a(p,s,"items")})):I(await P({onProgress:(p,s)=>a(p,s,"data")}))}async function i(){let p=(d,b)=>{let v=document.querySelector("#c1t-loading");v&&(v.textContent=`Loaded ${d} pages, ${b} offers...`)};if(t==="shopping"){let d=await G(p),b=A(d.items);return b.stats.hitCap=d.hitCap,b.stats.pagesWalked=d.pagesWalked,b}let s=await K();if(!s)throw new Error("Could not capture offers feed context (userId + viewInstanceId). Open DevTools console for diagnostics. The URL should look like /feed/<userId>?viewInstanceId=<uuid>. Try clicking into the feed grid once, then re-run.");let f=await X(s,p),g=A(f.items);return g.stats.hitCap=f.hitCap,g.stats.pagesWalked=f.pagesWalked,g}r=_({title:`${t==="offers"?"Cap One Offers":"Cap One Shopping"} Tracker`,defaultTabId:n,tabs:[{id:"trips",label:"Trips",render:F,getBadgeCount:p=>p?.stats?.withCredit??0,onActivate:o,loadingText:"Fetching shopping trips data..."},{id:"browse",label:"Browse",render:J,onActivate:i,loadingText:"Walking offers feed... (0 pages)"}]}),r.ensureFab(),r.ensureOverlay(),document.getElementById("c1t-overlay")?.classList.add("open"),r.setActiveTab(n)})();})();
