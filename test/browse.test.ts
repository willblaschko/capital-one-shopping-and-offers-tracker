//=============================================================================
// browse.test.ts — Tests for catalog-feed walker, normalizer, bucketing,
// activation, and renderer. Written TDD-style; implementation in src/browse.ts.
//=============================================================================

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
    parseRewardDisplay,
    normalizeShoppingOffer,
    normalizeOffersFeedTile,
    bucketize,
    processBrowseData,
    getOffersBrowseContext,
    walkShoppingFeed,
    walkOffersFeed,
    renderBrowseToModal
} from '../src/browse.js';
import type {
    Offer,
    OffersBrowseContext,
    RawShoppingFeedItem,
    RawOffersFeedTile,
    BrowseData,
    BucketId,
    RewardType
} from '../src/types.js';

//=============================================================================
// Fixtures (representative-but-slim subsets of real Cap One payloads)
//=============================================================================

const shoppingGreatDeal: RawShoppingFeedItem = {
    type: 'great_deal',
    filterLabel: 'Price Drops',
    pill: { text: 'Price Drop' },
    primaryImage: 'http://x',
    primaryText: 'Kitty City Catio',
    merchantName: 'Chewy',
    stats: {
        priceHistory: [{ date: '2026-03-01', list_price: 99.99 }],
        percentOff: '34%',
        newPrice: '$65.99',
        oldPrice: '$99.99',
        cashback: '2%',
        cashbackV2: '2%',
        rewardType: 'percentage',
        isCutType: false,
        rewardMaxPayout: '$1,000',
        exclusionsText: 'Not eligible for gift cards.'
    },
    href: 'https://capitaloneshopping.com/api/v3/r?d=ENCODED&t=JWT'
};

const shoppingEvent: RawShoppingFeedItem = {
    type: 'event_placement',
    filterLabel: 'Events',
    pill: { text: 'Limited Time Event' },
    primaryImage: 'http://x',
    merchantName: 'Best Western',
    stats: {
        cashback: '5%',
        cashbackV2: '5%',
        rewardType: 'percentage',
        isCutType: false,
        rewardMaxPayout: '$1,000',
        exclusionsText: 'Only after a completed stay.'
    },
    eventData: { name: 'Book Summer Getaways', href: '/event/x', tier: 'VIP', eventId: 'abc' },
    end: '2026-06-06T04:59:00.000Z',
    href: 'https://capitaloneshopping.com/api/v3/r?d=E2&t=JWT2'
};

const shoppingCut: RawShoppingFeedItem = {
    type: 'generic_store_placement',
    filterLabel: 'Rewards Offers',
    primaryImage: 'http://x',
    merchantName: "Macy's",
    stats: {
        cashback: 'up to 5%',
        cashbackV2: '5%',
        cashbackCategories: [
            { name: 'Everything Else', cashback: '5%' },
            { name: 'Furniture', cashback: '2%' }
        ],
        rewardType: 'percentage',
        isCutType: true,
        rewardMaxPayout: '$1,000',
        exclusionsText: 'See exclusions.'
    },
    href: 'https://capitaloneshopping.com/api/v3/r?d=E3&t=JWT3'
};

const shoppingFixedCash: RawShoppingFeedItem = {
    type: 'event_placement',
    filterLabel: 'Events',
    primaryImage: 'http://x',
    merchantName: 'ezCater',
    stats: {
        cashback: '$17.50',
        cashbackV2: '$17.50',
        rewardType: 'fixed',
        isCutType: false,
        exclusionsText: 'New customers only.'
    },
    eventData: { name: 'Save on Business', href: '/event/y', tier: 'VIP', eventId: 'def' },
    end: '2026-06-05T04:59:59.999Z',
    href: 'https://capitaloneshopping.com/api/v3/r?d=E4&t=JWT4'
};

const shoppingRetarget: RawShoppingFeedItem = {
    type: 'retarget_non_product',
    filterLabel: 'Exclusive Deals',
    pill: { text: 'Exclusive Deal' },
    primaryImage: 'http://x',
    merchantName: 'SHEIN',
    primaryText: 'Save at this site',
    stats: {
        cashback: '2%',
        cashbackV2: '2%',
        rewardType: 'percentage',
        isCutType: false,
        rewardMaxPayout: '$1,000',
        exclusionsText: ''
    },
    href: 'https://capitaloneshopping.com/api/v3/r?d=E5&t=JWT5'
};

const shoppingNewCustomer: RawShoppingFeedItem = {
    type: 'nca_deal',
    filterLabel: 'New Customer',
    primaryImage: 'http://x',
    merchantName: 'HelloFresh',
    stats: {
        cashback: '$10.00',
        cashbackV2: '$10.00',
        rewardType: 'fixed',
        isCutType: false,
        exclusionsText: 'First-time customers only.'
    },
    href: 'https://capitaloneshopping.com/api/v3/r?d=E6&t=JWT6'
};

const offersStandard: RawOffersFeedTile = {
    merchantTLD: 'woot.com',
    type: 'Standard',
    id: 'eyJ2IjoxLCJ2aWV3Q29udGV4dCI6IntcInJ3ZFwiOlwiZmVlZFwifSIsImludmVudG9yeSI6eyJzb3VyY2UiOiJzdGFuZGFyZCJ9LCJvZmZlcnMiOlsiYWZmaWxpYXRlIl19',
    imageSrc: 'http://x',
    text: 'Online',
    buttonText: 'Up to 4X miles'
};

const offersFixedPoints: RawOffersFeedTile = {
    merchantTLD: 'doordash.com',
    type: 'Standard',
    id: 'eyJ2IjoxfQ==',
    imageSrc: 'http://x',
    text: 'Online',
    buttonText: 'Up to 22X miles'
};

