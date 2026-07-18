import { useState, useMemo } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { DEMO_BUSINESS } from "./domain/mockData";
import { buildRecoveryNeed } from "./domain/recovery";
import type { DisruptionType, MatchResult, Partner } from "./domain/types";

import { HomeScreen } from "./features/HomeScreen";
import { ReportProblemScreen } from "./features/ReportProblemScreen";
import { ReplacementsScreen } from "./features/ReplacementsScreen";
import { ReconnectedScreen } from "./features/ReconnectedScreen";
import { TopBar } from "./ui/TopBar";
import { BottomNav } from "./ui/BottomNav";
import { FloatingActionButton } from "./ui/FloatingActionButton";

const BUSINESS = DEMO_BUSINESS;

// Dummy placeholders for other portals
function LguPortal() {
  return (
    <div style={{ padding: 24 }}>
      <h2 className="title">LGU / DRRM Portal</h2>
      <p className="subtitle">Disaster monitoring dashboard (Future Scope).</p>
    </div>
  );
}

function LogisticsPortal() {
  return (
    <div style={{ padding: 24 }}>
      <h2 className="title">Logistics Portal</h2>
      <p className="subtitle">Route status and truck tracking (Future Scope).</p>
    </div>
  );
}

function SmePortal() {
  const navigate = useNavigate();
  const location = useLocation();

  // State maintained at the Portal level
  const [affectedPartner, setAffectedPartner] = useState<Partner | null>(null);
  const [disruption, setDisruption] = useState<DisruptionType | null>(null);
  const [chosen, setChosen] = useState<MatchResult | null>(null);

  const need = useMemo(() => {
    if (!affectedPartner || !disruption) return null;
    return buildRecoveryNeed(BUSINESS, affectedPartner, disruption);
  }, [affectedPartner, disruption]);

  const goHome = () => {
    setAffectedPartner(null);
    setDisruption(null);
    setChosen(null);
    navigate("/sme");
  };

  const startReport = () => navigate("/sme/report");

  const findReplacements = (partner: Partner, type: DisruptionType) => {
    setAffectedPartner(partner);
    setDisruption(type);
    navigate("/sme/replacements");
  };

  const isHome = location.pathname === "/sme" || location.pathname === "/sme/";

  return (
    <div className="portal-layout">
      <div className="screen-content">
        <Routes>
          <Route 
            index 
            element={
              <HomeScreen
                business={BUSINESS}
                onFix={(partner) =>
                  findReplacements(
                    partner,
                    partner.role === "buyer" ? "buyer_unavailable" : "supplier_unavailable"
                  )
                }
              />
            } 
          />
          <Route 
            path="report" 
            element={
              <ReportProblemScreen
                business={BUSINESS}
                onBack={goHome}
                onSubmit={findReplacements}
              />
            } 
          />
          <Route 
            path="replacements" 
            element={
              (need && affectedPartner) ? (
                <ReplacementsScreen
                  need={need}
                  affectedPartnerName={affectedPartner.name}
                  onBack={goHome}
                  onSelect={(result) => {
                    setChosen(result);
                    navigate("/sme/reconnected");
                  }}
                />
              ) : <Navigate to="/sme" replace />
            } 
          />
          <Route 
            path="reconnected" 
            element={
              (chosen && need) ? (
                <ReconnectedScreen result={chosen} need={need} onDone={goHome} />
              ) : <Navigate to="/sme" replace />
            } 
          />
          <Route path="map" element={
            <div className="shell">
              <div className="page-head">
                <div className="eyebrow">Supply Chain Logistics</div>
                <h2 className="title">Map View</h2>
                <p className="subtitle">Visualizing {BUSINESS.name}'s connections.</p>
              </div>
              <div style={{ height: "400px", background: "var(--surface-sunk)", borderRadius: "var(--radius)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid var(--hair)" }}>
                <span style={{ fontSize: "40px" }}>🗺️</span>
              </div>
            </div>
          } />
          <Route path="profile" element={
            <div className="shell">
              <div className="page-head">
                <div className="eyebrow">Account Settings</div>
                <h2 className="title">Business Profile</h2>
              </div>
              <div className="grid">
                <div className="stat">
                  <div className="stat__label">Business Name</div>
                  <div className="stat__value" style={{fontSize: "18px"}}>{BUSINESS.name}</div>
                </div>
                <div className="stat">
                  <div className="stat__label">Location</div>
                  <div className="stat__value" style={{fontSize: "18px"}}>{BUSINESS.location.name}</div>
                </div>
                <div className="stat">
                  <div className="stat__label">Active Partners</div>
                  <div className="stat__value">{BUSINESS.currentPartners.length}</div>
                </div>
              </div>
            </div>
          } />
        </Routes>
      </div>

      {isHome && <FloatingActionButton onClick={startReport} />}
      <BottomNav />
    </div>
  );
}

export function App() {
  const location = useLocation();

  let tagline = "Supply chain recovery";
  if (location.pathname.includes("/report")) tagline = "Report an Issue";
  if (location.pathname.includes("/replacements")) tagline = "Finding Partners";
  if (location.pathname.includes("/reconnected")) tagline = "Recovery Complete";
  if (location.pathname.includes("/lgu")) tagline = "LGU Monitoring";
  if (location.pathname.includes("/logistics")) tagline = "Logistics Tracking";

  return (
    <div className="app">
      <TopBar tagline={tagline} />
      
      <div className="screen-container">
        <Routes>
          <Route path="/sme/*" element={<SmePortal />} />
          <Route path="/lgu/*" element={<LguPortal />} />
          <Route path="/logistics/*" element={<LogisticsPortal />} />
          <Route path="*" element={<Navigate to="/sme" replace />} />
        </Routes>
      </div>
    </div>
  );
}
