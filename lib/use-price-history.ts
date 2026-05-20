"use client"

import { useState, useEffect, useCallback } from "react"

interface PricePoint {
  time: string
  price: number
}

export function usePriceHistory(currentPrice: number | undefined) {
  const [history, setHistory] = useState<PricePoint[]>([])
  const [openPrice, setOpenPrice] = useState<number | null>(null)

  // Initialize with some historical data
  useEffect(() => {
    if (currentPrice && history.length === 0) {
      const now = new Date()
      const initialHistory: PricePoint[] = []
      
      // Generate historical points for today
      const basePrice = currentPrice * 0.98 // Start 2% lower
      for (let i = 24; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 30 * 60000) // Every 30 minutes
        const variation = (Math.random() - 0.3) * 15 // Trend upward
        const price = basePrice + (currentPrice - basePrice) * ((24 - i) / 24) + variation
        
        initialHistory.push({
          time: time.toISOString(),
          price: Math.round(price * 100) / 100,
        })
      }
      
      setHistory(initialHistory)
      setOpenPrice(initialHistory[0]?.price || currentPrice)
    }
  }, [currentPrice, history.length])

  // Add new price point
  const addPricePoint = useCallback((price: number) => {
    const newPoint: PricePoint = {
      time: new Date().toISOString(),
      price: Math.round(price * 100) / 100,
    }
    
    setHistory((prev) => {
      const updated = [...prev, newPoint]
      // Keep last 48 points (24 hours at 30-min intervals)
      return updated.slice(-48)
    })
  }, [])

  // Calculate daily change
  const dailyChange = openPrice && currentPrice
    ? ((currentPrice - openPrice) / openPrice) * 100
    : 0

  return {
    history,
    openPrice,
    dailyChange,
    addPricePoint,
  }
}