const offersBig: RawOffersFeedTile = {
    merchantTLD: 'directv.com',
    type: 'Standard',
    id: 'eyJ2IjoyfQ==',
    imageSrc: 'http://x',
    text: 'Online',
    buttonText: 'Up to 22,500 miles'
};

const offersHero: RawOffersFeedTile = {
    merchantTLD: 'attwireless.com',
    type: 'Hero',
    id: 'eyJ2IjozfQ==',
    imageSrc: 'http://x',
    text: 'iPhone 16 starting at $2.99',
    buttonText: 'Up to 5,000 miles'
};

const offersCarousel: RawOffersFeedTile = {
    type: 'Carousel',
    tiles: [
        { merchantTLD: 'levi.com', id: 'eyJ2Ijo0fQ==', imageSrc: 'http://x', buttonText: '8X miles', type: 'Standard' },
        { merchantTLD: 'grammarly.com', id: 'eyJ2Ijo1fQ==', imageSrc: 'http://x', buttonText: '3,700 miles', type: 'Standard' }
    ]
};

const ctx: OffersBrowseContext = {
    userId: 'TJfjNqXyHfUR6LOXOM5JO+1986oAIJkyINGe4MgiUAI=',
    viewInstanceId: '1651fec9-fbec-452c-bdb5-41a7748978ea'
};

//=============================================================================
// parseRewardDisplay
//=============================================================================

describe('parseRewardDisplay', () => {
    it('parses bare percent "5%"', () => {
        const r = parseRewardDisplay('5%');
        expect(r.type).toBe('percent');
        expect(r.value).toBe(5);
        expect(r.display).toBe('5%');
    });

    it('parses multiplier with miles suffix "5X miles"', () => {
        const r = parseRewardDisplay('5X miles');
        expect(r.type).toBe('multiplier');
        expect(r.value).toBe(5);
        expect(r.display).toBe('5X miles');
    });

    it('parses "Up to 7X miles" as multiplier 7', () => {
        const r = parseRewardDisplay('Up to 7X miles');
        expect(r.type).toBe('multiplier');
        expect(r.value).toBe(7);
        expect(r.display).toBe('Up to 7X miles');
    });

    it('parses fixed cash "$17.50"', () => {
        const r = parseRewardDisplay('$17.50');
        expect(r.type).toBe('fixed-cash');
        expect(r.value).toBeCloseTo(17.5);
        expect(r.display).toBe('$17.50');
    });

    it('parses fixed points with comma "5,000 miles"', () => {
        const r = parseRewardDisplay('5,000 miles');
        expect(r.type).toBe('fixed-points');
        expect(r.value).toBe(5000);
        expect(r.display).toBe('5,000 miles');
    });

    it('parses small fixed points "100 miles"', () => {
        const r = parseRewardDisplay('100 miles');
        expect(r.type).toBe('fixed-points');
        expect(r.value).toBe(100);
        expect(r.display).toBe('100 miles');
    });

    it('returns unknown for non-reward text "Shop Now"', () => {
        const r = parseRewardDisplay('Shop Now');
        expect(r.type).toBe('unknown');
        expect(r.value).toBe(0);
        expect(r.display).toBe('Shop Now');
    });

    it('parses "up to 5%" (lowercase) as percent 5', () => {
        const r = parseRewardDisplay('up to 5%');
        expect(r.type).toBe('percent');
        expect(r.value).toBe(5);
    });

    it('parses "30X+" as multiplier 30', () => {
        const r = parseRewardDisplay('30X+');
        expect(r.type).toBe('multiplier');
        expect(r.value).toBe(30);
    });

    it('parses "2X" (no suffix) as multiplier 2', () => {
        const r = parseRewardDisplay('2X');
        expect(r.type).toBe('multiplier');
        expect(r.value).toBe(2);
    });

    it('handles empty input safely', () => {
        const r = parseRewardDisplay('');
        expect(r.type).toBe('unknown');
        expect(r.value).toBe(0);
        expect(r.display).toBe('');
    });

    it('parses points with "points" suffix "1,500 points"', () => {
        const r = parseRewardDisplay('1,500 points');
        expect(r.type).toBe('fixed-points');
        expect(r.value).toBe(1500);
    });
});

//=============================================================================
// bucketize
//=============================================================================

function offerFixture(over: Partial<Offer>): Offer {
    return {
        id: over.id ?? 'fix-1',
        source: over.source ?? 'shopping',
        itemType: over.itemType ?? 'generic_store_placement',
        merchant: over.merchant ?? 'Acme',
        domain: over.domain ?? 'acme.com',
        rewardType: over.rewardType ?? 'percent',
        rewardValue: over.rewardValue ?? 5,
        rewardDisplay: over.rewardDisplay ?? '5%',
        activation: over.activation ?? { method: 'href', url: 'http://x' },
        bucketCategory: over.bucketCategory ?? 'value',
        pill: over.pill ?? null,
        exclusions: over.exclusions ?? '',
        eventEnd: over.eventEnd ?? null,
        priceHistory: over.priceHistory ?? null,
        raw: over.raw ?? {}
    };
}

