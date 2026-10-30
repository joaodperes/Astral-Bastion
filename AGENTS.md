# Agent instructions — Astral Bastion

These instructions apply to coding agents and automated expansions.

## Priorities

1. Preserve playability and saves before adding content.
2. Make changes against the **latest actual repository source**, not old descriptions or historical snapshots.
3. Read `docs/EXPANSION_PLAN.md` before creating cards or sectors.
4. Keep the gameplay UI legible, with no redundant instructional filler.
5. Prefer data-driven card, enemy, sector and faction definitions over copy/pasted logic.

## Before editing

- Inspect the source tree, current branch, project scripts, tests, and deployment workflow.
- Identify where save migrations, card catalogs, enemy catalogs and sector validation happen.
- Do not invent an API or overwrite unrelated work.
- Create narrowly scoped changes, and document what is and is not validated.

## Gameplay expectations

- The Core Hull card influences maximum shared reactor HP and should have a bounded upgrade path.
- Each card's upgrades must be meaningful and visible to players (damage, control, firing behavior or reinforcements).
- Turret faction synergies must be readable and recomputed accurately when turret composition changes.
- Different enemy types should have distinct threats and identifiable armor states.
- Wave starts and a possible early-call reward should be clear in the battle UI.
- Field manual unlocks must reflect enemy encounters.
- Avoid performance regressions from excessive effects, particles, or repeated state recomputation.

## Expansion target

Grow toward **80 distinct playable faction cards** and **30 campaign sectors**. Do not pad the catalog with cosmetic duplicates. Each new card and sector should have a mechanical purpose and adequate balancing/testing. This is a target, not a claim of completion.

## Validation and commits

- Run the existing project tests and production build after changes.
- Verify core gameplay loops manually or through automated smoke tests.
- Update `CHANGELOG.md` for player-visible features and fixes.
- Prefer pull requests for substantive changes. Do not publish deployment secrets.
