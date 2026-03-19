"use client"

import { TradeAlert, getCompletedAlerts, getAllAlerts } from "./storage"

// ============ TYPES ============

export interface SetupPerformance {
  setupType: string
  totalTrades: number
  wins: number
  losses: number
  partials: number
  winRate: number
  averageRR: number
  totalR: number
}

export interface AssetPerformance {
  symbol: string
  totalTrades: number
  wins: number
  losses: number
  winRate: number
  averageRR: number
  bestSetupType: string
}

export interface ConditionPerformance {
  condition: string
  totalTrades: number
  wins: number
  winRate: number
  averageRR: number
  bestPerformingSetups: string[]
}

export interface TimeframePerformance {
  timeframe: string
  totalTrades: number
  wins: number
  winRate: number
  averageRR: number
}

export interface StrategyInsight {
  type: "strength" | "weakness" | "opportunity" | "tip"
  title: string
  description: string
  metric?: string
  setupType?: string
}

export interface PerformanceReport {
  totalSignals: number
  completedTrades: number
  overallWinRate: number
  overallAverageRR: number
  totalRGained: number
  bySetupType: SetupPerformance[]
  byAsset: AssetPerformance[]
  byCondition: ConditionPerformance[]
  byTimeframe: TimeframePerformance[]
  insights: StrategyInsight[]
  topPerformers: SetupPerformance[]
  weakPerformers: SetupPerformance[]
}

// ============ ANALYTICS FUNCTIONS ============

export function calculateSetupPerformance(alerts: TradeAlert[]): SetupPerformance[] {
  const bySetup = new Map<string, TradeAlert[]>()
  
  alerts.forEach(alert => {
    if (!alert.result) return
    const key = alert.setupType || "Unknown"
    if (!bySetup.has(key)) bySetup.set(key, [])
    bySetup.get(key)!.push(alert)
  })
  
  const results: SetupPerformance[] = []
  
  bySetup.forEach((trades, setupType) => {
    const wins = trades.filter(t => t.result?.outcome === "win").length
    const losses = trades.filter(t => t.result?.outcome === "loss").length
    const partials = trades.filter(t => t.result?.outcome === "partial").length
    const totalR = trades.reduce((sum, t) => sum + (t.result?.rewardAchieved || 0), 0)
    const avgRR = trades.length > 0 ? totalR / trades.length : 0
    
    results.push({
      setupType,
      totalTrades: trades.length,
      wins,
      losses,
      partials,
      winRate: trades.length > 0 ? Math.round((wins / trades.length) * 100) : 0,
      averageRR: Math.round(avgRR * 10) / 10,
      totalR: Math.round(totalR * 10) / 10,
    })
  })
  
  return results.sort((a, b) => b.totalTrades - a.totalTrades)
}

export function calculateAssetPerformance(alerts: TradeAlert[]): AssetPerformance[] {
  const byAsset = new Map<string, TradeAlert[]>()
  
  alerts.forEach(alert => {
    if (!alert.result) return
    const key = alert.symbol
    if (!byAsset.has(key)) byAsset.set(key, [])
    byAsset.get(key)!.push(alert)
  })
  
  const results: AssetPerformance[] = []
  
  byAsset.forEach((trades, symbol) => {
    const wins = trades.filter(t => t.result?.outcome === "win").length
    const losses = trades.filter(t => t.result?.outcome === "loss").length
    const totalR = trades.reduce((sum, t) => sum + (t.result?.rewardAchieved || 0), 0)
    const avgRR = trades.length > 0 ? totalR / trades.length : 0
    
    // Find best setup type for this asset
    const setupCounts = new Map<string, number>()
    trades.filter(t => t.result?.outcome === "win").forEach(t => {
      const st = t.setupType || "Unknown"
      setupCounts.set(st, (setupCounts.get(st) || 0) + 1)
    })
    const bestSetup = Array.from(setupCounts.entries())
      .sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A"
    
    results.push({
      symbol,
      totalTrades: trades.length,
      wins,
      losses,
      winRate: trades.length > 0 ? Math.round((wins / trades.length) * 100) : 0,
      averageRR: Math.round(avgRR * 10) / 10,
      bestSetupType: bestSetup,
    })
  })
  
  return results.sort((a, b) => b.totalTrades - a.totalTrades)
}

