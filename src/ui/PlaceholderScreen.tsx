import React from "react";

interface PlaceholderScreenProps {
  title: string;
  icon: React.ReactNode;
  description: string;
}

export function PlaceholderScreen({ title, icon, description }: PlaceholderScreenProps) {
  return (
    <div className="shell" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Empty State Content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40, textAlign: "center" }}>
        <div style={{ color: "var(--brand)", marginBottom: 16 }}>
          {icon}
        </div>
        <h3 style={{ margin: "0 0 8px", fontSize: 20, color: "var(--ink)" }}>{title} (Coming Soon)</h3>
        <p style={{ margin: 0, fontSize: 14, color: "var(--muted)", lineHeight: 1.5 }}>
          {description}
        </p>
      </div>
    </div>
  );
}
