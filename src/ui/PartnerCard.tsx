import type { ReactNode } from "react";
import type { Partner } from "../domain/types";
import { Badge } from "./Badge";
import { PinIcon } from "./icons";
import {
  DISASTER_LABEL,
  PRODUCT_LABEL,
  ROLE_LABEL,
  ROUTE_LABEL,
  disasterVariant,
  routeVariant,
} from "./labels";

interface PartnerCardProps {
  partner: Partner;
  action?: ReactNode;
}

/** A current supply-chain partner with role, location and live status. */
export function PartnerCard({ partner, action }: PartnerCardProps) {
  const products = partner.products.map((p) => PRODUCT_LABEL[p]).join(", ");

  return (
    <div className="partner">
      <div className="partner__body">
        <span className="partner__role">{ROLE_LABEL[partner.role]}</span>
        <div className="partner__name">{partner.name}</div>
        <div className="partner__meta">
          <PinIcon size={13} /> {partner.location.name} · {products}
        </div>
        <div className="match__badges" style={{ marginTop: 10 }}>
          <Badge variant={disasterVariant(partner.disasterStatus)}>
            {DISASTER_LABEL[partner.disasterStatus]}
          </Badge>
          <Badge variant={routeVariant(partner.routeStatus)}>
            {ROUTE_LABEL[partner.routeStatus]}
          </Badge>
        </div>
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  );
}