export function calculateConditionPerformance(alerts: TradeAlert[]): ConditionPerformance[] {
  const byCondition = new Map<string, TradeAlert[]>()
  
  alerts.forEach(alert => {
    if (!alert.result || !alert.marketCondition) return
    const key = alert.marketCondition
    if (!byCondition.has(key)) byCondition.set(key, [])
    byCondition.get(key)!.push(alert)
  })
  
  const results: ConditionPerformance[] = []
  
  byCondition.forEach((trades, condition) => {
    const wins = trades.filter(t => t.result?.outcome === "win").length
    const totalR = trades.reduce((sum, t) => sum + (t.result?.rewardAchieved || 0), 0)
    const avgRR = trades.length > 0 ? totalR / trades.length : 0
    
    // Find best performing setups in this condition
    const setupPerf = new Map<string, { wins: number; total: number }>()
    trades.forEach(t => {
      const st = t.setupType || "Unknown"
      if (!setupPerf.has(st)) setupPerf.set(st, { wins: 0, total: 0 })
      const perf = setupPerf.get(st)!
      perf.total++
      if (t.result?.outcome === "win") perf.wins++
    })
    
    const bestSetups = Array.from(setupPerf.entries())
      .filter(([, perf]) => perf.total >= 2 && perf.wins / perf.total >= 0.5)
      .sort((a, b) => (b[1].wins / b[1].total) - (a[1].wins / a[1].total))
      .slice(0, 3)
      .map(([name]) => name)
    
    results.push({
      condition,
      totalTrades: trades.length,
      wins,
      winRate: trades.length > 0 ? Math.round((wins / trades.length) * 100) : 0,
      averageRR: Math.round(avgRR * 10) / 10,
      bestPerformingSetups: bestSetups,
    })
  })
  
  return results.sort((a, b) => b.winRate - a.winRate)
}

export function calculateTimeframePerformance(alerts: TradeAlert[]): TimeframePerformance[] {
  const byTimeframe = new Map<string, TradeAlert[]>()
  
  alerts.forEach(alert => {
    if (!alert.result) return
    const key = alert.timeframe
    if (!byTimeframe.has(key)) byTimeframe.set(key, [])
    byTimeframe.get(key)!.push(alert)
  })
  
  const results: TimeframePerformance[] = []
  
  byTimeframe.forEach((trades, timeframe) => {
    const wins = trades.filter(t => t.result?.outcome === "win").length
    const totalR = trades.reduce((sum, t) => sum + (t.result?.rewardAchieved || 0), 0)
    const avgRR = trades.length > 0 ? totalR / trades.length : 0
    
    results.push({
      timeframe,
      totalTrades: trades.length,
      wins,
      winRate: trades.length > 0 ? Math.round((wins / trades.length) * 100) : 0,
      averageRR: Math.round(avgRR * 10) / 10,
    })
  })
  
  return results.sort((a, b) => b.totalTrades - a.totalTrades)
}

