"use client"

import Link from "next/link"
import { TrendingUp, Activity, Check, ArrowRight } from "lucide-react"

export function PlatformPreview() {
  return (
    <section className="relative py-20 md:py-28">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/20 to-background" />
      
      <div className="relative mx-auto max-w-6xl px-4 md:px-6">
        <div className="text-center mb-10">
          <p className="mb-3 text-xs font-semibold tracking-widest text-primary uppercase">
            Dashboard Preview
          </p>
          <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-4xl text-balance">
            Platform Dashboard Preview
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground text-pretty">
            See how SightLine presents market structure and monitored conditions inside the platform.
          </p>
        </div>

        {/* Dashboard Preview */}
        <div className="rounded-2xl border border-border/50 bg-card/30 p-4 md:p-6 backdrop-blur-sm">
          <div className="grid gap-4 md:grid-cols-3">
            
            {/* Card 1: Market Structure Overview */}
            <div className="rounded-xl border border-border/50 bg-background/80 p-4">
              <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">
                Market Structure Overview
              </h3>
              <div className="space-y-3">
                <div className="rounded-lg bg-card/50 p-3 border border-primary/20">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-foreground">BTC</span>
                      <span className="text-[10px] text-muted-foreground">/ 15m</span>
                    </div>
                    <span className="text-[10px] text-primary font-medium">Monitoring</span>
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Structure:</span>
                      <span className="text-foreground">Bullish Trend</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Key Area:</span>
                      <span className="text-primary">Support Zone</span>
                    </div>
                  </div>
                </div>
                
                <div className="rounded-lg bg-card/50 p-3 border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-foreground">SPY</span>
                      <span className="text-[10px] text-muted-foreground">/ 5m</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground font-medium">Watching</span>
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Structure:</span>
                      <span className="text-foreground">Neutral Range</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Key Area:</span>
                      <span className="text-foreground">Range Midpoint</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-card/50 p-3 border border-primary/30">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-foreground">ETH</span>
                      <span className="text-[10px] text-muted-foreground">/ 15m</span>
                    </div>
                    <span className="text-[10px] text-amber-500 font-medium">Alert Pending</span>
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Structure:</span>
                      <span className="text-foreground">Trend Continuation</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Key Area:</span>
                      <span className="text-primary">Breakout Level</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Structures Being Monitored */}
            <div className="rounded-xl border border-border/50 bg-background/80 p-4">
              <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">
                Structures Being Monitored
              </h3>
              <div className="space-y-3">
                <div className="rounded-lg bg-card/50 p-3 border border-primary/20">
                  <div className="flex items-center gap-2 mb-1">
                    <Activity className="h-3 w-3 text-primary" />
                    <p className="text-xs font-medium text-foreground">Breakout Patterns</p>
                  </div>
                  <p className="text-[10px] text-muted-foreground">Price approaching key resistance levels</p>
                </div>
                <div className="rounded-lg bg-card/50 p-3 border border-border">
                  <div className="flex items-center gap-2 mb-1">
                    <Activity className="h-3 w-3 text-muted-foreground" />
                    <p className="text-xs font-medium text-foreground">Pullback Patterns</p>
                  </div>
                  <p className="text-[10px] text-muted-foreground">Retracement into support zones</p>
                </div>
                <div className="rounded-lg bg-card/50 p-3 border border-border">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="h-3 w-3 text-muted-foreground" />
                    <p className="text-xs font-medium text-foreground">Trend Continuation</p>
                  </div>
                  <p className="text-[10px] text-muted-foreground">Momentum aligned with structure</p>
                </div>
              </div>
            </div>

            {/* Card 3: Alert Panel */}
            <div className="rounded-xl border border-primary/30 bg-background/80 p-4 glow-green-sm">
              <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">
                Alert Panel
              </h3>
              <div className="space-y-3">
                <div className="rounded-lg bg-card/50 p-3 border border-primary/20">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    <p className="text-xs font-medium text-foreground">Dashboard Alerts</p>
                  </div>
                  <p className="text-[10px] text-muted-foreground">Real-time notifications in platform</p>
                </div>
                <div className="rounded-lg bg-card/50 p-3 border border-border">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="h-2 w-2 rounded-full bg-muted-foreground" />
                    <p className="text-xs font-medium text-foreground">Email Notifications</p>
                  </div>
                  <p className="text-[10px] text-muted-foreground">Alerts delivered to your inbox</p>
                </div>
                <div className="rounded-lg bg-card/50 p-3 border border-border">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="h-2 w-2 rounded-full bg-muted-foreground" />
                    <p className="text-xs font-medium text-foreground">Mobile Alerts</p>
                  </div>
                  <p className="text-[10px] text-muted-foreground">Push notifications on the go</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-[11px] text-muted-foreground/70">
          Interface examples are illustrative and may vary within the platform.
        </p>

        <div className="mt-8 text-center">
          <Link
            href="/strategy-wizard"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-base font-semibold text-primary-foreground hover:bg-primary/90 glow-green"
          >
            Build My Strategy
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
