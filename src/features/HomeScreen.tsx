import type { BusinessProfile, Partner } from "../domain/types";
import { PinIcon } from "../ui/icons";
import { ROLE_LABEL } from "../ui/labels";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  const partners = business.currentPartners;
  return (
    <div className="shell">
      {/* Hero card */}
      <div className="home-hero">
        <div className="home-hero__name">{business.name}</div>
        <div className="home-hero__loc">
          <PinIcon size={13} /> {business.location.name} · Copra trader
        </div>
      </div>

      {/* Global BCP Alert */}
      {partners.some(isDisrupted) && (
        <div style={{
          margin: "16px 20px 0",
          padding: 16,
          background: "rgba(198,71,43,0.06)",
          border: "1px solid rgba(198,71,43,0.2)",
          borderRadius: "var(--radius-lg)"
        }}>
          <h3 style={{ color: "var(--alert)", margin: "0 0 8px", fontSize: 16 }}>🚨 Supply Chain Disrupted</h3>
          <p style={{ fontSize: 13, color: "var(--ink)", margin: "0 0 12px", lineHeight: 1.5 }}>
            Multiple partners are offline. Generate a comprehensive AI business continuity plan to assess total risk and coordinate logistics.
          </p>
          <button 
            className="btn btn--primary btn--block" 
            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
            onClick={() => navigate("/sme/ai-bcp")}
          >
            <span style={{ fontSize: 14 }}>✨</span> Generate AI Continuity Plan
          </button>
        </div>
      )}

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
              {/* Top row: role + status pill */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div className="chain__role">{ROLE_LABEL[partner.role]}</div>
                {!down && (
                  <span className={`badge ${warn ? warn.cls.replace("badge ", "") : "badge--ok"}`}>
                    {warn ? warn.label : "Active"}
                  </span>
                )}
                {down && (
                  <span className="badge badge--alert">Disrupted</span>
                )}
              </div>

              {/* Partner name + location */}
              <div className="chain__name" style={{ marginTop: 4 }}>{partner.name}</div>
              <div className="chain__meta">
                <PinIcon size={12} /> {partner.location.name}
              </div>

              {/* Reason why — full width, stacked below */}
              {reason && (
                <div style={{
                  marginTop: 10,
                  padding: "10px 12px",
                  borderRadius: 8,
                  background: "rgba(198,71,43,0.08)",
                  border: "1px solid rgba(198,71,43,0.2)",
                }}>
                  <div style={{ fontWeight: 600, fontSize: 13, color: "var(--alert)", marginBottom: 3 }}>
                    {reason.icon} {reason.label}
                  </div>
                  <div style={{ fontSize: 12.5, color: "var(--ink)", lineHeight: 1.45, opacity: 0.8 }}>
                    {reason.detail}
                  </div>
                </div>
              )}

              {/* Find replacement — full width button */}
              {down && (
                <button
                  type="button"
                  className="btn btn--primary btn--block"
                  style={{ marginTop: 12 }}
                  onClick={() => onFix(partner)}
                >
                  View Recommended Matches →
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
