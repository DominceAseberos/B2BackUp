import { Link, useLocation } from "react-router-dom";
import { Home, Map, User, Package, ClipboardList, Search, MessageSquare, Bell } from "lucide-react";

const ICON_MAP = {
  home: Home,
  map: Map,
  user: User,
  package: Package,
  receipt: ClipboardList,
  search: Search,
  requests: ClipboardList,
  messages: MessageSquare,
  bell: Bell,
};

interface Tab {
  name: string;
  path: string;
  iconName: keyof typeof ICON_MAP;
  badgeCount?: number;
}

interface BottomNavProps {
  portalBase?: string;
  tabs?: Tab[];
}

export function BottomNav({ tabs = [] }: BottomNavProps) {
  const loc = useLocation();

  return (
    <nav className="bottomnav">
      {tabs.map((t) => {
        const Icon = ICON_MAP[t.iconName] || Home;
        const active = loc.pathname === t.path;
        return (
          <Link key={t.name} to={t.path} className={`bottomnav__tab ${active ? "bottomnav__tab--active" : ""}`}>
            <div style={{ position: "relative", display: "inline-block" }}>
              <Icon size={22} strokeWidth={active ? 2.5 : 1.75} />
              {!!t.badgeCount && (
                <span style={{
                  position: "absolute",
                  top: -4,
                  right: -8,
                  background: "var(--alert)",
                  color: "white",
                  fontSize: 10,
                  fontWeight: "bold",
                  padding: "2px 6px",
                  borderRadius: 10,
                  lineHeight: 1
                }}>
                  {t.badgeCount}
                </span>
              )}
            </div>
            <span className="bottomnav__label">{t.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
