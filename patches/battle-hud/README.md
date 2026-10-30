# Astral Bastion — Battle HUD and Audio Patch Kit

**Scope:** Source-independent integration kit. **Not deployed** to the live Astral Bastion Site.

The source files for the current Site were not available at integration-kit preparation time. Do not replace existing source modules wholesale with these files: merge them into the game's established combat state, wave spawner, React HUD and faction mechanics.

## Requested interface changes

- Remove the whole **DEPLOYED TURRETS** sidebar roster, its selection hint, all P01/P02/... entries and the **STANDING ORDERS** block and shared hull reminder text. Preserve tap/click-to-select deployed turrets in the actual map and the existing upgrade/sell controls for the selected turret.
- Place `WaveControl` in the visible combat HUD. It shows `Wave N in MM:SS`, progress, and a `Call Wave N Early · +X Energy` button. It disables the button once the wave launches. Avoid hiding the timer while other enemies remain on the field.
- Use `FactionLinkCard` for each faction, **including the faction with 0 or 1 turret**. It formats three distinct rows and derives active bonuses from live deployed-turret counts, not historical builds. Example 6 turrets: heading `Bonus per turret, starting at 2:`, per-turret `20 armor points stripped · +10% vulnerability for 3s`, current `Current: 120 armor points · +60% vulnerability for 3s`. Factions have different effects: pass each actual faction's numeric bonus definitions in `effects`.
- Install `GameAudio` on game start and route events through `audio.play(...)`. `Test sound` should produce an audible cue after a click. Mute affects every cue and persists. Avoid turning everything back on automatically for a user who intentionally muted.

## Integration sketch

```tsx
const audio = new GameAudio();
audio.installGestureUnlock(); // call once on game boot; dispose on teardown

const director = new WaveDirector(({ wave, reason, bonusEnergy }) => {
  if (bonusEnergy) combat.addEnergy(bonusEnergy); // single award, even if many buttons clicked
  combat.spawnWave(wave);                       // preserve existing wave enemies/timing
  audio.play("wave-start");
});

// Whenever your existing wave logic schedules wave 2, for example:
director.schedule(2, combat.totalWaves, combat.delayUntilNextWaveMs);
// Render <WaveControl director={director} /> in combat HUD.
// Use the game's own live deployed faction turret counts for the card props.
// Keep existing clear-wave bonus of +2 energy in the existing clear handler.
// Do NOT duplicate that reward within WaveDirector's onStartWave callback.

// Add sound calls from existing event handlers, not the render loop:
audio.play("turret-fire");
audio.play("enemy-hit");
audio.play("enemy-down");
audio.play("upgrade");
audio.play("sell");
audio.play("ability");
audio.play("victory");
audio.play("defeat");
```

## Game rules and reliability

1. *Early call reward:* 1 energy per 10 seconds saved, capped at 3 energy per wave. Adjust `earlyCallReward` if gameplay balance requires a different value. The existing +2 wave-clear reward remains unchanged and separate.
2. *No double reward:* The director clears the pending wave before calling the game spawner. On repeat click, `callEarly` returns `null`; if the wave already started automatically, early call returns `null`.
3. *Do not use two schedulers:* Replace or integrate the existing automatic timer with `director.tick()` so early call can't spawn duplicates. If there is an existing combat `requestAnimationFrame` loop, it can call `director.tick` with a common time basis; otherwise the control invokes it every 200ms while mounted.
4. *Faction effect correctness:* Bonuses are multiplied by deployed count only when count >= 2. Effects can use fractional values via `precision`. Make sure sale, new placement, upgrade, and map transitions update the underlying count.
5. *Audio reliability:* Modern browsers require a user gesture before `AudioContext.resume()` succeeds. If muted=false but nothing plays, click `Test sound`; check speaker/output, browser tab permissions, and whether `audio.isUnlocked` is true. Audio uses only local synthesized tones, no files to download.
6. *Unsubscribe on navigation:* `audio.dispose()` when completely shutting down game; do not instantiate `GameAudio` on every rerender. UI must use one shared audio instance and one wave director per battle.

## Running tests

From this directory (Node.js 22.16+; no dependency installation needed for logic tests):

```bash
npm test
```

Tests verify timers, early call rewards, no double-launch, final wave safety, and 3-row faction figures including zero-value inactive synergies. Browser SFX and full game integration require interactive end-to-end tests in the original project.

## Current repository status

This directory intentionally lives under `patches/battle-hud/`, not at repository `src/`. It is NOT the complete game. For the playable game, import the latest actual source per `docs/SOURCE_IMPORT.md`, then integrate these modules into the existing combat engine. `npm test` tests only isolated timing and bonus calculations; it does not run or deploy the game.