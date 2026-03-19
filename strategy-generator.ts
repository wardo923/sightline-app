// Strategy Answer Types for 12-step wizard
export interface StrategyAnswers {
  strategyName: string
  market: string
  assets: string
  customAssets: string
  duration: string
  setupType: string
  strictness: string
  trendConfirmation: string
  waitForRetest: string
  stopMethod: string
  rewardTarget: string
  signalFrequency: string
  delivery: string
}

// Engine Profile - Hidden settings derived from answers
export interface EngineProfile {
  execTF: number
  htfTF: string
  emaFast: number
  emaSlow: number
  lookback: number
  requireTrend: boolean
  requireRetest: boolean
  requireVolSpike: boolean
  requireVolExpansion: boolean
  atrLen: number
  atrMultSL: number
  rr: number
  oneTradeOnly: boolean
  minGrade: string
  frequencyGate: string
  marketSessions: string
  assetsResolved: string[]
}

// Strategy Config - User-facing summary
export interface StrategyConfig {
  strategyName: string
  engine: string
  timeframe: string
  stopModel: string
  strictness: string
  trendFilter: boolean
  targets: number
  riskProfile: string
  estimatedTradesPerDay: string
  market: string
  delivery: string
  assets: string[]
}

// Full export structure
export interface StrategyExport {
  plan: "Basic" | "Pro"
  answers: StrategyAnswers
  engineProfile: EngineProfile
  config: StrategyConfig
}

// Default strategy answers
export const defaultStrategyAnswers: StrategyAnswers = {
  strategyName: "",
  market: "",
  assets: "",
  customAssets: "",
  duration: "",
  setupType: "",
  strictness: "",
  trendConfirmation: "",
  waitForRetest: "",
  stopMethod: "",
  rewardTarget: "",
  signalFrequency: "",
  delivery: "",
}

// Pro-only options
export const PRO_OPTIONS = {
  market: ["Both"],
  assets: ["Custom List"],
  strictness: ["Aggressive"],
  signalFrequency: ["Frequent"],
  delivery: ["Telegram"],
}

// Check if an option requires Pro
export function requiresPro(field: keyof typeof PRO_OPTIONS, value: string): boolean {
  return PRO_OPTIONS[field]?.includes(value) || false
}

// Asset presets
const ASSET_PRESETS: Record<string, string[]> = {
  "BTC/ETH": ["BTC", "ETH"],
  "Top Crypto": ["BTC", "ETH", "SOL", "XRP", "ADA", "DOGE"],
  "SPY/QQQ": ["SPY", "QQQ"],
}

// Resolve assets from selection
function resolveAssets(assets: string, customAssets: string): string[] {
  if (assets === "Custom List" && customAssets) {
    return customAssets.split(",").map((a) => a.trim().toUpperCase()).filter(Boolean)
  }
  return ASSET_PRESETS[assets] || []
}

