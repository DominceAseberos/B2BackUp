import { DEMO_SUPPLIER } from "../domain/mockData";
import type { StockItem } from "../domain/types";
import { PinIcon } from "../ui/icons";
import { BottomNav } from "../ui/BottomNav";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { AIBcpScreen } from "./AIBcpScreen";

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
  const location = useLocation();
  const navigate = useNavigate();
  const disasterActive = location.search.includes("disaster=1");
  const isOperating = !disasterActive;
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

      {disasterActive && (
        <div style={{
          marginTop: 18,
          padding: 16,
          background: "rgba(198,71,43,0.06)",
          border: "1px solid rgba(198,71,43,0.2)",
          borderRadius: "var(--radius-lg)"
        }}>
          <h3 style={{ color: "var(--alert)", margin: "0 0 8px", fontSize: 16 }}>🚨 Cooperative Continuity Plan Activated</h3>
          <p style={{ fontSize: 13, color: "var(--ink)", margin: "0 0 12px", lineHeight: 1.5 }}>
            Your supply chain is currently disrupted. Our AI agent can analyze the real-time risk to your active inventory and instantly generate a recovery strategy.
          </p>
          <button 
            className="btn btn--primary btn--block" 
            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
            onClick={() => navigate("/supplier/ai-bcp")}
          >
            <span style={{ fontSize: 14 }}>✨</span> Generate AI Continuity Plan
          </button>
        </div>
      )}

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

type OrderStatus = "pending" | "confirmed" | "in_transit" | "completed" | "cancelled";

interface MockOrder {
  id: string;
  buyer: string;
  location: string;
  product: string;
  tons: number;
  pricePhpPerTon: number;
  status: OrderStatus;
  date: string;
  eta?: string;
}

const MOCK_ORDERS: MockOrder[] = [
  {
    id: "ORD-2024-001",
    buyer: "Digos Copra Milling Co-op",
    location: "Digos, Davao del Sur",
    product: "Copra",
    tons: 30,
    pricePhpPerTon: 39500,
    status: "in_transit",
    date: "Jul 17, 2026",
    eta: "Jul 19, 2026",
  },
  {
    id: "ORD-2024-002",
    buyer: "Koronadal Coco Oil Refiners",
    location: "Koronadal, South Cotabato",
    product: "Copra",
    tons: 20,
    pricePhpPerTon: 39500,
    status: "pending",
    date: "Jul 18, 2026",
  },
  {
    id: "ORD-2024-003",
    buyer: "SouthPoint Oleochemicals",
    location: "General Santos",
    product: "Whole Coconut",
    tons: 15,
    pricePhpPerTon: 8200,
    status: "pending",
    date: "Jul 18, 2026",
  },
  {
    id: "ORD-2024-004",
    buyer: "Tagum Valley Traders",
    location: "Tagum, Davao del Norte",
    product: "Copra",
    tons: 25,
    pricePhpPerTon: 39000,
    status: "completed",
    date: "Jul 14, 2026",
  },
  {
    id: "ORD-2024-005",
    buyer: "Northern Mindanao Coco Exporters",
    location: "Cagayan de Oro",
    product: "Coconut Husk",
    tons: 10,
    pricePhpPerTon: 9000,
    status: "cancelled",
    date: "Jul 12, 2026",
  },
];

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bg: string; icon: string }> = {
  pending:    { label: "Pending",    color: "var(--warn)",   bg: "var(--warn-tint)",   icon: "⏳" },
  confirmed:  { label: "Confirmed",  color: "var(--brand)",  bg: "var(--brand-tint)",  icon: "✅" },
  in_transit: { label: "In Transit", color: "#2563eb",       bg: "#eff6ff",             icon: "🚚" },
  completed:  { label: "Completed",  color: "var(--brand)",  bg: "var(--brand-tint)",  icon: "✓"  },
  cancelled:  { label: "Cancelled",  color: "var(--muted)",  bg: "var(--surface-sunk)", icon: "✕" },
};

