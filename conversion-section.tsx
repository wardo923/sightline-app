import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function ConversionSection() {
  return (
    <section className="section-glow-top py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-5 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-5xl text-balance">
          Start trading smarter in minutes.
        </h2>
        
        <p className="mx-auto mt-6 max-w-lg text-base text-muted-foreground text-pretty">
          Build your custom strategy, receive clear trade setups, and execute with confidence.
        </p>

        <div className="mt-10 flex flex-col items-center">
          <Link
            href="/wizard"
            className="group flex h-14 w-full items-center justify-center gap-2.5 rounded-xl bg-primary px-10 text-base font-semibold text-primary-foreground transition-all hover:bg-primary/90 sm:w-auto glow-green"
          >
            Build My Strategy
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <p className="mt-6 text-sm text-muted-foreground">
          3-day free trial &bull; No credit card required
        </p>
      </div>
    </section>
  )
}
