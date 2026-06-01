"use strict";(()=>{var g={offers:{hostname:"capitaloneoffers",pages:{trips:"/c1-offers/shopping-trips",browse:"/feed"},trips:{apiPattern:t=>t.includes("shopping-trips")&&t.includes("version=2")&&t.includes("_data="),apiEndpoint:"/c1-offers/shopping-trips?limit=300&offset=0&version=2&_data=routes%2Fc1-offers.shopping-trips"},browse:{apiPattern:t=>t.includes("/feed/")&&t.includes("viewInstanceId=")}},shopping:{hostname:"capitaloneshopping",pages:{trips:"/account-settings/shopping-trips",browse:"/"},trips:{apiPattern:t=>t.includes("/api/v1/trip_orders"),apiEndpoint:"/api/v1/trip_orders"},browse:{apiPattern:t=>t.endsWith("/api/v1/feed"),apiEndpoint:"/api/v1/feed"}}};function w(){return window.location.hostname.includes("capitaloneoffers")?"offers":window.location.hostname.includes("capitaloneshopping")?"shopping":null}function I(){let t=w();if(!t)return null;let e=window.location.pathname,n=g[t].pages;return e.startsWith(n.trips)?"trips":t==="shopping"&&(e==="/"||e==="")||t==="offers"&&e.startsWith(n.browse)?"browse":null}function H(t){if(!t)return[];if(Array.isArray(t))return t;let e=t;return Array.isArray(e.items)?e.items:Array.isArray(e.shoppingTrips)?e.shoppingTrips:Array.isArray(e.trip_orders)?e.trip_orders:e.data&&Array.isArray(e.data)?e.data:e.data&&typeof e.data=="object"&&Array.isArray(e.data.items)?e.data.items:[]}function _(t){let e=t.orderAmount??t.order_amount??(t.trxnTotalCents!=null?t.trxnTotalCents/100:null),n=t.creditAmount??t.credit_amount??(t.payoutAmountCents!=null?t.payoutAmountCents/100:null),i=t.orderId??t.order_id??null,o=n!==null&&Number(n)>0,r=t.status??"Unknown";r==="Waiting"?r="Created":r==="Inactive"&&(r="Canceled");let a=r;return o&&r.toLowerCase()==="canceled"?a="Completed":r.toLowerCase()==="pending"&&(a=o?"Pending \u2713":"Pending ?"),{id:t.id??t.tripId??t.activatedOfferId??null,tripId:t.tripId??t.trip_id??t.id??t.activatedOfferId??null,orderId:i,merchant:t.vendor??t.merchantName??t.merchantDisplayName??t.merchant??t.domain??"Unknown",domain:t.domain??null,status:a,rawStatus:r,orderAmount:e!==null?Number(e):null,creditAmount:n!==null?Number(n):null,date:t.createdAt??t.created_at??t.clickDate??t.date??null,hasOrderId:i!==null,hasAmount:e!==null&&Number(e)>0,hasCreditAmount:o,raw:t}}function E(t){let n=H(t).map(_);return{trips:n,stats:{total:n.length,withOrderId:n.filter(i=>i.hasOrderId).length,withAmount:n.filter(i=>i.hasAmount).length,withCredit:n.filter(i=>i.hasCreditAmount).length,pending:n.filter(i=>i.status.toLowerCase().includes("pending")).length,created:n.filter(i=>i.status.toLowerCase()==="created").length}}}var j=`
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
`;function O(t){return t==null||t===0?"\u2014":"$"+Number(t).toFixed(2)}function z(t){if(!t)return"\u2014";try{return new Date(t).toLocaleDateString()}catch{return"\u2014"}}function u(t){if(t==null)return"";let e=document.createElement("div");return e.textContent=String(t),e.innerHTML}function U(t){let e=(t||"").toLowerCase();return e.includes("completed")?"completed":e==="pending \u2713"?"pending-good":e==="pending ?"||e.includes("pending")?"pending-uncertain":e.includes("created")?"created":e.includes("cancel")?"canceled":e.includes("adjust")?"adjusted":""}var $=(t,e)=>{if(console.log("[C1 Tracker] renderTripsToModal called - data:",!!e,"overlay:",!!t),!e)return;let{trips:n,stats:i}=e,o=t.querySelector("#c1t-content");console.log("[C1 Tracker] renderTripsToModal - content element:",!!o,"trips:",n?.length),o&&(o.innerHTML=`
        <div id="c1t-stats">
            <span class="stat"><strong>${i.total}</strong> total</span>
            <span class="stat"><strong>${i.withOrderId}</strong> tracked</span>
            <span class="stat"><strong>${i.withAmount}</strong> with amount</span>
            <span class="stat"><strong>${i.withCredit}</strong> with cashback</span>
        </div>
        <div id="c1t-filters">
            <button class="c1t-filter-btn active" data-filter="all">All (${i.total})</button>
            <button class="c1t-filter-btn" data-filter="amount">With Amount (${i.withAmount})</button>
            <button class="c1t-filter-btn" data-filter="tracked">Tracked (${i.withOrderId})</button>
            <button class="c1t-filter-btn" data-filter="pending">Pending (${i.pending})</button>
            <button class="c1t-filter-btn" data-filter="created">Waiting (${i.created})</button>
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
                    ${n.map(r=>{let a=r.hasCreditAmount?"amt":r.hasOrderId?"tracked":"",s=U(r.status);return`
                                <tr class="${a}" data-filter-amount="${r.hasAmount}" data-filter-tracked="${r.hasOrderId}" data-filter-pending="${r.status.toLowerCase().includes("pending")}" data-filter-created="${r.status.toLowerCase()==="created"}">
                                    <td title="${u(r.domain)}">${u(r.merchant)}</td>
                                    <td class="c">${z(r.date)}</td>
                                    <td class="r ${r.hasAmount?"c1t-amount":""}">${O(r.orderAmount)}</td>
                                    <td class="r ${r.hasCreditAmount?"c1t-credit":""}">${O(r.creditAmount)}</td>
                                    <td class="c"><span class="c1t-status ${s}">${u(r.status)}</span></td>
                                    <td class="c">${r.hasOrderId?"\u2713":"\u2014"}</td>
                                </tr>
                            `}).join("")}
                </tbody>
            </table>
        </div>
        <div id="c1t-footer">
            <details>
                <summary>Show Raw JSON</summary>
                <pre>${u(JSON.stringify(n.slice(0,30).map(r=>r.raw),null,2))}${n.length>30?`

... and `+(n.length-30)+" more":""}</pre>
            </details>
        </div>
    `,o.querySelectorAll(".c1t-filter-btn").forEach(r=>{r.addEventListener("click",function(){o.querySelectorAll(".c1t-filter-btn").forEach(s=>s.classList.remove("active")),this.classList.add("active");let a=this.dataset.filter;o.querySelectorAll("#c1t-tbody tr").forEach(s=>{if(a==="all")s.style.display="";else if(a){let d=`filter${a.charAt(0).toUpperCase()+a.slice(1)}`;s.style.display=s.dataset[d]==="true"?"":"none"}})})}))};function k(t){let{onOpen:e,processedData:n,render:i,getBadgeCount:o}=t,r=!1,a=n;function s(){if(r&&document.getElementById("c1t-styles"))return;let p=document.getElementById("c1t-styles");p||(p=document.createElement("style"),p.id="c1t-styles",p.textContent=j,(document.head||document.documentElement).appendChild(p)),r=!0}function d(){s();let p=document.getElementById("c1t-fab");if(p)return p;let c=document.createElement("button");return c.id="c1t-fab",c.innerHTML="\u{1F4CB}",c.title="Shopping Trips Tracker",c.addEventListener("click",async()=>{let l=m();l.classList.add("open"),!a&&e&&(await e(),a&&i(l,a))}),document.body.appendChild(c),a&&f(c,a),c}function m(){s();let p=document.getElementById("c1t-overlay"),c=!1;if(console.log("[C1 Tracker] ensureOverlay - existing:",!!p,"currentData:",!!a),!p){c=!0,p=document.createElement("div"),p.id="c1t-overlay",p.innerHTML=`
                <div id="c1t-modal">
                    <div id="c1t-header">
                        <h2>\u{1F4CB} Shopping Trips Tracker</h2>
                        <button id="c1t-close">\u2715</button>
                    </div>
                    <div id="c1t-content">
                        <div id="c1t-loading">Waiting for data... Navigate to Shopping Trips page and data will load automatically.</div>
                    </div>
                </div>
            `,document.body.appendChild(p);let l=p,h=l.querySelector("#c1t-close");h&&h.addEventListener("click",()=>l.classList.remove("open")),l.addEventListener("click",b=>{b.target===l&&l.classList.remove("open")})}return console.log("[C1 Tracker] ensureOverlay - isNew:",c,"currentData:",!!a),a&&i(p,a),p}function f(p,c){if(!c)return;p.classList.add("has-data");let l=o(c);l>0?p.innerHTML=`\u{1F4CB}<span class="badge">${l}</span>`:p.innerHTML="\u{1F4CB}"}return document.addEventListener("keydown",p=>{if(p.key==="Escape"){let c=document.getElementById("c1t-overlay");c&&c.classList.remove("open")}}),{ensureStyles:s,ensureFab:d,ensureOverlay:m,updateFabState:f,updateData(p){console.log("[C1 Tracker] updateData called"),a=p;let c=document.getElementById("c1t-fab");c&&f(c,p);let l=document.getElementById("c1t-overlay");l&&i(l,p)}}}var W=/(\d+(?:\.\d+)?)X/i,N=/(\d+(?:\.\d+)?)%/,q=/\$([\d,]+(?:\.\d+)?)/,V=/([\d,]+)\s*(miles|points)/i;function x(t){let e=String(t??""),n=e.trim();if(!n)return{type:"unknown",value:0,display:e};let i=n.match(W);if(i&&i[1]!==void 0)return{type:"multiplier",value:parseFloat(i[1]),display:e};let o=n.match(q);if(o&&o[1]!==void 0)return{type:"fixed-cash",value:parseFloat(o[1].replace(/,/g,"")),display:e};let r=n.match(V);if(r&&r[1]!==void 0)return{type:"fixed-points",value:parseFloat(r[1].replace(/,/g,"")),display:e};let a=n.match(N);return a&&a[1]!==void 0?{type:"percent",value:parseFloat(a[1]),display:e}:{type:"unknown",value:0,display:e}}function S(t){let e=t.stats??{};return e.cashbackV2??e.cashback??e.cashbackAmount??""}function K(t){if(!t||!t.length)return null;let e=null;for(let n of t){let i=x(n.cashback);i.value>0&&(!e||i.value>e.value)&&(e={value:i.value,display:n.cashback})}return e}function X(t){switch(t){case"great_deal":return"price-drops";case"event_placement":return"events";case"nca_deal":return"new-customer";case"retarget":case"retarget_non_product":return"recently-viewed";default:return"value"}}function G(t){if(!t.href)return null;let e=t.merchantName??"",n=t.domain??"";if(!e&&!n)return null;let i=t.stats??{},o=i.isCutType===!0||i.rewardType==="cut",r,a,s;if(o){let c=K(i.cashbackCategories);if(c){r="percent",a=c.value;let l=c.display.trim();s=l.toLowerCase().startsWith("up to")?l:"Up to "+l}else{let l=x(S(t));r=l.type,a=l.value,s=l.display.toLowerCase().startsWith("up to")?l.display:l.value?"Up to "+l.display:l.display}}else{let c=x(S(t));r=c.type,a=c.value,s=c.display}let d={method:"href",url:t.href},m=X(t.type),f=t.id??null;return{id:f!==null?String(f):`shopping|${e||n}|${s}|${t.type}`,source:"shopping",itemType:t.type,merchant:e||n,domain:n||e,rewardType:r,rewardValue:a,rewardDisplay:s,activation:d,bucketCategory:m,pill:t.pill?.text??null,exclusions:i.exclusionsText??"",eventEnd:t.end??null,priceHistory:i.priceHistory??null,raw:t}}function J(t,e){return`https://capitaloneoffers.com/feed/${encodeURIComponent(t.userId)}/offers/${e}?_data`}function B(t,e){if(t.type==="Carousel"){let a=t.tiles??[],s=[];for(let d of a)for(let m of B(d,e))s.push(m);return s}let n=t.id,i=t.merchantTLD;if(!n||!i)return[];let o=t.buttonText??"",r=x(o);return[{id:n,source:"offers",itemType:t.type,merchant:i,domain:i,rewardType:r.type,rewardValue:r.value,rewardDisplay:r.display,activation:{method:"post-offers",url:J(e,n)},bucketCategory:"value",pill:t.badge?.text??null,exclusions:"",eventEnd:null,priceHistory:null,raw:t}]}var Y={events:"events","price-drops":"price-drops","new-customer":"new-customer","recently-viewed":"recently-viewed"};function Q(t){let e=Y[t.bucketCategory];if(e)return e;let n=t.rewardValue;switch(t.rewardType){case"multiplier":return n>=30?"mult-30":n>=20?"mult-20":n>=10?"mult-10":"mult-1";case"percent":case"cut":return n>=40?"pct-40":n>=20?"pct-20":n>=10?"pct-10":"pct-1";case"fixed-cash":return n>=50?"cash-50":n>=25?"cash-25":"cash-0";case"fixed-points":return n>=1e4?"pts-10k":n>=5e3?"pts-5k":n>=1e3?"pts-1k":"pts-lt-1k";case"unknown":default:return"pct-1"}}var R=[{id:"events",label:"Events",group:"special",initiallyOpen:!0},{id:"price-drops",label:"Price Drops",group:"special",initiallyOpen:!0},{id:"new-customer",label:"New Customer",group:"special",initiallyOpen:!0},{id:"recently-viewed",label:"Recently Viewed",group:"special",initiallyOpen:!0},{id:"mult-30",label:"Multipliers \xB7 30X+",group:"multiplier",initiallyOpen:!0},{id:"mult-20",label:"Multipliers \xB7 20\u201329X",group:"multiplier",initiallyOpen:!0},{id:"mult-10",label:"Multipliers \xB7 10\u201319X",group:"multiplier",initiallyOpen:!1},{id:"mult-1",label:"Multipliers \xB7 1\u20139X",group:"multiplier",initiallyOpen:!1},{id:"pct-40",label:"Percent \xB7 40%+",group:"percent",initiallyOpen:!0},{id:"pct-20",label:"Percent \xB7 20\u201339%",group:"percent",initiallyOpen:!0},{id:"pct-10",label:"Percent \xB7 10\u201319%",group:"percent",initiallyOpen:!1},{id:"pct-1",label:"Percent \xB7 1\u20139%",group:"percent",initiallyOpen:!1},{id:"cash-50",label:"Fixed Cash \xB7 $50+",group:"fixed-cash",initiallyOpen:!0},{id:"cash-25",label:"Fixed Cash \xB7 $25\u201349",group:"fixed-cash",initiallyOpen:!0},{id:"cash-0",label:"Fixed Cash \xB7 under $25",group:"fixed-cash",initiallyOpen:!1},{id:"pts-10k",label:"Fixed Points \xB7 10,000+",group:"fixed-points",initiallyOpen:!0},{id:"pts-5k",label:"Fixed Points \xB7 5,000\u20139,999",group:"fixed-points",initiallyOpen:!0},{id:"pts-1k",label:"Fixed Points \xB7 1,000\u20134,999",group:"fixed-points",initiallyOpen:!1},{id:"pts-lt-1k",label:"Fixed Points \xB7 under 1,000",group:"fixed-points",initiallyOpen:!1}],y=(()=>{let t={};for(let e of R)t[e.id]=e;return t})();function T(t){let e={};for(let r of t){let a=Q(r);(e[a]??(e[a]=[])).push(r)}for(let r of Object.keys(e))e[r].sort((a,s)=>s.rewardValue-a.rewardValue);let n=[],i={};for(let r of R){let a=e[r.id];a&&a.length&&(n.push(r.id),i[r.id]=a.length)}let o={total:t.length,byBucket:i};return{offers:t,buckets:e,bucketOrder:n,stats:o}}async function L(t){let e=t.maxPages??40,n=new Set,i=[],o=null,r=0;for(;r<e;){let a=await t.fetchPage(o);if(!a)break;for(let d of t.getItems(a)){let m=t.dedupeKey(d);m&&n.has(m)||(m&&n.add(m),i.push(d))}r++,t.onPage?.(r,i.length);let s=t.getNextCursor(a);if(!s)break;o=s}return{items:i,hitCap:r>=e,pagesWalked:r}}function Z(t){return JSON.stringify({contentProps:{pagination:{nextPageToken:t??"",limit:25}},context:{url:typeof window<"u"?window.location.href:"",referrer:typeof document<"u"?document.referrer:""}})}function tt(t){let e=t;if(e.id!==void 0&&e.id!==null&&e.id!=="")return String(e.id);let n=t.merchantName??"",i=t.stats?.cashbackV2??t.stats?.cashback??"";return!n&&!i?null:`${n}|${i}|${t.type}`}async function M(t){let e={fetchPage:async o=>{let r=await fetch("/api/v1/feed",{method:"POST",credentials:"include",headers:{"Content-Type":"application/json"},body:Z(o)});return r.ok?await r.json():null},getNextCursor:o=>o.pagination?.nextPageToken??null,getItems:o=>o.items??[],dedupeKey:tt,...t?{onPage:t}:{},maxPages:40},n=await L(e),i=[];for(let o of n.items){let r=G(o);r&&i.push(r)}return{items:i,hitCap:n.hitCap,pagesWalked:n.pagesWalked}}function et(t,e){let n=`https://capitaloneoffers.com/feed/${encodeURIComponent(t.userId)}`,i=`?numberOfColumnsInGrid=5&viewInstanceId=${t.viewInstanceId}&contentSlug=ease-web-l1`;return e?`${n}${i}&cursor=${e}`:`${n}${i}`}function nt(t){if(t.id)return t.id;let e=t.merchantTLD??"",n=t.buttonText??"";return!e&&!n?null:`${e}|${n}`}function rt(t){let e=[];for(let n of t)if(n.type==="Carousel")for(let i of n.tiles??[])e.push(i);else e.push(n);return e}async function D(t,e){let n={fetchPage:async r=>{let a=await fetch(et(t,r),{method:"GET",credentials:"include",headers:{Accept:"application/json"}});return a.ok?await a.json():null},getNextCursor:r=>r.cursor??null,getItems:r=>rt(r.data??[]),dedupeKey:nt,...e?{onPage:e}:{},maxPages:40},i=await L(n),o=[];for(let r of i.items)for(let a of B(r,t))o.push(a);return{items:o,hitCap:i.hitCap,pagesWalked:i.pagesWalked}}function v(t,e,n=0){if(n>6||t===null||typeof t!="object")return null;let i=t;for(let o of e){let r=i[o];if(typeof r=="string"&&r.length>0)return r}for(let o of Object.keys(i)){let r=i[o];if(r&&typeof r=="object"){let a=v(r,e,n+1);if(a)return a}}return null}function A(){let t=null,e=null;try{let n=document.getElementById("__NEXT_DATA__");if(n?.textContent){let i=JSON.parse(n.textContent);t=v(i,["userId","accountReferenceId"]),e=v(i,["viewInstanceId"])}}catch{}if(!t){let n=window.location.pathname.match(/^\/feed\/([^/?#]+)/);n&&n[1]&&(t=decodeURIComponent(n[1]))}if(!e&&t)try{typeof crypto<"u"&&typeof crypto.randomUUID=="function"&&(e=crypto.randomUUID())}catch{}return t&&e?{userId:t,viewInstanceId:e}:null}function it(t,e){return e==="events"?"event":e==="price-drops"?"deal":e==="new-customer"?"new":e==="recently-viewed"?"retarget":t==="great_deal"?"deal":""}function ot(t){return`${t.merchant} ${t.domain} ${t.rewardDisplay} ${t.itemType} ${t.exclusions}`.toLowerCase()}function at(t){if(!t)return"";try{return new Date(t).toLocaleDateString(void 0,{month:"short",day:"numeric"})}catch{return""}}function st(t,e){let n=e.map(o=>{let r=u(ot(o)),a=o.pill?`<span class="c1t-pill ${it(o.itemType,o.bucketCategory)}">${u(o.pill)}</span>`:"",s=o.eventEnd?`<span class="c1t-event-end">ends ${u(at(o.eventEnd))}</span>`:"",d=o.exclusions?` title="${u(o.exclusions)}"`:"",m=o.exclusions?u(o.exclusions):"";return`<tr class="c1t-row-click"
            data-merchant="${u(o.merchant)}"
            data-bucket-id="${u(t.id)}"
            data-search="${r}"
            data-method="${u(o.activation.method)}"
            data-activation-url="${u(o.activation.url)}">
            <td>${u(o.merchant)}</td>
            <td><span class="c1t-reward">${u(o.rewardDisplay)}</span></td>
            <td>${a}</td>
            <td>${s}</td>
            <td><span class="c1t-exclusions"${d}>${m}</span></td>
        </tr>`}).join(""),i=t.initiallyOpen?" open":"";return`<details class="c1t-bucket" data-bucket-id="${t.id}"${i}>
        <summary>${u(t.label)} <span class="c1t-bucket-count">(${e.length})</span></summary>
        <table>
            <thead>
                <tr><th>Merchant</th><th>Reward</th><th>Badge</th><th>Ends</th><th>Exclusions</th></tr>
            </thead>
            <tbody>${n}</tbody>
        </table>
    </details>`}function pt(t){switch(t){case"special":return"Specials";case"multiplier":return"Multipliers";case"percent":return"Percent";case"fixed-cash":return"Cash";case"fixed-points":return"Points"}}function ct(t){let e=new Set;for(let o of t.bucketOrder){let r=y[o];r&&e.add(r.group)}let n=[];for(let o of t.bucketOrder){let r=y[o];r&&r.group==="special"&&n.push(`<button class="c1t-jump-chip" data-jump-to="${r.id}">${u(r.label)}</button>`)}let i=new Set;for(let o of t.bucketOrder){let r=y[o];!r||r.group==="special"||i.has(r.group)||(i.add(r.group),n.push(`<button class="c1t-jump-chip" data-jump-to="${r.id}">${u(pt(r.group))}</button>`))}return n.join("")}function lt(t){let e=t.dataset.activationUrl;e&&window.open(e,"_blank","noopener")}async function dt(t){let e=t.dataset.activationUrl;if(!e)return;let n=window.open("about:blank","_blank");try{let r=(await(await fetch(e,{method:"POST",credentials:"include"})).json())?.affiliate?.redirectUrl;r&&n?n.location=r:n&&(n.close?.(),alert("Activation failed \u2014 try clicking the tile on Cap One directly."))}catch(i){n?.close?.(),alert("Activation failed: "+(i instanceof Error?i.message:String(i)))}}function ut(t){t.addEventListener("click",e=>{let n=e.target;if(!n)return;let i=n.closest("tr[data-method]");i&&(i.dataset.method==="href"?lt(i):i.dataset.method==="post-offers"&&dt(i))})}function mt(t){let e=t.querySelector("#c1t-browse-search input"),n=t.querySelector("#c1t-browse-search button");if(!e)return;let i=new Map;t.querySelectorAll("details[data-bucket-id]").forEach(a=>{let s=a,d=s.dataset.bucketId??"";i.set(d,s.open)});let o=null,r=a=>{let s=a.trim().toLowerCase(),d=s.length===0;t.querySelectorAll("details[data-bucket-id]").forEach(f=>{let p=f,c=p.dataset.bucketId??"",l=p.querySelectorAll("tr[data-search]"),h=0;l.forEach(b=>{let P=b.dataset.search??"",C=d||P.includes(s);b.style.display=C?"":"none",C&&h++}),h===0&&!d?p.style.display="none":(p.style.display="",d?p.open=i.get(c)??!1:p.open=!0)})};e.addEventListener("input",()=>{o&&clearTimeout(o),o=setTimeout(()=>r(e.value),100)}),n&&n.addEventListener("click",()=>{e.value="",r("")})}function ft(t){let e=t.querySelector("#c1t-browse-nav");e&&e.addEventListener("click",n=>{let i=n.target;if(!i)return;let o=i.closest("[data-jump-to]");if(!o)return;let r=o.dataset.jumpTo;if(!r)return;let a=t.querySelector(`details[data-bucket-id="${r}"]`);a&&(a.open=!0,a.scrollIntoView({behavior:"smooth",block:"start"}))})}var F=(t,e)=>{let n=t.querySelector("#c1t-content");if(!n)return;let i=e.bucketOrder.map(s=>{let d=y[s];if(!d)return"";let m=e.buckets[s];return!m||!m.length?"":st(d,m)}).join(""),o=ct(e),r=e.stats.hitCap?`Stopped at ${e.stats.total} items (max pages reached)`:`${e.stats.total} offers across ${e.bucketOrder.length} buckets`;n.innerHTML=`
        <div id="c1t-browse-search">
            <input type="search" placeholder="Search merchant / reward / type..." />
            <button type="button">Clear</button>
        </div>
        <div id="c1t-browse-nav">${o}</div>
        <div id="c1t-browse-stats">${u(r)}</div>
        <div id="c1t-browse-body">${i||'<div style="padding:40px;text-align:center;opacity:0.7;">No offers found.</div>'}</div>
        <div id="c1t-browse-footer">Click a row to activate. Shopping rows open the pre-signed href; offers rows POST then redirect.</div>
    `;let a=n.querySelector("#c1t-browse-body");a&&ut(a),mt(n),ft(n)};(async function(){"use strict";let t=w();if(!t){alert("Please run this on capitaloneshopping.com or capitaloneoffers.com");return}let e=I();if(e===null){let n=g[t].pages.trips,i=g[t].pages.browse;alert(`Please navigate to a Capital One Shopping Trips or browse page:
${window.location.origin}${n}
${window.location.origin}${i}`);return}if(document.getElementById("c1t-fab")){let n=document.getElementById("c1t-overlay");n&&n.classList.add("open");return}console.log("[C1 Tracker Bookmarklet] Running on",t,"mode=",e),e==="trips"?gt(t):ht(t)})();function gt(t){let e=null,n=k({processedData:null,onOpen:()=>{e||o()},render:$,getBadgeCount:r=>r?.stats?.withCredit??0});n.ensureFab(),n.ensureOverlay();let i=document.getElementById("c1t-overlay");i&&i.classList.add("open");async function o(){let r=document.querySelector("#c1t-content");r&&(r.innerHTML='<div id="c1t-loading">Fetching shopping trips data...</div>');try{let a;if(t==="shopping"){let s=await fetch(g.shopping.trips.apiEndpoint,{credentials:"include"});if(!s.ok)throw new Error(`API returned ${s.status}`);a=await s.json()}else{let s=await fetch(g.offers.trips.apiEndpoint,{method:"POST",credentials:"include"});if(!s.ok)throw new Error(`API returned ${s.status}`);a=await s.json()}console.log("[C1 Tracker Bookmarklet] Fetched trips data"),e=E(a),console.log("[C1 Tracker Bookmarklet] Processed:",e.stats),n.updateData(e)}catch(a){console.error("[C1 Tracker Bookmarklet] Trips error:",a);let s=a instanceof Error?a.message:String(a);r&&(r.innerHTML=`
                    <div id="c1t-loading">
                        <p>Error fetching data: ${s}</p>
                        <p style="margin-top: 10px; font-size: 12px; opacity: 0.8;">
                            Make sure you're logged in and try navigating to the Shopping Trips page first.
                        </p>
                    </div>
                `)}}o()}function ht(t){let e=k({processedData:null,render:F,getBadgeCount:o=>o?.stats?.total??0});e.ensureFab(),e.ensureOverlay();let n=document.getElementById("c1t-overlay");n&&n.classList.add("open");let i=o=>{let r=document.querySelector("#c1t-loading");if(r){r.textContent=o;return}let a=document.querySelector("#c1t-content");a&&(a.innerHTML=`<div id="c1t-loading">${o}</div>`)};i("Walking offers feed... (0 pages)"),bt(t,i).then(o=>{o&&e.updateData(o)}).catch(o=>{console.error("[C1 Tracker Bookmarklet] Browse error:",o);let r=o instanceof Error?o.message:String(o);i("Error walking feed: "+r)})}async function bt(t,e){let n=(a,s)=>{e(`Loaded ${a} pages, ${s} offers...`)};if(t==="shopping"){let a=await M(n),s=T(a.items);return s.stats.hitCap=a.hitCap,s.stats.pagesWalked=a.pagesWalked,s}let i=A();if(!i)return e("Could not capture offers feed context. Please reload https://capitaloneoffers.com/feed and re-run the bookmarklet so __NEXT_DATA__ is available."),null;let o=await D(i,n),r=T(o.items);return r.stats.hitCap=o.hitCap,r.stats.pagesWalked=o.pagesWalked,r}})();
