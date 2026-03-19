import Link from "next/link"
import { Check, X, TrendingUp, ArrowRight } from "lucide-react"

const comparisonData = [
  {
    feature: "Strategy Setup",
    sightline: "Guided Wizard",
    sightlineGood: true,
    traditional: "Manual Chart Analysis",
    traditionalGood: true,
  },
  {
    feature: "Indicators Required",
    sightline: "None",
    sightlineGood: true,
    traditional: "Multiple Indicators",
    traditionalGood: false,
  },
  {
    feature: "Signals",
    sightline: "Entry, Stop, Target",
    sightlineGood: true,
    traditional: "User Must Interpret",
    traditionalGood: false,
  },
  {
    feature: "Learning Curve",
    sightline: "Beginner-Friendly",
    sightlineGood: true,
    traditional: "Technical Knowledge",
    traditionalGood: false,
  },
  {
    feature: "Time to Start",
    sightline: "Minutes",
    sightlineGood: true,
    traditional: "Hours or Days",
    traditionalGood: false,
  },
]

export function ComparisonSection() {
  return (
    <section className="section-glow-top py-24 md:py-32">
      <div className="mx-auto max-w-4xl px-5">
        {/* Heading */}
        <h2 className="text-center text-3xl font-semibold italic text-foreground md:text-5xl mb-12">
          How SightLine Is Different
        </h2>

        {/* Comparison Table */}
        <div className="rounded-2xl border border-border overflow-hidden shadow-xl bg-card">
          {/* Table Header */}
          <div className="grid grid-cols-[1fr_1fr_1fr] md:grid-cols-[200px_1fr_1fr] bg-secondary border-b border-border">
            <div className="p-4 md:p-5 flex items-center">
              <span className="text-sm md:text-base font-medium text-muted-foreground">Feature</span>
            </div>
            <div className="p-4 md:p-5 border-l border-border flex items-center justify-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary">
                <Check className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-sm md:text-lg font-semibold text-primary italic">SightLine</span>
            </div>
            <div className="p-4 md:p-5 border-l border-border flex items-center justify-center gap-2">
              <TrendingUp className="h-5 w-5 text-orange-500" />
              <span className="text-sm md:text-base font-semibold text-foreground leading-tight">
                Traditional
                <br />
                Chart Platforms
              </span>
            </div>
          </div>

          {/* Table Body */}
          {comparisonData.map((row, index) => (
            <div
              key={row.feature}
              className={`grid grid-cols-[1fr_1fr_1fr] md:grid-cols-[200px_1fr_1fr] ${
                index % 2 === 0 ? "bg-surface" : "bg-card"
              } ${index < comparisonData.length - 1 ? "border-b border-border/50" : ""}`}
            >
              <div className="p-4 md:p-5 flex items-center">
                <span className="text-xs md:text-sm text-muted-foreground">{row.feature}</span>
              </div>
              <div className="p-4 md:p-5 border-l border-border/50 flex items-center justify-center gap-2">
                <Check className="h-4 w-4 md:h-5 md:w-5 text-primary shrink-0" />
                <span className="text-xs md:text-base text-foreground italic">{row.sightline}</span>
              </div>
              <div className="p-4 md:p-5 border-l border-border/50 flex items-center justify-center gap-2">
                {row.traditionalGood ? (
                  <Check className="h-4 w-4 md:h-5 md:w-5 text-orange-500 shrink-0" />
                ) : (
                  <X className="h-4 w-4 md:h-5 md:w-5 text-destructive shrink-0" />
                )}
                <span className="text-xs md:text-base text-foreground italic">{row.traditional}</span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="mt-10 flex justify-center">
          <Link
            href="/wizard"
            className="group flex h-14 items-center justify-center gap-2 rounded-xl bg-primary px-12 text-lg font-semibold text-primary-foreground transition-all hover:bg-primary/90 glow-green"
          >
            Build My Strategy
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  )
}
