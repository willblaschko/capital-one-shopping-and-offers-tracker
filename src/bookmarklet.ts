// Bookmarklet loader — tiny script that loads the full bundle from GitHub Pages.
// MUST stay small: this is the URL-encoded payload. Keep gate logic flat,
// no imports from core.ts / browse.ts (those live in the externally loaded bundle).

/**
 * URL gate for the loader. Accepts:
 *   - shopping trips:  capitaloneshopping.com/account-settings/shopping-trips*
 *   - offers trips:    capitaloneoffers.com/shopping-trips*  (was /c1-offers/shopping-trips)
 *   - shopping browse: capitaloneshopping.com/ (exact root)
 *   - offers browse:   capitaloneoffers.com/feed*
 *
 * Exported so test/entry-points.test.ts can exercise it directly — the IIFE
 * below pulls the same helper.
 */
export function isBrowsePagePath(host: string, path: string): boolean {
    const onShopping = host.includes('capitaloneshopping');
    const onOffers = host.includes('capitaloneoffers');
    if (!onShopping && !onOffers) return false;

    // Trips paths
    if (onShopping && path.startsWith('/account-settings/shopping-trips')) return true;
    if (onOffers && path.startsWith('/shopping-trips')) return true;

    // Browse paths
    if (onShopping && (path === '/' || path === '')) return true;
    if (onOffers && path.startsWith('/feed')) return true;

    return false;
}

(function () {
    // No-op in non-browser / test contexts (no document, no alert).
    // Real bookmarklet always has both.
    if (
        typeof document === 'undefined' ||
        typeof window === 'undefined' ||
        typeof alert !== 'function'
    ) {
        return;
    }

    // If already loaded, just open the modal
    if (document.getElementById('c1t-fab')) {
        const o = document.getElementById('c1t-overlay');
        if (o) o.classList.add('open');
        return;
    }

    const h = window.location.hostname;
    const p = window.location.pathname;

    if (!isBrowsePagePath(h, p)) {
        alert(
            'Please run this on a Capital One Shopping or Offers page:\n\n' +
                'Trips:\n' +
                '  capitaloneshopping.com/account-settings/shopping-trips\n' +
                '  capitaloneoffers.com/shopping-trips\n\n' +
                'Browse:\n' +
                '  capitaloneshopping.com/\n' +
                '  capitaloneoffers.com/feed'
        );
        return;
    }

    // Load the full script from GitHub Pages
    const s = document.createElement('script');
    s.src = 'https://willblaschko.github.io/capital-one-shopping-and-offers-tracker/bookmarklet-full.js';
    s.onerror = function () {
        alert('Failed to load tracker script. Check your internet connection.');
    };
    document.body.appendChild(s);
})();