describe('bucketize value buckets', () => {
    it('mult-30 for 30X+', () => {
        expect(bucketize(offerFixture({ rewardType: 'multiplier', rewardValue: 30 }))).toBe('mult-30');
        expect(bucketize(offerFixture({ rewardType: 'multiplier', rewardValue: 50 }))).toBe('mult-30');
    });

    it('mult-20 for 20-29X', () => {
        expect(bucketize(offerFixture({ rewardType: 'multiplier', rewardValue: 20 }))).toBe('mult-20');
        expect(bucketize(offerFixture({ rewardType: 'multiplier', rewardValue: 29 }))).toBe('mult-20');
    });

    it('mult-10 for 10-19X', () => {
        expect(bucketize(offerFixture({ rewardType: 'multiplier', rewardValue: 10 }))).toBe('mult-10');
        expect(bucketize(offerFixture({ rewardType: 'multiplier', rewardValue: 19 }))).toBe('mult-10');
    });

    it('mult-1 for 1-9X', () => {
        expect(bucketize(offerFixture({ rewardType: 'multiplier', rewardValue: 1 }))).toBe('mult-1');
        expect(bucketize(offerFixture({ rewardType: 'multiplier', rewardValue: 9 }))).toBe('mult-1');
    });

    it('pct-40 for 40%+', () => {
        expect(bucketize(offerFixture({ rewardType: 'percent', rewardValue: 40 }))).toBe('pct-40');
        expect(bucketize(offerFixture({ rewardType: 'percent', rewardValue: 95 }))).toBe('pct-40');
    });

    it('pct-20 for 20-39%', () => {
        expect(bucketize(offerFixture({ rewardType: 'percent', rewardValue: 20 }))).toBe('pct-20');
        expect(bucketize(offerFixture({ rewardType: 'percent', rewardValue: 39 }))).toBe('pct-20');
    });

    it('pct-10 for 10-19%', () => {
        expect(bucketize(offerFixture({ rewardType: 'percent', rewardValue: 10 }))).toBe('pct-10');
    });

    it('pct-1 for 1-9%', () => {
        expect(bucketize(offerFixture({ rewardType: 'percent', rewardValue: 5 }))).toBe('pct-1');
    });

    it('cash-50 for $50+', () => {
        expect(bucketize(offerFixture({ rewardType: 'fixed-cash', rewardValue: 50 }))).toBe('cash-50');
    });

    it('cash-25 for $25-49', () => {
        expect(bucketize(offerFixture({ rewardType: 'fixed-cash', rewardValue: 25 }))).toBe('cash-25');
        expect(bucketize(offerFixture({ rewardType: 'fixed-cash', rewardValue: 49.99 }))).toBe('cash-25');
    });

    it('cash-0 for under $25', () => {
        expect(bucketize(offerFixture({ rewardType: 'fixed-cash', rewardValue: 17.5 }))).toBe('cash-0');
        expect(bucketize(offerFixture({ rewardType: 'fixed-cash', rewardValue: 0 }))).toBe('cash-0');
    });

    it('pts-10k for 10,000+ points', () => {
        expect(bucketize(offerFixture({ rewardType: 'fixed-points', rewardValue: 10000 }))).toBe('pts-10k');
        expect(bucketize(offerFixture({ rewardType: 'fixed-points', rewardValue: 22500 }))).toBe('pts-10k');
    });

    it('pts-5k for 5,000-9,999 points', () => {
        expect(bucketize(offerFixture({ rewardType: 'fixed-points', rewardValue: 5000 }))).toBe('pts-5k');
        expect(bucketize(offerFixture({ rewardType: 'fixed-points', rewardValue: 9999 }))).toBe('pts-5k');
    });

    it('pts-1k for 1,000-4,999 points', () => {
        expect(bucketize(offerFixture({ rewardType: 'fixed-points', rewardValue: 1000 }))).toBe('pts-1k');
        expect(bucketize(offerFixture({ rewardType: 'fixed-points', rewardValue: 3700 }))).toBe('pts-1k');
    });

    it('pts-lt-1k for <1,000 points', () => {
        expect(bucketize(offerFixture({ rewardType: 'fixed-points', rewardValue: 100 }))).toBe('pts-lt-1k');
        expect(bucketize(offerFixture({ rewardType: 'fixed-points', rewardValue: 999 }))).toBe('pts-lt-1k');
    });
});

describe('bucketize special buckets and precedence', () => {
    it('events bucket for bucketCategory=events', () => {
        expect(bucketize(offerFixture({ bucketCategory: 'events', rewardType: 'percent', rewardValue: 5 }))).toBe('events');
    });

    it('price-drops bucket for bucketCategory=price-drops', () => {
        expect(bucketize(offerFixture({ bucketCategory: 'price-drops' }))).toBe('price-drops');
    });

    it('new-customer bucket for bucketCategory=new-customer', () => {
        expect(bucketize(offerFixture({ bucketCategory: 'new-customer' }))).toBe('new-customer');
    });

    it('recently-viewed bucket for bucketCategory=recently-viewed', () => {
        expect(bucketize(offerFixture({ bucketCategory: 'recently-viewed' }))).toBe('recently-viewed');
    });

    it('special takes precedence over value: event with 5% goes to events not pct-1', () => {
        const ev = offerFixture({ bucketCategory: 'events', rewardType: 'percent', rewardValue: 5 });
        expect(bucketize(ev)).toBe('events');
    });
});

//=============================================================================
// normalizeShoppingOffer
//=============================================================================

