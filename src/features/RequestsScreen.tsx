import { useState } from "react";
import { CheckCircle, XCircle, Clock, Truck } from "lucide-react";

type RequestStatus = "pending" | "accepted" | "declined" | "in_transit";

interface RequestData {
  id: string;
  buyerName: string;
  context: string;
  product: string;
  volumeTons: number;
  priceOffered: number;
  status: RequestStatus;
  date: string;
}

const MOCK_REQUESTS: RequestData[] = [
  {
    id: "req-001",
    buyerName: "General Santos Coco Mills",
    context: "Emergency Sourcing (Previous supplier flooded)",
    product: "Copra",
    volumeTons: 25,
    priceOffered: 42500,
    status: "pending",
    date: "Just now",
  },
  {
    id: "req-002",
    buyerName: "Davao Coco Exports",
    context: "Standard Monthly Replenishment",
    product: "Copra",
    volumeTons: 40,
    priceOffered: 41000,
    status: "pending",
    date: "2 hrs ago",
  },
  {
    id: "req-003",
    buyerName: "Mindanao Organic Processors",
    context: "Contract Fulfillment",
    product: "Whole Nut",
    volumeTons: 10,
    priceOffered: 9000,
    status: "in_transit",
    date: "Yesterday",
  }
];

export function RequestsScreen() {
  const [requests, setRequests] = useState<RequestData[]>(MOCK_REQUESTS);

  const handleStatusChange = (id: string, newStatus: RequestStatus) => {
    setRequests(prev => prev.map(req => req.id === id ? { ...req, status: newStatus } : req));
  };

  const pendingRequests = requests.filter(r => r.status === "pending");
  const activeRequests = requests.filter(r => r.status === "accepted" || r.status === "in_transit");

  return (
    <div className="shell" style={{ display: "flex", flexDirection: "column", height: "100%", paddingBottom: 0 }}>
      <div className="page-head" style={{ padding: "24px 20px 12px" }}>
        <span className="eyebrow">Marketplace</span>
        <h2 className="title">Inbound Requests</h2>
      </div>

      <div className="screen-content" style={{ padding: "0 20px 24px" }}>
        
        {/* Pending Requests Section */}
        <div style={{ marginBottom: 32 }}>
          <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
            <Clock size={18} color="var(--brand)" /> 
            Pending Requests ({pendingRequests.length})
          </h3>
          
          {pendingRequests.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {pendingRequests.map(req => (
                <div key={req.id} style={{ padding: 16, background: "var(--surface)", border: "1px solid var(--brand)", borderRadius: "var(--radius-lg)", boxShadow: "0 4px 12px rgba(30,110,79,0.05)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: "var(--ink)", marginBottom: 2 }}>{req.buyerName}</div>
                      <div style={{ fontSize: 12, color: "var(--alert)", fontWeight: 600, background: "var(--alert-tint)", padding: "2px 8px", borderRadius: 12, display: "inline-block" }}>
                        {req.context}
                      </div>
                    </div>
                    <div style={{ fontSize: 12, color: "var(--muted)" }}>{req.date}</div>
                  </div>
                  
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, margin: "16px 0", padding: "12px 0", borderTop: "1px solid var(--hair)", borderBottom: "1px solid var(--hair)" }}>
                    <div>
                      <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 2 }}>Requirement</div>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{req.volumeTons} Tons {req.product}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 2 }}>Price Offered</div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "var(--brand)" }}>₱{req.priceOffered.toLocaleString()} / Ton</div>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 8 }}>
                    <button 
                      onClick={() => handleStatusChange(req.id, "accepted")}
                      style={{ flex: 1, padding: "10px", background: "var(--brand)", color: "white", border: "none", borderRadius: 8, fontWeight: 600, display: "flex", justifyContent: "center", alignItems: "center", gap: 6, cursor: "pointer" }}
                    >
                      <CheckCircle size={18} /> Accept
                    </button>
                    <button 
                      onClick={() => handleStatusChange(req.id, "declined")}
                      style={{ flex: 1, padding: "10px", background: "var(--surface)", color: "var(--ink)", border: "1px solid var(--hair)", borderRadius: 8, fontWeight: 600, display: "flex", justifyContent: "center", alignItems: "center", gap: 6, cursor: "pointer" }}
                    >
                      <XCircle size={18} /> Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: 24, textAlign: "center", color: "var(--muted)", border: "1px dashed var(--hair)", borderRadius: "var(--radius)" }}>
              No pending requests.
            </div>
          )}
        </div>

        {/* Active Contracts Section */}
        <div>
          <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
            <Truck size={18} color="var(--ink)" /> 
            Active Contracts ({activeRequests.length})
          </h3>
          
          {activeRequests.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {activeRequests.map(req => (
                <div key={req.id} style={{ padding: 16, background: "var(--surface)", border: "1px solid var(--hair)", borderRadius: "var(--radius-lg)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: "var(--ink)" }}>{req.buyerName}</div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "white", background: req.status === "in_transit" ? "#2563eb" : "var(--brand)", padding: "4px 8px", borderRadius: 12 }}>
                      {req.status === "in_transit" ? "In Transit" : "Accepted"}
                    </div>
                  </div>
                  <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 8 }}>{req.context}</div>
                  
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "var(--ink)" }}>
                    <span>{req.volumeTons} Tons {req.product}</span>
                    <span style={{ fontWeight: 600 }}>₱{req.priceOffered.toLocaleString()} / Ton</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: 24, textAlign: "center", color: "var(--muted)", border: "1px dashed var(--hair)", borderRadius: "var(--radius)" }}>
              No active contracts.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
