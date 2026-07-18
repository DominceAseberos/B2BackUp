import { useMemo, useState } from "react";
import { DEMO_BUSINESS } from "./domain/mockData";
import { buildRecoveryNeed } from "./domain/recovery";
import type { DisruptionType, MatchResult, Partner } from "./domain/types";
import { HomeScreen } from "./features/HomeScreen";
import { ReconnectedScreen } from "./features/ReconnectedScreen";
import { ReplacementsScreen } from "./features/ReplacementsScreen";
import { ReportProblemScreen } from "./features/ReportProblemScreen";
import { TopBar } from "./ui/TopBar";

type View = "home" | "report" | "replacements" | "reconnected";

const BUSINESS = DEMO_BUSINESS;

/**
 * Tuloy — a simple, guided disaster-recovery flow for a coconut SME:
 * home -> report a problem -> see replacements -> reconnected.
 */
export function App() {
  const [view, setView] = useState<View>("home");
  const [affectedPartner, setAffectedPartner] = useState<Partner | null>(null);
  const [disruption, setDisruption] = useState<DisruptionType | null>(null);
  const [chosen, setChosen] = useState<MatchResult | null>(null);

  const need = useMemo(() => {
    if (!affectedPartner || !disruption) return null;
    return buildRecoveryNeed(BUSINESS, affectedPartner, disruption);
  }, [affectedPartner, disruption]);

  const goHome = () => {
    setAffectedPartner(null);
    setDisruption(null);
    setChosen(null);
    setView("home");
  };

  const findReplacements = (partner: Partner, type: DisruptionType) => {
    setAffectedPartner(partner);
    setDisruption(type);
    setView("replacements");
  };

  const tagline =
    view === "home" ? "Supply chain recovery" : "Recovery in progress";

  return (
    <div className="app">
      <TopBar tagline={tagline} />

      <div className="screen" key={view}>
        {view === "home" ? (
          <HomeScreen
            business={BUSINESS}
            onReport={() => setView("report")}
            onFix={(partner) =>
              findReplacements(
                partner,
                partner.role === "buyer" ? "buyer_unavailable" : "supplier_unavailable"
              )
            }
          />
        ) : null}

        {view === "report" ? (
          <ReportProblemScreen
            business={BUSINESS}
            onBack={goHome}
            onSubmit={findReplacements}
          />
        ) : null}

        {view === "replacements" && need && affectedPartner ? (
          <ReplacementsScreen
            need={need}
            affectedPartnerName={affectedPartner.name}
            onBack={goHome}
            onSelect={(result) => {
              setChosen(result);
              setView("reconnected");
            }}
          />
        ) : null}

        {view === "reconnected" && chosen && need ? (
          <ReconnectedScreen result={chosen} need={need} onDone={goHome} />
        ) : null}
      </div>
    </div>
  );
}
