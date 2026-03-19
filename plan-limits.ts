import { PlanTier, AlertStrength } from "@/types/strategy"

// V1 Engine: Quality over frequency
// Starter users get Focused and Balanced modes only
// Pro and Elite users get all modes including Active

export type PlanLimitConfig = {
  // Strategy limits
  maxSavedStrategies: number
  allowedAlertStrengths: AlertStrength[]
  minSetupScore: number
  
  // Daily limits
  maxSignalsPerDay: number
  maxAlertsPerDay: number
  maxScansPerDay: number
  
  // Asset limits
  maxMonitoredAssets: number
  
  // Feature flags
  hasDailyBrief: boolean
  hasPriorityAlerts: boolean
  hasEmailAlerts: boolean
  hasMobileAlerts: boolean
}

export const PLAN_LIMITS: Record<PlanTier, PlanLimitConfig> = {
  STARTER: {
    maxSavedStrategies: 1,
    allowedAlertStrengths: ["HIGH_CONFIRMATION", "BALANCED"],
    minSetupScore: 5,
    maxSignalsPerDay: 5,
    maxAlertsPerDay: 10,
    maxScansPerDay: 12, // Every 2 hours
    maxMonitoredAssets: 3,
    hasDailyBrief: false,
    hasPriorityAlerts: false,
    hasEmailAlerts: true,
    hasMobileAlerts: false,
  },
  PRO: {
    maxSavedStrategies: 3,
    allowedAlertStrengths: ["HIGH_CONFIRMATION", "BALANCED", "EARLY_OPPORTUNITY"],
    minSetupScore: 4,
    maxSignalsPerDay: 15,
    maxAlertsPerDay: 30,
    maxScansPerDay: 48, // Every 30 minutes
    maxMonitoredAssets: 10,
    hasDailyBrief: true,
    hasPriorityAlerts: false,
    hasEmailAlerts: true,
    hasMobileAlerts: true,
  },
  ELITE: {
    maxSavedStrategies: 10,
    allowedAlertStrengths: ["HIGH_CONFIRMATION", "BALANCED", "EARLY_OPPORTUNITY"],
    minSetupScore: 4,
    maxSignalsPerDay: 50,
    maxAlertsPerDay: 100,
    maxScansPerDay: 288, // Every 5 minutes (unlimited practical)
    maxMonitoredAssets: 25,
    hasDailyBrief: true,
    hasPriorityAlerts: true,
    hasEmailAlerts: true,
    hasMobileAlerts: true,
  },
}

// Get user's plan from subscription or default to STARTER
export function getPlanTier(subscriptionPlan: string | null | undefined): PlanTier {
  if (!subscriptionPlan) return "STARTER"
  const plan = subscriptionPlan.toUpperCase()
  if (plan === "PRO") return "PRO"
  if (plan === "ELITE") return "ELITE"
  return "STARTER"
}

// Get limits for a plan
export function getPlanLimits(tier: PlanTier): PlanLimitConfig {
  return PLAN_LIMITS[tier]
}

// Alert Mode Labels (user-facing)
export const ALERT_MODE_LABELS: Record<AlertStrength, string> = {
  HIGH_CONFIRMATION: "Focused Mode",
  BALANCED: "Balanced Mode",
  EARLY_OPPORTUNITY: "Active Mode",
}

// Alert Mode Descriptions
export const ALERT_MODE_DESCRIPTIONS: Record<AlertStrength, string> = {
  HIGH_CONFIRMATION: "Only the strongest setups appear. Requires the highest level of confirmation.",
  BALANCED: "A mix of strong and developing setups based on multiple market conditions.",
  EARLY_OPPORTUNITY: "Alerts appear earlier as setups begin forming. May produce more activity.",
}
