"use client"

import { UserProfile, IncomingSignal, createAlert, getAllProfiles, SignalQuality } from "./storage"
import { scoreSignal, passesStrictnessFilter, SignalType, SignalScore } from "./signal-scoring"
import { isSignalAllowed, MarketCondition } from "./market-condition"

// Signal matching engine - matches incoming TradingView signals to user profiles
// Implements the 4-layer SightLine signal system

interface MatchResult {
  userId: string
  profile: UserProfile
  matchScore: number
  matchReasons: string[]
}

interface ProcessResult {
  alertsCreated: number
  matchedUsers: string[]
  grade?: string
  score?: number
  reasons?: string[]
  filtered?: boolean
  filterReason?: string
}

// Map user-friendly market names to symbols
const MARKET_SYMBOL_MAP: Record<string, string[]> = {
  "Bitcoin (BTC)": ["BTC", "BTCUSD", "BTCUSDT", "XBTUSD"],
  "Ethereum (ETH)": ["ETH", "ETHUSD", "ETHUSDT"],
  "Solana (SOL)": ["SOL", "SOLUSD", "SOLUSDT"],
  "S&P 500 (SPY)": ["SPY", "ES", "SPX", "SP500"],
  "NASDAQ (QQQ)": ["QQQ", "NQ", "NDX", "NASDAQ"],
  "Gold (GLD)": ["GLD", "GOLD", "XAUUSD", "GC"],
  "Tesla (TSLA)": ["TSLA"],
  "Apple (AAPL)": ["AAPL"],
  "NVIDIA (NVDA)": ["NVDA"],
}

// Map timeframe labels to common formats
const TIMEFRAME_MAP: Record<string, string[]> = {
  "1 minute": ["1", "1m", "1min"],
  "5 minute": ["5", "5m", "5min"],
  "15 minute": ["15", "15m", "15min"],
  "1 hour": ["60", "1h", "1H", "60min"],
  "4 hour": ["240", "4h", "4H"],
  "Daily": ["D", "1D", "daily"],
}

// Map setup types to signal types
const SETUP_TYPE_TO_SIGNAL_TYPE: Record<string, SignalType> = {
  "breakout": "breakout",
  "break_retest": "break_retest",
  "break+retest": "break_retest",
  "support": "support_hold",
  "support_hold": "support_hold",
  "resistance": "resistance_rejection",
  "resistance_rejection": "resistance_rejection",
  "trend": "trend_continuation",
  "trend_continuation": "trend_continuation",
  "pullback": "trend_continuation",
  "vwap_reclaim": "vwap_reclaim",
  "vwap_rejection": "vwap_rejection",
  "liquidity": "liquidity_sweep",
  "liquidity_sweep": "liquidity_sweep",
  "orb": "opening_range_breakout",
  "opening_range": "opening_range_breakout",
  "range": "range_bounce",
  "range_bounce": "range_bounce",
  "compression": "compression_breakout",
  "compression_breakout": "compression_breakout",
  "failed_breakout": "failed_breakout",
  "trap": "failed_breakout",
  "reversal": "failed_breakout",
}

function normalizeSymbol(symbol: string): string {
  return symbol.toUpperCase().replace(/[^A-Z0-9]/g, "")
}

function normalizeTimeframe(tf: string): string {
  return tf.toLowerCase().replace(/[^a-z0-9]/g, "")
}

function doesMarketMatch(userMarkets: string[], signalSymbol: string): boolean {
  const normalizedSignal = normalizeSymbol(signalSymbol)
  
  for (const market of userMarkets) {
    const symbols = MARKET_SYMBOL_MAP[market] || [market]
    for (const sym of symbols) {
      if (normalizeSymbol(sym) === normalizedSignal || normalizedSignal.includes(normalizeSymbol(sym))) {
        return true
      }
    }
  }
  
  return false
}

function doesTimeframeMatch(userTimeframe: string, signalTimeframe: string): boolean {
  const validTimeframes = TIMEFRAME_MAP[userTimeframe] || [userTimeframe]
  const normalizedSignal = normalizeTimeframe(signalTimeframe)
  
  return validTimeframes.some(tf => normalizeTimeframe(tf) === normalizedSignal)
}

