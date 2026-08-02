"use strict";(()=>{var Y={offers:{hostname:"capitaloneoffers",pages:{trips:"/shopping-trips",browse:"/feed"},trips:{apiPattern:t=>t.includes("/xhr/shopping-trips"),apiEndpoint:"/xhr/shopping-trips?limit=100&offset=0&status[]=Activated&status[]=Adjusted&status[]=Completed&status[]=Inactive&status[]=Ineligible&status[]=Pending&status[]=Waiting"},browse:{apiPattern:t=>t.includes("/feed/")&&t.includes("viewInstanceId=")}},shopping:{hostname:"capitaloneshopping",pages:{trips:"/account-settings/shopping-trips",browse:"/"},trips:{apiPattern:t=>t.includes("/api/v1/trip_orders"),apiEndpoint:"/api/v1/trip_orders"},browse:{apiPattern:t=>t.endsWith("/api/v1/feed"),apiEndpoint:"/api/v1/feed"}}};function C(){return window.location.hostname.includes("capitaloneoffers")?"offers":window.location.hostname.includes("capitaloneshopping")?"shopping":null}function $(){let t=C();if(!t)return null;let e=window.location.pathname,r=Y[t].pages;return e.startsWith(r.trips)?"trips":t==="shopping"&&(e==="/"||e==="")||t==="offers"&&e.startsWith(r.browse)?"browse":null}function Q(t){if(!t)return[];if(Array.isArray(t))return t;let e=t;return Array.isArray(e.items)?e.items:Array.isArray(e.shoppingTrips)?e.shoppingTrips:Array.isArray(e.trip_orders)?e.trip_orders:e.data&&Array.isArray(e.data)?e.data:e.data&&typeof e.data=="object"&&Array.isArray(e.data.items)?e.data.items:[]}function Z(t){let e=t.orderAmount??t.order_amount??(t.trxnTotalCents!=null?t.trxnTotalCents/100:null),r=t.creditAmount??t.credit_amount??(t.payoutAmountCents!=null?t.payoutAmountCents/100:null),a=t.orderId??t.order_id??null,i=r!==null&&Number(r)>0,n=t.status??"Unknown";n==="Waiting"?n="Created":(n==="Inactive"||n==="Ineligible")&&(n="Canceled");let o=n;return i&&n.toLowerCase()==="canceled"?o="Completed":n.toLowerCase()==="pending"&&(o=i?"Pending \u2713":"Pending ?"),{id:t.id??t.tripId??t.activatedOfferId??null,tripId:t.tripId??t.trip_id??t.id??t.activatedOfferId??null,orderId:a,merchant:t.vendor??t.merchantName??t.merchantDisplayName??t.merchant??t.domain??"Unknown",domain:t.domain??null,status:o,rawStatus:n,orderAmount:e!==null?Number(e):null,creditAmount:r!==null?Number(r):null,date:t.createdAt??t.created_at??t.clickDate??t.date??null,hasOrderId:a!==null,hasAmount:e!==null&&Number(e)>0,hasCreditAmount:i,rewardDisplay:t.rewardsSummaryDisplayRate??(Array.isArray(t.rewards)?t.rewards[0]?.displayRate:void 0)??"",exclusions:t.merchantExclusions??"",raw:t}}function E(t){let r=Q(t).map(Z);return{trips:r,stats:{total:r.length,withOrderId:r.filter(a=>a.hasOrderId).length,withAmount:r.filter(a=>a.hasAmount).length,withCredit:r.filter(a=>a.hasCreditAmount).length,pending:r.filter(a=>a.status.toLowerCase().includes("pending")).length,created:r.filter(a=>a.status.toLowerCase()==="created").length}}}var L=100,tt=50,et="/xhr/shopping-trips?limit="+L+"&status[]=Activated&status[]=Adjusted&status[]=Completed&status[]=Inactive&status[]=Ineligible&status[]=Pending&status[]=Waiting";async function M(){let t=[];for(let e=0;e<tt;e++){let r=et+"&offset="+e*L,a=await fetch(r,{method:"POST",credentials:"include"});if(!a.ok)throw new Error("shopping-trips returned "+a.status);let i=await a.json(),n=Array.isArray(i.data)?i.data:[];if(t.push(...n),i.hasMore!==!0||n.length===0)break}return{data:t}}var I=100,nt=50;async function P(){let t=[];for(let e=0;e<nt;e++){let r=e*I,a="/api/v1/trip_orders?limit="+I+"&offset="+r+"&sort=desc",i=await fetch(a,{credentials:"include"});if(!i.ok)throw new Error("trip_orders returned "+i.status);let n=await i.json(),o=Array.isArray(n.items)?n.items:[];if(t.push(...o),o.length<I)break}return{items:t}}var rt=`
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
    .c1t-status.activated { background: #7e57c2 !important; }
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
`;function A(t){return t==null||t===0?"\u2014":"$"+Number(t).toFixed(2)}function at(t){if(!t)return"\u2014";try{return new Date(t).toLocaleDateString()}catch{return"\u2014"}}function d(t){if(t==null)return"";let e=document.createElement("div");return e.textContent=String(t),e.innerHTML}function it(t){let e=(t||"").toLowerCase();return e.includes("completed")?"completed":e==="pending \u2713"?"pending-good":e==="pending ?"||e.includes("pending")?"pending-uncertain":e.includes("created")?"created":e.includes("activated")?"activated":e.includes("cancel")?"canceled":e.includes("adjust")?"adjusted":""}var B=(t,e)=>{if(console.log("[C1 Tracker] renderTripsToModal called - data:",!!e,"overlay:",!!t),!e)return;let{trips:r,stats:a}=e,i=t.querySelector("#c1t-content");console.log("[C1 Tracker] renderTripsToModal - content element:",!!i,"trips:",r?.length),i&&(i.innerHTML=`
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
                        <th>Rate</th>
                        <th class="c">Status</th>
                        <th class="c">Tracked</th>
                        <th>Exclusions</th>
                    </tr>
                </thead>
                <tbody id="c1t-tbody">
                    ${r.map(n=>{let o=n.hasCreditAmount?"amt":n.hasOrderId?"tracked":"",s=it(n.status),l=n.exclusions??"",u=l.length>60,g=l?u?`<div class="c1t-excl-cell" title="${d(l)}"><span class="c1t-excl-text">${d(l)}</span><button type="button" class="c1t-excl-toggle">(more)</button></div>`:`<div class="c1t-excl-cell" title="${d(l)}"><span class="c1t-excl-text">${d(l)}</span></div>`:'<span style="opacity:0.4">\u2014</span>';return`
                                <tr class="${o}" data-filter-amount="${n.hasAmount}" data-filter-tracked="${n.hasOrderId}" data-filter-pending="${n.status.toLowerCase().includes("pending")}" data-filter-created="${n.status.toLowerCase()==="created"}">
                                    <td title="${d(n.domain)}">${d(n.merchant)}</td>
                                    <td class="c">${at(n.date)}</td>
                                    <td class="r ${n.hasAmount?"c1t-amount":""}">${A(n.orderAmount)}</td>
                                    <td class="r ${n.hasCreditAmount?"c1t-credit":""}">${A(n.creditAmount)}</td>
                                    <td>${d(n.rewardDisplay)||'<span style="opacity:0.4">\u2014</span>'}</td>
                                    <td class="c"><span class="c1t-status ${s}">${d(n.status)}</span></td>
                                    <td class="c">${n.hasOrderId?"\u2713":"\u2014"}</td>
                                    <td>${g}</td>
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
    `,i.querySelectorAll(".c1t-filter-btn").forEach(n=>{n.addEventListener("click",function(){i.querySelectorAll(".c1t-filter-btn").forEach(s=>s.classList.remove("active")),this.classList.add("active");let o=this.dataset.filter;i.querySelectorAll("#c1t-tbody tr").forEach(s=>{if(o==="all")s.style.display="";else if(o){let l=`filter${o.charAt(0).toUpperCase()+o.slice(1)}`;s.style.display=s.dataset[l]==="true"?"":"none"}})})}),i.querySelectorAll(".c1t-excl-toggle").forEach(n=>{n.addEventListener("click",o=>{o.stopPropagation(),o.preventDefault();let s=n.closest(".c1t-excl-cell");if(!s)return;let l=s.classList.toggle("c1t-excl-expanded");n.textContent=l?"(less)":"(more)"})}))};function _(t){let{title:e,tabs:r,defaultTabId:a}=t;if(r.length===0)throw new Error("createTabbedUI: tabs must be non-empty");if(!r.find(c=>c.id===a))throw new Error(`createTabbedUI: defaultTabId "${a}" not in tabs`);let i=new Map,n=new Map,o=!1,s=a;function l(c){return r.find(p=>p.id===c)??null}function u(){if(o&&document.getElementById("c1t-styles"))return;let c=document.getElementById("c1t-styles");c||(c=document.createElement("style"),c.id="c1t-styles",c.textContent=rt,(document.head||document.documentElement).appendChild(c)),o=!0}function g(){u();let c=document.getElementById("c1t-fab");if(c)return c;let p=document.createElement("button");return p.id="c1t-fab",p.innerHTML="\u{1F4CB}",p.title=e,p.addEventListener("click",()=>{h().classList.add("open"),m(s)}),document.body.appendChild(p),k(),p}function h(){u();let c=document.getElementById("c1t-overlay");if(c)return c;c=document.createElement("div"),c.id="c1t-overlay",c.innerHTML=`
            <div id="c1t-modal">
                <div id="c1t-header">
                    <h2>\u{1F4CB} ${d(e)}</h2>
                    <button id="c1t-close">\u2715</button>
                </div>
                <div id="c1t-tabs">
                    ${r.map(f=>`<button class="c1t-tab${f.id===s?" active":""}" data-tab-id="${d(f.id)}">${d(f.label)}</button>`).join("")}
                </div>
                <div id="c1t-content"></div>
            </div>
        `,document.body.appendChild(c);let p=c;return p.querySelector("#c1t-close")?.addEventListener("click",()=>{p.classList.remove("open")}),p.addEventListener("click",f=>{f.target===p&&p.classList.remove("open")}),p.querySelectorAll(".c1t-tab").forEach(f=>{f.addEventListener("click",()=>{let x=f.dataset.tabId;x&&m(x)})}),c}async function m(c){let p=l(c);if(!p)return;s=c;let f=document.getElementById("c1t-overlay");f&&f.querySelectorAll(".c1t-tab").forEach(y=>{y.classList.toggle("active",y.dataset.tabId===c)});let x=f?.querySelector("#c1t-content");if(i.has(c)){x&&p.render(f,i.get(c));return}if(!p.onActivate){x&&(x.innerHTML=`<div id="c1t-loading">${d(p.loadingText??"No data.")}</div>`);return}if(n.has(c)){await n.get(c);return}x&&(x.innerHTML=`<div id="c1t-loading">${d(p.loadingText??"Loading\u2026")}</div>`);let v=(async()=>{try{let y=await p.onActivate();y!=null&&w(c,y)}catch(y){console.error("[C1 Tracker] tab loader threw:",y);let J=y instanceof Error?y.message:String(y),R=document.getElementById("c1t-content");R&&s===c&&(R.innerHTML=`<div id="c1t-loading">Error loading data: ${d(J)}</div>`)}finally{n.delete(c)}})();n.set(c,v),await v}function b(c){m(c)}function w(c,p){let f=l(c);if(!f)return;i.set(c,p),k();let x=document.getElementById("c1t-overlay");x&&s===c&&f.render(x,p)}function k(){let c=document.getElementById("c1t-fab");if(!c)return;let p=0,f=!1;for(let x of r){if(!i.has(x.id)||(f=!0,!x.getBadgeCount))continue;let v=x.getBadgeCount(i.get(x.id));v>p&&(p=v)}f?c.classList.add("has-data"):c.classList.remove("has-data"),c.innerHTML=p>0?`\u{1F4CB}<span class="badge">${p}</span>`:"\u{1F4CB}"}return document.addEventListener("keydown",c=>{if(c.key==="Escape"){let p=document.getElementById("c1t-overlay");p&&p.classList.remove("open")}}),{ensureStyles:u,ensureFab:g,ensureOverlay:h,setActiveTab:b,setTabData:w,getActiveTabId:()=>s}}var ot=750,D=4,st=5e3;function U(t){return new Promise(e=>setTimeout(e,t))}function ct(t){if(!t)return null;let e=Number(t);return Number.isFinite(e)&&e>=0?Math.min(e*1e3,3e4):null}async function j(t,e){for(let r=0;r<=D;r++)try{let a=await fetch(t,e);if(a.status!==429)return a;if(r===D)return console.warn("[C1 Tracker] 429 retries exhausted",{url:t}),a;let i=ct(a.headers.get("Retry-After"));if(i==null)try{let l=await a.clone().json();typeof l?.retry_after=="number"&&l.retry_after>=0&&(i=Math.min(l.retry_after*1e3,6e4))}catch{}let n=i??st*Math.pow(2,r),o=Math.floor(Math.random()*500),s=n+o;console.warn("[C1 Tracker] 429 rate-limited; waiting",s,"ms",{attempt:r+1,url:t}),await U(s)}catch(a){return console.warn("[C1 Tracker] fetch threw",a),null}return null}var lt=/(\d+(?:\.\d+)?)X/i,pt=/(\d+(?:\.\d+)?)%/,dt=/\$([\d,]+(?:\.\d+)?)/,ut=/([\d,]+)\s*(miles|points)/i;function T(t){let e=String(t??""),r=e.trim();if(!r)return{type:"unknown",value:0,display:e};let a=r.match(lt);if(a&&a[1]!==void 0)return{type:"multiplier",value:parseFloat(a[1]),display:e};let i=r.match(dt);if(i&&i[1]!==void 0)return{type:"fixed-cash",value:parseFloat(i[1].replace(/,/g,"")),display:e};let n=r.match(ut);if(n&&n[1]!==void 0)return{type:"fixed-points",value:parseFloat(n[1].replace(/,/g,"")),display:e};let o=r.match(pt);return o&&o[1]!==void 0?{type:"percent",value:parseFloat(o[1]),display:e}:{type:"unknown",value:0,display:e}}function F(t){let e=t.stats??{};return e.cashbackV2??e.cashback??e.cashbackAmount??""}function mt(t){if(!t||!t.length)return null;let e=null;for(let r of t){let a=T(r.cashback);a.value>0&&(!e||a.value>e.value)&&(e={type:a.type,value:a.value,display:r.cashback})}return e}function ft(t){switch(t){case"great_deal":return"price-drops";case"event_placement":return"events";case"nca_deal":return"new-customer";case"retarget":case"retarget_non_product":return"recently-viewed";default:return"value"}}function gt(t){if(!t.href)return null;let e=t.merchantName??"",r=t.domain??"";if(!e&&!r)return null;let a=t.stats??{},i=a.isCutType===!0||a.rewardType==="cut",n,o,s;if(i){let m=mt(a.cashbackCategories);if(m){n=m.type,o=m.value;let b=m.display.trim();s=b.toLowerCase().startsWith("up to")?b:"Up to "+b}else{let b=T(F(t));n=b.type,o=b.value,s=b.display.toLowerCase().startsWith("up to")?b.display:b.value?"Up to "+b.display:b.display}}else{let m=T(F(t));n=m.type,o=m.value,s=m.display}let l={method:"href",url:t.href},u=ft(t.type),g=t.id??null;return{id:g!==null?String(g):`shopping|${e||r}|${s}|${t.type}`,source:"shopping",itemType:t.type,merchant:e||r,domain:r||e,rewardType:n,rewardValue:o,rewardDisplay:s,activation:l,bucketCategory:u,pill:t.pill?.text??null,exclusions:a.exclusionsText??"",eventEnd:t.end??null,priceHistory:a.priceHistory??null,raw:t}}function ht(t,e){return`https://capitaloneoffers.com/xhr/feed/${encodeURIComponent(t.userId)}/offers/${e}`}function z(t,e){if(t.type==="Carousel"){let s=t.tiles??[],l=[];for(let u of s)for(let g of z(u,e))l.push(g);return l}let r=t.id,a=t.merchantTLD;if(!r||!a)return[];let i=t.buttonText??"",n=T(i),o=t.subText&&t.headingText?`${t.headingText} \u2014 ${t.subText}`:t.subText??t.headingText??t.text??"";return[{id:r,source:"offers",itemType:t.type,merchant:a,domain:a,rewardType:n.type,rewardValue:n.value,rewardDisplay:n.display,activation:{method:"post-offers",url:ht(e,r)},bucketCategory:"value",pill:t.badge?.text??null,exclusions:o,eventEnd:null,priceHistory:null,raw:t}]}function bt(t){let e=t.rewardValue;switch(t.rewardType){case"multiplier":return e>=30?"mult-30":e>=20?"mult-20":e>=10?"mult-10":"mult-1";case"percent":case"cut":return e>=40?"pct-40":e>=20?"pct-20":e>=10?"pct-10":"pct-1";case"fixed-cash":return e>=50?"cash-50":e>=25?"cash-25":"cash-0";case"fixed-points":return e>=1e4?"pts-10k":e>=5e3?"pts-5k":e>=1e3?"pts-1k":"pts-lt-1k";case"unknown":default:return"pct-1"}}var W=[{id:"mult-30",label:"Multipliers \xB7 30X+",group:"multiplier",initiallyOpen:!0},{id:"mult-20",label:"Multipliers \xB7 20\u201329X",group:"multiplier",initiallyOpen:!0},{id:"mult-10",label:"Multipliers \xB7 10\u201319X",group:"multiplier",initiallyOpen:!1},{id:"mult-1",label:"Multipliers \xB7 1\u20139X",group:"multiplier",initiallyOpen:!1},{id:"pct-40",label:"Percent \xB7 40%+",group:"percent",initiallyOpen:!0},{id:"pct-20",label:"Percent \xB7 20\u201339%",group:"percent",initiallyOpen:!0},{id:"pct-10",label:"Percent \xB7 10\u201319%",group:"percent",initiallyOpen:!1},{id:"pct-1",label:"Percent \xB7 1\u20139%",group:"percent",initiallyOpen:!1},{id:"cash-50",label:"Fixed Cash \xB7 $50+",group:"fixed-cash",initiallyOpen:!0},{id:"cash-25",label:"Fixed Cash \xB7 $25\u201349",group:"fixed-cash",initiallyOpen:!0},{id:"cash-0",label:"Fixed Cash \xB7 under $25",group:"fixed-cash",initiallyOpen:!1},{id:"pts-10k",label:"Fixed Points \xB7 10,000+",group:"fixed-points",initiallyOpen:!0},{id:"pts-5k",label:"Fixed Points \xB7 5,000\u20139,999",group:"fixed-points",initiallyOpen:!0},{id:"pts-1k",label:"Fixed Points \xB7 1,000\u20134,999",group:"fixed-points",initiallyOpen:!1},{id:"pts-lt-1k",label:"Fixed Points \xB7 under 1,000",group:"fixed-points",initiallyOpen:!1}],N=(()=>{let t={};for(let e of W)t[e.id]=e;return t})();function S(t){let e={};for(let n of t){let o=bt(n);(e[o]??(e[o]=[])).push(n)}for(let n of Object.keys(e))e[n].sort((o,s)=>s.rewardValue-o.rewardValue);let r=[],a={};for(let n of W){let o=e[n.id];o&&o.length&&(r.push(n.id),a[n.id]=o.length)}let i={total:t.length,byBucket:a};return{offers:t,buckets:e,bucketOrder:r,stats:i}}async function q(t){let e=t.maxPages??40,r=new Set,a=[],i=null,n=0;for(;n<e;){n>0&&await U(ot);let o=await t.fetchPage(i);if(!o)break;for(let l of t.getItems(o)){let u=t.dedupeKey(l);u&&r.has(u)||(u&&r.add(u),a.push(l))}n++,t.onPage?.(n,a.length);let s=t.getNextCursor(o);if(!s)break;i=s}return{items:a,hitCap:n>=e,pagesWalked:n}}function xt(t){let e={limit:25};return t&&(e.nextPageToken=t),JSON.stringify({contentProps:{pagination:e},context:{device:{model:typeof navigator<"u"&&/Mac/.test(navigator.platform)?"Macintosh":"Unknown",manufacturer:"Unknown",memory:"8",concurrency:String(typeof navigator<"u"&&navigator.hardwareConcurrency||4)},browser:{name:"Chrome",version:"0",major:"0"},os:{name:"unknown",version:"0"},screen:{width:1920,height:1080,density:2},locale:typeof navigator<"u"&&navigator.language?navigator.language:"en-US",country:"US",location:{state:"",zipcode:"",latitude:null,longitude:null,isInCensusData:!1},page:{path:typeof window<"u"?window.location.pathname:"/",url:typeof window<"u"?window.location.href:"",referrer:typeof document<"u"?document.referrer:"",search:typeof window<"u"?window.location.search:"",title:typeof document<"u"?document.title:""},userAgent:typeof navigator<"u"?navigator.userAgent:""}})}function yt(t){let e=t;if(e.id!==void 0&&e.id!==null&&e.id!=="")return String(e.id);let r=t.merchantName??"",a=t.stats?.cashbackV2??t.stats?.cashback??"";return!r&&!a?null:`${r}|${a}|${t.type}`}async function G(t){let e={fetchPage:async n=>{let o=await j("/api/v1/feed",{method:"POST",credentials:"include",headers:{"Content-Type":"application/json"},body:xt(n)});if(!o||!o.ok)return console.warn("[C1 Tracker] shopping feed POST failed",{status:o?.status,statusText:o?.statusText,cursor:n}),null;let s=await o.json();return n||console.log("[C1 Tracker] shopping feed first page",{count:s.count,itemCount:s.items?.length??0,nextPageToken:s.pagination?.nextPageToken}),s},getNextCursor:n=>n.pagination?.nextPageToken??null,getItems:n=>n.items??[],dedupeKey:yt,...t?{onPage:t}:{},maxPages:40},r=await q(e),a=[],i=0;for(let n of r.items){let o=gt(n);o?a.push(o):i++}return console.log("[C1 Tracker] shopping walk done",{rawItems:r.items.length,normalized:a.length,droppedDuringNormalize:i,pagesWalked:r.pagesWalked,hitCap:r.hitCap}),{items:a,hitCap:r.hitCap,pagesWalked:r.pagesWalked}}function wt(t,e){let r=`https://capitaloneoffers.com/feed/${encodeURIComponent(t.userId)}`,a=`?numberOfColumnsInGrid=5&viewInstanceId=${t.viewInstanceId}&contentSlug=ease-web-l1`;return e?`${r}${a}&cursor=${e}`:`${r}${a}`}function kt(t){let e=t.merchantTLD??"",r=t.buttonText??"";return e&&r?`${e}|${r}`:t.id??null}function vt(t){let e=[];for(let r of t)if(r.type==="Carousel")for(let a of r.tiles??[])e.push(a);else e.push(r);return e}async function X(t,e){let r={fetchPage:async n=>{let o=await j(wt(t,n),{method:"GET",credentials:"include",headers:{Accept:"application/json"}});return!o||!o.ok?(console.warn("[C1 Tracker] offers feed GET failed",{status:o?.status,statusText:o?.statusText,cursor:n}),null):await o.json()},getNextCursor:n=>n.cursor??null,getItems:n=>vt(n.data??[]),dedupeKey:kt,...e?{onPage:e}:{},maxPages:40},a=await q(r),i=[];for(let n of a.items)for(let o of z(n,t))i.push(o);return{items:i,hitCap:a.hitCap,pagesWalked:a.pagesWalked}}function O(t,e,r=0){if(r>6||t===null||typeof t!="object")return null;let a=t;for(let i of e){let n=a[i];if(typeof n=="string"&&n.length>0)return n}for(let i of Object.keys(a)){let n=a[i];if(n&&typeof n=="object"){let o=O(n,e,r+1);if(o)return o}}return null}function H(t){let e=new RegExp(`\\\\?"${t}\\\\?"\\s*,\\s*\\\\?"([^"\\\\]+)\\\\?"`),r=document.getElementsByTagName("script");for(let a=0;a<r.length;a++){let i=r[a].textContent;if(!i||i.indexOf(t)<0)continue;let n=i.match(e);if(n&&n[1])return n[1]}return null}function Tt(){let t=null,e=null;try{e=new URLSearchParams(window.location.search).get("viewInstanceId")}catch{}let r=window.location.pathname.match(/^\/feed\/([^/?#]+)/);if(r&&r[1]&&(t=decodeURIComponent(r[1])),t||(t=H("maybeSelectedArid")),e||(e=H("viewInstanceId")),!t||!e)try{let a=document.getElementById("__NEXT_DATA__");if(a?.textContent){let i=JSON.parse(a.textContent);t||(t=O(i,["userId","accountReferenceId"])),e||(e=O(i,["viewInstanceId"]))}}catch{}if(!e&&t)try{typeof crypto<"u"&&typeof crypto.randomUUID=="function"&&(e=crypto.randomUUID())}catch{}return t&&e?{userId:t,viewInstanceId:e}:(console.warn("[C1 Tracker] getOffersBrowseContext (sync) failed",{pathname:window.location.pathname,search:window.location.search,userId:t,viewInstanceId:e,hasNextData:!!document.getElementById("__NEXT_DATA__")}),null)}async function V(){let t=Tt();if(t)return t;let e=null,r=null;try{r=new URLSearchParams(window.location.search).get("viewInstanceId")}catch{}try{let a=await fetch("/xhr/shopping-trips?limit=1&offset=0&status[]=Activated&status[]=Adjusted&status[]=Completed&status[]=Inactive&status[]=Ineligible&status[]=Pending&status[]=Waiting",{method:"POST",credentials:"include"});if(a.ok){let n=(await a.json())?.data?.[0];n&&typeof n.accountReferenceId=="string"&&(e=n.accountReferenceId)}}catch(a){console.warn("[C1 Tracker] trips-API fallback for userId failed:",a)}if(!r&&e)try{typeof crypto<"u"&&typeof crypto.randomUUID=="function"&&(r=crypto.randomUUID())}catch{}return e&&r?{userId:e,viewInstanceId:r}:(console.warn("[C1 Tracker] fetchOffersBrowseContext failed",{userId:e,viewInstanceId:r}),null)}function It(t,e){return e==="events"?"event":e==="price-drops"?"deal":e==="new-customer"?"new":e==="recently-viewed"?"retarget":t==="great_deal"?"deal":""}function Ct(t){return`${t.merchant} ${t.domain} ${t.rewardDisplay} ${t.itemType} ${t.exclusions}`.toLowerCase()}function Et(t){if(!t)return"";try{return new Date(t).toLocaleDateString(void 0,{month:"short",day:"numeric"})}catch{return""}}function Ot(t,e){let r=e.map(i=>{let n=d(Ct(i)),o=i.pill?`<span class="c1t-pill ${It(i.itemType,i.bucketCategory)}">${d(i.pill)}</span>`:"",s=i.eventEnd?`<span class="c1t-event-end">ends ${d(Et(i.eventEnd))}</span>`:"",l=i.exclusions??"",u=l?` title="${d(l)}"`:"",g=l?d(l):"",h=l.length>60,m=g?h?`<div class="c1t-excl-cell"${u}>
                       <span class="c1t-excl-text">${g}</span><button type="button" class="c1t-excl-toggle">(more)</button>
                   </div>`:`<div class="c1t-excl-cell"${u}><span class="c1t-excl-text">${g}</span></div>`:"";return`<tr class="c1t-row-click"
            data-merchant="${d(i.merchant)}"
            data-bucket-id="${d(t.id)}"
            data-search="${n}"
            data-method="${d(i.activation.method)}"
            data-activation-url="${d(i.activation.url)}">
            <td>${d(i.merchant)}</td>
            <td><span class="c1t-reward">${d(i.rewardDisplay)}</span></td>
            <td>${o}</td>
            <td>${s}</td>
            <td>${m}</td>
        </tr>`}).join(""),a=t.initiallyOpen?" open":"";return`<details class="c1t-bucket" data-bucket-id="${t.id}"${a}>
        <summary>${d(t.label)} <span class="c1t-bucket-count">(${e.length})</span></summary>
        <table>
            <thead>
                <tr><th>Merchant</th><th>Reward</th><th>Badge</th><th>Ends</th><th>Exclusions</th></tr>
            </thead>
            <tbody>${r}</tbody>
        </table>
    </details>`}function St(t){switch(t){case"multiplier":return"Multipliers";case"percent":return"Percent";case"fixed-cash":return"Cash";case"fixed-points":return"Points"}}function Rt(t){let e=[],r=new Set;for(let a of t.bucketOrder){let i=N[a];i&&(r.has(i.group)||(r.add(i.group),e.push(`<button class="c1t-jump-chip" data-jump-to="${i.id}">${d(St(i.group))}</button>`)))}return e.join("")}function At(t){let e=t.dataset.activationUrl;e&&window.open(e,"_blank","noopener")}async function $t(t){let e=t.dataset.activationUrl;if(!e)return;let r=t.dataset.merchant??"merchant",a=window.open("about:blank","_blank");try{let i=await fetch(e,{method:"POST",credentials:"include"});if(!i.ok)throw new Error(`Activation returned ${i.status}`);let n=await i.json(),o=n?.offer?n.offer:n,s=o?.affiliate?.redirectUrl;if(s&&a){a.location=s;return}let l=o?.cardLinked?.cardLinkedOfferDetail;if(o?.cardLinked&&l?.isActivated){a?.close?.(),alert(`${r} card-linked offer activated. Use your card as usual \u2014 no redirect needed.`);return}if(o?.cardLinked?.cardLinkedOfferDetail?.activationLimitsReached){a?.close?.(),alert("Card-linked activation limit reached \u2014 cancel an existing activation and try again.");return}console.warn("[C1 Tracker] Activation POST returned detail shape (no redirectUrl)",o),a?.close?.(),alert("Activation failed \u2014 response had no redirect and no card-linked activation.")}catch(i){a?.close?.(),alert("Activation failed: "+(i instanceof Error?i.message:String(i)))}}function Lt(t){t.addEventListener("click",e=>{let r=e.target;if(!r)return;let a=r.closest(".c1t-excl-toggle");if(a){e.stopPropagation(),e.preventDefault();let n=a.closest(".c1t-excl-cell");if(n){let o=n.classList.toggle("c1t-excl-expanded");a.textContent=o?"(less)":"(more)"}return}let i=r.closest("tr[data-method]");i&&(i.dataset.method==="href"?At(i):i.dataset.method==="post-offers"&&$t(i))})}function Mt(t){let e=t.querySelector("#c1t-browse-search input"),r=t.querySelector("#c1t-browse-search button");if(!e)return;let a=new Map;t.querySelectorAll("details[data-bucket-id]").forEach(o=>{let s=o,l=s.dataset.bucketId??"";a.set(l,s.open)});let i=null,n=o=>{let s=o.trim().toLowerCase(),l=s.length===0;t.querySelectorAll("details[data-bucket-id]").forEach(g=>{let h=g,m=h.dataset.bucketId??"",b=h.querySelectorAll("tr[data-search]"),w=0;b.forEach(k=>{let c=k.dataset.search??"",p=l||c.includes(s);k.style.display=p?"":"none",p&&w++}),w===0&&!l?h.style.display="none":(h.style.display="",l?h.open=a.get(m)??!1:h.open=!0)})};e.addEventListener("input",()=>{i&&clearTimeout(i),i=setTimeout(()=>n(e.value),100)}),r&&r.addEventListener("click",()=>{e.value="",n("")})}function Pt(t){let e=t.querySelector("#c1t-browse-nav");e&&e.addEventListener("click",r=>{let a=r.target;if(!a)return;let i=a.closest("[data-jump-to]");if(!i)return;let n=i.dataset.jumpTo;if(!n)return;let o=t.querySelector(`details[data-bucket-id="${n}"]`);o&&(o.open=!0,o.scrollIntoView({behavior:"smooth",block:"start"}))})}var K=(t,e)=>{let r=t.querySelector("#c1t-content");if(!r)return;let a=e.bucketOrder.map(s=>{let l=N[s];if(!l)return"";let u=e.buckets[s];return!u||!u.length?"":Ot(l,u)}).join(""),i=Rt(e),n=e.stats.hitCap?`Stopped at ${e.stats.total} items (max pages reached)`:`${e.stats.total} offers across ${e.bucketOrder.length} buckets`;r.innerHTML=`
        <div id="c1t-browse-search">
            <input type="search" placeholder="Search merchant / reward / type..." />
            <button type="button">Clear</button>
        </div>
        <div id="c1t-browse-nav">${i}</div>
        <div id="c1t-browse-stats">${d(n)}</div>
        <div id="c1t-browse-body">${a||'<div style="padding:40px;text-align:center;opacity:0.7;">No offers found.</div>'}</div>
        <div id="c1t-browse-footer">Click a row to activate. Shopping rows open the pre-signed href; offers rows POST then redirect.</div>
    `;let o=r.querySelector("#c1t-browse-body");o&&Lt(o),Mt(r),Pt(r)};(async function(){"use strict";let t=C();if(!t){alert("Please run this on capitaloneshopping.com or capitaloneoffers.com");return}let r=$()==="browse"?"browse":"trips";if(document.getElementById("c1t-fab")){document.getElementById("c1t-overlay")?.classList.add("open");return}console.log("[C1 Tracker Bookmarklet] Running on",t,"defaultTab=",r);async function a(){return t==="shopping"?E(await P()):E(await M())}async function i(){let s=(h,m)=>{let b=document.querySelector("#c1t-loading");b&&(b.textContent=`Loaded ${h} pages, ${m} offers...`)};if(t==="shopping"){let h=await G(s),m=S(h.items);return m.stats.hitCap=h.hitCap,m.stats.pagesWalked=h.pagesWalked,m}let l=await V();if(!l)throw new Error("Could not capture offers feed context (userId + viewInstanceId). Open DevTools console for diagnostics. The URL should look like /feed/<userId>?viewInstanceId=<uuid>. Try clicking into the feed grid once, then re-run.");let u=await X(l,s),g=S(u.items);return g.stats.hitCap=u.hitCap,g.stats.pagesWalked=u.pagesWalked,g}let o=_({title:`${t==="offers"?"Cap One Offers":"Cap One Shopping"} Tracker`,defaultTabId:r,tabs:[{id:"trips",label:"Trips",render:B,getBadgeCount:s=>s?.stats?.withCredit??0,onActivate:a,loadingText:"Fetching shopping trips data..."},{id:"browse",label:"Browse",render:K,onActivate:i,loadingText:"Walking offers feed... (0 pages)"}]});o.ensureFab(),o.ensureOverlay(),document.getElementById("c1t-overlay")?.classList.add("open"),o.setActiveTab(r)})();})();