describe('normalizeShoppingOffer', () => {
    it('normalizes great_deal -> price-drops bucketCategory with percent reward', () => {
        const o = normalizeShoppingOffer(shoppingGreatDeal)!;
        expect(o).not.toBeNull();
        expect(o.source).toBe('shopping');
        expect(o.itemType).toBe('great_deal');
        expect(o.merchant).toBe('Chewy');
        expect(o.rewardType).toBe('percent');
        expect(o.rewardValue).toBe(2);
        expect(o.bucketCategory).toBe('price-drops');
        expect(o.priceHistory).toEqual([{ date: '2026-03-01', list_price: 99.99 }]);
        expect(o.pill).toBe('Price Drop');
    });

    it('normalizes event_placement -> events bucketCategory', () => {
        const o = normalizeShoppingOffer(shoppingEvent)!;
        expect(o.bucketCategory).toBe('events');
        expect(o.itemType).toBe('event_placement');
        expect(o.merchant).toBe('Best Western');
        expect(o.eventEnd).toBe('2026-06-06T04:59:00.000Z');
        expect(o.rewardType).toBe('percent');
        expect(o.rewardValue).toBe(5);
    });

    it('normalizes retarget_non_product -> recently-viewed bucketCategory', () => {
        const o = normalizeShoppingOffer(shoppingRetarget)!;
        expect(o.bucketCategory).toBe('recently-viewed');
        expect(o.itemType).toBe('retarget_non_product');
        expect(o.merchant).toBe('SHEIN');
    });

    it('normalizes retarget the same as retarget_non_product (recently-viewed)', () => {
        const o = normalizeShoppingOffer({ ...shoppingRetarget, type: 'retarget' })!;
        expect(o.bucketCategory).toBe('recently-viewed');
    });

    it('normalizes nca_deal -> new-customer bucketCategory', () => {
        const o = normalizeShoppingOffer(shoppingNewCustomer)!;
        expect(o.bucketCategory).toBe('new-customer');
        expect(o.itemType).toBe('nca_deal');
        expect(o.rewardType).toBe('fixed-cash');
        expect(o.rewardValue).toBeCloseTo(10);
    });

    it('normalizes generic_store_placement with cut rewardType using highest tier and "Up to" prefix', () => {
        const o = normalizeShoppingOffer(shoppingCut)!;
        expect(o.bucketCategory).toBe('value');
        expect(o.rewardType).toBe('percent');
        // Highest tier of cashbackCategories is 5%
        expect(o.rewardValue).toBe(5);
        expect(o.rewardDisplay.toLowerCase()).toContain('up to');
        expect(o.rewardDisplay).toContain('5%');
    });

    it('normalizes solo_category to value bucket', () => {
        const o = normalizeShoppingOffer({ ...shoppingGreatDeal, type: 'solo_category', stats: { cashback: '3%', cashbackV2: '3%', rewardType: 'percentage', isCutType: false } })!;
        expect(o.bucketCategory).toBe('value');
        expect(o.itemType).toBe('solo_category');
    });

    it('normalizes event_placement fixed-cash to events bucket with fixed-cash reward', () => {
        const o = normalizeShoppingOffer(shoppingFixedCash)!;
        expect(o.bucketCategory).toBe('events');
        expect(o.rewardType).toBe('fixed-cash');
        expect(o.rewardValue).toBeCloseTo(17.5);
    });

    it('sets activation.method=href and activation.url=item.href verbatim', () => {
        const o = normalizeShoppingOffer(shoppingGreatDeal)!;
        expect(o.activation.method).toBe('href');
        expect(o.activation.url).toBe('https://capitaloneshopping.com/api/v3/r?d=ENCODED&t=JWT');
    });

    it('returns null when item has no merchant and no domain', () => {
        const bad: RawShoppingFeedItem = {
            type: 'generic_store_placement',
            stats: { cashback: '5%', cashbackV2: '5%', rewardType: 'percentage', isCutType: false },
            href: 'https://x/r'
        };
        expect(normalizeShoppingOffer(bad)).toBeNull();
    });

    it('returns null when item is missing href', () => {
        const bad: RawShoppingFeedItem = {
            type: 'generic_store_placement',
            merchantName: 'Foo',
            stats: { cashback: '5%', cashbackV2: '5%', rewardType: 'percentage', isCutType: false }
        };
        expect(normalizeShoppingOffer(bad)).toBeNull();
    });

    it('carries exclusionsText through to exclusions field', () => {
        const o = normalizeShoppingOffer(shoppingGreatDeal)!;
        expect(o.exclusions).toBe('Not eligible for gift cards.');
    });
});

//=============================================================================
// normalizeOffersFeedTile
//=============================================================================

describe('normalizeOffersFeedTile', () => {
    it('normalizes Standard tile with multiplier reward', () => {
        const out = normalizeOffersFeedTile(offersStandard, ctx);
        expect(out).toHaveLength(1);
        const o = out[0];
        expect(o.source).toBe('offers');
        expect(o.itemType).toBe('Standard');
        expect(o.merchant).toBe('woot.com');
        expect(o.domain).toBe('woot.com');
        expect(o.rewardType).toBe('multiplier');
        expect(o.rewardValue).toBe(4);
    });

    it('normalizes Standard with large multiplier "Up to 22X miles"', () => {
        const out = normalizeOffersFeedTile(offersFixedPoints, ctx);
        expect(out[0].rewardType).toBe('multiplier');
        expect(out[0].rewardValue).toBe(22);
    });

    it('normalizes Standard with fixed-points "Up to 22,500 miles"', () => {
        const out = normalizeOffersFeedTile(offersBig, ctx);
        expect(out[0].rewardType).toBe('fixed-points');
        expect(out[0].rewardValue).toBe(22500);
    });

    it('normalizes Hero tile', () => {
        const out = normalizeOffersFeedTile(offersHero, ctx);
        expect(out[0].itemType).toBe('Hero');
        expect(out[0].rewardType).toBe('fixed-points');
        expect(out[0].rewardValue).toBe(5000);
    });

    it('flattens Carousel into N offers (one per nested tile)', () => {
        const out = normalizeOffersFeedTile(offersCarousel, ctx);
        expect(out).toHaveLength(2);
        expect(out.map(o => o.merchant)).toEqual(['levi.com', 'grammarly.com']);
        expect(out[0].rewardType).toBe('multiplier');
        expect(out[0].rewardValue).toBe(8);
        expect(out[1].rewardType).toBe('fixed-points');
        expect(out[1].rewardValue).toBe(3700);
    });

    it('sets activation.method=post-offers', () => {
        const out = normalizeOffersFeedTile(offersStandard, ctx);
        expect(out[0].activation.method).toBe('post-offers');
    });

    it('builds activation URL with URL-encoded userId and raw tileId', () => {
        const out = normalizeOffersFeedTile(offersStandard, ctx);
        const expectedUserId = encodeURIComponent(ctx.userId);
        // Verify userId is URL-encoded
        expect(out[0].activation.url).toContain(expectedUserId);
        // Verify tileId is included raw (not double-encoded)
        expect(out[0].activation.url).toContain(offersStandard.id!);
        expect(out[0].activation.url).toMatch(/\?_data$/);
        expect(out[0].activation.url.startsWith('https://capitaloneoffers.com/feed/')).toBe(true);
    });

    it('encodes userId with "+" -> "%2B" (Cap One IDs commonly contain +)', () => {
        const out = normalizeOffersFeedTile(offersStandard, ctx);
        // ctx.userId contains '+' and '='
        expect(out[0].activation.url).toContain('%2B');
        expect(out[0].activation.url).toContain('%3D');
    });

    it('returns empty array for Carousel with no tiles', () => {
        const empty: RawOffersFeedTile = { type: 'Carousel' };
        expect(normalizeOffersFeedTile(empty, ctx)).toEqual([]);
    });

    it('returns empty array for tile missing id and merchantTLD', () => {
        const bad: RawOffersFeedTile = { type: 'Standard', buttonText: '5X miles' };
        expect(normalizeOffersFeedTile(bad, ctx)).toEqual([]);
    });

    it('handles Showcase and Spotlight tile types as offers', () => {
        const showcase: RawOffersFeedTile = { type: 'Showcase', merchantTLD: 'x.com', id: 'eyJzfQ==', buttonText: '5X miles' };
        const spotlight: RawOffersFeedTile = { type: 'Spotlight', merchantTLD: 'y.com', id: 'eyJzcGZ9', buttonText: '10X miles' };
        const s = normalizeOffersFeedTile(showcase, ctx);
        const p = normalizeOffersFeedTile(spotlight, ctx);
        expect(s).toHaveLength(1);
        expect(p).toHaveLength(1);
        expect(s[0].itemType).toBe('Showcase');
        expect(p[0].itemType).toBe('Spotlight');
    });
});

