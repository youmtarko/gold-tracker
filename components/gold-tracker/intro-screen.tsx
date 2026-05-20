"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface IntroScreenProps {
  onComplete: () => void
  userName?: string
}

export function IntroScreen({ onComplete, userName = "Ahmad Nakeshbandi" }: IntroScreenProps) {
  const [progress, setProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Animate progress bar
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + 2
      })
    }, 40)

    // Hide intro after loading completes
    const hideTimeout = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onComplete, 500) // Wait for fade out animation
    }, 2500)

    return () => {
      clearInterval(progressInterval)
      clearTimeout(hideTimeout)
    }
  }, [onComplete])

  return (
    <div
      className={cn(
        "absolute inset-0 flex flex-col items-center justify-center z-20 bg-black transition-all duration-500",
        !isVisible && "opacity-0 pointer-events-none"
      )}
    >
      <div className="relative">
        <h1 className="text-4xl md:text-7xl font-black tracking-widest text-white text-center uppercase animate-pulse">
          Willkommen
        </h1>
        <div className="absolute -inset-4 bg-white/5 blur-3xl rounded-full -z-10" />
      </div>
      
      <h2 className="mt-4 text-2xl md:text-5xl font-bold tracking-[0.3em] text-zinc-300 text-center uppercase">
        {userName}
      </h2>

      <div className="mt-12 w-64 h-[2px] bg-white/20 overflow-hidden rounded-full">
        <div 
          className="h-full bg-white transition-all duration-100 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="mt-6 text-zinc-500 text-sm tracking-[0.4em] uppercase">
        Goldpreis Tracker wird geladen...
      </p>
    </div>
  )
}
