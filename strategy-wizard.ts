// Re-export everything from the new modular strategy system
export * from "@/types/strategy"
export * from "@/lib/wizard-questions"
export * from "@/lib/strategy-matrix"
export * from "@/lib/strategy-confidence"
export * from "@/lib/strategy-result"
export * from "@/lib/strategies"
export * from "@/lib/wizard-utils"
export * from "@/lib/plan-limits"
export * from "@/lib/signal-rules"

// Re-export commonly used functions with legacy names for backwards compatibility
export { WIZARD_QUESTIONS } from "@/lib/wizard-questions"
export { scoreAnswers } from "@/lib/strategy-matrix"
export { generateStrategyResult as buildStrategyResult } from "@/lib/strategy-result"
export { STRATEGY_INFO as STRATEGY_BUNDLES } from "@/lib/strategies"
