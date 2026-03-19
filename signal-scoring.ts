/**
 * LAYER 3 & 4: SIGNAL CONFIRMATION MATRIX + SCORING
 * Each signal type has its own confirmation checklist and scoring system.
 */

import { MarketCondition, MarketAnalysis } from "./market-condition"

export type SignalType =
  | "breakout"
  | "break_retest"
  | "support_hold"
  | "resistance_rejection"
  | "trend_continuation"
  | "vwap_reclaim"
  | "vwap_rejection"
  | "liquidity_sweep"
  | "opening_range_breakout"
  | "range_bounce"
  | "compression_breakout"
  | "failed_breakout"

export type SignalGrade = "A" | "B" | "C" | "NONE"

export interface SignalConfirmation {
  name: string
  met: boolean
  points: number
  category: "primary" | "secondary" | "quality"
}

export interface SignalScore {
  grade: SignalGrade
  totalScore: number
  maxScore: number
  confirmations: SignalConfirmation[]
  qualifyingReasons: string[]
  signalType: SignalType
  signalTypeDisplay: string
}

export interface SignalInput {
  signalType: SignalType
  direction: "LONG" | "SHORT"
  entry: number
  stopLoss: number
  target1: number
  target2?: number
  currentPrice: number
  marketCondition: MarketCondition
  // Optional confirmations from external source (TradingView)
  trendAligned?: boolean
  htfAligned?: boolean
  volumeExpansion?: boolean
  cleanBreak?: boolean
  retestHeld?: boolean
  rejectionCandle?: boolean
  momentumStrong?: boolean
  vwapReclaimed?: boolean
  liquiditySweep?: boolean
  compressionDetected?: boolean
}

/**
 * Calculate Risk-Reward Ratio
 */
function calculateRR(entry: number, stopLoss: number, target: number, direction: "LONG" | "SHORT"): number {
  const risk = Math.abs(entry - stopLoss)
  const reward = direction === "LONG" 
    ? target - entry 
    : entry - target
  
  if (risk === 0) return 0
  return Math.round((reward / risk) * 10) / 10
}

/**
 * Check if minimum 2R is available
 */
function has2RAvailable(entry: number, stopLoss: number, target: number, direction: "LONG" | "SHORT"): boolean {
  return calculateRR(entry, stopLoss, target, direction) >= 2
}

/**
 * Check if entry is at a good location (not extended)
 */
function hasGoodEntry(entry: number, stopLoss: number, currentPrice: number, direction: "LONG" | "SHORT"): boolean {
  const risk = Math.abs(entry - stopLoss)
  const distanceFromEntry = Math.abs(currentPrice - entry)
  
  // Entry is good if current price is within 30% of the risk distance from entry
  return distanceFromEntry <= risk * 0.3
}

/**
 * Signal type display names
 */
const SIGNAL_TYPE_NAMES: Record<SignalType, string> = {
  breakout: "Breakout",
  break_retest: "Break + Retest",
  support_hold: "Support Hold",
  resistance_rejection: "Resistance Rejection",
  trend_continuation: "Trend Continuation",
  vwap_reclaim: "VWAP Reclaim",
  vwap_rejection: "VWAP Rejection",
  liquidity_sweep: "Liquidity Sweep",
  opening_range_breakout: "Opening Range Breakout",
  range_bounce: "Range Bounce",
  compression_breakout: "Compression Breakout",
  failed_breakout: "Failed Breakout Reversal"
}

/**
 * Score a BREAKOUT signal
 */
function scoreBreakout(input: SignalInput): SignalConfirmation[] {
  const rr = calculateRR(input.entry, input.stopLoss, input.target1, input.direction)
  
  return [
    { name: "Trend aligned", met: input.trendAligned ?? false, points: 2, category: "primary" },
    { name: "Higher timeframe aligned", met: input.htfAligned ?? false, points: 2, category: "primary" },
    { name: "Clean level break", met: input.cleanBreak ?? false, points: 2, category: "primary" },
    { name: "Volume expansion", met: input.volumeExpansion ?? false, points: 1, category: "secondary" },
    { name: "Good entry location", met: hasGoodEntry(input.entry, input.stopLoss, input.currentPrice, input.direction), points: 1, category: "quality" },
    { name: "Minimum 2R available", met: has2RAvailable(input.entry, input.stopLoss, input.target1, input.direction), points: 1, category: "quality" },
    { name: "Clear stop location", met: Math.abs(input.entry - input.stopLoss) > 0, points: 1, category: "quality" }
  ]
}

