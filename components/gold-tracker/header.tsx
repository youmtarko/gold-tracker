"use client"

import { useState } from "react"
import { Share2, X, Copy, Check } from "lucide-react"

interface HeaderProps {
  unit: "gram" | "oz"
  onUnitChange: (unit: "gram" | "oz") => void
}

export function Header({ unit, onUnitChange }: HeaderProps) {
  const [showShareModal, setShowShareModal] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    // Try native share API first (mobile)
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Gold Tracker App",
          text: "Live Goldpreis Tracker mit XAUEUR Marktdaten",
          url: window.location.href,
        })
        return
      } catch {
        // User cancelled or share failed, show modal instead
      }
    }
    setShowShareModal(true)
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement("textarea")
      textArea.value = window.location.href
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <>
      <header className="border-b border-white/10 px-4 md:px-6 py-4 md:py-5 flex items-center justify-between bg-black/80 backdrop-blur-xl gap-3">
        <div className="min-w-0">
          <h1 className="text-lg md:text-2xl font-black tracking-widest uppercase truncate">
            Gold Tracker
          </h1>
          <p className="text-zinc-500 text-xs md:text-sm mt-1">
            Live XAUEUR Markt
          </p>
        </div>

        <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
          {/* Share/Install Button */}
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-2xl border border-white bg-white text-black font-bold hover:scale-105 active:scale-95 transition-all touch-manipulation"
            title="Teilen oder installieren"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline text-sm">Teilen</span>
          </button>

          <div className="flex items-center gap-1 md:gap-2">
          <button
            onClick={() => onUnitChange("gram")}
            className={`px-3 md:px-4 py-2 rounded-2xl border transition-all text-sm ${
              unit === "gram"
                ? "border-white bg-white text-black font-bold hover:scale-105"
                : "border-white/10 bg-zinc-900 hover:bg-zinc-800"
            }`}
          >
            Gramm
          </button>
          <button
            onClick={() => onUnitChange("oz")}
            className={`px-3 md:px-4 py-2 rounded-2xl border transition-all text-sm ${
              unit === "oz"
                ? "border-white bg-white text-black font-bold hover:scale-105"
                : "border-white/10 bg-zinc-900 hover:bg-zinc-800"
            }`}
          >
            1 OZ
          </button>
</div>
        </div>
      </header>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-zinc-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black uppercase tracking-wider">
                App Teilen
              </h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="p-2 rounded-full hover:bg-white/10 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Copy URL */}
            <div className="space-y-4">
              <div>
                <p className="text-zinc-400 text-sm mb-2">Link kopieren:</p>
                <div className="flex gap-2">
                  <input
                    readOnly
                    value={typeof window !== "undefined" ? window.location.href : ""}
                    className="flex-1 rounded-2xl border border-white/10 bg-black px-4 py-3 text-white text-sm truncate"
                  />
                  <button
                    onClick={copyToClipboard}
                    className="px-4 py-3 rounded-2xl bg-white text-black font-bold hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span className="hidden sm:inline">{copied ? "Kopiert!" : "Kopieren"}</span>
                  </button>
                </div>
              </div>

              {/* Installation instructions */}
              <div className="pt-4 border-t border-white/10">
                <p className="text-zinc-400 text-sm mb-3">Als App installieren:</p>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3 p-3 rounded-2xl bg-black/50">
                    <span className="text-white font-bold">iPhone:</span>
                    <span className="text-zinc-400">Safari &rarr; Teilen &rarr; Zum Home-Bildschirm</span>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-2xl bg-black/50">
                    <span className="text-white font-bold">Android:</span>
                    <span className="text-zinc-400">Chrome Menu &rarr; App installieren</span>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-2xl bg-black/50">
                    <span className="text-white font-bold">Desktop:</span>
                    <span className="text-zinc-400">URL kopieren &rarr; In neuem Tab einfügen</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
