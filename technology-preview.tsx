import { Wand2, BarChart3, Target, Activity, Bell, Mail, Smartphone } from "lucide-react"

const techFeatures = [
  {
    icon: BarChart3,
    title: "Price Structure Analysis",
    description: "Trend and momentum evaluation across supported markets.",
  },
  {
    icon: Target,
    title: "Support and Resistance Detection",
    description: "Structural price zones identified through SAT Engine analysis.",
  },
  {
    icon: Activity,
    title: "Volatility Context",
    description: "Market behavior evaluation during changing conditions.",
  },
  {
    icon: Wand2,
    title: "Trading Profile Mapping",
    description: "Match market conditions with user preferences and risk parameters.",
  },
]

const alertChannels = [
  { icon: Bell, label: "Dashboard Alerts" },
  { icon: Mail, label: "Email Alerts" },
  { icon: Smartphone, label: "Mobile Notifications" },
]

export function TechnologyPreview() {
  return (
    <section className="relative py-24 md:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/20 to-background" />
      
      <div className="relative mx-auto max-w-6xl px-4 md:px-6">
        <div className="text-center mb-12">
          <p className="mb-3 text-xs font-semibold tracking-widest text-primary uppercase">
            Technology
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-5xl text-balance">
            Powered by the SAT Engine
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground text-pretty">
            SightLine&apos;s analysis system evaluates market structure and identifies patterns that may align with a user&apos;s trading profile.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {techFeatures.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border border-border/50 bg-card/50 p-6 card-glow transition-all hover:border-primary/30"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Alert Channels */}
        <div className="mt-12 rounded-xl border border-border/50 bg-card/30 p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider text-center">
            Alert Channels
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            {alertChannels.map((channel) => (
              <div
                key={channel.label}
                className="flex items-center gap-2 rounded-lg bg-background/60 px-4 py-2 border border-border"
              >
                <channel.icon className="h-4 w-4 text-primary" />
                <span className="text-sm text-foreground">{channel.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
