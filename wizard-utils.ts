import { WizardAnswers, MarketType, AlertStrength } from "@/types/strategy"

export function normalizeMarketType(value?: string): MarketType {
  if (value === "Crypto") return "CRYPTO"
  return "STOCKS"
}

// Canonical alert strength values used by the matrix engine
// matrix uses: "Focused" | "Balanced" | "Active"
// types/strategy uses: "HIGH_CONFIRMATION" | "BALANCED" | "EARLY_OPPORTUNITY"
export const ALERT_STRENGTH_MATRIX_TO_TYPE: Record<string, AlertStrength> = {
  Focused: "HIGH_CONFIRMATION",
  Balanced: "BALANCED",
  Active: "EARLY_OPPORTUNITY",
}

export const ALERT_STRENGTH_TYPE_TO_MATRIX: Record<AlertStrength, string> = {
  HIGH_CONFIRMATION: "Focused",
  BALANCED: "Balanced",
  EARLY_OPPORTUNITY: "Active",
}

export function normalizeAlertStrength(value?: string): AlertStrength {
  if (!value) return "BALANCED"
  // Handle matrix-style values
  if (value in ALERT_STRENGTH_MATRIX_TO_TYPE) return ALERT_STRENGTH_MATRIX_TO_TYPE[value]
  // Handle type-style values
  if (value === "HIGH_CONFIRMATION" || value === "BALANCED" || value === "EARLY_OPPORTUNITY") return value as AlertStrength
  // Legacy values
  if (value === "Early Opportunities") return "EARLY_OPPORTUNITY"
  return "BALANCED"
}

export function getDefaultStrategyName(answers: WizardAnswers, bundleName: string) {
  const asset = answers.asset || "Custom"
  return `${asset} ${bundleName}`
}

export function getAnswerLabel(value?: string) {
  return value || "—"
}
