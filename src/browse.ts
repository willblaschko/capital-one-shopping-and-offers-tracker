//=============================================================================
// browse.ts — Catalog feed walker, normalizer, bucketing, renderer.
//
// Two feed sources, one canonical Offer shape:
//   - capitaloneshopping.com homepage: POST /api/v1/feed (cashback)
//   - capitaloneoffers.com /feed:      GET /feed/{userId}?cursor=... (miles)
//
// Activation contracts (see types.Activation discriminated union):
//   - 'href':         window.open(activation.url) — Cap One pre-signed JWT URL
//   - 'post-offers':  open about:blank synchronously to preserve user-gesture,
//                     then POST activation.url with credentials, then set
//                     tab.location = response.affiliate.redirectUrl
//=============================================================================

import { escapeHtml } from './core.js';
import type {
    Activation,
    BrowseData,
    BrowseStats,
    BucketId,
    Offer,
    OffersBrowseContext,
    RawOffersActivationResponse,
    RawOffersFeedResponse,
    RawOffersFeedTile,
    RawShoppingFeedItem,
    RawShoppingFeedResponse,
    RenderFn,
    RewardType,
    SpecialBucketId,
    ValueBucketId,
    WalkFeedConfig,
    WalkResult
} from './types.js';

//=============================================================================
// Reward parsing
//=============================================================================

const MULTIPLIER_RE = /(\d+(?:\.\d+)?)X/i;
const PERCENT_RE = /(\d+(?:\.\d+)?)%/;
const FIXED_CASH_RE = /\$([\d,]+(?:\.\d+)?)/;
const FIXED_POINTS_RE = /([\d,]+)\s*(miles|points)/i;

/**
 * Parse a reward display string into a {type, value, display} tuple.
 * Heuristic precedence: multiplier ("5X" / "Up to 7X miles") → fixed-cash ("$17.50") →
 * fixed-points ("5,000 miles") → percent ("5%") → unknown ("Shop Now").
 */
export function parseRewardDisplay(str: string): {
    type: RewardType;
    value: number;
    display: string;
} {
    const display = String(str ?? '');
    const s = display.trim();
    if (!s) return { type: 'unknown', value: 0, display };

    const mMult = s.match(MULTIPLIER_RE);
    if (mMult && mMult[1] !== undefined) {
        return { type: 'multiplier', value: parseFloat(mMult[1]), display };
    }
    const mCash = s.match(FIXED_CASH_RE);
    if (mCash && mCash[1] !== undefined) {
        return { type: 'fixed-cash', value: parseFloat(mCash[1].replace(/,/g, '')), display };
    }
    const mPts = s.match(FIXED_POINTS_RE);
    if (mPts && mPts[1] !== undefined) {
        return { type: 'fixed-points', value: parseFloat(mPts[1].replace(/,/g, '')), display };
    }
    const mPct = s.match(PERCENT_RE);
    if (mPct && mPct[1] !== undefined) {
        return { type: 'percent', value: parseFloat(mPct[1]), display };
    }
    return { type: 'unknown', value: 0, display };
}

//=============================================================================
// Shopping normalizer
//=============================================================================

interface CashbackCategory {
    name: string;
    cashback: string;
}

function pickShoppingRewardDisplay(item: RawShoppingFeedItem): string {
    const stats = item.stats ?? {};
    return stats.cashbackV2 ?? stats.cashback ?? stats.cashbackAmount ?? '';
}

function maxCutTier(categories: CashbackCategory[] | undefined): { value: number; display: string } | null {
    if (!categories || !categories.length) return null;
    let best: { value: number; display: string } | null = null;
    for (const cat of categories) {
        const parsed = parseRewardDisplay(cat.cashback);
        if (parsed.value > 0) {
            if (!best || parsed.value > best.value) {
                best = { value: parsed.value, display: cat.cashback };
            }
        }
    }
    return best;
}

