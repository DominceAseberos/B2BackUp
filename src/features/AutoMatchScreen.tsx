import { useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { ArrowLeftIcon } from "../ui/icons";
import { findAlternatives } from "../domain/matching";
import { NETWORK } from "../domain/mockData";
import { buildRecoveryNeed } from "../domain/recovery";
import type { BusinessProfile, MatchResult, Partner } from "../domain/types";
import { ROLE_LABEL } from "../ui/labels";

interface AutoMatchScreenProps {
  business: BusinessProfile;
  affectedPartner: Partner;
  onBack: () => void;
  onSelect: (result: MatchResult) => void;
}

const RANK_LABELS = ["Best Match", "2nd Option", "3rd Option"];
const RANK_COLORS = ["var(--brand)", "var(--warn)", "var(--muted)"];
const RANK_BG = ["var(--brand-tint)", "var(--warn-tint)", "var(--surface-sunk)"];

function ScoreBar({ score }: { score: number }) {
  const pct = Math.round(score);
  const color = pct >= 70 ? "var(--brand)" : pct >= 45 ? "var(--warn)" : "var(--alert)";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{
        flex: 1,
        height: 6,
        borderRadius: 4,
        background: "var(--surface-sunk)",
        overflow: "hidden",
      }}>
        <div style={{
          width: `${pct}%`,
          height: "100%",
          background: color,
          borderRadius: 4,
          transition: "width 600ms ease",
        }} />
      </div>
      <span style={{ fontSize: 13, fontWeight: 600, color, minWidth: 34, textAlign: "right" }}>
        {pct}%
      </span>
    </div>
  );
}

function CriteriaRow({ label, detail, score }: { label: string; detail: string; score: number }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "5px 0", borderBottom: "1px solid var(--hair)" }}>
      <span style={{ fontSize: 13, color: "var(--muted)" }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 500, color: score >= 0.5 ? "var(--ink)" : "var(--alert)" }}>{detail}</span>
    </div>
  );
}

function MatchCard({ result, rank, onSelect }: { result: MatchResult; rank: number; onSelect: (r: MatchResult) => void }) {
  const { partner, total, criteria } = result;
  const distanceCrit = criteria.find(c => c.key === "distance");
  const priceCrit = criteria.find(c => c.key === "price");
  const capacityCrit = criteria.find(c => c.key === "capacity");
  const reliabilityCrit = criteria.find(c => c.key === "reliability");
  const logisticsCrit = criteria.find(c => c.key === "logistics");

  const rankColor = RANK_COLORS[rank] ?? "var(--muted)";
  const rankBg = RANK_BG[rank] ?? "var(--surface-sunk)";
  const rankLabel = RANK_LABELS[rank] ?? `#${rank + 1}`;

  return (
    <div style={{
      background: "var(--surface)",
      border: `1.5px solid ${rank === 0 ? "var(--brand)" : "var(--hair)"}`,
      borderRadius: "var(--radius-lg)",
      overflow: "hidden",
      boxShadow: rank === 0 ? "0 4px 20px -8px rgba(30,110,79,0.35)" : "none",
    }}>
      {/* Card header */}
      <div style={{ padding: "16px 18px 12px", borderBottom: "1px solid var(--hair)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <span style={{
              display: "inline-block",
              padding: "2px 10px",
              borderRadius: 999,
              background: rankBg,
              color: rankColor,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              marginBottom: 6,
            }}>{rankLabel}</span>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 17, lineHeight: 1.2 }}>
              {partner.name}
            </div>
            <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 3 }}>
              📍 {partner.location.name}
              {partner.verified && <span style={{ marginLeft: 8, color: "var(--brand)" }}>✓ Verified</span>}
            </div>
          </div>
          {/* Score ring */}
          <div style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            border: `3px solid ${rankColor}`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, lineHeight: 1, color: rankColor }}>{total}%</span>
            <span style={{ fontSize: 9, color: "var(--muted)", letterSpacing: "0.05em", textTransform: "uppercase" }}>match</span>
          </div>
        </div>

        {/* Score bar */}
        <div style={{ marginTop: 12 }}>
          <ScoreBar score={total} />
        </div>
      </div>

      {/* Criteria breakdown */}
      <div style={{ padding: "10px 18px" }}>
        {distanceCrit && <CriteriaRow label="📏 Distance" detail={distanceCrit.detail} score={distanceCrit.score} />}
        {priceCrit && <CriteriaRow label="💰 Price" detail={priceCrit.detail} score={priceCrit.score} />}
        {capacityCrit && <CriteriaRow label="📦 Capacity" detail={capacityCrit.detail} score={capacityCrit.score} />}
        {reliabilityCrit && <CriteriaRow label="⭐ Reliability" detail={reliabilityCrit.detail} score={reliabilityCrit.score} />}
        {logisticsCrit && <CriteriaRow label="🚚 Route" detail={logisticsCrit.detail} score={logisticsCrit.score} />}
      </div>

      {/* Action */}
      <div style={{ padding: "12px 18px 16px" }}>
        <button
          type="button"
          className={`btn btn--block ${rank === 0 ? "btn--primary" : "btn--ghost"}`}
          onClick={() => onSelect(result)}
        >
          {rank === 0 ? "✓ Accept Match" : "Accept Match →"}
        </button>
      </div>
    </div>
  );
}

