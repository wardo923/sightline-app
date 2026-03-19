export type MarketType = "STOCKS" | "CRYPTO"

export type StrategyBundle =
  | "MOMENTUM_BREAKOUT"
  | "LIQUIDITY_REVERSAL"
  | "STRUCTURE_REACTION"
  | "OPENING_RANGE"
  | "VOLATILITY_EXPANSION"
  | "SESSION_STRUCTURE"

export type AlertStrength =
  | "HIGH_CONFIRMATION"
  | "BALANCED"
  | "EARLY_OPPORTUNITY"

export type PlanTier = "STARTER" | "PRO" | "ELITE"

export type WizardAnswers = {
  marketType?: string
  asset?: string
  experience?: string
  style?: string
  marketCondition?: string
  timeframe?: string
  tradeFrequency?: string
  holding?: string
  decisionStyle?: string
  screenTime?: string
  alertStrength?: string
  alertWindow?: string
  invalidationAlerts?: string
  signalExpectation?: string
  // Fields from wizard-config.ts steps 7-10 (previously collected but unscored)
  trendConfirmation?: string
  retestPreference?: string
  stopStructure?: string
  rewardProfile?: string
}

export type SavedStrategy = {
  id: string
  userId: string
  customName: string
  marketType: MarketType
  asset: string
  bundle: StrategyBundle
  timeframe: string
  alertStrength: AlertStrength
  confidenceScore: number
  secondaryBundle?: StrategyBundle | null
  wizardAnswers: WizardAnswers
  isActive: boolean
  createdAt: string
  stats: {
    alertsFired: number
    wins: number
    losses: number
    pushes: number
    winRatio: number
  }
}
