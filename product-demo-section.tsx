import { TrendingUp, Bell, Activity, BarChart3, ArrowUpRight, ArrowDownRight } from "lucide-react"

const opportunities = [
  { asset: "BTC", status: "Breakout forming", direction: "up" },
  { asset: "SOL", status: "Pullback forming", direction: "up" },
  { asset: "NVDA", status: "Momentum building", direction: "up" },
  { asset: "SPY", status: "Neutral", direction: "neutral" },
]

const activeSignal = {
  asset: "BTC",
  timeframe: "15m",
  direction: "BUY",
  probability: 84,
  entry: "64,200",
  stop: "63,700",
  target: "65,300",
}

export function ProductDemoSection() {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5">
        {/* Section header */}
        <div className="text-center">
          <p className="mb-3 text-xs font-semibold tracking-widest text-primary uppercase">
            Mission Control
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl text-balance">
            Your daily command center
          </h2>
          <p className="mx-auto mt-5 max-w-md text-base text-muted-foreground text-pretty">
            See opportunities, signals, and market conditions at a glance.
          </p>
        </div>

        {/* Dashboard Preview */}
        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {/* Top Opportunities Panel */}
          <div className="card-glow rounded-2xl border border-border bg-card p-5">
            <div className="mb-4 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">Top Opportunities</h3>
            </div>
            <div className="space-y-3">
              {opportunities.map((opp) => (
                <div key={opp.asset} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">{opp.asset}</span>
                    {opp.direction === "up" ? (
                      <ArrowUpRight className="h-3 w-3 text-primary" />
                    ) : (
                      <span className="h-3 w-3 text-muted-foreground">-</span>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">{opp.status}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Active Signal Panel */}
          <div className="card-glow rounded-2xl border border-primary/30 bg-card p-5 lg:col-span-2">
            <div className="mb-4 flex items-center gap-2">
              <Bell className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">Active Signal</h3>
            </div>
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-foreground">{activeSignal.asset}</span>
                  <span className="text-xs text-muted-foreground">/ {activeSignal.timeframe}</span>
                </div>
                <span className="mt-1 inline-block rounded bg-primary/20 px-2 py-0.5 text-xs font-semibold text-primary">
                  {activeSignal.direction}
                </span>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">{activeSignal.probability}%</div>
                <span className="text-xs text-muted-foreground">Probability</span>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-4 border-t border-border/50 pt-5">
              <div>
                <span className="text-xs text-muted-foreground">Entry</span>
                <p className="text-sm font-semibold text-foreground">{activeSignal.entry}</p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">Stop</span>
                <p className="text-sm font-semibold text-destructive">{activeSignal.stop}</p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">Target</span>
                <p className="text-sm font-semibold text-primary">{activeSignal.target}</p>
              </div>
            </div>
          </div>

          {/* Market Conditions Panel */}
          <div className="card-glow rounded-2xl border border-border bg-card p-5">
            <div className="mb-4 flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">Market Conditions</h3>
            </div>
            <div className="space-y-4">
              <div>
                <span className="text-xs text-muted-foreground">Market trend</span>
                <p className="text-sm font-semibold text-primary">Bullish</p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">Volatility</span>
                <p className="text-sm font-semibold text-foreground">Medium</p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">Best strategy today</span>
                <p className="text-sm font-semibold text-foreground">Breakouts</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
