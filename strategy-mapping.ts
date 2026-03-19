// SightLine Strategy Mapping Logic
// Converts wizard answers into Strategy Profile for Signal Engine
// Uses scoring system to determine primary strategy type

import { SightlineSetup } from "./wizard-questions"

// Strategy codes as defined in spec
export const STRATEGY_CODES = {
  BREAKOUT: 1,
  PULLBACK: 2,
  LEVELS: 3,
  REVERSAL: 4,
} as const

export type StrategyCode = (typeof STRATEGY_CODES)[keyof typeof STRATEGY_CODES]

export const STRATEGY_NAMES: Record<StrategyCode, string> = {
  1: "Breakout",
  2: "Pullback",
  3: "Support / Resistance",
  4: "Reversal",
}

export type Selectivity = "Standard" | "High Selectivity"

export type StrategyProfile = {
  // Core strategy identifiers (from scoring)
  strategyCode: StrategyCode
  strategyName: string
  selectivity: Selectivity
  
  // User info
  firstName: string
  
  // Preferences from wizard
  preferredAsset: string
  preferredTimeframe: string
  alertFrequency: string
  alertDelivery: string[]
  setupPreference: string
  
  // Legacy fields for backward compatibility
  market: string
  asset: string
  tradingPace: string
  behaviorPreference: string
  alertSelectivity: string
  monitoringSchedule: string
  notificationPreferences: string[]
  dailyMarketBriefEnabled: boolean
  enabledSetups: SightlineSetup[]
  secondarySetups: SightlineSetup[]
  disabledSetups: SightlineSetup[]
  primaryTimeframes: string[]
  filterProfile: "Strict" | "Moderate" | "Flexible"
  alertFrequencyProfile: "Low" | "Medium" | "Higher"
  sessionPriority: string
}

export type WizardAnswers = {
  market: string
  asset: string
  tradingPace: string
  behaviorPreference: string
  alertSelectivity: string
  monitoringSchedule: string
  notificationPreferences: string[]
  dailyMarketBrief: string
  riskUnderstanding?: boolean
  alertUnderstanding?: boolean
}

// STEP 3: Strategy Scoring
// Calculate scores based on wizard answers
function calculateStrategyScores(answers: WizardAnswers): {
  breakoutScore: number
  pullbackScore: number
  levelsScore: number
  reversalScore: number
} {
  let breakoutScore = 0
  let pullbackScore = 0
  let levelsScore = 0
  let reversalScore = 0

  // Setup Preference scoring
  switch (answers.behaviorPreference) {
    case "Breakouts":
      breakoutScore += 3
      break
    case "Pullbacks":
      pullbackScore += 3
      break
    case "Range Structure":
      levelsScore += 3
      break
    case "Trend Continuation":
      // Trend continuation can be both breakout and pullback
      breakoutScore += 1
      pullbackScore += 2
      break
  }

  // Trading Pace influence
  switch (answers.tradingPace) {
    case "Fast Intraday":
      // Active pace increases breakout score
      breakoutScore += 1
      break
    case "Balanced Intraday":
      // Balanced increases pullback and levels scores
      pullbackScore += 1
      levelsScore += 1
      break
    case "Swing Monitoring":
      // Selective/patient increases reversal and levels scores
      reversalScore += 1
      levelsScore += 1
      break
  }

  // Alert Selectivity influence
  switch (answers.alertSelectivity) {
    case "High Selectivity":
      // High selectivity favors reversal and levels (patient setups)
      reversalScore += 1
      levelsScore += 1
      break
    case "Expanded Coverage":
      // Expanded coverage favors breakout and pullback (more signals)
      breakoutScore += 1
      pullbackScore += 1
      break
    // "Balanced" doesn't add any additional scores
  }

  return { breakoutScore, pullbackScore, levelsScore, reversalScore }
}

// Determine strategy code from scores
function determineStrategyCode(scores: {
  breakoutScore: number
  pullbackScore: number
  levelsScore: number
  reversalScore: number
}): StrategyCode {
  const { breakoutScore, pullbackScore, levelsScore, reversalScore } = scores

  // Find highest score
  const maxScore = Math.max(breakoutScore, pullbackScore, levelsScore, reversalScore)

  // Assign strategy code based on highest score
  // In case of tie, prioritize in order: Breakout > Pullback > Levels > Reversal
  if (breakoutScore === maxScore) return STRATEGY_CODES.BREAKOUT
  if (pullbackScore === maxScore) return STRATEGY_CODES.PULLBACK
  if (levelsScore === maxScore) return STRATEGY_CODES.LEVELS
  return STRATEGY_CODES.REVERSAL
}

