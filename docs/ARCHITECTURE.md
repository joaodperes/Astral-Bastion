# Architecture and maintenance notes

> To be completed **from the actual source code** after import. Do not treat the following design categories as confirmed module names or directories.

## Systems to locate and document

- Card definitions, collections, deck validation and upgrades
- Faction synergy calculation and HUD
- Turret placement, targeting, firing and upgrades
- Enemy and armor/damage calculation
- Wave scheduler and early-start behavior
- Reactor health and Core Hull progression
- Campaign sectors, progression and rewards
- Field Manual encounters and unlocks
- Persistence, accounts and save compatibility
- Rendering, animation and performance
- Tests, build scripts and deployment

## Validation expectations

Document the real commands for:

1. Install dependencies (if any)
2. Unit/data validation
3. Build
4. Smoke/end-to-end tests
5. Local development
6. Deployment or release

Avoid adding guessed commands to the main README until they have been exercised successfully.
