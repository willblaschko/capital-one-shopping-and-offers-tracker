"use strict";(()=>{function i(o,n){let t=o.includes("capitaloneshopping"),e=o.includes("capitaloneoffers");return!t&&!e?!1:!!(t&&n.startsWith("/account-settings/shopping-trips")||e&&n.startsWith("/shopping-trips")||t&&(n==="/"||n==="")||e&&n.startsWith("/feed"))}(function(){if(typeof document>"u"||typeof window>"u"||typeof alert!="function")return;if(document.getElementById("c1t-fab")){let e=document.getElementById("c1t-overlay");e&&e.classList.add("open");return}let o=window.location.hostname,n=window.location.pathname;if(!i(o,n)){alert(`Please run this on a Capital One Shopping or Offers page:

Trips:
  capitaloneshopping.com/account-settings/shopping-trips
  capitaloneoffers.com/shopping-trips

Browse:
  capitaloneshopping.com/
  capitaloneoffers.com/feed`);return}let t=document.createElement("script");t.src="https://willblaschko.github.io/capital-one-shopping-and-offers-tracker/bookmarklet-full.js",t.onerror=function(){alert("Failed to load tracker script. Check your internet connection.")},document.body.appendChild(t)})();})();
