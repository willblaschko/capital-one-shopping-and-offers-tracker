(()=>{var x={offers:{hostname:"capitaloneoffers",pagePath:"/c1-offers/shopping-trips",apiPattern:t=>t.includes("shopping-trips")&&t.includes("version=2")&&t.includes("_data="),apiEndpoint:null},shopping:{hostname:"capitaloneshopping",pagePath:"/account-settings/shopping-trips",apiPattern:t=>t.includes("/api/v1/trip_orders"),apiEndpoint:"/api/v1/trip_orders"}};function y(){return window.location.hostname.includes("capitaloneoffers")?"offers":window.location.hostname.includes("capitaloneshopping")?"shopping":null}function k(){let t=y();return t?window.location.pathname.startsWith(x[t].pagePath):!1}function T(t){return t?Array.isArray(t)?t:Array.isArray(t.items)?t.items:Array.isArray(t.shoppingTrips)?t.shoppingTrips:Array.isArray(t.trip_orders)?t.trip_orders:t.data&&Array.isArray(t.data)?t.data:t.data?.items&&Array.isArray(t.data.items)?t.data.items:[]:[]}function I(t){let r=t.orderAmount??t.order_amount??(t.trxnTotalCents!=null?t.trxnTotalCents/100:null),s=t.creditAmount??t.credit_amount??(t.payoutAmountCents!=null?t.payoutAmountCents/100:null),n=t.orderId??t.order_id??null,d=s!==null&&Number(s)>0,i=t.status??"Unknown";i==="Waiting"?i="Created":i==="Inactive"&&(i="Canceled");let p=i;return d&&i.toLowerCase()==="canceled"?p="Completed":i.toLowerCase()==="pending"&&(p=d?"Pending \u2713":"Pending ?"),{id:t.id??t.tripId??t.activatedOfferId??null,tripId:t.tripId??t.trip_id??t.id??t.activatedOfferId??null,orderId:n,merchant:t.vendor??t.merchantName??t.merchantDisplayName??t.merchant??t.domain??"Unknown",domain:t.domain??null,status:p,rawStatus:i,orderAmount:r!==null?Number(r):null,creditAmount:s!==null?Number(s):null,date:t.createdAt??t.created_at??t.clickDate??t.date??null,hasOrderId:n!==null,hasAmount:r!==null&&Number(r)>0,hasCreditAmount:d,raw:t}}function w(t){let s=T(t).map(I);return{trips:s,stats:{total:s.length,withOrderId:s.filter(n=>n.hasOrderId).length,withAmount:s.filter(n=>n.hasAmount).length,withCredit:s.filter(n=>n.hasCreditAmount).length,pending:s.filter(n=>n.status.toLowerCase().includes("pending")).length,created:s.filter(n=>n.status.toLowerCase()==="created").length}}}var $=`
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
`;function v(t){return t==null||t===0?"\u2014":"$"+Number(t).toFixed(2)}function S(t){if(!t)return"\u2014";try{return new Date(t).toLocaleDateString()}catch{return"\u2014"}}function b(t){if(t==null)return"";let r=document.createElement("div");return r.textContent=String(t),r.innerHTML}function E(t){let r=(t||"").toLowerCase();return r.includes("completed")?"completed":r==="pending \u2713"?"pending-good":r==="pending ?"||r.includes("pending")?"pending-uncertain":r.includes("created")?"created":r.includes("cancel")?"canceled":r.includes("adjust")?"adjusted":""}function C({onOpen:t,processedData:r}){let s=!1,n=r;function d(){if(s&&document.getElementById("c1t-styles"))return;let e=document.getElementById("c1t-styles");e||(e=document.createElement("style"),e.id="c1t-styles",e.textContent=$,(document.head||document.documentElement).appendChild(e)),s=!0}function i(){d();let e=document.getElementById("c1t-fab");return e||(e=document.createElement("button"),e.id="c1t-fab",e.innerHTML="\u{1F4CB}",e.title="Shopping Trips Tracker",e.addEventListener("click",async()=>{p();let a=document.getElementById("c1t-overlay");a&&a.classList.add("open"),!n&&t&&(await t(),n&&h(a,n))}),document.body.appendChild(e),n&&c(e,n),e)}function p(){d();let e=document.getElementById("c1t-overlay"),a=!1;return console.log("[C1 Tracker] ensureOverlay - existing:",!!e,"currentData:",!!n,"stats:",n?.stats),e||(a=!0,e=document.createElement("div"),e.id="c1t-overlay",e.innerHTML=`
                <div id="c1t-modal">
                    <div id="c1t-header">
                        <h2>\u{1F4CB} Shopping Trips Tracker</h2>
                        <button id="c1t-close">\u2715</button>
                    </div>
                    <div id="c1t-content">
                        <div id="c1t-loading">Waiting for data... Navigate to Shopping Trips page and data will load automatically.</div>
                    </div>
                </div>
            `,document.body.appendChild(e),e.querySelector("#c1t-close").addEventListener("click",()=>e.classList.remove("open")),e.addEventListener("click",l=>{l.target===e&&e.classList.remove("open")})),console.log("[C1 Tracker] ensureOverlay - isNew:",a,"currentData:",!!n,"stats:",n?.stats),n&&h(e,n),e}function c(e,a){a&&(e.classList.add("has-data"),a.stats.withCredit>0?e.innerHTML=`\u{1F4CB}<span class="badge">${a.stats.withCredit}</span>`:e.innerHTML="\u{1F4CB}")}function h(e,a){if(console.log("[C1 Tracker] renderDataToModal called - data:",!!a,"overlay:",!!e),!a)return;let{trips:l,stats:m}=a,f=e.querySelector("#c1t-content");console.log("[C1 Tracker] renderDataToModal - content element:",!!f,"trips:",l?.length),f&&(f.innerHTML=`
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
                        ${l.map(o=>{let g=o.hasCreditAmount?"amt":o.hasOrderId?"tracked":"",u=E(o.status);return`
                                <tr class="${g}" data-filter-amount="${o.hasAmount}" data-filter-tracked="${o.hasOrderId}" data-filter-pending="${o.status.toLowerCase().includes("pending")}" data-filter-created="${o.status.toLowerCase()==="created"}">
                                    <td title="${b(o.domain)}">${b(o.merchant)}</td>
                                    <td class="c">${S(o.date)}</td>
                                    <td class="r ${o.hasAmount?"c1t-amount":""}">${v(o.orderAmount)}</td>
                                    <td class="r ${o.hasCreditAmount?"c1t-credit":""}">${v(o.creditAmount)}</td>
                                    <td class="c"><span class="c1t-status ${u}">${b(o.status)}</span></td>
                                    <td class="c">${o.hasOrderId?"\u2713":"\u2014"}</td>
                                </tr>
                            `}).join("")}
                    </tbody>
                </table>
            </div>
            <div id="c1t-footer">
                <details>
                    <summary>Show Raw JSON</summary>
                    <pre>${b(JSON.stringify(l.slice(0,30).map(o=>o.raw),null,2))}${l.length>30?`

... and `+(l.length-30)+" more":""}</pre>
                </details>
            </div>
        `,f.querySelectorAll(".c1t-filter-btn").forEach(o=>{o.addEventListener("click",function(){f.querySelectorAll(".c1t-filter-btn").forEach(u=>u.classList.remove("active")),this.classList.add("active");let g=this.dataset.filter;f.querySelectorAll("#c1t-tbody tr").forEach(u=>{if(g==="all")u.style.display="";else{let A=`filter${g.charAt(0).toUpperCase()+g.slice(1)}`;u.style.display=u.dataset[A]==="true"?"":"none"}})})}))}return document.addEventListener("keydown",e=>{if(e.key==="Escape"){let a=document.getElementById("c1t-overlay");a&&a.classList.remove("open")}}),{ensureStyles:d,ensureFab:i,ensureOverlay:p,updateFabState:c,renderDataToModal:h,updateData(e){console.log("[C1 Tracker] updateData called with stats:",e?.stats),n=e;let a=document.getElementById("c1t-fab");a&&c(a,e);let l=document.getElementById("c1t-overlay");l&&h(l,e)}}}(async function(){"use strict";let t=y();if(!t){alert("Please run this on capitaloneshopping.com or capitaloneoffers.com");return}if(!k()){let i=x[t].pagePath;alert(`Please navigate to the Shopping Trips page first:
${window.location.origin}${i}`);return}if(document.getElementById("c1t-fab")){let i=document.getElementById("c1t-overlay");i&&i.classList.add("open");return}console.log("[C1 Tracker Bookmarklet] Running on",t);let r=null,s=C({processedData:null,onOpen:()=>{r||d()}});s.ensureFab(),s.ensureOverlay();let n=document.getElementById("c1t-overlay");n&&n.classList.add("open");async function d(){let i=document.querySelector("#c1t-content");i&&(i.innerHTML='<div id="c1t-loading">Fetching shopping trips data...</div>');try{let p;if(t==="shopping"){let c=await fetch("/api/v1/trip_orders",{credentials:"include"});if(!c.ok)throw new Error(`API returned ${c.status}`);p=await c.json()}else{let c=await fetch("/c1-offers/shopping-trips?limit=300&offset=0&version=2&_data=routes%2Fc1-offers.shopping-trips",{method:"POST",credentials:"include"});if(!c.ok)throw new Error(`API returned ${c.status}`);p=await c.json()}console.log("[C1 Tracker Bookmarklet] Fetched data:",p),r=w(p),console.log("[C1 Tracker Bookmarklet] Processed:",r.stats),s.updateData(r)}catch(p){console.error("[C1 Tracker Bookmarklet] Error:",p),i&&(i.innerHTML=`
                    <div id="c1t-loading">
                        <p>Error fetching data: ${p.message}</p>
                        <p style="margin-top: 10px; font-size: 12px; opacity: 0.8;">
                            Make sure you're logged in and try navigating to the Shopping Trips page first.
                        </p>
                    </div>
                `)}}d()})();})();
