import { Bitcoin, LineChart, BarChart3, TrendingUp } from "lucide-react"

const markets = [
  {
    icon: Bitcoin,
    title: "Cryptocurrency Markets",
    description: "Major crypto pairs and leading digital assets",
  },
  {
    icon: LineChart,
    title: "Equities",
    description: "Large-cap stocks and actively traded equities",
  },
  {
    icon: BarChart3,
    title: "Indices",
    description: "Major market indices and index futures",
  },
  {
    icon: TrendingUp,
    title: "Futures",
    description: "Key futures markets across asset classes",
  },
]

export function MarketCoverage() {
  return (
    <section className="relative py-20 md:py-28">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/20 to-background" />
      
      <div className="relative mx-auto max-w-6xl px-4 md:px-6">
        <div className="text-center mb-12">
          <p className="mb-3 text-xs font-semibold tracking-widest text-primary uppercase">
            Coverage
          </p>
          <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-4xl text-balance">
            Markets Covered
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground text-pretty">
            SightLine analyzes market structure across multiple asset classes.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {markets.map((market) => (
            <div
              key={market.title}
              className="rounded-xl border border-border/50 bg-card/50 p-5 transition-all hover:border-primary/30 card-glow"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <market.icon className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-1">
                {market.title}
              </h3>
              <p className="text-xs text-muted-foreground">
                {market.description}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-[11px] text-muted-foreground/70">
          Market availability may vary based on data integrations.
        </p>
      </div>
    </section>
  )
}
