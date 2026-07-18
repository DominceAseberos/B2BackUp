import { useMemo } from "react";
import { findAlternatives } from "../domain/matching";
import { NETWORK } from "../domain/mockData";
import type { MatchResult, RecoveryNeed } from "../domain/types";
import { ArrowLeftIcon } from "../ui/icons";
import { ReasonMatchCard } from "../ui/ReasonMatchCard";
import { ROLE_LABEL } from "../ui/labels";

interface ReplacementsScreenProps {
  need: RecoveryNeed;
  affectedPartnerName: string;
  onBack: () => void;
  onSelect: (result: MatchResult) => void;
}

/** Shows the ranked replacement partners in plain language. */
export function ReplacementsScreen({
  need,
  affectedPartnerName,
  onBack,
  onSelect,
}: ReplacementsScreenProps) {
  const results = useMemo(() => findAlternatives(NETWORK, need), [need]);
  const roleWord = ROLE_LABEL[need.neededRole].toLowerCase();

  return (
    <div className="shell">
      <div className="page-head">
        <button type="button" className="progress__back" aria-label="Back" onClick={onBack}>
          <ArrowLeftIcon size={20} />
        </button>
        <span className="eyebrow">Replacements found</span>
        <h1 className="title">
          {results.length} {roleWord}
          {results.length === 1 ? "" : "s"} who can help
        </h1>
        <p className="subtitle">
          Instead of {affectedPartnerName}, here are nearby, verified {roleWord}s that can trade
          right now. Best match first.
        </p>
      </div>

      <div className="section">
        {results.length === 0 ? (
          <div className="empty">
            No replacements available nearby yet. Try again as more partners come back online.
          </div>
        ) : (
          results.map((result, index) => (
            <div key={result.partner.id} style={{ marginBottom: 14 }}>
              <ReasonMatchCard result={result} need={need} rank={index} onSelect={onSelect} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
