// Bookmarklet loader - tiny script that loads the full version from GitHub
// This stays small enough to work as a bookmarklet

(function() {
    // If already loaded, just open the modal
    if (document.getElementById('c1t-fab')) {
        var o = document.getElementById('c1t-overlay');
        if (o) o.classList.add('open');
        return;
    }

    // Check we're on the right site and page
    var h = window.location.hostname;
    var p = window.location.pathname;
    var isShopping = h.includes('capitaloneshopping') && p.startsWith('/account-settings/shopping-trips');
    var isOffers = h.includes('capitaloneoffers') && p.startsWith('/c1-offers/shopping-trips');

    if (!isShopping && !isOffers) {
        alert('Please run this on the Shopping Trips page:\n\ncapitaloneshopping.com/account-settings/shopping-trips\nor\ncapitaloneoffers.com/c1-offers/shopping-trips');
        return;
    }

    // Load the full script
    var s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/gh/willblaschko/capital-one-shopping-and-offers-tracker@main/dist/bookmarklet-full.js';
    s.onerror = function() {
        alert('Failed to load tracker script. Check your internet connection.');
    };
    document.body.appendChild(s);
})();
