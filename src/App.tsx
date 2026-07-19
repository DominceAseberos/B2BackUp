import { useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { DEMO_BUSINESS } from "./domain/mockData";
import type { MatchResult, Partner } from "./domain/types";

import { HomeScreen } from "./features/HomeScreen";
import { AutoMatchScreen } from "./features/AutoMatchScreen";
import { ReconnectedScreen } from "./features/ReconnectedScreen";
import { SupplierPortal } from "./features/SupplierPortal";
import { AIBcpScreen } from "./features/AIBcpScreen";
import { NetworkMapScreen } from "./features/NetworkMapScreen";
import { DiscoverPartnersMapScreen } from "./features/DiscoverPartnersMapScreen";
import { NotificationsScreen } from "./features/NotificationsScreen";
import { TopBar } from "./ui/TopBar";
import { BottomNav } from "./ui/BottomNav";
import { PlaceholderScreen } from "./ui/PlaceholderScreen";
import { ClipboardList, MessageSquare, User } from "lucide-react";

const BUSINESS = DEMO_BUSINESS;

function SmePortal() {
  const navigate = useNavigate();

  const [affectedPartner, setAffectedPartner] = useState<Partner | null>(null);
  const [chosen, setChosen] = useState<MatchResult | null>(null);

  const goHome = () => {
    setAffectedPartner(null);
    setChosen(null);
    navigate("/sme");
  };

  /** Tap "Find a replacement" → immediately go to results, no extra form */
  const handleFix = (partner: Partner) => {
    setAffectedPartner(partner);
    navigate("/sme/match");
  };

  return (
    <div className="portal-layout">
      <div className="screen-content">
        <Routes>
          <Route
            index
            element={
              <HomeScreen
                business={BUSINESS}
                onFix={handleFix}
              />
            }
          />
          <Route
            path="match"
            element={
              affectedPartner ? (
                <AutoMatchScreen
                  business={BUSINESS}
                  affectedPartner={affectedPartner}
                  onBack={goHome}
                  onSelect={(result) => {
                    setChosen(result);
                    // Automatically partner with the chosen partner by replacing the affected one in mock data
                    if (affectedPartner) {
                      const idx = BUSINESS.currentPartners.findIndex(p => p.id === affectedPartner.id);
                      if (idx !== -1) {
                        BUSINESS.currentPartners.splice(idx, 1, result.partner);
                      }
                    }
                    navigate("/sme/reconnected");
                  }}
                />
              ) : (
                <Navigate to="/sme" replace />
              )
            }
          />
          <Route
            path="notifications"
            element={
              <NotificationsScreen
                business={BUSINESS}
                onFix={handleFix}
              />
            }
          />
          <Route path="ai-bcp" element={<AIBcpScreen />} />
          <Route path="requests" element={<PlaceholderScreen title="My Requests" icon={<ClipboardList size={48} />} description="Track your pending and active match requests here." />} />
          <Route path="messages" element={<PlaceholderScreen title="Messages" icon={<MessageSquare size={48} />} description="Chat directly with matched partners." />} />
          <Route path="profile" element={<PlaceholderScreen title="Profile" icon={<User size={48} />} description="Manage your business profile and preferences." />} />
          <Route
            path="reconnected"
            element={
              chosen && affectedPartner ? (
                <ReconnectedScreen
                  result={chosen}
                  need={{
                    disruptionType: affectedPartner.role === "buyer" ? "buyer_unavailable" : "supplier_unavailable",
                    neededRole: affectedPartner.role === "buyer" ? "buyer" : "supplier",
                    product: "copra",
                    volumeTons: BUSINESS.monthlyVolumeTons,
                    referencePricePhpPerTon: 41000,
                    origin: BUSINESS.location,
                    affectedPartnerId: affectedPartner.id,
                  }}
                  onDone={goHome}
                />
              ) : (
                <Navigate to="/sme" replace />
              )
            }
          />
          <Route
            path="map"
            element={<NetworkMapScreen />}
          />
          <Route
            path="discover"
            element={<DiscoverPartnersMapScreen onFix={handleFix} />}
          />
          <Route
            path="profile"
            element={
              <div className="shell">
                <div className="page-head">
                  <span className="eyebrow">Account Settings</span>
                  <h2 className="title">Business Profile</h2>
                </div>
                <div className="grid">
                  <div className="stat">
                    <div className="stat__label">Business Name</div>
                    <div className="stat__value" style={{ fontSize: "18px" }}>{BUSINESS.name}</div>
                  </div>
                  <div className="stat">
                    <div className="stat__label">Location</div>
                    <div className="stat__value" style={{ fontSize: "18px" }}>{BUSINESS.location.name}</div>
                  </div>
                  <div className="stat">
                    <div className="stat__label">Monthly Volume</div>
                    <div className="stat__value">{BUSINESS.monthlyVolumeTons} t</div>
                  </div>
                  <div className="stat">
                    <div className="stat__label">Active Partners</div>
                    <div className="stat__value">{BUSINESS.currentPartners.length}</div>
                  </div>
                </div>
              </div>
            }
          />
        </Routes>
      </div>

      <BottomNav tabs={[
        { name: "Dashboard", path: "/sme", iconName: "home" },
        { name: "Partners", path: "/sme/discover", iconName: "search" },
        { name: "Requests", path: "/sme/requests", iconName: "requests" },
        { name: "Messages", path: "/sme/messages", iconName: "messages", badgeCount: 5 },
        { name: "Profile", path: "/sme/profile", iconName: "user" }
      ]} />
    </div>
  );
}

export function App() {
  const notificationCount = BUSINESS.currentPartners.filter(
    (p) => p.disasterStatus === "affected" || p.routeStatus === "blocked"
  ).length;

  return (
    <div className="app">
      <TopBar notificationCount={notificationCount} />
      <div className="screen-container">
        <Routes>
          <Route path="/sme/*" element={<SmePortal />} />
          <Route path="/supplier/*" element={<SupplierPortal />} />
          <Route path="*" element={<Navigate to="/sme" replace />} />
        </Routes>
      </div>
    </div>
  );
}