function shoppingBucketCategory(itemType: string): Offer['bucketCategory'] {
    switch (itemType) {
        case 'great_deal':
            return 'price-drops';
        case 'event_placement':
            return 'events';
        case 'nca_deal':
            return 'new-customer';
        case 'retarget':
        case 'retarget_non_product':
            return 'recently-viewed';
        default:
            return 'value';
    }
}

/**
 * Normalize a single raw shopping feed item to canonical Offer, or null
 * if essential fields are missing (no merchant + no domain, or no href).
 */
export function normalizeShoppingOffer(raw: RawShoppingFeedItem): Offer | null {
    if (!raw.href) return null;
    const merchant = raw.merchantName ?? '';
    const domain = (raw as { domain?: string }).domain ?? '';
    if (!merchant && !domain) return null;

    const stats = raw.stats ?? {};
    const isCut = stats.isCutType === true || stats.rewardType === 'cut';

    let rewardType: RewardType;
    let rewardValue: number;
    let rewardDisplay: string;

    if (isCut) {
        const best = maxCutTier(stats.cashbackCategories as CashbackCategory[] | undefined);
        if (best) {
            rewardType = 'percent';
            rewardValue = best.value;
            // Prefix with "Up to" if not already
            const trimmedDisplay = best.display.trim();
            rewardDisplay = trimmedDisplay.toLowerCase().startsWith('up to')
                ? trimmedDisplay
                : 'Up to ' + trimmedDisplay;
        } else {
            // Fallback to top-level cashback string
            const parsed = parseRewardDisplay(pickShoppingRewardDisplay(raw));
            rewardType = parsed.type;
            rewardValue = parsed.value;
            rewardDisplay = parsed.display.toLowerCase().startsWith('up to')
                ? parsed.display
                : (parsed.value ? 'Up to ' + parsed.display : parsed.display);
        }
    } else {
        const parsed = parseRewardDisplay(pickShoppingRewardDisplay(raw));
        rewardType = parsed.type;
        rewardValue = parsed.value;
        rewardDisplay = parsed.display;
    }

    const activation: Activation = { method: 'href', url: raw.href };
    const bucketCategory = shoppingBucketCategory(raw.type);

    // Stable id: prefer item.id-like fields if present; else composite for dedupe
    const rawId = (raw as { id?: string | number }).id ?? null;
    const id = rawId !== null
        ? String(rawId)
        : `shopping|${merchant || domain}|${rewardDisplay}|${raw.type}`;

    return {
        id,
        source: 'shopping',
        itemType: raw.type,
        merchant: merchant || domain,
        domain: domain || merchant,
        rewardType,
        rewardValue,
        rewardDisplay,
        activation,
        bucketCategory,
        pill: raw.pill?.text ?? null,
        exclusions: stats.exclusionsText ?? '',
        eventEnd: raw.end ?? null,
        priceHistory: stats.priceHistory ?? null,
        raw
    };
}

//=============================================================================
// Offers normalizer
//=============================================================================

function offersActivationUrl(ctx: OffersBrowseContext, tileId: string): string {
    return `https://capitaloneoffers.com/feed/${encodeURIComponent(ctx.userId)}/offers/${tileId}?_data`;
}

/**
 * Normalize a raw offers feed tile to one or more canonical Offers.
 * Carousel tiles recurse into their nested `tiles[]` and return an Offer per child.
 */
