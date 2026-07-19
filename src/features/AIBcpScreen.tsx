import { useState, useEffect } from "react";
import { ChevronLeft, Sparkles, AlertTriangle, ShieldCheck, Truck } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function AIBcpScreen() {
  const navigate = useNavigate();
  const [stage, setStage] = useState<number>(0);

  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 1500);
    const t2 = setTimeout(() => setStage(2), 3000);
    const t3 = setTimeout(() => setStage(3), 4500);
    const t4 = setTimeout(() => setStage(4), 6000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  return (
    <div className="shell" style={{ paddingBottom: 100, minHeight: "100vh" }}>
      <div className="page-head" style={{ borderBottom: "1px solid var(--hair)", paddingBottom: 16 }}>
        <button className="progress__back" onClick={() => navigate(-1)} aria-label="Go back">
          <ChevronLeft size={24} />
        </button>
        <div>
          <span className="eyebrow" style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Sparkles size={14} color="var(--brand)" /> AI Generated
          </span>
          <h1 className="title">Cooperative Continuity Plan</h1>
        </div>
      </div>

      <div style={{ padding: "24px 0", maxWidth: 600, margin: "0 auto" }}>
        
        {/* Stage 0: Loading */}
        {stage === 0 && (
          <div style={{ textAlign: "center", padding: "40px 0", color: "var(--muted)" }}>
            <Sparkles size={32} className="spin-slow" style={{ marginBottom: 16, color: "var(--brand)" }} />
            <div style={{ fontWeight: 500 }}>Analyzing supply chain disruption...</div>
          </div>
        )}

        {/* Stage 1: Risk Assessment */}
        {stage >= 1 && (
          <div className="bcp-card fade-in" style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div style={{ padding: 10, background: "rgba(198,71,43,0.1)", borderRadius: 12, color: "var(--alert)" }}>
                <AlertTriangle size={24} />
              </div>
              <div>
                <h3 style={{ margin: "0 0 6px", fontSize: 16 }}>Immediate Risk Assessment</h3>
                <p style={{ margin: 0, fontSize: 14, color: "var(--ink)", lineHeight: 1.5 }}>
                  Typhoon Kristine is tracking directly over your Cooperative HQ in Davao Region. 
                  <strong style={{ color: "var(--alert)" }}> 3 of your registered members</strong> (Juan, Maria, Pedro) are in the high-risk flood zone. 
                  An estimated <strong style={{ color: "var(--alert)" }}>65 Tons of Copra inventory</strong> is at severe risk of water damage within 48 hours.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Stage 2: Mitigation */}
        {stage >= 2 && (
          <div className="bcp-card fade-in" style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div style={{ padding: 10, background: "rgba(30,110,79,0.1)", borderRadius: 12, color: "var(--brand)" }}>
                <ShieldCheck size={24} />
              </div>
              <div>
                <h3 style={{ margin: "0 0 6px", fontSize: 16 }}>Action 1: Member Coordination</h3>
                <p style={{ margin: 0, fontSize: 14, color: "var(--ink)", lineHeight: 1.5 }}>
                  Automatically issued an emergency SMS broadcast to all 3 affected members to halt harvesting and elevate existing stock. Their outbound delivery schedules have been temporarily frozen to prevent logistics failures.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Stage 3: Logistics */}
        {stage >= 3 && (
          <div className="bcp-card fade-in" style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div style={{ padding: 10, background: "rgba(0,102,255,0.1)", borderRadius: 12, color: "#0066ff" }}>
                <Truck size={24} />
              </div>
              <div>
                <h3 style={{ margin: "0 0 6px", fontSize: 16 }}>Action 2: Prevent Contract Failure</h3>
                <p style={{ margin: 0, fontSize: 14, color: "var(--ink)", lineHeight: 1.5 }}>
                  To prevent defaulting on your buyer contracts, the system suggests diverting fulfillment to unaffected cooperative members in neighboring regions. You have enough surplus inventory outside the disaster zone to maintain 80% of your committed volume.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Stage 4: Financials & Approval */}
        {stage >= 4 && (
          <div className="fade-in" style={{ marginTop: 32 }}>
            <div style={{ padding: 20, background: "var(--surface)", border: "1.5px solid var(--brand)", borderRadius: "var(--radius-lg)", boxShadow: "0 4px 12px rgba(30,110,79,0.15)" }}>
              <h3 style={{ margin: "0 0 12px", fontSize: 18, color: "var(--brand)" }}>Recovery Summary</h3>
              <ul style={{ margin: 0, paddingLeft: 20, fontSize: 14, color: "var(--ink)", lineHeight: 1.6 }}>
                <li><strong>Estimated Asset Rescue:</strong> 82 Tons</li>
                <li><strong>Logistics Surcharge:</strong> ₱12,500</li>
                <li><strong>Net Recovery Value:</strong> ₱3,226,500</li>
              </ul>
              <button className="btn btn--primary btn--block" style={{ marginTop: 20 }} onClick={() => navigate(-1)}>
                Execute Continuity Plan →
              </button>
            </div>
          </div>
        )}

      </div>

      <style>{`
        .bcp-card {
          padding: 16px;
          background: var(--surface);
          border: 1px solid var(--hair);
          border-radius: var(--radius-lg);
          box-shadow: 0 2px 4px rgba(0,0,0,0.02);
        }
        .fade-in {
          animation: fadeIn 0.6s ease forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .spin-slow {
          animation: spin 3s linear infinite;
        }
        @keyframes spin {
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