/**
 * Score a BREAK + RETEST signal
 */
function scoreBreakRetest(input: SignalInput): SignalConfirmation[] {
  return [
    { name: "Trend aligned", met: input.trendAligned ?? false, points: 2, category: "primary" },
    { name: "Higher timeframe aligned", met: input.htfAligned ?? false, points: 2, category: "primary" },
    { name: "Break confirmed", met: input.cleanBreak ?? false, points: 2, category: "primary" },
    { name: "Retest holds structure", met: input.retestHeld ?? false, points: 2, category: "primary" },
    { name: "Volume support during retest", met: input.volumeExpansion ?? false, points: 1, category: "secondary" },
    { name: "Minimum 2R available", met: has2RAvailable(input.entry, input.stopLoss, input.target1, input.direction), points: 1, category: "quality" }
  ]
}

/**
 * Score a SUPPORT HOLD signal
 */
function scoreSupportHold(input: SignalInput): SignalConfirmation[] {
  return [
    { name: "Support level respected", met: true, points: 2, category: "primary" }, // Assumed if signal fires
    { name: "Trend aligned", met: input.trendAligned ?? false, points: 2, category: "primary" },
    { name: "Higher timeframe aligned", met: input.htfAligned ?? false, points: 2, category: "primary" },
    { name: "Strong rejection candle", met: input.rejectionCandle ?? false, points: 1, category: "secondary" },
    { name: "Minimum 2R available", met: has2RAvailable(input.entry, input.stopLoss, input.target1, input.direction), points: 1, category: "quality" },
    { name: "Clear stop location", met: Math.abs(input.entry - input.stopLoss) > 0, points: 1, category: "quality" }
  ]
}

/**
 * Score a RESISTANCE REJECTION signal
 */
function scoreResistanceRejection(input: SignalInput): SignalConfirmation[] {
  return [
    { name: "Rejection confirmed", met: input.rejectionCandle ?? false, points: 2, category: "primary" },
    { name: "Higher timeframe resistance", met: input.htfAligned ?? false, points: 2, category: "primary" },
    { name: "Trend neutral or down", met: input.trendAligned ?? false, points: 2, category: "primary" },
    { name: "Volume spike", met: input.volumeExpansion ?? false, points: 1, category: "secondary" },
    { name: "Good entry location", met: hasGoodEntry(input.entry, input.stopLoss, input.currentPrice, input.direction), points: 1, category: "quality" },
    { name: "Minimum 2R available", met: has2RAvailable(input.entry, input.stopLoss, input.target1, input.direction), points: 1, category: "quality" }
  ]
}

/**
 * Score a TREND CONTINUATION signal
 */
function scoreTrendContinuation(input: SignalInput): SignalConfirmation[] {
  return [
    { name: "Trend strong", met: input.trendAligned ?? false, points: 2, category: "primary" },
    { name: "Higher timeframe aligned", met: input.htfAligned ?? false, points: 2, category: "primary" },
    { name: "Pullback holds support", met: input.retestHeld ?? false, points: 2, category: "primary" },
    { name: "Momentum resumes", met: input.momentumStrong ?? false, points: 1, category: "secondary" },
    { name: "Good entry location", met: hasGoodEntry(input.entry, input.stopLoss, input.currentPrice, input.direction), points: 1, category: "quality" },
    { name: "Minimum 2R available", met: has2RAvailable(input.entry, input.stopLoss, input.target1, input.direction), points: 1, category: "quality" }
  ]
}

/**
 * Score a VWAP RECLAIM signal
 */
function scoreVWAPReclaim(input: SignalInput): SignalConfirmation[] {
  return [
    { name: "VWAP reclaim confirmed", met: input.vwapReclaimed ?? false, points: 2, category: "primary" },
    { name: "Trend aligned", met: input.trendAligned ?? false, points: 2, category: "primary" },
    { name: "Higher timeframe aligned", met: input.htfAligned ?? false, points: 2, category: "primary" },
    { name: "Volume expansion", met: input.volumeExpansion ?? false, points: 1, category: "secondary" },
    { name: "Clean entry", met: hasGoodEntry(input.entry, input.stopLoss, input.currentPrice, input.direction), points: 1, category: "quality" },
    { name: "Minimum 2R available", met: has2RAvailable(input.entry, input.stopLoss, input.target1, input.direction), points: 1, category: "quality" }
  ]
}

