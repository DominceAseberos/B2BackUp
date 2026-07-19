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
    <nav className="bottom-nav">
      {tabs.map((t) => {
        const Icon = ICON_MAP[t.iconName] || Home;
        const active = loc.pathname === t.path;
        return (
          <Link key={t.name} to={t.path} className={`tab ${active ? "tab--active" : ""}`}>
            <div className="tab__icon">
              <Icon size={24} strokeWidth={active ? 2.5 : 2} />
              {!!t.badgeCount && <span className="tab__badge">{t.badgeCount}</span>}
            </div>
            <span className="tab__label" style={{ fontSize: 10 }}>{t.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