//=============================================================================
// processBrowseData
//=============================================================================

describe('processBrowseData', () => {
    it('groups offers into buckets and computes stats', () => {
        const a = offerFixture({ id: 'a', rewardType: 'multiplier', rewardValue: 30 }); // mult-30
        const b = offerFixture({ id: 'b', rewardType: 'multiplier', rewardValue: 22 }); // mult-20
        const c = offerFixture({ id: 'c', rewardType: 'percent', rewardValue: 5 });     // pct-1
        const d = offerFixture({ id: 'd', bucketCategory: 'events', rewardType: 'percent', rewardValue: 5 }); // events
        const data = processBrowseData([a, b, c, d]);
        expect(data.stats.total).toBe(4);
        expect(data.buckets['mult-30']?.length).toBe(1);
        expect(data.buckets['mult-20']?.length).toBe(1);
        expect(data.buckets['pct-1']?.length).toBe(1);
        expect(data.buckets['events']?.length).toBe(1);
        expect(data.stats.byBucket['mult-30']).toBe(1);
    });

    it('sorts within bucket descending by rewardValue', () => {
        const a = offerFixture({ id: 'a', rewardType: 'multiplier', rewardValue: 10 });
        const b = offerFixture({ id: 'b', rewardType: 'multiplier', rewardValue: 15 });
        const c = offerFixture({ id: 'c', rewardType: 'multiplier', rewardValue: 12 });
        const data = processBrowseData([a, b, c]);
        const bucket = data.buckets['mult-10']!;
        expect(bucket.map(o => o.rewardValue)).toEqual([15, 12, 10]);
    });

    it('bucketOrder lists specials first then value buckets from highest tier down', () => {
        const offers = [
            offerFixture({ id: '1', bucketCategory: 'events', rewardType: 'percent', rewardValue: 5 }),
            offerFixture({ id: '2', bucketCategory: 'price-drops', rewardType: 'percent', rewardValue: 2 }),
            offerFixture({ id: '3', rewardType: 'multiplier', rewardValue: 30 }),
            offerFixture({ id: '4', rewardType: 'multiplier', rewardValue: 1 }),
            offerFixture({ id: '5', rewardType: 'percent', rewardValue: 40 }),
            offerFixture({ id: '6', rewardType: 'fixed-points', rewardValue: 10000 }),
            offerFixture({ id: '7', rewardType: 'fixed-points', rewardValue: 500 })
        ];
        const data = processBrowseData(offers);
        // Specials should come first
        const eventsIdx = data.bucketOrder.indexOf('events');
        const priceDropsIdx = data.bucketOrder.indexOf('price-drops');
        const mult30Idx = data.bucketOrder.indexOf('mult-30');
        const mult1Idx = data.bucketOrder.indexOf('mult-1');
        const pct40Idx = data.bucketOrder.indexOf('pct-40');
        expect(eventsIdx).toBeGreaterThanOrEqual(0);
        expect(priceDropsIdx).toBeGreaterThanOrEqual(0);
        expect(eventsIdx).toBeLessThan(mult30Idx);
        expect(priceDropsIdx).toBeLessThan(mult30Idx);
        // High tier multiplier before low tier
        expect(mult30Idx).toBeLessThan(mult1Idx);
        // pct-40 should come after mult buckets but before pts buckets? Actually the plan
        // says "value buckets from highest tier down" — multiplier first then percent then
        // cash then points
        expect(mult30Idx).toBeLessThan(pct40Idx);
    });

    it('only includes buckets that have at least one offer in bucketOrder', () => {
        const data = processBrowseData([offerFixture({ rewardType: 'multiplier', rewardValue: 30 })]);
        expect(data.bucketOrder).toEqual(['mult-30']);
    });

    it('empty input produces empty output with total=0', () => {
        const data = processBrowseData([]);
        expect(data.stats.total).toBe(0);
        expect(data.bucketOrder).toEqual([]);
        expect(Object.keys(data.buckets)).toHaveLength(0);
    });
});

