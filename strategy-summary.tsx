"use client"

import { Check, Zap, ArrowRight, ChevronLeft } from "lucide-react"
import Link from "next/link"
import type { StrategyConfig } from "@/lib/strategy-generator"

interface StrategySummaryProps {
  config: StrategyConfig
  recommendedPlan: string
  onEditAnswers: () => void
  onDeploy: () => void
}

export function StrategySummary({
  config,
  recommendedPlan,
  onEditAnswers,
  onDeploy,
}: StrategySummaryProps) {
  const summaryItems = [
    { label: "Market", value: config.market || "Not set" },
    { label: "Timeframe", value: config.timeframe },
    { label: "Strategy", value: config.engine },
    { label: "Risk Profile", value: config.riskProfile },
    { label: "Trade Frequency", value: `${config.estimatedTradesPerDay} trades per day` },
    { label: "Stop Model", value: config.stopModel },
    { label: "Strictness", value: config.strictness },
  ]

  const activeFilters = [
    config.trendFilter && "Trend Filter",
    config.volumeConfirm && "Volume Confirmation",
    config.vwapConfirm && "VWAP Confirmation",
    config.htfConfirm && "HTF Confirmation",
  ].filter(Boolean)

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border px-5 py-4">
        <button
          onClick={onEditAnswers}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Edit Answers
        </button>
        <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          Exit
        </Link>
      </header>

      {/* Content */}
      <div className="flex-1 px-5 py-8 overflow-y-auto">
        {/* Success icon */}
        <div className="flex justify-center mb-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 border border-primary/20">
            <Check className="h-8 w-8 text-primary" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-foreground text-center mb-2">
          SightLine Strategy Generated
        </h1>
        <p className="text-sm text-muted-foreground text-center mb-8">
          Your custom trading engine is ready to deploy.
        </p>

        {/* Summary Card */}
        <div className="rounded-2xl border border-border bg-card p-5 mb-6">
          <h2 className="text-sm font-semibold text-primary mb-4 uppercase tracking-wider">
            Strategy Summary
          </h2>
          <div className="space-y-3">
            {summaryItems.map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{item.label}</span>
                <span className="text-sm font-medium text-foreground">{item.value}</span>
              </div>
            ))}
          </div>

          {activeFilters.length > 0 && (
            <>
              <div className="border-t border-border mt-4 pt-4">
                <h3 className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
                  Active Filters
                </h3>
                <div className="flex flex-wrap gap-2">
                  {activeFilters.map((filter) => (
                    <span
                      key={filter}
                      className="inline-flex items-center gap-1 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-medium text-primary"
                    >
                      <Check className="h-3 w-3" />
                      {filter}
                    </span>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Recommended Plan */}
        <div className="rounded-2xl border border-primary/30 bg-primary/[0.06] p-5 mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
              <Zap className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Recommended Plan</p>
              <p className="text-lg font-bold text-foreground">{recommendedPlan}</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Based on your strategy configuration, we recommend the {recommendedPlan} plan
            for optimal signal delivery and features.
          </p>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="border-t border-border px-5 py-5">
        <button
          onClick={onDeploy}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90"
        >
          Deploy Strategy
          <ArrowRight className="h-4 w-4" />
        </button>
        <button
          onClick={onEditAnswers}
          className="mt-3 w-full text-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          Edit Answers
        </button>

        <p className="mt-4 text-center text-[10px] text-muted-foreground/50">
          SightLine does not execute trades or connect to any brokerage.
        </p>
      </div>
    </div>
  )
}
