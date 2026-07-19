import type { BusinessProfile, Partner } from "../domain/types";
import { useNavigate } from "react-router-dom";

interface HomeScreenProps {
  business: BusinessProfile;
  onFix?: (partner: Partner) => void;
}

function isDisrupted(partner: Partner): boolean {
  return partner.disasterStatus === "affected" || partner.routeStatus === "blocked";
}

import { Bell } from "lucide-react";

export function HomeScreen({ business }: HomeScreenProps) {
  const navigate = useNavigate();
  const partners = business.currentPartners;
  const disrupted = partners.filter(isDisrupted);

  return (
    <div className="shell">
      {/* Disaster Alert Box (Mockup style) */}
      {disrupted.length > 0 && (
        <div style={{
          margin: "24px 20px 0",
          padding: 16,
          background: "var(--alert-tint)",
          borderRadius: "var(--radius-lg)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--alert)", fontWeight: 600, fontSize: 13, marginBottom: 8 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--alert)" }} /> Disaster Alert
          </div>
          <h3 style={{ margin: "0 0 4px", fontSize: 16 }}>Typhoon Kristine</h3>
          <p style={{ fontSize: 14, color: "var(--ink)", margin: 0, fontWeight: 500 }}>Davao Region</p>
          <p style={{ fontSize: 13, color: "var(--muted)", margin: "4px 0 12px", lineHeight: 1.4 }}>
            Heavy rain and flooding expected to block major supply routes.
          </p>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--alert)", cursor: "pointer" }} onClick={() => navigate("/sme/ai-bcp")}>View Details</span>
          </div>
        </div>
      )}

      {/* Quick Overview */}
      <div style={{ padding: "24px 20px" }}>
        <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 600 }}>Quick Overview</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {/* Active Alerts */}
          <div style={{ padding: 16, border: "1px solid var(--hair)", borderRadius: "var(--radius)", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ color: "var(--alert)" }}><Bell size={24} /></div>
            <div>
              <div style={{ fontSize: 12, color: "var(--muted)", fontWeight: 500 }}>Active Alerts</div>
              <div style={{ fontSize: 20, fontWeight: 700 }}>{disrupted.length > 0 ? 2 : 0}</div>
            </div>
          </div>
          {/* Matches Found */}
          <div style={{ padding: 16, border: "1px solid var(--hair)", borderRadius: "var(--radius)", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ color: "var(--brand)" }}><span style={{ fontSize: 24 }}>🍃</span></div>
            <div>
              <div style={{ fontSize: 12, color: "var(--muted)", fontWeight: 500 }}>Matches Found</div>
              <div style={{ fontSize: 20, fontWeight: 700 }}>3</div>
            </div>
          </div>
          {/* Pending Requests */}
          <div style={{ padding: 16, border: "1px solid var(--hair)", borderRadius: "var(--radius)", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ color: "var(--warn)" }}><span style={{ fontSize: 24 }}>📋</span></div>
            <div>
              <div style={{ fontSize: 12, color: "var(--muted)", fontWeight: 500 }}>Pending</div>
              <div style={{ fontSize: 20, fontWeight: 700 }}>1</div>
            </div>
          </div>
          {/* Messages */}
          <div style={{ padding: 16, border: "1px solid var(--hair)", borderRadius: "var(--radius)", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ color: "#3b82f6" }}><span style={{ fontSize: 24 }}>💬</span></div>
            <div>
              <div style={{ fontSize: 12, color: "var(--muted)", fontWeight: 500 }}>Messages</div>
              <div style={{ fontSize: 20, fontWeight: 700 }}>5</div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
