/**
 * Alpaca Market Data Integration
 * Uses Alpaca's free market data API for stocks and crypto
 */

const ALPACA_API_KEY = process.env.ALPACA_API_KEY
const ALPACA_SECRET_KEY = process.env.ALPACA_SECRET_KEY
const ALPACA_DATA_URL = "https://data.alpaca.markets"
const ALPACA_PAPER_URL = "https://paper-api.alpaca.markets"

export interface AlpacaBar {
  t: string // timestamp
  o: number // open
  h: number // high
  l: number // low
  c: number // close
  v: number // volume
  n: number // number of trades
  vw: number // volume weighted average price
}

export interface AlpacaQuote {
  t: string // timestamp
  ax: string // ask exchange
  ap: number // ask price
  as: number // ask size
  bx: string // bid exchange
  bp: number // bid price
  bs: number // bid size
}

export interface AlpacaTrade {
  t: string // timestamp
  x: string // exchange
  p: number // price
  s: number // size
  c: string[] // conditions
  i: number // trade ID
  z: string // tape
}

export interface MarketSnapshot {
  symbol: string
  latestTrade: {
    price: number
    size: number
    timestamp: string
    exchange: string
  } | null
  latestQuote: {
    bidPrice: number
    askPrice: number
    bidSize: number
    askSize: number
    timestamp: string
  } | null
  dailyBar: {
    open: number
    high: number
    low: number
    close: number
    volume: number
  } | null
  previousDailyBar: {
    open: number
    high: number
    low: number
    close: number
    volume: number
  } | null
}

