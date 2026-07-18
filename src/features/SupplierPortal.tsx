import { DEMO_SUPPLIER } from "../domain/mockData";
import type { StockItem } from "../domain/types";
import { PinIcon } from "../ui/icons";
import { BottomNav } from "../ui/BottomNav";
import { Routes, Route, Navigate } from "react-router-dom";

const SUPPLIER = DEMO_SUPPLIER;

const ROUTE_BADGE: Record<string, { label: string; cls: string }> = {
  open: { label: "Route open", cls: "badge badge--ok" },
  limited: { label: "Route limited", cls: "badge badge--warn" },
  blocked: { label: "Route blocked", cls: "badge badge--alert" },
};

const PRODUCT_EMOJI: Record<string, string> = {
  copra: "🥥",
  whole_nut: "🌴",
  husk: "🪵",
  coir: "🧵",
  coconut_oil: "🫙",
  desiccated: "🫙",
  coco_water: "💧",
};

function StockCard({ item, index }: { item: StockItem; index: number }) {
  const pct = Math.round((item.availableTons / item.totalCapacityTons) * 100);
  const urgency = item.freshnessDays <= 7 ? "alert" : item.freshnessDays <= 14 ? "warn" : "ok";
  const barColor = urgency === "ok" ? "var(--brand)" : urgency === "warn" ? "var(--warn)" : "var(--alert)";
  const routeBadge = ROUTE_BADGE[item.routeStatus];
  const emoji = PRODUCT_EMOJI[item.product] ?? "📦";

  return (
    <div style={{
      background: "var(--surface)",
      border: "1.5px solid var(--hair)",
      borderRadius: "var(--radius-lg)",
      overflow: "hidden",
      boxShadow: index === 0 ? "0 2px 12px -6px rgba(30,110,79,0.2)" : "none",
    }}>
      {/* Card header */}
      <div style={{
        padding: "14px 16px 12px",
        borderBottom: "1px solid var(--hair)",
        display: "flex",
        alignItems: "center",
        gap: 12,
      }}>
        <div style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          background: "var(--brand-tint)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 22,
          flexShrink: 0,
        }}>
          {emoji}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 600, fontSize: 16, fontFamily: "var(--font-display)" }}>
            {item.label}
          </div>
          <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 1 }}>
            ₱{item.pricePhpPerTon.toLocaleString("en-PH")}/ton · asking price
          </div>
        </div>
        <span className={routeBadge.cls} style={{ flexShrink: 0 }}>
          {routeBadge.label}
        </span>
      </div>

      {/* Stock bar */}
      <div style={{ padding: "14px 16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
          <span style={{ fontWeight: 700, fontSize: 28, fontFamily: "var(--font-display)", color: "var(--ink)", lineHeight: 1 }}>
            {item.availableTons}
            <span style={{ fontWeight: 400, fontSize: 14, color: "var(--muted)", marginLeft: 4 }}>t</span>
          </span>
          <span style={{ fontSize: 13, color: "var(--muted)" }}>
            of {item.totalCapacityTons} t capacity ({pct}%)
          </span>
        </div>

        {/* Progress bar */}
        <div style={{
          height: 10,
          background: "var(--surface-sunk)",
          borderRadius: 6,
          overflow: "hidden",
        }}>
          <div style={{
            width: `${pct}%`,
            height: "100%",
            background: barColor,
            borderRadius: 6,
            transition: "width 600ms ease",
          }} />
        </div>

        {/* Freshness indicator */}
        <div style={{
          marginTop: 10,
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "7px 10px",
          borderRadius: 8,
          background: urgency === "ok"
            ? "var(--brand-tint)"
            : urgency === "warn"
            ? "var(--warn-tint)"
            : "var(--alert-tint)",
        }}>
          <span style={{ fontSize: 14 }}>
            {urgency === "ok" ? "✅" : urgency === "warn" ? "⏰" : "🔴"}
          </span>
          <span style={{
            fontSize: 12.5,
            fontWeight: 500,
            color: urgency === "ok"
              ? "var(--brand)"
              : urgency === "warn"
              ? "var(--warn)"
              : "var(--alert)",
          }}>
            {item.freshnessDays <= 7
              ? `Urgent — must move within ${item.freshnessDays} day${item.freshnessDays === 1 ? "" : "s"}`
              : `Fresh for ${item.freshnessDays} more days`}
          </span>
        </div>
      </div>
    </div>
  );
}

function SupplierHome() {
  const isOperating = SUPPLIER.disasterStatus === "unaffected";
  const totalTons = SUPPLIER.stock.reduce((s, i) => s + i.availableTons, 0);

  return (
    <div className="shell" style={{ paddingBottom: 100 }}>
      {/* Hero */}
      <div className="home-hero">
        <div className="home-hero__name">{SUPPLIER.name}</div>
        <div className="home-hero__loc">
          <PinIcon size={13} /> {SUPPLIER.location.name}
          {SUPPLIER.verified && <span style={{ marginLeft: 8, color: "var(--brand)", fontWeight: 600 }}>✓ Verified</span>}
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
          <span className={`status-pill ${isOperating ? "status-pill--ok" : "status-pill--alert"}`}>
            {isOperating ? "✓ Fully operational" : "⚠ Disrupted"}
          </span>
        </div>
        <p className="explainer">
          You have <strong>{totalTons} tons</strong> of stock ready to move across{" "}
          <strong>{SUPPLIER.stock.length} product lines</strong>. Buyers matching your inventory are
          listed below.
        </p>
      </div>

      {/* Quick stats */}
      <div className="grid grid--stats" style={{ marginTop: 18 }}>
        <div className="stat">
          <div className="stat__value">{totalTons}<span style={{ fontSize: 14, fontWeight: 400 }}> t</span></div>
          <div className="stat__label">Stock ready</div>
        </div>
        <div className="stat">
          <div className="stat__value">{SUPPLIER.activeBuyerCount}</div>
          <div className="stat__label">Active buyers</div>
        </div>
        <div className="stat">
          <div className="stat__value">★ {SUPPLIER.rating}</div>
          <div className="stat__label">Your rating</div>
        </div>
      </div>

      {/* Stock cards */}
      <div className="section">
        <div className="section__label">
          <h2>Available inventory</h2>
          <span className="section__count">{SUPPLIER.stock.length} products</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {SUPPLIER.stock.map((item, index) => (
            <StockCard key={item.product} item={item} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

/** Supplier Portal — accessible via /supplier */
export function SupplierPortal() {
  return (
    <div className="portal-layout">
      <div className="screen-content">
        <Routes>
          <Route index element={<SupplierHome />} />
          <Route path="*" element={<Navigate to="/supplier" replace />} />
        </Routes>
      </div>
      <BottomNav tabs={[
        { name: "Inventory", path: "/supplier", iconName: "home" },
        { name: "Orders", path: "/supplier/orders", iconName: "receipt" },
        { name: "Profile", path: "/supplier/profile", iconName: "user" },
      ]} />
    </div>
  );
}