export function normalizeOffersFeedTile(raw: RawOffersFeedTile, ctx: OffersBrowseContext): Offer[] {
    if (raw.type === 'Carousel') {
        const children = raw.tiles ?? [];
        const out: Offer[] = [];
        for (const child of children) {
            for (const o of normalizeOffersFeedTile(child, ctx)) out.push(o);
        }
        return out;
    }

    const tileId = raw.id;
    const merchantTLD = raw.merchantTLD;
    if (!tileId || !merchantTLD) return [];

    const buttonText = raw.buttonText ?? '';
    const parsed = parseRewardDisplay(buttonText);

    return [
        {
            id: tileId,
            source: 'offers',
            itemType: raw.type,
            merchant: merchantTLD,
            domain: merchantTLD,
            rewardType: parsed.type,
            rewardValue: parsed.value,
            rewardDisplay: parsed.display,
            activation: { method: 'post-offers', url: offersActivationUrl(ctx, tileId) },
            bucketCategory: 'value',
            pill: raw.badge?.text ?? null,
            exclusions: '',
            eventEnd: null,
            priceHistory: null,
            raw
        }
    ];
}

//=============================================================================
// Bucketing
//=============================================================================

const SPECIAL_BUCKET_FROM_CATEGORY: Partial<Record<Offer['bucketCategory'], SpecialBucketId>> = {
    events: 'events',
    'price-drops': 'price-drops',
    'new-customer': 'new-customer',
    'recently-viewed': 'recently-viewed'
};

/**
 * Assign a bucket id to a canonical Offer.
 * Special buckets (events / price-drops / new-customer / recently-viewed)
 * always take precedence over value buckets even when the reward is small.
 */
export function bucketize(offer: Offer): BucketId {
    const special = SPECIAL_BUCKET_FROM_CATEGORY[offer.bucketCategory];
    if (special) return special;

    const v = offer.rewardValue;
    switch (offer.rewardType) {
        case 'multiplier':
            if (v >= 30) return 'mult-30';
            if (v >= 20) return 'mult-20';
            if (v >= 10) return 'mult-10';
            return 'mult-1';
        case 'percent':
        case 'cut':
            if (v >= 40) return 'pct-40';
            if (v >= 20) return 'pct-20';
            if (v >= 10) return 'pct-10';
            return 'pct-1';
        case 'fixed-cash':
            if (v >= 50) return 'cash-50';
            if (v >= 25) return 'cash-25';
            return 'cash-0';
        case 'fixed-points':
            if (v >= 10000) return 'pts-10k';
            if (v >= 5000) return 'pts-5k';
            if (v >= 1000) return 'pts-1k';
            return 'pts-lt-1k';
        case 'unknown':
        default:
            // No clean home for unknowns; lump them with the lowest percent tier.
            return 'pct-1';
    }
}

//=============================================================================
// Bucket metadata (labels, initial open state, ordering)
//=============================================================================

interface BucketMeta {
    id: BucketId;
    label: string;
    group: 'special' | 'multiplier' | 'percent' | 'fixed-cash' | 'fixed-points';
    initiallyOpen: boolean;
}

// Order matters: specials first, then value buckets from highest tier down.
const BUCKET_META: BucketMeta[] = [
    { id: 'events',          label: 'Events',                       group: 'special',       initiallyOpen: true  },
    { id: 'price-drops',     label: 'Price Drops',                  group: 'special',       initiallyOpen: true  },
    { id: 'new-customer',    label: 'New Customer',                 group: 'special',       initiallyOpen: true  },
    { id: 'recently-viewed', label: 'Recently Viewed',              group: 'special',       initiallyOpen: true  },
    { id: 'mult-30',         label: 'Multipliers · 30X+',           group: 'multiplier',    initiallyOpen: true  },
    { id: 'mult-20',         label: 'Multipliers · 20–29X',         group: 'multiplier',    initiallyOpen: true  },
    { id: 'mult-10',         label: 'Multipliers · 10–19X',         group: 'multiplier',    initiallyOpen: false },
    { id: 'mult-1',          label: 'Multipliers · 1–9X',           group: 'multiplier',    initiallyOpen: false },
    { id: 'pct-40',          label: 'Percent · 40%+',               group: 'percent',       initiallyOpen: true  },
    { id: 'pct-20',          label: 'Percent · 20–39%',             group: 'percent',       initiallyOpen: true  },
    { id: 'pct-10',          label: 'Percent · 10–19%',             group: 'percent',       initiallyOpen: false },
    { id: 'pct-1',           label: 'Percent · 1–9%',               group: 'percent',       initiallyOpen: false },
    { id: 'cash-50',         label: 'Fixed Cash · $50+',            group: 'fixed-cash',    initiallyOpen: true  },
    { id: 'cash-25',         label: 'Fixed Cash · $25–49',          group: 'fixed-cash',    initiallyOpen: true  },
    { id: 'cash-0',          label: 'Fixed Cash · under $25',       group: 'fixed-cash',    initiallyOpen: false },
    { id: 'pts-10k',         label: 'Fixed Points · 10,000+',       group: 'fixed-points',  initiallyOpen: true  },
    { id: 'pts-5k',          label: 'Fixed Points · 5,000–9,999',   group: 'fixed-points',  initiallyOpen: true  },
    { id: 'pts-1k',          label: 'Fixed Points · 1,000–4,999',   group: 'fixed-points',  initiallyOpen: false },
    { id: 'pts-lt-1k',       label: 'Fixed Points · under 1,000',   group: 'fixed-points',  initiallyOpen: false }
];

