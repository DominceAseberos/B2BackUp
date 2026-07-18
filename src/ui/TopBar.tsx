import { LinkMarkIcon } from "./icons";

interface TopBarProps {
  tagline?: string;
}

/** Simple brand header. */
export function TopBar({ tagline = "Supply chain recovery" }: TopBarProps) {
  return (
    <div className="topbar">
      <div className="topbar__inner">
        <span className="brand">
          <span className="brand__mark" aria-hidden="true">
            <LinkMarkIcon size={16} />
          </span>
          Tuloy
        </span>
        <span className="progress__step">{tagline}</span>
      </div>
    </div>
  );
}
