//=============================================================================
// Shared types for Capital One Shopping & Offers Tracker
//=============================================================================

// ---- Site & mode ----

export type Site = 'shopping' | 'offers';
export type Mode = 'trips' | 'browse';

export interface SiteConfig {
    hostname: string;
    pages: { trips: string; browse: string };
    trips: {
        apiPattern: (url: string) => boolean;
        apiEndpoint: string;
    };
    browse: {
        apiPattern: (url: string) => boolean;
        apiEndpoint?: string;
    };
}

export type ConfigMap = Record<Site, SiteConfig>;

// ---- Trips (existing schema, normalized) ----

export type TripStatus =
    | 'Completed'
    | 'Pending ✓'
    | 'Pending ?'
    | 'Created'
    | 'Canceled'
    | 'Adjusted'
    | string;

export interface Trip {
    id: string | number | null;
    tripId: string | number | null;
    orderId: string | number | null;
    merchant: string;
    domain: string | null;
    status: TripStatus;
    rawStatus: string;
    orderAmount: number | null;
    creditAmount: number | null;
    date: string | null;
    hasOrderId: boolean;
    hasAmount: boolean;
    hasCreditAmount: boolean;
    raw: RawTrip;
}

export interface TripStats {
    total: number;
    withOrderId: number;
    withAmount: number;
    withCredit: number;
    pending: number;
    created: number;
}

export interface TripsData {
    trips: Trip[];
    stats: TripStats;
}

// Raw trip shape is union-of-unions across the two sites/APIs.
// Use a permissive shape; the normalizer reads with optional chaining.
export interface RawTrip {
    id?: string | number;
    tripId?: string | number;
    trip_id?: string | number;
    orderId?: string | number;
    order_id?: string | number;
    orderAmount?: number | string;
    order_amount?: number | string;
    creditAmount?: number | string;
    credit_amount?: number | string;
    trxnTotalCents?: number;
    payoutAmountCents?: number;
    vendor?: string;
    merchantName?: string;
    merchantDisplayName?: string;
    merchant?: string;
    domain?: string;
    status?: string;
    createdAt?: string;
    created_at?: string;
    clickDate?: string;
    date?: string;
    activatedOfferId?: string;
    accountCurrency?: 'miles' | 'cashback' | string;
    payoutMechanism?: string;
    [k: string]: unknown;
}

// ---- Browse (catalog feeds) ----

export type RewardType =
    | 'multiplier'
    | 'percent'
    | 'fixed-cash'
    | 'fixed-points'
    | 'cut'
    | 'unknown';

export type BucketCategory =
    | 'value'
    | 'events'
    | 'price-drops'
    | 'new-customer'
    | 'recently-viewed';

// Discriminated union for activation method.
export type Activation =
    | { method: 'href'; url: string }
    | { method: 'post-offers'; url: string };

export interface Offer {
    id: string;
    source: Site;
    itemType: string;
    merchant: string;
    domain: string;
    rewardType: RewardType;
    rewardValue: number;
    rewardDisplay: string;
    activation: Activation;
    bucketCategory: BucketCategory;
    pill: string | null;
    exclusions: string;
    eventEnd: string | null;
    priceHistory: PriceHistoryPoint[] | null;
    raw: unknown;
}

export interface PriceHistoryPoint {
    date: string;
    list_price: number;
}

// Bucket IDs are string-literal unions so typos in CSS class names and
// renderer logic get caught at compile time.
export type ValueBucketId =
    | 'mult-30' | 'mult-20' | 'mult-10' | 'mult-1'
    | 'pct-40' | 'pct-20' | 'pct-10' | 'pct-1'
    | 'cash-50' | 'cash-25' | 'cash-0'
    | 'pts-10k' | 'pts-5k' | 'pts-1k' | 'pts-lt-1k';

export type SpecialBucketId =
    | 'events'
    | 'price-drops'
    | 'new-customer'
    | 'recently-viewed';

export type BucketId = ValueBucketId | SpecialBucketId;

export interface BucketDef {
    id: BucketId;
    label: string;
    group: 'multiplier' | 'percent' | 'fixed-cash' | 'fixed-points' | 'special';
    initiallyOpen: boolean;
}

export interface BrowseStats {
    total: number;
    byBucket: Partial<Record<BucketId, number>>;
    hitCap?: boolean;
    pagesWalked?: number;
}

export interface BrowseData {
    offers: Offer[];
    buckets: Partial<Record<BucketId, Offer[]>>;
    bucketOrder: BucketId[];
    stats: BrowseStats;
}

// ---- Raw shapes for Cap One feed responses ----

