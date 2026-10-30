# Import the playable Astral Bastion source

The repository contains a tested **independently reconstructed playable preview** in [\`reconstruction/\`](../reconstruction/README.md) and an isolated UI/audio integration kit, but **does not contain the original hosted game's source or backend**. The live game is hosted separately:

https://astral-bastion.shadyape128.chatgpt.site/

A prior project session reportedly generated an `astral-bastion-source.zip` containing source, tests and GitHub Pages deployment setup, but that archive was unavailable during repository initialization. The game was subsequently updated, so use a fresh source export rather than an older snapshot.

## Available patch modules

The UI and audio improvements live under [`patches/battle-hud/`](../patches/battle-hud/README.md) as a tested **integration kit**, not as a playable build. Import the latest complete game source before connecting these modules to its combat state, wave spawner and UI. Do not treat the isolated tests as proof of playable integration.

## Reconstruction is not the missing v3 archive

The browser-playable reconstruction is a useful development reference and may be tested independently, but it does **not** implement the original cloud saves, exact card balance, or complete account and deployment architecture. Source recovery should happen in a separate branch and original code should be preferred over approximations. See [feature parity matrix](../reconstruction/docs/RECONSTRUCTION_MATRIX.md).

## Recommended import

1. Obtain the **latest source export** from the Astral Bastion project editor.
2. Examine extracted files before publishing: look for credentials, database exports, private user information, and unlicensed third-party assets. **This repository is public.**
3. Clone the existing repository locally:
   
   ```bash
   git clone https://github.com/joaodperes/Astral-Bastion.git
   cd Astral-Bastion
   ```
4. Copy the game's actual source, assets, tests, lockfiles and build configuration into this clone. Preserve paths and reconcile any existing README, license, `AGENTS.md`, issue templates or documentation rather than overwriting them automatically.
5. Update `README.md` with *verified* run/build/test commands based on the real source technology.
6. Validate a production build, a new campaign, and compatibility with saved progression. Document any migration requirements.
7. Commit and push the import through a feature branch / pull request:
   
   ```bash
   git checkout -b feat/import-game-source
   git add .
   git commit -m "feat: import playable Astral Bastion source"
   git push -u origin feat/import-game-source
   ```
8. Review the changes and merge the pull request into `main`.

## Deployment notes

The project's existing `chatgpt.site` deployment does **not automatically sync** with this GitHub repository. If the source export includes a GitHub Pages workflow, validate the output directory, build commands, public asset paths and secrets before enabling it. Do not deploy the docs-only repository as if it were a playable build.
