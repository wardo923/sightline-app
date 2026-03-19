import { Scan, History, Smartphone } from "lucide-react"

const features = [
  {
    icon: Scan,
    title: "Automated Market Scanning",
    description: "Real-time scanning across all supported markets.",
  },
  {
    icon: History,
    title: "Strategy Backtesting",
    description: "Test your strategy against historical data.",
  },
  {
    icon: Smartphone,
    title: "Mobile Push Notifications",
    description: "Get alerts directly on your phone.",
  },
]

export function ComingSoonSection() {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5">
        {/* Section header */}
        <div className="text-center">
          <p className="mb-3 text-xs font-semibold tracking-widest text-primary uppercase">
            Coming Soon
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl text-balance">
            More features on the way
          </h2>
          <p className="mx-auto mt-4 max-w-md text-base text-muted-foreground">
            We&apos;re actively building new capabilities to help you trade smarter.
          </p>
        </div>

        {/* Features grid */}
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="relative flex flex-col items-center rounded-2xl border border-dashed border-border/60 bg-card/30 p-8 text-center"
            >
              <div className="absolute -top-3 right-4 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[10px] font-semibold tracking-wider text-primary uppercase">
                Coming Soon
              </div>
              
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <feature.icon className="h-7 w-7" />
              </div>
              
              <h3 className="mt-5 text-lg font-semibold text-foreground">{feature.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
