# Security Policy

## Reporting a vulnerability

Do **not** disclose account-related flaws, authentication bypasses, leaked secrets, or exploitable save-state vulnerabilities in a public issue.

Contact the repository owner privately via GitHub's profile or repository private vulnerability reporting (if enabled). Include a clear reproduction, impact, and any relevant logs with secrets removed.

## General precautions

- Do not commit private tokens, signing keys, credentials, or private player data.
- Review permissions and secrets before enabling GitHub Actions or hosting.
- Treat imported save files and player-submitted content as untrusted input.
- Do not expose privileged deployment or database credentials to browser code.
