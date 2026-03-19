"use client"

import useSWR from "swr"

export interface Signal {
  id: string
  user_id: string
  symbol: string
  timeframe: string
  direction: "BUY" | "SELL"
  entry_price: number
  stop_loss: number
  target_1: number
  target_2: number | null
  risk_reward: string
  setup_type: string
  market_condition: string | null
  grade: string
  score: number
  reasons: string[] // V1: Setup Conditions Met
  setup_quality: "Elite" | "Strong" | "Developing" | null // V1 setup quality
  watch_level: number | null // V1 watch level
  status: "pending" | "active" | "invalidated" | "target_hit" | "stopped_out"
  outcome: "win" | "loss" | "partial" | "breakeven" | null
  exit_price: number | null
  reward_achieved: number | null
  read_at: string | null
  closed_at: string | null
  created_at: string
  updated_at: string
}

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || "Failed to fetch")
  }
  return res.json()
}

export function useSignals() {
  const { data, error, isLoading, mutate } = useSWR<{ signals: Signal[] }>(
    "/api/signals",
    fetcher,
    {
      refreshInterval: 30000, // Refresh every 30 seconds
      revalidateOnFocus: true,
    }
  )
  
  const signals = data?.signals || []
  const unreadCount = signals.filter(s => !s.read_at).length
  const activeSignals = signals.filter(s => s.status === "pending" || s.status === "active")
  const completedSignals = signals.filter(s => 
    s.status === "target_hit" || s.status === "stopped_out" || s.status === "invalidated"
  )
  
  const markAsRead = async (id: string) => {
    await fetch(`/api/signals/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ readAt: new Date().toISOString() }),
    })
    mutate()
  }
  
  const updateStatus = async (id: string, status: Signal["status"], outcome?: Signal["outcome"], exitPrice?: number) => {
    await fetch(`/api/signals/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        status, 
        outcome, 
        exitPrice,
        closedAt: outcome ? new Date().toISOString() : null,
        rewardAchieved: outcome === "win" ? 1 : outcome === "loss" ? -1 : 0,
      }),
    })
    mutate()
  }
  
  const deleteSignal = async (id: string) => {
    await fetch(`/api/signals/${id}`, { method: "DELETE" })
    mutate()
  }
  
  return {
    signals,
    activeSignals,
    completedSignals,
    unreadCount,
    isLoading,
    error,
    markAsRead,
    updateStatus,
    deleteSignal,
    refresh: mutate,
    refreshSignals: mutate,
  }
}
