/**
 * Wave scheduling + early-call rewards for Astral Bastion.
 * This controller owns only timing; the existing combat engine owns enemies,
 * energy, wave-clear rewards, persistence and rendering.
 */
export type SpawnReason = "automatic" | "early";

export interface ScheduledWave {
  wave: number;
  totalWaves: number;
  scheduledAtMs: number;
  spawnAtMs: number;
}

export interface WaveCue {
  wave: number;
  reason: SpawnReason;
  bonusEnergy: number;
}

export interface WaveView {
  wave: number | null;
  totalWaves: number;
  secondsRemaining: number;
  timeText: string;
  canCallEarly: boolean;
  bonusEnergy: number;
  progress: number;
  label: string;
}

/** Award one energy per 10 seconds saved, capped at three per wave. */
export function earlyCallReward(remainingMs: number): number {
  if (!Number.isFinite(remainingMs) || remainingMs <= 0) return 0;
  return Math.min(3, Math.ceil(remainingMs / 10_000));
}

export function formatCountdown(seconds: number): string {
  const s = Math.max(0, Math.ceil(seconds));
  return `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;
}

export class WaveDirector {
  private pending: ScheduledWave | null = null;
  private lastStartedWave = 0;
  private totalWaves = 0;
  private readonly onStartWave: (cue: WaveCue) => void;

  constructor(onStartWave: (cue: WaveCue) => void) {
    this.onStartWave = onStartWave;
  }

  /** Call when the engine schedules its next wave. The same wave cannot be scheduled twice. */
  schedule(wave: number, totalWaves: number, delayMs: number, nowMs = Date.now()): void {
    if (!Number.isInteger(wave) || wave < 1 || wave > totalWaves) {
      throw new Error("Wave index is outside the campaign range");
    }
    if (wave <= this.lastStartedWave || this.pending !== null) {
      throw new Error("A wave is already pending or has already started");
    }
    if (!Number.isFinite(delayMs) || delayMs < 0) {
      throw new Error("Wave delay cannot be negative");
    }
    this.totalWaves = totalWaves;
    this.pending = { wave, totalWaves, scheduledAtMs: nowMs, spawnAtMs: nowMs + delayMs };
  }

  /** Call in the existing game update loop, not from render. */
  tick(nowMs = Date.now()): WaveCue | null {
    if (!this.pending || nowMs < this.pending.spawnAtMs) return null;
    return this.start("automatic", 0);
  }

  /** Wire to the explicit 'Call wave early' button. No double-claiming is possible. */
  callEarly(nowMs = Date.now()): WaveCue | null {
    if (!this.pending || nowMs >= this.pending.spawnAtMs) return null;
    return this.start("early", earlyCallReward(this.pending.spawnAtMs - nowMs));
  }

  snapshot(nowMs = Date.now()): WaveView {
    const next = this.pending;
    if (!next) return {
      wave: null,
      totalWaves: this.totalWaves,
      secondsRemaining: 0,
      timeText: "00:00",
      canCallEarly: false,
      bonusEnergy: 0,
      progress: 1,
      label: this.totalWaves && this.lastStartedWave >= this.totalWaves ? "Final wave deployed" : "Wave in progress",
    };
    const remainingMs = Math.max(0, next.spawnAtMs - nowMs);
    const delay = Math.max(1, next.spawnAtMs - next.scheduledAtMs);
    const remainingS = Math.ceil(remainingMs / 1000);
    return {
      wave: next.wave,
      totalWaves: next.totalWaves,
      secondsRemaining: remainingS,
      timeText: formatCountdown(remainingS),
      canCallEarly: remainingMs > 0,
      bonusEnergy: earlyCallReward(remainingMs),
      progress: Math.max(0, Math.min(1, 1 - remainingMs / delay)),
      label: remainingMs > 0 ? `Wave ${next.wave} in ${formatCountdown(remainingS)}` : `Wave ${next.wave} incoming`,
    };
  }

  private start(reason: SpawnReason, bonusEnergy: number): WaveCue {
    // Clear state BEFORE calling into the combat engine to prevent reentrancy exploits.
    const pending = this.pending;
    if (!pending) throw new Error("No wave pending");
    this.pending = null;
    this.lastStartedWave = pending.wave;
    const cue: WaveCue = { wave: pending.wave, reason, bonusEnergy };
    this.onStartWave(cue);
    return cue;
  }

  /** Reset on restarting a deployment; do not persist between sessions. */
  reset(): void {
    this.pending = null;
    this.lastStartedWave = 0;
    this.totalWaves = 0;
  }
}