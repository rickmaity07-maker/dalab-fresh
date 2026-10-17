"use client";

import {
  AcornIcon, AvocadoIcon, BabyIcon, BowlFoodIcon, BowlSteamIcon, BreadIcon, CakeIcon, CookieIcon, CookingPotIcon,
  CowIcon, DropHalfIcon, DropIcon, EggIcon, FishIcon, FlameIcon, GrainsIcon, HandSoapIcon, JarIcon, LeafIcon,
  OrangeIcon, OrangeSliceIcon, PepperIcon, PintGlassIcon, SquaresFourIcon, TeaBagIcon, WashingMachineIcon,
  CherriesIcon, type Icon,
} from "@phosphor-icons/react";
import type { IconKey } from "@/lib/types";

const ICONS: Record<IconKey, Icon> = {
  grid: SquaresFourIcon,
  fruit: AvocadoIcon,
  mango: OrangeIcon,
  citrus: OrangeSliceIcon,
  tomato: CherriesIcon,
  onion: OrangeIcon,
  leaf: LeafIcon,
  chilli: PepperIcon,
  milk: PintGlassIcon,
  egg: EggIcon,
  jar: JarIcon,
  flatbread: BreadIcon,
  pastry: CakeIcon,
  meat: CowIcon,
  drumstick: BowlFoodIcon,
  fish: FishIcon,
  grains: GrainsIcon,
  pasta: BowlSteamIcon,
  spice: CookingPotIcon,
  bean: GrainsIcon,
  oil: DropHalfIcon,
  date: AcornIcon,
  tea: TeaBagIcon,
  juice: PintGlassIcon,
  water: DropIcon,
  sweet: CakeIcon,
  cookie: CookieIcon,
  nuts: AcornIcon,
  soap: HandSoapIcon,
  laundry: WashingMachineIcon,
  incense: FlameIcon,
  baby: BabyIcon,
};

export function ProductIcon({ name, size = 24, weight = "duotone" }: { name: IconKey; size?: number; weight?: "duotone" | "regular" | "light" | "thin" }) {
  const Glyph = ICONS[name] ?? SquaresFourIcon;
  return <Glyph size={size} weight={weight} aria-hidden />;
}