export function generateInsights(report: Omit<PerformanceReport, "insights">): StrategyInsight[] {
  const insights: StrategyInsight[] = []
  
  // Top performer insight
  if (report.topPerformers.length > 0) {
    const top = report.topPerformers[0]
    insights.push({
      type: "strength",
      title: `${top.setupType} is your strongest setup`,
      description: `With a ${top.winRate}% win rate and ${top.averageRR}R average, this setup type performs best in your strategy.`,
      metric: `${top.winRate}% win rate`,
      setupType: top.setupType,
    })
  }
  
  // Weak performer insight
  if (report.weakPerformers.length > 0) {
    const weak = report.weakPerformers[0]
    if (weak.winRate < 40 && weak.totalTrades >= 3) {
      insights.push({
        type: "weakness",
        title: `Consider adjusting ${weak.setupType} signals`,
        description: `This setup type has a ${weak.winRate}% win rate. You may want to require additional confirmation or skip these signals.`,
        metric: `${weak.winRate}% win rate`,
        setupType: weak.setupType,
      })
    }
  }
  
  // Best condition insight
  if (report.byCondition.length > 0) {
    const bestCondition = report.byCondition[0]
    if (bestCondition.winRate >= 50) {
      insights.push({
        type: "opportunity",
        title: `${bestCondition.condition} markets favor your strategy`,
        description: `Your signals perform best in ${bestCondition.condition} conditions with a ${bestCondition.winRate}% win rate.`,
        metric: `${bestCondition.winRate}% in ${bestCondition.condition}`,
      })
    }
  }
  
  // Risk/reward tip
  if (report.overallAverageRR >= 1.5) {
    insights.push({
      type: "tip",
      title: "Strong risk-to-reward discipline",
      description: `Your average R:R of ${report.overallAverageRR} means you can be profitable even with a lower win rate.`,
      metric: `${report.overallAverageRR}R average`,
    })
  }
  
  return insights
}

// ============ MAIN REPORT GENERATOR ============

export function generatePerformanceReport(): PerformanceReport {
  const allAlerts = getAllAlerts()
  const completedAlerts = getCompletedAlerts()
  
  const bySetupType = calculateSetupPerformance(completedAlerts)
  const byAsset = calculateAssetPerformance(completedAlerts)
  const byCondition = calculateConditionPerformance(completedAlerts)
  const byTimeframe = calculateTimeframePerformance(completedAlerts)
  
  // Calculate overall metrics
  const wins = completedAlerts.filter(a => a.result?.outcome === "win").length
  const totalR = completedAlerts.reduce((sum, a) => sum + (a.result?.rewardAchieved || 0), 0)
  
  // Sort for top/weak performers (min 2 trades)
  const qualifiedSetups = bySetupType.filter(s => s.totalTrades >= 2)
  const topPerformers = [...qualifiedSetups].sort((a, b) => {
    // Sort by win rate, then by total R
    if (b.winRate !== a.winRate) return b.winRate - a.winRate
    return b.totalR - a.totalR
  }).slice(0, 3)
  
  const weakPerformers = [...qualifiedSetups].sort((a, b) => {
    if (a.winRate !== b.winRate) return a.winRate - b.winRate
    return a.totalR - b.totalR
  }).slice(0, 3)
  
  const baseReport = {
    totalSignals: allAlerts.length,
    completedTrades: completedAlerts.length,
    overallWinRate: completedAlerts.length > 0 ? Math.round((wins / completedAlerts.length) * 100) : 0,
    overallAverageRR: completedAlerts.length > 0 ? Math.round((totalR / completedAlerts.length) * 10) / 10 : 0,
    totalRGained: Math.round(totalR * 10) / 10,
    bySetupType,
    byAsset,
    byCondition,
    byTimeframe,
    topPerformers,
    weakPerformers,
  }
  
  return {
    ...baseReport,
    insights: generateInsights(baseReport),
  }
}

// ============ DEMO DATA FOR DISPLAY ============

