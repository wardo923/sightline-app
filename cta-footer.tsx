import Link from "next/link"
import { ArrowRight, Crosshair } from "lucide-react"

export function CtaFooter() {
  return (
    <>
      {/* CTA */}
      <section className="section-glow-top relative py-24 md:py-32">
        {/* Ambient glow */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-[500px] w-[500px] rounded-full bg-primary/[0.04] blur-[120px]" />
        </div>
        <div className="relative mx-auto max-w-3xl px-5 text-center">
          <p className="mb-3 text-xs font-semibold tracking-widest text-primary uppercase">
            Get Started
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-5xl text-balance">
            Better structure leads to better trading decisions.
          </h2>
          <p className="mx-auto mt-5 max-w-md text-base text-muted-foreground text-pretty">
            SightLine was built to make that structure accessible.
          </p>
          <div className="mt-10">
            <Link
              href="/strategy-wizard"
              className="group inline-flex h-14 items-center gap-2.5 rounded-xl bg-primary px-10 text-base font-semibold text-primary-foreground transition-all hover:bg-primary/90 glow-green"
            >
              Build My Strategy
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="border-t border-border/50 py-8">
        <div className="mx-auto max-w-4xl px-5 text-center space-y-4">
          <p className="text-[10px] leading-relaxed text-muted-foreground/70">
            SightLine provides market analysis tools and analytical trade setup information based on market structure analysis.
          </p>
          <p className="text-[10px] leading-relaxed text-muted-foreground/70">
            <strong className="text-foreground/80">SightLine is not a broker, investment advisor, or financial advisor.</strong> The platform does not provide investment advice, trading advice, or recommendations to buy, sell, or hold any financial instrument. All content is provided for informational and educational purposes only.
          </p>
          <p className="text-[10px] leading-relaxed text-muted-foreground/70">
            Trading involves substantial risk of loss and past performance does not guarantee future results. Users are solely responsible for their trading decisions and should only trade with capital they can afford to lose.
          </p>
          <p className="text-[10px] leading-relaxed text-muted-foreground/70">
            Any setup examples or scenario illustrations displayed on this platform are hypothetical and provided solely to demonstrate how structured risk parameters or market analysis may be presented.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-10">
        <div className="mx-auto max-w-6xl px-5">
          <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Crosshair className="h-4 w-4 text-primary-foreground" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-sm font-bold text-foreground">SightLine</span>
                <span className="text-[9px] font-medium tracking-widest text-primary uppercase">Advanced Trading Analytics</span>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-muted-foreground">
              <Link href="/technology" className="transition-colors hover:text-foreground">
                Technology
              </Link>
              <Link href="/strategy-examples" className="transition-colors hover:text-foreground">
                Strategy Examples
              </Link>
              <Link href="/risk-framework" className="transition-colors hover:text-foreground">
                Risk Framework
              </Link>
              <Link href="/pricing" className="transition-colors hover:text-foreground">
                Pricing
              </Link>
              <Link href="/faq" className="transition-colors hover:text-foreground">
                FAQ
              </Link>
              <Link href="/about" className="transition-colors hover:text-foreground">
                About
              </Link>
              <Link href="/risk-disclosure" className="transition-colors hover:text-foreground">
                Risk Disclosure
              </Link>
            </div>
            <p className="text-xs text-muted-foreground/60">
              &copy; 2026 SightLine
            </p>
          </div>
        </div>
      </footer>
    </>
  )
}
