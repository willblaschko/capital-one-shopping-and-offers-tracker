"use strict";(()=>{var Z={offers:{hostname:"capitaloneoffers",pages:{trips:"/shopping-trips",browse:"/feed"},trips:{apiPattern:t=>t.includes("/xhr/shopping-trips"),apiEndpoint:"/xhr/shopping-trips?limit=100&offset=0&status[]=Activated&status[]=Adjusted&status[]=Completed&status[]=Inactive&status[]=Ineligible&status[]=Pending&status[]=Waiting"},browse:{apiPattern:t=>t.includes("/feed/")&&t.includes("viewInstanceId=")}},shopping:{hostname:"capitaloneshopping",pages:{trips:"/account-settings/shopping-trips",browse:"/"},trips:{apiPattern:t=>t.includes("/api/v1/trip_orders"),apiEndpoint:"/api/v1/trip_orders"},browse:{apiPattern:t=>t.endsWith("/api/v1/feed"),apiEndpoint:"/api/v1/feed"}}};function O(){return window.location.hostname.includes("capitaloneoffers")?"offers":window.location.hostname.includes("capitaloneshopping")?"shopping":null}function L(){let t=O();if(!t)return null;let e=window.location.pathname,r=Z[t].pages;return e.startsWith(r.trips)?"trips":t==="shopping"&&(e==="/"||e==="")||t==="offers"&&e.startsWith(r.browse)?"browse":null}function tt(t){if(!t)return[];if(Array.isArray(t))return t;let e=t;return Array.isArray(e.items)?e.items:Array.isArray(e.shoppingTrips)?e.shoppingTrips:Array.isArray(e.trip_orders)?e.trip_orders:e.data&&Array.isArray(e.data)?e.data:e.data&&typeof e.data=="object"&&Array.isArray(e.data.items)?e.data.items:[]}function et(t){let e=t.orderAmount??t.order_amount??(t.trxnTotalCents!=null?t.trxnTotalCents/100:null),r=t.creditAmount??t.credit_amount??(t.payoutAmountCents!=null?t.payoutAmountCents/100:null),n=t.orderId??t.order_id??null,o=r!==null&&Number(r)>0,a=t.status??"Unknown";a==="Waiting"?a="Created":(a==="Inactive"||a==="Ineligible")&&(a="Canceled");let i=a;return o&&a.toLowerCase()==="canceled"?i="Completed":a.toLowerCase()==="pending"&&(i=o?"Pending \u2713":"Pending ?"),{id:t.id??t.tripId??t.activatedOfferId??null,tripId:t.tripId??t.trip_id??t.id??t.activatedOfferId??null,orderId:n,merchant:t.vendor??t.merchantName??t.merchantDisplayName??t.merchant??t.domain??"Unknown",domain:t.domain??null,status:i,rawStatus:a,orderAmount:e!==null?Number(e):null,creditAmount:r!==null?Number(r):null,date:t.createdAt??t.created_at??t.clickDate??t.date??null,hasOrderId:n!==null,hasAmount:e!==null&&Number(e)>0,hasCreditAmount:o,rewardDisplay:t.rewardsSummaryDisplayRate??(Array.isArray(t.rewards)?t.rewards[0]?.displayRate:void 0)??"",exclusions:t.merchantExclusions??"",raw:t}}function I(t){let r=tt(t).map(et);return{trips:r,stats:{total:r.length,withOrderId:r.filter(n=>n.hasOrderId).length,withAmount:r.filter(n=>n.hasAmount).length,withCredit:r.filter(n=>n.hasCreditAmount).length,pending:r.filter(n=>n.status.toLowerCase().includes("pending")).length,created:r.filter(n=>n.status.toLowerCase()==="created").length}}}var M=100,nt=50,rt="/xhr/shopping-trips?limit="+M+"&status[]=Activated&status[]=Adjusted&status[]=Completed&status[]=Inactive&status[]=Ineligible&status[]=Pending&status[]=Waiting";async function B(t={}){let e=[];for(let r=0;r<nt;r++){let n=rt+"&offset="+r*M,o=await fetch(n,{method:"POST",credentials:"include"});if(!o.ok)throw new Error("shopping-trips returned "+o.status);let a=await o.json(),i=Array.isArray(a.data)?a.data:[];if(e.push(...i),t.onProgress?.(e,r+1),a.hasMore!==!0||i.length===0)break}return{data:e}}var S=100,ot=50;async function F(t={}){let e=[];for(let r=0;r<ot;r++){let n=r*S,o="/api/v1/trip_orders?limit="+S+"&offset="+n+"&sort=desc",a=await fetch(o,{credentials:"include"});if(!a.ok)throw new Error("trip_orders returned "+a.status);let i=await a.json(),c=Array.isArray(i.items)?i.items:[];if(e.push(...c),t.onProgress?.(e,r+1),c.length<S)break}return{items:e}}var T='<svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 15V10"/><path d="M10 15V5"/><path d="M16 15V8"/><path d="M3 17h14"/></svg>',at=`
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
        font-size: 12px !important;
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
        font-size: 15px !important;
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
        font-size: 15px !important;
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
        font-size: 14px !important;
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
        font-size: 14px !important;
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
        font-size: 13px !important;
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
        font-size: 13px !important;
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
        font-size: 14px !important;
        color: var(--c1t-text) !important;
    }
    #c1t-table th {
        text-align: left !important;
        padding: 8px 12px !important;
        border-bottom: 1px solid var(--c1t-border) !important;
        font-weight: 500 !important;
        font-size: 12px !important;
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
        font-size: 12px !important;
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
    #c1t-footer details { font-size: 13px !important; color: var(--c1t-text-muted) !important; }
    #c1t-footer summary { cursor: pointer !important; color: var(--c1t-text-muted) !important; }
    #c1t-footer summary:hover { color: var(--c1t-text) !important; }
    #c1t-footer pre {
        background: var(--c1t-bg) !important;
        border: 1px solid var(--c1t-border) !important;
        padding: 10px !important;
        border-radius: 6px !important;
        overflow: auto !important;
        max-height: 220px !important;
        font-size: 13px !important;
        margin-top: 8px !important;
        color: var(--c1t-text) !important;
        font-family: var(--c1t-font-mono) !important;
        line-height: 1.5 !important;
    }

    #c1t-loading {
        padding: 40px 20px !important;
        text-align: center !important;
        color: var(--c1t-text-muted) !important;
        font-size: 14px !important;
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
        font-size: 14px !important;
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
        font-size: 13px !important;
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
        font-size: 13px !important;
        font-family: var(--c1t-font) !important;
        transition: color 0.12s, border-color 0.12s !important;
    }
    .c1t-jump-chip:hover { color: var(--c1t-text) !important; border-color: var(--c1t-border-strong) !important; }
    #c1t-browse-stats {
        padding: 6px 14px !important;
        font-size: 13px !important;
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
        font-size: 14px !important;
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
        font-size: 12px !important;
        color: var(--c1t-text-muted) !important;
        transition: transform 0.12s !important;
    }
    .c1t-bucket[open] > summary::before { transform: rotate(90deg) !important; }
    .c1t-bucket-count { color: var(--c1t-text-muted) !important; font-weight: 400 !important; font-size: 13px !important; }
    .c1t-bucket table { width: 100% !important; border-collapse: collapse !important; font-size: 14px !important; }
    .c1t-bucket th {
        text-align: left !important;
        padding: 6px 10px !important;
        border-top: 1px solid var(--c1t-border) !important;
        border-bottom: 1px solid var(--c1t-border) !important;
        font-weight: 500 !important;
        font-size: 12px !important;
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
        font-size: 12px !important;
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
        font-size: 13px !important;
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
        font-size: 13px !important;
        text-decoration: none !important;
    }
    .c1t-excl-toggle:hover { text-decoration: underline !important; }
    .c1t-event-end { font-size: 13px !important; color: var(--c1t-text-muted) !important; white-space: nowrap !important; }
    #c1t-browse-footer {
        padding: 8px 14px !important;
        font-size: 13px !important;
        color: var(--c1t-text-muted) !important;
        border-top: 1px solid var(--c1t-border) !important;
        background: var(--c1t-bg-elevated) !important;
        flex-shrink: 0 !important;
    }
`;function A(t){return t==null||t===0?"\u2014":"$"+Number(t).toFixed(2)}function it(t){if(!t)return"\u2014";try{return new Date(t).toLocaleDateString()}catch{return"\u2014"}}function g(t){if(t==null)return"";let e=document.createElement("div");return e.textContent=String(t),e.innerHTML}function st(t){let e=(t||"").toLowerCase();return e.includes("completed")?"completed":e==="pending \u2713"?"pending-good":e==="pending ?"||e.includes("pending")?"pending-uncertain":e.includes("created")?"created":e.includes("activated")?"activated":e.includes("cancel")?"canceled":e.includes("adjust")?"adjusted":""}var _=(t,e)=>{if(console.log("[C1 Tracker] renderTripsToModal called - data:",!!e,"overlay:",!!t),!e)return;let{trips:r,stats:n}=e,o=t.querySelector("#c1t-content");if(console.log("[C1 Tracker] renderTripsToModal - content element:",!!o,"trips:",r?.length),!o)return;let i=o.querySelector("#c1t-table-wrap")?.scrollTop??0,c=n.isLoading?`<span class="stat c1t-loading-pill">\u23F3 ${g(n.loadingText??"Loading\u2026")}</span>`:"";o.innerHTML=`
        <div id="c1t-stats">
            <span class="stat"><strong>${n.total}</strong> total</span>
            <span class="stat"><strong>${n.withOrderId}</strong> tracked</span>
            <span class="stat"><strong>${n.withAmount}</strong> with amount</span>
            <span class="stat"><strong>${n.withCredit}</strong> with cashback</span>
            ${c}
        </div>
        <div id="c1t-filters">
            <button class="c1t-filter-btn active" data-filter="all">All (${n.total})</button>
            <button class="c1t-filter-btn" data-filter="amount">With Amount (${n.withAmount})</button>
            <button class="c1t-filter-btn" data-filter="tracked">Tracked (${n.withOrderId})</button>
            <button class="c1t-filter-btn" data-filter="pending">Pending (${n.pending})</button>
            <button class="c1t-filter-btn" data-filter="created">Waiting (${n.created})</button>
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
                    ${r.map(s=>{let d=s.hasCreditAmount?"amt":s.hasOrderId?"tracked":"",m=st(s.status),f=s.exclusions??"",b=f.length>60,x=f?b?`<div class="c1t-excl-cell" title="${g(f)}"><span class="c1t-excl-text">${g(f)}</span><button type="button" class="c1t-excl-toggle">(more)</button></div>`:`<div class="c1t-excl-cell" title="${g(f)}"><span class="c1t-excl-text">${g(f)}</span></div>`:'<span style="opacity:0.4">\u2014</span>';return`
                                <tr class="${d}" data-filter-amount="${s.hasAmount}" data-filter-tracked="${s.hasOrderId}" data-filter-pending="${s.status.toLowerCase().includes("pending")}" data-filter-created="${s.status.toLowerCase()==="created"}">
                                    <td title="${g(s.domain)}">${g(s.merchant)}</td>
                                    <td class="c">${it(s.date)}</td>
                                    <td class="r ${s.hasAmount?"c1t-amount":""}">${A(s.orderAmount)}</td>
                                    <td class="r ${s.hasCreditAmount?"c1t-credit":""}">${A(s.creditAmount)}</td>
                                    <td>${g(s.rewardDisplay)||'<span style="opacity:0.4">\u2014</span>'}</td>
                                    <td class="c"><span class="c1t-status ${m}">${g(s.status)}</span></td>
                                    <td class="c">${s.hasOrderId?"\u2713":"\u2014"}</td>
                                    <td>${x}</td>
                                </tr>
                            `}).join("")}
                </tbody>
            </table>
        </div>
        <div id="c1t-footer">
            <details>
                <summary>Show Raw JSON</summary>
                <pre>${g(JSON.stringify(r.slice(0,30).map(s=>s.raw),null,2))}${r.length>30?`

... and `+(r.length-30)+" more":""}</pre>
            </details>
        </div>
    `;let p=o.querySelector("#c1t-table-wrap");p&&i>0&&(p.scrollTop=i),o.querySelectorAll(".c1t-filter-btn").forEach(s=>{s.addEventListener("click",function(){o.querySelectorAll(".c1t-filter-btn").forEach(m=>m.classList.remove("active")),this.classList.add("active");let d=this.dataset.filter;o.querySelectorAll("#c1t-tbody tr").forEach(m=>{if(d==="all")m.style.display="";else if(d){let f=`filter${d.charAt(0).toUpperCase()+d.slice(1)}`;m.style.display=m.dataset[f]==="true"?"":"none"}})})}),o.querySelectorAll(".c1t-excl-toggle").forEach(s=>{s.addEventListener("click",d=>{d.stopPropagation(),d.preventDefault();let m=s.closest(".c1t-excl-cell");if(!m)return;let f=m.classList.toggle("c1t-excl-expanded");s.textContent=f?"(less)":"(more)"})})};function D(t){let{title:e,tabs:r,defaultTabId:n}=t;if(r.length===0)throw new Error("createTabbedUI: tabs must be non-empty");if(!r.find(l=>l.id===n))throw new Error(`createTabbedUI: defaultTabId "${n}" not in tabs`);let o=new Map,a=new Map,i=!1,c=n;function p(l){return r.find(u=>u.id===l)??null}function s(){if(i&&document.getElementById("c1t-styles"))return;let l=document.getElementById("c1t-styles");l||(l=document.createElement("style"),l.id="c1t-styles",l.textContent=at,(document.head||document.documentElement).appendChild(l)),i=!0}function d(){s();let l=document.getElementById("c1t-fab");if(l)return l;let u=document.createElement("button");return u.id="c1t-fab",u.innerHTML=T,u.title=e,u.addEventListener("click",()=>{m().classList.add("open"),f(c)}),document.body.appendChild(u),v(),u}function m(){s();let l=document.getElementById("c1t-overlay");if(l)return l;l=document.createElement("div"),l.id="c1t-overlay",l.innerHTML=`
            <div id="c1t-modal">
                <div id="c1t-header">
                    <h2>${T}<span>${g(e)}</span></h2>
                    <button id="c1t-close" aria-label="Close">\u2715</button>
                </div>
                <div id="c1t-tabs">
                    ${r.map(h=>`<button class="c1t-tab${h.id===c?" active":""}" data-tab-id="${g(h.id)}">${g(h.label)}</button>`).join("")}
                </div>
                <div id="c1t-content"></div>
            </div>
        `,document.body.appendChild(l);let u=l;return u.querySelector("#c1t-close")?.addEventListener("click",()=>{u.classList.remove("open")}),u.addEventListener("click",h=>{h.target===u&&u.classList.remove("open")}),u.querySelectorAll(".c1t-tab").forEach(h=>{h.addEventListener("click",()=>{let y=h.dataset.tabId;y&&f(y)})}),l}async function f(l){let u=p(l);if(!u)return;c=l;let h=document.getElementById("c1t-overlay");h&&h.querySelectorAll(".c1t-tab").forEach(w=>{w.classList.toggle("active",w.dataset.tabId===l)});let y=h?.querySelector("#c1t-content");if(o.has(l)){y&&u.render(h,o.get(l));return}if(!u.onActivate){y&&(y.innerHTML=`<div id="c1t-loading">${g(u.loadingText??"No data.")}</div>`);return}if(a.has(l)){await a.get(l);return}y&&(y.innerHTML=`<div id="c1t-loading">${g(u.loadingText??"Loading\u2026")}</div>`);let k=(async()=>{try{let w=await u.onActivate();w!=null&&x(l,w)}catch(w){console.error("[C1 Tracker] tab loader threw:",w);let Q=w instanceof Error?w.message:String(w),R=document.getElementById("c1t-content");R&&c===l&&(R.innerHTML=`<div id="c1t-loading">Error loading data: ${g(Q)}</div>`)}finally{a.delete(l)}})();a.set(l,k),await k}function b(l){f(l)}function x(l,u){let h=p(l);if(!h)return;o.set(l,u),v();let y=document.getElementById("c1t-overlay");y&&c===l&&h.render(y,u)}function v(){let l=document.getElementById("c1t-fab");if(!l)return;let u=0,h=!1;for(let y of r){if(!o.has(y.id)||(h=!0,!y.getBadgeCount))continue;let k=y.getBadgeCount(o.get(y.id));k>u&&(u=k)}h?l.classList.add("has-data"):l.classList.remove("has-data"),l.innerHTML=u>0?`${T}<span class="badge">${u}</span>`:T}return document.addEventListener("keydown",l=>{if(l.key==="Escape"){let u=document.getElementById("c1t-overlay");u&&u.classList.remove("open")}}),{ensureStyles:s,ensureFab:d,ensureOverlay:m,setActiveTab:b,setTabData:x,getActiveTabId:()=>c}}var ct=750,H=4,lt=5e3;function z(t){return new Promise(e=>setTimeout(e,t))}function pt(t){if(!t)return null;let e=Number(t);return Number.isFinite(e)&&e>=0?Math.min(e*1e3,3e4):null}async function N(t,e){for(let r=0;r<=H;r++)try{let n=await fetch(t,e);if(n.status!==429)return n;if(r===H)return console.warn("[C1 Tracker] 429 retries exhausted",{url:t}),n;let o=pt(n.headers.get("Retry-After"));if(o==null)try{let p=await n.clone().json();typeof p?.retry_after=="number"&&p.retry_after>=0&&(o=Math.min(p.retry_after*1e3,6e4))}catch{}let a=o??lt*Math.pow(2,r),i=Math.floor(Math.random()*500),c=a+i;console.warn("[C1 Tracker] 429 rate-limited; waiting",c,"ms",{attempt:r+1,url:t}),await z(c)}catch(n){return console.warn("[C1 Tracker] fetch threw",n),null}return null}var dt=/(\d+(?:\.\d+)?)X/i,ut=/(\d+(?:\.\d+)?)%/,mt=/\$([\d,]+(?:\.\d+)?)/,ft=/([\d,]+)\s*(miles|points)/i;function C(t){let e=String(t??""),r=e.trim();if(!r)return{type:"unknown",value:0,display:e};let n=r.match(dt);if(n&&n[1]!==void 0)return{type:"multiplier",value:parseFloat(n[1]),display:e};let o=r.match(mt);if(o&&o[1]!==void 0)return{type:"fixed-cash",value:parseFloat(o[1].replace(/,/g,"")),display:e};let a=r.match(ft);if(a&&a[1]!==void 0)return{type:"fixed-points",value:parseFloat(a[1].replace(/,/g,"")),display:e};let i=r.match(ut);return i&&i[1]!==void 0?{type:"percent",value:parseFloat(i[1]),display:e}:{type:"unknown",value:0,display:e}}function U(t){let e=t.stats??{};return e.cashbackV2??e.cashback??e.cashbackAmount??""}function gt(t){if(!t||!t.length)return null;let e=null;for(let r of t){let n=C(r.cashback);n.value>0&&(!e||n.value>e.value)&&(e={type:n.type,value:n.value,display:r.cashback})}return e}function bt(t){switch(t){case"great_deal":return"price-drops";case"event_placement":return"events";case"nca_deal":return"new-customer";case"retarget":case"retarget_non_product":return"recently-viewed";default:return"value"}}function W(t){if(!t.href)return null;let e=t.merchantName??"",r=t.domain??"";if(!e&&!r)return null;let n=t.stats??{},o=n.isCutType===!0||n.rewardType==="cut",a,i,c;if(o){let f=gt(n.cashbackCategories);if(f){a=f.type,i=f.value;let b=f.display.trim();c=b.toLowerCase().startsWith("up to")?b:"Up to "+b}else{let b=C(U(t));a=b.type,i=b.value,c=b.display.toLowerCase().startsWith("up to")?b.display:b.value?"Up to "+b.display:b.display}}else{let f=C(U(t));a=f.type,i=f.value,c=f.display}let p={method:"href",url:t.href},s=bt(t.type),d=t.id??null;return{id:d!==null?String(d):`shopping|${e||r}|${c}|${t.type}`,source:"shopping",itemType:t.type,merchant:e||r,domain:r||e,rewardType:a,rewardValue:i,rewardDisplay:c,activation:p,bucketCategory:s,pill:t.pill?.text??null,exclusions:n.exclusionsText??"",eventEnd:t.end??null,priceHistory:n.priceHistory??null,raw:t}}function ht(t,e){return`https://capitaloneoffers.com/xhr/feed/${encodeURIComponent(t.userId)}/offers/${e}`}function P(t,e){if(t.type==="Carousel"){let c=t.tiles??[],p=[];for(let s of c)for(let d of P(s,e))p.push(d);return p}let r=t.id,n=t.merchantTLD;if(!r||!n)return[];let o=t.buttonText??"",a=C(o),i=t.subText&&t.headingText?`${t.headingText} \u2014 ${t.subText}`:t.subText??t.headingText??t.text??"";return[{id:r,source:"offers",itemType:t.type,merchant:n,domain:n,rewardType:a.type,rewardValue:a.value,rewardDisplay:a.display,activation:{method:"post-offers",url:ht(e,r)},bucketCategory:"value",pill:t.badge?.text??null,exclusions:i,eventEnd:null,priceHistory:null,raw:t}]}function xt(t){let e=t.rewardValue;switch(t.rewardType){case"multiplier":return e>=30?"mult-30":e>=20?"mult-20":e>=10?"mult-10":"mult-1";case"percent":case"cut":return e>=40?"pct-40":e>=20?"pct-20":e>=10?"pct-10":"pct-1";case"fixed-cash":return e>=50?"cash-50":e>=25?"cash-25":"cash-0";case"fixed-points":return e>=1e4?"pts-10k":e>=5e3?"pts-5k":e>=1e3?"pts-1k":"pts-lt-1k";case"unknown":default:return"pct-1"}}var q=[{id:"mult-30",label:"Multipliers \xB7 30X+",group:"multiplier",initiallyOpen:!0},{id:"mult-20",label:"Multipliers \xB7 20\u201329X",group:"multiplier",initiallyOpen:!0},{id:"mult-10",label:"Multipliers \xB7 10\u201319X",group:"multiplier",initiallyOpen:!1},{id:"mult-1",label:"Multipliers \xB7 1\u20139X",group:"multiplier",initiallyOpen:!1},{id:"pct-40",label:"Percent \xB7 40%+",group:"percent",initiallyOpen:!0},{id:"pct-20",label:"Percent \xB7 20\u201339%",group:"percent",initiallyOpen:!0},{id:"pct-10",label:"Percent \xB7 10\u201319%",group:"percent",initiallyOpen:!1},{id:"pct-1",label:"Percent \xB7 1\u20139%",group:"percent",initiallyOpen:!1},{id:"cash-50",label:"Fixed Cash \xB7 $50+",group:"fixed-cash",initiallyOpen:!0},{id:"cash-25",label:"Fixed Cash \xB7 $25\u201349",group:"fixed-cash",initiallyOpen:!0},{id:"cash-0",label:"Fixed Cash \xB7 under $25",group:"fixed-cash",initiallyOpen:!1},{id:"pts-10k",label:"Fixed Points \xB7 10,000+",group:"fixed-points",initiallyOpen:!0},{id:"pts-5k",label:"Fixed Points \xB7 5,000\u20139,999",group:"fixed-points",initiallyOpen:!0},{id:"pts-1k",label:"Fixed Points \xB7 1,000\u20134,999",group:"fixed-points",initiallyOpen:!1},{id:"pts-lt-1k",label:"Fixed Points \xB7 under 1,000",group:"fixed-points",initiallyOpen:!1}],V=(()=>{let t={};for(let e of q)t[e.id]=e;return t})();function E(t){let e={};for(let a of t){let i=xt(a);(e[i]??(e[i]=[])).push(a)}for(let a of Object.keys(e))e[a].sort((i,c)=>c.rewardValue-i.rewardValue);let r=[],n={};for(let a of q){let i=e[a.id];i&&i.length&&(r.push(a.id),n[a.id]=i.length)}let o={total:t.length,byBucket:n};return{offers:t,buckets:e,bucketOrder:r,stats:o}}async function G(t){let e=t.maxPages??40,r=new Set,n=[],o=null,a=0;for(;a<e;){a>0&&await z(ct);let i=await t.fetchPage(o);if(!i)break;for(let p of t.getItems(i)){let s=t.dedupeKey(p);s&&r.has(s)||(s&&r.add(s),n.push(p))}a++,t.onPage?.(a,n.length),t.onProgress?.(n,a);let c=t.getNextCursor(i);if(!c)break;o=c}return{items:n,hitCap:a>=e,pagesWalked:a}}function vt(t){let e={limit:25};return t&&(e.nextPageToken=t),JSON.stringify({contentProps:{pagination:e},context:{device:{model:typeof navigator<"u"&&/Mac/.test(navigator.platform)?"Macintosh":"Unknown",manufacturer:"Unknown",memory:"8",concurrency:String(typeof navigator<"u"&&navigator.hardwareConcurrency||4)},browser:{name:"Chrome",version:"0",major:"0"},os:{name:"unknown",version:"0"},screen:{width:1920,height:1080,density:2},locale:typeof navigator<"u"&&navigator.language?navigator.language:"en-US",country:"US",location:{state:"",zipcode:"",latitude:null,longitude:null,isInCensusData:!1},page:{path:typeof window<"u"?window.location.pathname:"/",url:typeof window<"u"?window.location.href:"",referrer:typeof document<"u"?document.referrer:"",search:typeof window<"u"?window.location.search:"",title:typeof document<"u"?document.title:""},userAgent:typeof navigator<"u"?navigator.userAgent:""}})}function yt(t){let e=t;if(e.id!==void 0&&e.id!==null&&e.id!=="")return String(e.id);let r=t.merchantName??"",n=t.stats?.cashbackV2??t.stats?.cashback??"";return!r&&!n?null:`${r}|${n}|${t.type}`}async function X(t={}){let e=t.onProgress?(i,c)=>{let p=[];for(let s of i){let d=W(s);d&&p.push(d)}t.onProgress(p,c)}:void 0,r={fetchPage:async i=>{let c=await N("/api/v1/feed",{method:"POST",credentials:"include",headers:{"Content-Type":"application/json"},body:vt(i)});if(!c||!c.ok)return console.warn("[C1 Tracker] shopping feed POST failed",{status:c?.status,statusText:c?.statusText,cursor:i}),null;let p=await c.json();return i||console.log("[C1 Tracker] shopping feed first page",{count:p.count,itemCount:p.items?.length??0,nextPageToken:p.pagination?.nextPageToken}),p},getNextCursor:i=>i.pagination?.nextPageToken??null,getItems:i=>i.items??[],dedupeKey:yt,...t.onPage?{onPage:t.onPage}:{},...e?{onProgress:e}:{},maxPages:40},n=await G(r),o=[],a=0;for(let i of n.items){let c=W(i);c?o.push(c):a++}return console.log("[C1 Tracker] shopping walk done",{rawItems:n.items.length,normalized:o.length,droppedDuringNormalize:a,pagesWalked:n.pagesWalked,hitCap:n.hitCap}),{items:o,hitCap:n.hitCap,pagesWalked:n.pagesWalked}}function wt(t,e){let r=`https://capitaloneoffers.com/feed/${encodeURIComponent(t.userId)}`,n=`?numberOfColumnsInGrid=5&viewInstanceId=${t.viewInstanceId}&contentSlug=ease-web-l1`;return e?`${r}${n}&cursor=${e}`:`${r}${n}`}function kt(t){let e=t.merchantTLD??"",r=t.buttonText??"";return e&&r?`${e}|${r}`:t.id??null}function Tt(t){let e=[];for(let r of t)if(r.type==="Carousel")for(let n of r.tiles??[])e.push(n);else e.push(r);return e}async function K(t,e={}){let r=e.onProgress?(i,c)=>{let p=[];for(let s of i)for(let d of P(s,t))p.push(d);e.onProgress(p,c)}:void 0,n={fetchPage:async i=>{let c=await N(wt(t,i),{method:"GET",credentials:"include",headers:{Accept:"application/json"}});return!c||!c.ok?(console.warn("[C1 Tracker] offers feed GET failed",{status:c?.status,statusText:c?.statusText,cursor:i}),null):await c.json()},getNextCursor:i=>i.cursor??null,getItems:i=>Tt(i.data??[]),dedupeKey:kt,...e.onPage?{onPage:e.onPage}:{},...r?{onProgress:r}:{},maxPages:40},o=await G(n),a=[];for(let i of o.items)for(let c of P(i,t))a.push(c);return{items:a,hitCap:o.hitCap,pagesWalked:o.pagesWalked}}function $(t,e,r=0){if(r>6||t===null||typeof t!="object")return null;let n=t;for(let o of e){let a=n[o];if(typeof a=="string"&&a.length>0)return a}for(let o of Object.keys(n)){let a=n[o];if(a&&typeof a=="object"){let i=$(a,e,r+1);if(i)return i}}return null}function j(t){let e=new RegExp(`\\\\?"${t}\\\\?"\\s*,\\s*\\\\?"([^"\\\\]+)\\\\?"`),r=document.getElementsByTagName("script");for(let n=0;n<r.length;n++){let o=r[n].textContent;if(!o||o.indexOf(t)<0)continue;let a=o.match(e);if(a&&a[1])return a[1]}return null}function It(){let t=null,e=null;try{e=new URLSearchParams(window.location.search).get("viewInstanceId")}catch{}let r=window.location.pathname.match(/^\/feed\/([^/?#]+)/);if(r&&r[1]&&(t=decodeURIComponent(r[1])),t||(t=j("maybeSelectedArid")),e||(e=j("viewInstanceId")),!t||!e)try{let n=document.getElementById("__NEXT_DATA__");if(n?.textContent){let o=JSON.parse(n.textContent);t||(t=$(o,["userId","accountReferenceId"])),e||(e=$(o,["viewInstanceId"]))}}catch{}if(!e&&t)try{typeof crypto<"u"&&typeof crypto.randomUUID=="function"&&(e=crypto.randomUUID())}catch{}return t&&e?{userId:t,viewInstanceId:e}:(console.warn("[C1 Tracker] getOffersBrowseContext (sync) failed",{pathname:window.location.pathname,search:window.location.search,userId:t,viewInstanceId:e,hasNextData:!!document.getElementById("__NEXT_DATA__")}),null)}async function J(){let t=It();if(t)return t;let e=null,r=null;try{r=new URLSearchParams(window.location.search).get("viewInstanceId")}catch{}try{let n=await fetch("/xhr/shopping-trips?limit=1&offset=0&status[]=Activated&status[]=Adjusted&status[]=Completed&status[]=Inactive&status[]=Ineligible&status[]=Pending&status[]=Waiting",{method:"POST",credentials:"include"});if(n.ok){let a=(await n.json())?.data?.[0];a&&typeof a.accountReferenceId=="string"&&(e=a.accountReferenceId)}}catch(n){console.warn("[C1 Tracker] trips-API fallback for userId failed:",n)}if(!r&&e)try{typeof crypto<"u"&&typeof crypto.randomUUID=="function"&&(r=crypto.randomUUID())}catch{}return e&&r?{userId:e,viewInstanceId:r}:(console.warn("[C1 Tracker] fetchOffersBrowseContext failed",{userId:e,viewInstanceId:r}),null)}function Ct(t,e){return e==="events"?"event":e==="price-drops"?"deal":e==="new-customer"?"new":e==="recently-viewed"?"retarget":t==="great_deal"?"deal":""}function Et(t){return`${t.merchant} ${t.domain} ${t.rewardDisplay} ${t.itemType} ${t.exclusions}`.toLowerCase()}function St(t){if(!t)return"";try{return new Date(t).toLocaleDateString(void 0,{month:"short",day:"numeric"})}catch{return""}}function Ot(t,e){let r=e.map(o=>{let a=g(Et(o)),i=o.pill?`<span class="c1t-pill ${Ct(o.itemType,o.bucketCategory)}">${g(o.pill)}</span>`:"",c=o.eventEnd?`<span class="c1t-event-end">ends ${g(St(o.eventEnd))}</span>`:"",p=o.exclusions??"",s=p?` title="${g(p)}"`:"",d=p?g(p):"",m=p.length>60,f=d?m?`<div class="c1t-excl-cell"${s}>
                       <span class="c1t-excl-text">${d}</span><button type="button" class="c1t-excl-toggle">(more)</button>
                   </div>`:`<div class="c1t-excl-cell"${s}><span class="c1t-excl-text">${d}</span></div>`:"";return`<tr class="c1t-row-click"
            data-merchant="${g(o.merchant)}"
            data-bucket-id="${g(t.id)}"
            data-search="${a}"
            data-method="${g(o.activation.method)}"
            data-activation-url="${g(o.activation.url)}">
            <td>${g(o.merchant)}</td>
            <td><span class="c1t-reward">${g(o.rewardDisplay)}</span></td>
            <td>${i}</td>
            <td>${c}</td>
            <td>${f}</td>
        </tr>`}).join(""),n=t.initiallyOpen?" open":"";return`<details class="c1t-bucket" data-bucket-id="${t.id}"${n}>
        <summary>${g(t.label)} <span class="c1t-bucket-count">(${e.length})</span></summary>
        <table>
            <thead>
                <tr><th>Merchant</th><th>Reward</th><th>Badge</th><th>Ends</th><th>Exclusions</th></tr>
            </thead>
            <tbody>${r}</tbody>
        </table>
    </details>`}function Pt(t){switch(t){case"multiplier":return"Multipliers";case"percent":return"Percent";case"fixed-cash":return"Cash";case"fixed-points":return"Points"}}function $t(t){let e=[],r=new Set;for(let n of t.bucketOrder){let o=V[n];o&&(r.has(o.group)||(r.add(o.group),e.push(`<button class="c1t-jump-chip" data-jump-to="${o.id}">${g(Pt(o.group))}</button>`)))}return e.join("")}function Rt(t){let e=t.dataset.activationUrl;e&&window.open(e,"_blank","noopener")}async function At(t){let e=t.dataset.activationUrl;if(!e)return;let r=t.dataset.merchant??"merchant",n=window.open("about:blank","_blank");try{let o=await fetch(e,{method:"POST",credentials:"include"});if(!o.ok)throw new Error(`Activation returned ${o.status}`);let a=await o.json(),i=a?.offer?a.offer:a,c=i?.affiliate?.redirectUrl;if(c&&n){n.location=c;return}let p=i?.cardLinked?.cardLinkedOfferDetail;if(i?.cardLinked&&p?.isActivated){n?.close?.(),alert(`${r} card-linked offer activated. Use your card as usual \u2014 no redirect needed.`);return}if(i?.cardLinked?.cardLinkedOfferDetail?.activationLimitsReached){n?.close?.(),alert("Card-linked activation limit reached \u2014 cancel an existing activation and try again.");return}console.warn("[C1 Tracker] Activation POST returned detail shape (no redirectUrl)",i),n?.close?.(),alert("Activation failed \u2014 response had no redirect and no card-linked activation.")}catch(o){n?.close?.(),alert("Activation failed: "+(o instanceof Error?o.message:String(o)))}}function Lt(t){t.addEventListener("click",e=>{let r=e.target;if(!r)return;let n=r.closest(".c1t-excl-toggle");if(n){e.stopPropagation(),e.preventDefault();let a=n.closest(".c1t-excl-cell");if(a){let i=a.classList.toggle("c1t-excl-expanded");n.textContent=i?"(less)":"(more)"}return}let o=r.closest("tr[data-method]");o&&(o.dataset.method==="href"?Rt(o):o.dataset.method==="post-offers"&&At(o))})}function Mt(t){let e=t.querySelector("#c1t-browse-search input"),r=t.querySelector("#c1t-browse-search button");if(!e)return;let n=new Map;t.querySelectorAll("details[data-bucket-id]").forEach(i=>{let c=i,p=c.dataset.bucketId??"";n.set(p,c.open)});let o=null,a=i=>{let c=i.trim().toLowerCase(),p=c.length===0;t.querySelectorAll("details[data-bucket-id]").forEach(d=>{let m=d,f=m.dataset.bucketId??"",b=m.querySelectorAll("tr[data-search]"),x=0;b.forEach(v=>{let l=v.dataset.search??"",u=p||l.includes(c);v.style.display=u?"":"none",u&&x++}),x===0&&!p?m.style.display="none":(m.style.display="",p?m.open=n.get(f)??!1:m.open=!0)})};e.addEventListener("input",()=>{o&&clearTimeout(o),o=setTimeout(()=>a(e.value),100)}),r&&r.addEventListener("click",()=>{e.value="",a("")})}function Bt(t){let e=t.querySelector("#c1t-browse-nav");e&&e.addEventListener("click",r=>{let n=r.target;if(!n)return;let o=n.closest("[data-jump-to]");if(!o)return;let a=o.dataset.jumpTo;if(!a)return;let i=t.querySelector(`details[data-bucket-id="${a}"]`);i&&(i.open=!0,i.scrollIntoView({behavior:"smooth",block:"start"}))})}var Y=(t,e)=>{let r=t.querySelector("#c1t-content");if(!r)return;let o=r.querySelector("#c1t-browse-body")?.scrollTop??0,a=r.querySelector("#c1t-browse-search input"),i=a?.value??"",c=a===document.activeElement,p=a?.selectionStart??null,s=a?.selectionEnd??null,d=e.bucketOrder.map(v=>{let l=V[v];if(!l)return"";let u=e.buckets[v];return!u||!u.length?"":Ot(l,u)}).join(""),m=$t(e),f=e.stats.hitCap?`Stopped at ${e.stats.total} offers (max pages reached)`:`${e.stats.total} offers across ${e.bucketOrder.length} buckets`,b=e.stats.isLoading?` <span class="c1t-loading-pill">\u23F3 ${g(e.stats.loadingText??"Loading\u2026")}</span>`:"";r.innerHTML=`
        <div id="c1t-browse-search">
            <input type="search" placeholder="Search merchant / reward / type..." value="${g(i)}" />
            <button type="button">Clear</button>
        </div>
        <div id="c1t-browse-nav">${m}</div>
        <div id="c1t-browse-stats">${g(f)}${b}</div>
        <div id="c1t-browse-body">${d||'<div style="padding:40px;text-align:center;opacity:0.7;">No offers found.</div>'}</div>
        <div id="c1t-browse-footer">Click a row to activate. Shopping rows open the pre-signed href; offers rows POST then redirect.</div>
    `;let x=r.querySelector("#c1t-browse-body");if(x&&(Lt(x),o>0&&(x.scrollTop=o)),Mt(r),Bt(r),c){let v=r.querySelector("#c1t-browse-search input");if(v){if(v.focus(),p!==null&&s!==null)try{v.setSelectionRange(p,s)}catch{}i&&v.dispatchEvent(new Event("input",{bubbles:!0}))}}};(async function(){"use strict";let t=O();if(!t){alert("Please run this on capitaloneshopping.com or capitaloneoffers.com");return}let r=L()==="browse"?"browse":"trips";if(document.getElementById("c1t-fab")){document.getElementById("c1t-overlay")?.classList.add("open");return}console.log("[C1 Tracker Bookmarklet] Running on",t,"defaultTab=",r);let n;function o(s,d,m){if(!n)return;let b=I(m==="data"?{data:s}:{items:s});b.stats.isLoading=!0,b.stats.loadingText=`Loading page ${d} (${b.stats.total} trips)`,n.setTabData("trips",b)}async function a(){return t==="shopping"?I(await F({onProgress:(s,d)=>o(s,d,"items")})):I(await B({onProgress:(s,d)=>o(s,d,"data")}))}function i(s,d){if(!n)return;let m=E(s);m.stats.isLoading=!0,m.stats.loadingText=`Loading page ${d} (${m.stats.total} offers)`,n.setTabData("browse",m)}async function c(){let s=(b,x)=>{let v=document.querySelector("#c1t-loading");v&&(v.textContent=`Loaded ${b} pages, ${x} offers...`)};if(t==="shopping"){let b=await X({onPage:s,onProgress:i}),x=E(b.items);return x.stats.hitCap=b.hitCap,x.stats.pagesWalked=b.pagesWalked,x}let d=await J();if(!d)throw new Error("Could not capture offers feed context (userId + viewInstanceId). Open DevTools console for diagnostics. The URL should look like /feed/<userId>?viewInstanceId=<uuid>. Try clicking into the feed grid once, then re-run.");let m=await K(d,{onPage:s,onProgress:i}),f=E(m.items);return f.stats.hitCap=m.hitCap,f.stats.pagesWalked=m.pagesWalked,f}n=D({title:`${t==="offers"?"Cap One Offers":"Cap One Shopping"} Tracker`,defaultTabId:r,tabs:[{id:"trips",label:"Trips",render:_,getBadgeCount:s=>s?.stats?.withCredit??0,onActivate:a,loadingText:"Fetching shopping trips data..."},{id:"browse",label:"Browse",render:Y,onActivate:c,loadingText:"Walking offers feed... (0 pages)"}]}),n.ensureFab(),n.ensureOverlay(),document.getElementById("c1t-overlay")?.classList.add("open"),n.setActiveTab(r)})();})();
