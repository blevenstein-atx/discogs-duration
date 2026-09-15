# Discogs Duration

A small web app that takes a Discogs release (URL or release ID) and calculates the album's total running time from its tracklist — something Discogs itself doesn't display.

**Status:** In the requirements/scoping phase. No application code has been written yet — the current focus is defining scope, requirements, and infrastructure before any code is written (see [Approach](#approach) below).

## What it does (MVP)

- User enters a known Discogs release URL or release ID (no search).
- App fetches the release's tracklist from the Discogs API and sums the track durations.
- App displays the total running time, with handling for common edge cases (missing/incomplete track times, multi-disc releases).
- Public Discogs data only — no login, no access to the user's own Discogs account.

Full scope, including the planned 2.0 and future roadmap, is in [`Docs/scope.md`](Docs/scope.md). Detailed MVP requirements (use cases, error handling) are in [`Docs/discogs_duration_PRD.md`](Docs/discogs_duration_PRD.md).

## Planned MVP architecture

- Plain vanilla HTML/CSS/JS — no framework, no build step.
- Hosted on GitHub Pages, deployed via the GitHub Actions workflow in [`.github/workflows/static.yml`](.github/workflows/static.yml).
- Talks directly to the [Discogs API](https://www.discogs.com/developers) from the browser (`api.discogs.com`), authenticated with a personal access token — no backend for the MVP.

2.0 and beyond introduce a Node.js/React frontend and an AWS-hosted backend; see `Docs/scope.md` for details.

## Repo layout

- `Docs/` — scope, roadmap, and requirements docs (written as part of this project's [docs-as-code](https://www.docslikecode.com) approach — plain text, version-controlled alongside the app, not kept in a separate wiki or notes app).
- `postman/` — Postman collection and OpenAPI spec for the two Discogs endpoints the app uses (`GET /releases/{release_id}`, `GET /database/search`).
- `.github/workflows/` — GitHub Actions deployment pipeline.

## Approach

This project is being built deliberately rather than one prompt at a time: scope and requirements are written and reviewed before any code is generated, infrastructure choices are made with the MVP-to-2.0 roadmap in mind, and the process itself is part of the point. A full write-up of the architecture, tools, and decisions (and why) will replace this section once the MVP is built.