// Generate Engine Profile from wizard answers
export function generateEngineProfile(answers: StrategyAnswers): EngineProfile {
  // Execution timeframe based on duration
  let execTF = 15
  let htfTF = "60"
  if (answers.duration === "Fast") {
    execTF = 5
    htfTF = "60"
  } else if (answers.duration === "Intraday") {
    execTF = 15
    htfTF = "240"
  } else if (answers.duration === "Swing") {
    execTF = 60
    htfTF = "D"
  }

  // Lookback based on strictness and setup type
  let lookback = 20
  if (answers.strictness === "Conservative") {
    lookback = 30
  } else if (answers.strictness === "Aggressive") {
    lookback = 10
  }
  if (answers.setupType === "Breakouts") {
    lookback += 5
  } else if (answers.setupType === "Reversals") {
    lookback += 10
  }

  // Volume requirements based on strictness
  const requireVolSpike = answers.strictness === "Balanced" || answers.strictness === "Aggressive"
  const requireVolExpansion = answers.strictness === "Aggressive"

  // ATR stop multiplier based on stop method and duration
  let atrMultSL = 1.5
  if (answers.stopMethod === "ATR") {
    atrMultSL = answers.duration === "Fast" ? 1.0 : answers.duration === "Swing" ? 2.0 : 1.5
  } else if (answers.stopMethod === "Structure") {
    atrMultSL = answers.duration === "Fast" ? 1.2 : answers.duration === "Swing" ? 2.5 : 1.8
  }

  // Reward target
  let rr = 2
  if (answers.rewardTarget === "1.5R") rr = 1.5
  else if (answers.rewardTarget === "2R") rr = 2
  else if (answers.rewardTarget === "3R") rr = 3

  // Minimum grade based on strictness
  let minGrade = "A"
  if (answers.strictness === "Conservative") minGrade = "A+"
  else if (answers.strictness === "Balanced") minGrade = "A"
  else if (answers.strictness === "Aggressive") minGrade = "B"

  // Frequency gate
  let frequencyGate = "normal"
  if (answers.signalFrequency === "Few") frequencyGate = "tight"
  else if (answers.signalFrequency === "Balanced") frequencyGate = "normal"
  else if (answers.signalFrequency === "Frequent") frequencyGate = "loose"

  // Market sessions
  let marketSessions = "RTH"
  if (answers.market === "Crypto" || answers.market === "Both") {
    marketSessions = "24/7"
  }

  return {
    execTF,
    htfTF,
    emaFast: 50,
    emaSlow: 200,
    lookback,
    requireTrend: answers.trendConfirmation === "Yes",
    requireRetest: answers.waitForRetest === "Yes",
    requireVolSpike,
    requireVolExpansion,
    atrLen: 14,
    atrMultSL,
    rr,
    oneTradeOnly: true,
    minGrade,
    frequencyGate,
    marketSessions,
    assetsResolved: resolveAssets(answers.assets, answers.customAssets),
  }
}

// Strategy engine mapping
const STRATEGY_ENGINES: Record<string, string> = {
  Breakouts: "Breakout Engine",
  Pullbacks: "Pullback Continuation",
  Reversals: "Reversal Engine",
}

// Generate user-facing strategy config
export function generateStrategy(answers: StrategyAnswers): StrategyConfig {
  const engine = STRATEGY_ENGINES[answers.setupType] || "Breakout Engine"

  // Map duration to timeframe
  let timeframe = "15m"
  if (answers.duration === "Fast") timeframe = "5m"
  else if (answers.duration === "Intraday") timeframe = "15m"
  else if (answers.duration === "Swing") timeframe = "1H-4H"

  // Estimated trades per day
  let estimatedTradesPerDay = "2-4"
  if (answers.signalFrequency === "Few") estimatedTradesPerDay = "1-2"
  else if (answers.signalFrequency === "Balanced") estimatedTradesPerDay = "2-4"
  else if (answers.signalFrequency === "Frequent") estimatedTradesPerDay = "5-8"

  return {
    strategyName: answers.strategyName || "My Strategy",
    engine,
    timeframe,
    stopModel: answers.stopMethod || "ATR",
    strictness: answers.strictness || "Balanced",
    trendFilter: answers.trendConfirmation === "Yes",
    targets: answers.rewardTarget === "1.5R" ? 1 : answers.rewardTarget === "3R" ? 3 : 2,
    riskProfile: answers.strictness || "Balanced",
    estimatedTradesPerDay,
    market: answers.market,
    delivery: answers.delivery,
    assets: resolveAssets(answers.assets, answers.customAssets),
  }
}

// Get recommended plan based on strategy
export function getRecommendedPlan(answers: StrategyAnswers): "Basic" | "Pro" {
  if (
    requiresPro("market", answers.market) ||
    requiresPro("assets", answers.assets) ||
    requiresPro("strictness", answers.strictness) ||
    requiresPro("signalFrequency", answers.signalFrequency) ||
    requiresPro("delivery", answers.delivery)
  ) {
    return "Pro"
  }
  return "Basic"
}

// Generate full export object
export function generateStrategyExport(answers: StrategyAnswers, plan: "Basic" | "Pro"): StrategyExport {
  return {
    plan,
    answers,
    engineProfile: generateEngineProfile(answers),
    config: generateStrategy(answers),
  }
}
