"use client"

import { useState } from "react"
import { Bell, Trash2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface PriceAlert {
  id: string
  targetPrice: number
  direction: "above" | "below"
  triggered: boolean
  createdAt: Date
}

interface PriceAlertCardProps {
  alerts: PriceAlert[]
  currentPrice: number | undefined
  hasNotificationPermission: boolean
  onAddAlert: (price: number, direction: "above" | "below") => void
  onRemoveAlert: (id: string) => void
  onRequestPermission: () => Promise<boolean>
}

export function PriceAlertCard({
  alerts,
  currentPrice,
  hasNotificationPermission,
  onAddAlert,
  onRemoveAlert,
  onRequestPermission,
}: PriceAlertCardProps) {
  const [targetPrice, setTargetPrice] = useState("")
  const [direction, setDirection] = useState<"above" | "below">("above")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const price = parseFloat(targetPrice.replace(",", "."))
    if (isNaN(price) || price <= 0) return

    if (!hasNotificationPermission) {
      await onRequestPermission()
    }

    onAddAlert(price, direction)
    setTargetPrice("")
  }

  const activeAlerts = alerts.filter((a) => !a.triggered)
  const triggeredAlerts = alerts.filter((a) => a.triggered)

  return (
    <div className="rounded-3xl border border-white/10 bg-zinc-900/70 p-8 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <Bell className="w-6 h-6" />
        <h3 className="text-2xl font-black uppercase tracking-wider">
          Preis Alarm
        </h3>
      </div>

      <p className="text-zinc-500 mt-3 leading-relaxed">
        Push-Benachrichtigung, Vibration und doppelter Glockensound bei Erreichen des Wunschpreises.
      </p>

      {!hasNotificationPermission && (
        <button
          onClick={onRequestPermission}
          className="mt-4 w-full px-4 py-3 rounded-xl bg-amber-500/20 text-amber-400 text-sm font-medium hover:bg-amber-500/30 transition-colors"
        >
          Benachrichtigungen aktivieren
        </button>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setDirection("above")}
            className={`flex-1 px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
              direction === "above"
                ? "border-emerald-500 bg-emerald-500/20 text-emerald-400"
                : "border-white/10 bg-black text-zinc-400 hover:bg-zinc-800"
            }`}
          >
            Uber
          </button>
          <button
            type="button"
            onClick={() => setDirection("below")}
            className={`flex-1 px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
              direction === "below"
                ? "border-red-500 bg-red-500/20 text-red-400"
                : "border-white/10 bg-black text-zinc-400 hover:bg-zinc-800"
            }`}
          >
            Unter
          </button>
        </div>

        <div className="flex gap-3">
          <Input
            type="text"
            inputMode="decimal"
            placeholder={`Zielpreis in € (aktuell: ${currentPrice?.toFixed(2) || "..."})`}
            value={targetPrice}
            onChange={(e) => setTargetPrice(e.target.value)}
            className="flex-1 rounded-2xl border-white/10 bg-black px-5 py-4 text-white placeholder:text-zinc-600"
          />

          <Button
            type="submit"
            className="px-6 py-4 rounded-2xl bg-white text-black font-black hover:scale-105 transition-all"
          >
            Aktivieren
          </Button>
        </div>
      </form>

      {activeAlerts.length > 0 && (
        <div className="mt-6 space-y-2">
          <p className="text-xs text-zinc-500 uppercase tracking-wider">
            Aktive Alarme
          </p>
          {activeAlerts.map((alert) => (
            <div
              key={alert.id}
              className="flex items-center justify-between px-4 py-3 rounded-xl bg-black border border-white/10"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-2 h-2 rounded-full animate-pulse ${
                    alert.direction === "above" ? "bg-emerald-400" : "bg-red-400"
                  }`}
                />
                <span className="font-medium tabular-nums">
                  {alert.direction === "above" ? ">" : "<"} {alert.targetPrice.toFixed(2)}€
                </span>
              </div>
              <button
                onClick={() => onRemoveAlert(alert.id)}
                className="p-1 hover:bg-zinc-800 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-zinc-500" />
              </button>
            </div>
          ))}
        </div>
      )}

      {triggeredAlerts.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-xs text-zinc-500 uppercase tracking-wider">
            Ausgeloste Alarme
          </p>
          {triggeredAlerts.slice(-3).map((alert) => (
            <div
              key={alert.id}
              className="flex items-center justify-between px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20"
            >
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="font-medium tabular-nums text-emerald-400">
                  {alert.targetPrice.toFixed(2)}€ erreicht
                </span>
              </div>
              <button
                onClick={() => onRemoveAlert(alert.id)}
                className="p-1 hover:bg-emerald-500/20 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4 text-emerald-400" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