export function generateDemoReport(): PerformanceReport {
  return {
    totalSignals: 47,
    completedTrades: 32,
    overallWinRate: 56,
    overallAverageRR: 1.8,
    totalRGained: 12.4,
    bySetupType: [
      { setupType: "Break + Retest", totalTrades: 12, wins: 8, losses: 3, partials: 1, winRate: 67, averageRR: 2.1, totalR: 8.4 },
      { setupType: "Breakout", totalTrades: 10, wins: 5, losses: 4, partials: 1, winRate: 50, averageRR: 2.3, totalR: 4.6 },
      { setupType: "Trend Continuation", totalTrades: 6, wins: 4, losses: 2, partials: 0, winRate: 67, averageRR: 1.6, totalR: 3.2 },
      { setupType: "Liquidity Sweep", totalTrades: 4, wins: 1, losses: 3, partials: 0, winRate: 25, averageRR: 0.8, totalR: -1.8 },
    ],
    byAsset: [
      { symbol: "BTC", totalTrades: 14, wins: 8, losses: 6, winRate: 57, averageRR: 1.9, bestSetupType: "Break + Retest" },
      { symbol: "ETH", totalTrades: 8, wins: 5, losses: 3, winRate: 63, averageRR: 1.7, bestSetupType: "Trend Continuation" },
      { symbol: "SPY", totalTrades: 6, wins: 3, losses: 3, winRate: 50, averageRR: 2.0, bestSetupType: "Breakout" },
      { symbol: "SOL", totalTrades: 4, wins: 2, losses: 2, winRate: 50, averageRR: 1.5, bestSetupType: "Break + Retest" },
    ],
    byCondition: [
      { condition: "compression", totalTrades: 8, wins: 6, winRate: 75, averageRR: 2.4, bestPerformingSetups: ["Breakout", "Break + Retest"] },
      { condition: "trending", totalTrades: 14, wins: 8, winRate: 57, averageRR: 1.8, bestPerformingSetups: ["Trend Continuation", "Break + Retest"] },
      { condition: "ranging", totalTrades: 6, wins: 3, winRate: 50, averageRR: 1.4, bestPerformingSetups: ["Range Bounce"] },
      { condition: "volatile", totalTrades: 4, wins: 1, winRate: 25, averageRR: 0.6, bestPerformingSetups: [] },
    ],
    byTimeframe: [
      { timeframe: "15m", totalTrades: 18, wins: 10, winRate: 56, averageRR: 1.9 },
      { timeframe: "1h", totalTrades: 10, wins: 6, winRate: 60, averageRR: 1.7 },
      { timeframe: "4h", totalTrades: 4, wins: 2, winRate: 50, averageRR: 2.1 },
    ],
    topPerformers: [
      { setupType: "Break + Retest", totalTrades: 12, wins: 8, losses: 3, partials: 1, winRate: 67, averageRR: 2.1, totalR: 8.4 },
      { setupType: "Trend Continuation", totalTrades: 6, wins: 4, losses: 2, partials: 0, winRate: 67, averageRR: 1.6, totalR: 3.2 },
      { setupType: "Breakout", totalTrades: 10, wins: 5, losses: 4, partials: 1, winRate: 50, averageRR: 2.3, totalR: 4.6 },
    ],
    weakPerformers: [
      { setupType: "Liquidity Sweep", totalTrades: 4, wins: 1, losses: 3, partials: 0, winRate: 25, averageRR: 0.8, totalR: -1.8 },
    ],
    insights: [
      {
        type: "strength",
        title: "Break + Retest is your strongest setup",
        description: "With a 67% win rate and 2.1R average, this setup type performs best in your strategy.",
        metric: "67% win rate",
        setupType: "Break + Retest",
      },
      {
        type: "weakness",
        title: "Consider adjusting Liquidity Sweep signals",
        description: "This setup type has a 25% win rate. You may want to require additional confirmation or skip these signals.",
        metric: "25% win rate",
        setupType: "Liquidity Sweep",
      },
      {
        type: "opportunity",
        title: "Compression markets favor your strategy",
        description: "Your signals perform best in compression conditions with a 75% win rate.",
        metric: "75% in compression",
      },
      {
        type: "tip",
        title: "Strong risk-to-reward discipline",
        description: "Your average R:R of 1.8 means you can be profitable even with a lower win rate.",
        metric: "1.8R average",
      },
    ],
  }
}
