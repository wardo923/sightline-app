"use client"

import Link from "next/link"
import { Check, ArrowRight } from "lucide-react"

const previewQuestions = [
  {
    question: "What markets do you trade?",
    options: ["Crypto", "Stocks", "Indices", "Futures", "Multiple Markets"],
  },
  {
    question: "Preferred trading timeframe?",
    options: ["Intraday", "Swing Trading", "Multi-Day", "Position Trading"],
  },
  {
    question: "Risk tolerance?",
    options: ["Conservative", "Moderate", "Growth"],
  },
  {
    question: "Monitoring frequency?",
    options: ["Selective Opportunities", "Balanced Opportunities", "Higher Activity"],
  },
]

export function StrategyBuilderPreview() {
  return (
    <section className="relative py-24 md:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/20 to-background" />
      
      <div className="relative mx-auto max-w-6xl px-4 md:px-6">
        <div className="text-center mb-12">
          <p className="mb-3 text-xs font-semibold tracking-widest text-primary uppercase">
            Strategy Wizard
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-5xl text-balance">
            Build Your Strategy
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground text-pretty">
            Answer a few questions to generate your trading profile.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Preview Questions */}
          <div className="space-y-4">
            {previewQuestions.map((q, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-border/50 bg-card/50 p-5"
              >
                <p className="text-sm font-medium text-foreground mb-3">{q.question}</p>
                <div className="flex flex-wrap gap-2">
                  {q.options.map((option, optIdx) => (
                    <span
                      key={optIdx}
                      className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                        optIdx === 0
                          ? "bg-primary/20 text-primary border border-primary/30"
                          : "bg-muted text-muted-foreground border border-border"
                      }`}
                    >
                      {option}
                    </span>
                  ))}
                </div>
              </div>
            ))}
            
            <Link
              href="/strategy-wizard"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-base font-semibold text-primary-foreground hover:bg-primary/90 glow-green mt-4"
            >
              Generate My Strategy
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Preview Result */}
          <div className="rounded-2xl border border-primary/30 bg-card/50 p-6 glow-green-sm">
            <div className="flex items-center gap-2 mb-6">
              <div className="h-3 w-3 rounded-full bg-primary animate-pulse" />
              <p className="text-sm font-semibold text-primary uppercase tracking-wider">
                Your Trading Profile
              </p>
            </div>

            <div className="space-y-4">
              <div className="rounded-lg bg-background/60 p-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Markets</p>
                <p className="text-base font-semibold text-foreground">Crypto & Equities</p>
              </div>
              <div className="rounded-lg bg-background/60 p-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Timeframe</p>
                <p className="text-base font-semibold text-foreground">Intraday / Swing</p>
              </div>
              <div className="rounded-lg bg-background/60 p-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Risk Profile</p>
                <p className="text-base font-semibold text-foreground">Moderate</p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-border">
              <div className="flex items-start gap-2">
                <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <p className="text-sm text-muted-foreground">
                  SightLine will monitor market structure and highlight conditions aligned with your trading preferences.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