// STEP 4: Selectivity Assignment
function determineSelectivity(answers: WizardAnswers): Selectivity {
  // If user chooses "High Selectivity" OR indicates preference for fewer alerts
  if (
    answers.alertSelectivity === "High Selectivity"
  ) {
    return "High Selectivity"
  }
  return "Standard"
}

// A. BEHAVIOR PREFERENCE MAPPING (legacy support)
function mapBehaviorToSetups(behaviorPreference: string): {
  enabled: SightlineSetup[]
  secondary: SightlineSetup[]
  disabled: SightlineSetup[]
} {
  switch (behaviorPreference) {
    case "Breakouts":
      return {
        enabled: ["Breakout Structure", "Range Compression"],
        secondary: ["Trend Continuation"],
        disabled: ["Pullback Into Support", "Support Resistance Reaction", "Liquidity Sweep Reversal"],
      }
    case "Pullbacks":
      return {
        enabled: ["Pullback Into Support", "Support Resistance Reaction"],
        secondary: ["Trend Continuation"],
        disabled: ["Breakout Structure", "Range Compression", "Liquidity Sweep Reversal"],
      }
    case "Range Structure":
      return {
        enabled: ["Range Compression", "Liquidity Sweep Reversal", "Support Resistance Reaction"],
        secondary: ["Breakout Structure"],
        disabled: ["Trend Continuation", "Pullback Into Support"],
      }
    case "Trend Continuation":
      return {
        enabled: ["Trend Continuation", "Pullback Into Support"],
        secondary: ["Breakout Structure"],
        disabled: ["Range Compression", "Liquidity Sweep Reversal"],
      }
    default:
      return {
        enabled: ["Breakout Structure", "Trend Continuation"],
        secondary: ["Pullback Into Support"],
        disabled: ["Range Compression", "Liquidity Sweep Reversal", "Support Resistance Reaction"],
      }
  }
}

// B. TRADING PACE TO TIMEFRAME MAPPING
function mapTradingPaceToTimeframes(tradingPace: string): string[] {
  switch (tradingPace) {
    case "Fast Intraday":
      return ["5 Minute", "15 Minute"]
    case "Balanced Intraday":
      return ["15 Minute", "1 Hour"]
    case "Swing Monitoring":
      return ["1 Hour", "4 Hour"]
    default:
      return ["15 Minute", "1 Hour"]
  }
}

// Get primary timeframe string for display
function getPrimaryTimeframe(tradingPace: string): string {
  switch (tradingPace) {
    case "Fast Intraday":
      return "5m"
    case "Balanced Intraday":
      return "15m"
    case "Swing Monitoring":
      return "1H"
    default:
      return "15m"
  }
}

// C. ALERT SELECTIVITY MAPPING
function mapAlertSelectivity(alertSelectivity: string): {
  filterProfile: "Strict" | "Moderate" | "Flexible"
  alertFrequencyProfile: "Low" | "Medium" | "Higher"
} {
  switch (alertSelectivity) {
    case "High Selectivity":
      return { filterProfile: "Strict", alertFrequencyProfile: "Low" }
    case "Balanced":
      return { filterProfile: "Moderate", alertFrequencyProfile: "Medium" }
    case "Expanded Coverage":
      return { filterProfile: "Flexible", alertFrequencyProfile: "Higher" }
    default:
      return { filterProfile: "Moderate", alertFrequencyProfile: "Medium" }
  }
}

// D. MONITORING SCHEDULE MAPPING
function mapMonitoringSchedule(
  monitoringSchedule: string,
  market: string
): { sessionPriority: string; boostSetups: SightlineSetup[] } {
  switch (monitoringSchedule) {
    case "Market Open Focus":
      return {
        sessionPriority: "First 90 Minutes",
        boostSetups: ["Breakout Structure", "Range Compression"],
      }
    case "All Day Monitoring":
      return {
        sessionPriority: market === "Crypto" ? "Active Hours" : "Full Session",
        boostSetups: [],
      }
    case "Market Close Focus":
      return {
        sessionPriority: "Final Session Window",
        boostSetups: ["Trend Continuation", "Support Resistance Reaction"],
      }
    case "24 Hour Monitoring":
      return {
        sessionPriority: "Continuous",
        boostSetups: [],
      }
    default:
      return {
        sessionPriority: "Full Session",
        boostSetups: [],
      }
  }
}

