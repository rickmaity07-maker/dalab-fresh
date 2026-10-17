// Shared class recipes. Black for actions, gold for "add" and brand moments.
// Cards and panels use rounded-panel (14px), small pieces rounded-tile (10px), chips and round buttons are full.
const base =
  "inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-[12px] border px-5 font-semibold transition-[transform,background-color,border-color,color] duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50";

export const button = {
  primary: `${base} border-transparent bg-accent text-accent-ink hover:opacity-90`,
  gold: `${base} border-transparent bg-gold text-gold-ink hover:brightness-95`,
  ghost: `${base} border-line bg-surface text-ink hover:border-ink`,
  inverse: `${base} border-transparent bg-surface text-ink hover:bg-bg`,
  small: "min-h-9 px-3.5 text-sm",
};

export const iconButton =
  "relative inline-grid size-11 place-items-center rounded-[12px] border border-line bg-surface transition-colors duration-200 hover:border-ink";

export const panel = "min-w-0 rounded-panel bg-surface p-5 shadow-soft";

export const input =
  "min-h-11 w-full rounded-[12px] border border-line bg-surface px-4 outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-muted focus:border-ink focus:ring-4 focus:ring-gold-soft aria-[invalid=true]:border-bad";

export const sectionTitle = "text-[clamp(22px,2.4vw,28px)] font-extrabold leading-tight tracking-[-0.02em]";

export const chip = "inline-flex min-h-9 shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition-colors duration-200";
export const chipOn = "border-ink bg-ink text-bg";
export const chipOff = "border-line bg-surface text-ink hover:border-ink";