const createPin = (color: string) => L.divIcon({
  className: "custom-pin",
  html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" width="28" height="28"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>`,
  iconSize: [28, 28],
  iconAnchor: [14, 28],
  popupAnchor: [0, -28],
});

const homeIcon = createPin("var(--ink)");
const matchIcon = createPin("var(--brand)");
const altIcon = createPin("var(--muted)");

/** Auto-runs the matching algorithm and displays top 3 results immediately. No user input needed. */
export function AutoMatchScreen({ business, affectedPartner, onBack, onSelect }: AutoMatchScreenProps) {
  const [showSheet, setShowSheet] = useState(true);
  const disruption = affectedPartner.role === "buyer" ? "buyer_unavailable" as const : "supplier_unavailable" as const;
  const need = useMemo(
    () => buildRecoveryNeed(business, affectedPartner, disruption),
    [business, affectedPartner, disruption]
  );
  
  // Results are sorted highest score first
  const results = useMemo(() => findAlternatives(NETWORK, need), [need]);
  const roleWord = ROLE_LABEL[need.neededRole].toLowerCase();

  const origin = [business.location.lat, business.location.lng] as [number, number];

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Background Map */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 }}>
        <MapContainer center={origin} zoom={7} style={{ height: "100%", width: "100%", zIndex: 0 }} zoomControl={false}>
          <TileLayer
            attribution='&copy; OpenStreetMap'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />
          
          <Marker position={origin} icon={homeIcon}>
            <Popup><strong>{business.name}</strong><br />Your location</Popup>
          </Marker>

          {results.map((r, i) => {
            const dest = [r.partner.location.lat, r.partner.location.lng] as [number, number];
            // Top 3 matches get the brand pin, others get the muted pin
            const icon = i < 3 ? matchIcon : altIcon;
            return (
              <Marker key={r.partner.id} position={dest} icon={icon}>
                <Popup>
                  <strong>{r.partner.name}</strong><br />
                  Match score: {r.total}%
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      {/* Floating Header */}
      <div style={{
        position: "absolute",
        top: 0, left: 0, right: 0,
        padding: "16px",
        zIndex: 10,
        background: "linear-gradient(to bottom, rgba(243,241,233,0.9) 0%, rgba(243,241,233,0) 100%)",
        pointerEvents: "none",
      }}>
        <button
          type="button"
          className="progress__back"
          style={{ pointerEvents: "auto", background: "var(--surface)", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
          onClick={onBack}
        >
          <ArrowLeftIcon size={20} />
        </button>
      </div>

      {/* Floating Button to re-open sheet if closed */}
      {!showSheet && (
        <div style={{ position: "absolute", bottom: 24, left: "50%", transform: "translateX(-50%)", zIndex: 10 }}>
          <button className="btn btn--primary" style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }} onClick={() => setShowSheet(true)}>
            View Recommendations
          </button>
        </div>
      )}

      {/* Bottom Sheet / Modal Overlay */}
      {showSheet && (
        <div style={{
          position: "absolute",
          bottom: 0, left: 0, right: 0,
          zIndex: 10,
          background: "var(--surface)",
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          boxShadow: "0 -4px 24px rgba(0,0,0,0.1)",
          display: "flex",
          flexDirection: "column",
          maxHeight: "85%", // Allow map to show at top
        }}>
          {/* Drag handle pill / Header */}
          <div style={{ position: "relative", width: "100%", display: "flex", justifyContent: "center", paddingTop: 12, paddingBottom: 12 }}>
            <div style={{ width: 40, height: 4, borderRadius: 2, background: "var(--hair)", cursor: "pointer" }} onClick={() => setShowSheet(false)} />
            <button 
              type="button" 
              onClick={() => setShowSheet(false)}
              style={{ position: "absolute", right: 16, top: 12, background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: 24, lineHeight: 1 }}
            >
              &times;
            </button>
          </div>

          <div style={{ padding: "0 20px 16px" }}>
            <span className="eyebrow">Automated Recommendations</span>
            <h1 className="title" style={{ fontSize: 24 }}>
              Top 3 {roleWord}{results.length !== 1 ? "s" : ""} recommended
            </h1>
            <p className="subtitle" style={{ fontSize: 13, marginBottom: 0 }}>
              {results.length} total options available on map.
            </p>
          </div>

          {/* Scrollable list of cards */}
          <div style={{
            flex: 1,
            overflowY: "auto",
            padding: "0 20px 24px",
            display: "flex",
            flexDirection: "column",
            gap: 16,
            scrollbarWidth: "none",
          }}>
            {results.length === 0 ? (
              <div style={{ padding: "32px 0", textAlign: "center" }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>🔍</div>
                <div style={{ fontWeight: 600, marginBottom: 6 }}>No replacements found</div>
              </div>
            ) : (
              results.slice(0, 3).map((result, index) => (
                <MatchCard key={result.partner.id} result={result} rank={index} onSelect={onSelect} />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
