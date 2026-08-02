// Bookmarklet loader — tiny script that loads the full bundle from GitHub Pages.
// MUST stay small: this is the URL-encoded payload. Keep gate logic flat,
// no imports from core.ts / browse.ts (those live in the externally loaded bundle).

/**
 * Host gate for the loader. Any capitaloneshopping.com or capitaloneoffers.com
 * page is allowed through — the CDN-loaded bundle does the real per-mode routing
 * and shows a nicer "please navigate" alert on unsupported paths. Keeping the
 * loader host-only means Cap One can move page paths without breaking already-
 * installed bookmarklets (the bundle auto-updates from GitHub Pages; the loader
 * URL doesn't).
 *
 * The `path` parameter is unused but kept for signature stability with the
 * existing test suite.
 */
export function isBrowsePagePath(host: string, _path: string): boolean {
    return host.includes('capitaloneshopping') || host.includes('capitaloneoffers');
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
        alert('Please run this on capitaloneshopping.com or capitaloneoffers.com.');
        return;
    }

    // Load the full script from GitHub Pages. Cache-bust with a timestamp so
    // the browser + GH Pages CDN can't serve a stale bundle after a version bump.
    // The 40KB payload is small enough that no-cache-per-click is fine.
    const s = document.createElement('script');
    s.src =
        'https://willblaschko.github.io/capital-one-shopping-and-offers-tracker/bookmarklet-full.js?t=' +
        Date.now();
    s.onerror = function () {
        alert('Failed to load tracker script. Check your internet connection.');
    };
    document.body.appendChild(s);
})();