//=============================================================================
// walkShoppingFeed
//=============================================================================

describe('walkShoppingFeed', () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    it('POSTs to /api/v1/feed, threads nextPageToken, stops at empty token', async () => {
        const page1 = {
            count: 1,
            pagination: { limit: 25, nextPageToken: 'tok2' },
            items: [shoppingGreatDeal]
        };
        const page2 = {
            count: 1,
            pagination: { limit: 25, nextPageToken: null },
            items: [shoppingEvent]
        };
        const fetchMock = vi.fn<typeof fetch>()
            .mockResolvedValueOnce({ ok: true, json: async () => page1 } as Response)
            .mockResolvedValueOnce({ ok: true, json: async () => page2 } as Response);
        vi.stubGlobal('fetch', fetchMock);

        const r = await walkShoppingFeed();
        expect(fetchMock).toHaveBeenCalledTimes(2);
        expect(fetchMock.mock.calls[0]?.[0]).toBe('/api/v1/feed');
        const opts0 = fetchMock.mock.calls[0]?.[1] as RequestInit;
        expect(opts0.method).toBe('POST');
        // Body should reference pagination
        const body0 = JSON.parse(opts0.body as string);
        expect(body0.contentProps?.pagination?.nextPageToken).toBeFalsy();
        // Second call's body should have the token from page1
        const body1 = JSON.parse((fetchMock.mock.calls[1]?.[1] as RequestInit).body as string);
        expect(body1.contentProps?.pagination?.nextPageToken).toBe('tok2');
        expect(r.items).toHaveLength(2);
        expect(r.hitCap).toBe(false);
    });

    it('dedupes items by composite key when no id is present', async () => {
        const page1 = {
            pagination: { nextPageToken: 'tok2' },
            items: [shoppingGreatDeal]
        };
        const page2 = {
            pagination: { nextPageToken: null },
            // Same merchant, rewardDisplay, type — should dedupe
            items: [shoppingGreatDeal]
        };
        const fetchMock = vi.fn<typeof fetch>()
            .mockResolvedValueOnce({ ok: true, json: async () => page1 } as Response)
            .mockResolvedValueOnce({ ok: true, json: async () => page2 } as Response);
        vi.stubGlobal('fetch', fetchMock);

        const r = await walkShoppingFeed();
        expect(r.items).toHaveLength(1);
    });

    it('respects maxPages=40 cap and reports hitCap=true', async () => {
        // Always returns a page with a next-token and one item — would otherwise loop forever
        let counter = 0;
        const fetchMock = vi.fn<typeof fetch>().mockImplementation(async () => ({
            ok: true,
            json: async () => ({
                pagination: { nextPageToken: 'next-' + (counter++) },
                items: [{ ...shoppingGreatDeal, merchantName: 'M' + counter, href: 'http://h/' + counter }]
            })
        } as Response));
        vi.stubGlobal('fetch', fetchMock);

        const r = await walkShoppingFeed();
        expect(fetchMock).toHaveBeenCalledTimes(40);
        expect(r.hitCap).toBe(true);
        expect(r.pagesWalked).toBe(40);
    });

    it('invokes onPage callback after each page', async () => {
        const page1 = { pagination: { nextPageToken: null }, items: [shoppingGreatDeal] };
        const fetchMock = vi.fn<typeof fetch>().mockResolvedValue({ ok: true, json: async () => page1 } as Response);
        vi.stubGlobal('fetch', fetchMock);

        const onPage = vi.fn();
        await walkShoppingFeed(onPage);
        expect(onPage).toHaveBeenCalledTimes(1);
        expect(onPage).toHaveBeenCalledWith(1, 1);
    });

    it('stops on empty items if no next-token', async () => {
        const page = { pagination: { nextPageToken: null }, items: [] };
        const fetchMock = vi.fn<typeof fetch>().mockResolvedValue({ ok: true, json: async () => page } as Response);
        vi.stubGlobal('fetch', fetchMock);

        const r = await walkShoppingFeed();
        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect(r.items).toHaveLength(0);
    });
});

//=============================================================================
// walkOffersFeed
//=============================================================================

