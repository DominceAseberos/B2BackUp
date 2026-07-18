import type { MatchResult, RecoveryNeed } from "../domain/types";
import { Avatar } from "../ui/Avatar";
import { CheckCircleIcon, PinIcon } from "../ui/icons";
import { PRODUCT_LABEL, ROLE_LABEL } from "../ui/labels";

interface ReconnectedScreenProps {
  result: MatchResult;
  need: RecoveryNeed;
  onDone: () => void;
}

/** Simple confirmation that the supply chain is reconnected. */
export function ReconnectedScreen({ result, need, onDone }: ReconnectedScreenProps) {
  const { partner } = result;
  const roleWord = ROLE_LABEL[need.neededRole].toLowerCase();

  return (
    <div className="shell">
      <div className="done">
        <span className="done__badge" aria-hidden="true">
          <CheckCircleIcon size={30} />
        </span>
        <h1 className="done__title">You&apos;re reconnected</h1>
        <p className="done__sub">
          {partner.name} is now your {roleWord} for {PRODUCT_LABEL[need.product].toLowerCase()}.
          You can keep operating without waiting for the storm to pass.
        </p>

        <div className="chain__node" style={{ width: "100%", textAlign: "left" }}>
          <Avatar name={partner.name} size={44} />
          <div className="chain__body">
            <div className="chain__role">New {roleWord}</div>
            <div className="chain__name">{partner.name}</div>
            <div className="chain__meta">
              <PinIcon size={12} /> {partner.location.name}
            </div>
          </div>
          <span className="badge badge--ok">Connected</span>
        </div>

        <div className="btn-row" style={{ width: "100%" }}>
          <button type="button" className="btn btn--primary btn--block" onClick={onDone}>
            Back to home
          </button>
        </div>
      </div>
    </div>
  );
}
