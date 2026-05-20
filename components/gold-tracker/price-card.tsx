"use client"

import { Spinner } from "@/components/ui/spinner"

interface PriceCardProps {
  price: number | undefined
  dailyChange: number
  isLoading: boolean
  unit: "gram" | "oz"
  isMarketOpen: boolean
}

const TROY_OUNCE_IN_GRAMS = 31.1035

export function PriceCard({ price, dailyChange, isLoading, unit, isMarketOpen }: PriceCardProps) {
  const displayPrice = price
    ? unit === "gram"
      ? price / TROY_OUNCE_IN_GRAMS
      : price
    : 0

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  const isPositive = dailyChange >= 0

  return (
    <section className="rounded-3xl border border-white/10 bg-zinc-900/70 p-8 shadow-2xl backdrop-blur-xl">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <p className="text-zinc-500 uppercase tracking-[0.3em] text-xs">
            Live Goldpreis {unit === "gram" ? "(pro Gramm)" : "(pro Unze)"}
          </p>

          {isLoading ? (
            <div className="mt-4 flex items-center gap-4">
              <Spinner className="w-8 h-8" />
              <span className="text-zinc-400">Laden...</span>
            </div>
          ) : (
            <>
              <h2 className="text-5xl md:text-7xl font-black mt-4 tracking-tight tabular-nums">
                {formatPrice(displayPrice)}
              </h2>

              <div className="mt-4 flex items-center gap-3">
                <span
                  className={`px-4 py-2 rounded-full font-bold text-sm ${
                    isPositive
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {isPositive ? "+" : ""}
                  {dailyChange.toFixed(2)}%
                </span>

                <span className="text-zinc-400 text-sm">Seit Tagesbeginn</span>
              </div>
            </>
          )}
        </div>

        <div className="w-44 h-44 rounded-full border border-white/10 bg-black flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
          <div className="text-center z-10">
            <p className="text-zinc-500 text-xs uppercase tracking-[0.3em]">
              Marktstatus
            </p>
            <p
              className={`mt-3 text-2xl font-black ${
                isMarketOpen ? "text-emerald-400" : "text-red-400"
              }`}
            >
              {isMarketOpen ? "OPEN" : "CLOSED"}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
