import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { DEMO_BUSINESS } from "../domain/mockData";
import { ROLE_LABEL } from "../ui/labels";

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

const okIcon = createPin("var(--brand)");
const alertIcon = createPin("var(--alert)");


export function NetworkMapScreen() {
  const origin = [DEMO_BUSINESS.location.lat, DEMO_BUSINESS.location.lng] as [number, number];

  return (
    <div className="shell" style={{ display: "flex", flexDirection: "column", height: "100%", paddingBottom: 0 }}>
      <div className="page-head" style={{ marginBottom: 12 }}>
        <span className="eyebrow">Supply Chain Logistics</span>
        <h2 className="title">Map View</h2>
        <p className="subtitle">Visualizing {DEMO_BUSINESS.name}'s connections.</p>
      </div>
      
      <div style={{ flex: 1, minHeight: 0, borderRadius: "var(--radius)", overflow: "hidden", border: "1px solid var(--hair)" }}>
        <MapContainer center={origin} zoom={7} style={{ height: "100%", width: "100%", zIndex: 0 }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />

          {/* Business (origin) marker */}
          <Marker position={origin} icon={okIcon}>
            <Popup>
              <strong>{DEMO_BUSINESS.name}</strong>
              <br />
              Your location
            </Popup>
          </Marker>

          {/* Partner markers and lines */}
          {DEMO_BUSINESS.currentPartners.map((partner) => {
            const dest = [partner.location.lat, partner.location.lng] as [number, number];
            const isDown = partner.disasterStatus === "affected" || partner.routeStatus === "blocked";
            const color = isDown ? "var(--alert)" : "var(--brand)";

            return (
              <div key={partner.id}>
                <Polyline positions={[origin, dest]} color={color} weight={2} opacity={0.6} dashArray={isDown ? "5, 5" : undefined} />
                <Marker position={dest} icon={isDown ? alertIcon : okIcon}>
                  <Popup>
                    <strong>{partner.name}</strong>
                    <br />
                    {ROLE_LABEL[partner.role]} &middot; {partner.location.name}
                    {isDown && <div style={{ color: "var(--alert)", marginTop: 4 }}>⚠ Disrupted</div>}
                  </Popup>
                </Marker>
              </div>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}
