# GitHub Pages: static Astral Bastion

## Purpose

Deploy the **independently reconstructed single-player game**, not the original ChatGPT Site code. The site runs entirely as browser JS, HTML and CSS; no database, authentication, leaderboard, or running server.

## One-time repository setup

1. Open the GitHub repository Settings → Pages.
2. Under Build and deployment, set Source to GitHub Actions.
3. Go to Actions → Deploy reconstructed single-player game to GitHub Pages → Run workflow, or push a reconstruction change to main.
4. Check the workflow completes and inspect https://joaodperes.github.io/Astral-Bastion/.

GitHub Pages activation must be performed by a repository admin. The default GitHub Actions token cannot enable the Pages feature on a newly created repository, so the setup step cannot be fully automated with this connection.

The workflow tests the reconstruction, stages only index.html and src/ into a deployment artifact, then publishes that artifact. Relative asset references make the subpath /Astral-Bastion/ work without rewriting URLs.

## Save storage

- The application uses browser localStorage with the existing reconstruction save key astral-bastion-reconstructed-save-v1.
- Progress persists after closing/reopening the page in the same normal browser profile when storage is allowed.
- The game is client-side only: GitHub Pages has no access to the saves, and the original chatgpt.site account progress is **not** migrated.
- Browsers/device profiles do not synchronize their localStorage. Clearing browsing data or using private mode can remove it.
- Settings → Single-player save offers downloadable JSON backups and validated restoration after user confirmation. Backups only work for this reconstruction schema (v1); do not import original live account exports.
- Download a backup before switching devices, browsers, or major updates. Do not post backups or account data to a public issue/repository.
- Future changes to card IDs or save schema should include explicit migration tests.

## Recovering original source

Published JavaScript bundles can reveal some client behavior but not necessarily original source modules, back-end logic, test fixtures, or the game database. We could not access the original published assets through the available site connection in this session. The reconstruction is separate and its feature parity limitations remain documented.
