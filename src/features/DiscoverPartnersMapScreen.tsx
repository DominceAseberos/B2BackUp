import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
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

export function DiscoverPartnersMapScreen() {
  const navigate = useNavigate();
  const origin = [DEMO_BUSINESS.location.lat, DEMO_BUSINESS.location.lng] as [number, number];

  // Exclude current partners so we only show new potential sources
  const currentPartnerIds = new Set(DEMO_BUSINESS.currentPartners.map(p => p.id));
  const potentialSources = NETWORK.filter(p => !currentPartnerIds.has(p.id) && p.disasterStatus === "unaffected");

  return (
    <div className="shell" style={{ display: "flex", flexDirection: "column", height: "100%", paddingBottom: 0 }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "22px 0 12px" }}>
        <button type="button" className="progress__back" aria-label="Back" onClick={() => navigate(-1)} style={{ marginTop: 2 }}>
          <ArrowLeftIcon size={24} />
        </button>
        <div>
          <span className="eyebrow">Discover</span>
          <h2 className="title" style={{ margin: 0 }}>Verified Partners</h2>
          <p className="subtitle" style={{ margin: "4px 0 0" }}>Exploring all active sources across the Philippines.</p>
        </div>
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
          {potentialSources.map(partner => (
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
        </MapContainer>
      </div>
    </div>
  );
}
