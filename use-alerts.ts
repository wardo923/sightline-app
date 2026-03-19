"use client"

import { useState, useEffect, useCallback } from "react"
import { TradeAlert, getUserAlerts, getUnreadAlertCount, markAlertAsRead, markAllAlertsAsRead, getCurrentProfile } from "@/lib/storage"

export function useAlerts() {
  const [alerts, setAlerts] = useState<TradeAlert[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  const refreshAlerts = useCallback(() => {
    const profile = getCurrentProfile()
    if (!profile) {
      setAlerts([])
      setUnreadCount(0)
      setIsLoading(false)
      return
    }

    const userAlerts = getUserAlerts(profile.id)
    const count = getUnreadAlertCount(profile.id)
    
    setAlerts(userAlerts)
    setUnreadCount(count)
    setIsLoading(false)
  }, [])

  const markAsRead = useCallback((alertId: string) => {
    markAlertAsRead(alertId)
    refreshAlerts()
  }, [refreshAlerts])

  const markAllAsRead = useCallback(() => {
    const profile = getCurrentProfile()
    if (profile) {
      markAllAlertsAsRead(profile.id)
      refreshAlerts()
    }
  }, [refreshAlerts])

  useEffect(() => {
    refreshAlerts()

    // Listen for new alerts
    const handleNewAlert = () => {
      refreshAlerts()
    }

    window.addEventListener("sightline-new-alert", handleNewAlert)
    
    // Poll for updates every 30 seconds
    const interval = setInterval(refreshAlerts, 30000)

    return () => {
      window.removeEventListener("sightline-new-alert", handleNewAlert)
      clearInterval(interval)
    }
  }, [refreshAlerts])

  return {
    alerts,
    unreadCount,
    isLoading,
    refreshAlerts,
    markAsRead,
    markAllAsRead,
  }
}
