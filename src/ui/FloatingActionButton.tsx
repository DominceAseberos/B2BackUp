import { AlertTriangle } from "lucide-react";

interface FloatingActionButtonProps {
  onClick: () => void;
  label?: string;
  icon?: React.ReactNode;
}

export function FloatingActionButton({ onClick, label = "Report", icon }: FloatingActionButtonProps) {
  return (
    <button className="fab fab--alert" onClick={onClick} aria-label={label}>
      {icon || <AlertTriangle className="fab__icon" size={24} />}
      <span className="fab__label">{label}</span>
    </button>
  );
}
