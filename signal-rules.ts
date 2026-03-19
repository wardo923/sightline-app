// SightLine V1 Signal Rules
// Conservative configuration prioritizing quality over frequency

import { AlertStrength, PlanTier } from "@/types/strategy"
import { PLAN_LIMITS } from "@/lib/plan-limits"
import { SetupQuality } from "@/lib/signal-engine/v1-scoring"

// V1 Scoring Model Weights
export const CONDITION_WEIGHTS = {
  htfAligned: 1,       // Higher timeframe bias aligned
  structureMet: 2,     // Structure condition met
  retestConfirmed: 2,  // Retest or reclaim confirmed
  momentumExpanding: 1, // Momentum expansion
  volumeConfirmed: 1,  // Volume confirmation
  sessionLiquid: 1,    // Session liquidity valid
}

// Maximum possible score = 8

// Quality Thresholds
export const QUALITY_THRESHOLDS = {
  ELITE: { min: 7, max: 8, label: "Elite Setup" },
  STRONG: { min: 5, max: 6, label: "Strong Setup" },
  DEVELOPING: { min: 4, max: 4, label: "Developing Setup" },
  // Below 4 = No alert
}

// Alert Mode to Quality Mapping
export const ALERT_MODE_RULES: Record<
  AlertStrength,
  { label: string; minScore: number; allowedQualities: SetupQuality[] }
> = {
  HIGH_CONFIRMATION: {
    label: "Focused Mode",
    minScore: 6,
    allowedQualities: ["Elite", "Strong"],
  },
  BALANCED: {
    label: "Balanced Mode",
    minScore: 5,
    allowedQualities: ["Elite", "Strong", "Developing"],
  },
  EARLY_OPPORTUNITY: {
    label: "Active Mode",
    minScore: 4,
    allowedQualities: ["Elite", "Strong", "Developing"],
  },
}

// Map new alert mode values
export const ALERT_MODE_MAP: Record<string, AlertStrength> = {
  "Focused": "HIGH_CONFIRMATION",
  "Balanced": "BALANCED",
  "Active": "EARLY_OPPORTUNITY",
  "Focused Mode": "HIGH_CONFIRMATION",
  "Balanced Mode": "BALANCED",
  "Active Mode": "EARLY_OPPORTUNITY",
}

export type SetupConditions = {
  htfAligned: boolean       // Higher timeframe bias aligned
  structureMet: boolean     // Structure condition met
  retestConfirmed: boolean  // Retest or reclaim confirmed
  momentumExpanding: boolean // Momentum expansion
  volumeConfirmed: boolean  // Volume confirmation
  sessionLiquid: boolean    // Session liquidity valid
}

export function getSetupScore(conditions: SetupConditions): number {
  let score = 0
  if (conditions.htfAligned) score += CONDITION_WEIGHTS.htfAligned
  if (conditions.structureMet) score += CONDITION_WEIGHTS.structureMet
  if (conditions.retestConfirmed) score += CONDITION_WEIGHTS.retestConfirmed
  if (conditions.momentumExpanding) score += CONDITION_WEIGHTS.momentumExpanding
  if (conditions.volumeConfirmed) score += CONDITION_WEIGHTS.volumeConfirmed
  if (conditions.sessionLiquid) score += CONDITION_WEIGHTS.sessionLiquid
  return score
}

export function getSetupQuality(score: number): SetupQuality {
  if (score >= QUALITY_THRESHOLDS.ELITE.min) return "Elite"
  if (score >= QUALITY_THRESHOLDS.STRONG.min) return "Strong"
  if (score >= QUALITY_THRESHOLDS.DEVELOPING.min) return "Developing"
  return "NoAlert"
}

export function canUseAlertStrength(plan: PlanTier, strength: AlertStrength): boolean {
  return PLAN_LIMITS[plan].allowedAlertStrengths.includes(strength)
}

export function shouldTriggerAlert(
  conditions: SetupConditions,
  alertMode: string,
  plan: PlanTier
): { trigger: boolean; quality: SetupQuality; score: number; reason?: string } {
  // Map alert mode string to AlertStrength
  const strength = ALERT_MODE_MAP[alertMode] || "BALANCED"
  
  // Get effective strength based on plan
  const fallbackStrength: AlertStrength =
    plan === "STARTER" && strength === "EARLY_OPPORTUNITY"
      ? "BALANCED"
      : strength

  const score = getSetupScore(conditions)
  const quality = getSetupQuality(score)
  const rules = ALERT_MODE_RULES[fallbackStrength]
  
  // Check minimum score threshold
  if (score < rules.minScore) {
    return { trigger: false, quality, score, reason: `Score ${score}/8 below ${rules.label} threshold (${rules.minScore})` }
  }
  
  // Check quality is allowed
  if (!rules.allowedQualities.includes(quality)) {
    return { trigger: false, quality, score, reason: `${quality} setups not allowed in ${rules.label}` }
  }
  
  return { trigger: true, quality, score }
}

// V1 Philosophy: Quality over frequency
export const V1_PHILOSOPHY = {
  principle: "If setup conditions are incomplete or unclear, do not fire the alert.",
  goal: "Generate fewer but cleaner setups so users build trust in the system.",
  version: "1.0",
}

// Alert output format
export interface AlertOutput {
  setupQuality: string
  whyAppeared: string[]
  watchLevel: number
  exampleEntryZone: { low: number; high: number }
  exampleInvalidation: number
  exampleTargetZone: { target1: number; target2: number }
}

// Generate "Why This Setup Appeared" reasons
export function generateWhyReasons(conditions: SetupConditions): string[] {
  const reasons: string[] = []
  
  if (conditions.structureMet) reasons.push("Structure break at key level")
  if (conditions.retestConfirmed) reasons.push("Retest confirmation")
  if (conditions.momentumExpanding) reasons.push("Momentum expansion detected")
  if (conditions.volumeConfirmed) reasons.push("Volume above average")
  if (conditions.htfAligned) reasons.push("Higher timeframe aligned")
  if (conditions.sessionLiquid) reasons.push("Liquid session active")
  
  return reasons
}
