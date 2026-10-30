# Astral Bastion

**A sci-fi tower-defense game built around collectible cards, turret upgrades, faction synergies, and a sector-by-sector campaign.**

**Play:** https://astral-bastion.shadyape128.chatgpt.site/

> **Repository setup status:** This is the repository foundation and documentation, **not an export of the game's current executable source**. Import the latest Astral Bastion source into this repository before treating it as a buildable game or enabling deployment. See [Source import](docs/SOURCE_IMPORT.md).

## The game

Command a frontier defense network. Construct a deck, place and upgrade turrets, counter distinct enemy types, and keep the shared reactor hull intact across incoming waves.

Core systems include:

- **Card-based loadouts:** build around different turrets, reinforcements, and battlefield tools.
- **Turret progression:** upgrade deployed turrets and improve collection cards between battles.
- **Faction synergies:** mixing and concentrating turret factions changes battlefield bonuses.
- **Core Hull:** an upgradable starter card that determines reactor survivability.
- **Campaign and endless play:** progressively more demanding sectors and replayable defense challenges.
- **Enemy field manual:** discover enemy capabilities and counters as you encounter new unit types.
- **Persistent progression:** cards, economy, and unlocks are designed to persist across sessions.

### Development snapshot

On **29 October 2026**, the working project was reported as having **32 playable cards plus Core Hull, four factions, and 18 campaign sectors**. The longer-term expansion target is **80 distinct playable faction cards and 30 sectors**. These are **project milestones**, not an assertion that this repository's current files implement them.

## Available battle HUD integration patch (not deployed)

The [battle HUD/audio integration kit](patches/battle-hud/README.md) contains source modules for wave countdowns, early wave calls, readable faction links and synthesized sound, plus seven isolated logic tests and a CI workflow. It is **not yet wired into the live game**; the actual playable source must still be imported first. To run the isolated tests, use `npm test --prefix patches/battle-hud` with Node 22.16+.

## Getting started

1. Play the current build at the link above.
2. To work on the source, first [import the latest project export](docs/SOURCE_IMPORT.md).
3. Follow the actual source's build and test instructions; do not assume a Node package or build tool until the project files are available.
4. Make changes on a branch and open a pull request against `main`.

## Repository guide

| File | Purpose |
| --- | --- |
| [AGENTS.md](AGENTS.md) | Rules for coding assistants and automated maintenance |
| [docs/EXPANSION_PLAN.md](docs/EXPANSION_PLAN.md) | Roadmap from current campaign/card scale toward 80 cards and 30 sectors |
| [docs/SOURCE_IMPORT.md](docs/SOURCE_IMPORT.md) | Steps for bringing the playable source into GitHub |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Architecture and validation checklist to complete after source import |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Branching, changes, and review expectations |
| [SECURITY.md](SECURITY.md) | Responsible disclosure |
| [CHANGELOG.md](CHANGELOG.md) | Release and change log |

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development conventions and bug-reporting guidance. Report reproducible bugs through the GitHub issue templates.

## Licensing

Original source code is offered under the [MIT License](LICENSE). **This does not automatically grant rights to third-party artwork, audio, fonts, brand marks, or other assets.** See [ASSET_LICENSE.md](ASSET_LICENSE.md).
