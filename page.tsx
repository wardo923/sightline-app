"use client"

import Link from "next/link"
import { TrendingUp } from "lucide-react"
import { useEffect, useRef } from "react"

function SightLineBackground() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Create particles
    for (let i = 0; i < 35; i++) {
      const particle = document.createElement("div")
      particle.className = "sightline-particle"
      particle.style.cssText = `
        position: absolute;
        background: #00ff9c;
        border-radius: 50%;
        opacity: 0.2;
        width: ${Math.random() * 3 + 1}px;
        height: ${Math.random() * 3 + 1}px;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        animation: float ${15 + Math.random() * 20}s linear infinite;
      `
      container.appendChild(particle)
    }

    return () => {
      const particles = container.querySelectorAll(".sightline-particle")
      particles.forEach((p) => p.remove())
    }
  }, [])

  return (
    <div ref={containerRef} className="fixed inset-0 z-0 overflow-hidden bg-[#020403]">
      {/* Grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,255,140,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,140,0.06) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Glow */}
      <div
        className="absolute left-1/2 top-[40%] -translate-x-1/2 -translate-y-1/2"
        style={{
          width: "1200px",
          height: "800px",
          background:
            "radial-gradient(circle, rgba(0,255,140,0.18) 0%, rgba(0,255,140,0.05) 40%, transparent 70%)",
          animation: "glowPulse 10s ease-in-out infinite",
        }}
      />

      {/* Scanning Line */}
      <div
        className="absolute bottom-[25%] w-full h-[2px]"
        style={{
          background: "linear-gradient(90deg, transparent, #00ff9c, transparent)",
          boxShadow: "0 0 15px #00ff9c",
          animation: "scanMove 18s linear infinite",
        }}
      />

      <style jsx>{`
        @keyframes glowPulse {
          0% { opacity: 0.6; }
          50% { opacity: 1; }
          100% { opacity: 0.6; }
        }
        @keyframes scanMove {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes float {
          0% { transform: translateY(0); }
          100% { transform: translateY(-120vh); }
        }
      `}</style>
    </div>
  )
}

