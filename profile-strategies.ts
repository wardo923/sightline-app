import { SavedStrategy, PlanTier, WizardAnswers } from "@/types/strategy"
import { PLAN_LIMITS } from "@/lib/plan-limits"
import { generateStrategyResult } from "@/lib/strategy-result"
import { normalizeAlertStrength, normalizeMarketType } from "@/lib/wizard-utils"

export function canSaveAnotherStrategy(
  currentStrategies: SavedStrategy[],
  plan: PlanTier
) {
  return currentStrategies.length < PLAN_LIMITS[plan].maxSavedStrategies
}

export function buildSavedStrategy(params: {
  userId: string
  customName: string
  answers: WizardAnswers
}) {
  const result = generateStrategyResult(params.answers)

  return {
    id: crypto.randomUUID(),
    userId: params.userId,
    customName: params.customName,
    marketType: normalizeMarketType(params.answers.marketType),
    asset: params.answers.asset || "SPY",
    bundle: result.bundle,
    timeframe: params.answers.timeframe || "Structured intraday (15 minute)",
    alertStrength: normalizeAlertStrength(params.answers.alertStrength),
    confidenceScore: result.confidence,
    secondaryBundle: result.secondaryBundle,
    wizardAnswers: params.answers,
    isActive: true,
    createdAt: new Date().toISOString(),
    stats: {
      alertsFired: 0,
      wins: 0,
      losses: 0,
      pushes: 0,
      winRatio: 0,
    },
  }
}
