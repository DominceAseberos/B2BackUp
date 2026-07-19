import { useState } from "react";
import type { BusinessProfile, DisruptionType, Partner } from "../domain/types";
import { ArrowLeftIcon } from "../ui/icons";

interface ReportProblemScreenProps {
  business: BusinessProfile;
  onBack: () => void;
  onSubmit: (partner: Partner, type: DisruptionType) => void;
}

type ProblemChoice = "buyer_unavailable" | "supplier_unavailable";

const PROBLEMS: Array<{ type: ProblemChoice; title: string; desc: string }> = [
  {
    type: "buyer_unavailable",
    title: "My buyer can't buy from me",
    desc: "The partner that buys my products has stopped.",
  },
  {
    type: "supplier_unavailable",
    title: "My supplier can't deliver",
    desc: "The partner that supplies me has stopped.",
  },
];

const REASONS = ["Typhoon", "Flood", "Earthquake", "Blocked roads"];

/** Plain, guided problem report. Two clear choices, pick who, optional reason. */
export function ReportProblemScreen({ business, onBack, onSubmit }: ReportProblemScreenProps) {
  const [type, setType] = useState<ProblemChoice | null>(null);
  const [partnerId, setPartnerId] = useState<string | null>(null);
  const [reason, setReason] = useState<string | null>(null);

  const wantedRole = type === "buyer_unavailable" ? "buyer" : "supplier";
  const choices = type
    ? business.currentPartners.filter((p) => p.role === wantedRole)
    : [];
  const selected = choices.find((p) => p.id === partnerId) ?? null;

  return (
    <div className="shell">
      <div className="page-head">
        <button type="button" className="progress__back" aria-label="Back" onClick={onBack}>
          <ArrowLeftIcon size={20} />
        </button>
        <span className="eyebrow">Report a problem</span>
        <h1 className="title">What happened?</h1>
        <p className="subtitle">Tell us what stopped, and we&apos;ll find a replacement.</p>
      </div>

      <div className="section">
        <div className="options">
          {PROBLEMS.map((problem) => (
            <button
              key={problem.type}
              type="button"
              className="option"
              aria-pressed={type === problem.type}
              onClick={() => {
                setType(problem.type);
                setPartnerId(null);
              }}
            >
              <span className="option__dot" aria-hidden="true" />
              <span>
                <span className="option__title">{problem.title}</span>
                <span className="option__desc">{problem.desc}</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      {type ? (
        <div className="section">
          <div className="section__label">
            <h2>Which one?</h2>
          </div>
          <div className="options">
            {choices.map((partner) => (
              <button
                key={partner.id}
                type="button"
                className="option"
                aria-pressed={partnerId === partner.id}
                onClick={() => setPartnerId(partner.id)}
              >
                <span className="option__dot" aria-hidden="true" />
                <span>
                  <span className="option__title">{partner.name}</span>
                  <span className="option__desc">{partner.location.name}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {selected ? (
        <div className="section">
          <div className="section__label">
            <h2>Reason (optional)</h2>
          </div>
          <div className="match__badges">
            {REASONS.map((option) => (
              <button
                key={option}
                type="button"
                className={`badge ${reason === option ? "badge--alert" : "badge--neutral"}`}
                style={{ border: "none", cursor: "pointer" }}
                onClick={() => setReason(reason === option ? null : option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div className="btn-row btn-row--sticky">
        <button type="button" className="btn btn--ghost" onClick={onBack}>
          Cancel
        </button>
        <button
          type="button"
          className="btn btn--primary"
          disabled={!selected}
          onClick={() => {
            if (selected && type) onSubmit(selected, type);
          }}
        >
          Find replacements
        </button>
      </div>
    </div>
  );
}
