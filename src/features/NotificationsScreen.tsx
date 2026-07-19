import { useNavigate } from "react-router-dom";
import type { BusinessProfile, Partner } from "../domain/types";
import { ArrowLeftIcon } from "../ui/icons";
import { Bell } from "lucide-react";

interface NotificationsScreenProps {
  business: BusinessProfile;
  onFix: (partner: Partner) => void;
}

function isDisrupted(partner: Partner): boolean {
  return partner.disasterStatus === "affected" || partner.routeStatus === "blocked";
}

export function NotificationsScreen({ business, onFix }: NotificationsScreenProps) {
  const navigate = useNavigate();
  const disrupted = business.currentPartners.filter(isDisrupted);

  return (
    <div className="shell">
      <div className="page-head">
        <button type="button" className="progress__back" aria-label="Back" onClick={() => navigate(-1)}>
          <ArrowLeftIcon size={20} />
        </button>
        <span className="eyebrow">Alerts</span>
        <h1 className="title">Notifications</h1>
      </div>

      <div className="section">
        {disrupted.length === 0 ? (
          <div style={{ padding: "40px 0", textAlign: "center", color: "var(--muted)" }}>
            <Bell size={32} style={{ opacity: 0.5, marginBottom: 12 }} />
            <div style={{ fontWeight: 600 }}>You're all caught up!</div>
            <div style={{ fontSize: 13, marginTop: 4 }}>No network disruptions detected.</div>
          </div>
        ) : (
          disrupted.map(partner => (
            <div key={partner.id} style={{ 
              background: "var(--surface)", 
              padding: 16, 
              borderRadius: "var(--radius)", 
              border: "1px solid var(--hair)",
              marginBottom: 12,
              borderLeft: "4px solid var(--alert)"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: "var(--alert)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Action Required</span>
                <span style={{ fontSize: 11, color: "var(--muted)" }}>Just now</span>
              </div>
              <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>{partner.name} is offline</div>
              <div style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.4, marginBottom: 12 }}>
                This partner has been impacted by a natural disaster or blocked route. Tap below to find an alternative.
              </div>
              <button 
                className="btn btn--primary btn--block" 
                onClick={() => onFix(partner)}
              >
                Find a replacement →
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
