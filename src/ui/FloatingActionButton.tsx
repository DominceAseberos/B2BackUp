import { AlertTriangle } from "lucide-react";

interface FloatingActionButtonProps {
  onClick: () => void;
  label?: string;
  icon?: React.ReactNode;
  variant?: "primary" | "alert";
}

export function FloatingActionButton({ onClick, label = "Report", icon, variant = "alert" }: FloatingActionButtonProps) {
  return (
    <button className={`fab fab--${variant}`} onClick={onClick} aria-label={label}>
      {icon || <AlertTriangle className="fab__icon" size={24} />}
      <span className="fab__label">{label}</span>
    </button>
  );
}
