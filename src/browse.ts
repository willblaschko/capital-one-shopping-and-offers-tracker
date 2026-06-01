//=============================================================================
// browse.ts — Catalog feed walker, normalizer, bucketing, renderer.
//
// THIS IS A STUB. Agent C will overwrite it with the real implementation.
// The stub exists so Agent B (entry-point conversion, parallel worktree)
// can import from this module and have TypeScript resolve the symbols.
//
// The public API below must match the final implementation. If you need
// to change a signature, update src/types.ts (the shared contract) and
// flag the change so Agent B's imports stay valid.
//=============================================================================

import type {
    BrowseData,
    Offer,
    OffersBrowseContext,
    RawShoppingFeedItem,
    RawOffersFeedTile,
    RenderFn,
    WalkResult,
    BucketId
} from './types.js';

const NOT_IMPLEMENTED = 'browse.ts stub — Agent C has not landed yet';

export function parseRewardDisplay(_str: string): {
    type: Offer['rewardType'];
    value: number;
    display: string;
} {
    throw new Error(NOT_IMPLEMENTED);
}

export function normalizeShoppingOffer(_raw: RawShoppingFeedItem): Offer | null {
    throw new Error(NOT_IMPLEMENTED);
}

export function normalizeOffersFeedTile(
    _raw: RawOffersFeedTile,
    _ctx: OffersBrowseContext
): Offer[] {
    throw new Error(NOT_IMPLEMENTED);
}

export function bucketize(_offer: Offer): BucketId {
    throw new Error(NOT_IMPLEMENTED);
}

export function processBrowseData(_offers: Offer[]): BrowseData {
    throw new Error(NOT_IMPLEMENTED);
}

export function getOffersBrowseContext(): OffersBrowseContext | null {
    throw new Error(NOT_IMPLEMENTED);
}

export async function walkShoppingFeed(
    _onPage?: (pages: number, total: number) => void
): Promise<WalkResult<Offer>> {
    throw new Error(NOT_IMPLEMENTED);
}

export async function walkOffersFeed(
    _ctx: OffersBrowseContext,
    _onPage?: (pages: number, total: number) => void
): Promise<WalkResult<Offer>> {
    throw new Error(NOT_IMPLEMENTED);
}

export const renderBrowseToModal: RenderFn<BrowseData> = () => {
    throw new Error(NOT_IMPLEMENTED);
};
