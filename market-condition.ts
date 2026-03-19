/**
 * LAYER 1: MARKET CONDITION DETECTOR
 * Detects the current market environment before allowing signals.
 */

export type MarketCondition = "trending_up" | "trending_down" | "ranging" | "compression" | "volatile"

export interface MarketAnalysis {
  condition: MarketCondition
  confidence: number // 0-100
  indicators: {
    ema20: number
    ema50: number
    atr: number
    atrPercent: number
    recentHigh: number
    recentLow: number
    supportLevel: number
    resistanceLevel: number
  }
  details: string[]
}

export interface PriceData {
  open: number
  high: number
  low: number
  close: number
  volume: number
  timestamp: number
}

/**
 * Calculates EMA (Exponential Moving Average)
 */
function calculateEMA(prices: number[], period: number): number {
  if (prices.length < period) return prices[prices.length - 1]
  
  const multiplier = 2 / (period + 1)
  let ema = prices.slice(0, period).reduce((a, b) => a + b, 0) / period
  
  for (let i = period; i < prices.length; i++) {
    ema = (prices[i] - ema) * multiplier + ema
  }
  
  return ema
}

/**
 * Calculates ATR (Average True Range)
 */
function calculateATR(candles: PriceData[], period: number = 14): number {
  if (candles.length < 2) return 0
  
  const trueRanges: number[] = []
  
  for (let i = 1; i < candles.length; i++) {
    const high = candles[i].high
    const low = candles[i].low
    const prevClose = candles[i - 1].close
    
    const tr = Math.max(
      high - low,
      Math.abs(high - prevClose),
      Math.abs(low - prevClose)
    )
    trueRanges.push(tr)
  }
  
  if (trueRanges.length < period) {
    return trueRanges.reduce((a, b) => a + b, 0) / trueRanges.length
  }
  
  return trueRanges.slice(-period).reduce((a, b) => a + b, 0) / period
}

/**
 * Finds support and resistance levels
 */
function findSupportResistance(candles: PriceData[], lookback: number = 20): { support: number; resistance: number } {
  const recentCandles = candles.slice(-lookback)
  const lows = recentCandles.map(c => c.low)
  const highs = recentCandles.map(c => c.high)
  
  return {
    support: Math.min(...lows),
    resistance: Math.max(...highs)
  }
}

/**
 * Checks for higher highs / higher lows pattern (uptrend)
 */
function isUptrend(candles: PriceData[], lookback: number = 10): boolean {
  if (candles.length < lookback) return false
  
  const recent = candles.slice(-lookback)
  let higherHighs = 0
  let higherLows = 0
  
  for (let i = 1; i < recent.length; i++) {
    if (recent[i].high > recent[i - 1].high) higherHighs++
    if (recent[i].low > recent[i - 1].low) higherLows++
  }
  
  return higherHighs > lookback * 0.6 && higherLows > lookback * 0.5
}

/**
 * Checks for lower highs / lower lows pattern (downtrend)
 */
function isDowntrend(candles: PriceData[], lookback: number = 10): boolean {
  if (candles.length < lookback) return false
  
  const recent = candles.slice(-lookback)
  let lowerHighs = 0
  let lowerLows = 0
  
  for (let i = 1; i < recent.length; i++) {
    if (recent[i].high < recent[i - 1].high) lowerHighs++
    if (recent[i].low < recent[i - 1].low) lowerLows++
  }
  
  return lowerHighs > lookback * 0.6 && lowerLows > lookback * 0.5
}

/**
 * Checks if ATR is contracting (compression)
 */
function isATRContracting(candles: PriceData[]): boolean {
  if (candles.length < 28) return false
  
  const recentATR = calculateATR(candles.slice(-14), 14)
  const olderATR = calculateATR(candles.slice(-28, -14), 14)
  
  return recentATR < olderATR * 0.7 // ATR contracted by 30%+
}

/**
 * Checks if ATR is expanding (volatile)
 */
function isATRExpanding(candles: PriceData[]): boolean {
  if (candles.length < 28) return false
  
  const recentATR = calculateATR(candles.slice(-14), 14)
  const olderATR = calculateATR(candles.slice(-28, -14), 14)
  
  return recentATR > olderATR * 1.5 // ATR expanded by 50%+
}

/**
 * Checks if price is ranging (oscillating between S/R)
 */
