"use client"

// Storage service - localStorage-based, structured for easy Supabase migration
// All functions mirror what would be Supabase queries

export interface UserProfile {
  id: string
  name: string
  email: string
  phone?: string
  markets: string[]
  tradingStyle: string
  preferredTimeframe: string
  setupPreference: string
  setupFrequency: string
  riskPerTrade: string
  confirmationPreference: string
  alertStyle: string
  smsEnabled: boolean
  createdAt: string
  updatedAt: string
}

export type SignalGrade = "A" | "B" | "C"
export type SignalStrictness = "conservative" | "balanced" | "active"

export interface SignalQuality {
  grade: SignalGrade
  score: number
  reasons: string[]
  breakdown: {
    trendAligned: boolean
    higherTimeframeAligned: boolean
    cleanStructure: boolean
    volumeConfirmation: boolean
    goodEntryLocation: boolean
    minimumRRAvailable: boolean
    clearInvalidation: boolean
  }
}

export interface UserSettings {
  signalStrictness: SignalStrictness
  minimumRiskReward: number
  requireHigherTimeframeConfirmation: boolean
}

export type TradeOutcome = "win" | "loss" | "partial" | "breakeven"
export type MarketConditionType = "trending" | "ranging" | "volatile" | "compression"

export interface TradeResult {
  outcome: TradeOutcome
  exitPrice: number
  rewardAchieved: number // in R multiples
  closedAt: string
  notes?: string
}

export interface TradeAlert {
  id: string
  userId: string
  symbol: string
  timeframe: string
  direction: "BUY" | "SELL"
  entry: number
  stopLoss: number
  target1: number
  target2?: number
  riskReward: string
  setupType: string
  marketCondition?: MarketConditionType
  status: "pending" | "active" | "invalidated" | "target_hit" | "stopped_out"
  quality?: SignalQuality
  result?: TradeResult
  createdAt: string
  updatedAt: string
  readAt?: string
}

export interface IncomingSignal {
  symbol: string
  timeframe: string
  direction: "BUY" | "SELL"
  entry: number
  stopLoss: number
  target1: number
  target2?: number
  setupType: string
  timestamp: string
}

// Keys
const PROFILES_KEY = "sightline_profiles"
const ALERTS_KEY = "sightline_alerts"
const CURRENT_USER_KEY = "sightline_current_user"

// SSR guard - returns true if running in browser
function isBrowser(): boolean {
  return typeof window !== "undefined"
}

// Helper to generate IDs
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

// ============ USER PROFILES ============

export function saveProfile(profile: Omit<UserProfile, "id" | "createdAt" | "updatedAt">): UserProfile | null {
  if (!isBrowser()) return null
  const profiles = getAllProfiles()
  
  const newProfile: UserProfile = {
    ...profile,
    id: generateId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  
  profiles.push(newProfile)
  localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles))
  localStorage.setItem(CURRENT_USER_KEY, newProfile.id)
  
  return newProfile
}

export function updateProfile(id: string, updates: Partial<UserProfile>): UserProfile | null {
  const profiles = getAllProfiles()
  const index = profiles.findIndex(p => p.id === id)
  
  if (index === -1) return null
  
  profiles[index] = {
    ...profiles[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  }
  
  localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles))
  return profiles[index]
}

export function getProfile(id: string): UserProfile | null {
  const profiles = getAllProfiles()
  return profiles.find(p => p.id === id) || null
}

export function getCurrentProfile(): UserProfile | null {
  if (!isBrowser()) return null
  const currentUserId = localStorage.getItem(CURRENT_USER_KEY)
  if (!currentUserId) return null
  return getProfile(currentUserId)
}

export function getAllProfiles(): UserProfile[] {
  if (!isBrowser()) return []
  const stored = localStorage.getItem(PROFILES_KEY)
  return stored ? JSON.parse(stored) : []
}

export function deleteProfile(id: string): boolean {
  const profiles = getAllProfiles()
  const filtered = profiles.filter(p => p.id !== id)
  localStorage.setItem(PROFILES_KEY, JSON.stringify(filtered))
  return filtered.length < profiles.length
}

// ============ TRADE ALERTS ============

export function createAlert(alert: Omit<TradeAlert, "id" | "createdAt" | "updatedAt" | "status">): TradeAlert | null {
  if (!isBrowser()) return null
  const alerts = getAllAlerts()
  
  const newAlert: TradeAlert = {
    ...alert,
    id: generateId(),
    status: "pending",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  
  alerts.unshift(newAlert) // Add to beginning (newest first)
  localStorage.setItem(ALERTS_KEY, JSON.stringify(alerts))
  
  // Dispatch custom event for real-time updates
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("sightline-new-alert", { detail: newAlert }))
  }
  
  return newAlert
}

export function updateAlert(id: string, updates: Partial<TradeAlert>): TradeAlert | null {
  const alerts = getAllAlerts()
  const index = alerts.findIndex(a => a.id === id)
  
  if (index === -1) return null
  
  alerts[index] = {
    ...alerts[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  }
  
  localStorage.setItem(ALERTS_KEY, JSON.stringify(alerts))
  return alerts[index]
}

export function markAlertAsRead(id: string): TradeAlert | null {
  return updateAlert(id, { readAt: new Date().toISOString() })
}

export function markAllAlertsAsRead(userId: string): void {
  const alerts = getAllAlerts()
  const now = new Date().toISOString()
  
  alerts.forEach(alert => {
    if (alert.userId === userId && !alert.readAt) {
      alert.readAt = now
      alert.updatedAt = now
    }
  })
  
  localStorage.setItem(ALERTS_KEY, JSON.stringify(alerts))
}

export function getAlert(id: string): TradeAlert | null {
  const alerts = getAllAlerts()
  return alerts.find(a => a.id === id) || null
}

export function getUserAlerts(userId: string, limit?: number): TradeAlert[] {
  const alerts = getAllAlerts().filter(a => a.userId === userId)
  return limit ? alerts.slice(0, limit) : alerts
}

export function getUnreadAlertCount(userId: string): number {
  return getAllAlerts().filter(a => a.userId === userId && !a.readAt).length
}

export function getAllAlerts(): TradeAlert[] {
  if (!isBrowser()) return []
  const stored = localStorage.getItem(ALERTS_KEY)
  return stored ? JSON.parse(stored) : []
}

export function deleteAlert(id: string): boolean {
  const alerts = getAllAlerts()
  const filtered = alerts.filter(a => a.id !== id)
  localStorage.setItem(ALERTS_KEY, JSON.stringify(filtered))
  return filtered.length < alerts.length
}

export function recordTradeResult(
  id: string, 
  result: TradeResult
): TradeAlert | null {
  const status = result.outcome === "win" ? "target_hit" : 
                 result.outcome === "loss" ? "stopped_out" : "target_hit"
  return updateAlert(id, { result, status })
}

export function getCompletedAlerts(): TradeAlert[] {
  return getAllAlerts().filter(a => a.result !== undefined)
}

// ============ MIGRATION HELPER ============
// When ready to migrate to Supabase, this function shows what data needs to be moved

export function exportAllData() {
  return {
    profiles: getAllProfiles(),
    alerts: getAllAlerts(),
    exportedAt: new Date().toISOString(),
  }
}

export function clearAllData() {
  if (!isBrowser()) return
  localStorage.removeItem(PROFILES_KEY)
  localStorage.removeItem(ALERTS_KEY)
  localStorage.removeItem(CURRENT_USER_KEY)
}
