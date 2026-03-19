import { TrendingUp, Activity, Eye } from "lucide-react"

const marketStructure = [
  {
    symbol: "BTC",
    structure: "Bullish",
    keyArea: "Support Zone",
    bias: "Trend continuation",
    trend: "up",
  },
  {
    symbol: "SPY",
    structure: "Neutral",
    keyArea: "Range structure",
    bias: null,
    trend: "neutral",
  },
  {
    symbol: "ETH",
    structure: "Bullish",
    keyArea: "Structural Support",
    bias: null,
    trend: "up",
  },
]

const monitoredSetups = [
  {
    symbol: "BTC",
    description: "Breakout structure forming",
  },
  {
    symbol: "NVDA",
    description: "Pullback into support",
  },
  {
    symbol: "ETH",
    description: "Trend continuation structure",
  },
]

export function DailyMarketBrief() {
  return (
    <section className="section-glow-top grid-bg py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="text-center mb-12">
          <p className="mb-3 text-xs font-semibold tracking-widest text-primary uppercase">
            Market Analysis
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-5xl text-balance">
            Daily Market Brief
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground text-pretty">
            A snapshot of current market structure based on SAT Engine analysis.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Market Structure */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">
              Market Structure
            </h3>
            <div className="space-y-3">
              {marketStructure.map((item) => (
                <div
                  key={item.symbol}
                  className="rounded-xl border border-border/50 bg-card/50 p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-bold text-foreground">{item.symbol}</span>
                    <div className="flex items-center gap-2">
                      {item.trend === "up" ? (
                        <TrendingUp className="h-4 w-4 text-primary" />
                      ) : (
                        <Activity className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className={`text-sm font-medium ${item.trend === "up" ? "text-primary" : "text-muted-foreground"}`}>
                        {item.structure}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">{item.keyArea}</p>
                    {item.bias && (
                      <p className="text-xs text-primary">{item.bias}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Monitored Setups */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider flex items-center gap-2">
              <Eye className="h-4 w-4 text-primary" />
              Structures Being Monitored
            </h3>
            <div className="space-y-3">
              {monitoredSetups.map((setup) => (
                <div
                  key={setup.symbol}
                  className="rounded-xl border border-primary/20 bg-primary/5 p-4 flex items-center gap-4"
                >
                  <span className="text-lg font-bold text-foreground">{setup.symbol}</span>
                  <span className="text-sm text-muted-foreground">{setup.description}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-muted-foreground/70">
          Market brief information is generated from SAT Engine analysis and provided for informational purposes only.
        </p>
      </div>
    </section>
  )
}
