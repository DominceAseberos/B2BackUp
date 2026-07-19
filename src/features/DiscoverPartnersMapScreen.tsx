import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import type { Partner } from "../domain/types";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { DEMO_BUSINESS, NETWORK } from "../domain/mockData";
import { ROLE_LABEL } from "../ui/labels";
import { ArrowLeftIcon } from "../ui/icons";

// Fix Leaflet's default icon issue with webpack/vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const createPin = (color: string) => L.divIcon({
  className: "custom-pin",
  html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" width="28" height="28"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>`,
  iconSize: [28, 28],
  iconAnchor: [14, 28],
  popupAnchor: [0, -28],
});

const myIcon = createPin("var(--ink)");
const sourceIcon = createPin("var(--brand)");
const activePartnerIcon = createPin("#2563eb");
const disruptedPartnerIcon = createPin("var(--alert)");

export function DiscoverPartnersMapScreen({ onFix }: { onFix?: (partner: Partner) => void }) {
  const navigate = useNavigate();
  const origin = [DEMO_BUSINESS.location.lat, DEMO_BUSINESS.location.lng] as [number, number];

  // Exclude current partners so we only show new potential sources
  const currentPartnerIds = new Set(DEMO_BUSINESS.currentPartners.map(p => p.id));
  const potentialSources = NETWORK.filter(p => !currentPartnerIds.has(p.id) && p.disasterStatus === "unaffected");

  const [typeFilter, setTypeFilter] = useState<"all" | "cooperatives" | "processors">("all");
  const [productFilter, setProductFilter] = useState<"all" | "copra" | "whole_nut">("all");

  const displayedSources = potentialSources.filter(p => {
    if (typeFilter === "cooperatives" && p.role !== "supplier") return false;
    if (typeFilter === "processors" && p.role !== "buyer") return false;
    if (productFilter !== "all" && !p.products.includes(productFilter)) return false;
    return true;
  });

  const activePartners = DEMO_BUSINESS.currentPartners.filter(p => p.disasterStatus === "unaffected");
  const disruptedPartners = DEMO_BUSINESS.currentPartners.filter(p => p.disasterStatus !== "unaffected");

  return (
    <div className="shell" style={{ display: "flex", flexDirection: "column", height: "100%", paddingBottom: 0 }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "22px 0 12px" }}>
        <button type="button" className="progress__back" aria-label="Back" onClick={() => navigate(-1)} style={{ marginTop: 2 }}>
          <ArrowLeftIcon size={24} />
        </button>
        <div>
          <span className="eyebrow">Discover</span>
          <h2 className="title" style={{ margin: 0 }}>Verified Partners</h2>
          <p className="subtitle" style={{ margin: "4px 0 0" }}>Overview of your network and available sources in Mindanao.</p>
        </div>
      </div>

      {/* Filter Buttons */}
      <div style={{ display: "flex", gap: 8, padding: "0 0 16px", overflowX: "auto", flexShrink: 0, scrollbarWidth: "none" }}>
        <button 
          onClick={() => setTypeFilter("all")}
          style={{ padding: "6px 16px", borderRadius: 20, fontSize: 13, fontWeight: 500, whiteSpace: "nowrap", border: typeFilter === "all" ? "none" : "1px solid var(--hair)", background: typeFilter === "all" ? "var(--ink)" : "var(--surface)", color: typeFilter === "all" ? "white" : "var(--ink)", cursor: "pointer" }}
        >
          All Types
        </button>
        <button 
          onClick={() => setTypeFilter("cooperatives")}
          style={{ padding: "6px 16px", borderRadius: 20, fontSize: 13, fontWeight: 500, whiteSpace: "nowrap", border: typeFilter === "cooperatives" ? "none" : "1px solid var(--hair)", background: typeFilter === "cooperatives" ? "var(--ink)" : "var(--surface)", color: typeFilter === "cooperatives" ? "white" : "var(--ink)", cursor: "pointer" }}
        >
          Cooperatives
        </button>
        <button 
          onClick={() => setTypeFilter("processors")}
          style={{ padding: "6px 16px", borderRadius: 20, fontSize: 13, fontWeight: 500, whiteSpace: "nowrap", border: typeFilter === "processors" ? "none" : "1px solid var(--hair)", background: typeFilter === "processors" ? "var(--ink)" : "var(--surface)", color: typeFilter === "processors" ? "white" : "var(--ink)", cursor: "pointer" }}
        >
          Processors / Mills
        </button>
        <div style={{ width: 1, height: 20, background: "var(--hair)", margin: "0 4px", alignSelf: "center" }} />
        <button 
          onClick={() => setProductFilter(productFilter === "copra" ? "all" : "copra")}
          style={{ padding: "6px 16px", borderRadius: 20, fontSize: 13, fontWeight: 500, whiteSpace: "nowrap", border: productFilter === "copra" ? "1px solid var(--brand)" : "1px solid var(--hair)", background: productFilter === "copra" ? "var(--brand-tint)" : "var(--surface)", color: productFilter === "copra" ? "var(--brand)" : "var(--ink)", cursor: "pointer" }}
        >
          🥥 Copra
        </button>
        <button 
          onClick={() => setProductFilter(productFilter === "whole_nut" ? "all" : "whole_nut")}
          style={{ padding: "6px 16px", borderRadius: 20, fontSize: 13, fontWeight: 500, whiteSpace: "nowrap", border: productFilter === "whole_nut" ? "1px solid var(--brand)" : "1px solid var(--hair)", background: productFilter === "whole_nut" ? "var(--brand-tint)" : "var(--surface)", color: productFilter === "whole_nut" ? "var(--brand)" : "var(--ink)", cursor: "pointer" }}
        >
          🥥 Whole Nut
        </button>
      </div>
      
      <div style={{ flex: 1, minHeight: 0, borderRadius: "var(--radius) var(--radius) 0 0", overflow: "hidden", border: "1px solid var(--hair)", borderBottom: "none" }}>
        <MapContainer center={origin} zoom={5} style={{ height: "100%", width: "100%", zIndex: 0 }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />

          {/* Business (origin) marker */}
          <Marker position={origin} icon={myIcon}>
            <Popup>
              <strong>{DEMO_BUSINESS.name}</strong><br/>
              Your Location
            </Popup>
          </Marker>

          {/* Potential Sources Markers */}
          {displayedSources.map(partner => (
            <Marker 
              key={partner.id} 
              position={[partner.location.lat, partner.location.lng]}
              icon={sourceIcon}
            >
              <Popup>
                <div style={{ padding: "4px 0" }}>
                  <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", color: "var(--muted)", letterSpacing: "0.05em", marginBottom: 2 }}>
                    {ROLE_LABEL[partner.role]}
                  </div>
                  <strong style={{ fontSize: 14, display: "block", marginBottom: 4 }}>{partner.name}</strong>
                  <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 4 }}>
                    {partner.location.name}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--ink)", marginBottom: 8, textTransform: "capitalize" }}>
                    <span style={{ fontWeight: 600, color: "var(--muted)" }}>Offers:</span> {partner.products.map(p => p.replace("_", " ")).join(", ")}
                  </div>
                  <button 
                    className="btn btn--primary btn--block" 
                    style={{ padding: "6px 12px", fontSize: 12 }}
                    onClick={() => {
                      alert(`Connection request sent to ${partner.name}!`);
                    }}
                  >
                    Send Request
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
          {/* Active Partners Markers */}
          {activePartners.map(partner => (
            <Marker 
              key={partner.id} 
              position={[partner.location.lat, partner.location.lng]}
              icon={activePartnerIcon}
            >
              <Popup>
                <div style={{ padding: "4px 0" }}>
                  <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", color: "#2563eb", letterSpacing: "0.05em", marginBottom: 2 }}>
                    Active Partner
                  </div>
                  <strong style={{ fontSize: 14, display: "block", marginBottom: 4 }}>{partner.name}</strong>
                  <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 4 }}>
                    {partner.location.name}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--ink)", marginBottom: 8, textTransform: "capitalize" }}>
                    <span style={{ fontWeight: 600, color: "var(--muted)" }}>Offers:</span> {partner.products.map(p => p.replace("_", " ")).join(", ")}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Disrupted Partners Markers */}
          {disruptedPartners.map(partner => (
            <Marker 
              key={partner.id} 
              position={[partner.location.lat, partner.location.lng]}
              icon={disruptedPartnerIcon}
            >
              <Popup>
                <div style={{ padding: "4px 0" }}>
                  <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", color: "var(--alert)", letterSpacing: "0.05em", marginBottom: 2 }}>
                    Disrupted Partner
                  </div>
                  <strong style={{ fontSize: 14, display: "block", marginBottom: 4 }}>{partner.name}</strong>
                  <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 4 }}>
                    {partner.location.name}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--ink)", marginBottom: 8, lineHeight: 1.4 }}>
                    <span style={{ fontWeight: 600, color: "var(--muted)" }}>Status:</span> <span style={{ color: "var(--alert)" }}>{partner.disasterStatus === "affected" ? "Affected by Disaster" : "At Risk of Disruption"}</span>
                    <br/>
                    <span style={{ fontWeight: 600, color: "var(--muted)" }}>Route:</span> <span style={{ color: "var(--alert)" }}>{partner.routeStatus === "blocked" ? "Route Blocked" : "Limited Access"}</span>
                  </div>
                  <button 
                    className="btn btn--primary btn--block" 
                    style={{ padding: "6px 12px", fontSize: 12, background: "var(--alert)" }}
                    onClick={() => {
                      if (onFix) onFix(partner);
                      else navigate("/sme/match");
                    }}
                  >
                    Find Alternatives
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Lines to Active Partners */}
          {activePartners.map(partner => (
            <Polyline
              key={`line-${partner.id}`}
              positions={[origin, [partner.location.lat, partner.location.lng]]}
              color="#2563eb"
              weight={2}
              opacity={0.6}
            />
          ))}

          {/* Lines to Disrupted Partners */}
          {disruptedPartners.map(partner => (
            <Polyline
              key={`line-${partner.id}`}
              positions={[origin, [partner.location.lat, partner.location.lng]]}
              color="var(--alert)"
              weight={2}
              dashArray="5, 8"
              opacity={0.8}
            />
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
