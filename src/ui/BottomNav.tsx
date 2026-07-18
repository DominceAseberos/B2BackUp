import { Link, useLocation } from "react-router-dom";
import { Home, Map as MapIcon, User } from "lucide-react";

export function BottomNav() {
  const location = useLocation();

  const tabs = [
    { name: "Home", path: "/sme", icon: Home },
    { name: "Map", path: "/sme/map", icon: MapIcon },
    { name: "Profile", path: "/sme/profile", icon: User },
  ];

  return (
    <nav className="bottomnav">
      {tabs.map((tab) => {
        const isActive = location.pathname === tab.path || (tab.path === '/sme' && location.pathname.startsWith('/sme') && location.pathname.length > 5 === false);
        return (
          <Link
            key={tab.name}
            to={tab.path}
            className={`bottomnav__tab ${isActive ? "bottomnav__tab--active" : ""}`}
          >
            <tab.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
            <span className="bottomnav__label">{tab.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
