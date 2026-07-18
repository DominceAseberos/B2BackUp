import { Link, useLocation } from "react-router-dom";
import { Home, Map, User, Package, ClipboardList } from "lucide-react";

const ICON_MAP = {
  home: Home,
  map: Map,
  user: User,
  package: Package,
  receipt: ClipboardList,
};

interface Tab {
  name: string;
  path: string;
  iconName: keyof typeof ICON_MAP;
}

interface BottomNavProps {
  portalBase?: string;
  tabs?: Tab[];
}

const SME_TABS: Tab[] = [
  { name: "Home", path: "/sme", iconName: "home" },
  { name: "Map", path: "/sme/map", iconName: "map" },
  { name: "Profile", path: "/sme/profile", iconName: "user" },
];

export function BottomNav({ tabs = SME_TABS }: BottomNavProps) {
  const location = useLocation();

  return (
    <nav className="bottomnav">
      {tabs.map((tab) => {
        // Active if exact match OR if we're on a sub-route of a non-root tab
        const isActive =
          location.pathname === tab.path ||
          (tab.path !== "/sme" && tab.path !== "/supplier" && location.pathname.startsWith(tab.path));

        const Icon = ICON_MAP[tab.iconName];

        return (
          <Link
            key={tab.name}
            to={tab.path}
            className={`bottomnav__tab ${isActive ? "bottomnav__tab--active" : ""}`}
          >
            <Icon size={22} strokeWidth={isActive ? 2.5 : 1.75} />
            <span className="bottomnav__label">{tab.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
