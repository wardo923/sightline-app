import { Layers, Shield, Eye, Target } from "lucide-react"

const principles = [
  {
    icon: Layers,
    title: "Structure Over Noise",
    description: "Markets generate endless information. A structured framework helps traders focus on what matters.",
  },
  {
    icon: Shield,
    title: "Risk Before Prediction",
    description: "Successful trading depends more on managing risk than predicting outcomes.",
  },
  {
    icon: Eye,
    title: "Clarity Over Complexity",
    description: "Too many tools create confusion. The goal is to simplify decisions, not overwhelm traders.",
  },
  {
    icon: Target,
    title: "Consistency Over Perfection",
    description: "No strategy wins every trade. Long-term results come from disciplined execution.",
  },
]

export function PrinciplesSection() {
  return (
    <section className="py-24 md:py-32 section-glow-top">
      <div className="mx-auto max-w-6xl px-5">
        <div className="text-center">
          <p className="mb-3 text-xs font-semibold tracking-widest text-primary uppercase">
            Our Principles
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl text-balance">
            What We Believe
          </h2>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {principles.map((principle) => (
            <div
              key={principle.title}
              className="card-glow group relative rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/30"
            >
              <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
                <principle.icon className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-foreground">{principle.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {principle.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
