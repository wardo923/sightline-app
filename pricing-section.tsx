import Link from "next/link"
import { Check } from "lucide-react"

const plans = [
  {
    name: "Starter",
    price: "$19",
    period: "/mo",
    description: "Essential monitoring tools",
    features: [
      "1 strategy profile",
      "Market structure alerts",
      "Entry / stop / target levels",
      "Email alerts",
    ],
    popular: false,
    freeTrial: true,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/mo",
    description: "Expanded coverage",
    features: [
      "Multiple strategy profiles",
      "Expanded alert coverage",
      "Dashboard analytics",
      "Daily market brief",
      "Email + Telegram alerts",
    ],
    popular: true,
    freeTrial: true,
  },
  {
    name: "Elite",
    price: "$49",
    period: "/mo",
    description: "Full platform access",
    features: [
      "Unlimited strategy profiles",
      "Full alert suite",
      "Advanced setup confirmations",
      "Priority alerts",
      "Daily market brief",
    ],
    popular: false,
    freeTrial: true,
  },
]

export function PricingSection() {
  return (
    <section className="relative py-24 md:py-32" id="pricing">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/20 to-background" />
      
      <div className="relative mx-auto max-w-6xl px-5">
        <div className="text-center">
          <p className="mb-3 text-xs font-semibold tracking-widest text-primary uppercase">
            Pricing
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-5xl text-balance">
            Transparent Pricing
          </h2>
          <p className="mx-auto mt-5 max-w-md text-base text-muted-foreground text-pretty">
            Simple plans with no hidden fees.
          </p>
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          All plans include structured setup monitoring and market analysis tools.
        </p>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`card-glow relative flex flex-col rounded-2xl border p-8 md:p-9 transition-all ${
                plan.popular
                  ? "border-primary/30 bg-primary/[0.03] glow-green-sm"
                  : "border-border bg-card"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 right-6 rounded-full bg-primary px-4 py-1 text-[11px] font-bold tracking-wide text-primary-foreground uppercase">
                  Most Popular
                </div>
              )}

              <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>

              <div className="mt-7 flex items-baseline gap-1">
                <span className="text-5xl font-extrabold tracking-tight text-foreground">
                  {plan.price}
                </span>
                <span className="text-sm font-medium text-muted-foreground">{plan.period}</span>
              </div>

              <div className="my-8 h-px bg-border" />

              <ul className="flex flex-col gap-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Check className={`h-4 w-4 shrink-0 ${plan.popular ? "text-primary" : "text-success"}`} />
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-9">
                <Link
                  href="/strategy-wizard"
                  className={`flex h-12 items-center justify-center rounded-xl text-sm font-semibold transition-all ${
                    plan.popular
                      ? "bg-primary text-primary-foreground hover:bg-primary/90 glow-green-sm"
                      : "border border-border bg-secondary text-secondary-foreground hover:border-primary/30 hover:text-primary"
                  }`}
                >
                  {plan.freeTrial ? "Unlock My Strategy" : "Get Started"}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
