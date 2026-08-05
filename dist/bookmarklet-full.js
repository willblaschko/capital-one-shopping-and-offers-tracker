"use strict";(()=>{var rt="3.7.0",nt={offers:{hostname:"capitaloneoffers",pages:{trips:"/shopping-trips",browse:"/feed"},trips:{apiPattern:t=>t.includes("/xhr/shopping-trips"),apiEndpoint:"/xhr/shopping-trips?limit=100&offset=0&status[]=Activated&status[]=Adjusted&status[]=Completed&status[]=Inactive&status[]=Ineligible&status[]=Pending&status[]=Waiting"},browse:{apiPattern:t=>t.includes("/feed/")&&t.includes("viewInstanceId=")}},shopping:{hostname:"capitaloneshopping",pages:{trips:"/account-settings/shopping-trips",browse:"/"},trips:{apiPattern:t=>t.includes("/api/v1/trip_orders"),apiEndpoint:"/api/v1/trip_orders"},browse:{apiPattern:t=>t.endsWith("/api/v1/feed"),apiEndpoint:"/api/v1/feed"}}};function E(){return window.location.hostname.includes("capitaloneoffers")?"offers":window.location.hostname.includes("capitaloneshopping")?"shopping":null}function F(){let t=E();if(!t)return null;let e=window.location.pathname,n=nt[t].pages;return e.startsWith(n.trips)?"trips":t==="shopping"&&(e==="/"||e==="")||t==="offers"&&e.startsWith(n.browse)?"browse":null}function ot(t){if(!t)return[];if(Array.isArray(t))return t;let e=t;return Array.isArray(e.items)?e.items:Array.isArray(e.shoppingTrips)?e.shoppingTrips:Array.isArray(e.trip_orders)?e.trip_orders:e.data&&Array.isArray(e.data)?e.data:e.data&&typeof e.data=="object"&&Array.isArray(e.data.items)?e.data.items:[]}function at(t){let e=t.orderAmount??t.order_amount??(t.trxnTotalCents!=null?t.trxnTotalCents/100:null),n=t.creditAmount??t.credit_amount??(t.payoutAmountCents!=null?t.payoutAmountCents/100:null),r=t.orderId??t.order_id??null,o=n!==null&&Number(n)>0,a=t.status??"Unknown";a==="Waiting"?a="Created":(a==="Inactive"||a==="Ineligible")&&(a="Canceled");let i=a;return o&&a.toLowerCase()==="canceled"?i="Completed":a.toLowerCase()==="pending"&&(i=o?"Pending \u2713":"Pending ?"),{id:t.id??t.tripId??t.activatedOfferId??null,tripId:t.tripId??t.trip_id??t.id??t.activatedOfferId??null,orderId:r,merchant:t.vendor??t.merchantName??t.merchantDisplayName??t.merchant??t.domain??"Unknown",domain:t.domain??null,status:i,rawStatus:a,orderAmount:e!==null?Number(e):null,creditAmount:n!==null?Number(n):null,date:t.createdAt??t.created_at??t.clickDate??t.date??null,hasOrderId:r!==null,hasAmount:e!==null&&Number(e)>0,hasCreditAmount:o,rewardDisplay:t.rewardsSummaryDisplayRate??(Array.isArray(t.rewards)?t.rewards[0]?.displayRate:void 0)??"",exclusions:t.merchantExclusions??"",raw:t}}function S(t){let n=ot(t).map(at);return{trips:n,stats:{total:n.length,withOrderId:n.filter(r=>r.hasOrderId).length,withAmount:n.filter(r=>r.hasAmount).length,withCredit:n.filter(r=>r.hasCreditAmount).length,pending:n.filter(r=>r.status.toLowerCase().includes("pending")).length,created:n.filter(r=>r.status.toLowerCase()==="created").length}}}var _=100,it=50,st="/xhr/shopping-trips?limit="+_+"&status[]=Activated&status[]=Adjusted&status[]=Completed&status[]=Inactive&status[]=Ineligible&status[]=Pending&status[]=Waiting";async function H(t={}){let e=[];for(let n=0;n<it;n++){let r=st+"&offset="+n*_,o=await fetch(r,{method:"POST",credentials:"include"});if(!o.ok)throw new Error("shopping-trips returned "+o.status);let a=await o.json(),i=Array.isArray(a.data)?a.data:[];if(e.push(...i),t.onProgress?.(e,n+1),a.hasMore!==!0||i.length===0)break}return{data:e}}var P=100,ct=50;async function D(t={}){let e=[];for(let n=0;n<ct;n++){let r=n*P,o="/api/v1/trip_orders?limit="+P+"&offset="+r+"&sort=desc",a=await fetch(o,{credentials:"include"});if(!a.ok)throw new Error("trip_orders returned "+a.status);let i=await a.json(),c=Array.isArray(i.items)?i.items:[];if(e.push(...c),t.onProgress?.(e,n+1),c.length<P)break}return{items:e}}var C='<svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 15V10"/><path d="M10 15V5"/><path d="M16 15V8"/><path d="M3 17h14"/></svg>',lt='<svg viewBox="0 0 20 20" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="10" cy="10" r="8"/><path d="M10 9v5"/><circle cx="10" cy="6.25" r="0.6" fill="currentColor" stroke="none"/></svg>',pt=`
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
    #c1t-header-actions {
        display: flex !important;
        align-items: center !important;
        gap: 6px !important;
        position: relative !important;
    }
    #c1t-info {
        background: transparent !important;
        border: 1px solid var(--c1t-border) !important;
        color: var(--c1t-text-muted) !important;
        width: 24px !important;
        height: 24px !important;
        min-width: 24px !important;
        border-radius: 5px !important;
        cursor: pointer !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        padding: 0 !important;
        box-sizing: border-box !important;
        font-family: var(--c1t-font) !important;
        transition: color 0.12s, border-color 0.12s !important;
    }
    #c1t-info:hover { color: var(--c1t-text) !important; border-color: var(--c1t-border-strong) !important; }
    #c1t-info.c1t-active { color: var(--c1t-accent) !important; border-color: var(--c1t-accent) !important; }
    #c1t-info-popover {
        position: absolute !important;
        top: calc(100% + 8px) !important;
        right: 0 !important;
        background: var(--c1t-bg-elevated) !important;
        border: 1px solid var(--c1t-border-strong) !important;
        border-radius: 6px !important;
        padding: 12px 14px !important;
        font-size: 13px !important;
        color: var(--c1t-text) !important;
        box-shadow: 0 6px 20px rgba(0,0,0,0.5) !important;
        min-width: 220px !important;
        max-width: 300px !important;
        z-index: 2 !important;
        display: none !important;
        line-height: 1.5 !important;
    }
    #c1t-info-popover.c1t-visible { display: block !important; }
    #c1t-info-popover .c1t-info-row {
        display: flex !important;
        justify-content: space-between !important;
        gap: 12px !important;
        color: var(--c1t-text-muted) !important;
        font-size: 12px !important;
    }
    #c1t-info-popover .c1t-info-row + .c1t-info-row { margin-top: 4px !important; }
    #c1t-info-popover .c1t-info-value {
        color: var(--c1t-text) !important;
        font-variant-numeric: tabular-nums !important;
        font-family: var(--c1t-font-mono) !important;
        font-size: 12px !important;
    }
    #c1t-info-popover .c1t-info-title {
        font-weight: 600 !important;
        color: var(--c1t-text) !important;
        font-size: 13px !important;
        margin-bottom: 8px !important;
    }
    #c1t-info-popover a {
        color: var(--c1t-accent) !important;
        text-decoration: none !important;
    }
    #c1t-info-popover a:hover { text-decoration: underline !important; }
    #c1t-info-popover .c1t-info-footer {
        margin-top: 10px !important;
        padding-top: 8px !important;
        border-top: 1px solid var(--c1t-border) !important;
        font-size: 11px !important;
        color: var(--c1t-text-muted) !important;
    }

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

    /* --- Loading banner (below tabs, above content) --- */
    #c1t-progress-banner {
        display: flex !important;
        align-items: center !important;
        gap: 10px !important;
        padding: 0 16px !important;
        background: rgba(97, 175, 239, 0.06) !important;
        border-bottom: 0 solid var(--c1t-border) !important;
        color: var(--c1t-text) !important;
        font-size: 13px !important;
        font-weight: 500 !important;
        flex-shrink: 0 !important;
        max-height: 0 !important;
        opacity: 0 !important;
        overflow: hidden !important;
        transition: max-height 0.2s ease, opacity 0.2s ease,
            padding 0.2s ease, border-bottom-width 0.2s ease !important;
    }
    #c1t-progress-banner.c1t-visible {
        max-height: 44px !important;
        opacity: 1 !important;
        padding-top: 10px !important;
        padding-bottom: 10px !important;
        border-bottom-width: 1px !important;
    }
    .c1t-spinner {
        width: 14px !important;
        height: 14px !important;
        border: 2px solid var(--c1t-border-strong) !important;
        border-top-color: var(--c1t-accent) !important;
        border-radius: 50% !important;
        display: inline-block !important;
        flex-shrink: 0 !important;
        animation: c1t-spin 0.8s linear infinite !important;
    }
    .c1t-progress-label { color: var(--c1t-text) !important; }
    .c1t-progress-label strong {
        color: var(--c1t-accent) !important;
        font-weight: 600 !important;
        font-variant-numeric: tabular-nums !important;
    }
    @keyframes c1t-spin { to { transform: rotate(360deg); } }

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
    #c1t-table.c1t-table-fixed { table-layout: fixed !important; }
    #c1t-table.c1t-table-fixed td {
        word-wrap: break-word !important;
        overflow-wrap: anywhere !important;
    }
    /* Zebra striping \u2014 subtle brightness lift on odd rows only. */
    #c1t-table tbody tr:nth-child(odd) { background: rgba(255,255,255,0.015) !important; }
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
        margin-bottom: 10px !important;
        background: var(--c1t-bg-elevated) !important;
        border: 1px solid var(--c1t-border) !important;
        border-radius: 6px !important;
    }
    /* Bucket group header \u2014 heavier hierarchy so it stands apart from the
       merchant rows inside. Accent-colored disclosure caret, larger label. */
    .c1t-bucket > summary {
        padding: 12px 14px !important;
        cursor: pointer !important;
        font-weight: 700 !important;
        font-size: 15px !important;
        color: var(--c1t-text) !important;
        list-style: none !important;
        user-select: none !important;
        display: flex !important;
        align-items: center !important;
        gap: 10px !important;
        letter-spacing: 0.01em !important;
        background: var(--c1t-bg-hover) !important;
        border-radius: 6px 6px 0 0 !important;
    }
    .c1t-bucket:not([open]) > summary { border-radius: 6px !important; }
    .c1t-bucket > summary:hover { background: rgba(97, 175, 239, 0.06) !important; }
    .c1t-bucket > summary::-webkit-details-marker { display: none !important; }
    .c1t-bucket > summary::before {
        content: '\u25B8' !important;
        font-size: 13px !important;
        color: var(--c1t-accent) !important;
        transition: transform 0.12s !important;
        flex-shrink: 0 !important;
    }
    .c1t-bucket[open] > summary::before { transform: rotate(90deg) !important; }
    .c1t-bucket-count {
        color: var(--c1t-text-muted) !important;
        font-weight: 400 !important;
        font-size: 13px !important;
        margin-left: auto !important;
    }
    .c1t-bucket table {
        width: 100% !important;
        border-collapse: collapse !important;
        font-size: 14px !important;
        table-layout: fixed !important;
    }
    /* Fixed column widths for browse rows \u2014 merchant/reward/badge/ends/exclusions.
       Adjust in the renderer if the column list changes. */
    .c1t-bucket colgroup col.merchant  { width: 22% !important; }
    .c1t-bucket colgroup col.reward    { width: 15% !important; }
    .c1t-bucket colgroup col.badge     { width: 15% !important; }
    .c1t-bucket colgroup col.ends      { width: 12% !important; }
    .c1t-bucket colgroup col.exclusions { width: 36% !important; }
    .c1t-bucket th {
        text-align: left !important;
        padding: 8px 12px !important;
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
        padding: 8px 12px !important;
        border-bottom: 1px solid var(--c1t-border) !important;
        color: var(--c1t-text) !important;
        font-variant-numeric: tabular-nums !important;
        word-wrap: break-word !important;
        overflow-wrap: anywhere !important;
        vertical-align: top !important;
    }
    /* Zebra rows to help scanning across long merchant names. */
    .c1t-bucket tbody tr:nth-child(odd) { background: rgba(255,255,255,0.015) !important; }
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
`;function B(t){return t==null||t===0?"\u2014":"$"+Number(t).toFixed(2)}function dt(t){if(!t)return"\u2014";try{return new Date(t).toLocaleDateString()}catch{return"\u2014"}}function f(t){if(t==null)return"";let e=document.createElement("div");return e.textContent=String(t),e.innerHTML}function ut(t){let e=(t||"").toLowerCase();return e.includes("completed")?"completed":e==="pending \u2713"?"pending-good":e==="pending ?"||e.includes("pending")?"pending-uncertain":e.includes("created")?"created":e.includes("activated")?"activated":e.includes("cancel")?"canceled":e.includes("adjust")?"adjusted":""}var z=(t,e)=>{if(console.log("[C1 Tracker] renderTripsToModal called - data:",!!e,"overlay:",!!t),!e)return;let{trips:n,stats:r}=e,o=t.querySelector("#c1t-content");if(console.log("[C1 Tracker] renderTripsToModal - content element:",!!o,"trips:",n?.length),!o)return;let i=o.querySelector("#c1t-table-wrap")?.scrollTop??0;o.innerHTML=`
        <div id="c1t-stats">
            <span class="stat"><strong>${r.total}</strong> total</span>
            <span class="stat"><strong>${r.withOrderId}</strong> tracked</span>
            <span class="stat"><strong>${r.withAmount}</strong> with amount</span>
            <span class="stat"><strong>${r.withCredit}</strong> with cashback</span>
        </div>
        <div id="c1t-filters">
            <button class="c1t-filter-btn active" data-filter="all">All (${r.total})</button>
            <button class="c1t-filter-btn" data-filter="amount">With Amount (${r.withAmount})</button>
            <button class="c1t-filter-btn" data-filter="tracked">Tracked (${r.withOrderId})</button>
            <button class="c1t-filter-btn" data-filter="pending">Pending (${r.pending})</button>
            <button class="c1t-filter-btn" data-filter="created">Waiting (${r.created})</button>
        </div>
        <div id="c1t-table-wrap">
            <table id="c1t-table" class="c1t-table-fixed">
                <colgroup>
                    <col style="width: 18%" />
                    <col style="width: 9%" />
                    <col style="width: 12%" />
                    <col style="width: 12%" />
                    <col style="width: 14%" />
                    <col style="width: 10%" />
                    <col style="width: 7%" />
                    <col style="width: 18%" />
                </colgroup>
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
                    ${n.map(s=>{let p=s.hasCreditAmount?"amt":s.hasOrderId?"tracked":"",d=ut(s.status),m=s.exclusions??"",b=m.length>60,g=m?b?`<div class="c1t-excl-cell" title="${f(m)}"><span class="c1t-excl-text">${f(m)}</span><button type="button" class="c1t-excl-toggle">(more)</button></div>`:`<div class="c1t-excl-cell" title="${f(m)}"><span class="c1t-excl-text">${f(m)}</span></div>`:'<span style="opacity:0.4">\u2014</span>';return`
                                <tr class="${p}" data-filter-amount="${s.hasAmount}" data-filter-tracked="${s.hasOrderId}" data-filter-pending="${s.status.toLowerCase().includes("pending")}" data-filter-created="${s.status.toLowerCase()==="created"}">
                                    <td title="${f(s.domain)}">${f(s.merchant)}</td>
                                    <td class="c">${dt(s.date)}</td>
                                    <td class="r ${s.hasAmount?"c1t-amount":""}">${B(s.orderAmount)}</td>
                                    <td class="r ${s.hasCreditAmount?"c1t-credit":""}">${B(s.creditAmount)}</td>
                                    <td>${f(s.rewardDisplay)||'<span style="opacity:0.4">\u2014</span>'}</td>
                                    <td class="c"><span class="c1t-status ${d}">${f(s.status)}</span></td>
                                    <td class="c">${s.hasOrderId?"\u2713":"\u2014"}</td>
                                    <td>${g}</td>
                                </tr>
                            `}).join("")}
                </tbody>
            </table>
        </div>
        <div id="c1t-footer">
            <details>
                <summary>Show Raw JSON</summary>
                <pre>${f(JSON.stringify(n.slice(0,30).map(s=>s.raw),null,2))}${n.length>30?`

... and `+(n.length-30)+" more":""}</pre>
            </details>
        </div>
    `;let c=o.querySelector("#c1t-table-wrap");c&&i>0&&(c.scrollTop=i),o.querySelectorAll(".c1t-filter-btn").forEach(s=>{s.addEventListener("click",function(){o.querySelectorAll(".c1t-filter-btn").forEach(d=>d.classList.remove("active")),this.classList.add("active");let p=this.dataset.filter;o.querySelectorAll("#c1t-tbody tr").forEach(d=>{if(p==="all")d.style.display="";else if(p){let m=`filter${p.charAt(0).toUpperCase()+p.slice(1)}`;d.style.display=d.dataset[m]==="true"?"":"none"}})})}),o.querySelectorAll(".c1t-excl-toggle").forEach(s=>{s.addEventListener("click",p=>{p.stopPropagation(),p.preventDefault();let d=s.closest(".c1t-excl-cell");if(!d)return;let m=d.classList.toggle("c1t-excl-expanded");s.textContent=m?"(less)":"(more)"})})};function j(t){let{title:e,tabs:n,defaultTabId:r}=t;if(n.length===0)throw new Error("createTabbedUI: tabs must be non-empty");if(!n.find(l=>l.id===r))throw new Error(`createTabbedUI: defaultTabId "${r}" not in tabs`);let o=new Map,a=new Map,i=new Map,c=!1,s=r;function p(l){return n.find(u=>u.id===l)??null}function d(){if(c&&document.getElementById("c1t-styles"))return;let l=document.getElementById("c1t-styles");l||(l=document.createElement("style"),l.id="c1t-styles",l.textContent=pt,(document.head||document.documentElement).appendChild(l)),c=!0}function m(){d();let l=document.getElementById("c1t-fab");if(l)return l;let u=document.createElement("button");return u.id="c1t-fab",u.innerHTML=C,u.title=e,u.addEventListener("click",()=>{b().classList.add("open"),g(s)}),document.body.appendChild(u),R(),u}function b(){d();let l=document.getElementById("c1t-overlay");if(l)return l;l=document.createElement("div"),l.id="c1t-overlay",l.innerHTML=`
            <div id="c1t-modal">
                <div id="c1t-header">
                    <h2>${C}<span>${f(e)}</span></h2>
                    <div id="c1t-header-actions">
                        <button id="c1t-info" aria-label="About / version" title="About">${lt}</button>
                        <button id="c1t-close" aria-label="Close">\u2715</button>
                        <div id="c1t-info-popover" role="dialog" aria-label="About">
                            <div class="c1t-info-title">Cap One Shopping &amp; Offers Tracker</div>
                            <div class="c1t-info-row">
                                <span>Version</span>
                                <span class="c1t-info-value">${f(rt)}</span>
                            </div>
                            <div class="c1t-info-row">
                                <span>Site</span>
                                <span class="c1t-info-value">${f(E()??"unknown")}</span>
                            </div>
                            <div class="c1t-info-footer">
                                <a href="https://github.com/willblaschko/capital-one-shopping-and-offers-tracker" target="_blank" rel="noopener">GitHub</a>
                                &middot; From
                                <a href="https://useyourcredits.com/" target="_blank" rel="noopener">UseYourCredits.com</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="c1t-tabs">
                    ${n.map(y=>`<button class="c1t-tab${y.id===s?" active":""}" data-tab-id="${f(y.id)}">${f(y.label)}</button>`).join("")}
                </div>
                <div id="c1t-progress-banner" role="status" aria-live="polite">
                    <span class="c1t-spinner"></span>
                    <span class="c1t-progress-label"></span>
                </div>
                <div id="c1t-content"></div>
            </div>
        `,document.body.appendChild(l);let u=l;u.querySelector("#c1t-close")?.addEventListener("click",()=>{u.classList.remove("open")}),u.addEventListener("click",y=>{y.target===u&&u.classList.remove("open")});let x=u.querySelector("#c1t-info"),v=u.querySelector("#c1t-info-popover");return x?.addEventListener("click",y=>{y.stopPropagation(),v?.classList.toggle("c1t-visible"),x.classList.toggle("c1t-active")}),v?.addEventListener("click",y=>y.stopPropagation()),u.addEventListener("click",()=>{v?.classList.contains("c1t-visible")&&(v.classList.remove("c1t-visible"),x?.classList.remove("c1t-active"))}),u.querySelectorAll(".c1t-tab").forEach(y=>{y.addEventListener("click",()=>{let w=y.dataset.tabId;w&&g(w)})}),l}async function g(l){let u=p(l);if(!u)return;s=l;let x=document.getElementById("c1t-overlay");x&&x.querySelectorAll(".c1t-tab").forEach(w=>{w.classList.toggle("active",w.dataset.tabId===l)}),I();let v=x?.querySelector("#c1t-content");if(o.has(l)){v&&u.render(x,o.get(l));return}if(!u.onActivate){v&&(v.innerHTML=`<div id="c1t-loading">${f(u.loadingText??"No data.")}</div>`);return}if(a.has(l)){await a.get(l);return}v&&(v.innerHTML=`<div id="c1t-loading">${f(u.loadingText??"Loading\u2026")}</div>`);let y=(async()=>{try{let w=await u.onActivate();w!=null&&k(l,w)}catch(w){console.error("[C1 Tracker] tab loader threw:",w);let et=w instanceof Error?w.message:String(w),M=document.getElementById("c1t-content");M&&s===l&&(M.innerHTML=`<div id="c1t-loading">Error loading data: ${f(et)}</div>`)}finally{a.delete(l),T(l,null)}})();a.set(l,y),await y}function h(l){g(l)}function k(l,u){let x=p(l);if(!x)return;o.set(l,u),R();let v=document.getElementById("c1t-overlay");v&&s===l&&x.render(v,u)}function T(l,u){u==null?i.delete(l):i.set(l,u),s===l&&I()}function I(){let l=document.getElementById("c1t-progress-banner");if(!l)return;let u=i.get(s),x=l.querySelector(".c1t-progress-label");u?(x&&(x.textContent=u),l.classList.add("c1t-visible")):l.classList.remove("c1t-visible")}function R(){let l=document.getElementById("c1t-fab");if(!l)return;let u=0,x=!1;for(let v of n){if(!o.has(v.id)||(x=!0,!v.getBadgeCount))continue;let y=v.getBadgeCount(o.get(v.id));y>u&&(u=y)}x?l.classList.add("has-data"):l.classList.remove("has-data"),l.innerHTML=u>0?`${C}<span class="badge">${u}</span>`:C}return document.addEventListener("keydown",l=>{if(l.key==="Escape"){let u=document.getElementById("c1t-overlay");u&&u.classList.remove("open")}}),{ensureStyles:d,ensureFab:m,ensureOverlay:b,setActiveTab:h,setTabData:k,setTabLoading:T,getActiveTabId:()=>s}}var mt=750,U=4,ft=5e3;function V(t){return new Promise(e=>setTimeout(e,t))}function gt(t){if(!t)return null;let e=Number(t);return Number.isFinite(e)&&e>=0?Math.min(e*1e3,3e4):null}async function G(t,e){for(let n=0;n<=U;n++)try{let r=await fetch(t,e);if(r.status!==429)return r;if(n===U)return console.warn("[C1 Tracker] 429 retries exhausted",{url:t}),r;let o=gt(r.headers.get("Retry-After"));if(o==null)try{let s=await r.clone().json();typeof s?.retry_after=="number"&&s.retry_after>=0&&(o=Math.min(s.retry_after*1e3,6e4))}catch{}let a=o??ft*Math.pow(2,n),i=Math.floor(Math.random()*500),c=a+i;console.warn("[C1 Tracker] 429 rate-limited; waiting",c,"ms",{attempt:n+1,url:t}),await V(c)}catch(r){return console.warn("[C1 Tracker] fetch threw",r),null}return null}var bt=/(\d+(?:\.\d+)?)X/i,ht=/(\d+(?:\.\d+)?)%/,xt=/\$([\d,]+(?:\.\d+)?)/,vt=/([\d,]+)\s*(miles|points)/i;function O(t){let e=String(t??""),n=e.trim();if(!n)return{type:"unknown",value:0,display:e};let r=n.match(bt);if(r&&r[1]!==void 0)return{type:"multiplier",value:parseFloat(r[1]),display:e};let o=n.match(xt);if(o&&o[1]!==void 0)return{type:"fixed-cash",value:parseFloat(o[1].replace(/,/g,"")),display:e};let a=n.match(vt);if(a&&a[1]!==void 0)return{type:"fixed-points",value:parseFloat(a[1].replace(/,/g,"")),display:e};let i=n.match(ht);return i&&i[1]!==void 0?{type:"percent",value:parseFloat(i[1]),display:e}:{type:"unknown",value:0,display:e}}function W(t){let e=t.stats??{};return e.cashbackV2??e.cashback??e.cashbackAmount??""}function yt(t){if(!t||!t.length)return null;let e=null;for(let n of t){let r=O(n.cashback);r.value>0&&(!e||r.value>e.value)&&(e={type:r.type,value:r.value,display:n.cashback})}return e}function wt(t){switch(t){case"great_deal":return"price-drops";case"event_placement":return"events";case"nca_deal":return"new-customer";case"retarget":case"retarget_non_product":return"recently-viewed";default:return"value"}}function N(t){if(!t.href)return null;let e=t.merchantName??"",n=t.domain??"";if(!e&&!n)return null;let r=t.stats??{},o=r.isCutType===!0||r.rewardType==="cut",a,i,c;if(o){let b=yt(r.cashbackCategories);if(b){a=b.type,i=b.value;let g=b.display.trim();c=g.toLowerCase().startsWith("up to")?g:"Up to "+g}else{let g=O(W(t));a=g.type,i=g.value,c=g.display.toLowerCase().startsWith("up to")?g.display:g.value?"Up to "+g.display:g.display}}else{let b=O(W(t));a=b.type,i=b.value,c=b.display}let s={method:"href",url:t.href},p=wt(t.type),d=t.id??null;return{id:d!==null?String(d):`shopping|${e||n}|${c}|${t.type}`,source:"shopping",itemType:t.type,merchant:e||n,domain:n||e,rewardType:a,rewardValue:i,rewardDisplay:c,activation:s,bucketCategory:p,pill:t.pill?.text??null,exclusions:r.exclusionsText??"",eventEnd:t.end??null,priceHistory:r.priceHistory??null,raw:t}}function kt(t,e){return`https://capitaloneoffers.com/xhr/feed/${encodeURIComponent(t.userId)}/offers/${e}`}function A(t,e){if(t.type==="Carousel"){let c=t.tiles??[],s=[];for(let p of c)for(let d of A(p,e))s.push(d);return s}let n=t.id,r=t.merchantTLD;if(!n||!r)return[];let o=t.buttonText??"",a=O(o),i=t.subText&&t.headingText?`${t.headingText} \u2014 ${t.subText}`:t.subText??t.headingText??t.text??"";return[{id:n,source:"offers",itemType:t.type,merchant:r,domain:r,rewardType:a.type,rewardValue:a.value,rewardDisplay:a.display,activation:{method:"post-offers",url:kt(e,n)},bucketCategory:"value",pill:t.badge?.text??null,exclusions:i,eventEnd:null,priceHistory:null,raw:t}]}function Tt(t){let e=t.rewardValue;switch(t.rewardType){case"multiplier":return e>=30?"mult-30":e>=20?"mult-20":e>=10?"mult-10":"mult-1";case"percent":case"cut":return e>=40?"pct-40":e>=20?"pct-20":e>=10?"pct-10":"pct-1";case"fixed-cash":return e>=50?"cash-50":e>=25?"cash-25":"cash-0";case"fixed-points":return e>=1e4?"pts-10k":e>=5e3?"pts-5k":e>=1e3?"pts-1k":"pts-lt-1k";case"unknown":default:return"pct-1"}}var X=[{id:"mult-30",label:"Multipliers \xB7 30X+",group:"multiplier",initiallyOpen:!0},{id:"mult-20",label:"Multipliers \xB7 20\u201329X",group:"multiplier",initiallyOpen:!0},{id:"mult-10",label:"Multipliers \xB7 10\u201319X",group:"multiplier",initiallyOpen:!1},{id:"mult-1",label:"Multipliers \xB7 1\u20139X",group:"multiplier",initiallyOpen:!1},{id:"pct-40",label:"Percent \xB7 40%+",group:"percent",initiallyOpen:!0},{id:"pct-20",label:"Percent \xB7 20\u201339%",group:"percent",initiallyOpen:!0},{id:"pct-10",label:"Percent \xB7 10\u201319%",group:"percent",initiallyOpen:!1},{id:"pct-1",label:"Percent \xB7 1\u20139%",group:"percent",initiallyOpen:!1},{id:"cash-50",label:"Fixed Cash \xB7 $50+",group:"fixed-cash",initiallyOpen:!0},{id:"cash-25",label:"Fixed Cash \xB7 $25\u201349",group:"fixed-cash",initiallyOpen:!0},{id:"cash-0",label:"Fixed Cash \xB7 under $25",group:"fixed-cash",initiallyOpen:!1},{id:"pts-10k",label:"Fixed Points \xB7 10,000+",group:"fixed-points",initiallyOpen:!0},{id:"pts-5k",label:"Fixed Points \xB7 5,000\u20139,999",group:"fixed-points",initiallyOpen:!0},{id:"pts-1k",label:"Fixed Points \xB7 1,000\u20134,999",group:"fixed-points",initiallyOpen:!1},{id:"pts-lt-1k",label:"Fixed Points \xB7 under 1,000",group:"fixed-points",initiallyOpen:!1}],K=(()=>{let t={};for(let e of X)t[e.id]=e;return t})();function L(t){let e={};for(let a of t){let i=Tt(a);(e[i]??(e[i]=[])).push(a)}for(let a of Object.keys(e))e[a].sort((i,c)=>c.rewardValue-i.rewardValue);let n=[],r={};for(let a of X){let i=e[a.id];i&&i.length&&(n.push(a.id),r[a.id]=i.length)}let o={total:t.length,byBucket:r};return{offers:t,buckets:e,bucketOrder:n,stats:o}}async function J(t){let e=t.maxPages??120,n=new Set,r=[],o=null,a=0;for(;a<e;){a>0&&await V(mt);let i=await t.fetchPage(o);if(!i)break;for(let s of t.getItems(i)){let p=t.dedupeKey(s);p&&n.has(p)||(p&&n.add(p),r.push(s))}a++,t.onPage?.(a,r.length),t.onProgress?.(r,a);let c=t.getNextCursor(i);if(!c)break;o=c}return{items:r,hitCap:a>=e,pagesWalked:a}}function It(t){let e={limit:25};return t&&(e.nextPageToken=t),JSON.stringify({contentProps:{pagination:e},context:{device:{model:typeof navigator<"u"&&/Mac/.test(navigator.platform)?"Macintosh":"Unknown",manufacturer:"Unknown",memory:"8",concurrency:String(typeof navigator<"u"&&navigator.hardwareConcurrency||4)},browser:{name:"Chrome",version:"0",major:"0"},os:{name:"unknown",version:"0"},screen:{width:1920,height:1080,density:2},locale:typeof navigator<"u"&&navigator.language?navigator.language:"en-US",country:"US",location:{state:"",zipcode:"",latitude:null,longitude:null,isInCensusData:!1},page:{path:typeof window<"u"?window.location.pathname:"/",url:typeof window<"u"?window.location.href:"",referrer:typeof document<"u"?document.referrer:"",search:typeof window<"u"?window.location.search:"",title:typeof document<"u"?document.title:""},userAgent:typeof navigator<"u"?navigator.userAgent:""}})}function Ct(t){let e=t.merchantName??"",n=t.stats?.cashbackV2??t.stats?.cashback??"";if(e&&n)return`${e}|${n}`;let r=t;return r.id!==void 0&&r.id!==null&&r.id!==""?String(r.id):null}async function Y(t={}){let e=t.onProgress?(i,c)=>{let s=[];for(let p of i){let d=N(p);d&&s.push(d)}t.onProgress(s,c)}:void 0,n={fetchPage:async i=>{let c=await G("/api/v1/feed",{method:"POST",credentials:"include",headers:{"Content-Type":"application/json"},body:It(i)});if(!c||!c.ok)return console.warn("[C1 Tracker] shopping feed POST failed",{status:c?.status,statusText:c?.statusText,cursor:i}),null;let s=await c.json();return i||console.log("[C1 Tracker] shopping feed first page",{count:s.count,itemCount:s.items?.length??0,nextPageToken:s.pagination?.nextPageToken}),s},getNextCursor:i=>i.pagination?.nextPageToken??null,getItems:i=>i.items??[],dedupeKey:Ct,...t.onPage?{onPage:t.onPage}:{},...e?{onProgress:e}:{},maxPages:120},r=await J(n),o=[],a=0;for(let i of r.items){let c=N(i);c?o.push(c):a++}return console.log("[C1 Tracker] shopping walk done",{rawItems:r.items.length,normalized:o.length,droppedDuringNormalize:a,pagesWalked:r.pagesWalked,hitCap:r.hitCap}),{items:o,hitCap:r.hitCap,pagesWalked:r.pagesWalked}}function Et(t,e){let n=`https://capitaloneoffers.com/feed/${encodeURIComponent(t.userId)}`,r=`?numberOfColumnsInGrid=5&viewInstanceId=${t.viewInstanceId}&contentSlug=ease-web-l1`;return e?`${n}${r}&cursor=${e}`:`${n}${r}`}function St(t){let e=t.merchantTLD??"",n=t.buttonText??"";return e&&n?`${e}|${n}`:t.id??null}function Ot(t){let e=[];for(let n of t)if(n.type==="Carousel")for(let r of n.tiles??[])e.push(r);else e.push(n);return e}async function Z(t,e={}){let n=e.onProgress?(i,c)=>{let s=[];for(let p of i)for(let d of A(p,t))s.push(d);e.onProgress(s,c)}:void 0,r={fetchPage:async i=>{let c=await G(Et(t,i),{method:"GET",credentials:"include",headers:{Accept:"application/json"}});return!c||!c.ok?(console.warn("[C1 Tracker] offers feed GET failed",{status:c?.status,statusText:c?.statusText,cursor:i}),null):await c.json()},getNextCursor:i=>i.cursor??null,getItems:i=>Ot(i.data??[]),dedupeKey:St,...e.onPage?{onPage:e.onPage}:{},...n?{onProgress:n}:{},maxPages:120},o=await J(r),a=[];for(let i of o.items)for(let c of A(i,t))a.push(c);return{items:a,hitCap:o.hitCap,pagesWalked:o.pagesWalked}}function $(t,e,n=0){if(n>6||t===null||typeof t!="object")return null;let r=t;for(let o of e){let a=r[o];if(typeof a=="string"&&a.length>0)return a}for(let o of Object.keys(r)){let a=r[o];if(a&&typeof a=="object"){let i=$(a,e,n+1);if(i)return i}}return null}function q(t){let e=new RegExp(`\\\\?"${t}\\\\?"\\s*,\\s*\\\\?"([^"\\\\]+)\\\\?"`),n=document.getElementsByTagName("script");for(let r=0;r<n.length;r++){let o=n[r].textContent;if(!o||o.indexOf(t)<0)continue;let a=o.match(e);if(a&&a[1])return a[1]}return null}function Lt(){let t=null,e=null;try{e=new URLSearchParams(window.location.search).get("viewInstanceId")}catch{}let n=window.location.pathname.match(/^\/feed\/([^/?#]+)/);if(n&&n[1]&&(t=decodeURIComponent(n[1])),t||(t=q("maybeSelectedArid")),e||(e=q("viewInstanceId")),!t||!e)try{let r=document.getElementById("__NEXT_DATA__");if(r?.textContent){let o=JSON.parse(r.textContent);t||(t=$(o,["userId","accountReferenceId"])),e||(e=$(o,["viewInstanceId"]))}}catch{}if(!e&&t)try{typeof crypto<"u"&&typeof crypto.randomUUID=="function"&&(e=crypto.randomUUID())}catch{}return t&&e?{userId:t,viewInstanceId:e}:(console.warn("[C1 Tracker] getOffersBrowseContext (sync) failed",{pathname:window.location.pathname,search:window.location.search,userId:t,viewInstanceId:e,hasNextData:!!document.getElementById("__NEXT_DATA__")}),null)}async function Q(){let t=Lt();if(t)return t;let e=null,n=null;try{n=new URLSearchParams(window.location.search).get("viewInstanceId")}catch{}try{let r=await fetch("/xhr/shopping-trips?limit=1&offset=0&status[]=Activated&status[]=Adjusted&status[]=Completed&status[]=Inactive&status[]=Ineligible&status[]=Pending&status[]=Waiting",{method:"POST",credentials:"include"});if(r.ok){let a=(await r.json())?.data?.[0];a&&typeof a.accountReferenceId=="string"&&(e=a.accountReferenceId)}}catch(r){console.warn("[C1 Tracker] trips-API fallback for userId failed:",r)}if(!n&&e)try{typeof crypto<"u"&&typeof crypto.randomUUID=="function"&&(n=crypto.randomUUID())}catch{}return e&&n?{userId:e,viewInstanceId:n}:(console.warn("[C1 Tracker] fetchOffersBrowseContext failed",{userId:e,viewInstanceId:n}),null)}function Pt(t,e){return e==="events"?"event":e==="price-drops"?"deal":e==="new-customer"?"new":e==="recently-viewed"?"retarget":t==="great_deal"?"deal":""}function At(t){return`${t.merchant} ${t.domain} ${t.rewardDisplay} ${t.itemType} ${t.exclusions}`.toLowerCase()}function $t(t){if(!t)return"";try{return new Date(t).toLocaleDateString(void 0,{month:"short",day:"numeric"})}catch{return""}}function Rt(t,e){let n=e.map(o=>{let a=f(At(o)),i=o.pill?`<span class="c1t-pill ${Pt(o.itemType,o.bucketCategory)}">${f(o.pill)}</span>`:"",c=o.eventEnd?`<span class="c1t-event-end">ends ${f($t(o.eventEnd))}</span>`:"",s=o.exclusions??"",p=s?` title="${f(s)}"`:"",d=s?f(s):"",m=s.length>60,b=d?m?`<div class="c1t-excl-cell"${p}>
                       <span class="c1t-excl-text">${d}</span><button type="button" class="c1t-excl-toggle">(more)</button>
                   </div>`:`<div class="c1t-excl-cell"${p}><span class="c1t-excl-text">${d}</span></div>`:"";return`<tr class="c1t-row-click"
            data-merchant="${f(o.merchant)}"
            data-bucket-id="${f(t.id)}"
            data-search="${a}"
            data-method="${f(o.activation.method)}"
            data-activation-url="${f(o.activation.url)}">
            <td>${f(o.merchant)}</td>
            <td><span class="c1t-reward">${f(o.rewardDisplay)}</span></td>
            <td>${i}</td>
            <td>${c}</td>
            <td>${b}</td>
        </tr>`}).join(""),r=t.initiallyOpen?" open":"";return`<details class="c1t-bucket" data-bucket-id="${t.id}"${r}>
        <summary>${f(t.label)} <span class="c1t-bucket-count">${e.length}</span></summary>
        <table>
            <colgroup>
                <col class="merchant" />
                <col class="reward" />
                <col class="badge" />
                <col class="ends" />
                <col class="exclusions" />
            </colgroup>
            <thead>
                <tr><th>Merchant</th><th>Reward</th><th>Badge</th><th>Ends</th><th>Exclusions</th></tr>
            </thead>
            <tbody>${n}</tbody>
        </table>
    </details>`}function Mt(t){switch(t){case"multiplier":return"Multipliers";case"percent":return"Percent";case"fixed-cash":return"Cash";case"fixed-points":return"Points"}}function Bt(t){let e=[],n=new Set;for(let r of t.bucketOrder){let o=K[r];o&&(n.has(o.group)||(n.add(o.group),e.push(`<button class="c1t-jump-chip" data-jump-to="${o.id}">${f(Mt(o.group))}</button>`)))}return e.join("")}function Ft(t){let e=t.dataset.activationUrl;e&&window.open(e,"_blank","noopener")}async function _t(t){let e=t.dataset.activationUrl;if(!e)return;let n=t.dataset.merchant??"merchant",r=window.open("about:blank","_blank");try{let o=await fetch(e,{method:"POST",credentials:"include"});if(!o.ok)throw new Error(`Activation returned ${o.status}`);let a=await o.json(),i=a?.offer?a.offer:a,c=i?.affiliate?.redirectUrl;if(c&&r){r.location=c;return}let s=i?.cardLinked?.cardLinkedOfferDetail;if(i?.cardLinked&&s?.isActivated){r?.close?.(),alert(`${n} card-linked offer activated. Use your card as usual \u2014 no redirect needed.`);return}if(i?.cardLinked?.cardLinkedOfferDetail?.activationLimitsReached){r?.close?.(),alert("Card-linked activation limit reached \u2014 cancel an existing activation and try again.");return}console.warn("[C1 Tracker] Activation POST returned detail shape (no redirectUrl)",i),r?.close?.(),alert("Activation failed \u2014 response had no redirect and no card-linked activation.")}catch(o){r?.close?.(),alert("Activation failed: "+(o instanceof Error?o.message:String(o)))}}function Ht(t){t.addEventListener("click",e=>{let n=e.target;if(!n)return;let r=n.closest(".c1t-excl-toggle");if(r){e.stopPropagation(),e.preventDefault();let a=r.closest(".c1t-excl-cell");if(a){let i=a.classList.toggle("c1t-excl-expanded");r.textContent=i?"(less)":"(more)"}return}let o=n.closest("tr[data-method]");o&&(o.dataset.method==="href"?Ft(o):o.dataset.method==="post-offers"&&_t(o))})}function Dt(t){let e=t.querySelector("#c1t-browse-search input"),n=t.querySelector("#c1t-browse-search button");if(!e)return;let r=new Map;t.querySelectorAll("details[data-bucket-id]").forEach(i=>{let c=i,s=c.dataset.bucketId??"";r.set(s,c.open)});let o=null,a=i=>{let c=i.trim().toLowerCase(),s=c.length===0;t.querySelectorAll("details[data-bucket-id]").forEach(d=>{let m=d,b=m.dataset.bucketId??"",g=m.querySelectorAll("tr[data-search]"),h=0;g.forEach(k=>{let T=k.dataset.search??"",I=s||T.includes(c);k.style.display=I?"":"none",I&&h++}),h===0&&!s?m.style.display="none":(m.style.display="",s?m.open=r.get(b)??!1:m.open=!0)})};e.addEventListener("input",()=>{o&&clearTimeout(o),o=setTimeout(()=>a(e.value),100)}),n&&n.addEventListener("click",()=>{e.value="",a("")})}function zt(t){let e=t.querySelector("#c1t-browse-nav");e&&e.addEventListener("click",n=>{let r=n.target;if(!r)return;let o=r.closest("[data-jump-to]");if(!o)return;let a=o.dataset.jumpTo;if(!a)return;let i=t.querySelector(`details[data-bucket-id="${a}"]`);i&&(i.open=!0,i.scrollIntoView({behavior:"smooth",block:"start"}))})}var tt=(t,e)=>{let n=t.querySelector("#c1t-content");if(!n)return;let o=n.querySelector("#c1t-browse-body")?.scrollTop??0,a=n.querySelector("#c1t-browse-search input"),i=a?.value??"",c=a===document.activeElement,s=a?.selectionStart??null,p=a?.selectionEnd??null,d=e.bucketOrder.map(h=>{let k=K[h];if(!k)return"";let T=e.buckets[h];return!T||!T.length?"":Rt(k,T)}).join(""),m=Bt(e),b=e.stats.hitCap?`Stopped at ${e.stats.total} offers (max pages reached)`:`${e.stats.total} offers across ${e.bucketOrder.length} buckets`;n.innerHTML=`
        <div id="c1t-browse-search">
            <input type="search" placeholder="Search merchant / reward / type..." value="${f(i)}" />
            <button type="button">Clear</button>
        </div>
        <div id="c1t-browse-nav">${m}</div>
        <div id="c1t-browse-stats">${f(b)}</div>
        <div id="c1t-browse-body">${d||'<div style="padding:40px;text-align:center;opacity:0.7;">No offers found.</div>'}</div>
        <div id="c1t-browse-footer">Click a row to activate. Shopping rows open the pre-signed href; offers rows POST then redirect.</div>
    `;let g=n.querySelector("#c1t-browse-body");if(g&&(Ht(g),o>0&&(g.scrollTop=o)),Dt(n),zt(n),c){let h=n.querySelector("#c1t-browse-search input");if(h){if(h.focus(),s!==null&&p!==null)try{h.setSelectionRange(s,p)}catch{}i&&h.dispatchEvent(new Event("input",{bubbles:!0}))}}};(async function(){"use strict";let t=E();if(!t){alert("Please run this on capitaloneshopping.com or capitaloneoffers.com");return}let n=F()==="browse"?"browse":"trips";if(document.getElementById("c1t-fab")){document.getElementById("c1t-overlay")?.classList.add("open");return}console.log("[C1 Tracker Bookmarklet] Running on",t,"defaultTab=",n);let r;function o(p,d,m){if(!r)return;let g=S(m==="data"?{data:p}:{items:p});r.setTabData("trips",g),r.setTabLoading("trips",`Loading page ${d} \xB7 ${g.stats.total} trips`)}async function a(){return t==="shopping"?S(await D({onProgress:(p,d)=>o(p,d,"items")})):S(await H({onProgress:(p,d)=>o(p,d,"data")}))}function i(p,d){if(!r)return;let m=L(p);r.setTabData("browse",m),r.setTabLoading("browse",`Loading page ${d} \xB7 ${m.stats.total} offers`)}async function c(){let p=(g,h)=>{let k=document.querySelector("#c1t-loading");k&&(k.textContent=`Loaded ${g} pages, ${h} offers...`)};if(t==="shopping"){let g=await Y({onPage:p,onProgress:i}),h=L(g.items);return h.stats.hitCap=g.hitCap,h.stats.pagesWalked=g.pagesWalked,h}let d=await Q();if(!d)throw new Error("Could not capture offers feed context (userId + viewInstanceId). Open DevTools console for diagnostics. The URL should look like /feed/<userId>?viewInstanceId=<uuid>. Try clicking into the feed grid once, then re-run.");let m=await Z(d,{onPage:p,onProgress:i}),b=L(m.items);return b.stats.hitCap=m.hitCap,b.stats.pagesWalked=m.pagesWalked,b}r=j({title:`${t==="offers"?"Cap One Offers":"Cap One Shopping"} Tracker`,defaultTabId:n,tabs:[{id:"trips",label:"Trips",render:z,getBadgeCount:p=>p?.stats?.withCredit??0,onActivate:a,loadingText:"Fetching shopping trips data..."},{id:"browse",label:"Browse",render:tt,onActivate:c,loadingText:"Walking offers feed... (0 pages)"}]}),r.ensureFab(),r.ensureOverlay(),document.getElementById("c1t-overlay")?.classList.add("open"),r.setActiveTab(n)})();})();
