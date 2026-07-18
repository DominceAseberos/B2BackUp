import { LinkMarkIcon } from "./icons";
import { Link } from "react-router-dom";

interface TopBarProps {
  tagline?: string;
}

/** Top app bar with B2BackUp branding. */
export function TopBar({ tagline = "Supply chain recovery" }: TopBarProps) {
  return (
    <div className="topbar">
      <div className="topbar__inner">
        <Link to="/sme" className="brand" style={{ textDecoration: "none", color: "inherit" }}>
          <span className="brand__mark" aria-hidden="true">
            <LinkMarkIcon size={16} />
          </span>
          B2BackUp
        </Link>
        <span className="topbar__tagline">{tagline}</span>
      </div>
    </div>
  );
}