async function alpacaFetch(endpoint: string, isStock = true): Promise<Response> {
  const baseUrl = isStock ? `${ALPACA_DATA_URL}/v2/stocks` : `${ALPACA_DATA_URL}/v1beta3/crypto/us`
  
  const response = await fetch(`${baseUrl}${endpoint}`, {
    headers: {
      "APCA-API-KEY-ID": ALPACA_API_KEY || "",
      "APCA-API-SECRET-KEY": ALPACA_SECRET_KEY || "",
    },
  })
  
  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Alpaca API error: ${response.status} - ${error}`)
  }
  
  return response
}

/**
 * Get latest trade for a symbol
 */
export async function getLatestTrade(symbol: string, isCrypto = false): Promise<AlpacaTrade | null> {
  try {
    const endpoint = isCrypto 
      ? `/latest/trades?symbols=${symbol}`
      : `/${symbol}/trades/latest`
    
    const response = await alpacaFetch(endpoint, !isCrypto)
    const data = await response.json()
    
    if (isCrypto) {
      return data.trades?.[symbol] || null
    }
    return data.trade || null
  } catch (error) {
    console.error(`Error fetching latest trade for ${symbol}:`, error)
    return null
  }
}

/**
 * Get latest quote for a symbol
 */
export async function getLatestQuote(symbol: string, isCrypto = false): Promise<AlpacaQuote | null> {
  try {
    const endpoint = isCrypto
      ? `/latest/quotes?symbols=${symbol}`
      : `/${symbol}/quotes/latest`
    
    const response = await alpacaFetch(endpoint, !isCrypto)
    const data = await response.json()
    
    if (isCrypto) {
      return data.quotes?.[symbol] || null
    }
    return data.quote || null
  } catch (error) {
    console.error(`Error fetching latest quote for ${symbol}:`, error)
    return null
  }
}

/**
 * Get historical bars for a symbol
 */
export async function getBars(
  symbol: string, 
  timeframe: string = "1Hour",
  limit: number = 100,
  isCrypto = false
): Promise<AlpacaBar[]> {
  try {
    const endpoint = isCrypto
      ? `/bars?symbols=${symbol}&timeframe=${timeframe}&limit=${limit}`
      : `/${symbol}/bars?timeframe=${timeframe}&limit=${limit}`
    
    const response = await alpacaFetch(endpoint, !isCrypto)
    const data = await response.json()
    
    if (isCrypto) {
      return data.bars?.[symbol] || []
    }
    return data.bars || []
  } catch (error) {
    console.error(`Error fetching bars for ${symbol}:`, error)
    return []
  }
}

/**
 * Get market snapshot for multiple symbols
 */
export async function getSnapshots(symbols: string[], isCrypto = false): Promise<Record<string, MarketSnapshot>> {
  try {
    const symbolsStr = symbols.join(",")
    const endpoint = isCrypto
      ? `/snapshots?symbols=${symbolsStr}`
      : `/snapshots?symbols=${symbolsStr}`
    
    const response = await alpacaFetch(endpoint, !isCrypto)
    const data = await response.json()
    
    const snapshots: Record<string, MarketSnapshot> = {}
    
    for (const symbol of symbols) {
      const snap = data[symbol] || data.snapshots?.[symbol]
      if (snap) {
        snapshots[symbol] = {
          symbol,
          latestTrade: snap.latestTrade ? {
            price: snap.latestTrade.p,
            size: snap.latestTrade.s,
            timestamp: snap.latestTrade.t,
            exchange: snap.latestTrade.x,
          } : null,
          latestQuote: snap.latestQuote ? {
            bidPrice: snap.latestQuote.bp,
            askPrice: snap.latestQuote.ap,
            bidSize: snap.latestQuote.bs,
            askSize: snap.latestQuote.as,
            timestamp: snap.latestQuote.t,
          } : null,
          dailyBar: snap.dailyBar ? {
            open: snap.dailyBar.o,
            high: snap.dailyBar.h,
            low: snap.dailyBar.l,
            close: snap.dailyBar.c,
            volume: snap.dailyBar.v,
          } : null,
          previousDailyBar: snap.prevDailyBar ? {
            open: snap.prevDailyBar.o,
            high: snap.prevDailyBar.h,
            low: snap.prevDailyBar.l,
            close: snap.prevDailyBar.c,
            volume: snap.prevDailyBar.v,
          } : null,
        }
      }
    }
    
    return snapshots
  } catch (error) {
    console.error("Error fetching snapshots:", error)
    return {}
  }
}

/**
 * Check if US stock market is open
 */
export async function isMarketOpen(): Promise<{ isOpen: boolean; nextOpen: string | null; nextClose: string | null }> {
  try {
    const response = await fetch(`${ALPACA_PAPER_URL}/v2/clock`, {
      headers: {
        "APCA-API-KEY-ID": ALPACA_API_KEY || "",
        "APCA-API-SECRET-KEY": ALPACA_SECRET_KEY || "",
      },
    })
    
    if (!response.ok) {
      throw new Error(`Clock API error: ${response.status}`)
    }
    
    const data = await response.json()
    return {
      isOpen: data.is_open,
      nextOpen: data.next_open,
      nextClose: data.next_close,
    }
  } catch (error) {
    console.error("Error checking market status:", error)
    // Default to checking time-based market hours
    const now = new Date()
    const nyTime = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" }))
    const hour = nyTime.getHours()
    const day = nyTime.getDay()
    const isWeekday = day >= 1 && day <= 5
    const isDuringHours = hour >= 9 && hour < 16
    
    return {
      isOpen: isWeekday && isDuringHours,
      nextOpen: null,
      nextClose: null,
    }
  }
}

/**
 * Get real-time price for an asset
 */
export async function getPrice(symbol: string, isCrypto = false): Promise<number | null> {
  const trade = await getLatestTrade(symbol, isCrypto)
  return trade?.p || null
}

/**
 * Convert Alpaca bars to our PriceData format
 */
export function convertBarsToCandles(bars: AlpacaBar[]): { open: number; high: number; low: number; close: number; volume: number; timestamp: number }[] {
  return bars.map(bar => ({
    open: bar.o,
    high: bar.h,
    low: bar.l,
    close: bar.c,
    volume: bar.v,
    timestamp: new Date(bar.t).getTime(),
  }))
}
