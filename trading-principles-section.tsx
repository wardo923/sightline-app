"use client"

import { Check, TrendingUp } from "lucide-react"

const principles = [
  "Defined entry levels",
  "Controlled risk with stop losses",
  "Targets based on risk-reward",
  "Letting winners run while limiting losses",
]

export function TradingPrinciplesSection() {
  return (
    <section className="relative overflow-hidden border-t border-border/50 bg-background py-20 md:py-28">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-0 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-5">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* LEFT: Content */}
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl text-balance">
              Built on <span className="text-primary">proven trading principles</span>
            </h2>

            <p className="mt-4 text-base text-muted-foreground">
              SightLine focuses on the fundamentals professional traders use:
            </p>

            {/* Principles checklist */}
            <ul className="mt-6 space-y-3">
              {principles.map((principle) => (
                <li key={principle} className="flex items-center gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/10">
                    <Check className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="text-base text-foreground">{principle}</span>
                </li>
              ))}
            </ul>

            {/* Win rate section */}
            <div className="mt-10">
              <h3 className="text-xl font-semibold text-primary">
                Why win rate isn't everything
              </h3>
              <p className="mt-2 text-sm text-muted-foreground max-w-md">
                Many profitable strategies win less than 50% of the time. What matters is risk vs reward.
              </p>

              {/* Stats box */}
              <div className="mt-4 rounded-xl border border-border bg-card/50 p-5 max-w-xs">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      Win Rate: <span className="font-semibold text-primary">45%</span>
                    </p>
                    <p className="text-sm text-muted-foreground">Average Win: 2R</p>
                    <p className="text-sm text-muted-foreground">Average Loss: 1R</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
                <div className="mt-4 border-t border-border pt-3">
                  <p className="text-lg font-bold text-primary">Net Result = +2R</p>
                </div>
              </div>

              <p className="mt-4 text-xs text-muted-foreground/60">
                Example for educational purposes only. Results will vary.
              </p>
            </div>
          </div>

          {/* RIGHT: Visual chart card */}
          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-primary/5 blur-2xl" />
            
            <div className="relative rounded-2xl border border-primary/20 bg-card/80 p-6 shadow-lg">
              {/* Check icon */}
              <div className="absolute -right-3 -top-3 flex h-14 w-14 items-center justify-center rounded-full border-2 border-primary bg-primary/20 shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                <Check className="h-7 w-7 text-primary" />
              </div>

              {/* Chart visualization */}
              <div className="relative h-48 w-full">
                {/* Entry line */}
                <div className="absolute left-0 right-0 top-1/2 flex items-center">
                  <span className="mr-2 text-xs font-medium text-foreground">Entry</span>
                  <div className="flex-1 border-t-2 border-dashed border-muted-foreground/40" />
                </div>

                {/* Stop line */}
                <div className="absolute bottom-8 left-0 right-0 flex items-center">
                  <span className="mr-2 text-xs font-medium text-destructive">Stop</span>
                  <div className="flex-1 border-t-2 border-dashed border-destructive/60" />
                </div>

                {/* Target line */}
                <div className="absolute left-0 right-0 top-4 flex items-center">
                  <div className="flex-1 border-t-2 border-dashed border-primary/60" />
                  <span className="ml-2 text-xs font-medium text-primary">Target 2</span>
                </div>

                {/* R multiple badge */}
                <div className="absolute right-16 top-8 rounded-md bg-primary/20 px-2 py-1">
                  <span className="text-sm font-bold text-primary">1.5R</span>
                </div>

                {/* Candlesticks SVG */}
                <svg className="absolute inset-0 h-full w-full" viewBox="0 0 300 180" preserveAspectRatio="none">
                  {/* Simplified candlestick pattern going up */}
                  <g className="opacity-80">
                    {/* Red candles (losses) */}
                    <rect x="20" y="100" width="8" height="30" fill="hsl(var(--destructive))" opacity="0.8" />
                    <rect x="40" y="105" width="8" height="25" fill="hsl(var(--destructive))" opacity="0.8" />
                    <rect x="60" y="95" width="8" height="35" fill="hsl(var(--destructive))" opacity="0.8" />
                    
                    {/* Green candles (wins) */}
                    <rect x="80" y="80" width="8" height="25" fill="hsl(var(--primary))" />
                    <rect x="100" y="70" width="8" height="30" fill="hsl(var(--primary))" />
                    <rect x="120" y="85" width="8" height="20" fill="hsl(var(--destructive))" opacity="0.8" />
                    <rect x="140" y="65" width="8" height="35" fill="hsl(var(--primary))" />
                    <rect x="160" y="55" width="8" height="30" fill="hsl(var(--primary))" />
                    <rect x="180" y="70" width="8" height="20" fill="hsl(var(--destructive))" opacity="0.8" />
                    <rect x="200" y="45" width="8" height="40" fill="hsl(var(--primary))" />
                    <rect x="220" y="35" width="8" height="35" fill="hsl(var(--primary))" />
                    <rect x="240" y="25" width="8" height="30" fill="hsl(var(--primary))" />
                  </g>
                  
                  {/* Trend line */}
                  <path 
                    d="M 24 115 Q 100 90, 180 50 T 244 30" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth="2" 
                    fill="none" 
                    opacity="0.6"
                  />
                </svg>
              </div>

              {/* Math breakdown */}
              <div className="mt-4 rounded-xl border border-border bg-background/50 p-4">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">10 trades:</span>{" "}
                  <span className="text-primary">4 wins × 2R = +8R</span>
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  <span className="text-destructive">6 losses × 1R = -6R</span>
                </p>
                <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                  <span className="text-sm font-medium text-foreground">Net Result</span>
                  <span className="text-2xl font-bold text-primary">+2R</span>
                </div>
              </div>

              <p className="mt-4 text-center text-sm text-muted-foreground">
                This is how disciplined trading strategies can be profitable even without winning every trade.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
