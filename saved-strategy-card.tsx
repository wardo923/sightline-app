"use client"

import { SavedStrategy } from "@/types/strategy"
import { STRATEGY_INFO } from "@/lib/strategies"

export default function SavedStrategyCard({
  strategy,
}: {
  strategy: SavedStrategy
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold text-foreground">{strategy.customName}</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {strategy.asset} • {STRATEGY_INFO[strategy.bundle].shortName} •{" "}
            {strategy.alertStrength.replaceAll("_", " ")}
          </p>
        </div>

        <span className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
          {strategy.isActive ? "Active" : "Paused"}
        </span>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-5">
        <div>
          <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground/70">
            Alerts Fired
          </p>
          <p className="mt-1 text-lg font-medium text-foreground">
            {strategy.stats.alertsFired}
          </p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground/70">
            Wins
          </p>
          <p className="mt-1 text-lg font-medium text-foreground">{strategy.stats.wins}</p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground/70">
            Losses
          </p>
          <p className="mt-1 text-lg font-medium text-foreground">{strategy.stats.losses}</p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground/70">
            Win Ratio
          </p>
          <p className="mt-1 text-lg font-medium text-foreground">{strategy.stats.winRatio}%</p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground/70">
            Confidence
          </p>
          <p className="mt-1 text-lg font-medium text-foreground">
            {strategy.confidenceScore}%
          </p>
        </div>
      </div>
    </div>
  )
}
