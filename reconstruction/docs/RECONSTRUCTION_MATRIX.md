# Reconstruction scope and parity matrix

Recorded reference points (not the actual source): v3 reportedly contained 24 cards, 18 sectors and 93 tests. v4.1 reportedly contained 32 playable cards + Core Hull, four factions, 18 sectors and 105 tests. The v3 ZIP at a temporary `/workspace/scratch/...` path is unavailable. This reconstruction is **not a port** of v3; it is a separate replacement implementation that can be evaluated before any real source recovery.

| Requested/documented feature | Reconstruction status | Evidence and limitations |
|---|---|---|
| 32 playable faction cards | Implemented with independently drafted IDs/stats | `src/catalog.mjs`; not original IDs or balance |
| Four factions and bonuses | Implemented | Activates with >=2 turrets; all rows visible with zero values while inactive |
| 18 sectors | Implemented | One to three routes, 8–20 pads, boss encounters; original layouts unrecovered |
| Core Hull starter | Implemented | Level 1–8; 12→26 HP; local upgrade resources |
| Three-card rotating hand | Implemented | Six-card deck; draw rotates after successful placement |
| Distinct armor and reactor damage | Implemented | Eight enemy types; armor outline + different hull damage |
| Turret upgrade branches | Implemented | Assault vs Control; 3–4 battle tiers; source-specific effects simplified |
| Overlapping waves | Implemented | Next scheduled wave starts even while prior one remains active |
| Early wave call and energy bonus | Implemented | +1 per 10 s saved, maximum +3; one-time award per wave |
| Wave-cleared energy | Implemented | +2 once per cleared wave; kills also grant energy |
| Turret roster / Standing Orders clutter | Removed | Turret controls only when an on-map turret is selected |
| Three-row faction bonuses | Implemented | Per-turret and current rows, zero inactive values |
| Game sounds | Implemented | WebAudio synthesis, mute persistence, gesture unlock, Test Sound button; no original SFX assets |
| Six-lesson tutorial | Implemented as manual walkthrough | Lessons are text-based, not the original guided scenario; Pulse Lv 2 is the collection milestone |
| Enemy Field Manual unlocks | Implemented | Encountered enemy types persisted locally |
| Collections, caches and upgrades | Implemented locally | Simplified economy; not original loot odds, rotation or unlock schedule |
| Browser persistence | Implemented | `localStorage` with validated JSON backup and restore; **not** compatible with live accounts |
| Cloud login / database | **Missing** | Cannot recover or infer original API, schema or access-control rules |
| Original v3/v4.1 saves and migration | **Missing** | Never attempt to migrate existing live saves using guessed IDs |
| Original exact campaign/card balance | **Missing** | Requires original source/artifacts and regression comparisons |
| Original endless mode | **Partial** | Repeatable final sector, not infinite scaling |
| Automated test suite | 24 independent passing tests | These do not replace the historical 93/105 tests |
| Desktop browser click flow | Smoke-tested | Navigation, deployment, upgrade, early call, spawn, no page errors |
| Mobile and keyboard-only battle selection | Not fully validated | Needs dedicated touch, screen reader and keyboard controls |
| Production security / scaling | Not validated | Static local save only; not suitable for a multiplayer/authenticated service |

## Source lineage rules

Do not call this code the authentic v3 or v4.1 source. Do not overwrite or migrate account/player data. If the original full source archive becomes accessible, establish its checksums, file tree, backend variables, licenses and tests and treat it as authoritative over this implementation. The original `patches/battle-hud/` integration modules are preserved separately for backporting.