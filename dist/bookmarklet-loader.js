"use strict";(()=>{function i(o,n){let e=o.includes("capitaloneshopping"),t=o.includes("capitaloneoffers");return!e&&!t?!1:!!(e&&n.startsWith("/account-settings/shopping-trips")||t&&n.startsWith("/c1-offers/shopping-trips")||e&&(n==="/"||n==="")||t&&n.startsWith("/feed"))}(function(){if(typeof document>"u"||typeof window>"u"||typeof alert!="function")return;if(document.getElementById("c1t-fab")){let t=document.getElementById("c1t-overlay");t&&t.classList.add("open");return}let o=window.location.hostname,n=window.location.pathname;if(!i(o,n)){alert(`Please run this on a Capital One Shopping or Offers page:

Trips:
  capitaloneshopping.com/account-settings/shopping-trips
  capitaloneoffers.com/c1-offers/shopping-trips

Browse:
  capitaloneshopping.com/
  capitaloneoffers.com/feed`);return}let e=document.createElement("script");e.src="https://willblaschko.github.io/capital-one-shopping-and-offers-tracker/bookmarklet-full.js",e.onerror=function(){alert("Failed to load tracker script. Check your internet connection.")},document.body.appendChild(e)})();})();