const BUCKET_META_BY_ID: Record<BucketId, BucketMeta> = (() => {
    const out = {} as Record<BucketId, BucketMeta>;
    for (const m of BUCKET_META) out[m.id] = m;
    return out;
})();

//=============================================================================
// processBrowseData
//=============================================================================

export function processBrowseData(offers: Offer[]): BrowseData {
    const buckets: Partial<Record<BucketId, Offer[]>> = {};
    for (const o of offers) {
        const b = bucketize(o);
        (buckets[b] ??= []).push(o);
    }
    // Sort within bucket descending by rewardValue
    for (const k of Object.keys(buckets) as BucketId[]) {
        buckets[k]!.sort((a, b) => b.rewardValue - a.rewardValue);
    }

    const bucketOrder: BucketId[] = [];
    const byBucket: Partial<Record<BucketId, number>> = {};
    for (const meta of BUCKET_META) {
        const arr = buckets[meta.id];
        if (arr && arr.length) {
            bucketOrder.push(meta.id);
            byBucket[meta.id] = arr.length;
        }
    }

    const stats: BrowseStats = {
        total: offers.length,
        byBucket
    };

    return { offers, buckets, bucketOrder, stats };
}

//=============================================================================
// Generic feed walker
//=============================================================================

async function walkFeed<TPage, TItem>(cfg: WalkFeedConfig<TPage, TItem>): Promise<WalkResult<TItem>> {
    const maxPages = cfg.maxPages ?? 40;
    const seen = new Set<string>();
    const out: TItem[] = [];
    let cursor: string | null = null;
    let pages = 0;

    while (pages < maxPages) {
        const page = await cfg.fetchPage(cursor);
        if (!page) break;
        for (const it of cfg.getItems(page)) {
            const k = cfg.dedupeKey(it);
            if (k && seen.has(k)) continue;
            if (k) seen.add(k);
            out.push(it);
        }
        pages++;
        cfg.onPage?.(pages, out.length);
        const next = cfg.getNextCursor(page);
        if (!next) break;
        cursor = next;
    }

    return { items: out, hitCap: pages >= maxPages, pagesWalked: pages };
}

//=============================================================================
// walkShoppingFeed
//=============================================================================

function shoppingFeedBody(cursor: string | null): string {
    return JSON.stringify({
        contentProps: {
            pagination: {
                nextPageToken: cursor ?? '',
                limit: 25
            }
        },
        context: {
            url: typeof window !== 'undefined' ? window.location.href : '',
            referrer: typeof document !== 'undefined' ? document.referrer : ''
        }
    });
}