describe('walkOffersFeed', () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    it('GETs /feed/{userId}?numberOfColumnsInGrid=5&viewInstanceId=...&contentSlug=ease-web-l1 on first call', async () => {
        const page = { cursor: null, data: [offersStandard] };
        const fetchMock = vi.fn<typeof fetch>().mockResolvedValue({ ok: true, json: async () => page } as Response);
        vi.stubGlobal('fetch', fetchMock);

        await walkOffersFeed(ctx);
        const url = fetchMock.mock.calls[0]?.[0] as string;
        expect(url).toContain('/feed/' + encodeURIComponent(ctx.userId));
        expect(url).toContain('numberOfColumnsInGrid=5');
        expect(url).toContain('viewInstanceId=' + ctx.viewInstanceId);
        expect(url).toContain('contentSlug=ease-web-l1');
        // No cursor on first call
        expect(url).not.toContain('cursor=');
    });

    it('appends cursor=... on subsequent calls and stops on null cursor', async () => {
        const page1 = { cursor: 'CURSOR2', data: [offersStandard] };
        const page2 = { cursor: null, data: [offersHero] };
        const fetchMock = vi.fn<typeof fetch>()
            .mockResolvedValueOnce({ ok: true, json: async () => page1 } as Response)
            .mockResolvedValueOnce({ ok: true, json: async () => page2 } as Response);
        vi.stubGlobal('fetch', fetchMock);

        const r = await walkOffersFeed(ctx);
        expect(fetchMock).toHaveBeenCalledTimes(2);
        const url2 = fetchMock.mock.calls[1]?.[0] as string;
        expect(url2).toContain('cursor=CURSOR2');
        expect(r.items).toHaveLength(2);
        expect(r.hitCap).toBe(false);
    });

    it('flattens Carousel tiles into the items stream', async () => {
        const page = { cursor: null, data: [offersCarousel] };
        const fetchMock = vi.fn<typeof fetch>().mockResolvedValue({ ok: true, json: async () => page } as Response);
        vi.stubGlobal('fetch', fetchMock);

        const r = await walkOffersFeed(ctx);
        // Carousel has 2 nested tiles
        expect(r.items).toHaveLength(2);
        expect(r.items.map(o => o.merchant)).toEqual(['levi.com', 'grammarly.com']);
    });

    it('dedupes by id when present', async () => {
        const dupTile = { ...offersStandard };
        const page1 = { cursor: 'c2', data: [dupTile] };
        const page2 = { cursor: null, data: [dupTile] };
        const fetchMock = vi.fn<typeof fetch>()
            .mockResolvedValueOnce({ ok: true, json: async () => page1 } as Response)
            .mockResolvedValueOnce({ ok: true, json: async () => page2 } as Response);
        vi.stubGlobal('fetch', fetchMock);

        const r = await walkOffersFeed(ctx);
        expect(r.items).toHaveLength(1);
    });
});

//=============================================================================
// getOffersBrowseContext
//=============================================================================

describe('getOffersBrowseContext', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
        document.head.innerHTML = '';
        // Reset window.__NEXT_DATA__
        try {
            delete (window as unknown as Record<string, unknown>)['__NEXT_DATA__'];
        } catch { /* ignore */ }
    });

    it('reads userId + viewInstanceId from __NEXT_DATA__ script tag', () => {
        const script = document.createElement('script');
        script.id = '__NEXT_DATA__';
        script.type = 'application/json';
        const payload = {
            props: {
                pageProps: {
                    userId: 'USER_FROM_NEXT',
                    viewInstanceId: 'VIEW_INSTANCE_FROM_NEXT'
                }
            }
        };
        script.textContent = JSON.stringify(payload);
        document.head.appendChild(script);

        const c = getOffersBrowseContext();
        expect(c).not.toBeNull();
        expect(c!.userId).toBe('USER_FROM_NEXT');
        expect(c!.viewInstanceId).toBe('VIEW_INSTANCE_FROM_NEXT');
    });

    it('walks nested __NEXT_DATA__ for accountReferenceId as an alternate userId source', () => {
        const script = document.createElement('script');
        script.id = '__NEXT_DATA__';
        script.type = 'application/json';
        const payload = {
            props: {
                pageProps: {
                    nested: { accountReferenceId: 'ACCT_REF_ID', viewInstanceId: 'VIID' }
                }
            }
        };
        script.textContent = JSON.stringify(payload);
        document.head.appendChild(script);

        const c = getOffersBrowseContext();
        expect(c).not.toBeNull();
        expect(c!.userId).toBe('ACCT_REF_ID');
        expect(c!.viewInstanceId).toBe('VIID');
    });

    it('returns null when __NEXT_DATA__ has neither id nor a derivable URL', () => {
        // No __NEXT_DATA__, default URL has no /feed/{userId}
        const original = window.location.href;
        window.location.href = 'https://capitaloneoffers.com/other';
        const c = getOffersBrowseContext();
        expect(c).toBeNull();
        window.location.href = original;
    });

    it('returns null when __NEXT_DATA__ is malformed JSON', () => {
        const script = document.createElement('script');
        script.id = '__NEXT_DATA__';
        script.type = 'application/json';
        script.textContent = '{this is not json';
        document.head.appendChild(script);

        const original = window.location.href;
        window.location.href = 'https://capitaloneoffers.com/other';
        const c = getOffersBrowseContext();
        expect(c).toBeNull();
        window.location.href = original;
    });

    it('falls back to URL path /feed/{userId} + generated viewInstanceId when __NEXT_DATA__ absent', () => {
        const original = window.location.href;
        window.location.href = 'https://capitaloneoffers.com/feed/USER_FROM_URL';
        // Stub crypto.randomUUID if missing
        if (typeof crypto === 'undefined' || !crypto.randomUUID) {
            vi.stubGlobal('crypto', { randomUUID: () => '00000000-0000-4000-8000-000000000000' });
        }
        const c = getOffersBrowseContext();
        expect(c).not.toBeNull();
        expect(c!.userId).toBe('USER_FROM_URL');
        expect(c!.viewInstanceId).toMatch(/[0-9a-f-]{36}/);
        window.location.href = original;
    });
});

//=============================================================================
// renderBrowseToModal
//=============================================================================

