"use strict";(()=>{var Y={offers:{hostname:"capitaloneoffers",pages:{trips:"/shopping-trips",browse:"/feed"},trips:{apiPattern:t=>t.includes("/xhr/shopping-trips"),apiEndpoint:"/xhr/shopping-trips?limit=100&offset=0&status[]=Activated&status[]=Adjusted&status[]=Completed&status[]=Inactive&status[]=Ineligible&status[]=Pending&status[]=Waiting"},browse:{apiPattern:t=>t.includes("/feed/")&&t.includes("viewInstanceId=")}},shopping:{hostname:"capitaloneshopping",pages:{trips:"/account-settings/shopping-trips",browse:"/"},trips:{apiPattern:t=>t.includes("/api/v1/trip_orders"),apiEndpoint:"/api/v1/trip_orders"},browse:{apiPattern:t=>t.endsWith("/api/v1/feed"),apiEndpoint:"/api/v1/feed"}}};function E(){return window.location.hostname.includes("capitaloneoffers")?"offers":window.location.hostname.includes("capitaloneshopping")?"shopping":null}function A(){let t=E();if(!t)return null;let e=window.location.pathname,n=Y[t].pages;return e.startsWith(n.trips)?"trips":t==="shopping"&&(e==="/"||e==="")||t==="offers"&&e.startsWith(n.browse)?"browse":null}function Q(t){if(!t)return[];if(Array.isArray(t))return t;let e=t;return Array.isArray(e.items)?e.items:Array.isArray(e.shoppingTrips)?e.shoppingTrips:Array.isArray(e.trip_orders)?e.trip_orders:e.data&&Array.isArray(e.data)?e.data:e.data&&typeof e.data=="object"&&Array.isArray(e.data.items)?e.data.items:[]}function Z(t){let e=t.orderAmount??t.order_amount??(t.trxnTotalCents!=null?t.trxnTotalCents/100:null),n=t.creditAmount??t.credit_amount??(t.payoutAmountCents!=null?t.payoutAmountCents/100:null),r=t.orderId??t.order_id??null,i=n!==null&&Number(n)>0,a=t.status??"Unknown";a==="Waiting"?a="Created":(a==="Inactive"||a==="Ineligible")&&(a="Canceled");let o=a;return i&&a.toLowerCase()==="canceled"?o="Completed":a.toLowerCase()==="pending"&&(o=i?"Pending \u2713":"Pending ?"),{id:t.id??t.tripId??t.activatedOfferId??null,tripId:t.tripId??t.trip_id??t.id??t.activatedOfferId??null,orderId:r,merchant:t.vendor??t.merchantName??t.merchantDisplayName??t.merchant??t.domain??"Unknown",domain:t.domain??null,status:o,rawStatus:a,orderAmount:e!==null?Number(e):null,creditAmount:n!==null?Number(n):null,date:t.createdAt??t.created_at??t.clickDate??t.date??null,hasOrderId:r!==null,hasAmount:e!==null&&Number(e)>0,hasCreditAmount:i,rewardDisplay:t.rewardsSummaryDisplayRate??(Array.isArray(t.rewards)?t.rewards[0]?.displayRate:void 0)??"",exclusions:t.merchantExclusions??"",raw:t}}function T(t){let n=Q(t).map(Z);return{trips:n,stats:{total:n.length,withOrderId:n.filter(r=>r.hasOrderId).length,withAmount:n.filter(r=>r.hasAmount).length,withCredit:n.filter(r=>r.hasCreditAmount).length,pending:n.filter(r=>r.status.toLowerCase().includes("pending")).length,created:n.filter(r=>r.status.toLowerCase()==="created").length}}}var L=100,tt=50,et="/xhr/shopping-trips?limit="+L+"&status[]=Activated&status[]=Adjusted&status[]=Completed&status[]=Inactive&status[]=Ineligible&status[]=Pending&status[]=Waiting";async function P(t={}){let e=[];for(let n=0;n<tt;n++){let r=et+"&offset="+n*L,i=await fetch(r,{method:"POST",credentials:"include"});if(!i.ok)throw new Error("shopping-trips returned "+i.status);let a=await i.json(),o=Array.isArray(a.data)?a.data:[];if(e.push(...o),t.onProgress?.(e,n+1),a.hasMore!==!0||o.length===0)break}return{data:e}}var C=100,nt=50;async function M(t={}){let e=[];for(let n=0;n<nt;n++){let r=n*C,i="/api/v1/trip_orders?limit="+C+"&offset="+r+"&sort=desc",a=await fetch(i,{credentials:"include"});if(!a.ok)throw new Error("trip_orders returned "+a.status);let o=await a.json(),l=Array.isArray(o.items)?o.items:[];if(e.push(...l),t.onProgress?.(e,n+1),l.length<C)break}return{items:e}}var rt=`
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
    #c1t-stats .c1t-loading-pill {
        background: rgba(255, 179, 0, 0.25) !important;
        padding: 3px 10px !important;
        border-radius: 12px !important;
        font-size: 12px !important;
        font-weight: 500 !important;
        color: #ffe082 !important;
        margin-left: 8px !important;
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
`;function $(t){return t==null||t===0?"\u2014":"$"+Number(t).toFixed(2)}function at(t){if(!t)return"\u2014";try{return new Date(t).toLocaleDateString()}catch{return"\u2014"}}function m(t){if(t==null)return"";let e=document.createElement("div");return e.textContent=String(t),e.innerHTML}function it(t){let e=(t||"").toLowerCase();return e.includes("completed")?"completed":e==="pending \u2713"?"pending-good":e==="pending ?"||e.includes("pending")?"pending-uncertain":e.includes("created")?"created":e.includes("activated")?"activated":e.includes("cancel")?"canceled":e.includes("adjust")?"adjusted":""}var B=(t,e)=>{if(console.log("[C1 Tracker] renderTripsToModal called - data:",!!e,"overlay:",!!t),!e)return;let{trips:n,stats:r}=e,i=t.querySelector("#c1t-content");if(console.log("[C1 Tracker] renderTripsToModal - content element:",!!i,"trips:",n?.length),!i)return;let o=i.querySelector("#c1t-table-wrap")?.scrollTop??0,l=r.isLoading?`<span class="stat c1t-loading-pill">\u23F3 ${m(r.loadingText??"Loading\u2026")}</span>`:"";i.innerHTML=`
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
                    ${n.map(s=>{let f=s.hasCreditAmount?"amt":s.hasOrderId?"tracked":"",g=it(s.status),d=s.exclusions??"",h=d.length>60,y=d?h?`<div class="c1t-excl-cell" title="${m(d)}"><span class="c1t-excl-text">${m(d)}</span><button type="button" class="c1t-excl-toggle">(more)</button></div>`:`<div class="c1t-excl-cell" title="${m(d)}"><span class="c1t-excl-text">${m(d)}</span></div>`:'<span style="opacity:0.4">\u2014</span>';return`
                                <tr class="${f}" data-filter-amount="${s.hasAmount}" data-filter-tracked="${s.hasOrderId}" data-filter-pending="${s.status.toLowerCase().includes("pending")}" data-filter-created="${s.status.toLowerCase()==="created"}">
                                    <td title="${m(s.domain)}">${m(s.merchant)}</td>
                                    <td class="c">${at(s.date)}</td>
                                    <td class="r ${s.hasAmount?"c1t-amount":""}">${$(s.orderAmount)}</td>
                                    <td class="r ${s.hasCreditAmount?"c1t-credit":""}">${$(s.creditAmount)}</td>
                                    <td>${m(s.rewardDisplay)||'<span style="opacity:0.4">\u2014</span>'}</td>
                                    <td class="c"><span class="c1t-status ${g}">${m(s.status)}</span></td>
                                    <td class="c">${s.hasOrderId?"\u2713":"\u2014"}</td>
                                    <td>${y}</td>
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
    `;let p=i.querySelector("#c1t-table-wrap");p&&o>0&&(p.scrollTop=o),i.querySelectorAll(".c1t-filter-btn").forEach(s=>{s.addEventListener("click",function(){i.querySelectorAll(".c1t-filter-btn").forEach(g=>g.classList.remove("active")),this.classList.add("active");let f=this.dataset.filter;i.querySelectorAll("#c1t-tbody tr").forEach(g=>{if(f==="all")g.style.display="";else if(f){let d=`filter${f.charAt(0).toUpperCase()+f.slice(1)}`;g.style.display=g.dataset[d]==="true"?"":"none"}})})}),i.querySelectorAll(".c1t-excl-toggle").forEach(s=>{s.addEventListener("click",f=>{f.stopPropagation(),f.preventDefault();let g=s.closest(".c1t-excl-cell");if(!g)return;let d=g.classList.toggle("c1t-excl-expanded");s.textContent=d?"(less)":"(more)"})})};function _(t){let{title:e,tabs:n,defaultTabId:r}=t;if(n.length===0)throw new Error("createTabbedUI: tabs must be non-empty");if(!n.find(c=>c.id===r))throw new Error(`createTabbedUI: defaultTabId "${r}" not in tabs`);let i=new Map,a=new Map,o=!1,l=r;function p(c){return n.find(u=>u.id===c)??null}function s(){if(o&&document.getElementById("c1t-styles"))return;let c=document.getElementById("c1t-styles");c||(c=document.createElement("style"),c.id="c1t-styles",c.textContent=rt,(document.head||document.documentElement).appendChild(c)),o=!0}function f(){s();let c=document.getElementById("c1t-fab");if(c)return c;let u=document.createElement("button");return u.id="c1t-fab",u.innerHTML="\u{1F4CB}",u.title=e,u.addEventListener("click",()=>{g().classList.add("open"),d(l)}),document.body.appendChild(u),k(),u}function g(){s();let c=document.getElementById("c1t-overlay");if(c)return c;c=document.createElement("div"),c.id="c1t-overlay",c.innerHTML=`
            <div id="c1t-modal">
                <div id="c1t-header">
                    <h2>\u{1F4CB} ${m(e)}</h2>
                    <button id="c1t-close">\u2715</button>
                </div>
                <div id="c1t-tabs">
                    ${n.map(b=>`<button class="c1t-tab${b.id===l?" active":""}" data-tab-id="${m(b.id)}">${m(b.label)}</button>`).join("")}
                </div>
                <div id="c1t-content"></div>
            </div>
        `,document.body.appendChild(c);let u=c;return u.querySelector("#c1t-close")?.addEventListener("click",()=>{u.classList.remove("open")}),u.addEventListener("click",b=>{b.target===u&&u.classList.remove("open")}),u.querySelectorAll(".c1t-tab").forEach(b=>{b.addEventListener("click",()=>{let x=b.dataset.tabId;x&&d(x)})}),c}async function d(c){let u=p(c);if(!u)return;l=c;let b=document.getElementById("c1t-overlay");b&&b.querySelectorAll(".c1t-tab").forEach(w=>{w.classList.toggle("active",w.dataset.tabId===c)});let x=b?.querySelector("#c1t-content");if(i.has(c)){x&&u.render(b,i.get(c));return}if(!u.onActivate){x&&(x.innerHTML=`<div id="c1t-loading">${m(u.loadingText??"No data.")}</div>`);return}if(a.has(c)){await a.get(c);return}x&&(x.innerHTML=`<div id="c1t-loading">${m(u.loadingText??"Loading\u2026")}</div>`);let v=(async()=>{try{let w=await u.onActivate();w!=null&&y(c,w)}catch(w){console.error("[C1 Tracker] tab loader threw:",w);let J=w instanceof Error?w.message:String(w),O=document.getElementById("c1t-content");O&&l===c&&(O.innerHTML=`<div id="c1t-loading">Error loading data: ${m(J)}</div>`)}finally{a.delete(c)}})();a.set(c,v),await v}function h(c){d(c)}function y(c,u){let b=p(c);if(!b)return;i.set(c,u),k();let x=document.getElementById("c1t-overlay");x&&l===c&&b.render(x,u)}function k(){let c=document.getElementById("c1t-fab");if(!c)return;let u=0,b=!1;for(let x of n){if(!i.has(x.id)||(b=!0,!x.getBadgeCount))continue;let v=x.getBadgeCount(i.get(x.id));v>u&&(u=v)}b?c.classList.add("has-data"):c.classList.remove("has-data"),c.innerHTML=u>0?`\u{1F4CB}<span class="badge">${u}</span>`:"\u{1F4CB}"}return document.addEventListener("keydown",c=>{if(c.key==="Escape"){let u=document.getElementById("c1t-overlay");u&&u.classList.remove("open")}}),{ensureStyles:s,ensureFab:f,ensureOverlay:g,setActiveTab:h,setTabData:y,getActiveTabId:()=>l}}var ot=750,D=4,st=5e3;function U(t){return new Promise(e=>setTimeout(e,t))}function ct(t){if(!t)return null;let e=Number(t);return Number.isFinite(e)&&e>=0?Math.min(e*1e3,3e4):null}async function j(t,e){for(let n=0;n<=D;n++)try{let r=await fetch(t,e);if(r.status!==429)return r;if(n===D)return console.warn("[C1 Tracker] 429 retries exhausted",{url:t}),r;let i=ct(r.headers.get("Retry-After"));if(i==null)try{let p=await r.clone().json();typeof p?.retry_after=="number"&&p.retry_after>=0&&(i=Math.min(p.retry_after*1e3,6e4))}catch{}let a=i??st*Math.pow(2,n),o=Math.floor(Math.random()*500),l=a+o;console.warn("[C1 Tracker] 429 rate-limited; waiting",l,"ms",{attempt:n+1,url:t}),await U(l)}catch(r){return console.warn("[C1 Tracker] fetch threw",r),null}return null}var lt=/(\d+(?:\.\d+)?)X/i,pt=/(\d+(?:\.\d+)?)%/,dt=/\$([\d,]+(?:\.\d+)?)/,ut=/([\d,]+)\s*(miles|points)/i;function I(t){let e=String(t??""),n=e.trim();if(!n)return{type:"unknown",value:0,display:e};let r=n.match(lt);if(r&&r[1]!==void 0)return{type:"multiplier",value:parseFloat(r[1]),display:e};let i=n.match(dt);if(i&&i[1]!==void 0)return{type:"fixed-cash",value:parseFloat(i[1].replace(/,/g,"")),display:e};let a=n.match(ut);if(a&&a[1]!==void 0)return{type:"fixed-points",value:parseFloat(a[1].replace(/,/g,"")),display:e};let o=n.match(pt);return o&&o[1]!==void 0?{type:"percent",value:parseFloat(o[1]),display:e}:{type:"unknown",value:0,display:e}}function F(t){let e=t.stats??{};return e.cashbackV2??e.cashback??e.cashbackAmount??""}function mt(t){if(!t||!t.length)return null;let e=null;for(let n of t){let r=I(n.cashback);r.value>0&&(!e||r.value>e.value)&&(e={type:r.type,value:r.value,display:n.cashback})}return e}function ft(t){switch(t){case"great_deal":return"price-drops";case"event_placement":return"events";case"nca_deal":return"new-customer";case"retarget":case"retarget_non_product":return"recently-viewed";default:return"value"}}function gt(t){if(!t.href)return null;let e=t.merchantName??"",n=t.domain??"";if(!e&&!n)return null;let r=t.stats??{},i=r.isCutType===!0||r.rewardType==="cut",a,o,l;if(i){let d=mt(r.cashbackCategories);if(d){a=d.type,o=d.value;let h=d.display.trim();l=h.toLowerCase().startsWith("up to")?h:"Up to "+h}else{let h=I(F(t));a=h.type,o=h.value,l=h.display.toLowerCase().startsWith("up to")?h.display:h.value?"Up to "+h.display:h.display}}else{let d=I(F(t));a=d.type,o=d.value,l=d.display}let p={method:"href",url:t.href},s=ft(t.type),f=t.id??null;return{id:f!==null?String(f):`shopping|${e||n}|${l}|${t.type}`,source:"shopping",itemType:t.type,merchant:e||n,domain:n||e,rewardType:a,rewardValue:o,rewardDisplay:l,activation:p,bucketCategory:s,pill:t.pill?.text??null,exclusions:r.exclusionsText??"",eventEnd:t.end??null,priceHistory:r.priceHistory??null,raw:t}}function ht(t,e){return`https://capitaloneoffers.com/xhr/feed/${encodeURIComponent(t.userId)}/offers/${e}`}function W(t,e){if(t.type==="Carousel"){let l=t.tiles??[],p=[];for(let s of l)for(let f of W(s,e))p.push(f);return p}let n=t.id,r=t.merchantTLD;if(!n||!r)return[];let i=t.buttonText??"",a=I(i),o=t.subText&&t.headingText?`${t.headingText} \u2014 ${t.subText}`:t.subText??t.headingText??t.text??"";return[{id:n,source:"offers",itemType:t.type,merchant:r,domain:r,rewardType:a.type,rewardValue:a.value,rewardDisplay:a.display,activation:{method:"post-offers",url:ht(e,n)},bucketCategory:"value",pill:t.badge?.text??null,exclusions:o,eventEnd:null,priceHistory:null,raw:t}]}function bt(t){let e=t.rewardValue;switch(t.rewardType){case"multiplier":return e>=30?"mult-30":e>=20?"mult-20":e>=10?"mult-10":"mult-1";case"percent":case"cut":return e>=40?"pct-40":e>=20?"pct-20":e>=10?"pct-10":"pct-1";case"fixed-cash":return e>=50?"cash-50":e>=25?"cash-25":"cash-0";case"fixed-points":return e>=1e4?"pts-10k":e>=5e3?"pts-5k":e>=1e3?"pts-1k":"pts-lt-1k";case"unknown":default:return"pct-1"}}var z=[{id:"mult-30",label:"Multipliers \xB7 30X+",group:"multiplier",initiallyOpen:!0},{id:"mult-20",label:"Multipliers \xB7 20\u201329X",group:"multiplier",initiallyOpen:!0},{id:"mult-10",label:"Multipliers \xB7 10\u201319X",group:"multiplier",initiallyOpen:!1},{id:"mult-1",label:"Multipliers \xB7 1\u20139X",group:"multiplier",initiallyOpen:!1},{id:"pct-40",label:"Percent \xB7 40%+",group:"percent",initiallyOpen:!0},{id:"pct-20",label:"Percent \xB7 20\u201339%",group:"percent",initiallyOpen:!0},{id:"pct-10",label:"Percent \xB7 10\u201319%",group:"percent",initiallyOpen:!1},{id:"pct-1",label:"Percent \xB7 1\u20139%",group:"percent",initiallyOpen:!1},{id:"cash-50",label:"Fixed Cash \xB7 $50+",group:"fixed-cash",initiallyOpen:!0},{id:"cash-25",label:"Fixed Cash \xB7 $25\u201349",group:"fixed-cash",initiallyOpen:!0},{id:"cash-0",label:"Fixed Cash \xB7 under $25",group:"fixed-cash",initiallyOpen:!1},{id:"pts-10k",label:"Fixed Points \xB7 10,000+",group:"fixed-points",initiallyOpen:!0},{id:"pts-5k",label:"Fixed Points \xB7 5,000\u20139,999",group:"fixed-points",initiallyOpen:!0},{id:"pts-1k",label:"Fixed Points \xB7 1,000\u20134,999",group:"fixed-points",initiallyOpen:!1},{id:"pts-lt-1k",label:"Fixed Points \xB7 under 1,000",group:"fixed-points",initiallyOpen:!1}],N=(()=>{let t={};for(let e of z)t[e.id]=e;return t})();function R(t){let e={};for(let a of t){let o=bt(a);(e[o]??(e[o]=[])).push(a)}for(let a of Object.keys(e))e[a].sort((o,l)=>l.rewardValue-o.rewardValue);let n=[],r={};for(let a of z){let o=e[a.id];o&&o.length&&(n.push(a.id),r[a.id]=o.length)}let i={total:t.length,byBucket:r};return{offers:t,buckets:e,bucketOrder:n,stats:i}}async function q(t){let e=t.maxPages??40,n=new Set,r=[],i=null,a=0;for(;a<e;){a>0&&await U(ot);let o=await t.fetchPage(i);if(!o)break;for(let p of t.getItems(o)){let s=t.dedupeKey(p);s&&n.has(s)||(s&&n.add(s),r.push(p))}a++,t.onPage?.(a,r.length);let l=t.getNextCursor(o);if(!l)break;i=l}return{items:r,hitCap:a>=e,pagesWalked:a}}function xt(t){let e={limit:25};return t&&(e.nextPageToken=t),JSON.stringify({contentProps:{pagination:e},context:{device:{model:typeof navigator<"u"&&/Mac/.test(navigator.platform)?"Macintosh":"Unknown",manufacturer:"Unknown",memory:"8",concurrency:String(typeof navigator<"u"&&navigator.hardwareConcurrency||4)},browser:{name:"Chrome",version:"0",major:"0"},os:{name:"unknown",version:"0"},screen:{width:1920,height:1080,density:2},locale:typeof navigator<"u"&&navigator.language?navigator.language:"en-US",country:"US",location:{state:"",zipcode:"",latitude:null,longitude:null,isInCensusData:!1},page:{path:typeof window<"u"?window.location.pathname:"/",url:typeof window<"u"?window.location.href:"",referrer:typeof document<"u"?document.referrer:"",search:typeof window<"u"?window.location.search:"",title:typeof document<"u"?document.title:""},userAgent:typeof navigator<"u"?navigator.userAgent:""}})}function yt(t){let e=t;if(e.id!==void 0&&e.id!==null&&e.id!=="")return String(e.id);let n=t.merchantName??"",r=t.stats?.cashbackV2??t.stats?.cashback??"";return!n&&!r?null:`${n}|${r}|${t.type}`}async function G(t){let e={fetchPage:async a=>{let o=await j("/api/v1/feed",{method:"POST",credentials:"include",headers:{"Content-Type":"application/json"},body:xt(a)});if(!o||!o.ok)return console.warn("[C1 Tracker] shopping feed POST failed",{status:o?.status,statusText:o?.statusText,cursor:a}),null;let l=await o.json();return a||console.log("[C1 Tracker] shopping feed first page",{count:l.count,itemCount:l.items?.length??0,nextPageToken:l.pagination?.nextPageToken}),l},getNextCursor:a=>a.pagination?.nextPageToken??null,getItems:a=>a.items??[],dedupeKey:yt,...t?{onPage:t}:{},maxPages:40},n=await q(e),r=[],i=0;for(let a of n.items){let o=gt(a);o?r.push(o):i++}return console.log("[C1 Tracker] shopping walk done",{rawItems:n.items.length,normalized:r.length,droppedDuringNormalize:i,pagesWalked:n.pagesWalked,hitCap:n.hitCap}),{items:r,hitCap:n.hitCap,pagesWalked:n.pagesWalked}}function wt(t,e){let n=`https://capitaloneoffers.com/feed/${encodeURIComponent(t.userId)}`,r=`?numberOfColumnsInGrid=5&viewInstanceId=${t.viewInstanceId}&contentSlug=ease-web-l1`;return e?`${n}${r}&cursor=${e}`:`${n}${r}`}function kt(t){let e=t.merchantTLD??"",n=t.buttonText??"";return e&&n?`${e}|${n}`:t.id??null}function vt(t){let e=[];for(let n of t)if(n.type==="Carousel")for(let r of n.tiles??[])e.push(r);else e.push(n);return e}async function X(t,e){let n={fetchPage:async a=>{let o=await j(wt(t,a),{method:"GET",credentials:"include",headers:{Accept:"application/json"}});return!o||!o.ok?(console.warn("[C1 Tracker] offers feed GET failed",{status:o?.status,statusText:o?.statusText,cursor:a}),null):await o.json()},getNextCursor:a=>a.cursor??null,getItems:a=>vt(a.data??[]),dedupeKey:kt,...e?{onPage:e}:{},maxPages:40},r=await q(n),i=[];for(let a of r.items)for(let o of W(a,t))i.push(o);return{items:i,hitCap:r.hitCap,pagesWalked:r.pagesWalked}}function S(t,e,n=0){if(n>6||t===null||typeof t!="object")return null;let r=t;for(let i of e){let a=r[i];if(typeof a=="string"&&a.length>0)return a}for(let i of Object.keys(r)){let a=r[i];if(a&&typeof a=="object"){let o=S(a,e,n+1);if(o)return o}}return null}function H(t){let e=new RegExp(`\\\\?"${t}\\\\?"\\s*,\\s*\\\\?"([^"\\\\]+)\\\\?"`),n=document.getElementsByTagName("script");for(let r=0;r<n.length;r++){let i=n[r].textContent;if(!i||i.indexOf(t)<0)continue;let a=i.match(e);if(a&&a[1])return a[1]}return null}function Tt(){let t=null,e=null;try{e=new URLSearchParams(window.location.search).get("viewInstanceId")}catch{}let n=window.location.pathname.match(/^\/feed\/([^/?#]+)/);if(n&&n[1]&&(t=decodeURIComponent(n[1])),t||(t=H("maybeSelectedArid")),e||(e=H("viewInstanceId")),!t||!e)try{let r=document.getElementById("__NEXT_DATA__");if(r?.textContent){let i=JSON.parse(r.textContent);t||(t=S(i,["userId","accountReferenceId"])),e||(e=S(i,["viewInstanceId"]))}}catch{}if(!e&&t)try{typeof crypto<"u"&&typeof crypto.randomUUID=="function"&&(e=crypto.randomUUID())}catch{}return t&&e?{userId:t,viewInstanceId:e}:(console.warn("[C1 Tracker] getOffersBrowseContext (sync) failed",{pathname:window.location.pathname,search:window.location.search,userId:t,viewInstanceId:e,hasNextData:!!document.getElementById("__NEXT_DATA__")}),null)}async function V(){let t=Tt();if(t)return t;let e=null,n=null;try{n=new URLSearchParams(window.location.search).get("viewInstanceId")}catch{}try{let r=await fetch("/xhr/shopping-trips?limit=1&offset=0&status[]=Activated&status[]=Adjusted&status[]=Completed&status[]=Inactive&status[]=Ineligible&status[]=Pending&status[]=Waiting",{method:"POST",credentials:"include"});if(r.ok){let a=(await r.json())?.data?.[0];a&&typeof a.accountReferenceId=="string"&&(e=a.accountReferenceId)}}catch(r){console.warn("[C1 Tracker] trips-API fallback for userId failed:",r)}if(!n&&e)try{typeof crypto<"u"&&typeof crypto.randomUUID=="function"&&(n=crypto.randomUUID())}catch{}return e&&n?{userId:e,viewInstanceId:n}:(console.warn("[C1 Tracker] fetchOffersBrowseContext failed",{userId:e,viewInstanceId:n}),null)}function It(t,e){return e==="events"?"event":e==="price-drops"?"deal":e==="new-customer"?"new":e==="recently-viewed"?"retarget":t==="great_deal"?"deal":""}function Ct(t){return`${t.merchant} ${t.domain} ${t.rewardDisplay} ${t.itemType} ${t.exclusions}`.toLowerCase()}function Et(t){if(!t)return"";try{return new Date(t).toLocaleDateString(void 0,{month:"short",day:"numeric"})}catch{return""}}function St(t,e){let n=e.map(i=>{let a=m(Ct(i)),o=i.pill?`<span class="c1t-pill ${It(i.itemType,i.bucketCategory)}">${m(i.pill)}</span>`:"",l=i.eventEnd?`<span class="c1t-event-end">ends ${m(Et(i.eventEnd))}</span>`:"",p=i.exclusions??"",s=p?` title="${m(p)}"`:"",f=p?m(p):"",g=p.length>60,d=f?g?`<div class="c1t-excl-cell"${s}>
                       <span class="c1t-excl-text">${f}</span><button type="button" class="c1t-excl-toggle">(more)</button>
                   </div>`:`<div class="c1t-excl-cell"${s}><span class="c1t-excl-text">${f}</span></div>`:"";return`<tr class="c1t-row-click"
            data-merchant="${m(i.merchant)}"
            data-bucket-id="${m(t.id)}"
            data-search="${a}"
            data-method="${m(i.activation.method)}"
            data-activation-url="${m(i.activation.url)}">
            <td>${m(i.merchant)}</td>
            <td><span class="c1t-reward">${m(i.rewardDisplay)}</span></td>
            <td>${o}</td>
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
    </details>`}function Rt(t){switch(t){case"multiplier":return"Multipliers";case"percent":return"Percent";case"fixed-cash":return"Cash";case"fixed-points":return"Points"}}function Ot(t){let e=[],n=new Set;for(let r of t.bucketOrder){let i=N[r];i&&(n.has(i.group)||(n.add(i.group),e.push(`<button class="c1t-jump-chip" data-jump-to="${i.id}">${m(Rt(i.group))}</button>`)))}return e.join("")}function $t(t){let e=t.dataset.activationUrl;e&&window.open(e,"_blank","noopener")}async function At(t){let e=t.dataset.activationUrl;if(!e)return;let n=t.dataset.merchant??"merchant",r=window.open("about:blank","_blank");try{let i=await fetch(e,{method:"POST",credentials:"include"});if(!i.ok)throw new Error(`Activation returned ${i.status}`);let a=await i.json(),o=a?.offer?a.offer:a,l=o?.affiliate?.redirectUrl;if(l&&r){r.location=l;return}let p=o?.cardLinked?.cardLinkedOfferDetail;if(o?.cardLinked&&p?.isActivated){r?.close?.(),alert(`${n} card-linked offer activated. Use your card as usual \u2014 no redirect needed.`);return}if(o?.cardLinked?.cardLinkedOfferDetail?.activationLimitsReached){r?.close?.(),alert("Card-linked activation limit reached \u2014 cancel an existing activation and try again.");return}console.warn("[C1 Tracker] Activation POST returned detail shape (no redirectUrl)",o),r?.close?.(),alert("Activation failed \u2014 response had no redirect and no card-linked activation.")}catch(i){r?.close?.(),alert("Activation failed: "+(i instanceof Error?i.message:String(i)))}}function Lt(t){t.addEventListener("click",e=>{let n=e.target;if(!n)return;let r=n.closest(".c1t-excl-toggle");if(r){e.stopPropagation(),e.preventDefault();let a=r.closest(".c1t-excl-cell");if(a){let o=a.classList.toggle("c1t-excl-expanded");r.textContent=o?"(less)":"(more)"}return}let i=n.closest("tr[data-method]");i&&(i.dataset.method==="href"?$t(i):i.dataset.method==="post-offers"&&At(i))})}function Pt(t){let e=t.querySelector("#c1t-browse-search input"),n=t.querySelector("#c1t-browse-search button");if(!e)return;let r=new Map;t.querySelectorAll("details[data-bucket-id]").forEach(o=>{let l=o,p=l.dataset.bucketId??"";r.set(p,l.open)});let i=null,a=o=>{let l=o.trim().toLowerCase(),p=l.length===0;t.querySelectorAll("details[data-bucket-id]").forEach(f=>{let g=f,d=g.dataset.bucketId??"",h=g.querySelectorAll("tr[data-search]"),y=0;h.forEach(k=>{let c=k.dataset.search??"",u=p||c.includes(l);k.style.display=u?"":"none",u&&y++}),y===0&&!p?g.style.display="none":(g.style.display="",p?g.open=r.get(d)??!1:g.open=!0)})};e.addEventListener("input",()=>{i&&clearTimeout(i),i=setTimeout(()=>a(e.value),100)}),n&&n.addEventListener("click",()=>{e.value="",a("")})}function Mt(t){let e=t.querySelector("#c1t-browse-nav");e&&e.addEventListener("click",n=>{let r=n.target;if(!r)return;let i=r.closest("[data-jump-to]");if(!i)return;let a=i.dataset.jumpTo;if(!a)return;let o=t.querySelector(`details[data-bucket-id="${a}"]`);o&&(o.open=!0,o.scrollIntoView({behavior:"smooth",block:"start"}))})}var K=(t,e)=>{let n=t.querySelector("#c1t-content");if(!n)return;let r=e.bucketOrder.map(l=>{let p=N[l];if(!p)return"";let s=e.buckets[l];return!s||!s.length?"":St(p,s)}).join(""),i=Ot(e),a=e.stats.hitCap?`Stopped at ${e.stats.total} items (max pages reached)`:`${e.stats.total} offers across ${e.bucketOrder.length} buckets`;n.innerHTML=`
        <div id="c1t-browse-search">
            <input type="search" placeholder="Search merchant / reward / type..." />
            <button type="button">Clear</button>
        </div>
        <div id="c1t-browse-nav">${i}</div>
        <div id="c1t-browse-stats">${m(a)}</div>
        <div id="c1t-browse-body">${r||'<div style="padding:40px;text-align:center;opacity:0.7;">No offers found.</div>'}</div>
        <div id="c1t-browse-footer">Click a row to activate. Shopping rows open the pre-signed href; offers rows POST then redirect.</div>
    `;let o=n.querySelector("#c1t-browse-body");o&&Lt(o),Pt(n),Mt(n)};(async function(){"use strict";let t=E();if(!t){alert("Please run this on capitaloneshopping.com or capitaloneoffers.com");return}let n=A()==="browse"?"browse":"trips";if(document.getElementById("c1t-fab")){document.getElementById("c1t-overlay")?.classList.add("open");return}console.log("[C1 Tracker Bookmarklet] Running on",t,"defaultTab=",n);let r;function i(p,s,f){if(!r)return;let d=T(f==="data"?{data:p}:{items:p});d.stats.isLoading=!0,d.stats.loadingText=`Loading page ${s} (${d.stats.total} trips)`,r.setTabData("trips",d)}async function a(){return t==="shopping"?T(await M({onProgress:(p,s)=>i(p,s,"items")})):T(await P({onProgress:(p,s)=>i(p,s,"data")}))}async function o(){let p=(d,h)=>{let y=document.querySelector("#c1t-loading");y&&(y.textContent=`Loaded ${d} pages, ${h} offers...`)};if(t==="shopping"){let d=await G(p),h=R(d.items);return h.stats.hitCap=d.hitCap,h.stats.pagesWalked=d.pagesWalked,h}let s=await V();if(!s)throw new Error("Could not capture offers feed context (userId + viewInstanceId). Open DevTools console for diagnostics. The URL should look like /feed/<userId>?viewInstanceId=<uuid>. Try clicking into the feed grid once, then re-run.");let f=await X(s,p),g=R(f.items);return g.stats.hitCap=f.hitCap,g.stats.pagesWalked=f.pagesWalked,g}r=_({title:`${t==="offers"?"Cap One Offers":"Cap One Shopping"} Tracker`,defaultTabId:n,tabs:[{id:"trips",label:"Trips",render:B,getBadgeCount:p=>p?.stats?.withCredit??0,onActivate:a,loadingText:"Fetching shopping trips data..."},{id:"browse",label:"Browse",render:K,onActivate:o,loadingText:"Walking offers feed... (0 pages)"}]}),r.ensureFab(),r.ensureOverlay(),document.getElementById("c1t-overlay")?.classList.add("open"),r.setActiveTab(n)})();})();
