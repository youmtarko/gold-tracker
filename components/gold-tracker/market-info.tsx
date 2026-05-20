"use client"

interface MarketInfoProps {
  lastUpdate: string | undefined
  source: string | undefined
}

export function MarketInfo({ lastUpdate, source }: MarketInfoProps) {
  const formatTime = (timestamp: string | undefined) => {
    if (!timestamp) return "--:--"
    return new Date(timestamp).toLocaleTimeString("de-DE", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-zinc-900/70 p-8 backdrop-blur-xl">
      <h3 className="text-2xl font-black uppercase tracking-wider">
        Markt Informationen
      </h3>

      <div className="mt-8 space-y-4 text-sm">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <span className="text-zinc-500">Aktualisierung</span>
          <span className="font-bold">Alle 2 Minuten</span>
        </div>

        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <span className="text-zinc-500">Letzte Synchronisierung</span>
          <span className="font-bold tabular-nums">{formatTime(lastUpdate)}</span>
        </div>

        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <span className="text-zinc-500">Datenquelle</span>
          <span className="font-bold capitalize">{source || "..."}</span>
        </div>

        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <span className="text-zinc-500">Wochenende</span>
          <span className="font-bold">Market Closed</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-zinc-500">PWA</span>
          <span className="font-bold">Installierbar</span>
        </div>
      </div>
    </div>
  )
}
