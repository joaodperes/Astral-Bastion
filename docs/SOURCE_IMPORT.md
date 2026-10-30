# Import the playable Astral Bastion source

This starter **does not contain the game's actual source code**. The live project is currently hosted separately:

https://astral-bastion.shadyape128.chatgpt.site/

An earlier project session produced an `astral-bastion-source.zip` export with tests and a GitHub Pages workflow, but that archive was **not available in this session**.

## Recommended import

1. Obtain the **latest** export from the Astral Bastion project/editor. Prefer the latest source over the 28 October archive because the game changed after that export.
2. Unpack it locally and inspect file contents before publishing. In particular, check for credentials and third-party art/audio.
3. Copy game source, assets, tests and its build configuration into the repository, preserving relative paths.
4. Keep or reconcile this repository's README, license, contribution policy, `AGENTS.md` and expansion plan.
5. Test the build and a fresh/existing-save gameplay flow.
6. Set up a deployment workflow suited to the **actual** build output. Do not deploy a docs-only repository as the playable game.

## Push after creating the empty GitHub repository

From a local folder containing the combined source and starter docs:

```bash
git init -b main
git add .
git commit -m "Import Astral Bastion source and repository documentation"
git remote add origin https://github.com/joaodperes/Astral-Bastion.git
git push -u origin main
```

If the GitHub repository was initialized with a README/license through the website, first clone it or pull its history instead of overwriting commits.

## GitHub Pages

The prior export reportedly included a GitHub Pages workflow. Validate whether it matches the latest game's build system and correct asset base path before enabling it. The current `chatgpt.site` deployment does not automatically sync with GitHub.
