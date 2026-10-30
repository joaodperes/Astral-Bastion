/** Data-driven faction bonus presentation; works even before a synergy is active. */
export interface FactionEffect {
  perTurret: number;
  /** e.g. "armor points stripped" or "% vulnerability for 3s" */
  unit: string;
  /** Optional current-row unit when the running total needs different wording. */
  currentUnit?: string;
  /** e.g. "+" for vulnerability. Defaults to an empty prefix. */
  prefix?: string;
  /** Format only the numeric quantity, retaining precision when necessary. */
  precision?: number;
}
export interface FactionLink {
  id: string;
  factionName: string;
  turretCount: number;
  activationThreshold?: number;
  effects: readonly FactionEffect[];
}
export interface FactionLinkRows {
  heading: string;
  perTurret: string;
  current: string;
  active: boolean;
}
function formatted(effect: FactionEffect, amount: number, isCurrent = false): string {
  const value = Number(amount.toFixed(effect.precision ?? 0));
  const unit = isCurrent ? (effect.currentUnit ?? effect.unit) : effect.unit;
  return `${effect.prefix ?? ""}${value}${unit.startsWith("%") ? "" : " "}${unit}`;
}
export function factionLinkRows(link: FactionLink): FactionLinkRows {
  const threshold = link.activationThreshold ?? 2;
  const count = Math.max(0, Math.floor(link.turretCount));
  const active = count >= threshold;
  return {
    heading: `Bonus per turret, starting at ${threshold}:`,
    perTurret: link.effects.map(effect => formatted(effect, effect.perTurret)).join(" · "),
    current: `Current: ${link.effects.map(effect => formatted(effect, active ? effect.perTurret * count : 0, true)).join(" · ")}`,
    active,
  };
}

export const exampleArmorLink: FactionLink = {
  id: "example-armor-link",
  factionName: "Armor Break",
  turretCount: 6,
  effects: [
    { perTurret: 20, unit: "armor points stripped", currentUnit: "armor points" },
    { perTurret: 10, prefix: "+", unit: "% vulnerability for 3s" },
  ],
};