# Preserved upstream workflows

These files are retained from Goose v1.56.0 as source reference. They are intentionally outside `.github/workflows` so this independent Windows distribution does not run upstream's release, bot, publishing or cross-platform infrastructure. No upstream workflow has been executed for Kivou.

Kivou's focused checks are manual-only in `.github/workflows/kivou-checks.yml`. They never make a model call or publish a release.
