"use client"

import useSWR from "swr"

interface MarketData {
  symbol: string
  price: number
  change: number
  changePercent: number
  high: number
  low: number
  volume: number
  isMarketOpen: boolean
  lastUpdated: string
}

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) throw new Error("Failed to fetch market data")
  return res.json()
}

export function useMarketData(symbol: string) {
  const { data, error, isLoading, mutate } = useSWR<MarketData>(
    symbol ? `/api/market-data/${symbol}` : null,
    fetcher,
    {
      refreshInterval: 30000, // Refresh every 30 seconds
      revalidateOnFocus: true,
      dedupingInterval: 10000,
    }
  )

  return {
    marketData: data,
    isLoading,
    error,
    refresh: mutate,
  }
}
