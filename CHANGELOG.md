# Changelog

Significant player-visible changes should be recorded here. Use clear versions/dates after source import.

## Unreleased — GitHub Pages and single-player backups

- Configured static GitHub Pages deployment workflow with syntax/unit test gates, publishing only the reconstructed browser game.
- Added format-validated JSON save export/import with overwrite confirmation; retained original reconstruction localStorage key.
- Documented browser-specific storage behavior, manual Pages activation, and differences from the original cloud game.

## Unreleased — independently reconstructed playable preview (not deployed)

- Added a browser-playable **independent reconstruction** under `reconstruction/` using documented feature descriptions, including 32 distinct cards, four factions, 18 sectors, branching turret upgrades, core hull growth, enemy armor, overlapping waves, and local progression.
- Integrated the newly requested uncluttered battle HUD, faction bonus rows with zero inactive values, early wave calls and synthesized, mutable sound into the reconstructed gameplay.
- Added 24 new passing Node tests and a separate GitHub Actions workflow; browser-smoke-tested card placement, upgrade, early call and enemy spawning.
- **Not an import of the original v3/v4.1 code.** Original account/database integration, exact economy and endless behavior remain unrecovered. No changes to live deployment.

## Unreleased — integration kit only (not yet in the live game)

- Added source-independent battle HUD components and styles, wave countdown/early-call scheduler with one-time energy bonus, and legible three-row faction effects including inactive zero values.
- Added browser-unlocked synthesized battle SFX with persistent mute, an audio test control, and seven automated logic tests with GitHub Actions CI.
- The kit is in `patches/battle-hud/`; actual gameplay integration and deployment remain blocked on importing the latest game source.

## Outstanding requests — not confirmed implemented

- Simplify battle panels by removing redundant instructional text.
- Improve wave-start countdown and consider optional early wave calls for energy.
- Reformat faction links/bonuses into legible, compact rows.
- Continue catalog and campaign growth, with performance and balance checks.

## Project deployment snapshot — 2026-10-29

- A prior project update described a v4.1 deployment with **32 playable cards + Core Hull**, **4 factions**, and **18 campaign sectors**.
- This is historical project context. No matching source commit is present in this documentation-only starter.
