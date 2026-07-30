"use strict";(()=>{var b={offers:{hostname:"capitaloneoffers",pages:{trips:"/shopping-trips",browse:"/feed"},trips:{apiPattern:t=>t.includes("/xhr/shopping-trips"),apiEndpoint:"/xhr/shopping-trips?limit=100&offset=0&status[]=Adjusted&status[]=Completed&status[]=Ineligible&status[]=Pending"},browse:{apiPattern:t=>t.includes("/feed/")&&t.includes("viewInstanceId=")}},shopping:{hostname:"capitaloneshopping",pages:{trips:"/account-settings/shopping-trips",browse:"/"},trips:{apiPattern:t=>t.includes("/api/v1/trip_orders"),apiEndpoint:"/api/v1/trip_orders"},browse:{apiPattern:t=>t.endsWith("/api/v1/feed"),apiEndpoint:"/api/v1/feed"}}};function k(){return window.location.hostname.includes("capitaloneoffers")?"offers":window.location.hostname.includes("capitaloneshopping")?"shopping":null}function O(){let t=k();if(!t)return null;let e=window.location.pathname,r=b[t].pages;return e.startsWith(r.trips)?"trips":t==="shopping"&&(e==="/"||e==="")||t==="offers"&&e.startsWith(r.browse)?"browse":null}function j(t){if(!t)return[];if(Array.isArray(t))return t;let e=t;return Array.isArray(e.items)?e.items:Array.isArray(e.shoppingTrips)?e.shoppingTrips:Array.isArray(e.trip_orders)?e.trip_orders:e.data&&Array.isArray(e.data)?e.data:e.data&&typeof e.data=="object"&&Array.isArray(e.data.items)?e.data.items:[]}function z(t){let e=t.orderAmount??t.order_amount??(t.trxnTotalCents!=null?t.trxnTotalCents/100:null),r=t.creditAmount??t.credit_amount??(t.payoutAmountCents!=null?t.payoutAmountCents/100:null),o=t.orderId??t.order_id??null,a=r!==null&&Number(r)>0,n=t.status??"Unknown";n==="Waiting"?n="Created":(n==="Inactive"||n==="Ineligible")&&(n="Canceled");let i=n;return a&&n.toLowerCase()==="canceled"?i="Completed":n.toLowerCase()==="pending"&&(i=a?"Pending \u2713":"Pending ?"),{id:t.id??t.tripId??t.activatedOfferId??null,tripId:t.tripId??t.trip_id??t.id??t.activatedOfferId??null,orderId:o,merchant:t.vendor??t.merchantName??t.merchantDisplayName??t.merchant??t.domain??"Unknown",domain:t.domain??null,status:i,rawStatus:n,orderAmount:e!==null?Number(e):null,creditAmount:r!==null?Number(r):null,date:t.createdAt??t.created_at??t.clickDate??t.date??null,hasOrderId:o!==null,hasAmount:e!==null&&Number(e)>0,hasCreditAmount:a,raw:t}}function E(t){let r=j(t).map(z);return{trips:r,stats:{total:r.length,withOrderId:r.filter(o=>o.hasOrderId).length,withAmount:r.filter(o=>o.hasAmount).length,withCredit:r.filter(o=>o.hasCreditAmount).length,pending:r.filter(o=>o.status.toLowerCase().includes("pending")).length,created:r.filter(o=>o.status.toLowerCase()==="created").length}}}var S=100,W=50,N="/xhr/shopping-trips?limit="+S+"&status[]=Adjusted&status[]=Completed&status[]=Ineligible&status[]=Pending";async function $(){let t=[];for(let e=0;e<W;e++){let r=N+"&offset="+e*S,o=await fetch(r,{method:"POST",credentials:"include"});if(!o.ok)throw new Error("shopping-trips returned "+o.status);let a=await o.json(),n=Array.isArray(a.data)?a.data:[];if(t.push(...n),a.hasMore!==!0||n.length===0)break}return{data:t}}var q=`
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
`;function I(t){return t==null||t===0?"\u2014":"$"+Number(t).toFixed(2)}function V(t){if(!t)return"\u2014";try{return new Date(t).toLocaleDateString()}catch{return"\u2014"}}function d(t){if(t==null)return"";let e=document.createElement("div");return e.textContent=String(t),e.innerHTML}function X(t){let e=(t||"").toLowerCase();return e.includes("completed")?"completed":e==="pending \u2713"?"pending-good":e==="pending ?"||e.includes("pending")?"pending-uncertain":e.includes("created")?"created":e.includes("cancel")?"canceled":e.includes("adjust")?"adjusted":""}var B=(t,e)=>{if(console.log("[C1 Tracker] renderTripsToModal called - data:",!!e,"overlay:",!!t),!e)return;let{trips:r,stats:o}=e,a=t.querySelector("#c1t-content");console.log("[C1 Tracker] renderTripsToModal - content element:",!!a,"trips:",r?.length),a&&(a.innerHTML=`
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
                    ${r.map(n=>{let i=n.hasCreditAmount?"amt":n.hasOrderId?"tracked":"",s=X(n.status);return`
                                <tr class="${i}" data-filter-amount="${n.hasAmount}" data-filter-tracked="${n.hasOrderId}" data-filter-pending="${n.status.toLowerCase().includes("pending")}" data-filter-created="${n.status.toLowerCase()==="created"}">
                                    <td title="${d(n.domain)}">${d(n.merchant)}</td>
                                    <td class="c">${V(n.date)}</td>
                                    <td class="r ${n.hasAmount?"c1t-amount":""}">${I(n.orderAmount)}</td>
                                    <td class="r ${n.hasCreditAmount?"c1t-credit":""}">${I(n.creditAmount)}</td>
                                    <td class="c"><span class="c1t-status ${s}">${d(n.status)}</span></td>
                                    <td class="c">${n.hasOrderId?"\u2713":"\u2014"}</td>
                                </tr>
                            `}).join("")}
                </tbody>
            </table>
        </div>
        <div id="c1t-footer">
            <details>
                <summary>Show Raw JSON</summary>
                <pre>${d(JSON.stringify(r.slice(0,30).map(n=>n.raw),null,2))}${r.length>30?`

... and `+(r.length-30)+" more":""}</pre>
            </details>
        </div>
    `,a.querySelectorAll(".c1t-filter-btn").forEach(n=>{n.addEventListener("click",function(){a.querySelectorAll(".c1t-filter-btn").forEach(s=>s.classList.remove("active")),this.classList.add("active");let i=this.dataset.filter;a.querySelectorAll("#c1t-tbody tr").forEach(s=>{if(i==="all")s.style.display="";else if(i){let l=`filter${i.charAt(0).toUpperCase()+i.slice(1)}`;s.style.display=s.dataset[l]==="true"?"":"none"}})})}))};function v(t){let{onOpen:e,processedData:r,render:o,getBadgeCount:a,title:n="Shopping Trips Tracker",loadingText:i="Waiting for data... Navigate to Shopping Trips page and data will load automatically."}=t,s=!1,l=r;function u(){if(s&&document.getElementById("c1t-styles"))return;let c=document.getElementById("c1t-styles");c||(c=document.createElement("style"),c.id="c1t-styles",c.textContent=q,(document.head||document.documentElement).appendChild(c)),s=!0}function g(){u();let c=document.getElementById("c1t-fab");if(c)return c;let p=document.createElement("button");return p.id="c1t-fab",p.innerHTML="\u{1F4CB}",p.title=n,p.addEventListener("click",async()=>{let m=h();m.classList.add("open"),!l&&e&&(await e(),l&&o(m,l))}),document.body.appendChild(p),l&&f(p,l),p}function h(){u();let c=document.getElementById("c1t-overlay"),p=!1;if(console.log("[C1 Tracker] ensureOverlay - existing:",!!c,"currentData:",!!l),!c){p=!0,c=document.createElement("div"),c.id="c1t-overlay",c.innerHTML=`
                <div id="c1t-modal">
                    <div id="c1t-header">
                        <h2>\u{1F4CB} ${d(n)}</h2>
                        <button id="c1t-close">\u2715</button>
                    </div>
                    <div id="c1t-content">
                        <div id="c1t-loading">${d(i)}</div>
                    </div>
                </div>
            `,document.body.appendChild(c);let m=c,x=m.querySelector("#c1t-close");x&&x.addEventListener("click",()=>m.classList.remove("open")),m.addEventListener("click",y=>{y.target===m&&m.classList.remove("open")})}return console.log("[C1 Tracker] ensureOverlay - isNew:",p,"currentData:",!!l),l&&o(c,l),c}function f(c,p){if(!p)return;c.classList.add("has-data");let m=a(p);m>0?c.innerHTML=`\u{1F4CB}<span class="badge">${m}</span>`:c.innerHTML="\u{1F4CB}"}return document.addEventListener("keydown",c=>{if(c.key==="Escape"){let p=document.getElementById("c1t-overlay");p&&p.classList.remove("open")}}),{ensureStyles:u,ensureFab:g,ensureOverlay:h,updateFabState:f,updateData(c){console.log("[C1 Tracker] updateData called"),l=c;let p=document.getElementById("c1t-fab");p&&f(p,c);let m=document.getElementById("c1t-overlay");m&&o(m,c)}}}var K=/(\d+(?:\.\d+)?)X/i,G=/(\d+(?:\.\d+)?)%/,J=/\$([\d,]+(?:\.\d+)?)/,Q=/([\d,]+)\s*(miles|points)/i;function w(t){let e=String(t??""),r=e.trim();if(!r)return{type:"unknown",value:0,display:e};let o=r.match(K);if(o&&o[1]!==void 0)return{type:"multiplier",value:parseFloat(o[1]),display:e};let a=r.match(J);if(a&&a[1]!==void 0)return{type:"fixed-cash",value:parseFloat(a[1].replace(/,/g,"")),display:e};let n=r.match(Q);if(n&&n[1]!==void 0)return{type:"fixed-points",value:parseFloat(n[1].replace(/,/g,"")),display:e};let i=r.match(G);return i&&i[1]!==void 0?{type:"percent",value:parseFloat(i[1]),display:e}:{type:"unknown",value:0,display:e}}function R(t){let e=t.stats??{};return e.cashbackV2??e.cashback??e.cashbackAmount??""}function Y(t){if(!t||!t.length)return null;let e=null;for(let r of t){let o=w(r.cashback);o.value>0&&(!e||o.value>e.value)&&(e={value:o.value,display:r.cashback})}return e}function Z(t){switch(t){case"great_deal":return"price-drops";case"event_placement":return"events";case"nca_deal":return"new-customer";case"retarget":case"retarget_non_product":return"recently-viewed";default:return"value"}}function tt(t){if(!t.href)return null;let e=t.merchantName??"",r=t.domain??"";if(!e&&!r)return null;let o=t.stats??{},a=o.isCutType===!0||o.rewardType==="cut",n,i,s;if(a){let f=Y(o.cashbackCategories);if(f){n="percent",i=f.value;let c=f.display.trim();s=c.toLowerCase().startsWith("up to")?c:"Up to "+c}else{let c=w(R(t));n=c.type,i=c.value,s=c.display.toLowerCase().startsWith("up to")?c.display:c.value?"Up to "+c.display:c.display}}else{let f=w(R(t));n=f.type,i=f.value,s=f.display}let l={method:"href",url:t.href},u=Z(t.type),g=t.id??null;return{id:g!==null?String(g):`shopping|${e||r}|${s}|${t.type}`,source:"shopping",itemType:t.type,merchant:e||r,domain:r||e,rewardType:n,rewardValue:i,rewardDisplay:s,activation:l,bucketCategory:u,pill:t.pill?.text??null,exclusions:o.exclusionsText??"",eventEnd:t.end??null,priceHistory:o.priceHistory??null,raw:t}}function et(t,e){return`https://capitaloneoffers.com/feed/${encodeURIComponent(t.userId)}/offers/${e}?_data`}function M(t,e){if(t.type==="Carousel"){let s=t.tiles??[],l=[];for(let u of s)for(let g of M(u,e))l.push(g);return l}let r=t.id,o=t.merchantTLD;if(!r||!o)return[];let a=t.buttonText??"",n=w(a),i=t.subText&&t.headingText?`${t.headingText} \u2014 ${t.subText}`:t.subText??t.headingText??t.text??"";return[{id:r,source:"offers",itemType:t.type,merchant:o,domain:o,rewardType:n.type,rewardValue:n.value,rewardDisplay:n.display,activation:{method:"post-offers",url:et(e,r)},bucketCategory:"value",pill:t.badge?.text??null,exclusions:i,eventEnd:null,priceHistory:null,raw:t}]}function nt(t){let e=t.rewardValue;switch(t.rewardType){case"multiplier":return e>=30?"mult-30":e>=20?"mult-20":e>=10?"mult-10":"mult-1";case"percent":case"cut":return e>=40?"pct-40":e>=20?"pct-20":e>=10?"pct-10":"pct-1";case"fixed-cash":return e>=50?"cash-50":e>=25?"cash-25":"cash-0";case"fixed-points":return e>=1e4?"pts-10k":e>=5e3?"pts-5k":e>=1e3?"pts-1k":"pts-lt-1k";case"unknown":default:return"pct-1"}}var A=[{id:"mult-30",label:"Multipliers \xB7 30X+",group:"multiplier",initiallyOpen:!0},{id:"mult-20",label:"Multipliers \xB7 20\u201329X",group:"multiplier",initiallyOpen:!0},{id:"mult-10",label:"Multipliers \xB7 10\u201319X",group:"multiplier",initiallyOpen:!1},{id:"mult-1",label:"Multipliers \xB7 1\u20139X",group:"multiplier",initiallyOpen:!1},{id:"pct-40",label:"Percent \xB7 40%+",group:"percent",initiallyOpen:!0},{id:"pct-20",label:"Percent \xB7 20\u201339%",group:"percent",initiallyOpen:!0},{id:"pct-10",label:"Percent \xB7 10\u201319%",group:"percent",initiallyOpen:!1},{id:"pct-1",label:"Percent \xB7 1\u20139%",group:"percent",initiallyOpen:!1},{id:"cash-50",label:"Fixed Cash \xB7 $50+",group:"fixed-cash",initiallyOpen:!0},{id:"cash-25",label:"Fixed Cash \xB7 $25\u201349",group:"fixed-cash",initiallyOpen:!0},{id:"cash-0",label:"Fixed Cash \xB7 under $25",group:"fixed-cash",initiallyOpen:!1},{id:"pts-10k",label:"Fixed Points \xB7 10,000+",group:"fixed-points",initiallyOpen:!0},{id:"pts-5k",label:"Fixed Points \xB7 5,000\u20139,999",group:"fixed-points",initiallyOpen:!0},{id:"pts-1k",label:"Fixed Points \xB7 1,000\u20134,999",group:"fixed-points",initiallyOpen:!1},{id:"pts-lt-1k",label:"Fixed Points \xB7 under 1,000",group:"fixed-points",initiallyOpen:!1}],D=(()=>{let t={};for(let e of A)t[e.id]=e;return t})();function C(t){let e={};for(let n of t){let i=nt(n);(e[i]??(e[i]=[])).push(n)}for(let n of Object.keys(e))e[n].sort((i,s)=>s.rewardValue-i.rewardValue);let r=[],o={};for(let n of A){let i=e[n.id];i&&i.length&&(r.push(n.id),o[n.id]=i.length)}let a={total:t.length,byBucket:o};return{offers:t,buckets:e,bucketOrder:r,stats:a}}async function P(t){let e=t.maxPages??40,r=new Set,o=[],a=null,n=0;for(;n<e;){let i=await t.fetchPage(a);if(!i)break;for(let l of t.getItems(i)){let u=t.dedupeKey(l);u&&r.has(u)||(u&&r.add(u),o.push(l))}n++,t.onPage?.(n,o.length);let s=t.getNextCursor(i);if(!s)break;a=s}return{items:o,hitCap:n>=e,pagesWalked:n}}function rt(t){let e={limit:25};return t&&(e.nextPageToken=t),JSON.stringify({contentProps:{pagination:e},context:{device:{model:typeof navigator<"u"&&/Mac/.test(navigator.platform)?"Macintosh":"Unknown",manufacturer:"Unknown",memory:"8",concurrency:String(typeof navigator<"u"&&navigator.hardwareConcurrency||4)},browser:{name:"Chrome",version:"0",major:"0"},os:{name:"unknown",version:"0"},screen:{width:1920,height:1080,density:2},locale:typeof navigator<"u"&&navigator.language?navigator.language:"en-US",country:"US",location:{state:"",zipcode:"",latitude:null,longitude:null,isInCensusData:!1},page:{path:typeof window<"u"?window.location.pathname:"/",url:typeof window<"u"?window.location.href:"",referrer:typeof document<"u"?document.referrer:"",search:typeof window<"u"?window.location.search:"",title:typeof document<"u"?document.title:""},userAgent:typeof navigator<"u"?navigator.userAgent:""}})}function ot(t){let e=t;if(e.id!==void 0&&e.id!==null&&e.id!=="")return String(e.id);let r=t.merchantName??"",o=t.stats?.cashbackV2??t.stats?.cashback??"";return!r&&!o?null:`${r}|${o}|${t.type}`}async function F(t){let e={fetchPage:async n=>{let i=await fetch("/api/v1/feed",{method:"POST",credentials:"include",headers:{"Content-Type":"application/json"},body:rt(n)});if(!i.ok)return console.warn("[C1 Tracker] shopping feed POST failed",{status:i.status,statusText:i.statusText,cursor:n}),null;let s=await i.json();return n||console.log("[C1 Tracker] shopping feed first page",{count:s.count,itemCount:s.items?.length??0,nextPageToken:s.pagination?.nextPageToken}),s},getNextCursor:n=>n.pagination?.nextPageToken??null,getItems:n=>n.items??[],dedupeKey:ot,...t?{onPage:t}:{},maxPages:40},r=await P(e),o=[],a=0;for(let n of r.items){let i=tt(n);i?o.push(i):a++}return console.log("[C1 Tracker] shopping walk done",{rawItems:r.items.length,normalized:o.length,droppedDuringNormalize:a,pagesWalked:r.pagesWalked,hitCap:r.hitCap}),{items:o,hitCap:r.hitCap,pagesWalked:r.pagesWalked}}function at(t,e){let r=`https://capitaloneoffers.com/feed/${encodeURIComponent(t.userId)}`,o=`?numberOfColumnsInGrid=5&viewInstanceId=${t.viewInstanceId}&contentSlug=ease-web-l1`;return e?`${r}${o}&cursor=${e}`:`${r}${o}`}function it(t){let e=t.merchantTLD??"",r=t.buttonText??"";return e&&r?`${e}|${r}`:t.id??null}function st(t){let e=[];for(let r of t)if(r.type==="Carousel")for(let o of r.tiles??[])e.push(o);else e.push(r);return e}async function H(t,e){let r={fetchPage:async n=>{let i=await fetch(at(t,n),{method:"GET",credentials:"include",headers:{Accept:"application/json"}});return i.ok?await i.json():null},getNextCursor:n=>n.cursor??null,getItems:n=>st(n.data??[]),dedupeKey:it,...e?{onPage:e}:{},maxPages:40},o=await P(r),a=[];for(let n of o.items)for(let i of M(n,t))a.push(i);return{items:a,hitCap:o.hitCap,pagesWalked:o.pagesWalked}}function T(t,e,r=0){if(r>6||t===null||typeof t!="object")return null;let o=t;for(let a of e){let n=o[a];if(typeof n=="string"&&n.length>0)return n}for(let a of Object.keys(o)){let n=o[a];if(n&&typeof n=="object"){let i=T(n,e,r+1);if(i)return i}}return null}function L(t){let e=new RegExp(`\\\\?"${t}\\\\?"\\s*,\\s*\\\\?"([^"\\\\]+)\\\\?"`),r=document.getElementsByTagName("script");for(let o=0;o<r.length;o++){let a=r[o].textContent;if(!a||a.indexOf(t)<0)continue;let n=a.match(e);if(n&&n[1])return n[1]}return null}function ct(){let t=null,e=null;try{e=new URLSearchParams(window.location.search).get("viewInstanceId")}catch{}let r=window.location.pathname.match(/^\/feed\/([^/?#]+)/);if(r&&r[1]&&(t=decodeURIComponent(r[1])),t||(t=L("maybeSelectedArid")),e||(e=L("viewInstanceId")),!t||!e)try{let o=document.getElementById("__NEXT_DATA__");if(o?.textContent){let a=JSON.parse(o.textContent);t||(t=T(a,["userId","accountReferenceId"])),e||(e=T(a,["viewInstanceId"]))}}catch{}if(!e&&t)try{typeof crypto<"u"&&typeof crypto.randomUUID=="function"&&(e=crypto.randomUUID())}catch{}return t&&e?{userId:t,viewInstanceId:e}:(console.warn("[C1 Tracker] getOffersBrowseContext (sync) failed",{pathname:window.location.pathname,search:window.location.search,userId:t,viewInstanceId:e,hasNextData:!!document.getElementById("__NEXT_DATA__")}),null)}async function _(){let t=ct();if(t)return t;let e=null,r=null;try{r=new URLSearchParams(window.location.search).get("viewInstanceId")}catch{}try{let o=await fetch("/xhr/shopping-trips?limit=1&offset=0&status[]=Adjusted&status[]=Completed&status[]=Ineligible&status[]=Pending",{method:"POST",credentials:"include"});if(o.ok){let n=(await o.json())?.data?.[0];n&&typeof n.accountReferenceId=="string"&&(e=n.accountReferenceId)}}catch(o){console.warn("[C1 Tracker] trips-API fallback for userId failed:",o)}if(!r&&e)try{typeof crypto<"u"&&typeof crypto.randomUUID=="function"&&(r=crypto.randomUUID())}catch{}return e&&r?{userId:e,viewInstanceId:r}:(console.warn("[C1 Tracker] fetchOffersBrowseContext failed",{userId:e,viewInstanceId:r}),null)}function lt(t,e){return e==="events"?"event":e==="price-drops"?"deal":e==="new-customer"?"new":e==="recently-viewed"?"retarget":t==="great_deal"?"deal":""}function pt(t){return`${t.merchant} ${t.domain} ${t.rewardDisplay} ${t.itemType} ${t.exclusions}`.toLowerCase()}function dt(t){if(!t)return"";try{return new Date(t).toLocaleDateString(void 0,{month:"short",day:"numeric"})}catch{return""}}function ut(t,e){let r=e.map(a=>{let n=d(pt(a)),i=a.pill?`<span class="c1t-pill ${lt(a.itemType,a.bucketCategory)}">${d(a.pill)}</span>`:"",s=a.eventEnd?`<span class="c1t-event-end">ends ${d(dt(a.eventEnd))}</span>`:"",l=a.exclusions??"",u=l?` title="${d(l)}"`:"",g=l?d(l):"",h=l.length>60,f=g?h?`<div class="c1t-excl-cell"${u}>
                       <span class="c1t-excl-text">${g}</span><button type="button" class="c1t-excl-toggle">(more)</button>
                   </div>`:`<div class="c1t-excl-cell"${u}><span class="c1t-excl-text">${g}</span></div>`:"";return`<tr class="c1t-row-click"
            data-merchant="${d(a.merchant)}"
            data-bucket-id="${d(t.id)}"
            data-search="${n}"
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
            <tbody>${r}</tbody>
        </table>
    </details>`}function mt(t){switch(t){case"multiplier":return"Multipliers";case"percent":return"Percent";case"fixed-cash":return"Cash";case"fixed-points":return"Points"}}function ft(t){let e=[],r=new Set;for(let o of t.bucketOrder){let a=D[o];a&&(r.has(a.group)||(r.add(a.group),e.push(`<button class="c1t-jump-chip" data-jump-to="${a.id}">${d(mt(a.group))}</button>`)))}return e.join("")}function gt(t){let e=t.dataset.activationUrl;e&&window.open(e,"_blank","noopener")}async function ht(t){let e=t.dataset.activationUrl;if(!e)return;let r=window.open("about:blank","_blank");try{let n=(await(await fetch(e,{method:"POST",credentials:"include"})).json())?.affiliate?.redirectUrl;n&&r?r.location=n:r&&(r.close?.(),alert("Activation failed \u2014 try clicking the tile on Cap One directly."))}catch(o){r?.close?.(),alert("Activation failed: "+(o instanceof Error?o.message:String(o)))}}function bt(t){t.addEventListener("click",e=>{let r=e.target;if(!r)return;let o=r.closest(".c1t-excl-toggle");if(o){e.stopPropagation(),e.preventDefault();let n=o.closest(".c1t-excl-cell");if(n){let i=n.classList.toggle("c1t-excl-expanded");o.textContent=i?"(less)":"(more)"}return}let a=r.closest("tr[data-method]");a&&(a.dataset.method==="href"?gt(a):a.dataset.method==="post-offers"&&ht(a))})}function xt(t){let e=t.querySelector("#c1t-browse-search input"),r=t.querySelector("#c1t-browse-search button");if(!e)return;let o=new Map;t.querySelectorAll("details[data-bucket-id]").forEach(i=>{let s=i,l=s.dataset.bucketId??"";o.set(l,s.open)});let a=null,n=i=>{let s=i.trim().toLowerCase(),l=s.length===0;t.querySelectorAll("details[data-bucket-id]").forEach(g=>{let h=g,f=h.dataset.bucketId??"",c=h.querySelectorAll("tr[data-search]"),p=0;c.forEach(m=>{let x=m.dataset.search??"",y=l||x.includes(s);m.style.display=y?"":"none",y&&p++}),p===0&&!l?h.style.display="none":(h.style.display="",l?h.open=o.get(f)??!1:h.open=!0)})};e.addEventListener("input",()=>{a&&clearTimeout(a),a=setTimeout(()=>n(e.value),100)}),r&&r.addEventListener("click",()=>{e.value="",n("")})}function yt(t){let e=t.querySelector("#c1t-browse-nav");e&&e.addEventListener("click",r=>{let o=r.target;if(!o)return;let a=o.closest("[data-jump-to]");if(!a)return;let n=a.dataset.jumpTo;if(!n)return;let i=t.querySelector(`details[data-bucket-id="${n}"]`);i&&(i.open=!0,i.scrollIntoView({behavior:"smooth",block:"start"}))})}var U=(t,e)=>{let r=t.querySelector("#c1t-content");if(!r)return;let o=e.bucketOrder.map(s=>{let l=D[s];if(!l)return"";let u=e.buckets[s];return!u||!u.length?"":ut(l,u)}).join(""),a=ft(e),n=e.stats.hitCap?`Stopped at ${e.stats.total} items (max pages reached)`:`${e.stats.total} offers across ${e.bucketOrder.length} buckets`;r.innerHTML=`
        <div id="c1t-browse-search">
            <input type="search" placeholder="Search merchant / reward / type..." />
            <button type="button">Clear</button>
        </div>
        <div id="c1t-browse-nav">${a}</div>
        <div id="c1t-browse-stats">${d(n)}</div>
        <div id="c1t-browse-body">${o||'<div style="padding:40px;text-align:center;opacity:0.7;">No offers found.</div>'}</div>
        <div id="c1t-browse-footer">Click a row to activate. Shopping rows open the pre-signed href; offers rows POST then redirect.</div>
    `;let i=r.querySelector("#c1t-browse-body");i&&bt(i),xt(r),yt(r)};(async function(){"use strict";let t=k();if(!t){alert("Please run this on capitaloneshopping.com or capitaloneoffers.com");return}let e=O();if(e===null){let a=b[t].pages.trips,n=b[t].pages.browse;alert(`Please navigate to a Capital One Shopping Trips or browse page:
${window.location.origin}${a}
${window.location.origin}${n}`);return}let r=document.getElementById("c1t-fab");if(r){if(r.dataset.c1tMode===e){let a=document.getElementById("c1t-overlay");a&&a.classList.add("open");return}r.remove(),document.getElementById("c1t-overlay")?.remove()}console.log("[C1 Tracker Bookmarklet] Running on",t,"mode=",e),e==="trips"?wt(t):kt(t);let o=document.getElementById("c1t-fab");o&&(o.dataset.c1tMode=e)})();function wt(t){let e=null,r=v({processedData:null,onOpen:()=>{e||a()},render:B,getBadgeCount:n=>n?.stats?.withCredit??0});r.ensureFab(),r.ensureOverlay();let o=document.getElementById("c1t-overlay");o&&o.classList.add("open");async function a(){let n=document.querySelector("#c1t-content");n&&(n.innerHTML='<div id="c1t-loading">Fetching shopping trips data...</div>');try{let i;if(t==="shopping"){let s=await fetch(b.shopping.trips.apiEndpoint,{credentials:"include"});if(!s.ok)throw new Error(`API returned ${s.status}`);i=await s.json()}else i=await $();console.log("[C1 Tracker Bookmarklet] Fetched trips data"),e=E(i),console.log("[C1 Tracker Bookmarklet] Processed:",e.stats),r.updateData(e)}catch(i){console.error("[C1 Tracker Bookmarklet] Trips error:",i);let s=i instanceof Error?i.message:String(i);n&&(n.innerHTML=`
                    <div id="c1t-loading">
                        <p>Error fetching data: ${s}</p>
                        <p style="margin-top: 10px; font-size: 12px; opacity: 0.8;">
                            Make sure you're logged in and try navigating to the Shopping Trips page first.
                        </p>
                    </div>
                `)}}a()}function kt(t){let e=v({processedData:null,render:U,getBadgeCount:a=>a?.stats?.total??0,title:t==="offers"?"Browse Cap One Offers":"Browse Cap One Shopping",loadingText:"Loading offers feed..."});e.ensureFab(),e.ensureOverlay();let r=document.getElementById("c1t-overlay");r&&r.classList.add("open");let o=a=>{let n=document.querySelector("#c1t-loading");if(n){n.textContent=a;return}let i=document.querySelector("#c1t-content");i&&(i.innerHTML=`<div id="c1t-loading">${a}</div>`)};o("Walking offers feed... (0 pages)"),vt(t,o).then(a=>{a&&e.updateData(a)}).catch(a=>{console.error("[C1 Tracker Bookmarklet] Browse error:",a);let n=a instanceof Error?a.message:String(a);o("Error walking feed: "+n)})}async function vt(t,e){let r=(i,s)=>{e(`Loaded ${i} pages, ${s} offers...`)};if(t==="shopping"){let i=await F(r),s=C(i.items);return s.stats.hitCap=i.hitCap,s.stats.pagesWalked=i.pagesWalked,s}let o=await _();if(!o)return e("Could not capture offers feed context (userId + viewInstanceId). Open DevTools console for diagnostics. The URL should look like /feed/<userId>?viewInstanceId=<uuid>. Try clicking into the feed grid once, then re-run."),null;let a=await H(o,r),n=C(a.items);return n.stats.hitCap=a.hitCap,n.stats.pagesWalked=a.pagesWalked,n}})();
