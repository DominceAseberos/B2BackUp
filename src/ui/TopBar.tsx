import { Link } from "react-router-dom";
import { Bell } from "lucide-react";

interface TopBarProps {
  tagline?: string;
  notificationCount?: number;
}

/** Top app bar with B2BackUp branding. */
export function TopBar({ tagline = "Supply chain recovery", notificationCount = 0 }: TopBarProps) {
  return (
    <div className="topbar" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div className="topbar__inner" style={{ flex: 1 }}>
        <Link to="/sme" className="brand" style={{ textDecoration: "none", color: "inherit", display: "flex", alignItems: "center", gap: 8 }}>
          <img src="/logo.png" alt="B2BackUp Logo" style={{ height: 24, width: "auto" }} />
          <span style={{ fontWeight: 800 }}>B2BackUp</span>
        </Link>
        <span className="topbar__tagline">{tagline}</span>
      </div>
      <Link to="/sme/notifications" style={{ position: "relative", color: "var(--ink)", paddingRight: 16 }}>
        <Bell size={20} />
        {notificationCount > 0 && (
          <span style={{
            position: "absolute",
            top: -4,
            right: 12,
            background: "var(--alert)",
            color: "white",
            fontSize: 10,
            fontWeight: 700,
            padding: "2px 5px",
            borderRadius: 10,
            lineHeight: 1
          }}>
            {notificationCount}
          </span>
        )}
      </Link>
    </div>
  );
}
