export type PartnerRole = "buyer" | "supplier";

export type ProductType =
  | "copra"
  | "whole_nut"
  | "coconut_oil"
  | "desiccated"
  | "coir"
  | "husk"
  | "coco_water";

/** A single line item in a supplier's live inventory. */
export interface StockItem {
  product: ProductType;
  label: string;
  availableTons: number;
  totalCapacityTons: number;
  pricePhpPerTon: number;
  /** Days until the stock must move before quality degrades */
  freshnessDays: number;
  routeStatus: RouteStatus;
}

/** Supplier-specific profile for the Supplier Portal. */
export interface SupplierProfile {
  id: string;
  name: string;
  location: Location;
  verified: boolean;
  rating: number;
  stock: StockItem[];
  activeBuyerCount: number;
  disasterStatus: DisasterStatus;
}

/** Operational impact of the current hazard on a business. */
export type DisasterStatus = "unaffected" | "at_risk" | "affected";

/** Accessibility of the logistics route to a partner. */
export type RouteStatus = "open" | "limited" | "blocked";

export type DisruptionType = "buyer_unavailable" | "supplier_unavailable" | "route_blocked";

export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface Location extends GeoPoint {
  name: string;
}

/** A buyer or supplier in the network. */
export interface Partner {
  id: string;
  name: string;
  role: PartnerRole;
  location: Location;
  products: ProductType[];
  /** The final products this partner creates (e.g. coconut oil) */
  produces?: string[];
  /** Monthly buying (buyer) or supply (supplier) capacity, in tonnes. */
  capacityTons: number;
  disasterStatus: DisasterStatus;
  routeStatus: RouteStatus;
  /** Offered price (buyer) or asking price (supplier), PHP per tonne. */
  pricePhpPerTon: number;
  verified: boolean;
  rating: number;
}

/** The registered SME using the platform (Business Continuity Profile). */
export interface BusinessProfile {
  id: string;
  name: string;
  role: "trader" | "farmer" | "processor" | "cooperative";
  location: Location;
  products: ProductType[];
  monthlyVolumeTons: number;
  currentPartners: Partner[];
}

/** A recovery need derived from a reported disruption. */
export interface RecoveryNeed {
  disruptionType: DisruptionType;
  /** The role we must now source: an alternative buyer or supplier. */
  neededRole: PartnerRole;
  product: ProductType;
  volumeTons: number;
  /** Fair reference price (PHP/ton) used to flag exploitative pricing. */
  referencePricePhpPerTon: number;
  origin: GeoPoint;
  affectedPartnerId?: string;
}

export interface CriterionScore {
  key: string;
  label: string;
  /** 0..1 normalized score for this criterion. */
  score: number;
  /** Human-readable value shown in the UI. */
  detail: string;
}

export interface MatchResult {
  partner: Partner;
  /** 0..100 overall match score. */
  total: number;
  distanceKm: number;
  criteria: CriterionScore[];
}
