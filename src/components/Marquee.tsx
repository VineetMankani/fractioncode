const ITEMS = ["DESIGN", "DEVELOPMENT", "MOTION", "RESPONSIVE", "PERFORMANCE", "EXPERIENCE"]

export function Marquee() {
  const content = (
    <span className="flex items-center gap-6 pr-6">
      {ITEMS.map((item) => (
        <span key={item} className="flex items-center gap-6">
          <span className="text-xs font-medium tracking-[0.3em] text-white/30 md:text-sm">
            {item}
          </span>
          <span className="text-white/15" aria-hidden="true">
            &middot;
          </span>
        </span>
      ))}
    </span>
  )

  return (
    <div className="relative w-full overflow-hidden border-t border-white/5 py-4" aria-hidden="true">
      <div className="marquee-track">
        {content}
        {content}
      </div>
    </div>
  )
}
