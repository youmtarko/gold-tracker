"use client"

import { useState, useEffect, useCallback } from "react"
import { IntroScreen } from "@/components/gold-tracker/intro-screen"
import { Header } from "@/components/gold-tracker/header"
import { PriceCard } from "@/components/gold-tracker/price-card"
import { PriceChart } from "@/components/gold-tracker/price-chart"
import { PriceAlertCard } from "@/components/gold-tracker/price-alert-card"
import { MarketInfo } from "@/components/gold-tracker/market-info"
import { TradingViewWidget } from "@/components/gold-tracker/trading-view-widget"
import { useGoldPrice } from "@/lib/use-gold-price"
import { usePriceHistory } from "@/lib/use-price-history"
import { usePriceAlerts } from "@/lib/use-price-alerts"
import { toast } from "sonner"

function isMarketOpen(): boolean {
  const now = new Date()
  const day = now.getUTCDay()
  const hour = now.getUTCHours()

  // Market closed on weekends (Saturday 22:00 to Sunday 22:00 UTC)
  if (day === 0) return hour >= 22 // Sunday after 22:00 UTC
  if (day === 6) return hour < 22 // Saturday before 22:00 UTC
  
  return true // Weekdays
}

export default function GoldTrackerApp() {
  const [showIntro, setShowIntro] = useState(true)
  const [unit, setUnit] = useState<"gram" | "oz">("oz")
  const [isLive, setIsLive] = useState(true)

  const { price, timestamp, source, isLoading, refresh } = useGoldPrice()
  const { history, dailyChange, addPricePoint } = usePriceHistory(price)

  const handleAlertTriggered = useCallback((alert: { targetPrice: number }) => {
    toast.success(`Preis Alarm ausgelost: ${alert.targetPrice.toFixed(2)}€`, {
      duration: 10000,
    })
  }, [])

  const {
    alerts,
    addAlert,
    removeAlert,
    hasNotificationPermission,
    requestNotificationPermission,
  } = usePriceAlerts({
    currentPrice: price,
    onAlertTriggered: handleAlertTriggered,
  })

  // Update price history when price changes
  useEffect(() => {
    if (price && isLive) {
      addPricePoint(price)
    }
  }, [price, isLive, addPricePoint])

  // Manual refresh when live mode is enabled
  useEffect(() => {
    if (isLive) {
      const interval = setInterval(() => {
        refresh()
      }, 120000) // 2 minutes
      
      return () => clearInterval(interval)
    }
  }, [isLive, refresh])

  const marketOpen = isMarketOpen()

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 md:p-6">
      <div className="w-full max-w-6xl rounded-3xl border border-white/10 bg-zinc-950 shadow-2xl overflow-hidden">
        <div className="relative h-screen overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-900 to-black" />

          {/* Intro Screen */}
          {showIntro && (
            <IntroScreen
              onComplete={() => setShowIntro(false)}
              userName="Ahmad Nakeshbandi"
            />
          )}

          {/* Main App */}
          <div
            className={`absolute inset-0 transition-opacity duration-500 ${
              showIntro ? "opacity-0" : "opacity-100"
            }`}
          >
            <Header unit={unit} onUnitChange={setUnit} />

            <main className="p-4 md:p-6 lg:p-10 space-y-6 md:space-y-8 overflow-y-auto h-[calc(100vh-90px)]">
              {/* Price Card */}
              <PriceCard
                price={price}
                dailyChange={dailyChange}
                isLoading={isLoading}
                unit={unit}
                isMarketOpen={marketOpen}
              />

              {/* Chart */}
              <PriceChart
                history={history}
                isLive={isLive}
                onToggleLive={() => setIsLive(!isLive)}
              />

              {/* Alerts and Market Info */}
              <section className="grid md:grid-cols-2 gap-6">
                <PriceAlertCard
                  alerts={alerts}
                  currentPrice={price}
                  hasNotificationPermission={hasNotificationPermission}
                  onAddAlert={addAlert}
                  onRemoveAlert={removeAlert}
                  onRequestPermission={requestNotificationPermission}
                />

                <MarketInfo lastUpdate={timestamp} source={source} />
              </section>

              {/* TradingView Widget */}
              <TradingViewWidget />
            </main>
          </div>
        </div>
      </div>
    </div>
  )
}
