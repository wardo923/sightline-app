import { WizardAnswers } from "@/types/strategy"
import { scoreAnswers } from "@/lib/strategy-matrix"
import { calculateConfidence } from "@/lib/strategy-confidence"
import { STRATEGY_INFO } from "@/lib/strategies"

export function generateStrategyResult(answers: WizardAnswers) {
  const scores = scoreAnswers(answers)
  const confidenceData = calculateConfidence(scores)

  return {
    bundle: confidenceData.topStrategy,
    info: STRATEGY_INFO[confidenceData.topStrategy],
    confidence: confidenceData.confidence,
    secondaryBundle: confidenceData.secondStrategy,
    secondaryBundleInfo: confidenceData.secondStrategy
      ? STRATEGY_INFO[confidenceData.secondStrategy]
      : null,
    scores,
    ranked: confidenceData.ranked,
    whySelected: buildWhySelected(answers, confidenceData.topStrategy),
  }
}

function buildWhySelected(answers: WizardAnswers, bundle: string) {
  const bullets: string[] = []

  if (answers.asset) bullets.push(`Strong fit for ${answers.asset}`)
  if (answers.timeframe) bullets.push(`Aligned with ${answers.timeframe.toLowerCase()} preferences`)
  if (answers.alertStrength) bullets.push(`Matched to ${answers.alertStrength.toLowerCase()} setup filtering`)

  if (bundle === "MOMENTUM_BREAKOUT") {
    bullets.push("Best matched to momentum and continuation behavior")
  }

  if (bundle === "LIQUIDITY_REVERSAL") {
    bullets.push("Best matched to failed-move and reversal behavior")
  }

  if (bundle === "STRUCTURE_REACTION") {
    bullets.push("Best matched to support and resistance decision-making")
  }

  if (bundle === "OPENING_RANGE") {
    bullets.push("Best matched to fast intraday session behavior")
  }

  if (bundle === "VOLATILITY_EXPANSION") {
    bullets.push("Best matched to fast-moving expansion conditions")
  }

  if (bundle === "SESSION_STRUCTURE") {
    bullets.push("Best matched to level-based session behavior")
  }

  return bullets.slice(0, 3)
}
