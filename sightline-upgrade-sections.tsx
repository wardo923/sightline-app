"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function SightLineUpgradeSections() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-14 md:px-6">
      {/* 1) LIVE TRADE EXAMPLE */}
      <section className="mb-14">
        <div className="mb-6">
          <p className="text-sm font-semibold tracking-widest text-primary uppercase">
            Live Example
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground md:text-4xl text-balance">
            See a trade setup exactly how you&apos;ll receive it
          </h2>
          <p className="mt-3 max-w-2xl text-base text-muted-foreground">
            SightLine delivers a complete, risk-defined trade plan — entry, stop, target,
            and status — so you don&apos;t have to interpret charts.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Example Card */}
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 shadow-[0_0_0_1px_rgba(34,197,94,0.08)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Asset / Timeframe</p>
                <p className="mt-1 text-xl font-semibold text-foreground">BTC / 15m</p>
              </div>

              <div className="rounded-full bg-primary/15 px-3 py-1 text-sm font-semibold text-primary">
                SETUP FORMING
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-4">
              <Metric label="Entry" value="64,200" tone="neutral" />
              <Metric label="Stop" value="63,700" tone="danger" />
              <Metric label="Target" value="65,300" tone="success" />
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-primary/15 bg-background/50 p-4">
              <div>
                <p className="text-xs text-muted-foreground">Risk / Reward</p>
                <p className="mt-1 text-lg font-semibold text-foreground">2.2R</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Signal Type</p>
                <p className="mt-1 text-sm font-semibold text-foreground/90">
                  Breakout (Rule-Matched)
                </p>
              </div>
            </div>

            <p className="mt-5 text-sm text-muted-foreground">
              Example only. Alerts are informational and do not guarantee outcomes.
            </p>
          </div>

          {/* Explainer */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="text-xl font-semibold text-foreground">What you get with every setup</h3>

            <ul className="mt-4 space-y-3 text-muted-foreground">
              <li className="flex gap-3">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                <span>
                  <span className="font-semibold text-foreground">Clear levels:</span> entry,
                  stop loss, and profit target.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                <span>
                  <span className="font-semibold text-foreground">One setup at a time:</span>{" "}
                  fewer signals, less noise.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                <span>
                  <span className="font-semibold text-foreground">Status + invalidation:</span>{" "}
                  know when it&apos;s valid — and when it&apos;s not.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                <span>
                  <span className="font-semibold text-foreground">Risk structure:</span> built
                  to support disciplined execution.
                </span>
              </li>
            </ul>

            <div className="mt-6 rounded-xl border border-primary/15 bg-primary/5 p-4 text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">No broker connection required.</span>{" "}
              SightLine provides analysis and alerts only — you remain in full control.
            </div>
          </div>
        </div>
      </section>

      {/* 2) MARKETS WE COVER */}
      <section className="mb-14">
        <div className="mb-6">
          <p className="text-sm font-semibold tracking-widest text-primary uppercase">
            Coverage
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground md:text-4xl text-balance">
            Markets SightLine covers
          </h2>
          <p className="mt-3 max-w-2xl text-base text-muted-foreground">
            Your wizard profile determines what we scan and how strict signals should be.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <CategoryCard
            title="Crypto"
            subtitle="24/7 market scanning"
            items={["BTC", "ETH", "SOL", "Major alts (optional)"]}
          />
          <CategoryCard
            title="Stocks"
            subtitle="Liquid, high-volume names"
            items={["SPY", "NVDA", "TSLA", "AAPL / MSFT (optional)"]}
          />
          <CategoryCard
            title="Indices / ETFs"
            subtitle="Broad market tracking"
            items={["S&P 500 ETFs", "NASDAQ ETFs", "Sector ETFs (optional)", "Custom watchlist"]}
          />
        </div>

        <div className="mt-6 rounded-2xl border border-border bg-card p-6">
          <h3 className="text-lg font-semibold text-foreground">How it stays &quot;simple&quot;</h3>
          <p className="mt-2 text-muted-foreground">
            Beginner-friendly defaults keep signals clean. Advanced users can tighten
            filters and focus on A+ setups only.
          </p>
        </div>
      </section>

      {/* 3) WHY THIS WORKS (RISK MATH) */}
      <section>
        <div className="mb-6">
          <p className="text-sm font-semibold tracking-widest text-primary uppercase">
            Why This Works
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground md:text-4xl text-balance">
            Profitable trading isn&apos;t about winning every trade
          </h2>
          <p className="mt-3 max-w-2xl text-base text-muted-foreground">
            It&apos;s about risk management and having bigger winners than losers.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Math Example */}
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6">
            <h3 className="text-xl font-semibold text-foreground">Simple example (illustrative)</h3>

            <div className="mt-5 grid grid-cols-2 gap-4">
              <MiniStat label="Win Rate" value="45%" />
              <MiniStat label="Average Win" value="2R" />
              <MiniStat label="Average Loss" value="1R" />
              <MiniStat label="Trades" value="10" />
            </div>

            <div className="mt-5 rounded-xl border border-primary/15 bg-background/50 p-4 text-foreground/80">
              <p className="text-sm">
                4 wins × 2R = <span className="font-semibold text-primary">+8R</span>
              </p>
              <p className="mt-1 text-sm">
                6 losses × 1R = <span className="font-semibold text-destructive">-6R</span>
              </p>
              <div className="mt-3 h-px w-full bg-border" />
              <p className="mt-3 text-sm">
                Net result = <span className="font-semibold text-primary">+2R</span>
              </p>
            </div>

            <p className="mt-5 text-sm text-muted-foreground">
              This is not a promise of profit — it&apos;s an example of how risk/reward can
              work even with a win rate below 50%.
            </p>
          </div>

          {/* Explanation */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="text-xl font-semibold text-foreground">What SightLine is designed to do</h3>

            <ul className="mt-4 space-y-3 text-muted-foreground">
              <li className="flex gap-3">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                <span>
                  Deliver <span className="font-semibold text-foreground">structured setups</span>{" "}
                  with defined risk.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                <span>
                  Reduce confusion by avoiding &quot;interpret-this-indicator&quot; signals.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                <span>
                  Keep decisions consistent with your wizard-built strategy profile.
                </span>
              </li>
            </ul>

            <div className="mt-6 rounded-xl border border-border bg-background/50 p-4 text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">Important:</span> No trading system
              is 100% accurate. Past performance does not guarantee future results.
            </div>
          </div>
        </div>

        {/* CTA strip */}
        <div className="mt-10 flex flex-col items-start justify-between gap-4 rounded-2xl border border-primary/20 bg-primary/5 p-6 md:flex-row md:items-center">
          <div>
            <h3 className="text-xl font-semibold text-foreground">Ready to build your strategy?</h3>
            <p className="mt-1 text-muted-foreground">
              Answer a few questions. Get a profile that scans the market for your exact setups.
            </p>
          </div>

          <Link
            href="/wizard"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-base font-semibold text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/60 transition-colors"
          >
            Build My Strategy
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}

/* Small UI helpers */

function Metric({
  label,
  value,
  tone,
}: {
  label: string
  value: string
  tone: "neutral" | "success" | "danger"
}) {
  const toneClass =
    tone === "success"
      ? "text-primary"
      : tone === "danger"
      ? "text-destructive"
      : "text-foreground"

  return (
    <div className="rounded-xl border border-border bg-background/50 p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`mt-1 text-lg font-semibold ${toneClass}`}>{value}</p>
    </div>
  )
}

function CategoryCard({
  title,
  subtitle,
  items,
}: {
  title: string
  subtitle: string
  items: string[]
}) {
  return (
    <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-xl font-semibold text-foreground">{title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        </div>
        <div className="h-10 w-10 rounded-xl bg-primary/15 ring-1 ring-primary/20" />
      </div>

      <ul className="mt-4 space-y-2 text-muted-foreground">
        {items.map((x) => (
          <li key={x} className="flex gap-3">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
            <span>{x}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-background/50 p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-lg font-semibold text-foreground">{value}</p>
    </div>
  )
}
