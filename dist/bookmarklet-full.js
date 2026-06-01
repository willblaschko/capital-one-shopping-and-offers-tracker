"use strict";(()=>{var x={offers:{hostname:"capitaloneoffers",pages:{trips:"/c1-offers/shopping-trips",browse:"/feed"},trips:{apiPattern:t=>t.includes("shopping-trips")&&t.includes("version=2")&&t.includes("_data="),apiEndpoint:"/c1-offers/shopping-trips?limit=300&offset=0&version=2&_data=routes%2Fc1-offers.shopping-trips"},browse:{apiPattern:t=>t.includes("/feed/")&&t.includes("viewInstanceId=")}},shopping:{hostname:"capitaloneshopping",pages:{trips:"/account-settings/shopping-trips",browse:"/"},trips:{apiPattern:t=>t.includes("/api/v1/trip_orders"),apiEndpoint:"/api/v1/trip_orders"},browse:{apiPattern:t=>t.endsWith("/api/v1/feed"),apiEndpoint:"/api/v1/feed"}}};function y(){return window.location.hostname.includes("capitaloneoffers")?"offers":window.location.hostname.includes("capitaloneshopping")?"shopping":null}function T(){let t=y();if(!t)return null;let n=window.location.pathname,o=x[t].pages;return n.startsWith(o.trips)?"trips":t==="shopping"&&(n==="/"||n==="")||t==="offers"&&n.startsWith(o.browse)?"browse":null}function k(){return T()==="trips"}function I(t){return t?Array.isArray(t)?t:Array.isArray(t.items)?t.items:Array.isArray(t.shoppingTrips)?t.shoppingTrips:Array.isArray(t.trip_orders)?t.trip_orders:t.data&&Array.isArray(t.data)?t.data:t.data?.items&&Array.isArray(t.data.items)?t.data.items:[]:[]}function $(t){let n=t.orderAmount??t.order_amount??(t.trxnTotalCents!=null?t.trxnTotalCents/100:null),o=t.creditAmount??t.credit_amount??(t.payoutAmountCents!=null?t.payoutAmountCents/100:null),e=t.orderId??t.order_id??null,d=o!==null&&Number(o)>0,i=t.status??"Unknown";i==="Waiting"?i="Created":i==="Inactive"&&(i="Canceled");let s=i;return d&&i.toLowerCase()==="canceled"?s="Completed":i.toLowerCase()==="pending"&&(s=d?"Pending \u2713":"Pending ?"),{id:t.id??t.tripId??t.activatedOfferId??null,tripId:t.tripId??t.trip_id??t.id??t.activatedOfferId??null,orderId:e,merchant:t.vendor??t.merchantName??t.merchantDisplayName??t.merchant??t.domain??"Unknown",domain:t.domain??null,status:s,rawStatus:i,orderAmount:n!==null?Number(n):null,creditAmount:o!==null?Number(o):null,date:t.createdAt??t.created_at??t.clickDate??t.date??null,hasOrderId:e!==null,hasAmount:n!==null&&Number(n)>0,hasCreditAmount:d,raw:t}}function v(t){let o=I(t).map($);return{trips:o,stats:{total:o.length,withOrderId:o.filter(e=>e.hasOrderId).length,withAmount:o.filter(e=>e.hasAmount).length,withCredit:o.filter(e=>e.hasCreditAmount).length,pending:o.filter(e=>e.status.toLowerCase().includes("pending")).length,created:o.filter(e=>e.status.toLowerCase()==="created").length}}}var E=`
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
    .c1t-exclusions {
        font-size: 11px !important;
        opacity: 0.7 !important;
        max-width: 260px !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
        white-space: nowrap !important;
    }
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
`;function w(t){return t==null||t===0?"\u2014":"$"+Number(t).toFixed(2)}function S(t){if(!t)return"\u2014";try{return new Date(t).toLocaleDateString()}catch{return"\u2014"}}function b(t){if(t==null)return"";let n=document.createElement("div");return n.textContent=String(t),n.innerHTML}function L(t){let n=(t||"").toLowerCase();return n.includes("completed")?"completed":n==="pending \u2713"?"pending-good":n==="pending ?"||n.includes("pending")?"pending-uncertain":n.includes("created")?"created":n.includes("cancel")?"canceled":n.includes("adjust")?"adjusted":""}function C({onOpen:t,processedData:n}){let o=!1,e=n;function d(){if(o&&document.getElementById("c1t-styles"))return;let r=document.getElementById("c1t-styles");r||(r=document.createElement("style"),r.id="c1t-styles",r.textContent=E,(document.head||document.documentElement).appendChild(r)),o=!0}function i(){d();let r=document.getElementById("c1t-fab");return r||(r=document.createElement("button"),r.id="c1t-fab",r.innerHTML="\u{1F4CB}",r.title="Shopping Trips Tracker",r.addEventListener("click",async()=>{s();let a=document.getElementById("c1t-overlay");a&&a.classList.add("open"),!e&&t&&(await t(),e&&h(a,e))}),document.body.appendChild(r),e&&c(r,e),r)}function s(){d();let r=document.getElementById("c1t-overlay"),a=!1;return console.log("[C1 Tracker] ensureOverlay - existing:",!!r,"currentData:",!!e,"stats:",e?.stats),r||(a=!0,r=document.createElement("div"),r.id="c1t-overlay",r.innerHTML=`
                <div id="c1t-modal">
                    <div id="c1t-header">
                        <h2>\u{1F4CB} Shopping Trips Tracker</h2>
                        <button id="c1t-close">\u2715</button>
                    </div>
                    <div id="c1t-content">
                        <div id="c1t-loading">Waiting for data... Navigate to Shopping Trips page and data will load automatically.</div>
                    </div>
                </div>
            `,document.body.appendChild(r),r.querySelector("#c1t-close").addEventListener("click",()=>r.classList.remove("open")),r.addEventListener("click",l=>{l.target===r&&r.classList.remove("open")})),console.log("[C1 Tracker] ensureOverlay - isNew:",a,"currentData:",!!e,"stats:",e?.stats),e&&h(r,e),r}function c(r,a){a&&(r.classList.add("has-data"),a.stats.withCredit>0?r.innerHTML=`\u{1F4CB}<span class="badge">${a.stats.withCredit}</span>`:r.innerHTML="\u{1F4CB}")}function h(r,a){if(console.log("[C1 Tracker] renderDataToModal called - data:",!!a,"overlay:",!!r),!a)return;let{trips:l,stats:m}=a,f=r.querySelector("#c1t-content");console.log("[C1 Tracker] renderDataToModal - content element:",!!f,"trips:",l?.length),f&&(f.innerHTML=`
            <div id="c1t-stats">
                <span class="stat"><strong>${m.total}</strong> total</span>
                <span class="stat"><strong>${m.withOrderId}</strong> tracked</span>
                <span class="stat"><strong>${m.withAmount}</strong> with amount</span>
                <span class="stat"><strong>${m.withCredit}</strong> with cashback</span>
            </div>
            <div id="c1t-filters">
                <button class="c1t-filter-btn active" data-filter="all">All (${m.total})</button>
                <button class="c1t-filter-btn" data-filter="amount">With Amount (${m.withAmount})</button>
                <button class="c1t-filter-btn" data-filter="tracked">Tracked (${m.withOrderId})</button>
                <button class="c1t-filter-btn" data-filter="pending">Pending (${m.pending})</button>
                <button class="c1t-filter-btn" data-filter="created">Waiting (${m.created})</button>
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
                        ${l.map(p=>{let g=p.hasCreditAmount?"amt":p.hasOrderId?"tracked":"",u=L(p.status);return`
                                <tr class="${g}" data-filter-amount="${p.hasAmount}" data-filter-tracked="${p.hasOrderId}" data-filter-pending="${p.status.toLowerCase().includes("pending")}" data-filter-created="${p.status.toLowerCase()==="created"}">
                                    <td title="${b(p.domain)}">${b(p.merchant)}</td>
                                    <td class="c">${S(p.date)}</td>
                                    <td class="r ${p.hasAmount?"c1t-amount":""}">${w(p.orderAmount)}</td>
                                    <td class="r ${p.hasCreditAmount?"c1t-credit":""}">${w(p.creditAmount)}</td>
                                    <td class="c"><span class="c1t-status ${u}">${b(p.status)}</span></td>
                                    <td class="c">${p.hasOrderId?"\u2713":"\u2014"}</td>
                                </tr>
                            `}).join("")}
                    </tbody>
                </table>
            </div>
            <div id="c1t-footer">
                <details>
                    <summary>Show Raw JSON</summary>
                    <pre>${b(JSON.stringify(l.slice(0,30).map(p=>p.raw),null,2))}${l.length>30?`

... and `+(l.length-30)+" more":""}</pre>
                </details>
            </div>
        `,f.querySelectorAll(".c1t-filter-btn").forEach(p=>{p.addEventListener("click",function(){f.querySelectorAll(".c1t-filter-btn").forEach(u=>u.classList.remove("active")),this.classList.add("active");let g=this.dataset.filter;f.querySelectorAll("#c1t-tbody tr").forEach(u=>{if(g==="all")u.style.display="";else{let A=`filter${g.charAt(0).toUpperCase()+g.slice(1)}`;u.style.display=u.dataset[A]==="true"?"":"none"}})})}))}return document.addEventListener("keydown",r=>{if(r.key==="Escape"){let a=document.getElementById("c1t-overlay");a&&a.classList.remove("open")}}),{ensureStyles:d,ensureFab:i,ensureOverlay:s,updateFabState:c,renderDataToModal:h,updateData(r){console.log("[C1 Tracker] updateData called with stats:",r?.stats),e=r;let a=document.getElementById("c1t-fab");a&&c(a,r);let l=document.getElementById("c1t-overlay");l&&h(l,r)}}}(async function(){"use strict";let t=y();if(!t){alert("Please run this on capitaloneshopping.com or capitaloneoffers.com");return}if(!k()){let i=x[t].pagePath;alert(`Please navigate to the Shopping Trips page first:
${window.location.origin}${i}`);return}if(document.getElementById("c1t-fab")){let i=document.getElementById("c1t-overlay");i&&i.classList.add("open");return}console.log("[C1 Tracker Bookmarklet] Running on",t);let n=null,o=C({processedData:null,onOpen:()=>{n||d()}});o.ensureFab(),o.ensureOverlay();let e=document.getElementById("c1t-overlay");e&&e.classList.add("open");async function d(){let i=document.querySelector("#c1t-content");i&&(i.innerHTML='<div id="c1t-loading">Fetching shopping trips data...</div>');try{let s;if(t==="shopping"){let c=await fetch("/api/v1/trip_orders",{credentials:"include"});if(!c.ok)throw new Error(`API returned ${c.status}`);s=await c.json()}else{let c=await fetch("/c1-offers/shopping-trips?limit=300&offset=0&version=2&_data=routes%2Fc1-offers.shopping-trips",{method:"POST",credentials:"include"});if(!c.ok)throw new Error(`API returned ${c.status}`);s=await c.json()}console.log("[C1 Tracker Bookmarklet] Fetched data:",s),n=v(s),console.log("[C1 Tracker Bookmarklet] Processed:",n.stats),o.updateData(n)}catch(s){console.error("[C1 Tracker Bookmarklet] Error:",s),i&&(i.innerHTML=`
                    <div id="c1t-loading">
                        <p>Error fetching data: ${s.message}</p>
                        <p style="margin-top: 10px; font-size: 12px; opacity: 0.8;">
                            Make sure you're logged in and try navigating to the Shopping Trips page first.
                        </p>
                    </div>
                `)}}d()})();})();