// Shopping homepage feed item — POST /api/v1/feed
export interface RawShoppingFeedItem {
    type:
        | 'great_deal'
        | 'event_placement'
        | 'retarget'
        | 'retarget_non_product'
        | 'nca_deal'
        | 'generic_store_placement'
        | 'solo_category'
        | string;
    filterLabel?: string;
    pill?: { text: string; backgroundColor?: string; textColor?: string };
    primaryImage?: string;
    secondaryImage?: string;
    primaryText?: string;
    merchantName?: string;
    stats?: {
        priceHistory?: PriceHistoryPoint[];
        percentOff?: string;
        productPopularity?: number;
        exclusionsText?: string;
        newPrice?: string;
        oldPrice?: string;
        cashback?: string;
        cashbackV2?: string;
        priceAfterRewards?: string;
        cashbackAmount?: string;
        cashbackCategories?: Array<{ name: string; cashback: string }>;
        rewardType?: 'percentage' | 'fixed' | 'cut' | string;
        isCutType?: boolean;
        rewardMaxPayout?: string;
    };
    redirectSubExperience?: string;
    eventData?: { name: string; href: string; tier: string; eventId: string };
    end?: string; // ISO date for limited-time events
    hasVisitedDomain?: boolean;
    href?: string; // pre-signed activation URL — use verbatim
    __mirage?: { trackProps?: Record<string, unknown> };
    [k: string]: unknown;
}

export interface RawShoppingFeedResponse {
    count: number;
    pagination: { limit: number; nextPageToken?: string | null };
    items: RawShoppingFeedItem[];
}

// Offers/miles feed tile — GET /feed/{userId}?...&cursor=...
export interface RawOffersFeedTile {
    merchantTLD?: string;
    type:
        | 'Standard'
        | 'Hero'
        | 'Showcase'
        | 'Spotlight'
        | 'Carousel'
        | string;
    id?: string; // base64 viewContext blob — used as the tileId for activation POST
    imageSrc?: string;
    text?: string;
    buttonText?: string;
    badge?: { text: string; color?: string };
    headingText?: string;
    subText?: string;
    rateText?: string;
    altText?: string;
    defaultAssetPath?: string;
    staticAssetPath?: string;
    tiles?: RawOffersFeedTile[]; // Carousel nests
    [k: string]: unknown;
}

export interface RawOffersFeedResponse {
    cursor?: string | null;
    data: RawOffersFeedTile[];
}

// Response from POST /feed/{userId}/offers/{tileId}?_data
export interface RawOffersActivationResponse {
    affiliate?: {
        redirectUrl: string;
        loyaltyTripReferenceId?: string;
        welcomeBackMarkdownText?: string;
    };
}

// Browse context captured from the page (offers side needs both)
export interface OffersBrowseContext {
    userId: string;
    viewInstanceId: string;
}

// ---- UI factory ----

// Renderers accept `unknown` data because the tabbed UI holds a heterogeneous
// mix (TripsData vs BrowseData). Individual renderers cast internally, as they
// always did — the tab boundary is the natural erasure point.
export type RenderFn<TData> = (overlay: HTMLElement, data: TData) => void;
export type BadgeCountFn<TData> = (data: TData) => number;

export interface TabDef<TData = unknown> {
    /** Stable ID used to key data + activation (e.g. 'trips', 'browse'). */
    id: string;
    /** Human-readable label rendered in the tab bar. */
    label: string;
    /** Renderer for this tab's content. Called with the current data when active. */
    render: RenderFn<TData>;
    /** Optional badge source. If defined AND returns > 0, drives the FAB badge. */
    getBadgeCount?: BadgeCountFn<TData>;
    /**
     * Lazy loader — called on first activation if no data has been supplied.
     * Return value is cached; subsequent activations skip the call.
     */
    onActivate?: () => Promise<TData | null>;
    /** Text shown in the tab body while onActivate is in flight. */
    loadingText?: string;
}

export interface CreateTabbedUIOptions {
    /** Modal h2 title and FAB hover text. */
    title: string;
    /** Tabs, rendered left-to-right in this order. Must be non-empty. */
    tabs: Array<TabDef<unknown>>;
    /** ID of the tab that's active on first FAB open. Must match one of the tabs. */
    defaultTabId: string;
}

export interface TabbedUIHandle {
    ensureStyles: () => void;
    ensureFab: () => HTMLElement;
    ensureOverlay: () => HTMLElement;
    /** Switch the active tab. Fires onActivate if that tab has no data yet. */
    setActiveTab: (id: string) => void;
    /**
     * Warm a tab's cache without triggering its loader (used by the fetch
     * interceptor to pre-populate the Trips tab).
     */
    setTabData: (id: string, data: unknown) => void;
    /** Current active tab id (mainly for tests). */
    getActiveTabId: () => string;
}

// ---- Walker ----

export interface WalkResult<T> {
    items: T[];
    hitCap: boolean;
    pagesWalked: number;
}

export interface WalkFeedConfig<TPage, TItem> {
    fetchPage: (cursor: string | null) => Promise<TPage | null>;
    getNextCursor: (page: TPage) => string | null | undefined;
    getItems: (page: TPage) => TItem[];
    dedupeKey: (item: TItem) => string | null;
    onPage?: (pagesWalked: number, totalItems: number) => void;
    maxPages?: number;
}