function calculateRiskReward(entry: number, stopLoss: number, target: number, direction: "BUY" | "SELL"): number {
  const risk = Math.abs(entry - stopLoss)
  const reward = direction === "BUY" ? target - entry : entry - target
  return risk > 0 ? Math.abs(reward / risk) : 0
}

export function matchSignalToProfiles(signal: IncomingSignal): MatchResult[] {
  const profiles = getAllProfiles()
  const matches: MatchResult[] = []
  
  for (const profile of profiles) {
    const matchReasons: string[] = []
    let matchScore = 0
    
    // Check market match (required)
    if (doesMarketMatch(profile.markets, signal.symbol)) {
      matchReasons.push(`Market: ${signal.symbol}`)
      matchScore += 40
    } else {
      continue
    }
    
    // Check timeframe match (required)
    if (doesTimeframeMatch(profile.preferredTimeframe, signal.timeframe)) {
      matchReasons.push(`Timeframe: ${signal.timeframe}`)
      matchScore += 30
    } else {
      continue
    }
    
    // Check risk/reward meets minimum
    const rr = calculateRiskReward(signal.entry, signal.stopLoss, signal.target1, signal.direction)
    if (rr >= 1.5) {
      matchReasons.push(`Risk/Reward: ${rr.toFixed(1)}R`)
      matchScore += 10
    }
    
    if (matchScore >= 70) {
      matches.push({
        userId: profile.id,
        profile,
        matchScore,
        matchReasons,
      })
    }
  }
  
  return matches.sort((a, b) => b.matchScore - a.matchScore)
}

/**
 * Process an incoming signal through the 4-layer system:
 * 1. Market condition detection
 * 2. Signal type validation for condition
 * 3. Signal scoring with confirmation matrix
 * 4. Grade assignment and filtering
 */
export function processIncomingSignal(signal: IncomingSignal & {
  signalType?: SignalType
  marketCondition?: MarketCondition
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
}): ProcessResult {
  
  // Get signal type from setup type or use provided
  const rawSetupType = (signal.setupType || "breakout").toLowerCase().replace(/ /g, "_")
  const signalType: SignalType = signal.signalType || SETUP_TYPE_TO_SIGNAL_TYPE[rawSetupType] || "breakout"
  
  // Get market condition (default to ranging if not provided)
  const marketCondition: MarketCondition = signal.marketCondition || "ranging"
  
  // LAYER 2: Check if signal type is allowed in market condition
  if (!isSignalAllowed(signalType, marketCondition)) {
    return {
      alertsCreated: 0,
      matchedUsers: [],
      filtered: true,
      filterReason: `Signal type "${signalType.replace(/_/g, " ")}" is not allowed in "${marketCondition.replace(/_/g, " ")}" market conditions`,
    }
  }
  
  // LAYER 3 & 4: Score the signal
  const scoreInput = {
    signalType,
    direction: signal.direction === "BUY" ? "LONG" as const : "SHORT" as const,
    entry: signal.entry,
    stopLoss: signal.stopLoss,
    target1: signal.target1,
    target2: signal.target2,
    currentPrice: signal.entry,
    marketCondition,
    trendAligned: signal.trendAligned ?? false,
    htfAligned: signal.htfAligned ?? false,
    volumeExpansion: signal.volumeExpansion ?? false,
    cleanBreak: signal.cleanBreak ?? true, // Default true for breakouts
    retestHeld: signal.retestHeld ?? false,
    rejectionCandle: signal.rejectionCandle ?? false,
    momentumStrong: signal.momentumStrong ?? false,
    vwapReclaimed: signal.vwapReclaimed ?? false,
    liquiditySweep: signal.liquiditySweep ?? false,
    compressionDetected: signal.compressionDetected ?? false,
  }
  
  const signalScore = scoreSignal(scoreInput)
  
  // Check minimum grade threshold
  if (signalScore.grade === "NONE") {
    return {
      alertsCreated: 0,
      matchedUsers: [],
      grade: "NONE",
      score: signalScore.totalScore,
      reasons: [],
      filtered: true,
      filterReason: `Signal score too low (${signalScore.totalScore}/${signalScore.maxScore}) - minimum 4 points required`,
    }
  }
  
  // Match to user profiles
  const matches = matchSignalToProfiles(signal)
  const matchedUsers: string[] = []
  
  // Default strictness is "balanced" (A and B grades)
  const defaultStrictness = "balanced" as const
  
  // Check if signal passes strictness filter
  if (!passesStrictnessFilter(signalScore.grade, defaultStrictness)) {
    return {
      alertsCreated: 0,
      matchedUsers: [],
      grade: signalScore.grade,
      score: signalScore.totalScore,
      reasons: signalScore.qualifyingReasons,
      filtered: true,
      filterReason: `Grade ${signalScore.grade} filtered by "balanced" mode (only A and B grades shown)`,
    }
  }
  
  // Create alerts for matched users
  for (const match of matches) {
    const rr = calculateRiskReward(signal.entry, signal.stopLoss, signal.target1, signal.direction)
    
    // Build quality object for storage
    const quality: SignalQuality = {
      grade: signalScore.grade as "A" | "B" | "C",
      score: signalScore.totalScore,
      reasons: signalScore.qualifyingReasons,
      breakdown: {
        trendAligned: signal.trendAligned ?? false,
        higherTimeframeAligned: signal.htfAligned ?? false,
        cleanStructure: signal.cleanBreak ?? false,
        volumeConfirmation: signal.volumeExpansion ?? false,
        goodEntryLocation: true,
        minimumRRAvailable: rr >= 2,
        clearInvalidation: true,
      },
    }
    
    createAlert({
      userId: match.userId,
      symbol: signal.symbol,
      timeframe: signal.timeframe,
      direction: signal.direction,
      entry: signal.entry,
      stopLoss: signal.stopLoss,
      target1: signal.target1,
      target2: signal.target2,
      riskReward: `${rr.toFixed(1)}R`,
      setupType: signalScore.signalTypeDisplay,
      quality,
    })
    
    matchedUsers.push(match.profile.email)
  }
  
  return {
    alertsCreated: matches.length,
    matchedUsers,
    grade: signalScore.grade,
    score: signalScore.totalScore,
    reasons: signalScore.qualifyingReasons,
    filtered: false,
  }
}

