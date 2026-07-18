import { distanceKm } from "./geo";
import type {
  CriterionScore,
  MatchResult,
  Partner,
  RecoveryNeed,
  RouteStatus,
} from "./types";

/**
 * Ranking weights, per the Tuloy SRS (Section 7 — Core Algorithm Concept):
 * 40% distance, 25% capacity, 15% price, 10% logistics, 10% reliability.
 * Disaster status and product compatibility are applied as hard filters
 * (FR-06), so only operational, product-matched partners are ranked.
 */
const WEIGHTS = {
  distance: 0.4,
  capacity: 0.25,
  price: 0.15,
  logistics: 0.1,
  reliability: 0.1,
} as const;

const MAX_USEFUL_DISTANCE_KM = 400;
const MAX_RATING = 5;
const TOP_N = 3;

const ROUTE_SCORE: Record<RouteStatus, number> = {
  open: 1,
  limited: 0.55,
  blocked: 0,
};

const ROUTE_LABEL: Record<RouteStatus, string> = {
  open: "Open",
  limited: "Limited",
  blocked: "Blocked",
};

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

function pricePhp(value: number): string {
  return `₱${value.toLocaleString("en-PH")}/t`;
}

function scoreDistance(km: number): CriterionScore {
  return {
    key: "distance",
    label: "Distance",
    score: clamp01(1 - km / MAX_USEFUL_DISTANCE_KM),
    detail: `${Math.round(km)} km away`,
  };
}

function scoreCapacity(partner: Partner, need: RecoveryNeed): CriterionScore {
  const ratio = need.volumeTons === 0 ? 1 : partner.capacityTons / need.volumeTons;
  return {
    key: "capacity",
    label: "Capacity",
    score: clamp01(ratio),
    detail: `${partner.capacityTons} t/mo vs ${need.volumeTons} t need`,
  };
}

/**
 * Price fairness relative to a reference price. For a buyer, a higher offer is
 * better for the seller; for a supplier, a lower ask is better. Flags
 * exploitative post-disaster pricing.
 */
function scorePrice(partner: Partner, need: RecoveryNeed): CriterionScore {
  const ref = need.referencePricePhpPerTon;
  const ratio =
    need.neededRole === "buyer"
      ? partner.pricePhpPerTon / ref
      : ref / partner.pricePhpPerTon;
  return {
    key: "price",
    label: "Price",
    score: clamp01(ratio),
    detail: pricePhp(partner.pricePhpPerTon),
  };
}

function scoreLogistics(partner: Partner): CriterionScore {
  return {
    key: "logistics",
    label: "Logistics",
    score: ROUTE_SCORE[partner.routeStatus],
    detail: ROUTE_LABEL[partner.routeStatus],
  };
}

function scoreReliability(partner: Partner): CriterionScore {
  return {
    key: "reliability",
    label: "Reliability",
    score: clamp01(partner.rating / MAX_RATING),
    detail: `★ ${partner.rating.toFixed(1)}${partner.verified ? " · verified" : ""}`,
  };
}

function weightFor(key: string): number {
  return (WEIGHTS as Record<string, number>)[key] ?? 0;
}

/** Score a single candidate partner against the recovery need. */
export function scoreCandidate(partner: Partner, need: RecoveryNeed): MatchResult {
  const km = distanceKm(need.origin, partner.location);
  const criteria: CriterionScore[] = [
    scoreDistance(km),
    scoreCapacity(partner, need),
    scorePrice(partner, need),
    scoreLogistics(partner),
    scoreReliability(partner),
  ];

  const weighted = criteria.reduce(
    (sum, criterion) => sum + criterion.score * weightFor(criterion.key),
    0
  );

  return {
    partner,
    total: Math.round(weighted * 100),
    distanceKm: km,
    criteria,
  };
}

/**
 * The Alternative Partner Matching Engine (FR-06). Filters the network to
 * operational, product-matched alternatives for the disrupted relationship,
 * ranks them by weighted compatibility, and returns the top 3.
 */
export function findAlternatives(partners: Partner[], need: RecoveryNeed): MatchResult[] {
  return partners
    .filter(
      (partner) =>
        partner.role === need.neededRole &&
        partner.products.includes(need.product) &&
        partner.id !== need.affectedPartnerId &&
        partner.disasterStatus !== "affected" &&
        partner.routeStatus !== "blocked"
    )
    .map((partner) => scoreCandidate(partner, need))
    .sort((a, b) => b.total - a.total)
    .slice(0, TOP_N);
}