// Main mapping function - generates complete Strategy Profile
export function generateStrategyProfile(answers: WizardAnswers, firstName: string): StrategyProfile {
  // STEP 3: Calculate strategy scores
  const scores = calculateStrategyScores(answers)
  
  // Determine strategy code from highest score
  const strategyCode = determineStrategyCode(scores)
  const strategyName = STRATEGY_NAMES[strategyCode]
  
  // STEP 4: Determine selectivity
  const selectivity = determineSelectivity(answers)

  // Map behavior preference to setups
  const setupMapping = mapBehaviorToSetups(answers.behaviorPreference)

  // Map trading pace to timeframes
  const primaryTimeframes = mapTradingPaceToTimeframes(answers.tradingPace)

  // Map alert selectivity
  const selectivityMapping = mapAlertSelectivity(answers.alertSelectivity)

  // Map monitoring schedule
  const scheduleMapping = mapMonitoringSchedule(answers.monitoringSchedule, answers.market)

  // Parse notification preferences (could be array or comma-separated string)
  const notificationPreferences = Array.isArray(answers.notificationPreferences)
    ? answers.notificationPreferences
    : typeof answers.notificationPreferences === "string"
      ? answers.notificationPreferences.split(",").map((s) => s.trim())
      : ["Dashboard Alerts"]

  return {
    // Core strategy identifiers (from scoring)
    strategyCode,
    strategyName,
    selectivity,
    
    // User info
    firstName,
    
    // New simplified fields for spec
    preferredAsset: answers.market === "Crypto" ? "Crypto" : "Stocks",
    preferredTimeframe: getPrimaryTimeframe(answers.tradingPace),
    alertFrequency: answers.alertSelectivity === "High Selectivity" ? "Fewer, stronger alerts" 
      : answers.alertSelectivity === "Expanded Coverage" ? "More opportunities" 
      : "Balanced",
    alertDelivery: notificationPreferences,
    setupPreference: answers.behaviorPreference,
    
    // Legacy fields
    market: answers.market,
    asset: answers.asset,
    tradingPace: answers.tradingPace,
    behaviorPreference: answers.behaviorPreference,
    alertSelectivity: answers.alertSelectivity,
    monitoringSchedule: answers.monitoringSchedule,
    notificationPreferences,
    dailyMarketBriefEnabled: answers.dailyMarketBrief === "Yes",
    enabledSetups: setupMapping.enabled,
    secondarySetups: setupMapping.secondary,
    disabledSetups: setupMapping.disabled,
    primaryTimeframes,
    filterProfile: selectivityMapping.filterProfile,
    alertFrequencyProfile: selectivityMapping.alertFrequencyProfile,
    sessionPriority: scheduleMapping.sessionPriority,
  }
}

// Get display-friendly setup descriptions
export function getSetupDescription(setup: SightlineSetup): string {
  const descriptions: Record<SightlineSetup, string> = {
    "Breakout Structure": "Price breaks a clearly defined support or resistance level",
    "Pullback Into Support": "Price retraces into a defined support area in an established move",
    "Range Compression": "Price compresses inside a tightening range before expansion",
    "Support Resistance Reaction": "Price reacts with clear rejection at a key level",
    "Trend Continuation": "Established trend resumes after pause or shallow retracement",
    "Liquidity Sweep Reversal": "Price sweeps beyond a clear level and reverses back",
  }
  return descriptions[setup] || setup
}

// Get alert type from strategy code (for alert filtering)
export function getAlertTypeFromStrategyCode(code: StrategyCode): string {
  switch (code) {
    case STRATEGY_CODES.BREAKOUT:
      return "BREAKOUT"
    case STRATEGY_CODES.PULLBACK:
      return "PULLBACK"
    case STRATEGY_CODES.LEVELS:
      return "LEVELS"
    case STRATEGY_CODES.REVERSAL:
      return "REVERSAL"
    default:
      return "BREAKOUT"
  }
}
