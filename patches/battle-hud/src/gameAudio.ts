/**
 * Original synthesized game SFX (no third-party audio assets needed).
 * AudioContext is unlocked on the first pointer/key gesture because browsers
 * prohibit autoplay. Mute state is persisted and controls ALL cues.
 */
export type GameSound =
  | "ui-select"
  | "turret-fire"
  | "enemy-hit"
  | "enemy-down"
  | "wave-ready"
  | "wave-start"
  | "upgrade"
  | "sell"
  | "ability"
  | "victory"
  | "defeat";

const SETTINGS_KEY = "astral-bastion-muted";
type AudioCtxCtor = typeof AudioContext;

export class GameAudio {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private muted = false;
  private unlocked = false;
  private lastPlayed = new Map<GameSound, number>();
  private unlockListener: (() => void) | null = null;

  constructor() {
    try { this.muted = globalThis.localStorage?.getItem(SETTINGS_KEY) === "true"; } catch { /* private-mode storage restrictions */ }
  }

  get isMuted(): boolean { return this.muted; }
  get isUnlocked(): boolean { return this.unlocked && this.ctx?.state === "running"; }

  async unlock(): Promise<boolean> {
    if (typeof window === "undefined") return false;
    try {
      if (!this.ctx) {
        const Constructor = (window.AudioContext ?? (window as Window & { webkitAudioContext?: AudioCtxCtor }).webkitAudioContext);
        if (!Constructor) return false;
        this.ctx = new Constructor();
        this.master = this.ctx.createGain();
        this.master.gain.value = this.muted ? 0 : 0.45;
        this.master.connect(this.ctx.destination);
      }
      if (this.ctx.state === "suspended") await this.ctx.resume();
      this.unlocked = this.ctx.state === "running";
      return this.unlocked;
    } catch { return false; }
  }

  /** Install once as part of game boot; call dispose on unmount. */
  installGestureUnlock(): void {
    if (typeof window === "undefined" || this.unlockListener) return;
    this.unlockListener = () => { void this.unlock(); };
    window.addEventListener("pointerdown", this.unlockListener, { capture: true });
    window.addEventListener("keydown", this.unlockListener, { capture: true });
  }

  setMuted(muted: boolean): void {
    this.muted = muted;
    try { globalThis.localStorage?.setItem(SETTINGS_KEY, String(muted)); } catch { /* optional */ }
    if (this.ctx && this.master) {
      this.master.gain.setTargetAtTime(muted ? 0 : 0.45, this.ctx.currentTime, 0.02);
    }
  }

  /** Play only after unlock. Use this for ALL combat UI events. */
  play(sound: GameSound): void {
    if (this.muted || !this.isUnlocked || !this.ctx || !this.master) return;
    const nowMs = performance.now();
    const throttleMs = sound === "turret-fire" ? 75 : sound === "enemy-hit" ? 110 : 0;
    if (nowMs - (this.lastPlayed.get(sound) ?? -10000) < throttleMs) return;
    this.lastPlayed.set(sound, nowMs);
    const now = this.ctx.currentTime;
    switch (sound) {
      case "ui-select": this.note(480, 580, 0.06, now, 0.10); break;
      case "turret-fire": this.note(145, 66, 0.11, now, 0.15, "sawtooth"); break;
      case "enemy-hit": this.note(310, 110, 0.07, now, 0.06, "triangle"); break;
      case "enemy-down": this.note(190, 54, 0.2, now, 0.16, "sawtooth"); break;
      case "wave-ready": this.note(330, 440, 0.14, now, 0.12); this.note(440, 550, 0.14, now + 0.17, 0.12); break;
      case "wave-start": this.note(220, 330, 0.2, now, 0.14, "sawtooth"); this.note(330, 440, 0.2, now + 0.16, 0.14); break;
      case "upgrade": this.note(410, 615, 0.12, now, 0.12); this.note(620, 840, 0.16, now + 0.13, 0.10); break;
      case "sell": this.note(530, 220, 0.2, now, 0.11); break;
      case "ability": this.note(100, 420, 0.32, now, 0.23, "sawtooth"); break;
      case "victory": [392, 494, 587, 784].forEach((freq, i) => this.note(freq, freq, 0.28, now + i * 0.16, 0.12)); break;
      case "defeat": [349, 294, 220].forEach((freq, i) => this.note(freq, freq * 0.85, 0.38, now + i * 0.22, 0.13)); break;
    }
  }

  private note(startHz: number, endHz: number, duration: number, at: number, gain: number, shape: OscillatorType = "sine"): void {
    if (!this.ctx || !this.master) return;
    const osc = this.ctx.createOscillator();
    const env = this.ctx.createGain();
    osc.type = shape;
    osc.frequency.setValueAtTime(Math.max(1, startHz), at);
    osc.frequency.exponentialRampToValueAtTime(Math.max(1, endHz), at + duration);
    env.gain.setValueAtTime(0.0001, at);
    env.gain.exponentialRampToValueAtTime(Math.max(0.0002, gain), at + 0.008);
    env.gain.exponentialRampToValueAtTime(0.0001, at + duration);
    osc.connect(env); env.connect(this.master);
    osc.start(at); osc.stop(at + duration + 0.01);
  }

  dispose(): void {
    if (this.unlockListener && typeof window !== "undefined") {
      window.removeEventListener("pointerdown", this.unlockListener, true);
      window.removeEventListener("keydown", this.unlockListener, true);
    }
    this.unlockListener = null;
    void this.ctx?.close();
    this.ctx = null; this.master = null; this.unlocked = false;
  }
}