function OrderCard({ order, onAccept, onDecline }: {
  order: MockOrder;
  onAccept?: (id: string) => void;
  onDecline?: (id: string) => void;
}) {
  const cfg = STATUS_CONFIG[order.status];
  const total = order.tons * order.pricePhpPerTon;

  return (
    <div style={{
      background: "var(--surface)",
      border: "1.5px solid var(--hair)",
      borderRadius: "var(--radius-lg)",
      overflow: "hidden",
    }}>
      {/* Header row */}
      <div style={{
        padding: "12px 14px",
        borderBottom: "1px solid var(--hair)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <span style={{ fontSize: 12, color: "var(--muted)", fontWeight: 500 }}>{order.id}</span>
        <span style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 4,
          padding: "3px 10px",
          borderRadius: 999,
          background: cfg.bg,
          color: cfg.color,
          fontSize: 12,
          fontWeight: 600,
        }}>
          {cfg.icon} {cfg.label}
        </span>
      </div>

      {/* Order body */}
      <div style={{ padding: "14px" }}>
        <div style={{ fontWeight: 600, fontSize: 15 }}>{order.buyer}</div>
        <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 2 }}>📍 {order.location}</div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 8,
          marginTop: 12,
        }}>
          <div style={{ background: "var(--surface-sunk)", borderRadius: 8, padding: "8px 10px" }}>
            <div style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Product</div>
            <div style={{ fontWeight: 600, fontSize: 13, marginTop: 2 }}>{order.product}</div>
          </div>
          <div style={{ background: "var(--surface-sunk)", borderRadius: 8, padding: "8px 10px" }}>
            <div style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Volume</div>
            <div style={{ fontWeight: 600, fontSize: 13, marginTop: 2 }}>{order.tons} tons</div>
          </div>
          <div style={{ background: "var(--surface-sunk)", borderRadius: 8, padding: "8px 10px" }}>
            <div style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Unit price</div>
            <div style={{ fontWeight: 600, fontSize: 13, marginTop: 2 }}>₱{order.pricePhpPerTon.toLocaleString("en-PH")}/t</div>
          </div>
          <div style={{ background: "var(--brand-tint)", borderRadius: 8, padding: "8px 10px" }}>
            <div style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Total</div>
            <div style={{ fontWeight: 700, fontSize: 13, color: "var(--brand)", marginTop: 2 }}>₱{total.toLocaleString("en-PH")}</div>
          </div>
        </div>

        {order.eta && (
          <div style={{ marginTop: 10, fontSize: 12.5, color: "#2563eb", fontWeight: 500 }}>
            🚚 ETA: {order.eta}
          </div>
        )}
        <div style={{ marginTop: 4, fontSize: 12, color: "var(--muted)" }}>Ordered: {order.date}</div>
      </div>

      {/* Actions for pending orders only */}
      {order.status === "pending" && onAccept && onDecline && (
        <div style={{
          padding: "12px 14px",
          borderTop: "1px solid var(--hair)",
          display: "flex",
          gap: 8,
        }}>
          <button
            type="button"
            className="btn btn--ghost"
            style={{ flex: 1, height: 40, fontSize: 13 }}
            onClick={() => onDecline(order.id)}
          >
            Decline
          </button>
          <button
            type="button"
            className="btn btn--primary"
            style={{ flex: 2, height: 40, fontSize: 13 }}
            onClick={() => onAccept(order.id)}
          >
            ✓ Accept Order
          </button>
        </div>
      )}
    </div>
  );
}

import { useState } from "react";

function SupplierOrders() {
  const [orders, setOrders] = useState<MockOrder[]>(MOCK_ORDERS);

  const pending   = orders.filter(o => o.status === "pending");
  const active    = orders.filter(o => o.status === "in_transit" || o.status === "confirmed");
  const history   = orders.filter(o => o.status === "completed" || o.status === "cancelled");

  const accept = (id: string) =>
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: "confirmed" as OrderStatus } : o));
  const decline = (id: string) =>
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: "cancelled" as OrderStatus } : o));

  const totalPending = pending.reduce((s, o) => s + o.tons * o.pricePhpPerTon, 0);

  return (
    <div className="shell" style={{ paddingBottom: 100 }}>
      <div className="page-head">
        <span className="eyebrow">Buyer Requests</span>
        <h1 className="title">Orders</h1>
        <p className="subtitle">
          Manage incoming purchase requests from buyers across the network.
        </p>
      </div>

      {/* Pending value summary */}
      {pending.length > 0 && (
        <div style={{
          marginTop: 14,
          padding: "12px 16px",
          borderRadius: "var(--radius)",
          background: "var(--warn-tint)",
          border: "1px solid color-mix(in srgb, var(--warn) 30%, var(--hair))",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: 14, color: "var(--warn)" }}>⏳ {pending.length} order{pending.length > 1 ? "s" : ""} awaiting your response</div>
            <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 1 }}>Total value: ₱{totalPending.toLocaleString("en-PH")}</div>
          </div>
        </div>
      )}

      {/* Pending */}
      {pending.length > 0 && (
        <div className="section">
          <div className="section__label">
            <h2>Needs action</h2>
            <span className="section__count">{pending.length}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {pending.map(o => (
              <OrderCard key={o.id} order={o} onAccept={accept} onDecline={decline} />
            ))}
          </div>
        </div>
      )}

      {/* In transit / confirmed */}
      {active.length > 0 && (
        <div className="section">
          <div className="section__label">
            <h2>Active</h2>
            <span className="section__count">{active.length}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {active.map(o => <OrderCard key={o.id} order={o} />)}
          </div>
        </div>
      )}

      {/* History */}
      {history.length > 0 && (
        <div className="section">
          <div className="section__label">
            <h2>History</h2>
            <span className="section__count">{history.length}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {history.map(o => <OrderCard key={o.id} order={o} />)}
          </div>
        </div>
      )}
    </div>
  );
}

function SupplierProfile() {
  return (
    <div className="shell" style={{ paddingBottom: 100 }}>
      <div className="page-head">
        <span className="eyebrow">Account</span>
        <h1 className="title">Profile</h1>
      </div>
      <div className="grid">
        <div className="stat">
          <div className="stat__label">Cooperative Name</div>
          <div className="stat__value" style={{ fontSize: 17 }}>{SUPPLIER.name}</div>
        </div>
        <div className="stat">
          <div className="stat__label">Location</div>
          <div className="stat__value" style={{ fontSize: 17 }}>{SUPPLIER.location.name}</div>
        </div>
        <div className="stat">
          <div className="stat__value">★ {SUPPLIER.rating}</div>
          <div className="stat__label">Verified supplier</div>
        </div>
        <div className="stat">
          <div className="stat__value">{SUPPLIER.activeBuyerCount}</div>
          <div className="stat__label">Active buyers</div>
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
          <Route path="orders" element={<SupplierOrders />} />
          <Route path="profile" element={<SupplierProfile />} />
          <Route path="ai-bcp" element={<AIBcpScreen />} />
          <Route path="*" element={<Navigate to="/supplier" replace />} />
        </Routes>
      </div>
      <BottomNav tabs={[
        { name: "Inventory", path: "/supplier", iconName: "home" },
        { name: "Orders",    path: "/supplier/orders",  iconName: "receipt" },
        { name: "Profile",  path: "/supplier/profile", iconName: "user" },
      ]} />
    </div>
  );
}