function shoppingDedupeKey(item: RawShoppingFeedItem): string | null {
    const anyItem = item as { id?: string | number };
    if (anyItem.id !== undefined && anyItem.id !== null && anyItem.id !== '') {
        return String(anyItem.id);
    }
    const merch = item.merchantName ?? '';
    const reward = item.stats?.cashbackV2 ?? item.stats?.cashback ?? '';
    if (!merch && !reward) return null;
    return `${merch}|${reward}|${item.type}`;
}

export async function walkShoppingFeed(
    onPage?: (pages: number, total: number) => void
): Promise<WalkResult<Offer>> {
    const cfg: WalkFeedConfig<RawShoppingFeedResponse, RawShoppingFeedItem> = {
        fetchPage: async (cursor) => {
            const r = await fetch('/api/v1/feed', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: shoppingFeedBody(cursor)
            });
            if (!r.ok) return null;
            return await r.json() as RawShoppingFeedResponse;
        },
        getNextCursor: (page) => page.pagination?.nextPageToken ?? null,
        getItems: (page) => page.items ?? [],
        dedupeKey: shoppingDedupeKey,
        ...(onPage ? { onPage } : {}),
        maxPages: 40
    };

    const walked = await walkFeed(cfg);
    const offers: Offer[] = [];
    for (const it of walked.items) {
        const o = normalizeShoppingOffer(it);
        if (o) offers.push(o);
    }
    return { items: offers, hitCap: walked.hitCap, pagesWalked: walked.pagesWalked };
}

//=============================================================================
// walkOffersFeed
//=============================================================================

function offersFeedUrl(ctx: OffersBrowseContext, cursor: string | null): string {
    const base = `https://capitaloneoffers.com/feed/${encodeURIComponent(ctx.userId)}`;
    const params = `?numberOfColumnsInGrid=5&viewInstanceId=${ctx.viewInstanceId}&contentSlug=ease-web-l1`;
    return cursor ? `${base}${params}&cursor=${cursor}` : `${base}${params}`;
}

function offersDedupeKey(item: RawOffersFeedTile): string | null {
    if (item.id) return item.id;
    const tld = item.merchantTLD ?? '';
    const bt = item.buttonText ?? '';
    if (!tld && !bt) return null;
    return `${tld}|${bt}`;
}

/** Flatten Carousel children into a flat raw-tile array for dedupe + normalization. */
function flattenOffersTiles(tiles: RawOffersFeedTile[]): RawOffersFeedTile[] {
    const out: RawOffersFeedTile[] = [];
    for (const t of tiles) {
        if (t.type === 'Carousel') {
            for (const child of (t.tiles ?? [])) out.push(child);
        } else {
            out.push(t);
        }
    }
    return out;
}

export async function walkOffersFeed(
    ctx: OffersBrowseContext,
    onPage?: (pages: number, total: number) => void
): Promise<WalkResult<Offer>> {
    const cfg: WalkFeedConfig<RawOffersFeedResponse, RawOffersFeedTile> = {
        fetchPage: async (cursor) => {
            const r = await fetch(offersFeedUrl(ctx, cursor), {
                method: 'GET',
                credentials: 'include',
                headers: { Accept: 'application/json' }
            });
            if (!r.ok) return null;
            return await r.json() as RawOffersFeedResponse;
        },
        getNextCursor: (page) => page.cursor ?? null,
        getItems: (page) => flattenOffersTiles(page.data ?? []),
        dedupeKey: offersDedupeKey,
        ...(onPage ? { onPage } : {}),
        maxPages: 40
    };

    const walked = await walkFeed(cfg);
    const offers: Offer[] = [];
    for (const it of walked.items) {
        for (const o of normalizeOffersFeedTile(it, ctx)) offers.push(o);
    }
    return { items: offers, hitCap: walked.hitCap, pagesWalked: walked.pagesWalked };
}

//=============================================================================
// Offers browse context (userId + viewInstanceId) discovery
//=============================================================================

