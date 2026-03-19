"use client"

import { useEffect, useState } from "react"

const steps = [
  "Analyzing selected asset behavior...",
  "Evaluating preferred market conditions...",
  "Matching strategies to timeframe preferences...",
  "Adjusting confirmation strength and signal flow...",
  "Generating strategy profile...",
]

export default function StrategyLoading({
  onComplete,
}: {
  onComplete: () => void
}) {
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (step < steps.length - 1) {
      const timer = setTimeout(() => setStep(step + 1), 700)
      return () => clearTimeout(timer)
    }

    const timer = setTimeout(() => onComplete(), 800)
    return () => clearTimeout(timer)
  }, [step, onComplete])

  return (
    <div className="flex min-h-[420px] flex-col items-center justify-center text-foreground">
      <h2 className="mb-4 text-3xl font-semibold">
        SightLine is analyzing your strategy profile
      </h2>
      <p className="text-lg text-muted-foreground">{steps[step]}</p>
      <div className="mt-8 h-2 w-72 rounded-full bg-muted">
        <div
          className="h-2 rounded-full bg-primary transition-all duration-500"
          style={{ width: `${((step + 1) / steps.length) * 100}%` }}
        />
      </div>
    </div>
  )
}
