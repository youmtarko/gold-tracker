"use client"

import { useMemo } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts"

interface PricePoint {
  time: string
  price: number
}

interface PriceChartProps {
  history: PricePoint[]
  isLive: boolean
  onToggleLive: () => void
}

export function PriceChart({ history, isLive, onToggleLive }: PriceChartProps) {
  const chartData = useMemo(() => {
    return history.map((point) => ({
      ...point,
      displayTime: new Date(point.time).toLocaleTimeString("de-DE", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    }))
  }, [history])

  const currentPrice = history[history.length - 1]?.price || 0
  const minPrice = Math.min(...history.map((p) => p.price)) * 0.999
  const maxPrice = Math.max(...history.map((p) => p.price)) * 1.001

  return (
    <section className="rounded-3xl border border-white/10 bg-zinc-900/70 p-8 backdrop-blur-xl">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h3 className="text-2xl font-black uppercase tracking-wider">
            Live Chart
          </h3>
          <p className="text-zinc-500 mt-2 text-sm">
            Automatische Synchronisierung alle 2 Minuten
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onToggleLive}
            className={`px-5 py-2 rounded-2xl border font-bold transition-all ${
              isLive
                ? "border-white bg-white text-black hover:scale-105"
                : "border-white/10 bg-black hover:bg-zinc-800"
            }`}
          >
            {isLive ? "LIVE" : "PAUSED"}
          </button>
          <button
            onClick={onToggleLive}
            className={`px-5 py-2 rounded-2xl border transition-all ${
              !isLive
                ? "border-white bg-white text-black font-bold hover:scale-105"
                : "border-white/10 bg-black hover:bg-zinc-800"
            }`}
          >
            {isLive ? "Pause" : "Resume"}
          </button>
        </div>
      </div>

      <div className="relative h-[400px] rounded-3xl bg-black border border-white/10 overflow-hidden p-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <defs>
              <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#ffffff" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#ffffff" stopOpacity={1} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="displayTime"
              stroke="#52525b"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              domain={[minPrice, maxPrice]}
              stroke="#52525b"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `€${value.toFixed(0)}`}
              width={70}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#18181b",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "12px",
                color: "#fff",
              }}
              labelStyle={{ color: "#a1a1aa" }}
              formatter={(value: number) => [
                `€${value.toFixed(2)}`,
                "Preis",
              ]}
            />
            <ReferenceLine
              y={currentPrice}
              stroke="#ffffff"
              strokeDasharray="8 8"
              strokeOpacity={0.3}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke="url(#lineGradient)"
              strokeWidth={3}
              dot={false}
              activeDot={{
                r: 6,
                fill: "#ffffff",
                stroke: "#000000",
                strokeWidth: 2,
              }}
            />
          </LineChart>
        </ResponsiveContainer>

        {isLive && (
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400 text-xs font-bold">LIVE</span>
          </div>
        )}
      </div>
    </section>
  )
}
