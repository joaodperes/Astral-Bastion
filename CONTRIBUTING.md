# Contributing to Astral Bastion

Thanks for helping improve the game. Keep changes small, reviewable, and focused on gameplay quality.

## Branches and pull requests

- `main` should reflect code that is safe to publish.
- Create feature/fix branches, such as `feat/wave-controls` or `fix/debris`.
- Write a short PR description with **what changed**, **why**, **how tested**, and any **save-data or balance impacts**.
- If altering content, include the affected card IDs, sectors, enemy types, and progression requirements.
- Avoid committing account data, save exports, passwords, private keys, or deployment credentials.

## Quality checklist

- Verify a fresh session and an existing save if progression or persistence changes.
- Test the campaign flow, turret placement/upgrades, waves, economy, and relevant faction interactions.
- Check usability on desktop and smaller viewports.
- Favor explicit, readable labels and adequate font sizes.
- Check that enemies and armored states are visually distinguishable.
- If a change could affect old saves, document migration and fallback behavior.
- Record user-visible changes in `CHANGELOG.md`.

## Source code

This starter repository contains **documentation only**. Add the latest source export first and update the run/test instructions based on its actual technology. See `docs/SOURCE_IMPORT.md`.
