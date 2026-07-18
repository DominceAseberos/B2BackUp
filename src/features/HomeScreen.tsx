import type { BusinessProfile, Partner } from "../domain/types";
import { PinIcon } from "../ui/icons";
import { ROLE_LABEL } from "../ui/labels";

interface HomeScreenProps {
  business: BusinessProfile;
  onFix: (partner: Partner) => void;
}

function isDisrupted(partner: Partner): boolean {
  return partner.disasterStatus === "affected" || partner.routeStatus === "blocked";
}

/** Plain home screen: your business, your partners, and one clear action. */
export function HomeScreen({ business, onFix }: HomeScreenProps) {
  const partners = business.currentPartners;
  const disrupted = partners.filter(isDisrupted);
  const allWell = disrupted.length === 0;

  return (
    <div className="shell">
      <div className="home-hero">
        <div className="home-hero__name">{business.name}</div>
        <div className="home-hero__loc">
          <PinIcon size={13} /> {business.location.name} · Copra farmer
        </div>
        <span className={`status-pill ${allWell ? "status-pill--ok" : "status-pill--alert"}`}>
          {allWell ? "Operating normally" : "Needs attention"}
        </span>
        <p className="explainer">
          {allWell
            ? "Your buyers and suppliers are all active. If a storm cuts one off, tap Report a problem and we'll find you a replacement fast."
            : `A partner can no longer trade with you. Tap "Find a replacement" and we'll reconnect you with someone nearby who can.`}
        </p>
      </div>

      <div className="section">
        <div className="section__label">
          <h2>Your partners</h2>
        </div>
        {partners.map((partner) => {
          const down = isDisrupted(partner);
          return (
            <div key={partner.id} className={`chain__node${down ? " chain__node--alert" : ""}`}>
              <div className="chain__body">
                <div className="chain__role">{ROLE_LABEL[partner.role]}</div>
                <div className="chain__name">{partner.name}</div>
                <div className="chain__meta">
                  <PinIcon size={12} /> {partner.location.name} ·{" "}
                  {down ? "Can't trade right now" : "Active"}
                </div>
              </div>
              {down ? (
                <button
                  type="button"
                  className="btn btn--primary btn--sm"
                  onClick={() => onFix(partner)}
                >
                  Find a replacement
                </button>
              ) : null}
            </div>
          );
        })}
      </div>

    </div>
  );
}
