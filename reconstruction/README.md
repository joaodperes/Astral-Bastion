# Astral Bastion — Playable Reconstruction Preview

> **IMPORTANT: This is a new, independently implemented reconstruction derived from the recorded feature descriptions, not the original v3 or v4.1 source code.** The old v3 ZIP was not available in this workspace. It is intentionally isolated in `reconstruction/` and does **not** modify the live ChatGPT Site or share its save storage.

## What runs

A dependency-free browser tower-defense game with 32 faction turret cards, an upgradable Core Hull starter card (12–26 HP), 18 campaign sectors, eight distinct enemy categories, 8–20 pads/sector, one to three enemy lanes, overlapping timed waves, three-card rotating hands, two specialization paths per turret, enemy armor and per-unit hull damage, faction-link buffs, Field Manual encounter unlocks, six tutorial lessons, local card upgrades, chest drops, and synthesized sound effects.

It incorporates the latest requested improvements: no redundant deployed-turret roster or standing orders, prominent wave countdown and early-call energy, three-row faction bonuses (showing zero for inactive factions), and a working user-gesture-activated sound engine with mute and Test Sound.

## Run locally

Requires Node.js 22.16+ for tests (but the game itself has no runtime dependencies). From the **repository root**:

```bash
cd reconstruction
npm test
npm run check
npm run dev
```

Then visit `http://localhost:8123` in a browser. Alternatively use any static file server from the `reconstruction` directory. Do not open `index.html` directly from `file://` as browser ES module imports are restricted in many configurations.

## GitHub Pages hosting and save backups

This is a static game: the GitHub Pages workflow uploads only index.html and src/ after automated validation. No database, server, login or leaderboard is required.

- Expected URL after Pages is enabled: https://joaodperes.github.io/Astral-Bastion/
- A repository administrator must enable Settings → Pages → Build and deployment → Source: GitHub Actions once. The regular GITHUB_TOKEN cannot activate Pages on an unconfigured repository.
- The Pages workflow runs on relevant commits to main and supports manual dispatch. Source files are relative, so they work under the /Astral-Bastion/ subpath.
- Browser localStorage keeps campaign progress, cards, currency, unlocks and audio settings. It does not sync across devices or browser profiles and is unrelated to the original chatgpt.site account.
- In Settings → Single-player save, use Download backup (.json), then Restore backup (.json) to move progress to another browser or device. The restore validates compatible backup data and requires confirmation before replacing progress.
- Clearing site data, private browsing or browser storage eviction can erase the save; download backups regularly. Do not commit personal save files to this public repository.
- Game updates must preserve the local save schema or provide explicit migration tests.

See docs/GITHUB_PAGES.md in the repository root. This deployment is the independent reconstruction, not recovered original source.

## Play

1. Open **Campaign** and deploy to Kepler Outpost.
2. Choose one of three cards from your rotating hand, then select an empty pad on the battlefield to deploy.
3. Select an occupied pad to upgrade (Assault or Control) or sell that turret.
4. Watch the next wave countdown; optionally call it early for bonus energy.
5. Win a sector to earn resources, unlock the next sector, and gain supply caches.
6. Use the **Armory** to permanently upgrade cards or the Core Hull; use **Supply vault** to unlock additional cards.

Controls: mouse/touch to choose card and pad; buttons are keyboard-accessible. Canvas selection works with pointer/touch, not keyboard; this is an accessibility gap documented in the recovery matrix.

## Tests and integration

`npm test` runs 24 Node built-in runner tests (zero external packages) covering content definitions, wave logic, energy, factions, saving, armor, hull, turret upgrades and campaign progression. A Chromium browser smoke test was performed locally against a self-contained test bundle to validate the main click flow. The workflow checks the source independently of the older `patches/battle-hud/` integration kit, which remains intact.

## What is **not** recovered

- The actual v3 and v4.1 files, exact original card stats, art and audio, saved account data or Firebase/other backend configuration.
- Cloud authentication, cross-device save synchronization, server-side authoritative inventory, original shop schedule and daily stock, or the original card/campaign balancing.
- The original endless mode: this preview unlocks a repeatable high-difficulty sector, not infinite escalating waves.
- Exact gameplay parity or the original v3 93-test / v4.1 105-test suites. These are new tests for this reconstruction.

Do **not** import this local save into the live game, change the live deployment to this reconstruction, or discard the original source archive if it is later recovered. See [`docs/RECONSTRUCTION_MATRIX.md`](docs/RECONSTRUCTION_MATRIX.md).

## Migration when original source becomes available

1. Import the untouched original v3/v4.1 ZIP into a separate branch and establish its actual dependency graph.
2. Compare card IDs, progression, saves and all gameplay features; prefer original modules over approximate reconstructed ones.
3. Backport wave director, faction-link presentation, turret HUD simplification and audio fixes with dedicated regression tests.
4. Integrate and validate backend/API contracts before any rollout.

The reconstruction never writes to the live game database or alters the original GitHub documentation and integration kit.