/**
 * Score a VWAP REJECTION signal
 */
function scoreVWAPRejection(input: SignalInput): SignalConfirmation[] {
  return [
    { name: "VWAP rejection confirmed", met: input.rejectionCandle ?? false, points: 2, category: "primary" },
    { name: "Trend aligned", met: input.trendAligned ?? false, points: 2, category: "primary" },
    { name: "Higher timeframe aligned", met: input.htfAligned ?? false, points: 2, category: "primary" },
    { name: "Momentum shift", met: input.momentumStrong ?? false, points: 1, category: "secondary" },
    { name: "Entry quality", met: hasGoodEntry(input.entry, input.stopLoss, input.currentPrice, input.direction), points: 1, category: "quality" },
    { name: "Minimum 2R available", met: has2RAvailable(input.entry, input.stopLoss, input.target1, input.direction), points: 1, category: "quality" }
  ]
}

/**
 * Score a LIQUIDITY SWEEP signal
 */
function scoreLiquiditySweep(input: SignalInput): SignalConfirmation[] {
  return [
    { name: "Liquidity sweep detected", met: input.liquiditySweep ?? false, points: 3, category: "primary" },
    { name: "Strong rejection", met: input.rejectionCandle ?? false, points: 2, category: "primary" },
    { name: "Higher timeframe level present", met: input.htfAligned ?? false, points: 2, category: "primary" },
    { name: "Volume spike", met: input.volumeExpansion ?? false, points: 1, category: "secondary" },
    { name: "Minimum 2R available", met: has2RAvailable(input.entry, input.stopLoss, input.target1, input.direction), points: 1, category: "quality" },
    { name: "Clear stop location", met: Math.abs(input.entry - input.stopLoss) > 0, points: 1, category: "quality" }
  ]
}

/**
 * Score an OPENING RANGE BREAKOUT signal
 */
function scoreOpeningRangeBreakout(input: SignalInput): SignalConfirmation[] {
  return [
    { name: "Opening range break", met: input.cleanBreak ?? false, points: 2, category: "primary" },
    { name: "Volume expansion", met: input.volumeExpansion ?? false, points: 2, category: "primary" },
    { name: "Trend aligned", met: input.trendAligned ?? false, points: 2, category: "primary" },
    { name: "Higher timeframe bias aligned", met: input.htfAligned ?? false, points: 1, category: "secondary" },
    { name: "Entry quality", met: hasGoodEntry(input.entry, input.stopLoss, input.currentPrice, input.direction), points: 1, category: "quality" },
    { name: "Minimum 2R available", met: has2RAvailable(input.entry, input.stopLoss, input.target1, input.direction), points: 1, category: "quality" }
  ]
}

/**
 * Score a RANGE BOUNCE signal
 */
function scoreRangeBounce(input: SignalInput): SignalConfirmation[] {
  return [
    { name: "Range boundary respected", met: true, points: 2, category: "primary" }, // Assumed if signal fires
    { name: "Rejection candle", met: input.rejectionCandle ?? false, points: 2, category: "primary" },
    { name: "Higher timeframe neutral", met: input.htfAligned ?? false, points: 2, category: "primary" },
    { name: "Entry quality", met: hasGoodEntry(input.entry, input.stopLoss, input.currentPrice, input.direction), points: 1, category: "quality" },
    { name: "Minimum 2R available", met: has2RAvailable(input.entry, input.stopLoss, input.target1, input.direction), points: 1, category: "quality" },
    { name: "Clear stop location", met: Math.abs(input.entry - input.stopLoss) > 0, points: 1, category: "quality" }
  ]
}

/**
 * Score a COMPRESSION BREAKOUT signal
 */
function scoreCompressionBreakout(input: SignalInput): SignalConfirmation[] {
  return [
    { name: "Compression detected", met: input.compressionDetected ?? false, points: 2, category: "primary" },
    { name: "Break confirmed", met: input.cleanBreak ?? false, points: 2, category: "primary" },
    { name: "Volume expansion", met: input.volumeExpansion ?? false, points: 2, category: "primary" },
    { name: "Momentum strong", met: input.momentumStrong ?? false, points: 1, category: "secondary" },
    { name: "Entry quality", met: hasGoodEntry(input.entry, input.stopLoss, input.currentPrice, input.direction), points: 1, category: "quality" },
    { name: "Minimum 2R available", met: has2RAvailable(input.entry, input.stopLoss, input.target1, input.direction), points: 1, category: "quality" }
  ]
}

