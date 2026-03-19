"use client"

import Link from "next/link"
import { TrendingUp, Activity, ArrowRight } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-20">
      {/* Background */}
      <div className="absolute inset-0 bg-background" />
      <div className="absolute inset-0 opacity-40 [background:radial-gradient(circle_at_20%_10%,hsl(var(--primary)/0.25),transparent_50%),radial-gradient(circle_at_80%_40%,hsl(142_70%_45%/0.18),transparent_55%)]" />
      <div className="absolute inset-0 grid-bg-hero" />

      <div className="relative mx-auto w-full max-w-6xl px-4 py-16 md:px-6 md:py-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          {/* Left: Content */}
          <div className="text-center lg:text-left">
            <p className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-semibold tracking-widest text-primary uppercase">
              Powered by the SAT Engine
            </p>

            <h1 className="mt-6 text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl text-balance">
              Real Trades.
              <br />
              Real Simple.
              <br />
              <span className="text-primary text-glow">Trade With Structure.</span>
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-base text-muted-foreground lg:mx-0 text-pretty">
              SightLine helps traders create a personalized trading profile using a guided Strategy Wizard. The SAT Engine evaluates market structure and highlights market conditions that may align with a user&apos;s trading preferences.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
              <Link
                href="/strategy-wizard"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-base font-semibold text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/60 glow-green"
              >
                Build My Strategy
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <p className="mt-4 text-sm text-muted-foreground/70">
              Trading profile generated in under two minutes.
            </p>
          </div>

          {/* Right: Platform Preview */}
          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="rounded-2xl border border-border/50 bg-card/50 p-4 backdrop-blur-sm glow-green-sm">
              <p className="mb-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                SightLine Platform Preview
              </p>
              
              {/* Main Preview Card */}
              <div className="rounded-xl border border-primary/30 bg-background/80 p-4 mb-3">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-foreground">BTC</span>
                    <span className="text-xs text-muted-foreground">/ 15m</span>
                  </div>
                  <span className="flex items-center gap-1 rounded-md bg-primary/10 px-2 py-1 text-xs font-semibold text-primary">
                    <TrendingUp className="h-3 w-3" />
                    Bullish
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Structure:</span>
                    <span className="text-foreground font-medium">Bullish Trend</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Key Area:</span>
                    <span className="text-primary font-medium">Support Zone</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <span className="text-foreground font-medium">Monitoring</span>
                  </div>
                </div>
              </div>

              {/* Secondary Cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-border bg-background/60 p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-bold text-foreground">SPY</span>
                    <span className="text-[10px] text-muted-foreground">/ 5m</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Activity className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Neutral Range</span>
                  </div>
                </div>
                <div className="rounded-lg border border-border bg-background/60 p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-bold text-foreground">ETH</span>
                    <span className="text-[10px] text-muted-foreground">/ 15m</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3 text-primary" />
                    <span className="text-xs text-primary">Continuation</span>
                  </div>
                </div>
              </div>
            </div>
            
            <p className="mt-3 text-center text-[10px] text-muted-foreground/60">
              Example platform interface for illustrative purposes only.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
