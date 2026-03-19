"use client"

import { TrendingUp, Check } from "lucide-react"

export function ExampleSetupSection() {
  return (
    <section className="py-24 md:py-32" id="example">
      <div className="mx-auto max-w-6xl px-5">
        <div className="text-center">
          <p className="mb-3 text-xs font-semibold tracking-widest text-primary uppercase">
            Example Trade Setup
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-5xl text-balance">
            Clear Trade Setups. Defined Risk. Structured Decisions.
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-base text-muted-foreground text-pretty">
            SightLine focuses on presenting structured trade opportunities rather than overwhelming charts with unnecessary indicators.
          </p>
        </div>

        <div className="mt-16 flex justify-center">
          <div className="w-full max-w-md">
            {/* Setup Card */}
            <div className="rounded-2xl border border-primary/20 bg-primary/[0.03] p-6 glow-border">
              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-xs text-muted-foreground">Asset / Timeframe</p>
                  <p className="mt-1 text-2xl font-bold text-foreground">BTC / 15m</p>
                </div>
                <span className="flex items-center gap-1.5 rounded-full bg-primary/15 px-4 py-1.5 text-sm font-semibold text-primary">
                  <TrendingUp className="h-4 w-4" />
                  BUY
                </span>
              </div>

              {/* Levels Grid */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="rounded-xl border border-border bg-background/50 p-4">
                  <p className="text-xs text-muted-foreground">Entry Zone</p>
                  <p className="mt-1 text-xl font-bold text-foreground">64,200</p>
                </div>
                <div className="rounded-xl border border-border bg-background/50 p-4">
                  <p className="text-xs text-muted-foreground">Risk Level</p>
                  <p className="mt-1 text-xl font-bold text-destructive">63,700</p>
                </div>
                <div className="rounded-xl border border-border bg-background/50 p-4">
                  <p className="text-xs text-muted-foreground">Target Level</p>
                  <p className="mt-1 text-xl font-bold text-primary">65,300</p>
                </div>
              </div>

              {/* Risk-Reward and Context */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="rounded-xl border border-border bg-background/50 p-4">
                  <p className="text-xs text-muted-foreground">Risk-to-Reward</p>
                  <p className="mt-1 text-lg font-bold text-foreground">2.2R</p>
                </div>
                <div className="rounded-xl border border-border bg-background/50 p-4">
                  <p className="text-xs text-muted-foreground">Market Structure</p>
                  <p className="mt-1 text-lg font-bold text-primary">Bullish</p>
                </div>
              </div>

              {/* Setup Context */}
              <div className="rounded-xl border border-border bg-background/50 p-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Setup Context
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 text-primary shrink-0" />
                    Entry zone identified
                  </li>
                  <li className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 text-primary shrink-0" />
                    Risk parameters defined
                  </li>
                  <li className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 text-primary shrink-0" />
                    Target levels set
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
