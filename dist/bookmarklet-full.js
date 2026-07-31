"use strict";(()=>{var C={offers:{hostname:"capitaloneoffers",pages:{trips:"/shopping-trips",browse:"/feed"},trips:{apiPattern:t=>t.includes("/xhr/shopping-trips"),apiEndpoint:"/xhr/shopping-trips?limit=100&offset=0&status[]=Adjusted&status[]=Completed&status[]=Ineligible&status[]=Pending"},browse:{apiPattern:t=>t.includes("/feed/")&&t.includes("viewInstanceId=")}},shopping:{hostname:"capitaloneshopping",pages:{trips:"/account-settings/shopping-trips",browse:"/"},trips:{apiPattern:t=>t.includes("/api/v1/trip_orders"),apiEndpoint:"/api/v1/trip_orders"},browse:{apiPattern:t=>t.endsWith("/api/v1/feed"),apiEndpoint:"/api/v1/feed"}}};function I(){return window.location.hostname.includes("capitaloneoffers")?"offers":window.location.hostname.includes("capitaloneshopping")?"shopping":null}function A(){let t=I();if(!t)return null;let e=window.location.pathname,n=C[t].pages;return e.startsWith(n.trips)?"trips":t==="shopping"&&(e==="/"||e==="")||t==="offers"&&e.startsWith(n.browse)?"browse":null}function J(t){if(!t)return[];if(Array.isArray(t))return t;let e=t;return Array.isArray(e.items)?e.items:Array.isArray(e.shoppingTrips)?e.shoppingTrips:Array.isArray(e.trip_orders)?e.trip_orders:e.data&&Array.isArray(e.data)?e.data:e.data&&typeof e.data=="object"&&Array.isArray(e.data.items)?e.data.items:[]}function Y(t){let e=t.orderAmount??t.order_amount??(t.trxnTotalCents!=null?t.trxnTotalCents/100:null),n=t.creditAmount??t.credit_amount??(t.payoutAmountCents!=null?t.payoutAmountCents/100:null),a=t.orderId??t.order_id??null,o=n!==null&&Number(n)>0,r=t.status??"Unknown";r==="Waiting"?r="Created":(r==="Inactive"||r==="Ineligible")&&(r="Canceled");let i=r;return o&&r.toLowerCase()==="canceled"?i="Completed":r.toLowerCase()==="pending"&&(i=o?"Pending \u2713":"Pending ?"),{id:t.id??t.tripId??t.activatedOfferId??null,tripId:t.tripId??t.trip_id??t.id??t.activatedOfferId??null,orderId:a,merchant:t.vendor??t.merchantName??t.merchantDisplayName??t.merchant??t.domain??"Unknown",domain:t.domain??null,status:i,rawStatus:r,orderAmount:e!==null?Number(e):null,creditAmount:n!==null?Number(n):null,date:t.createdAt??t.created_at??t.clickDate??t.date??null,hasOrderId:a!==null,hasAmount:e!==null&&Number(e)>0,hasCreditAmount:o,raw:t}}function E(t){let n=J(t).map(Y);return{trips:n,stats:{total:n.length,withOrderId:n.filter(a=>a.hasOrderId).length,withAmount:n.filter(a=>a.hasAmount).length,withCredit:n.filter(a=>a.hasCreditAmount).length,pending:n.filter(a=>a.status.toLowerCase().includes("pending")).length,created:n.filter(a=>a.status.toLowerCase()==="created").length}}}var L=100,Q=50,Z="/xhr/shopping-trips?limit="+L+"&status[]=Adjusted&status[]=Completed&status[]=Ineligible&status[]=Pending";async function B(){let t=[];for(let e=0;e<Q;e++){let n=Z+"&offset="+e*L,a=await fetch(n,{method:"POST",credentials:"include"});if(!a.ok)throw new Error("shopping-trips returned "+a.status);let o=await a.json(),r=Array.isArray(o.data)?o.data:[];if(t.push(...r),o.hasMore!==!0||r.length===0)break}return{data:t}}var tt=`
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

    #c1t-tabs {
        display: flex !important;
        gap: 4px !important;
        padding: 0 20px !important;
        border-bottom: 1px solid rgba(255,255,255,0.1) !important;
        flex-shrink: 0 !important;
    }
    .c1t-tab {
        background: transparent !important;
        border: none !important;
        color: rgba(255,255,255,0.65) !important;
        padding: 12px 18px !important;
        cursor: pointer !important;
        font-size: 14px !important;
        font-weight: 500 !important;
        font-family: inherit !important;
        border-bottom: 2px solid transparent !important;
        margin-bottom: -1px !important;
        transition: color 0.15s, border-color 0.15s !important;
    }
    .c1t-tab:hover {
        color: rgba(255,255,255,0.9) !important;
    }
    .c1t-tab.active {
        color: white !important;
        border-bottom-color: #69f0ae !important;
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
`;function R(t){return t==null||t===0?"\u2014":"$"+Number(t).toFixed(2)}function et(t){if(!t)return"\u2014";try{return new Date(t).toLocaleDateString()}catch{return"\u2014"}}function d(t){if(t==null)return"";let e=document.createElement("div");return e.textContent=String(t),e.innerHTML}function nt(t){let e=(t||"").toLowerCase();return e.includes("completed")?"completed":e==="pending \u2713"?"pending-good":e==="pending ?"||e.includes("pending")?"pending-uncertain":e.includes("created")?"created":e.includes("cancel")?"canceled":e.includes("adjust")?"adjusted":""}var M=(t,e)=>{if(console.log("[C1 Tracker] renderTripsToModal called - data:",!!e,"overlay:",!!t),!e)return;let{trips:n,stats:a}=e,o=t.querySelector("#c1t-content");console.log("[C1 Tracker] renderTripsToModal - content element:",!!o,"trips:",n?.length),o&&(o.innerHTML=`
        <div id="c1t-stats">
            <span class="stat"><strong>${a.total}</strong> total</span>
            <span class="stat"><strong>${a.withOrderId}</strong> tracked</span>
            <span class="stat"><strong>${a.withAmount}</strong> with amount</span>
            <span class="stat"><strong>${a.withCredit}</strong> with cashback</span>
        </div>
        <div id="c1t-filters">
            <button class="c1t-filter-btn active" data-filter="all">All (${a.total})</button>
            <button class="c1t-filter-btn" data-filter="amount">With Amount (${a.withAmount})</button>
            <button class="c1t-filter-btn" data-filter="tracked">Tracked (${a.withOrderId})</button>
            <button class="c1t-filter-btn" data-filter="pending">Pending (${a.pending})</button>
            <button class="c1t-filter-btn" data-filter="created">Waiting (${a.created})</button>
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
                    ${n.map(r=>{let i=r.hasCreditAmount?"amt":r.hasOrderId?"tracked":"",s=nt(r.status);return`
                                <tr class="${i}" data-filter-amount="${r.hasAmount}" data-filter-tracked="${r.hasOrderId}" data-filter-pending="${r.status.toLowerCase().includes("pending")}" data-filter-created="${r.status.toLowerCase()==="created"}">
                                    <td title="${d(r.domain)}">${d(r.merchant)}</td>
                                    <td class="c">${et(r.date)}</td>
                                    <td class="r ${r.hasAmount?"c1t-amount":""}">${R(r.orderAmount)}</td>
                                    <td class="r ${r.hasCreditAmount?"c1t-credit":""}">${R(r.creditAmount)}</td>
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
    `,o.querySelectorAll(".c1t-filter-btn").forEach(r=>{r.addEventListener("click",function(){o.querySelectorAll(".c1t-filter-btn").forEach(s=>s.classList.remove("active")),this.classList.add("active");let i=this.dataset.filter;o.querySelectorAll("#c1t-tbody tr").forEach(s=>{if(i==="all")s.style.display="";else if(i){let p=`filter${i.charAt(0).toUpperCase()+i.slice(1)}`;s.style.display=s.dataset[p]==="true"?"":"none"}})})}))};function P(t){let{title:e,tabs:n,defaultTabId:a}=t;if(n.length===0)throw new Error("createTabbedUI: tabs must be non-empty");if(!n.find(c=>c.id===a))throw new Error(`createTabbedUI: defaultTabId "${a}" not in tabs`);let o=new Map,r=new Map,i=!1,s=a;function p(c){return n.find(l=>l.id===c)??null}function u(){if(i&&document.getElementById("c1t-styles"))return;let c=document.getElementById("c1t-styles");c||(c=document.createElement("style"),c.id="c1t-styles",c.textContent=tt,(document.head||document.documentElement).appendChild(c)),i=!0}function b(){u();let c=document.getElementById("c1t-fab");if(c)return c;let l=document.createElement("button");return l.id="c1t-fab",l.innerHTML="\u{1F4CB}",l.title=e,l.addEventListener("click",()=>{g().classList.add("open"),m(s)}),document.body.appendChild(l),k(),l}function g(){u();let c=document.getElementById("c1t-overlay");if(c)return c;c=document.createElement("div"),c.id="c1t-overlay",c.innerHTML=`
            <div id="c1t-modal">
                <div id="c1t-header">
                    <h2>\u{1F4CB} ${d(e)}</h2>
                    <button id="c1t-close">\u2715</button>
                </div>
                <div id="c1t-tabs">
                    ${n.map(f=>`<button class="c1t-tab${f.id===s?" active":""}" data-tab-id="${d(f.id)}">${d(f.label)}</button>`).join("")}
                </div>
                <div id="c1t-content"></div>
            </div>
        `,document.body.appendChild(c);let l=c;return l.querySelector("#c1t-close")?.addEventListener("click",()=>{l.classList.remove("open")}),l.addEventListener("click",f=>{f.target===l&&l.classList.remove("open")}),l.querySelectorAll(".c1t-tab").forEach(f=>{f.addEventListener("click",()=>{let x=f.dataset.tabId;x&&m(x)})}),c}async function m(c){let l=p(c);if(!l)return;s=c;let f=document.getElementById("c1t-overlay");f&&f.querySelectorAll(".c1t-tab").forEach(y=>{y.classList.toggle("active",y.dataset.tabId===c)});let x=f?.querySelector("#c1t-content");if(o.has(c)){x&&l.render(f,o.get(c));return}if(!l.onActivate){x&&(x.innerHTML=`<div id="c1t-loading">${d(l.loadingText??"No data.")}</div>`);return}if(r.has(c)){await r.get(c);return}x&&(x.innerHTML=`<div id="c1t-loading">${d(l.loadingText??"Loading\u2026")}</div>`);let v=(async()=>{try{let y=await l.onActivate();y!=null&&w(c,y)}catch(y){console.error("[C1 Tracker] tab loader threw:",y);let K=y instanceof Error?y.message:String(y),$=document.getElementById("c1t-content");$&&s===c&&($.innerHTML=`<div id="c1t-loading">Error loading data: ${d(K)}</div>`)}finally{r.delete(c)}})();r.set(c,v),await v}function h(c){m(c)}function w(c,l){let f=p(c);if(!f)return;o.set(c,l),k();let x=document.getElementById("c1t-overlay");x&&s===c&&f.render(x,l)}function k(){let c=document.getElementById("c1t-fab");if(!c)return;let l=0,f=!1;for(let x of n){if(!o.has(x.id)||(f=!0,!x.getBadgeCount))continue;let v=x.getBadgeCount(o.get(x.id));v>l&&(l=v)}f?c.classList.add("has-data"):c.classList.remove("has-data"),c.innerHTML=l>0?`\u{1F4CB}<span class="badge">${l}</span>`:"\u{1F4CB}"}return document.addEventListener("keydown",c=>{if(c.key==="Escape"){let l=document.getElementById("c1t-overlay");l&&l.classList.remove("open")}}),{ensureStyles:u,ensureFab:b,ensureOverlay:g,setActiveTab:h,setTabData:w,getActiveTabId:()=>s}}var rt=300,F=4,at=500;function H(t){return new Promise(e=>setTimeout(e,t))}function ot(t){if(!t)return null;let e=Number(t);return Number.isFinite(e)&&e>=0?Math.min(e*1e3,3e4):null}async function U(t,e){for(let n=0;n<=F;n++)try{let a=await fetch(t,e);if(a.status!==429)return a;if(n===F)return console.warn("[C1 Tracker] 429 retries exhausted",{url:t}),a;let r=ot(a.headers.get("Retry-After"))??at*Math.pow(2,n),i=Math.floor(Math.random()*250),s=r+i;console.warn("[C1 Tracker] 429 rate-limited; waiting",s,"ms",{attempt:n+1,url:t}),await H(s)}catch(a){return console.warn("[C1 Tracker] fetch threw",a),null}return null}var it=/(\d+(?:\.\d+)?)X/i,st=/(\d+(?:\.\d+)?)%/,ct=/\$([\d,]+(?:\.\d+)?)/,lt=/([\d,]+)\s*(miles|points)/i;function T(t){let e=String(t??""),n=e.trim();if(!n)return{type:"unknown",value:0,display:e};let a=n.match(it);if(a&&a[1]!==void 0)return{type:"multiplier",value:parseFloat(a[1]),display:e};let o=n.match(ct);if(o&&o[1]!==void 0)return{type:"fixed-cash",value:parseFloat(o[1].replace(/,/g,"")),display:e};let r=n.match(lt);if(r&&r[1]!==void 0)return{type:"fixed-points",value:parseFloat(r[1].replace(/,/g,"")),display:e};let i=n.match(st);return i&&i[1]!==void 0?{type:"percent",value:parseFloat(i[1]),display:e}:{type:"unknown",value:0,display:e}}function D(t){let e=t.stats??{};return e.cashbackV2??e.cashback??e.cashbackAmount??""}function pt(t){if(!t||!t.length)return null;let e=null;for(let n of t){let a=T(n.cashback);a.value>0&&(!e||a.value>e.value)&&(e={value:a.value,display:n.cashback})}return e}function dt(t){switch(t){case"great_deal":return"price-drops";case"event_placement":return"events";case"nca_deal":return"new-customer";case"retarget":case"retarget_non_product":return"recently-viewed";default:return"value"}}function ut(t){if(!t.href)return null;let e=t.merchantName??"",n=t.domain??"";if(!e&&!n)return null;let a=t.stats??{},o=a.isCutType===!0||a.rewardType==="cut",r,i,s;if(o){let m=pt(a.cashbackCategories);if(m){r="percent",i=m.value;let h=m.display.trim();s=h.toLowerCase().startsWith("up to")?h:"Up to "+h}else{let h=T(D(t));r=h.type,i=h.value,s=h.display.toLowerCase().startsWith("up to")?h.display:h.value?"Up to "+h.display:h.display}}else{let m=T(D(t));r=m.type,i=m.value,s=m.display}let p={method:"href",url:t.href},u=dt(t.type),b=t.id??null;return{id:b!==null?String(b):`shopping|${e||n}|${s}|${t.type}`,source:"shopping",itemType:t.type,merchant:e||n,domain:n||e,rewardType:r,rewardValue:i,rewardDisplay:s,activation:p,bucketCategory:u,pill:t.pill?.text??null,exclusions:a.exclusionsText??"",eventEnd:t.end??null,priceHistory:a.priceHistory??null,raw:t}}function mt(t,e){return`https://capitaloneoffers.com/feed/${encodeURIComponent(t.userId)}/offers/${e}?_data`}function j(t,e){if(t.type==="Carousel"){let s=t.tiles??[],p=[];for(let u of s)for(let b of j(u,e))p.push(b);return p}let n=t.id,a=t.merchantTLD;if(!n||!a)return[];let o=t.buttonText??"",r=T(o),i=t.subText&&t.headingText?`${t.headingText} \u2014 ${t.subText}`:t.subText??t.headingText??t.text??"";return[{id:n,source:"offers",itemType:t.type,merchant:a,domain:a,rewardType:r.type,rewardValue:r.value,rewardDisplay:r.display,activation:{method:"post-offers",url:mt(e,n)},bucketCategory:"value",pill:t.badge?.text??null,exclusions:i,eventEnd:null,priceHistory:null,raw:t}]}function ft(t){let e=t.rewardValue;switch(t.rewardType){case"multiplier":return e>=30?"mult-30":e>=20?"mult-20":e>=10?"mult-10":"mult-1";case"percent":case"cut":return e>=40?"pct-40":e>=20?"pct-20":e>=10?"pct-10":"pct-1";case"fixed-cash":return e>=50?"cash-50":e>=25?"cash-25":"cash-0";case"fixed-points":return e>=1e4?"pts-10k":e>=5e3?"pts-5k":e>=1e3?"pts-1k":"pts-lt-1k";case"unknown":default:return"pct-1"}}var z=[{id:"mult-30",label:"Multipliers \xB7 30X+",group:"multiplier",initiallyOpen:!0},{id:"mult-20",label:"Multipliers \xB7 20\u201329X",group:"multiplier",initiallyOpen:!0},{id:"mult-10",label:"Multipliers \xB7 10\u201319X",group:"multiplier",initiallyOpen:!1},{id:"mult-1",label:"Multipliers \xB7 1\u20139X",group:"multiplier",initiallyOpen:!1},{id:"pct-40",label:"Percent \xB7 40%+",group:"percent",initiallyOpen:!0},{id:"pct-20",label:"Percent \xB7 20\u201339%",group:"percent",initiallyOpen:!0},{id:"pct-10",label:"Percent \xB7 10\u201319%",group:"percent",initiallyOpen:!1},{id:"pct-1",label:"Percent \xB7 1\u20139%",group:"percent",initiallyOpen:!1},{id:"cash-50",label:"Fixed Cash \xB7 $50+",group:"fixed-cash",initiallyOpen:!0},{id:"cash-25",label:"Fixed Cash \xB7 $25\u201349",group:"fixed-cash",initiallyOpen:!0},{id:"cash-0",label:"Fixed Cash \xB7 under $25",group:"fixed-cash",initiallyOpen:!1},{id:"pts-10k",label:"Fixed Points \xB7 10,000+",group:"fixed-points",initiallyOpen:!0},{id:"pts-5k",label:"Fixed Points \xB7 5,000\u20139,999",group:"fixed-points",initiallyOpen:!0},{id:"pts-1k",label:"Fixed Points \xB7 1,000\u20134,999",group:"fixed-points",initiallyOpen:!1},{id:"pts-lt-1k",label:"Fixed Points \xB7 under 1,000",group:"fixed-points",initiallyOpen:!1}],N=(()=>{let t={};for(let e of z)t[e.id]=e;return t})();function S(t){let e={};for(let r of t){let i=ft(r);(e[i]??(e[i]=[])).push(r)}for(let r of Object.keys(e))e[r].sort((i,s)=>s.rewardValue-i.rewardValue);let n=[],a={};for(let r of z){let i=e[r.id];i&&i.length&&(n.push(r.id),a[r.id]=i.length)}let o={total:t.length,byBucket:a};return{offers:t,buckets:e,bucketOrder:n,stats:o}}async function W(t){let e=t.maxPages??40,n=new Set,a=[],o=null,r=0;for(;r<e;){r>0&&await H(rt);let i=await t.fetchPage(o);if(!i)break;for(let p of t.getItems(i)){let u=t.dedupeKey(p);u&&n.has(u)||(u&&n.add(u),a.push(p))}r++,t.onPage?.(r,a.length);let s=t.getNextCursor(i);if(!s)break;o=s}return{items:a,hitCap:r>=e,pagesWalked:r}}function gt(t){let e={limit:25};return t&&(e.nextPageToken=t),JSON.stringify({contentProps:{pagination:e},context:{device:{model:typeof navigator<"u"&&/Mac/.test(navigator.platform)?"Macintosh":"Unknown",manufacturer:"Unknown",memory:"8",concurrency:String(typeof navigator<"u"&&navigator.hardwareConcurrency||4)},browser:{name:"Chrome",version:"0",major:"0"},os:{name:"unknown",version:"0"},screen:{width:1920,height:1080,density:2},locale:typeof navigator<"u"&&navigator.language?navigator.language:"en-US",country:"US",location:{state:"",zipcode:"",latitude:null,longitude:null,isInCensusData:!1},page:{path:typeof window<"u"?window.location.pathname:"/",url:typeof window<"u"?window.location.href:"",referrer:typeof document<"u"?document.referrer:"",search:typeof window<"u"?window.location.search:"",title:typeof document<"u"?document.title:""},userAgent:typeof navigator<"u"?navigator.userAgent:""}})}function ht(t){let e=t;if(e.id!==void 0&&e.id!==null&&e.id!=="")return String(e.id);let n=t.merchantName??"",a=t.stats?.cashbackV2??t.stats?.cashback??"";return!n&&!a?null:`${n}|${a}|${t.type}`}async function q(t){let e={fetchPage:async r=>{let i=await U("/api/v1/feed",{method:"POST",credentials:"include",headers:{"Content-Type":"application/json"},body:gt(r)});if(!i||!i.ok)return console.warn("[C1 Tracker] shopping feed POST failed",{status:i?.status,statusText:i?.statusText,cursor:r}),null;let s=await i.json();return r||console.log("[C1 Tracker] shopping feed first page",{count:s.count,itemCount:s.items?.length??0,nextPageToken:s.pagination?.nextPageToken}),s},getNextCursor:r=>r.pagination?.nextPageToken??null,getItems:r=>r.items??[],dedupeKey:ht,...t?{onPage:t}:{},maxPages:40},n=await W(e),a=[],o=0;for(let r of n.items){let i=ut(r);i?a.push(i):o++}return console.log("[C1 Tracker] shopping walk done",{rawItems:n.items.length,normalized:a.length,droppedDuringNormalize:o,pagesWalked:n.pagesWalked,hitCap:n.hitCap}),{items:a,hitCap:n.hitCap,pagesWalked:n.pagesWalked}}function bt(t,e){let n=`https://capitaloneoffers.com/feed/${encodeURIComponent(t.userId)}`,a=`?numberOfColumnsInGrid=5&viewInstanceId=${t.viewInstanceId}&contentSlug=ease-web-l1`;return e?`${n}${a}&cursor=${e}`:`${n}${a}`}function xt(t){let e=t.merchantTLD??"",n=t.buttonText??"";return e&&n?`${e}|${n}`:t.id??null}function yt(t){let e=[];for(let n of t)if(n.type==="Carousel")for(let a of n.tiles??[])e.push(a);else e.push(n);return e}async function X(t,e){let n={fetchPage:async r=>{let i=await U(bt(t,r),{method:"GET",credentials:"include",headers:{Accept:"application/json"}});return!i||!i.ok?(console.warn("[C1 Tracker] offers feed GET failed",{status:i?.status,statusText:i?.statusText,cursor:r}),null):await i.json()},getNextCursor:r=>r.cursor??null,getItems:r=>yt(r.data??[]),dedupeKey:xt,...e?{onPage:e}:{},maxPages:40},a=await W(n),o=[];for(let r of a.items)for(let i of j(r,t))o.push(i);return{items:o,hitCap:a.hitCap,pagesWalked:a.pagesWalked}}function O(t,e,n=0){if(n>6||t===null||typeof t!="object")return null;let a=t;for(let o of e){let r=a[o];if(typeof r=="string"&&r.length>0)return r}for(let o of Object.keys(a)){let r=a[o];if(r&&typeof r=="object"){let i=O(r,e,n+1);if(i)return i}}return null}function _(t){let e=new RegExp(`\\\\?"${t}\\\\?"\\s*,\\s*\\\\?"([^"\\\\]+)\\\\?"`),n=document.getElementsByTagName("script");for(let a=0;a<n.length;a++){let o=n[a].textContent;if(!o||o.indexOf(t)<0)continue;let r=o.match(e);if(r&&r[1])return r[1]}return null}function wt(){let t=null,e=null;try{e=new URLSearchParams(window.location.search).get("viewInstanceId")}catch{}let n=window.location.pathname.match(/^\/feed\/([^/?#]+)/);if(n&&n[1]&&(t=decodeURIComponent(n[1])),t||(t=_("maybeSelectedArid")),e||(e=_("viewInstanceId")),!t||!e)try{let a=document.getElementById("__NEXT_DATA__");if(a?.textContent){let o=JSON.parse(a.textContent);t||(t=O(o,["userId","accountReferenceId"])),e||(e=O(o,["viewInstanceId"]))}}catch{}if(!e&&t)try{typeof crypto<"u"&&typeof crypto.randomUUID=="function"&&(e=crypto.randomUUID())}catch{}return t&&e?{userId:t,viewInstanceId:e}:(console.warn("[C1 Tracker] getOffersBrowseContext (sync) failed",{pathname:window.location.pathname,search:window.location.search,userId:t,viewInstanceId:e,hasNextData:!!document.getElementById("__NEXT_DATA__")}),null)}async function V(){let t=wt();if(t)return t;let e=null,n=null;try{n=new URLSearchParams(window.location.search).get("viewInstanceId")}catch{}try{let a=await fetch("/xhr/shopping-trips?limit=1&offset=0&status[]=Adjusted&status[]=Completed&status[]=Ineligible&status[]=Pending",{method:"POST",credentials:"include"});if(a.ok){let r=(await a.json())?.data?.[0];r&&typeof r.accountReferenceId=="string"&&(e=r.accountReferenceId)}}catch(a){console.warn("[C1 Tracker] trips-API fallback for userId failed:",a)}if(!n&&e)try{typeof crypto<"u"&&typeof crypto.randomUUID=="function"&&(n=crypto.randomUUID())}catch{}return e&&n?{userId:e,viewInstanceId:n}:(console.warn("[C1 Tracker] fetchOffersBrowseContext failed",{userId:e,viewInstanceId:n}),null)}function kt(t,e){return e==="events"?"event":e==="price-drops"?"deal":e==="new-customer"?"new":e==="recently-viewed"?"retarget":t==="great_deal"?"deal":""}function vt(t){return`${t.merchant} ${t.domain} ${t.rewardDisplay} ${t.itemType} ${t.exclusions}`.toLowerCase()}function Tt(t){if(!t)return"";try{return new Date(t).toLocaleDateString(void 0,{month:"short",day:"numeric"})}catch{return""}}function Ct(t,e){let n=e.map(o=>{let r=d(vt(o)),i=o.pill?`<span class="c1t-pill ${kt(o.itemType,o.bucketCategory)}">${d(o.pill)}</span>`:"",s=o.eventEnd?`<span class="c1t-event-end">ends ${d(Tt(o.eventEnd))}</span>`:"",p=o.exclusions??"",u=p?` title="${d(p)}"`:"",b=p?d(p):"",g=p.length>60,m=b?g?`<div class="c1t-excl-cell"${u}>
                       <span class="c1t-excl-text">${b}</span><button type="button" class="c1t-excl-toggle">(more)</button>
                   </div>`:`<div class="c1t-excl-cell"${u}><span class="c1t-excl-text">${b}</span></div>`:"";return`<tr class="c1t-row-click"
            data-merchant="${d(o.merchant)}"
            data-bucket-id="${d(t.id)}"
            data-search="${r}"
            data-method="${d(o.activation.method)}"
            data-activation-url="${d(o.activation.url)}">
            <td>${d(o.merchant)}</td>
            <td><span class="c1t-reward">${d(o.rewardDisplay)}</span></td>
            <td>${i}</td>
            <td>${s}</td>
            <td>${m}</td>
        </tr>`}).join(""),a=t.initiallyOpen?" open":"";return`<details class="c1t-bucket" data-bucket-id="${t.id}"${a}>
        <summary>${d(t.label)} <span class="c1t-bucket-count">(${e.length})</span></summary>
        <table>
            <thead>
                <tr><th>Merchant</th><th>Reward</th><th>Badge</th><th>Ends</th><th>Exclusions</th></tr>
            </thead>
            <tbody>${n}</tbody>
        </table>
    </details>`}function It(t){switch(t){case"multiplier":return"Multipliers";case"percent":return"Percent";case"fixed-cash":return"Cash";case"fixed-points":return"Points"}}function Et(t){let e=[],n=new Set;for(let a of t.bucketOrder){let o=N[a];o&&(n.has(o.group)||(n.add(o.group),e.push(`<button class="c1t-jump-chip" data-jump-to="${o.id}">${d(It(o.group))}</button>`)))}return e.join("")}function Ot(t){let e=t.dataset.activationUrl;e&&window.open(e,"_blank","noopener")}async function St(t){let e=t.dataset.activationUrl;if(!e)return;let n=window.open("about:blank","_blank");try{let r=(await(await fetch(e,{method:"POST",credentials:"include"})).json())?.affiliate?.redirectUrl;r&&n?n.location=r:n&&(n.close?.(),alert("Activation failed \u2014 try clicking the tile on Cap One directly."))}catch(a){n?.close?.(),alert("Activation failed: "+(a instanceof Error?a.message:String(a)))}}function $t(t){t.addEventListener("click",e=>{let n=e.target;if(!n)return;let a=n.closest(".c1t-excl-toggle");if(a){e.stopPropagation(),e.preventDefault();let r=a.closest(".c1t-excl-cell");if(r){let i=r.classList.toggle("c1t-excl-expanded");a.textContent=i?"(less)":"(more)"}return}let o=n.closest("tr[data-method]");o&&(o.dataset.method==="href"?Ot(o):o.dataset.method==="post-offers"&&St(o))})}function Rt(t){let e=t.querySelector("#c1t-browse-search input"),n=t.querySelector("#c1t-browse-search button");if(!e)return;let a=new Map;t.querySelectorAll("details[data-bucket-id]").forEach(i=>{let s=i,p=s.dataset.bucketId??"";a.set(p,s.open)});let o=null,r=i=>{let s=i.trim().toLowerCase(),p=s.length===0;t.querySelectorAll("details[data-bucket-id]").forEach(b=>{let g=b,m=g.dataset.bucketId??"",h=g.querySelectorAll("tr[data-search]"),w=0;h.forEach(k=>{let c=k.dataset.search??"",l=p||c.includes(s);k.style.display=l?"":"none",l&&w++}),w===0&&!p?g.style.display="none":(g.style.display="",p?g.open=a.get(m)??!1:g.open=!0)})};e.addEventListener("input",()=>{o&&clearTimeout(o),o=setTimeout(()=>r(e.value),100)}),n&&n.addEventListener("click",()=>{e.value="",r("")})}function At(t){let e=t.querySelector("#c1t-browse-nav");e&&e.addEventListener("click",n=>{let a=n.target;if(!a)return;let o=a.closest("[data-jump-to]");if(!o)return;let r=o.dataset.jumpTo;if(!r)return;let i=t.querySelector(`details[data-bucket-id="${r}"]`);i&&(i.open=!0,i.scrollIntoView({behavior:"smooth",block:"start"}))})}var G=(t,e)=>{let n=t.querySelector("#c1t-content");if(!n)return;let a=e.bucketOrder.map(s=>{let p=N[s];if(!p)return"";let u=e.buckets[s];return!u||!u.length?"":Ct(p,u)}).join(""),o=Et(e),r=e.stats.hitCap?`Stopped at ${e.stats.total} items (max pages reached)`:`${e.stats.total} offers across ${e.bucketOrder.length} buckets`;n.innerHTML=`
        <div id="c1t-browse-search">
            <input type="search" placeholder="Search merchant / reward / type..." />
            <button type="button">Clear</button>
        </div>
        <div id="c1t-browse-nav">${o}</div>
        <div id="c1t-browse-stats">${d(r)}</div>
        <div id="c1t-browse-body">${a||'<div style="padding:40px;text-align:center;opacity:0.7;">No offers found.</div>'}</div>
        <div id="c1t-browse-footer">Click a row to activate. Shopping rows open the pre-signed href; offers rows POST then redirect.</div>
    `;let i=n.querySelector("#c1t-browse-body");i&&$t(i),Rt(n),At(n)};(async function(){"use strict";let t=I();if(!t){alert("Please run this on capitaloneshopping.com or capitaloneoffers.com");return}let n=A()==="browse"?"browse":"trips";if(document.getElementById("c1t-fab")){document.getElementById("c1t-overlay")?.classList.add("open");return}console.log("[C1 Tracker Bookmarklet] Running on",t,"defaultTab=",n);async function a(){if(t==="shopping"){let s=await fetch(C.shopping.trips.apiEndpoint,{credentials:"include"});if(!s.ok)throw new Error(`API returned ${s.status}`);return E(await s.json())}return E(await B())}async function o(){let s=(g,m)=>{let h=document.querySelector("#c1t-loading");h&&(h.textContent=`Loaded ${g} pages, ${m} offers...`)};if(t==="shopping"){let g=await q(s),m=S(g.items);return m.stats.hitCap=g.hitCap,m.stats.pagesWalked=g.pagesWalked,m}let p=await V();if(!p)throw new Error("Could not capture offers feed context (userId + viewInstanceId). Open DevTools console for diagnostics. The URL should look like /feed/<userId>?viewInstanceId=<uuid>. Try clicking into the feed grid once, then re-run.");let u=await X(p,s),b=S(u.items);return b.stats.hitCap=u.hitCap,b.stats.pagesWalked=u.pagesWalked,b}let i=P({title:`${t==="offers"?"Cap One Offers":"Cap One Shopping"} Tracker`,defaultTabId:n,tabs:[{id:"trips",label:"Trips",render:M,getBadgeCount:s=>s?.stats?.withCredit??0,onActivate:a,loadingText:"Fetching shopping trips data..."},{id:"browse",label:"Browse",render:G,onActivate:o,loadingText:"Walking offers feed... (0 pages)"}]});i.ensureFab(),i.ensureOverlay(),document.getElementById("c1t-overlay")?.classList.add("open"),i.setActiveTab(n)})();})();
