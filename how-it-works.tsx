import { ClipboardList, Cog, Eye } from "lucide-react"

const steps = [
  {
    icon: ClipboardList,
    step: "01",
    title: "Complete the Strategy Wizard",
    description: "Answer guided questions about markets, timeframe, and risk tolerance.",
  },
  {
    icon: Cog,
    step: "02",
    title: "Your Trading Profile Is Created",
    description: "SightLine converts your responses into personalized strategy settings.",
  },
  {
    icon: Eye,
    step: "03",
    title: "Monitor Market Conditions",
    description: "The SAT Engine evaluates market structure and highlights conditions that may align with your trading preferences.",
  },
]

export function HowItWorks() {
  return (
    <section className="section-glow-top grid-bg py-24 md:py-32" id="how-it-works">
      <div className="mx-auto max-w-6xl px-5">
        {/* Section header */}
        <div className="text-center">
          <p className="mb-3 text-xs font-semibold tracking-widest text-primary uppercase">
            How It Works
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-5xl text-balance">
            How SightLine Works
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground text-pretty">
            Create a trading profile and monitor markets for conditions aligned with your preferences.
          </p>
        </div>

        {/* 3 steps */}
        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((item) => (
            <div
              key={item.step}
              className="card-glow group relative rounded-2xl border border-border bg-card p-7 transition-all hover:border-primary/30"
            >
              <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
                  <item.icon className="h-5 w-5" />
                </div>
                <span className="text-[11px] font-bold tracking-widest text-muted-foreground/60 uppercase">
                  Step {item.step}
                </span>
              </div>
              <h3 className="text-lg font-bold text-foreground">{item.title}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
