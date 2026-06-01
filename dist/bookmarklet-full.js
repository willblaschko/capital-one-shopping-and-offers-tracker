"use strict";(()=>{var b={offers:{hostname:"capitaloneoffers",pages:{trips:"/c1-offers/shopping-trips",browse:"/feed"},trips:{apiPattern:t=>t.includes("shopping-trips")&&t.includes("version=2")&&t.includes("_data="),apiEndpoint:"/c1-offers/shopping-trips?limit=300&offset=0&version=2&_data=routes%2Fc1-offers.shopping-trips"},browse:{apiPattern:t=>t.includes("/feed/")&&t.includes("viewInstanceId=")}},shopping:{hostname:"capitaloneshopping",pages:{trips:"/account-settings/shopping-trips",browse:"/"},trips:{apiPattern:t=>t.includes("/api/v1/trip_orders"),apiEndpoint:"/api/v1/trip_orders"},browse:{apiPattern:t=>t.endsWith("/api/v1/feed"),apiEndpoint:"/api/v1/feed"}}};function k(){return window.location.hostname.includes("capitaloneoffers")?"offers":window.location.hostname.includes("capitaloneshopping")?"shopping":null}function O(){let t=k();if(!t)return null;let e=window.location.pathname,n=b[t].pages;return e.startsWith(n.trips)?"trips":t==="shopping"&&(e==="/"||e==="")||t==="offers"&&e.startsWith(n.browse)?"browse":null}function H(t){if(!t)return[];if(Array.isArray(t))return t;let e=t;return Array.isArray(e.items)?e.items:Array.isArray(e.shoppingTrips)?e.shoppingTrips:Array.isArray(e.trip_orders)?e.trip_orders:e.data&&Array.isArray(e.data)?e.data:e.data&&typeof e.data=="object"&&Array.isArray(e.data.items)?e.data.items:[]}function _(t){let e=t.orderAmount??t.order_amount??(t.trxnTotalCents!=null?t.trxnTotalCents/100:null),n=t.creditAmount??t.credit_amount??(t.payoutAmountCents!=null?t.payoutAmountCents/100:null),o=t.orderId??t.order_id??null,a=n!==null&&Number(n)>0,r=t.status??"Unknown";r==="Waiting"?r="Created":r==="Inactive"&&(r="Canceled");let i=r;return a&&r.toLowerCase()==="canceled"?i="Completed":r.toLowerCase()==="pending"&&(i=a?"Pending \u2713":"Pending ?"),{id:t.id??t.tripId??t.activatedOfferId??null,tripId:t.tripId??t.trip_id??t.id??t.activatedOfferId??null,orderId:o,merchant:t.vendor??t.merchantName??t.merchantDisplayName??t.merchant??t.domain??"Unknown",domain:t.domain??null,status:i,rawStatus:r,orderAmount:e!==null?Number(e):null,creditAmount:n!==null?Number(n):null,date:t.createdAt??t.created_at??t.clickDate??t.date??null,hasOrderId:o!==null,hasAmount:e!==null&&Number(e)>0,hasCreditAmount:a,raw:t}}function $(t){let n=H(t).map(_);return{trips:n,stats:{total:n.length,withOrderId:n.filter(o=>o.hasOrderId).length,withAmount:n.filter(o=>o.hasAmount).length,withCredit:n.filter(o=>o.hasCreditAmount).length,pending:n.filter(o=>o.status.toLowerCase().includes("pending")).length,created:n.filter(o=>o.status.toLowerCase()==="created").length}}}var U=`
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
`;function I(t){return t==null||t===0?"\u2014":"$"+Number(t).toFixed(2)}function z(t){if(!t)return"\u2014";try{return new Date(t).toLocaleDateString()}catch{return"\u2014"}}function d(t){if(t==null)return"";let e=document.createElement("div");return e.textContent=String(t),e.innerHTML}function j(t){let e=(t||"").toLowerCase();return e.includes("completed")?"completed":e==="pending \u2713"?"pending-good":e==="pending ?"||e.includes("pending")?"pending-uncertain":e.includes("created")?"created":e.includes("cancel")?"canceled":e.includes("adjust")?"adjusted":""}var E=(t,e)=>{if(console.log("[C1 Tracker] renderTripsToModal called - data:",!!e,"overlay:",!!t),!e)return;let{trips:n,stats:o}=e,a=t.querySelector("#c1t-content");console.log("[C1 Tracker] renderTripsToModal - content element:",!!a,"trips:",n?.length),a&&(a.innerHTML=`
        <div id="c1t-stats">
            <span class="stat"><strong>${o.total}</strong> total</span>
            <span class="stat"><strong>${o.withOrderId}</strong> tracked</span>
            <span class="stat"><strong>${o.withAmount}</strong> with amount</span>
            <span class="stat"><strong>${o.withCredit}</strong> with cashback</span>
        </div>
        <div id="c1t-filters">
            <button class="c1t-filter-btn active" data-filter="all">All (${o.total})</button>
            <button class="c1t-filter-btn" data-filter="amount">With Amount (${o.withAmount})</button>
            <button class="c1t-filter-btn" data-filter="tracked">Tracked (${o.withOrderId})</button>
            <button class="c1t-filter-btn" data-filter="pending">Pending (${o.pending})</button>
            <button class="c1t-filter-btn" data-filter="created">Waiting (${o.created})</button>
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
                    ${n.map(r=>{let i=r.hasCreditAmount?"amt":r.hasOrderId?"tracked":"",s=j(r.status);return`
                                <tr class="${i}" data-filter-amount="${r.hasAmount}" data-filter-tracked="${r.hasOrderId}" data-filter-pending="${r.status.toLowerCase().includes("pending")}" data-filter-created="${r.status.toLowerCase()==="created"}">
                                    <td title="${d(r.domain)}">${d(r.merchant)}</td>
                                    <td class="c">${z(r.date)}</td>
                                    <td class="r ${r.hasAmount?"c1t-amount":""}">${I(r.orderAmount)}</td>
                                    <td class="r ${r.hasCreditAmount?"c1t-credit":""}">${I(r.creditAmount)}</td>
                                    <td class="c"><span class="c1t-status ${s}">${d(r.status)}</span></td>
                                    <td class="c">${r.hasOrderId?"\u2713":"\u2014"}</td>
                                </tr>
                            `}).join("")}
                </tbody>
            </table>
        </div>
        <div id="c1t-footer">
            <details>
                <summary>Show Raw JSON</summary>
                <pre>${d(JSON.stringify(n.slice(0,30).map(r=>r.raw),null,2))}${n.length>30?`

... and `+(n.length-30)+" more":""}</pre>
            </details>
        </div>
    `,a.querySelectorAll(".c1t-filter-btn").forEach(r=>{r.addEventListener("click",function(){a.querySelectorAll(".c1t-filter-btn").forEach(s=>s.classList.remove("active")),this.classList.add("active");let i=this.dataset.filter;a.querySelectorAll("#c1t-tbody tr").forEach(s=>{if(i==="all")s.style.display="";else if(i){let p=`filter${i.charAt(0).toUpperCase()+i.slice(1)}`;s.style.display=s.dataset[p]==="true"?"":"none"}})})}))};function v(t){let{onOpen:e,processedData:n,render:o,getBadgeCount:a,title:r="Shopping Trips Tracker",loadingText:i="Waiting for data... Navigate to Shopping Trips page and data will load automatically."}=t,s=!1,p=n;function u(){if(s&&document.getElementById("c1t-styles"))return;let c=document.getElementById("c1t-styles");c||(c=document.createElement("style"),c.id="c1t-styles",c.textContent=U,(document.head||document.documentElement).appendChild(c)),s=!0}function g(){u();let c=document.getElementById("c1t-fab");if(c)return c;let l=document.createElement("button");return l.id="c1t-fab",l.innerHTML="\u{1F4CB}",l.title=r,l.addEventListener("click",async()=>{let m=h();m.classList.add("open"),!p&&e&&(await e(),p&&o(m,p))}),document.body.appendChild(l),p&&f(l,p),l}function h(){u();let c=document.getElementById("c1t-overlay"),l=!1;if(console.log("[C1 Tracker] ensureOverlay - existing:",!!c,"currentData:",!!p),!c){l=!0,c=document.createElement("div"),c.id="c1t-overlay",c.innerHTML=`
                <div id="c1t-modal">
                    <div id="c1t-header">
                        <h2>\u{1F4CB} ${d(r)}</h2>
                        <button id="c1t-close">\u2715</button>
                    </div>
                    <div id="c1t-content">
                        <div id="c1t-loading">${d(i)}</div>
                    </div>
                </div>
            `,document.body.appendChild(c);let m=c,x=m.querySelector("#c1t-close");x&&x.addEventListener("click",()=>m.classList.remove("open")),m.addEventListener("click",y=>{y.target===m&&m.classList.remove("open")})}return console.log("[C1 Tracker] ensureOverlay - isNew:",l,"currentData:",!!p),p&&o(c,p),c}function f(c,l){if(!l)return;c.classList.add("has-data");let m=a(l);m>0?c.innerHTML=`\u{1F4CB}<span class="badge">${m}</span>`:c.innerHTML="\u{1F4CB}"}return document.addEventListener("keydown",c=>{if(c.key==="Escape"){let l=document.getElementById("c1t-overlay");l&&l.classList.remove("open")}}),{ensureStyles:u,ensureFab:g,ensureOverlay:h,updateFabState:f,updateData(c){console.log("[C1 Tracker] updateData called"),p=c;let l=document.getElementById("c1t-fab");l&&f(l,c);let m=document.getElementById("c1t-overlay");m&&o(m,c)}}}var W=/(\d+(?:\.\d+)?)X/i,N=/(\d+(?:\.\d+)?)%/,q=/\$([\d,]+(?:\.\d+)?)/,V=/([\d,]+)\s*(miles|points)/i;function w(t){let e=String(t??""),n=e.trim();if(!n)return{type:"unknown",value:0,display:e};let o=n.match(W);if(o&&o[1]!==void 0)return{type:"multiplier",value:parseFloat(o[1]),display:e};let a=n.match(q);if(a&&a[1]!==void 0)return{type:"fixed-cash",value:parseFloat(a[1].replace(/,/g,"")),display:e};let r=n.match(V);if(r&&r[1]!==void 0)return{type:"fixed-points",value:parseFloat(r[1].replace(/,/g,"")),display:e};let i=n.match(N);return i&&i[1]!==void 0?{type:"percent",value:parseFloat(i[1]),display:e}:{type:"unknown",value:0,display:e}}function S(t){let e=t.stats??{};return e.cashbackV2??e.cashback??e.cashbackAmount??""}function X(t){if(!t||!t.length)return null;let e=null;for(let n of t){let o=w(n.cashback);o.value>0&&(!e||o.value>e.value)&&(e={value:o.value,display:n.cashback})}return e}function K(t){switch(t){case"great_deal":return"price-drops";case"event_placement":return"events";case"nca_deal":return"new-customer";case"retarget":case"retarget_non_product":return"recently-viewed";default:return"value"}}function J(t){if(!t.href)return null;let e=t.merchantName??"",n=t.domain??"";if(!e&&!n)return null;let o=t.stats??{},a=o.isCutType===!0||o.rewardType==="cut",r,i,s;if(a){let f=X(o.cashbackCategories);if(f){r="percent",i=f.value;let c=f.display.trim();s=c.toLowerCase().startsWith("up to")?c:"Up to "+c}else{let c=w(S(t));r=c.type,i=c.value,s=c.display.toLowerCase().startsWith("up to")?c.display:c.value?"Up to "+c.display:c.display}}else{let f=w(S(t));r=f.type,i=f.value,s=f.display}let p={method:"href",url:t.href},u=K(t.type),g=t.id??null;return{id:g!==null?String(g):`shopping|${e||n}|${s}|${t.type}`,source:"shopping",itemType:t.type,merchant:e||n,domain:n||e,rewardType:r,rewardValue:i,rewardDisplay:s,activation:p,bucketCategory:u,pill:t.pill?.text??null,exclusions:o.exclusionsText??"",eventEnd:t.end??null,priceHistory:o.priceHistory??null,raw:t}}function G(t,e){return`https://capitaloneoffers.com/feed/${encodeURIComponent(t.userId)}/offers/${e}?_data`}function B(t,e){if(t.type==="Carousel"){let s=t.tiles??[],p=[];for(let u of s)for(let g of B(u,e))p.push(g);return p}let n=t.id,o=t.merchantTLD;if(!n||!o)return[];let a=t.buttonText??"",r=w(a),i=t.subText&&t.headingText?`${t.headingText} \u2014 ${t.subText}`:t.subText??t.headingText??t.text??"";return[{id:n,source:"offers",itemType:t.type,merchant:o,domain:o,rewardType:r.type,rewardValue:r.value,rewardDisplay:r.display,activation:{method:"post-offers",url:G(e,n)},bucketCategory:"value",pill:t.badge?.text??null,exclusions:i,eventEnd:null,priceHistory:null,raw:t}]}function Q(t){let e=t.rewardValue;switch(t.rewardType){case"multiplier":return e>=30?"mult-30":e>=20?"mult-20":e>=10?"mult-10":"mult-1";case"percent":case"cut":return e>=40?"pct-40":e>=20?"pct-20":e>=10?"pct-10":"pct-1";case"fixed-cash":return e>=50?"cash-50":e>=25?"cash-25":"cash-0";case"fixed-points":return e>=1e4?"pts-10k":e>=5e3?"pts-5k":e>=1e3?"pts-1k":"pts-lt-1k";case"unknown":default:return"pct-1"}}var L=[{id:"mult-30",label:"Multipliers \xB7 30X+",group:"multiplier",initiallyOpen:!0},{id:"mult-20",label:"Multipliers \xB7 20\u201329X",group:"multiplier",initiallyOpen:!0},{id:"mult-10",label:"Multipliers \xB7 10\u201319X",group:"multiplier",initiallyOpen:!1},{id:"mult-1",label:"Multipliers \xB7 1\u20139X",group:"multiplier",initiallyOpen:!1},{id:"pct-40",label:"Percent \xB7 40%+",group:"percent",initiallyOpen:!0},{id:"pct-20",label:"Percent \xB7 20\u201339%",group:"percent",initiallyOpen:!0},{id:"pct-10",label:"Percent \xB7 10\u201319%",group:"percent",initiallyOpen:!1},{id:"pct-1",label:"Percent \xB7 1\u20139%",group:"percent",initiallyOpen:!1},{id:"cash-50",label:"Fixed Cash \xB7 $50+",group:"fixed-cash",initiallyOpen:!0},{id:"cash-25",label:"Fixed Cash \xB7 $25\u201349",group:"fixed-cash",initiallyOpen:!0},{id:"cash-0",label:"Fixed Cash \xB7 under $25",group:"fixed-cash",initiallyOpen:!1},{id:"pts-10k",label:"Fixed Points \xB7 10,000+",group:"fixed-points",initiallyOpen:!0},{id:"pts-5k",label:"Fixed Points \xB7 5,000\u20139,999",group:"fixed-points",initiallyOpen:!0},{id:"pts-1k",label:"Fixed Points \xB7 1,000\u20134,999",group:"fixed-points",initiallyOpen:!1},{id:"pts-lt-1k",label:"Fixed Points \xB7 under 1,000",group:"fixed-points",initiallyOpen:!1}],R=(()=>{let t={};for(let e of L)t[e.id]=e;return t})();function C(t){let e={};for(let r of t){let i=Q(r);(e[i]??(e[i]=[])).push(r)}for(let r of Object.keys(e))e[r].sort((i,s)=>s.rewardValue-i.rewardValue);let n=[],o={};for(let r of L){let i=e[r.id];i&&i.length&&(n.push(r.id),o[r.id]=i.length)}let a={total:t.length,byBucket:o};return{offers:t,buckets:e,bucketOrder:n,stats:a}}async function D(t){let e=t.maxPages??40,n=new Set,o=[],a=null,r=0;for(;r<e;){let i=await t.fetchPage(a);if(!i)break;for(let p of t.getItems(i)){let u=t.dedupeKey(p);u&&n.has(u)||(u&&n.add(u),o.push(p))}r++,t.onPage?.(r,o.length);let s=t.getNextCursor(i);if(!s)break;a=s}return{items:o,hitCap:r>=e,pagesWalked:r}}function Y(t){let e={limit:25};return t&&(e.nextPageToken=t),JSON.stringify({contentProps:{pagination:e},context:{device:{model:typeof navigator<"u"&&/Mac/.test(navigator.platform)?"Macintosh":"Unknown",manufacturer:"Unknown",memory:"8",concurrency:String(typeof navigator<"u"&&navigator.hardwareConcurrency||4)},browser:{name:"Chrome",version:"0",major:"0"},os:{name:"unknown",version:"0"},screen:{width:1920,height:1080,density:2},locale:typeof navigator<"u"&&navigator.language?navigator.language:"en-US",country:"US",location:{state:"",zipcode:"",latitude:null,longitude:null,isInCensusData:!1},page:{path:typeof window<"u"?window.location.pathname:"/",url:typeof window<"u"?window.location.href:"",referrer:typeof document<"u"?document.referrer:"",search:typeof window<"u"?window.location.search:"",title:typeof document<"u"?document.title:""},userAgent:typeof navigator<"u"?navigator.userAgent:""}})}function Z(t){let e=t;if(e.id!==void 0&&e.id!==null&&e.id!=="")return String(e.id);let n=t.merchantName??"",o=t.stats?.cashbackV2??t.stats?.cashback??"";return!n&&!o?null:`${n}|${o}|${t.type}`}async function M(t){let e={fetchPage:async r=>{let i=await fetch("/api/v1/feed",{method:"POST",credentials:"include",headers:{"Content-Type":"application/json"},body:Y(r)});if(!i.ok)return console.warn("[C1 Tracker] shopping feed POST failed",{status:i.status,statusText:i.statusText,cursor:r}),null;let s=await i.json();return r||console.log("[C1 Tracker] shopping feed first page",{count:s.count,itemCount:s.items?.length??0,nextPageToken:s.pagination?.nextPageToken}),s},getNextCursor:r=>r.pagination?.nextPageToken??null,getItems:r=>r.items??[],dedupeKey:Z,...t?{onPage:t}:{},maxPages:40},n=await D(e),o=[],a=0;for(let r of n.items){let i=J(r);i?o.push(i):a++}return console.log("[C1 Tracker] shopping walk done",{rawItems:n.items.length,normalized:o.length,droppedDuringNormalize:a,pagesWalked:n.pagesWalked,hitCap:n.hitCap}),{items:o,hitCap:n.hitCap,pagesWalked:n.pagesWalked}}function tt(t,e){let n=`https://capitaloneoffers.com/feed/${encodeURIComponent(t.userId)}`,o=`?numberOfColumnsInGrid=5&viewInstanceId=${t.viewInstanceId}&contentSlug=ease-web-l1`;return e?`${n}${o}&cursor=${e}`:`${n}${o}`}function et(t){let e=t.merchantTLD??"",n=t.buttonText??"";return e&&n?`${e}|${n}`:t.id??null}function nt(t){let e=[];for(let n of t)if(n.type==="Carousel")for(let o of n.tiles??[])e.push(o);else e.push(n);return e}async function A(t,e){let n={fetchPage:async r=>{let i=await fetch(tt(t,r),{method:"GET",credentials:"include",headers:{Accept:"application/json"}});return i.ok?await i.json():null},getNextCursor:r=>r.cursor??null,getItems:r=>nt(r.data??[]),dedupeKey:et,...e?{onPage:e}:{},maxPages:40},o=await D(n),a=[];for(let r of o.items)for(let i of B(r,t))a.push(i);return{items:a,hitCap:o.hitCap,pagesWalked:o.pagesWalked}}function T(t,e,n=0){if(n>6||t===null||typeof t!="object")return null;let o=t;for(let a of e){let r=o[a];if(typeof r=="string"&&r.length>0)return r}for(let a of Object.keys(o)){let r=o[a];if(r&&typeof r=="object"){let i=T(r,e,n+1);if(i)return i}}return null}function rt(){let t=null,e=null;try{e=new URLSearchParams(window.location.search).get("viewInstanceId")}catch{}let n=window.location.pathname.match(/^\/feed\/([^/?#]+)/);if(n&&n[1]&&(t=decodeURIComponent(n[1])),!t||!e)try{let o=document.getElementById("__NEXT_DATA__");if(o?.textContent){let a=JSON.parse(o.textContent);t||(t=T(a,["userId","accountReferenceId"])),e||(e=T(a,["viewInstanceId"]))}}catch{}if(!e&&t)try{typeof crypto<"u"&&typeof crypto.randomUUID=="function"&&(e=crypto.randomUUID())}catch{}return t&&e?{userId:t,viewInstanceId:e}:(console.warn("[C1 Tracker] getOffersBrowseContext (sync) failed",{pathname:window.location.pathname,search:window.location.search,userId:t,viewInstanceId:e,hasNextData:!!document.getElementById("__NEXT_DATA__")}),null)}async function P(){let t=rt();if(t)return t;let e=null,n=null;try{n=new URLSearchParams(window.location.search).get("viewInstanceId")}catch{}try{let o=await fetch("/c1-offers/shopping-trips?limit=1&offset=0&version=2&_data=routes%2Fc1-offers.shopping-trips",{method:"POST",credentials:"include"});if(o.ok){let a=await o.json();Array.isArray(a)&&a.length>0&&typeof a[0]?.accountReferenceId=="string"&&(e=a[0].accountReferenceId)}}catch(o){console.warn("[C1 Tracker] trips-API fallback for userId failed:",o)}if(!n&&e)try{typeof crypto<"u"&&typeof crypto.randomUUID=="function"&&(n=crypto.randomUUID())}catch{}return e&&n?{userId:e,viewInstanceId:n}:(console.warn("[C1 Tracker] fetchOffersBrowseContext failed",{userId:e,viewInstanceId:n}),null)}function ot(t,e){return e==="events"?"event":e==="price-drops"?"deal":e==="new-customer"?"new":e==="recently-viewed"?"retarget":t==="great_deal"?"deal":""}function at(t){return`${t.merchant} ${t.domain} ${t.rewardDisplay} ${t.itemType} ${t.exclusions}`.toLowerCase()}function it(t){if(!t)return"";try{return new Date(t).toLocaleDateString(void 0,{month:"short",day:"numeric"})}catch{return""}}function st(t,e){let n=e.map(a=>{let r=d(at(a)),i=a.pill?`<span class="c1t-pill ${ot(a.itemType,a.bucketCategory)}">${d(a.pill)}</span>`:"",s=a.eventEnd?`<span class="c1t-event-end">ends ${d(it(a.eventEnd))}</span>`:"",p=a.exclusions??"",u=p?` title="${d(p)}"`:"",g=p?d(p):"",h=p.length>60,f=g?h?`<div class="c1t-excl-cell"${u}>
                       <span class="c1t-excl-text">${g}</span><button type="button" class="c1t-excl-toggle">(more)</button>
                   </div>`:`<div class="c1t-excl-cell"${u}><span class="c1t-excl-text">${g}</span></div>`:"";return`<tr class="c1t-row-click"
            data-merchant="${d(a.merchant)}"
            data-bucket-id="${d(t.id)}"
            data-search="${r}"
            data-method="${d(a.activation.method)}"
            data-activation-url="${d(a.activation.url)}">
            <td>${d(a.merchant)}</td>
            <td><span class="c1t-reward">${d(a.rewardDisplay)}</span></td>
            <td>${i}</td>
            <td>${s}</td>
            <td>${f}</td>
        </tr>`}).join(""),o=t.initiallyOpen?" open":"";return`<details class="c1t-bucket" data-bucket-id="${t.id}"${o}>
        <summary>${d(t.label)} <span class="c1t-bucket-count">(${e.length})</span></summary>
        <table>
            <thead>
                <tr><th>Merchant</th><th>Reward</th><th>Badge</th><th>Ends</th><th>Exclusions</th></tr>
            </thead>
            <tbody>${n}</tbody>
        </table>
    </details>`}function ct(t){switch(t){case"multiplier":return"Multipliers";case"percent":return"Percent";case"fixed-cash":return"Cash";case"fixed-points":return"Points"}}function pt(t){let e=[],n=new Set;for(let o of t.bucketOrder){let a=R[o];a&&(n.has(a.group)||(n.add(a.group),e.push(`<button class="c1t-jump-chip" data-jump-to="${a.id}">${d(ct(a.group))}</button>`)))}return e.join("")}function lt(t){let e=t.dataset.activationUrl;e&&window.open(e,"_blank","noopener")}async function dt(t){let e=t.dataset.activationUrl;if(!e)return;let n=window.open("about:blank","_blank");try{let r=(await(await fetch(e,{method:"POST",credentials:"include"})).json())?.affiliate?.redirectUrl;r&&n?n.location=r:n&&(n.close?.(),alert("Activation failed \u2014 try clicking the tile on Cap One directly."))}catch(o){n?.close?.(),alert("Activation failed: "+(o instanceof Error?o.message:String(o)))}}function ut(t){t.addEventListener("click",e=>{let n=e.target;if(!n)return;let o=n.closest(".c1t-excl-toggle");if(o){e.stopPropagation(),e.preventDefault();let r=o.closest(".c1t-excl-cell");if(r){let i=r.classList.toggle("c1t-excl-expanded");o.textContent=i?"(less)":"(more)"}return}let a=n.closest("tr[data-method]");a&&(a.dataset.method==="href"?lt(a):a.dataset.method==="post-offers"&&dt(a))})}function mt(t){let e=t.querySelector("#c1t-browse-search input"),n=t.querySelector("#c1t-browse-search button");if(!e)return;let o=new Map;t.querySelectorAll("details[data-bucket-id]").forEach(i=>{let s=i,p=s.dataset.bucketId??"";o.set(p,s.open)});let a=null,r=i=>{let s=i.trim().toLowerCase(),p=s.length===0;t.querySelectorAll("details[data-bucket-id]").forEach(g=>{let h=g,f=h.dataset.bucketId??"",c=h.querySelectorAll("tr[data-search]"),l=0;c.forEach(m=>{let x=m.dataset.search??"",y=p||x.includes(s);m.style.display=y?"":"none",y&&l++}),l===0&&!p?h.style.display="none":(h.style.display="",p?h.open=o.get(f)??!1:h.open=!0)})};e.addEventListener("input",()=>{a&&clearTimeout(a),a=setTimeout(()=>r(e.value),100)}),n&&n.addEventListener("click",()=>{e.value="",r("")})}function ft(t){let e=t.querySelector("#c1t-browse-nav");e&&e.addEventListener("click",n=>{let o=n.target;if(!o)return;let a=o.closest("[data-jump-to]");if(!a)return;let r=a.dataset.jumpTo;if(!r)return;let i=t.querySelector(`details[data-bucket-id="${r}"]`);i&&(i.open=!0,i.scrollIntoView({behavior:"smooth",block:"start"}))})}var F=(t,e)=>{let n=t.querySelector("#c1t-content");if(!n)return;let o=e.bucketOrder.map(s=>{let p=R[s];if(!p)return"";let u=e.buckets[s];return!u||!u.length?"":st(p,u)}).join(""),a=pt(e),r=e.stats.hitCap?`Stopped at ${e.stats.total} items (max pages reached)`:`${e.stats.total} offers across ${e.bucketOrder.length} buckets`;n.innerHTML=`
        <div id="c1t-browse-search">
            <input type="search" placeholder="Search merchant / reward / type..." />
            <button type="button">Clear</button>
        </div>
        <div id="c1t-browse-nav">${a}</div>
        <div id="c1t-browse-stats">${d(r)}</div>
        <div id="c1t-browse-body">${o||'<div style="padding:40px;text-align:center;opacity:0.7;">No offers found.</div>'}</div>
        <div id="c1t-browse-footer">Click a row to activate. Shopping rows open the pre-signed href; offers rows POST then redirect.</div>
    `;let i=n.querySelector("#c1t-browse-body");i&&ut(i),mt(n),ft(n)};(async function(){"use strict";let t=k();if(!t){alert("Please run this on capitaloneshopping.com or capitaloneoffers.com");return}let e=O();if(e===null){let n=b[t].pages.trips,o=b[t].pages.browse;alert(`Please navigate to a Capital One Shopping Trips or browse page:
${window.location.origin}${n}
${window.location.origin}${o}`);return}if(document.getElementById("c1t-fab")){let n=document.getElementById("c1t-overlay");n&&n.classList.add("open");return}console.log("[C1 Tracker Bookmarklet] Running on",t,"mode=",e),e==="trips"?gt(t):ht(t)})();function gt(t){let e=null,n=v({processedData:null,onOpen:()=>{e||a()},render:E,getBadgeCount:r=>r?.stats?.withCredit??0});n.ensureFab(),n.ensureOverlay();let o=document.getElementById("c1t-overlay");o&&o.classList.add("open");async function a(){let r=document.querySelector("#c1t-content");r&&(r.innerHTML='<div id="c1t-loading">Fetching shopping trips data...</div>');try{let i;if(t==="shopping"){let s=await fetch(b.shopping.trips.apiEndpoint,{credentials:"include"});if(!s.ok)throw new Error(`API returned ${s.status}`);i=await s.json()}else{let s=await fetch(b.offers.trips.apiEndpoint,{method:"POST",credentials:"include"});if(!s.ok)throw new Error(`API returned ${s.status}`);i=await s.json()}console.log("[C1 Tracker Bookmarklet] Fetched trips data"),e=$(i),console.log("[C1 Tracker Bookmarklet] Processed:",e.stats),n.updateData(e)}catch(i){console.error("[C1 Tracker Bookmarklet] Trips error:",i);let s=i instanceof Error?i.message:String(i);r&&(r.innerHTML=`
                    <div id="c1t-loading">
                        <p>Error fetching data: ${s}</p>
                        <p style="margin-top: 10px; font-size: 12px; opacity: 0.8;">
                            Make sure you're logged in and try navigating to the Shopping Trips page first.
                        </p>
                    </div>
                `)}}a()}function ht(t){let e=v({processedData:null,render:F,getBadgeCount:a=>a?.stats?.total??0,title:t==="offers"?"Browse Cap One Offers":"Browse Cap One Shopping",loadingText:"Loading offers feed..."});e.ensureFab(),e.ensureOverlay();let n=document.getElementById("c1t-overlay");n&&n.classList.add("open");let o=a=>{let r=document.querySelector("#c1t-loading");if(r){r.textContent=a;return}let i=document.querySelector("#c1t-content");i&&(i.innerHTML=`<div id="c1t-loading">${a}</div>`)};o("Walking offers feed... (0 pages)"),bt(t,o).then(a=>{a&&e.updateData(a)}).catch(a=>{console.error("[C1 Tracker Bookmarklet] Browse error:",a);let r=a instanceof Error?a.message:String(a);o("Error walking feed: "+r)})}async function bt(t,e){let n=(i,s)=>{e(`Loaded ${i} pages, ${s} offers...`)};if(t==="shopping"){let i=await M(n),s=C(i.items);return s.stats.hitCap=i.hitCap,s.stats.pagesWalked=i.pagesWalked,s}let o=await P();if(!o)return e("Could not capture offers feed context (userId + viewInstanceId). Open DevTools console for diagnostics. The URL should look like /feed/<userId>?viewInstanceId=<uuid>. Try clicking into the feed grid once, then re-run."),null;let a=await A(o,n),r=C(a.items);return r.stats.hitCap=a.hitCap,r.stats.pagesWalked=a.pagesWalked,r}})();