export default function SightLineLandingPage() {
  return (
    <main className="min-h-screen text-white relative overflow-hidden">
      <SightLineBackground />

      {/* HEADER */}
      <header className="relative z-10 flex items-center justify-between px-6 py-5 border-b border-[#16301f]">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#2bd673]">
            <TrendingUp className="h-4 w-4 text-black" />
          </div>
          <div>
            <div className="text-base font-semibold text-white">SightLine</div>
            <div className="text-[9px] uppercase tracking-[0.15em] text-[#2bd673]">
              Trading Analytics
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/auth/login"
            className="text-sm font-medium text-[#7f9187] hover:text-white transition-colors"
          >
            Log In
          </Link>
          <Link
            href="/auth/sign-up"
            className="rounded-lg bg-[#2bd673] px-4 py-2 text-sm font-semibold text-black transition-all hover:bg-[#25b862]"
          >
            Sign Up
          </Link>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative z-10 py-20 md:py-28 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-semibold text-white leading-tight text-balance">
            Build Your Strategy Profile.
            <span className="block text-[#2bd673]">Trade With Structure.</span>
          </h1>

          <p className="mt-8 text-lg text-[#9fb3a7] leading-relaxed max-w-2xl mx-auto">
            Answer a few questions and SightLine will calibrate a monitoring strategy around how you trade.
          </p>

          <div className="mt-10 max-w-xl mx-auto text-left space-y-3">
            {[
              "No charts to read. No indicators to interpret.",
              "SightLine monitors the market and identifies entry zones for you.",
              "When your setup conditions align, you get an entry zone — not a buy signal.",
              "You decide when and whether to act. SightLine does the watching.",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-[#2bd673] mt-0.5">•</span>
                <span className="text-[#9fb3a7]">{item}</span>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-6 text-sm text-[#7f9187]">
            <span>Not a signal service</span>
            <span>Not a guru</span>
            <span>Not a highlights reel</span>
          </div>

          <div className="mt-10">
            <Link
              href="/strategy-wizard"
              className="inline-block rounded-xl bg-[#2bd673] px-10 py-4 text-lg font-semibold text-black transition hover:bg-[#22c763]"
            >
              Build Your Strategy Profile
            </Link>
          </div>
        </div>
      </section>

      {/* EXAMPLE ALERT PREVIEW */}
      <section id="example-alert" className="relative z-10 py-20 px-6 border-t border-[#16301f]">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-medium uppercase tracking-widest text-[#2bd673] mb-2">
              Example Entry Zone
            </p>
          </div>

          <div className="rounded-xl border border-[#2bd673]/30 bg-[#07110c]/80 backdrop-blur p-6 shadow-[0_0_30px_rgba(43,214,115,0.1)]">
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div>
                <p className="text-xs text-[#7f9187] mb-1">Asset</p>
                <p className="text-white font-semibold">BTC</p>
              </div>
              <div>
                <p className="text-xs text-[#7f9187] mb-1">Timeframe</p>
                <p className="text-white font-semibold">15m</p>
              </div>
              <div>
                <p className="text-xs text-[#7f9187] mb-1">Setup Type</p>
                <p className="text-white font-semibold">Pullback Into Support</p>
              </div>
            </div>

            <div className="space-y-3 border-t border-[#16301f] pt-4">
              <div className="flex justify-between py-2">
                <span className="text-[#7f9187]">Entry Level</span>
                <span className="text-[#2bd673] font-semibold">67,420</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-[#7f9187]">Target Projection</span>
                <span className="text-[#2bd673] font-semibold">68,350</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-[#16301f] flex items-center justify-between">
              <span className="text-[#7f9187]">Status</span>
              <span className="px-3 py-1 rounded-full bg-[#2bd673]/20 text-[#2bd673] text-sm font-medium">
                Setup Active
              </span>
            </div>
          </div>

          <p className="mt-8 text-center text-[#9fb3a7]">
            SightLine is for traders who are tired of losing money to noise, indicators, and overtrading. Entry zones. Not buy signals.
          </p>
        </div>
      </section>

      {/* PRICING */}
      <section className="relative z-10 border-t border-[#16301f] py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-medium uppercase tracking-widest text-[#2bd673] mb-2">
              Pricing
            </p>
            <h2 className="text-2xl md:text-3xl font-semibold text-white">
              SightLine Plans
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                name: "Starter",
                price: "$15",
                features: [
                  "1 strategy profile",
                  "Market structure alerts",
                  "Dashboard alerts",
                  "Email notifications",
                ],
              },
              {
                name: "Pro",
                price: "$29",
                popular: true,
                features: [
                  "Multiple strategy profiles",
                  "Expanded asset monitoring",
                  "Dashboard analytics",
                  "Daily market brief",
                  "Email and Telegram alerts",
                ],
              },
              {
                name: "Elite",
                price: "$39",
                features: [
                  "Unlimited strategy profiles",
                  "Full alert suite",
                  "Advanced monitoring confirmations",
                  "Priority alerts",
                  "Daily market brief",
                ],
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`rounded-xl p-6 backdrop-blur ${
                  plan.popular
                    ? "border-2 border-[#2bd673] bg-[#07110c]/80"
                    : "border border-[#16301f] bg-[#07110c]/80"
                }`}
              >
                {plan.popular && (
                  <div className="text-xs font-medium uppercase tracking-wider text-[#2bd673] mb-3">
                    Most Popular
                  </div>
                )}
                <p className="text-sm font-medium text-[#7f9187] uppercase tracking-wider">
                  {plan.name}
                </p>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl font-semibold text-white">{plan.price}</span>
                  <span className="text-sm text-[#7f9187]">/month</span>
                </div>

                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <span className="text-[#2bd673] mt-0.5">•</span>
                      <span className="text-[#9fb3a7]">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/strategy-wizard"
                  className={`mt-6 block w-full rounded-lg py-3 text-center text-sm font-semibold transition-all ${
                    plan.popular
                      ? "bg-[#2bd673] text-black hover:bg-[#25b862]"
                      : "border border-[#16301f] text-white hover:border-[#2bd673] hover:text-[#2bd673]"
                  }`}
                >
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 border-t border-[#16301f] py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">
            Stop Watching Charts. Start Trading With Structure.
          </h2>
          <p className="text-base text-[#9fb3a7] mb-8">
            Build your strategy profile in under 2 minutes. SightLine does the rest.
          </p>
          <Link
            href="/strategy-wizard"
            className="inline-block rounded-xl bg-[#2bd673] px-10 py-4 text-lg font-semibold text-black transition hover:bg-[#22c763]"
          >
            START YOUR STRATEGY
          </Link>
        </div>
      </section>

      {/* DISCLAIMER / FOOTER */}
      <footer className="relative z-10 border-t border-[#16301f] py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2bd673]">
              <TrendingUp className="h-4 w-4 text-black" />
            </div>
            <div>
              <div className="text-base font-semibold text-white">SightLine</div>
              <div className="text-[8px] uppercase tracking-[0.15em] text-[#2bd673]">
                Trading Analytics
              </div>
            </div>
          </div>

          <div className="text-center space-y-4 text-sm text-[#7f9187] max-w-2xl mx-auto">
            <p className="font-medium text-[#9fb3a7]">DISCLAIMER</p>
            <p>
              SightLine provides analytical tools designed to identify market
              structure conditions based on user-defined strategy settings.
              Information provided by the platform is for informational and
              educational purposes only and does not constitute financial or
              investment advice.
            </p>
            <p>
              Trade setups and levels displayed by the platform are automatically
              generated by system algorithms based on market data and user settings.
            </p>
            <p>
              Trading involves risk and users are responsible for their own trading
              decisions.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-[#7f9187]">
            <Link href="/terms" className="hover:text-[#2bd673] transition-colors">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-[#2bd673] transition-colors">
              Privacy
            </Link>
            <Link href="/risk-disclosure" className="hover:text-[#2bd673] transition-colors">
              Risk Disclosure
            </Link>
          </div>

          <p className="mt-8 text-center text-xs text-[#7f9187]/60">© 2026 SightLine</p>
        </div>
      </footer>
    </main>
  )
}