// Validate incoming signal data
export function validateSignal(data: unknown): { valid: boolean; signal?: IncomingSignal; error?: string } {
  if (!data || typeof data !== "object") {
    return { valid: false, error: "Invalid signal data" }
  }
  
  const obj = data as Record<string, unknown>
  
  if (!obj.symbol || typeof obj.symbol !== "string") {
    return { valid: false, error: "Missing or invalid symbol" }
  }
  if (!obj.timeframe || typeof obj.timeframe !== "string") {
    return { valid: false, error: "Missing or invalid timeframe" }
  }
  if (!obj.direction || !["BUY", "SELL", "buy", "sell", "long", "short", "LONG", "SHORT"].includes(String(obj.direction))) {
    return { valid: false, error: "Missing or invalid direction (BUY/SELL)" }
  }
  if (typeof obj.entry !== "number" || isNaN(obj.entry)) {
    return { valid: false, error: "Missing or invalid entry price" }
  }
  if (typeof obj.stopLoss !== "number" || isNaN(obj.stopLoss)) {
    return { valid: false, error: "Missing or invalid stop loss" }
  }
  if (typeof obj.target1 !== "number" || isNaN(obj.target1)) {
    return { valid: false, error: "Missing or invalid target1" }
  }
  
  const dirRaw = String(obj.direction).toUpperCase()
  const direction: "BUY" | "SELL" = ["BUY", "LONG"].includes(dirRaw) ? "BUY" : "SELL"
  
  const signal: IncomingSignal = {
    symbol: String(obj.symbol),
    timeframe: String(obj.timeframe),
    direction,
    entry: Number(obj.entry),
    stopLoss: Number(obj.stopLoss),
    target1: Number(obj.target1),
    target2: obj.target2 ? Number(obj.target2) : undefined,
    setupType: obj.setupType ? String(obj.setupType) : "standard",
    timestamp: obj.timestamp ? String(obj.timestamp) : new Date().toISOString(),
  }
  
  return { valid: true, signal }
}