function findKeyRecursive(obj: unknown, keys: string[], depth = 0): string | null {
    if (depth > 6 || obj === null || typeof obj !== 'object') return null;
    const record = obj as Record<string, unknown>;
    for (const k of keys) {
        const v = record[k];
        if (typeof v === 'string' && v.length > 0) return v;
    }
    for (const k of Object.keys(record)) {
        const child = record[k];
        if (child && typeof child === 'object') {
            const found = findKeyRecursive(child, keys, depth + 1);
            if (found) return found;
        }
    }
    return null;
}

/**
 * Discover userId + viewInstanceId from the live page.
 * Sources (in order): __NEXT_DATA__ script tag, URL path /feed/{userId}.
 * Returns null when both fields can't be obtained.
 */
export function getOffersBrowseContext(): OffersBrowseContext | null {
    let userId: string | null = null;
    let viewInstanceId: string | null = null;

    // 1) Parse __NEXT_DATA__ script tag (Next.js inlines page props)
    try {
        const el = document.getElementById('__NEXT_DATA__');
        if (el?.textContent) {
            const parsed = JSON.parse(el.textContent) as unknown;
            userId = findKeyRecursive(parsed, ['userId', 'accountReferenceId']);
            viewInstanceId = findKeyRecursive(parsed, ['viewInstanceId']);
        }
    } catch {
        // malformed JSON — fall through
    }

    // 2) Fall back to URL path: /feed/{userId}
    if (!userId) {
        const m = window.location.pathname.match(/^\/feed\/([^/?#]+)/);
        if (m && m[1]) userId = decodeURIComponent(m[1]);
    }

    // 3) For viewInstanceId, generate a UUID if Cap One accepts arbitrary IDs
    if (!viewInstanceId && userId) {
        try {
            if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
                viewInstanceId = crypto.randomUUID();
            }
        } catch {
            // ignore
        }
    }

    if (userId && viewInstanceId) return { userId, viewInstanceId };
    return null;
}

//=============================================================================
// Renderer
//=============================================================================

function pillClass(itemType: string, bucketCategory: Offer['bucketCategory']): string {
    if (bucketCategory === 'events') return 'event';
    if (bucketCategory === 'price-drops') return 'deal';
    if (bucketCategory === 'new-customer') return 'new';
    if (bucketCategory === 'recently-viewed') return 'retarget';
    if (itemType === 'great_deal') return 'deal';
    return '';
}

function rowSearchString(o: Offer): string {
    return `${o.merchant} ${o.domain} ${o.rewardDisplay} ${o.itemType} ${o.exclusions}`.toLowerCase();
}

function eventEndDisplay(iso: string | null): string {
    if (!iso) return '';
    try {
        const d = new Date(iso);
        return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    } catch {
        return '';
    }
}

function renderBucket(meta: BucketMeta, offers: Offer[]): string {
    const rows = offers.map(o => {
        const search = escapeHtml(rowSearchString(o));
        const pillHtml = o.pill
            ? `<span class="c1t-pill ${pillClass(o.itemType, o.bucketCategory)}">${escapeHtml(o.pill)}</span>`
            : '';
        const endHtml = o.eventEnd
            ? `<span class="c1t-event-end">ends ${escapeHtml(eventEndDisplay(o.eventEnd))}</span>`
            : '';
        const exclTitle = o.exclusions ? ` title="${escapeHtml(o.exclusions)}"` : '';
        const exclShort = o.exclusions ? escapeHtml(o.exclusions) : '';
        return `<tr class="c1t-row-click"
            data-merchant="${escapeHtml(o.merchant)}"
            data-bucket-id="${escapeHtml(meta.id)}"
            data-search="${search}"
            data-method="${escapeHtml(o.activation.method)}"
            data-activation-url="${escapeHtml(o.activation.url)}">
            <td>${escapeHtml(o.merchant)}</td>
            <td><span class="c1t-reward">${escapeHtml(o.rewardDisplay)}</span></td>
            <td>${pillHtml}</td>
            <td>${endHtml}</td>
            <td><span class="c1t-exclusions"${exclTitle}>${exclShort}</span></td>
        </tr>`;
    }).join('');

    const openAttr = meta.initiallyOpen ? ' open' : '';
    return `<details class="c1t-bucket" data-bucket-id="${meta.id}"${openAttr}>
        <summary>${escapeHtml(meta.label)} <span class="c1t-bucket-count">(${offers.length})</span></summary>
        <table>
            <thead>
                <tr><th>Merchant</th><th>Reward</th><th>Badge</th><th>Ends</th><th>Exclusions</th></tr>
            </thead>
            <tbody>${rows}</tbody>
        </table>
    </details>`;
}

function groupChipLabel(group: BucketMeta['group']): string {
    switch (group) {
        case 'special': return 'Specials';
        case 'multiplier': return 'Multipliers';
        case 'percent': return 'Percent';
        case 'fixed-cash': return 'Cash';
        case 'fixed-points': return 'Points';
    }
}

function buildQuickJumpChips(data: BrowseData): string {
    // Show one chip per top-level bucket group with at least one present bucket.
    const present = new Set<string>();
    for (const id of data.bucketOrder) {
        const meta = BUCKET_META_BY_ID[id];
        if (meta) present.add(meta.group);
    }
    // Also show a chip per specific present special bucket
    const chips: string[] = [];
    for (const id of data.bucketOrder) {
        const meta = BUCKET_META_BY_ID[id];
        if (!meta) continue;
        if (meta.group === 'special') {
            chips.push(`<button class="c1t-jump-chip" data-jump-to="${meta.id}">${escapeHtml(meta.label)}</button>`);
        }
    }
    // Then non-special groups (first bucket in each group)
    const seenGroup = new Set<string>();
    for (const id of data.bucketOrder) {
        const meta = BUCKET_META_BY_ID[id];
        if (!meta || meta.group === 'special') continue;
        if (seenGroup.has(meta.group)) continue;
        seenGroup.add(meta.group);
        chips.push(`<button class="c1t-jump-chip" data-jump-to="${meta.id}">${escapeHtml(groupChipLabel(meta.group))}</button>`);
    }
    void present;
    return chips.join('');
}

function handleHrefClick(row: HTMLElement): void {
    const url = row.dataset.activationUrl;
    if (!url) return;
    window.open(url, '_blank', 'noopener');
}

async function handlePostOffersClick(row: HTMLElement): Promise<void> {
    const url = row.dataset.activationUrl;
    if (!url) return;
    // Sync open to preserve user-gesture; popup blockers ratchet down on async open.
    const tab = window.open('about:blank', '_blank') as (Window & { location: string | Location }) | null;
    try {
        const r = await fetch(url, { method: 'POST', credentials: 'include' });
        const data = await r.json() as RawOffersActivationResponse;
        const redirect = data?.affiliate?.redirectUrl;
        if (redirect && tab) {
            tab.location = redirect;
        } else if (tab) {
            tab.close?.();
            alert('Activation failed — try clicking the tile on Cap One directly.');
        }
    } catch (e) {
        tab?.close?.();
        alert('Activation failed: ' + (e instanceof Error ? e.message : String(e)));
    }
}

function attachRowClickDelegation(root: HTMLElement): void {
    root.addEventListener('click', (ev) => {
        const target = ev.target as HTMLElement | null;
        if (!target) return;
        const row = target.closest('tr[data-method]') as HTMLElement | null;
        if (!row) return;
        if (row.dataset.method === 'href') {
            handleHrefClick(row);
        } else if (row.dataset.method === 'post-offers') {
            // Fire and forget — the handler does its own awaiting.
            void handlePostOffersClick(row);
        }
    });
}

function attachSearch(root: HTMLElement): void {
    const input = root.querySelector('#c1t-browse-search input') as HTMLInputElement | null;
    const clearBtn = root.querySelector('#c1t-browse-search button') as HTMLButtonElement | null;
    if (!input) return;

    // Cache pre-search open state once
    const openStateCache = new Map<string, boolean>();
    root.querySelectorAll('details[data-bucket-id]').forEach(d => {
        const det = d as HTMLDetailsElement;
        const id = det.dataset.bucketId ?? '';
        openStateCache.set(id, det.open);
    });

    let timer: ReturnType<typeof setTimeout> | null = null;
    const applyFilter = (q: string) => {
        const query = q.trim().toLowerCase();
        const isEmpty = query.length === 0;
        const buckets = root.querySelectorAll('details[data-bucket-id]');
        buckets.forEach(detail => {
            const det = detail as HTMLDetailsElement;
            const id = det.dataset.bucketId ?? '';
            const rows = det.querySelectorAll<HTMLElement>('tr[data-search]');
            let visibleCount = 0;
            rows.forEach(row => {
                const search = row.dataset.search ?? '';
                const match = isEmpty || search.includes(query);
                row.style.display = match ? '' : 'none';
                if (match) visibleCount++;
            });
            // Hide empty bucket
            if (visibleCount === 0 && !isEmpty) {
                det.style.display = 'none';
            } else {
                det.style.display = '';
                // Auto-expand matching buckets when filtering; restore on clear
                if (!isEmpty) {
                    det.open = true;
                } else {
                    det.open = openStateCache.get(id) ?? false;
                }
            }
        });
    };

    input.addEventListener('input', () => {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => applyFilter(input.value), 100);
    });
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            input.value = '';
            applyFilter('');
        });
    }
}