function isRanging(candles: PriceData[], ema20: number, ema50: number): boolean {
  const { support, resistance } = findSupportResistance(candles)
  const range = resistance - support
  const currentPrice = candles[candles.length - 1].close
  
  // EMAs should be relatively flat (within 1% of each other)
  const emaSpread = Math.abs(ema20 - ema50) / ema50
  const isEMAFlat = emaSpread < 0.01
  
  // Price should be bouncing within range
  const priceInRange = currentPrice > support + range * 0.1 && currentPrice < resistance - range * 0.1
  
  return isEMAFlat && priceInRange
}

/**
 * Main function: Detect current market condition
 */
export function detectMarketCondition(candles: PriceData[]): MarketAnalysis {
  if (candles.length < 50) {
    // Not enough data, return neutral
    return {
      condition: "ranging",
      confidence: 50,
      indicators: {
        ema20: 0,
        ema50: 0,
        atr: 0,
        atrPercent: 0,
        recentHigh: 0,
        recentLow: 0,
        supportLevel: 0,
        resistanceLevel: 0
      },
      details: ["Insufficient data for analysis"]
    }
  }
  
  const closes = candles.map(c => c.close)
  const currentPrice = closes[closes.length - 1]
  
  const ema20 = calculateEMA(closes, 20)
  const ema50 = calculateEMA(closes, 50)
  const atr = calculateATR(candles)
  const atrPercent = (atr / currentPrice) * 100
  const { support, resistance } = findSupportResistance(candles)
  
  const indicators = {
    ema20,
    ema50,
    atr,
    atrPercent,
    recentHigh: Math.max(...candles.slice(-10).map(c => c.high)),
    recentLow: Math.min(...candles.slice(-10).map(c => c.low)),
    supportLevel: support,
    resistanceLevel: resistance
  }
  
  const details: string[] = []
  let condition: MarketCondition = "ranging"
  let confidence = 50
  
  // Check for compression first (narrowing ATR)
  if (isATRContracting(candles)) {
    condition = "compression"
    confidence = 75
    details.push("ATR contracting - consolidation forming")
    details.push("Candle ranges tightening")
  }
  // Check for volatile (expanding ATR)
  else if (isATRExpanding(candles)) {
    condition = "volatile"
    confidence = 80
    details.push("ATR expanding - high volatility")
    details.push("Large candle ranges detected")
  }
  // Check for uptrend
  else if (ema20 > ema50 * 1.005 && isUptrend(candles)) {
    condition = "trending_up"
    confidence = 85
    details.push("20 EMA above 50 EMA")
    details.push("Higher highs and higher lows forming")
  }
  // Check for downtrend
  else if (ema20 < ema50 * 0.995 && isDowntrend(candles)) {
    condition = "trending_down"
    confidence = 85
    details.push("20 EMA below 50 EMA")
    details.push("Lower highs and lower lows forming")
  }
  // Check for ranging
  else if (isRanging(candles, ema20, ema50)) {
    condition = "ranging"
    confidence = 70
    details.push("Price oscillating between support and resistance")
    details.push("EMAs relatively flat")
  }
  else {
    condition = "ranging"
    confidence = 50
    details.push("No clear directional bias")
  }
  
  return {
    condition,
    confidence,
    indicators,
    details
  }
}

/**
 * Get allowed signal types for current market condition
 */
export function getAllowedSignalTypes(condition: MarketCondition): string[] {
  switch (condition) {
    case "trending_up":
    case "trending_down":
      return [
        "breakout",
        "break_retest",
        "trend_continuation",
        "vwap_reclaim",
        "vwap_rejection",
        "compression_breakout",
        "opening_range_breakout"  // ORB is valid in trending conditions
      ]
    
    case "ranging":
      return [
        "range_bounce",
        "resistance_rejection",
        "support_hold",
        "liquidity_sweep",
        "failed_breakout"
      ]
    
    case "compression":
      return [
        "compression_breakout",
        "breakout",
        "break_retest",
        "opening_range_breakout"  // compression before open = prime ORB condition
      ]
    
    case "volatile":
      return [
        "liquidity_sweep",
        "failed_breakout",
        "breakout" // momentum breakout
      ]
    
    default:
      return []
  }
}

/**
 * Check if a signal type is allowed in current market condition
 */
export function isSignalAllowed(signalType: string, condition: MarketCondition): boolean {
  const allowed = getAllowedSignalTypes(condition)
  return allowed.includes(signalType.toLowerCase().replace(/ /g, "_"))
}
