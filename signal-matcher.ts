// Signal matching logic - matches incoming signals to user preferences

export interface Signal {
  symbol: string
  action: "BUY" | "SELL"
  entry: number
  stop: number
  target: number
  timeframe: string
  pattern: string
  timestamp: string
}

export interface UserPreferences {
  markets: string[]
  behavior: string
  patterns: string[]
  activityLevel: string
  timeframe: string
  alertHours: string
  riskPreference: string
}

export interface MatchResult {
  matches: boolean
  reasons: string[]
  score: number // 0-100 match quality
}

// Check if a signal matches a user's preferences
export function matchSignalToUser(signal: Signal, preferences: UserPreferences): MatchResult {
  const reasons: string[] = []
  let score = 0
  const maxScore = 100

  // 1. Market match (required)
  const normalizedSymbol = normalizeSymbol(signal.symbol)
  const marketMatch = preferences.markets.some(
    (m) => normalizeSymbol(m) === normalizedSymbol
  )
  
  if (!marketMatch) {
    return { matches: false, reasons: ["Market not in user's watchlist"], score: 0 }
  }
  score += 30
  reasons.push(`Market match: ${normalizedSymbol}`)

  // 2. Pattern match (if user has pattern preferences)
  if (preferences.patterns.length > 0) {
    const patternMatch = preferences.patterns.some(
      (p) => signal.pattern.toLowerCase().includes(p.toLowerCase()) ||
             p.toLowerCase().includes(signal.pattern.toLowerCase())
    )
    if (patternMatch) {
      score += 25
      reasons.push(`Pattern match: ${signal.pattern}`)
    } else {
      // Pattern doesn't match but user selected "Let SightLine scan all"
      score += 10
      reasons.push(`Pattern: ${signal.pattern} (not prioritized)`)
    }
  } else {
    // User wants all patterns
    score += 25
    reasons.push(`Pattern accepted: ${signal.pattern}`)
  }

  // 3. Timeframe match
  const timeframeMatch = matchTimeframe(signal.timeframe, preferences.timeframe)
  if (timeframeMatch) {
    score += 20
    reasons.push(`Timeframe match: ${signal.timeframe}`)
  } else {
    score += 5
    reasons.push(`Timeframe: ${signal.timeframe} (different from preferred)`)
  }

  // 4. Activity level filter
  const activityMatch = matchActivityLevel(signal, preferences.activityLevel)
  if (activityMatch) {
    score += 15
    reasons.push(`Activity level compatible`)
  }

  // 5. Alert hours check
  const hoursMatch = checkAlertHours(preferences.alertHours)
  if (!hoursMatch) {
    return { matches: false, reasons: ["Outside user's alert hours"], score: 0 }
  }
  score += 10
  reasons.push(`Within alert hours`)

  return {
    matches: score >= 50, // Minimum 50% match required
    reasons,
    score: Math.min(score, maxScore),
  }
}

// Normalize symbol names
function normalizeSymbol(symbol: string): string {
  const mapping: Record<string, string> = {
    "BTCUSD": "BTC", "BTCUSDT": "BTC", "BTC/USD": "BTC",
    "ETHUSD": "ETH", "ETHUSDT": "ETH", "ETH/USD": "ETH",
    "SOLUSD": "SOL", "SOLUSDT": "SOL", "SOL/USD": "SOL",
    "ES": "ES", "ES1!": "ES",
    "NQ": "NQ", "NQ1!": "NQ",
  }
  const upper = symbol.toUpperCase()
  return mapping[upper] || upper
}

// Match timeframes
function matchTimeframe(signalTF: string, userTF: string): boolean {
  const normalize = (tf: string) => tf.toLowerCase().replace(/\s/g, "")
  const signalNorm = normalize(signalTF)
  const userNorm = normalize(userTF)
  
  // Direct match
  if (signalNorm === userNorm) return true
  
  // Flexible matching (e.g., "1h" matches "1 hour")
  const equivalents: Record<string, string[]> = {
    "15m": ["15min", "15minute", "15minutes"],
    "1h": ["1hour", "1hr", "60m", "60min"],
    "4h": ["4hour", "4hr", "240m"],
    "daily": ["1d", "day", "d"],
  }
  
  for (const [key, values] of Object.entries(equivalents)) {
    if ((signalNorm === key || values.includes(signalNorm)) &&
        (userNorm === key || values.includes(userNorm))) {
      return true
    }
  }
  
  return false
}

// Check if signal matches activity level
function matchActivityLevel(signal: Signal, level: string): boolean {
  // Calculate signal "intensity" based on risk/reward and volatility
  const risk = Math.abs(signal.entry - signal.stop)
  const riskPercent = (risk / signal.entry) * 100
  
  switch (level) {
    case "Conservative":
      return riskPercent <= 1.5 // Lower risk signals only
    case "Balanced":
      return riskPercent <= 3 // Medium risk acceptable
    case "Aggressive":
      return true // All signals
    default:
      return true
  }
}

// Check if current time is within user's alert hours
function checkAlertHours(alertHours: string): boolean {
  if (alertHours === "24/7") return true
  
  // Market hours check (9:30 AM - 4:00 PM ET)
  const now = new Date()
  const etHour = now.toLocaleString("en-US", { 
    timeZone: "America/New_York", 
    hour: "numeric", 
    hour12: false 
  })
  const hour = parseInt(etHour)
  
  // Market hours: 9:30 AM - 4:00 PM ET
  return hour >= 9 && hour < 16
}

// Filter multiple users for a signal
export function findMatchingUsers<T extends { preferences: UserPreferences }>(
  signal: Signal,
  users: T[]
): Array<T & { matchResult: MatchResult }> {
  return users
    .map((user) => ({
      ...user,
      matchResult: matchSignalToUser(signal, user.preferences),
    }))
    .filter((user) => user.matchResult.matches)
    .sort((a, b) => b.matchResult.score - a.matchResult.score)
}
