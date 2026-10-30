import React, { useEffect, useState } from "react";
import { factionLinkRows, type FactionLink } from "./factionLinks";
import { type WaveDirector } from "./waveDirector";
import { type GameAudio } from "./gameAudio";
import "./battleHud.css";

/** Keep turret upgrades and selling on the battlefield selection popover.
 * Remove the entire redundant "DEPLOYED TURRETS" roster and "STANDING ORDERS"
 * paragraph from the pre-existing battle sidebar; do not render them here.
 */
export function FactionLinkCard({ link }: { link: FactionLink }) {
  const rows = factionLinkRows(link);
  return (
    <div className={`ab-faction-link ${rows.active ? "active" : "inactive"}`}>
      <div className="ab-faction-link__name">{link.factionName} · {link.turretCount} deployed</div>
      <div className="ab-faction-link__heading">{rows.heading}</div>
      <div className="ab-faction-link__per">{rows.perTurret}</div>
      <div className="ab-faction-link__current" aria-live="polite">{rows.current}</div>
    </div>
  );
}

export function WaveControl({ director }: { director: WaveDirector }) {
  const [view, setView] = useState(() => director.snapshot());
  useEffect(() => {
    const update = () => { director.tick(); setView(director.snapshot()); };
    update();
    const id = window.setInterval(update, 200);
    return () => window.clearInterval(id);
  }, [director]);
  return (
    <section className="ab-wave-clock" aria-label="Upcoming enemy wave">
      <div className="ab-wave-clock__top">
        <strong aria-live="polite">{view.label}</strong>
        <span>{view.wave ? `${view.wave}/${view.totalWaves}` : ""}</span>
      </div>
      {view.wave !== null && <>
        <div className="ab-wave-clock__track" role="progressbar" aria-label="Next wave countdown" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(view.progress * 100)}>
          <span style={{ width: `${view.progress * 100}%` }} />
        </div>
        <button type="button" className="ab-wave-clock__call" disabled={!view.canCallEarly}
          onClick={() => { director.callEarly(); setView(director.snapshot()); }}>
          Call Wave {view.wave} Early · +{view.bonusEnergy} Energy
        </button>
      </>}
    </section>
  );
}

export function AudioControl({ audio }: { audio: GameAudio }) {
  const [muted, setMuted] = useState(audio.isMuted);
  const [ready, setReady] = useState(audio.isUnlocked);
  const toggle = async () => {
    const next = !muted;
    audio.setMuted(next);
    setMuted(next);
    if (!next) {
      await audio.unlock();
      setReady(audio.isUnlocked);
      audio.play("ui-select");
    }
  };
  return (
    <div className="ab-audio-controls">
      <button type="button" aria-label={muted ? "Unmute game" : "Mute game"} aria-pressed={muted} onClick={() => { void toggle(); }}>
        {muted ? "Unmute" : "Mute"}
      </button>
      <button type="button" onClick={async () => { await audio.unlock(); setReady(audio.isUnlocked); audio.play("wave-start"); }}>
        Test sound
      </button>
      {!ready && !muted && <span role="status">Click Test sound to enable audio</span>}
    </div>
  );
}