function attachQuickJump(root: HTMLElement): void {
    const nav = root.querySelector('#c1t-browse-nav');
    if (!nav) return;
    nav.addEventListener('click', (ev) => {
        const t = ev.target as HTMLElement | null;
        if (!t) return;
        const chip = t.closest('[data-jump-to]') as HTMLElement | null;
        if (!chip) return;
        const id = chip.dataset.jumpTo;
        if (!id) return;
        const detail = root.querySelector(`details[data-bucket-id="${id}"]`) as HTMLDetailsElement | null;
        if (!detail) return;
        detail.open = true;
        detail.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
}

export const renderBrowseToModal: RenderFn<BrowseData> = (overlay, data) => {
    const content = overlay.querySelector('#c1t-content');
    if (!content) return;

    const bucketHtml = data.bucketOrder.map(id => {
        const meta = BUCKET_META_BY_ID[id];
        if (!meta) return '';
        const offers = data.buckets[id];
        if (!offers || !offers.length) return '';
        return renderBucket(meta, offers);
    }).join('');

    const chips = buildQuickJumpChips(data);
    const footerNote = data.stats.hitCap
        ? `Stopped at ${data.stats.total} items (max pages reached)`
        : `${data.stats.total} offers across ${data.bucketOrder.length} buckets`;

    content.innerHTML = `
        <div id="c1t-browse-search">
            <input type="search" placeholder="Search merchant / reward / type..." />
            <button type="button">Clear</button>
        </div>
        <div id="c1t-browse-nav">${chips}</div>
        <div id="c1t-browse-stats">${escapeHtml(footerNote)}</div>
        <div id="c1t-browse-body">${bucketHtml || '<div style="padding:40px;text-align:center;opacity:0.7;">No offers found.</div>'}</div>
        <div id="c1t-browse-footer">Click a row to activate. Shopping rows open the pre-signed href; offers rows POST then redirect.</div>
    `;

    const body = content.querySelector('#c1t-browse-body') as HTMLElement | null;
    if (body) attachRowClickDelegation(body);
    attachSearch(content as HTMLElement);
    attachQuickJump(content as HTMLElement);
};

// Re-export for callers that want bucket metadata
export { BUCKET_META, BUCKET_META_BY_ID };

// Type re-exports for any downstream guard usage
export type { ValueBucketId, SpecialBucketId };
