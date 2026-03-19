import { Shield, Target, Bell } from "lucide-react"

const cards = [
  {
    icon: Shield,
    title: "Structured Setups",
    description: "Trades include predefined entry, stop loss, and targets.",
  },
  {
    icon: Target,
    title: "Strategy-Based Alerts",
    description: "Setups appear only when market conditions align with your strategy profile.",
  },
  {
    icon: Bell,
    title: "Ongoing Trade Monitoring",
    description: "SightLine alerts you when a setup strengthens, weakens, or invalidates.",
  },
]

export function RiskFirstSection() {
  return (
    <section className="section-glow-top py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <div className="text-center">
          <p className="mb-3 text-xs font-semibold tracking-widest text-primary uppercase">
            Risk Management
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl text-balance">
            Risk Comes First
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground text-pretty">
            SightLine is built around structured risk management. Every setup includes a predefined entry, stop loss, and profit target so traders can understand the risk before entering a trade.
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-muted-foreground/80 text-pretty">
            SightLine also monitors the setup after entry and alerts users if the structure strengthens, weakens, or invalidates.
          </p>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {cards.map((card) => (
            <div
              key={card.title}
              className="card-glow group relative flex flex-col rounded-2xl border border-border bg-card p-7 transition-all hover:border-primary/30"
            >
              <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
                <card.icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-foreground">{card.title}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