describe('renderBrowseToModal', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
        vi.restoreAllMocks();
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });

    function makeOverlay(): HTMLElement {
        const overlay = document.createElement('div');
        overlay.id = 'c1t-overlay';
        const content = document.createElement('div');
        content.id = 'c1t-content';
        overlay.appendChild(content);
        document.body.appendChild(overlay);
        return overlay;
    }

    function makeBrowseData(): BrowseData {
        const offers: Offer[] = [
            // Specials
            {
                id: 'a', source: 'shopping', itemType: 'event_placement', merchant: 'Best Western',
                domain: 'bestwestern.com', rewardType: 'percent', rewardValue: 5, rewardDisplay: '5%',
                activation: { method: 'href', url: 'https://capitaloneshopping.com/api/v3/r?d=A&t=J' },
                bucketCategory: 'events', pill: 'Limited Time', exclusions: '', eventEnd: '2026-06-06T04:59:00Z',
                priceHistory: null, raw: {}
            },
            // mult-30 (high-value)
            {
                id: 'b', source: 'offers', itemType: 'Standard', merchant: 'doordash.com',
                domain: 'doordash.com', rewardType: 'multiplier', rewardValue: 30, rewardDisplay: '30X miles',
                activation: { method: 'post-offers', url: 'https://capitaloneoffers.com/feed/U/offers/T?_data' },
                bucketCategory: 'value', pill: null, exclusions: '', eventEnd: null, priceHistory: null, raw: {}
            },
            // mult-1 (low-value, should be collapsed initially)
            {
                id: 'c', source: 'offers', itemType: 'Standard', merchant: 'woot.com',
                domain: 'woot.com', rewardType: 'multiplier', rewardValue: 2, rewardDisplay: '2X miles',
                activation: { method: 'post-offers', url: 'https://capitaloneoffers.com/feed/U/offers/T2?_data' },
                bucketCategory: 'value', pill: null, exclusions: '', eventEnd: null, priceHistory: null, raw: {}
            }
        ];
        return processBrowseData(offers);
    }

    it('renders <details data-bucket-id="..."> for each present bucket', () => {
        const overlay = makeOverlay();
        const data = makeBrowseData();
        renderBrowseToModal(overlay, data);
        const buckets = overlay.querySelectorAll('details[data-bucket-id]');
        // events + mult-30 + mult-1
        expect(buckets.length).toBe(3);
        const ids = Array.from(buckets).map(d => (d as HTMLElement).dataset.bucketId);
        expect(ids).toContain('events');
        expect(ids).toContain('mult-30');
        expect(ids).toContain('mult-1');
    });

    it('high-value and special buckets render with open attribute, low-value collapsed', () => {
        const overlay = makeOverlay();
        const data = makeBrowseData();
        renderBrowseToModal(overlay, data);

        const events = overlay.querySelector('details[data-bucket-id="events"]') as HTMLDetailsElement;
        const mult30 = overlay.querySelector('details[data-bucket-id="mult-30"]') as HTMLDetailsElement;
        const mult1 = overlay.querySelector('details[data-bucket-id="mult-1"]') as HTMLDetailsElement;
        expect(events.open).toBe(true);
        expect(mult30.open).toBe(true);
        expect(mult1.open).toBe(false);
    });

    it('rows have data-method and data-activation-url dataset for shopping (href) and offers (post-offers)', () => {
        const overlay = makeOverlay();
        const data = makeBrowseData();
        renderBrowseToModal(overlay, data);

        const rows = overlay.querySelectorAll('tr[data-method]');
        expect(rows.length).toBe(3);

        const shoppingRow = overlay.querySelector('tr[data-method="href"]') as HTMLElement;
        expect(shoppingRow).not.toBeNull();
        expect(shoppingRow.dataset.activationUrl).toBe('https://capitaloneshopping.com/api/v3/r?d=A&t=J');

        const offersRow = overlay.querySelector('tr[data-method="post-offers"]') as HTMLElement;
        expect(offersRow).not.toBeNull();
        expect(offersRow.dataset.activationUrl).toContain('?_data');
    });

    it('clicking a shopping (href) row calls window.open(url, "_blank", "noopener")', () => {
        const overlay = makeOverlay();
        const data = makeBrowseData();
        renderBrowseToModal(overlay, data);

        const openMock = vi.fn().mockReturnValue(null);
        vi.stubGlobal('open', openMock);

        const row = overlay.querySelector('tr[data-method="href"]') as HTMLElement;
        row.click();

        expect(openMock).toHaveBeenCalledWith(
            'https://capitaloneshopping.com/api/v3/r?d=A&t=J',
            '_blank',
            'noopener'
        );
    });

    it('clicking an offers (post-offers) row opens about:blank synchronously, then awaits fetch and sets tab.location', async () => {
        const overlay = makeOverlay();
        const data = makeBrowseData();
        renderBrowseToModal(overlay, data);

        const tab = { location: '' as string, close: vi.fn() };
        const openMock = vi.fn().mockReturnValue(tab);
        vi.stubGlobal('open', openMock);

        const fetchMock = vi.fn<typeof fetch>().mockResolvedValue({
            ok: true,
            json: async () => ({ affiliate: { redirectUrl: 'https://capitaloneshopping.com/s/m/coupon?aff=JWT' } })
        } as Response);
        vi.stubGlobal('fetch', fetchMock);

        const row = overlay.querySelector('tr[data-method="post-offers"]') as HTMLElement;
        row.click();

        // First call to window.open should be about:blank (synchronous, pre-fetch)
        expect(openMock).toHaveBeenCalledWith('about:blank', '_blank');

        // Allow the async chain in the click handler to resolve
        await new Promise(resolve => setTimeout(resolve, 0));
        await new Promise(resolve => setTimeout(resolve, 0));

        expect(fetchMock).toHaveBeenCalledTimes(1);
        const [url, opts] = fetchMock.mock.calls[0]!;
        expect(url).toContain('?_data');
        expect((opts as RequestInit).method).toBe('POST');
        expect((opts as RequestInit).credentials).toBe('include');

        expect(tab.location).toBe('https://capitaloneshopping.com/s/m/coupon?aff=JWT');
    });

    it('renders quick-jump chip for each present top-level bucket group', () => {
        const overlay = makeOverlay();
        const data = makeBrowseData();
        renderBrowseToModal(overlay, data);
        const chips = overlay.querySelectorAll('.c1t-jump-chip');
        // Specials present: events. Multiplier present (mult-30 and mult-1).
        expect(chips.length).toBeGreaterThanOrEqual(2);
    });
});

// Type guard helper used to satisfy noUnusedParameters in test fixtures imports
const _id: BucketId = 'events';
void _id;
const _rt: RewardType = 'percent';
void _rt;
