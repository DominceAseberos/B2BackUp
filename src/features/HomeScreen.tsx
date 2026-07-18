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

/** Human-readable reason why this partner can't trade right now. */
function disruptionReason(partner: Partner): { label: string; icon: string; detail: string } {
  const both = partner.disasterStatus === "affected" && partner.routeStatus === "blocked";
  if (both) {
    return {
      icon: "🌀",
      label: "Disaster + Blocked road",
      detail: "Their facility is hit by a disaster and the road to them is blocked.",
    };
  }
  if (partner.disasterStatus === "affected") {
    return {
      icon: "🌪️",
      label: "Disaster-affected",
      detail: "Their business has been directly impacted by a natural disaster and cannot operate.",
    };
  }
  if (partner.routeStatus === "blocked") {
    return {
      icon: "🚧",
      label: "Road blocked",
      detail: "The route to this partner is blocked — deliveries and pickups cannot get through.",
    };
  }
  return { icon: "⚠️", label: "Unavailable", detail: "This partner has temporarily stopped trading." };
}

/** Status for active partners (at_risk or normal) */
function activeStatusBadge(partner: Partner): { label: string; cls: string } | null {
  if (partner.disasterStatus === "at_risk") {
    return { label: "⚠ At risk", cls: "badge badge--warn" };
  }
  if (partner.routeStatus === "limited") {
    return { label: "Limited route", cls: "badge badge--warn" };
  }
  return null;
}

/** Plain home screen: your business, your partners, and one clear action. */
export function HomeScreen({ business, onFix }: HomeScreenProps) {
  const partners = business.currentPartners;
  const disrupted = partners.filter(isDisrupted);
  const allWell = disrupted.length === 0;

  return (
    <div className="shell">
      {/* Hero card */}
      <div className="home-hero">
        <div className="home-hero__name">{business.name}</div>
        <div className="home-hero__loc">
          <PinIcon size={13} /> {business.location.name} · Copra trader
        </div>
        <span className={`status-pill ${allWell ? "status-pill--ok" : "status-pill--alert"}`}>
          {allWell ? "✓ Operating normally" : `${disrupted.length} partner${disrupted.length > 1 ? "s" : ""} need attention`}
        </span>
        <p className="explainer">
          {allWell
            ? "All your buyers and suppliers are active. If a storm cuts one off, tap the Report button — we'll find a replacement instantly."
            : `${disrupted.length === 1 ? "One of your partners has" : "Some of your partners have"} stopped trading. Tap "Find a replacement" below to auto-match a new one.`}
        </p>
      </div>

      {/* Partner list */}
      <div className="section">
        <div className="section__label">
          <h2>Your partners</h2>
          <span className="section__count">{partners.length} total</span>
        </div>

        {partners.map((partner) => {
          const down = isDisrupted(partner);
          const reason = down ? disruptionReason(partner) : null;
          const warn = !down ? activeStatusBadge(partner) : null;

          return (
            <div key={partner.id} className={`chain__node${down ? " chain__node--alert" : ""}`}>
              <div className="chain__body">
                <div className="chain__role">{ROLE_LABEL[partner.role]}</div>
                <div className="chain__name">{partner.name}</div>
                <div className="chain__meta">
                  <PinIcon size={12} /> {partner.location.name}
                </div>

                {/* Reason why — shown only for disrupted partners */}
                {reason && (
                  <div style={{
                    marginTop: 8,
                    padding: "8px 10px",
                    borderRadius: 8,
                    background: "var(--alert-tint)",
                    border: "1px solid color-mix(in srgb, var(--alert) 20%, var(--hair))",
                  }}>
                    <div style={{ fontWeight: 600, fontSize: 13, color: "var(--alert)", marginBottom: 2 }}>
                      {reason.icon} {reason.label}
                    </div>
                    <div style={{ fontSize: 12.5, color: "color-mix(in srgb, var(--ink) 75%, var(--alert))", lineHeight: 1.4 }}>
                      {reason.detail}
                    </div>
                  </div>
                )}

                {/* At-risk warning for still-active partners */}
                {warn && (
                  <span className={warn.cls} style={{ marginTop: 6, display: "inline-flex" }}>
                    {warn.label}
                  </span>
                )}
              </div>

              {down && (
                <div style={{ marginTop: 12 }}>
                  <button
                    type="button"
                    className="btn btn--primary btn--block"
                    onClick={() => onFix(partner)}
                  >
                    Find a replacement →
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
