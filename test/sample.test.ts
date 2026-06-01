//=============================================================================
// Sample test file — pattern reference for the conversion agents.
//
// Demonstrates:
//   - vitest + happy-dom environment
//   - importing from src/types.ts (shared type contract)
//   - structuring describe/it blocks per module
//   - mocking fetch globally
//   - DOM assertions via happy-dom
//
// Real tests live in test/<module>.test.ts (one per src module).
// Delete this file once real tests exist.
//=============================================================================

import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { Activation, Offer, RewardType } from '../src/types.js';

describe('sample: type contracts compile', () => {
    it('Activation discriminated union narrows correctly', () => {
        const a: Activation = { method: 'href', url: 'https://example.com/r?t=jwt' };
        if (a.method === 'href') {
            expect(a.url).toContain('https://');
        } else {
            // TS narrows to never here if all cases handled
        }
    });

    it('Offer shape accepts all expected RewardType values', () => {
        const types: RewardType[] = ['multiplier', 'percent', 'fixed-cash', 'fixed-points', 'cut', 'unknown'];
        expect(types).toHaveLength(6);
    });
});

describe('sample: happy-dom is wired', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
    });

    it('can manipulate the DOM', () => {
        const el = document.createElement('div');
        el.id = 'foo';
        el.textContent = 'bar';
        document.body.appendChild(el);
        expect(document.getElementById('foo')?.textContent).toBe('bar');
    });

    it('can simulate clicks', () => {
        const btn = document.createElement('button');
        let clicked = false;
        btn.addEventListener('click', () => { clicked = true; });
        document.body.appendChild(btn);
        btn.click();
        expect(clicked).toBe(true);
    });
});

describe('sample: fetch mocking pattern', () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    it('mocks fetch and asserts on call args', async () => {
        const mockJson = { items: [{ id: 1 }], pagination: { nextPageToken: 'abc' } };
        const fetchMock = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => mockJson
        } as Response);
        vi.stubGlobal('fetch', fetchMock);

        const r = await fetch('/api/v1/feed', { method: 'POST' });
        const data = await r.json();
        expect(data).toEqual(mockJson);
        expect(fetchMock).toHaveBeenCalledWith('/api/v1/feed', expect.objectContaining({ method: 'POST' }));
    });
});

describe('sample: window.location stubbing pattern', () => {
    it('can override pathname/hostname for detectMode tests', () => {
        // happy-dom allows direct assignment to window.location.href
        // Use this pattern in core.test.ts to test detectMode under various URLs.
        const original = window.location.href;
        window.location.href = 'https://capitaloneoffers.com/feed';
        expect(window.location.pathname).toBe('/feed');
        expect(window.location.hostname).toBe('capitaloneoffers.com');
        window.location.href = original;
    });
});

// Placeholder so the test runner has an example Offer to import.
const _sampleOffer: Offer = {
    id: 'sample-1',
    source: 'shopping',
    itemType: 'great_deal',
    merchant: 'Chewy',
    domain: 'chewy.com',
    rewardType: 'percent',
    rewardValue: 2,
    rewardDisplay: '2%',
    activation: { method: 'href', url: 'https://capitaloneshopping.com/api/v3/r?d=...&t=...' },
    bucketCategory: 'price-drops',
    pill: 'Price Drop',
    exclusions: 'Not eligible for gift cards.',
    eventEnd: null,
    priceHistory: null,
    raw: {}
};
void _sampleOffer;
