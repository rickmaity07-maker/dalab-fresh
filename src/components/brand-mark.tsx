// A gold five-pointed star (from the Somali flag) on a black tile.
const STAR = "M17 6.2l2.55 7.83h8.24l-6.66 4.84 2.54 7.83L17 21.86l-6.67 4.84 2.55-7.83-6.67-4.84h8.24z";

export function BrandMark({ className = "size-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 34 34" className={className} aria-hidden>
      <rect width="34" height="34" rx="9" fill="#141414" />
      <path d={STAR} fill="#e3b23c" transform="translate(0 0.4)" />
    </svg>
  );
}

export function Star({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="5 5 24 23" className={className} aria-hidden>
      <path d={STAR} fill="currentColor" />
    </svg>
  );
}

export function Wordmark({ compact = false }: { compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <BrandMark className={compact ? "size-8" : "size-9"} />
      <span className={`${compact ? "text-[17px]" : "text-[20px]"} font-extrabold tracking-[-0.02em] whitespace-nowrap`}>
        Dalab <span className="text-gold-text">Fresh</span>
      </span>
    </span>
  );
}
