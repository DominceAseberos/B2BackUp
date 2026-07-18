import type {
  DisasterStatus,
  DisruptionType,
  PartnerRole,
  ProductType,
  RouteStatus,
} from "../domain/types";

export const PRODUCT_LABEL: Record<ProductType, string> = {
  copra: "Copra",
  coconut_oil: "Coconut oil",
  desiccated: "Desiccated coconut",
  coir: "Coir",
  husk: "Husk",
  coco_water: "Coconut water",
};

export const ROLE_LABEL: Record<PartnerRole, string> = {
  buyer: "Buyer",
  supplier: "Supplier",
};

export const DISASTER_LABEL: Record<DisasterStatus, string> = {
  unaffected: "Operating",
  at_risk: "At risk",
  affected: "Disrupted",
};

export const ROUTE_LABEL: Record<RouteStatus, string> = {
  open: "Route open",
  limited: "Route limited",
  blocked: "Route blocked",
};

export const DISRUPTION_LABEL: Record<DisruptionType, string> = {
  buyer_unavailable: "My buyer is unavailable",
  supplier_unavailable: "My supplier stopped operating",
  route_blocked: "Roads to a partner are inaccessible",
};

/** Badge visual variant for a disaster status. */
export function disasterVariant(status: DisasterStatus): "ok" | "warn" | "alert" {
  if (status === "unaffected") return "ok";
  if (status === "at_risk") return "warn";
  return "alert";
}

/** Badge visual variant for a route status. */
export function routeVariant(status: RouteStatus): "ok" | "warn" | "alert" {
  if (status === "open") return "ok";
  if (status === "limited") return "warn";
  return "alert";
}

export function formatPhp(value: number): string {
  return `₱${value.toLocaleString("en-PH")}`;
}
