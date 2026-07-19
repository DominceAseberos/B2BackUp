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
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "22px 20px 4px" }}>
        <button type="button" className="progress__back" aria-label="Back" onClick={() => navigate(-1)} style={{ marginTop: 2 }}>
          <ArrowLeftIcon size={24} />
        </button>
        <div>
          <span className="eyebrow">Alerts</span>
          <h1 className="title" style={{ margin: 0 }}>Notifications</h1>
        </div>
      </div>

      {/* Global BCP Alert */}
      {disrupted.length > 0 && (
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
              background: "#ffffff", 
              padding: 20, 
              borderRadius: 16, 
              boxShadow: "0 10px 40px -10px rgba(0,0,0,0.06)",
              marginBottom: 16,
              transition: "transform 200ms ease, box-shadow 200ms ease"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: "var(--alert)", textTransform: "uppercase", letterSpacing: "0.06em", display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--alert)" }}></span>
                  Action Required
                </span>
                <span style={{ fontSize: 12, color: "var(--muted)", fontWeight: 500 }}>Just now</span>
              </div>
              <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 6, color: "var(--ink)" }}>{partner.name} is offline</div>
              <div style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.5, marginBottom: 16 }}>
                This partner has been impacted by a natural disaster or blocked route. Tap below to find an alternative.
              </div>
              <button 
                className="btn btn--primary btn--block" 
                onClick={() => onFix(partner)}
              >
                View Recommended Matches →
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
