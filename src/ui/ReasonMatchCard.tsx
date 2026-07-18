import type { MatchResult, RecoveryNeed } from "../domain/types";
import { Avatar } from "./Avatar";
import { CheckIcon, PinIcon } from "./icons";
import { PRODUCT_LABEL, formatPhp } from "./labels";

interface ReasonMatchCardProps {
  result: MatchResult;
  need: RecoveryNeed;
  rank: number;
  onSelect: (result: MatchResult) => void;
}

/** Build plain-language reasons why this partner is a good match. */
function buildReasons(result: ReasonMatchCardProps["result"], need: RecoveryNeed): string[] {
  const { partner } = result;
  const verb = need.neededRole === "buyer" ? "Buys" : "Supplies";
  const reasons: string[] = [
    `${Math.round(result.distanceKm)} km away`,
    `${verb} ${PRODUCT_LABEL[need.product].toLowerCase()}`,
  ];
  reasons.push(
    partner.capacityTons >= need.volumeTons
      ? `Has room for your ${need.volumeTons} tons`
      : `Can take ${partner.capacityTons} tons`
  );
  reasons.push(`Fair price · ${formatPhp(partner.pricePhpPerTon)}/ton`);
  if (partner.verified) {
    reasons.push("Verified business");
  }
  return reasons;
}

/** A friendly, plain-language recommended-partner card. */
export function ReasonMatchCard({ result, need, rank, onSelect }: ReasonMatchCardProps) {
  const { partner } = result;
  const isBest = rank === 0;
  const reasons = buildReasons(result, need);

  return (
    <article className={`pick${isBest ? " pick--best" : ""}`}>
      <div className="pick__head">
        <Avatar name={partner.name} size={44} />
        <div>
          <div className="pick__name">{partner.name}</div>
          <div className="pick__where">
            <PinIcon size={12} /> {partner.location.name}
          </div>
        </div>
        <div className="pick__score">
          <div className="pick__score-num">{result.total}%</div>
          <div className="pick__score-label">Match</div>
        </div>
      </div>

      <ul className="reasons">
        {reasons.map((reason) => (
          <li key={reason} className="reason">
            <span className="reason__check" aria-hidden="true">
              <CheckIcon size={12} />
            </span>
            {reason}
          </li>
        ))}
      </ul>

      <div className="pick__foot">
        {isBest ? <span className="badge badge--ok">Best match</span> : <span />}
        <button type="button" className="btn btn--primary" onClick={() => onSelect(result)}>
          Send request
        </button>
      </div>
    </article>
  );
}