/**
 * Score a FAILED BREAKOUT signal
 */
function scoreFailedBreakout(input: SignalInput): SignalConfirmation[] {
  return [
    { name: "Failed breakout detected", met: input.cleanBreak ?? false, points: 3, category: "primary" },
    { name: "Momentum reversal", met: input.momentumStrong ?? false, points: 2, category: "primary" },
    { name: "Higher timeframe S/R present", met: input.htfAligned ?? false, points: 2, category: "primary" },
    { name: "Volume spike", met: input.volumeExpansion ?? false, points: 1, category: "secondary" },
    { name: "Entry quality", met: hasGoodEntry(input.entry, input.stopLoss, input.currentPrice, input.direction), points: 1, category: "quality" },
    { name: "Clear stop location", met: Math.abs(input.entry - input.stopLoss) > 0, points: 1, category: "quality" }
  ]
}

/**
 * Get the scoring function for a signal type
 */
function getScoringFunction(signalType: SignalType): (input: SignalInput) => SignalConfirmation[] {
  const scorers: Record<SignalType, (input: SignalInput) => SignalConfirmation[]> = {
    breakout: scoreBreakout,
    break_retest: scoreBreakRetest,
    support_hold: scoreSupportHold,
    resistance_rejection: scoreResistanceRejection,
    trend_continuation: scoreTrendContinuation,
    vwap_reclaim: scoreVWAPReclaim,
    vwap_rejection: scoreVWAPRejection,
    liquidity_sweep: scoreLiquiditySweep,
    opening_range_breakout: scoreOpeningRangeBreakout,
    range_bounce: scoreRangeBounce,
    compression_breakout: scoreCompressionBreakout,
    failed_breakout: scoreFailedBreakout
  }
  
  return scorers[signalType] || scoreBreakout
}

/**
 * Convert score to grade
 */
function scoreToGrade(score: number): SignalGrade {
  if (score >= 8) return "A"
  if (score >= 6) return "B"
  if (score >= 4) return "C"
  return "NONE"
}

/**
 * Main function: Score a signal
 */
export function scoreSignal(input: SignalInput): SignalScore {
  const scoringFn = getScoringFunction(input.signalType)
  const confirmations = scoringFn(input)
  
  const totalScore = confirmations
    .filter(c => c.met)
    .reduce((sum, c) => sum + c.points, 0)
  
  const maxScore = confirmations.reduce((sum, c) => sum + c.points, 0)
  const grade = scoreToGrade(totalScore)
  
  // Build qualifying reasons from met confirmations
  const qualifyingReasons = confirmations
    .filter(c => c.met)
    .map(c => c.name)
  
  return {
    grade,
    totalScore,
    maxScore,
    confirmations,
    qualifyingReasons,
    signalType: input.signalType,
    signalTypeDisplay: SIGNAL_TYPE_NAMES[input.signalType]
  }
}

/**
 * Check if signal passes the user's strictness filter
 */
export function passesStrictnessFilter(grade: SignalGrade, strictness: "conservative" | "balanced" | "active"): boolean {
  switch (strictness) {
    case "conservative":
      return grade === "A"
    case "balanced":
      return grade === "A" || grade === "B"
    case "active":
      return grade === "A" || grade === "B" || grade === "C"
    default:
      return false
  }
}

/**
 * Format signal output for display
 */
export function formatSignalOutput(
  symbol: string,
  direction: "LONG" | "SHORT",
  score: SignalScore,
  entry: number,
  stopLoss: number,
  target1: number,
  target2?: number
): {
  asset: string
  direction: string
  signalType: string
  grade: SignalGrade
  entry: number
  stopLoss: number
  target1: number
  target2?: number
  riskReward: string
  qualifyingReasons: string[]
} {
  const rr = calculateRR(entry, stopLoss, target1, direction)
  
  return {
    asset: symbol,
    direction: direction,
    signalType: score.signalTypeDisplay,
    grade: score.grade,
    entry,
    stopLoss,
    target1,
    target2,
    riskReward: `${rr}R`,
    qualifyingReasons: score.qualifyingReasons
  }
}
