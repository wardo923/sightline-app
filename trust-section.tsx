import { Wand2, Activity, Shield, Bell } from "lucide-react"

const trustPoints = [
  {
    icon: Wand2,
    title: "Guided Strategy Wizard",
    description: "Create a personalized trading profile based on your preferences",
  },
  {
    icon: Activity,
    title: "SAT Engine Analysis",
    description: "Evaluate price behavior and market structure across supported markets",
  },
  {
    icon: Shield,
    title: "Risk-First Approach",
    description: "Focus on defined risk parameters before evaluating opportunities",
  },
  {
    icon: Bell,
    title: "Daily Market Brief",
    description: "Ongoing market structure updates and monitored setups",
  },
]

export function TrustSection() {
  return (
    <section className="relative py-20 md:py-28">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" />
      
      <div className="relative mx-auto max-w-6xl px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-4xl text-balance">
            Built for structured decision-making.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground text-pretty">
            SightLine is designed for traders who want a clearer way to evaluate market structure, risk, and evolving opportunities.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {trustPoints.map((point) => (
            <div
              key={point.title}
              className="rounded-xl border border-border/50 bg-card/50 p-6 transition-all hover:border-primary/30 card-glow"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <point.icon className="h-6 w-6" />
              </div>
              <h3 className="text-base font-semibold text-foreground mb-2">
                {point.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {point.description}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-muted-foreground/70">
          Analytical tools for informational and educational use.
        </p>
      </div>
    </section>
  )
}
