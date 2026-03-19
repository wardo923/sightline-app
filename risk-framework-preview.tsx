import { Shield, Scale, BarChart2 } from "lucide-react"

const riskPoints = [
  {
    icon: Shield,
    title: "Risk-First Mindset",
    description: "Evaluate downside risk before considering potential reward.",
  },
  {
    icon: Scale,
    title: "Risk-to-Reward Ratio",
    description: "Assess setups based on reward relative to defined risk.",
  },
  {
    icon: BarChart2,
    title: "Probability, Not Certainty",
    description: "Trading outcomes are probabilistic rather than guaranteed.",
  },
]

export function RiskFrameworkPreview() {
  return (
    <section className="section-glow-top grid-bg py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="text-center mb-12">
          <p className="mb-3 text-xs font-semibold tracking-widest text-primary uppercase">
            Risk Management
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-5xl text-balance">
            Risk-Reward Framework
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground text-pretty">
            SightLine emphasizes structured setups with defined risk rather than prediction.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {riskPoints.map((point) => (
            <div
              key={point.title}
              className="rounded-xl border border-border/50 bg-card/50 p-6 text-center card-glow transition-all hover:border-primary/30"
            >
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <point.icon className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {point.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {point.description}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-muted-foreground/70">
          Illustrative scenarios shown for educational purposes only and do not represent actual trading performance or guaranteed outcomes.
        </p>
      </div>
    </section>
  )
}
