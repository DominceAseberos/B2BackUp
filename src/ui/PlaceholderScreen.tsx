import { Menu, Bell } from "lucide-react";
import React from "react";

interface PlaceholderScreenProps {
  title: string;
  icon: React.ReactNode;
  description: string;
}

export function PlaceholderScreen({ title, icon, description }: PlaceholderScreenProps) {
  return (
    <div className="shell" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Top Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 20px 0" }}>
        <Menu size={24} style={{ cursor: "pointer" }} />
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>{title}</h2>
        <div style={{ position: "relative", cursor: "pointer" }}>
          <Bell size={24} />
        </div>
      </div>

      {/* Empty State Content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40, textAlign: "center" }}>
        <div style={{ color: "var(--brand)", marginBottom: 16 }}>
          {icon}
        </div>
        <h3 style={{ margin: "0 0 8px", fontSize: 20, color: "var(--ink)" }}>Coming Soon</h3>
        <p style={{ margin: 0, fontSize: 14, color: "var(--muted)", lineHeight: 1.5 }}>
          {description}
        </p>
      </div>
    </div>
  );
}
