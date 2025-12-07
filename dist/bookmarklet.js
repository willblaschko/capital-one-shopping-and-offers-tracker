(()=>{function x(){return window.location.hostname.includes("capitaloneoffers")?"offers":window.location.hostname.includes("capitaloneshopping")?"shopping":null}function w(t){return t?Array.isArray(t)?t:Array.isArray(t.items)?t.items:Array.isArray(t.shoppingTrips)?t.shoppingTrips:Array.isArray(t.trip_orders)?t.trip_orders:t.data&&Array.isArray(t.data)?t.data:t.data?.items&&Array.isArray(t.data.items)?t.data.items:[]:[]}function A(t){let r=t.orderAmount??t.order_amount??null,i=t.creditAmount??t.credit_amount??null,o=t.orderId??t.order_id??null,l=i!==null&&Number(i)>0,p=t.status??"Unknown",s=p;return l&&p.toLowerCase()==="canceled"?s="Completed":p.toLowerCase()==="pending"&&(s=l?"Pending \u2713":"Pending ?"),{id:t.id??t.tripId??null,tripId:t.tripId??t.trip_id??t.id??null,orderId:o,merchant:t.vendor??t.merchantName??t.merchant??"Unknown",domain:t.domain??null,status:s,rawStatus:p,orderAmount:r!==null?Number(r):null,creditAmount:i!==null?Number(i):null,date:t.createdAt??t.created_at??t.clickDate??null,hasOrderId:o!==null,hasAmount:r!==null&&Number(r)>0,hasCreditAmount:l,raw:t}}function y(t){let i=w(t).map(A);return{trips:i,stats:{total:i.length,withOrderId:i.filter(o=>o.hasOrderId).length,withAmount:i.filter(o=>o.hasAmount).length,withCredit:i.filter(o=>o.hasCreditAmount).length,pending:i.filter(o=>o.status.toLowerCase().includes("pending")).length,created:i.filter(o=>o.status.toLowerCase()==="created").length}}}var C=`
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
`;function b(t){return t==null||t===0?"\u2014":"$"+Number(t).toFixed(2)}function E(t){if(!t)return"\u2014";try{return new Date(t).toLocaleDateString()}catch{return"\u2014"}}function h(t){if(t==null)return"";let r=document.createElement("div");return r.textContent=String(t),r.innerHTML}function I(t){let r=(t||"").toLowerCase();return r.includes("completed")?"completed":r==="pending \u2713"?"pending-good":r==="pending ?"||r.includes("pending")?"pending-uncertain":r.includes("created")?"created":r.includes("cancel")?"canceled":r.includes("adjust")?"adjusted":""}function v({onOpen:t,processedData:r}){let i=!1;function o(){if(i&&document.getElementById("c1t-styles"))return;let n=document.getElementById("c1t-styles");n||(n=document.createElement("style"),n.id="c1t-styles",n.textContent=C,(document.head||document.documentElement).appendChild(n)),i=!0}function l(){o();let n=document.getElementById("c1t-fab");return n||(n=document.createElement("button"),n.id="c1t-fab",n.innerHTML="\u{1F4CB}",n.title="Shopping Trips Tracker",n.addEventListener("click",()=>{t&&t(),p();let a=document.getElementById("c1t-overlay");a&&a.classList.add("open")}),document.body.appendChild(n),r&&s(n,r),n)}function p(){o();let n=document.getElementById("c1t-overlay");return n||(n=document.createElement("div"),n.id="c1t-overlay",n.innerHTML=`
            <div id="c1t-modal">
                <div id="c1t-header">
                    <h2>\u{1F4CB} Shopping Trips Tracker</h2>
                    <button id="c1t-close">\u2715</button>
                </div>
                <div id="c1t-content">
                    <div id="c1t-loading">Waiting for data... Navigate to Shopping Trips page and data will load automatically.</div>
                </div>
            </div>
        `,document.body.appendChild(n),n.querySelector("#c1t-close").addEventListener("click",()=>n.classList.remove("open")),n.addEventListener("click",a=>{a.target===n&&n.classList.remove("open")}),r&&c(n,r),n)}function s(n,a){a&&(n.classList.add("has-data"),a.stats.withCredit>0?n.innerHTML=`\u{1F4CB}<span class="badge">${a.stats.withCredit}</span>`:n.innerHTML="\u{1F4CB}")}function c(n,a){if(!a)return;let{trips:m,stats:d}=a,f=n.querySelector("#c1t-content");f&&(f.innerHTML=`
            <div id="c1t-stats">
                <span class="stat"><strong>${d.total}</strong> total</span>
                <span class="stat"><strong>${d.withOrderId}</strong> tracked</span>
                <span class="stat"><strong>${d.withAmount}</strong> with amount</span>
                <span class="stat"><strong>${d.withCredit}</strong> with cashback</span>
            </div>
            <div id="c1t-filters">
                <button class="c1t-filter-btn active" data-filter="all">All (${d.total})</button>
                <button class="c1t-filter-btn" data-filter="amount">With Amount (${d.withAmount})</button>
                <button class="c1t-filter-btn" data-filter="tracked">Tracked (${d.withOrderId})</button>
                <button class="c1t-filter-btn" data-filter="pending">Pending (${d.pending})</button>
                <button class="c1t-filter-btn" data-filter="created">Waiting (${d.created})</button>
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
                        ${m.map(e=>{let g=e.hasCreditAmount?"amt":e.hasOrderId?"tracked":"",u=I(e.status);return`
                                <tr class="${g}" data-filter-amount="${e.hasAmount}" data-filter-tracked="${e.hasOrderId}" data-filter-pending="${e.status.toLowerCase().includes("pending")}" data-filter-created="${e.status.toLowerCase()==="created"}">
                                    <td title="${h(e.domain)}">${h(e.merchant)}</td>
                                    <td class="c">${E(e.date)}</td>
                                    <td class="r ${e.hasAmount?"c1t-amount":""}">${b(e.orderAmount)}</td>
                                    <td class="r ${e.hasCreditAmount?"c1t-credit":""}">${b(e.creditAmount)}</td>
                                    <td class="c"><span class="c1t-status ${u}">${h(e.status)}</span></td>
                                    <td class="c">${e.hasOrderId?"\u2713":"\u2014"}</td>
                                </tr>
                            `}).join("")}
                    </tbody>
                </table>
            </div>
            <div id="c1t-footer">
                <details>
                    <summary>Show Raw JSON</summary>
                    <pre>${h(JSON.stringify(m.slice(0,30).map(e=>e.raw),null,2))}${m.length>30?`

... and `+(m.length-30)+" more":""}</pre>
                </details>
            </div>
        `,f.querySelectorAll(".c1t-filter-btn").forEach(e=>{e.addEventListener("click",function(){f.querySelectorAll(".c1t-filter-btn").forEach(u=>u.classList.remove("active")),this.classList.add("active");let g=this.dataset.filter;f.querySelectorAll("#c1t-tbody tr").forEach(u=>{if(g==="all")u.style.display="";else{let k=`filter${g.charAt(0).toUpperCase()+g.slice(1)}`;u.style.display=u.dataset[k]==="true"?"":"none"}})})}))}return document.addEventListener("keydown",n=>{if(n.key==="Escape"){let a=document.getElementById("c1t-overlay");a&&a.classList.remove("open")}}),{ensureStyles:o,ensureFab:l,ensureOverlay:p,updateFabState:s,renderDataToModal:c,updateData(n){r=n;let a=document.getElementById("c1t-fab");a&&s(a,n);let m=document.getElementById("c1t-overlay");m&&c(m,n)}}}(async function(){"use strict";let t=x();if(!t){alert("Please run this on capitaloneshopping.com or capitaloneoffers.com");return}if(document.getElementById("c1t-fab")){let p=document.getElementById("c1t-overlay");p&&p.classList.add("open");return}console.log("[C1 Tracker Bookmarklet] Running on",t);let r=null,i=v({processedData:null,onOpen:()=>{r||l()}});i.ensureFab(),i.ensureOverlay();let o=document.getElementById("c1t-overlay");o&&o.classList.add("open");async function l(){let p=document.querySelector("#c1t-content");p&&(p.innerHTML='<div id="c1t-loading">Fetching shopping trips data...</div>');try{let s;if(t==="shopping"){let c=await fetch("/api/v1/trip_orders",{credentials:"include"});if(!c.ok)throw new Error(`API returned ${c.status}`);s=await c.json()}else{let c=await fetch("/api/shopping-trips?version=2",{credentials:"include"});if(c.ok)s=await c.json();else{let n=await fetch("/shopping-trips?_data=routes%2Fshopping-trips&version=2",{credentials:"include"});if(!n.ok)throw new Error("Could not fetch data. Navigate to Shopping Trips page and try again.");s=await n.json()}}console.log("[C1 Tracker Bookmarklet] Fetched data:",s),r=y(s),console.log("[C1 Tracker Bookmarklet] Processed:",r.stats),i.updateData(r)}catch(s){console.error("[C1 Tracker Bookmarklet] Error:",s),p&&(p.innerHTML=`
                    <div id="c1t-loading">
                        <p>Error fetching data: ${s.message}</p>
                        <p style="margin-top: 10px; font-size: 12px; opacity: 0.8;">
                            Make sure you're logged in and try navigating to the Shopping Trips page first.
                        </p>
                    </div>
                `)}}l()})();})();
