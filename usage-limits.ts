import { createClient } from "@/lib/supabase/server"
import { getPlanTier, getPlanLimits, PlanLimitConfig } from "@/lib/plan-limits"
import { PlanTier } from "@/types/strategy"

export type UsageStats = {
  signalsToday: number
  alertsToday: number
  scansToday: number
  assetsMonitored: number
}

export type UsageLimitResult = {
  tier: PlanTier
  limits: PlanLimitConfig
  usage: UsageStats
  canScan: boolean
  canGenerateSignal: boolean
  canSendAlert: boolean
  remainingSignals: number
  remainingAlerts: number
  remainingScans: number
}

// Get today's start timestamp in UTC
function getTodayStart(): string {
  const now = new Date()
  now.setUTCHours(0, 0, 0, 0)
  return now.toISOString()
}

// Get user's current usage and check against limits
// If tier is not provided, it will be fetched from the subscription
export async function checkUsageLimits(userId: string, providedTier?: PlanTier): Promise<UsageLimitResult> {
  const supabase = await createClient()
  const todayStart = getTodayStart()
  
  let tier: PlanTier = providedTier || "STARTER"
  
  // Only fetch subscription if tier not provided
  if (!providedTier) {
    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("plan, status")
      .eq("user_id", userId)
      .eq("status", "active")
      .single()
    
    tier = getPlanTier(subscription?.plan)
  }
  
  const limits = getPlanLimits(tier)
  
  // Get today's signal count
  const { count: signalsToday } = await supabase
    .from("signals")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", todayStart)
  
  // Get today's alert/notification count
  const { count: alertsToday } = await supabase
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", todayStart)
  
  // Get today's scan count (from scan_logs if exists, otherwise default to 0)
  let scansToday = 0
  try {
    const { count } = await supabase
      .from("scan_logs")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .gte("created_at", todayStart)
    scansToday = count || 0
  } catch {
    // Table may not exist yet, default to 0
    scansToday = 0
  }
  
  // Get monitored assets count from strategy
  const { data: strategy } = await supabase
    .from("strategies")
    .select("wizard_answers")
    .eq("user_id", userId)
    .single()
  
  const wizardAnswers = strategy?.wizard_answers || {}
  const assets = wizardAnswers.asset?.split(",").map((a: string) => a.trim()).filter(Boolean) || []
  
  const usage: UsageStats = {
    signalsToday: signalsToday || 0,
    alertsToday: alertsToday || 0,
    scansToday: scansToday || 0,
    assetsMonitored: assets.length,
  }
  
  const remainingSignals = Math.max(0, limits.maxSignalsPerDay - usage.signalsToday)
  const remainingAlerts = Math.max(0, limits.maxAlertsPerDay - usage.alertsToday)
  const remainingScans = Math.max(0, limits.maxScansPerDay - usage.scansToday)
  
  return {
    tier,
    limits,
    usage,
    canScan: remainingScans > 0,
    canGenerateSignal: remainingSignals > 0,
    canSendAlert: remainingAlerts > 0,
    remainingSignals,
    remainingAlerts,
    remainingScans,
  }
}

// Log a scan for rate limiting
export async function logScan(userId: string): Promise<void> {
  try {
    const supabase = await createClient()
    
    await supabase.from("scan_logs").insert({
      user_id: userId,
      created_at: new Date().toISOString(),
    })
  } catch {
    // Table may not exist yet, silently fail
    console.log("[v0] scan_logs table not available")
  }
}

// Check if user can add more assets based on their plan
export async function canAddAsset(userId: string, currentAssetCount: number): Promise<boolean> {
  const supabase = await createClient()
  
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("plan")
    .eq("user_id", userId)
    .eq("status", "active")
    .single()
  
  const tier = getPlanTier(subscription?.plan)
  const limits = getPlanLimits(tier)
  
  return currentAssetCount < limits.maxMonitoredAssets
}

// Get upgrade message based on what limit was hit
export function getUpgradeMessage(limitType: "signals" | "alerts" | "scans" | "assets" | "strategies"): string {
  const messages: Record<string, string> = {
    signals: "You've reached your daily signal limit. Upgrade to Pro or Elite for more signals.",
    alerts: "You've reached your daily alert limit. Upgrade for unlimited alerts.",
    scans: "You've reached your scan limit. Upgrade for more frequent market scans.",
    assets: "You've reached your asset monitoring limit. Upgrade to track more markets.",
    strategies: "You've reached your strategy limit. Upgrade to save more strategies.",
  }
  return messages[limitType] || "Upgrade your plan for additional features."
}
