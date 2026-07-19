import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import type { BusinessProfile } from "../domain/types";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

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

const memberIcon = createPin("var(--brand)");
const originIcon = createPin("var(--ink)");

export function ProfileScreen({ business }: { business: BusinessProfile }) {
  const origin = [business.location.lat, business.location.lng] as [number, number];

  return (
    <div className="shell" style={{ display: "flex", flexDirection: "column", height: "100%", paddingBottom: 0 }}>
      <div className="page-head" style={{ padding: "24px 20px 12px" }}>
        <span className="eyebrow">Account Settings</span>
        <h2 className="title">Cooperative Profile</h2>
      </div>
      
      <div style={{ flex: 1, overflowY: "auto", padding: "0 20px 24px" }}>
        <div className="grid" style={{ marginBottom: 24 }}>
          <div className="stat">
            <div className="stat__label">Cooperative Name</div>
            <div className="stat__value" style={{ fontSize: "18px" }}>{business.name}</div>
          </div>
          <div className="stat">
            <div className="stat__label">Location</div>
            <div className="stat__value" style={{ fontSize: "18px" }}>{business.location.name}</div>
          </div>
          <div className="stat">
            <div className="stat__label">Monthly Volume</div>
            <div className="stat__value">{business.monthlyVolumeTons} t</div>
          </div>
          <div className="stat">
            <div className="stat__label">Active Partners</div>
            <div className="stat__value">{business.currentPartners.length}</div>
          </div>
        </div>

        <div>
          <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 600 }}>Cooperative Members Directory</h3>
          
          {/* Members Map */}
          {business.members && business.members.length > 0 && (
            <div style={{ height: 250, borderRadius: "var(--radius-lg)", overflow: "hidden", marginBottom: 16, border: "1px solid var(--hair)", zIndex: 0 }}>
              <MapContainer center={origin} zoom={11} style={{ height: "100%", width: "100%", zIndex: 0 }}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                />
                <Marker position={origin} icon={originIcon}>
                  <Popup><strong>{business.name}</strong><br/>HQ Location</Popup>
                </Marker>
                {business.members.map(m => (
                  <Marker key={m.id} position={[m.location.lat, m.location.lng]} icon={memberIcon}>
                    <Popup>
                      <strong>{m.name}</strong><br/>
                      {m.products.map(p => p.replace("copra", "Coconut").replace(/_/g, " ")).join(", ")}
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          )}

          {/* Members List */}
          {business.members && business.members.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {business.members.map(member => (
                <div key={member.id} style={{ padding: 16, background: "var(--surface)", border: "1px solid var(--hair)", borderRadius: "var(--radius)" }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "var(--ink)", marginBottom: 4 }}>{member.name}</div>
                  <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 12 }}>📍 {member.location.name}</div>
                  
                  <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13, color: "var(--ink)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "var(--muted)" }}>Products</span>
                      <span style={{ fontWeight: 500 }}>{member.products.map(p => p.replace("copra", "Coconut").replace(/_/g, " ")).join(", ")}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "var(--muted)" }}>Monthly Volume</span>
                      <span style={{ fontWeight: 500 }}>{member.monthlyVolumeTons} Tons</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, paddingTop: 10, borderTop: "1px solid var(--hair)" }}>
                      <span style={{ color: "var(--muted)" }}>Contact</span>
                      <span style={{ fontWeight: 500, color: "var(--brand)" }}>📞 {member.contactNumber}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: 24, textAlign: "center", color: "var(--muted)", border: "1px dashed var(--hair)", borderRadius: "var(--radius)" }}>
              No members registered.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
