(()=>{(function(){if(document.getElementById("c1t-fab")){var n=document.getElementById("c1t-overlay");n&&n.classList.add("open");return}var e=window.location.hostname,o=window.location.pathname,i=e.includes("capitaloneshopping")&&o.startsWith("/account-settings/shopping-trips"),s=e.includes("capitaloneoffers")&&o.startsWith("/c1-offers/shopping-trips");if(!i&&!s){alert(`Please run this on the Shopping Trips page:

capitaloneshopping.com/account-settings/shopping-trips
or
capitaloneoffers.com/c1-offers/shopping-trips`);return}var t=document.createElement("script");t.src="https://willblaschko.github.io/capital-one-shopping-and-offers-tracker/bookmarklet-full.js",t.onerror=function(){alert("Failed to load tracker script. Check your internet connection.")},document.body.appendChild(t)})();})();
