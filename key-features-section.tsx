import { Wand2, Eye, Shield, Bell } from "lucide-react"

const features = [
  {
    icon: Wand2,
    title: "Strategy Wizard",
    description: "Our proprietary strategy wizard builds a trading profile based on how you trade.",
  },
  {
    icon: Eye,
    title: "Live Market Monitoring",
    description: "SightLine scans live markets for setups that match your strategy.",
  },
  {
    icon: Shield,
    title: "Risk-Defined Trades",
    description: "Every setup includes entry, stop loss, and profit targets.",
  },
  {
    icon: Bell,
    title: "Trade Validity Alerts",
    description: "Know when a trade strengthens, weakens, or invalidates.",
  },
]

export function KeyFeaturesSection() {
  return (
    <section className="section-glow-top grid-bg py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <div className="text-center">
          <p className="mb-3 text-xs font-semibold tracking-widest text-primary uppercase">
            Features
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl text-balance">
            Key Features
          </h2>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="card-glow group relative flex flex-col rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/30"
            >
              <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-foreground">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
