import { REFERENCE_PRICE } from "./mockData";
import type {
  BusinessProfile,
  DisruptionType,
  Partner,
  PartnerRole,
  ProductType,
  RecoveryNeed,
} from "./types";

function neededRoleFor(disruption: DisruptionType, partner: Partner): PartnerRole {
  if (disruption === "buyer_unavailable") return "buyer";
  if (disruption === "supplier_unavailable") return "supplier";
  // route_blocked: replace the blocked partner with another of the same role.
  return partner.role;
}

function sharedProduct(business: BusinessProfile, partner: Partner): ProductType {
  const shared = business.products.find((product) => partner.products.includes(product));
  return shared ?? partner.products[0] ?? business.products[0];
}

/** Derive a structured recovery need from a reported disruption. */
export function buildRecoveryNeed(
  business: BusinessProfile,
  partner: Partner,
  disruption: DisruptionType
): RecoveryNeed {
  const product = sharedProduct(business, partner);
  return {
    disruptionType: disruption,
    neededRole: neededRoleFor(disruption, partner),
    product,
    volumeTons: business.monthlyVolumeTons,
    referencePricePhpPerTon: REFERENCE_PRICE[product] ?? partner.pricePhpPerTon,
    origin: business.location,
    affectedPartnerId: partner.id,
  };
}
