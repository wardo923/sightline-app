"use client"

import { WizardAnswers } from "@/types/strategy"
import { generateStrategyResult } from "@/lib/strategy-result"
import { getDefaultStrategyName } from "@/lib/wizard-utils"
import NameStrategyForm from "@/components/name-strategy-form"

export default function StrategyResult({
  answers,
  onSaveStrategy,
}: {
  answers: WizardAnswers
  onSaveStrategy?: (name: string) => void
}) {
  const result = generateStrategyResult(answers)
  const defaultName = getDefaultStrategyName(answers, result.info.shortName)

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <h2 className="text-3xl font-semibold text-foreground">Your Custom Strategy Profile</h2>

      <p className="mt-4 text-muted-foreground">
        SightLine analyzed your selected asset, market behavior, timeframe
        preferences, and confirmation settings to generate your strategy
        profile.
      </p>

      <div className="mt-6 rounded-2xl border border-primary/20 bg-primary/10 p-5">
        <p className="text-sm uppercase tracking-[0.18em] text-primary">
          Primary Match
        </p>

        <h3 className="mt-2 text-2xl font-semibold text-foreground">{result.info.name}</h3>

        <p className="mt-2 text-muted-foreground">{result.info.description}</p>

        <div className="mt-5">
          <p className="text-sm text-muted-foreground">Strategy Fit</p>
          <p className="text-3xl font-semibold text-foreground">
            {Math.min(96, Math.max(72, Math.round(72 + (result.confidence / 100) * 24)))}%
          </p>

          <div className="mt-2 h-2 w-full rounded-full bg-muted">
            <div
              className="h-2 rounded-full bg-primary"
              style={{ width: `${Math.min(96, Math.max(72, Math.round(72 + (result.confidence / 100) * 24)))}%` }}
            />
          </div>
        </div>
      </div>

      {result.secondaryBundleInfo && (
        <div className="mt-4 rounded-2xl border border-border bg-card/50 p-4">
          <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">
            Secondary Match
          </p>
          <p className="mt-2 text-lg text-foreground">
            {result.secondaryBundleInfo.name}
          </p>
        </div>
      )}

      <div className="mt-4 rounded-2xl border border-border bg-card/50 p-4">
        <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">
          Why this strategy was selected
        </p>

        <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
          {result.whySelected.map((item) => (
            <li key={item}>• {item}</li>
          ))}
        </ul>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card/50 p-4">
          <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">
            Your preferences
          </p>
          <div className="mt-3 space-y-2 text-sm text-muted-foreground">
            <p>
              <span className="text-foreground">Market:</span> {answers.marketType}
            </p>
            <p>
              <span className="text-foreground">Asset:</span> {answers.asset}
            </p>
            <p>
              <span className="text-foreground">Timeframe:</span> {answers.timeframe}
            </p>
            <p>
              <span className="text-foreground">Alert Strength:</span>{" "}
              {answers.alertStrength}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card/50 p-4">
          <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">
            Important note
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            SightLine strategies are analytical frameworks based on market
            structure behavior and user-selected preferences. They are not
            personalized investment advice.
          </p>
        </div>
      </div>

      {onSaveStrategy && (
        <div className="mt-6">
          <NameStrategyForm defaultName={defaultName} onSave={onSaveStrategy} />
        </div>
      )}
    </div>
  )
}
