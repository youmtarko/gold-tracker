"use client"

import { useState, useEffect, useCallback, useRef } from "react"

interface PriceAlert {
  id: string
  targetPrice: number
  direction: "above" | "below"
  triggered: boolean
  createdAt: Date
}

interface UsePriceAlertsOptions {
  currentPrice: number | undefined
  onAlertTriggered?: (alert: PriceAlert) => void
}

export function usePriceAlerts({ currentPrice, onAlertTriggered }: UsePriceAlertsOptions) {
  const [alerts, setAlerts] = useState<PriceAlert[]>([])
  const [hasNotificationPermission, setHasNotificationPermission] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Check and request notification permission
  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "granted") {
        setHasNotificationPermission(true)
      }
    }
  }, [])

  const requestNotificationPermission = useCallback(async () => {
    if (typeof window !== "undefined" && "Notification" in window) {
      const permission = await Notification.requestPermission()
      setHasNotificationPermission(permission === "granted")
      return permission === "granted"
    }
    return false
  }, [])

  // Create audio element for alert sound
  useEffect(() => {
    if (typeof window !== "undefined") {
      audioRef.current = new Audio()
      // Using a data URI for a simple bell sound
      audioRef.current.src = "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleREEP5za06NhFQQ/mdrTomEVBD+Z2tOiYRUEP5na06JhFQQ/mdrTomEVBD+Z2tOiYRUEP5na06JhFQQ/mdrTomEVBD+Z2tOiYRUEP5na06JhFQQ/mdrTomEVBD+Z2tOiYRUEP5na06JhFQQ/mdrTomEVBD+Z2tOiYRUEP5na06JhFQQ/mdrTomEVBD+Z2tOiYRUEP5na06Jh"
    }
  }, [])

  // Play alert sound with vibration
  const playAlertSound = useCallback(() => {
    // Play sound twice
    if (audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current.play().catch(() => {})
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.currentTime = 0
          audioRef.current.play().catch(() => {})
        }
      }, 500)
    }

    // Vibrate if supported
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate([200, 100, 200])
    }
  }, [])

  // Send notification
  const sendNotification = useCallback((alert: PriceAlert, price: number) => {
    if (hasNotificationPermission && typeof window !== "undefined") {
      const direction = alert.direction === "above" ? "erreicht" : "unterschritten"
      new Notification("Goldpreis Alarm!", {
        body: `Der Goldpreis hat ${alert.targetPrice.toFixed(2)}€ ${direction}. Aktueller Preis: ${price.toFixed(2)}€`,
        icon: "/icon.svg",
        tag: alert.id,
        requireInteraction: true,
      })
    }
  }, [hasNotificationPermission])

  // Check alerts when price changes
  useEffect(() => {
    if (!currentPrice) return

    setAlerts((prevAlerts) => {
      return prevAlerts.map((alert) => {
        if (alert.triggered) return alert

        const shouldTrigger =
          (alert.direction === "above" && currentPrice >= alert.targetPrice) ||
          (alert.direction === "below" && currentPrice <= alert.targetPrice)

        if (shouldTrigger) {
          playAlertSound()
          sendNotification(alert, currentPrice)
          onAlertTriggered?.(alert)
          return { ...alert, triggered: true }
        }

        return alert
      })
    })
  }, [currentPrice, playAlertSound, sendNotification, onAlertTriggered])

  // Add new alert
  const addAlert = useCallback((targetPrice: number, direction: "above" | "below" = "above") => {
    const newAlert: PriceAlert = {
      id: crypto.randomUUID(),
      targetPrice,
      direction,
      triggered: false,
      createdAt: new Date(),
    }
    setAlerts((prev) => [...prev, newAlert])
    return newAlert
  }, [])

  // Remove alert
  const removeAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id))
  }, [])

  // Clear all alerts
  const clearAlerts = useCallback(() => {
    setAlerts([])
  }, [])

  return {
    alerts,
    addAlert,
    removeAlert,
    clearAlerts,
    hasNotificationPermission,
    requestNotificationPermission,
  }
}
