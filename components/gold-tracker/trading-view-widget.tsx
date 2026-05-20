"use client"

import { ExternalLink } from "lucide-react"

interface TradingViewWidgetProps {
  className?: string
}

const TRADINGVIEW_URL = "https://de.tradingview.com/symbols/XAUEUR/?exchange=OANDA"

export function TradingViewWidget({ className }: TradingViewWidgetProps) {
  return (
    <section className={`rounded-3xl border border-white/10 bg-zinc-900/70 p-6 md:p-8 backdrop-blur-xl ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-xl md:text-2xl font-black uppercase tracking-wider">
            Echtzeit XAUEUR
          </h3>
          <p className="text-zinc-500 mt-2 text-sm">
            TradingView / OANDA Integration
          </p>
        </div>

        {/* Prominent Link Button - works on mobile and desktop */}
        <a
          href={TRADINGVIEW_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-3 px-6 py-4 rounded-2xl border-2 border-white bg-white text-black font-black text-base md:text-lg hover:scale-105 active:scale-95 transition-all touch-manipulation"
        >
          <ExternalLink className="w-5 h-5" />
          <span>IM NEUEN TAB ÖFFNEN</span>
        </a>
      </div>

      {/* Quick Access Card for Mobile */}
      <a
        href={TRADINGVIEW_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 flex items-center justify-between p-4 rounded-2xl bg-black/50 border border-white/10 hover:border-white/30 transition-all touch-manipulation"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
            <ExternalLink className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-bold text-white">TradingView Live Chart</p>
            <p className="text-xs text-zinc-500">Vollbildmodus auf Handy oder PC</p>
          </div>
        </div>
        <span className="text-zinc-400 text-sm hidden sm:block">tradingview.com</span>
      </a>

      <div className="mt-6 rounded-3xl overflow-hidden border border-white/10">
        <iframe
          title="TradingView XAUEUR"
          src="https://s.tradingview.com/widgetembed/?frameElementId=tradingview_123&symbol=OANDA%3AXAUEUR&interval=5&hidesidetoolbar=1&symboledit=1&saveimage=1&toolbarbg=000000&theme=dark&style=1&timezone=Europe%2FBerlin&studies=[]"
          className="w-full h-[400px] md:h-[600px] bg-black"
          loading="lazy"
        />
      </div>
    </section>
  )
}

// Floating Action Button for quick access (can be used separately)
export function TradingViewFloatingButton() {
  return (
    <a
      href={TRADINGVIEW_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-4 rounded-full bg-white text-black font-black shadow-2xl hover:scale-110 active:scale-95 transition-all touch-manipulation"
      aria-label="TradingView im neuen Tab öffnen"
    >
      <ExternalLink className="w-5 h-5" />
      <span className="hidden sm:inline">LIVE CHART</span>
    </a>
  )
}
