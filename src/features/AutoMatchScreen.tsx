import { useMemo } from "react";
import { findAlternatives } from "../domain/matching";
import { NETWORK } from "../domain/mockData";
import { buildRecoveryNeed } from "../domain/recovery";
import type { BusinessProfile, MatchResult, Partner } from "../domain/types";
import { ArrowLeftIcon } from "../ui/icons";
import { ROLE_LABEL } from "../ui/labels";
import { distanceKm } from "../domain/geo";

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
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, lineHeight: 1, color: rankColor }}>{total}</span>
            <span style={{ fontSize: 9, color: "var(--muted)", letterSpacing: "0.05em", textTransform: "uppercase" }}>score</span>
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
          {rank === 0 ? "✓ Connect with this partner" : "Connect →"}
        </button>
      </div>
    </div>
  );
}

/** Auto-runs the matching algorithm and displays top 3 results immediately. No user input needed. */
export function AutoMatchScreen({ business, affectedPartner, onBack, onSelect }: AutoMatchScreenProps) {
  const disruption = affectedPartner.role === "buyer" ? "buyer_unavailable" as const : "supplier_unavailable" as const;
  const need = useMemo(
    () => buildRecoveryNeed(business, affectedPartner, disruption),
    [business, affectedPartner, disruption]
  );
  const results = useMemo(() => findAlternatives(NETWORK, need), [need]);
  const roleWord = ROLE_LABEL[need.neededRole].toLowerCase();

  return (
    <div className="shell">
      <div className="page-head">
        <button type="button" className="progress__back" aria-label="Back" onClick={onBack}>
          <ArrowLeftIcon size={20} />
        </button>
        <span className="eyebrow">AI-Matched Replacements</span>
        <h1 className="title">
          Top {results.length} {roleWord}{results.length !== 1 ? "s" : ""} found
        </h1>
        <p className="subtitle">
          Ranked by distance, price, capacity, reliability &amp; route status — replacing{" "}
          <strong>{affectedPartner.name}</strong> automatically.
        </p>
      </div>

      {/* Summary chips */}
      {results.length > 0 && (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 14 }}>
          <span className="badge badge--ok">
            {Math.round(distanceKm(business.location, results[0].partner.location))} km closest
          </span>
          <span className="badge badge--ok">
            ₱{results[0].partner.pricePhpPerTon.toLocaleString("en-PH")}/t best price
          </span>
          <span className="badge badge--neutral">
            {results.filter(r => r.partner.verified).length} verified
          </span>
        </div>
      )}

      <div className="section" style={{ paddingBottom: 80 }}>
        {results.length === 0 ? (
          <div style={{ padding: "32px 0", textAlign: "center" }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>🔍</div>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>No replacements found</div>
            <p className="subtitle">No available partners match your criteria right now. Try again as the network comes back online.</p>
          </div>
        ) : (
          results.map((result, index) => (
            <div key={result.partner.id} style={{ marginBottom: 16 }}>
              <MatchCard result={result} rank={index} onSelect={onSelect} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
