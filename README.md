# Discogs Duration

A small web app that takes a Discogs release (URL or release ID) and calculates the album's total running time from its tracklist — something Discogs itself doesn't display.

**Status:** MVP is built, deployed, and live-tested against the real Discogs API. Try it: **[blevenstein-atx.github.io/discogs-duration](https://blevenstein-atx.github.io/discogs-duration/)**

## What it does

- Paste a Discogs release URL or release ID (no search — a specific release must already be known).
- The app fetches that release's tracklist from the Discogs API and sums the track durations.
- Handles the real-world shapes Discogs data actually comes in: vinyl/cassette sides (`Side A`, `Side B`), multi-disc box sets (`CD1`, `CD2`, `DVD1`...), and medley/suite tracks that list one combined time instead of per-track times.
- If any track's time is missing or looks malformed, the app refuses to show a total rather than guessing or showing a partial number — an intentional, strict rule (see [Testing](#testing) below for why that mattered in practice).
- Public Discogs data only — no login, no access to anyone's own Discogs account.

Full scope, including the 2.0 and Future roadmap, is in [`Docs/scope.md`](Docs/scope.md). Detailed requirements (with traceability IDs) are in [`Docs/discogs_duration_PRD.md`](Docs/discogs_duration_PRD.md).

## Architecture

![Diagram of the discogs-duration pipeline: local Mac tooling pushes to a public GitHub repo, which triggers a GitHub Actions workflow that deploys to GitHub Pages; from there, a visitor's browser fetches release data directly from the Discogs API.](Docs/architecture-diagram.svg)

Plain HTML/CSS/JS — no framework, no build step, no backend. A push to `main` triggers a GitHub Actions workflow that generates `config.js` from a repository secret (so the Discogs access token is never committed to the repo) and publishes the site to GitHub Pages. From there, a visitor's own browser calls the Discogs API directly.

A full breakdown of what each file does is in [`Docs/code-architecture-overview.md`](Docs/code-architecture-overview.md).

2.0 and beyond introduce a Node.js/React frontend and an AWS-hosted backend — see [`Docs/scope.md`](Docs/scope.md).

## This was a coding-collaborator process, not vibe coding

This project doubles as evidence of what a Product Manager (20 years of BA/PM experience, not a hands-on coder) contributes when directing AI-assisted software development — as distinct from "vibe coding," prompting and accepting whatever comes back without much scrutiny. The distinction isn't just a label; the process here earns it:

- **Scope was fixed before any code existed.** A standing "no building before requirements review" agreement held for the entire requirements phase. PRD v1 was reviewed and explicitly rated *not ready to build against* — a real logical conflict and a broken requirement were found and fixed before v2 was approved.
- **Requirements were reviewed, not just accepted.** The review surfaced a genuine logical conflict (a box-set heading was being used two contradictory ways — a title to sub-total under, and a heading to ignore) and a requirement that turned out to be technically infeasible (detecting when a bare numeric ID collides with an unrelated master release), which testing confirmed rather than assumed.
- **Claims were checked empirically, including Claude's.** Whether a browser could call the Discogs API at all without a custom `User-Agent` header (browser JS can't set one) was resolved with a real `fetch()` test against the live API, not by asking and moving on. The personal-token risk assessment was corrected the same way — an initial "worst case is a rate limit" claim turned out to be wrong once checked against Discogs' own auth documentation; the corrected understanding (full account-level access), not the first answer, is what's on record.
- **Every architectural and tooling choice has a documented reason**, in [`Docs/decision-log.md`](Docs/decision-log.md) — GitHub over GitLab, personal token over OAuth, no framework for MVP, Figma AI here versus Lovable kept to a separate project, and dozens more, each dated with the question, decision, and reasoning.
- **Risk was named and explicitly accepted, not ignored.** The PRD's Risks section states the token-exposure risk plainly and why it's acceptable for this specific audience (personal use plus a small circle of friends) — on the record before any build work, not discovered after the fact.
- **The process kept working after launch, not just before it.** Live testing against real Discogs releases found a real bug (a tracklist entry type the build's assumptions hadn't accounted for, undercounting one release's total) and a real requirements gap (ambiguous group labeling on multi-format box sets) — both traced, fixed, verified against the same live case that surfaced them, and logged with reasoning, the same discipline applied throughout the build.

None of this is how vibe coding works. The decision log is the artifact that makes the difference checkable, not just claimed.

## Why this app

The underlying problem is trivially solvable by just asking an AI assistant directly — anyone could paste a Discogs release URL into a chat and get a duration back. That's deliberate: this app was chosen because it's small enough to fully scope, build, and ship end-to-end while still exercising real engineering surface area (API integration, real-world data edge cases, auth, a deploy pipeline, extensibility planning) — the same reason portfolio projects are usually small, already-solved problems. The demonstration of process is the point, not a gap in the market.

There's still a legitimate case for a tool like this over one-off prompting: deterministic, exact arithmetic against real data instead of an LLM approximating or misremembering track times; no AI dependency to use it day to day; and, the sharper point, it models the pattern AI-assisted engineering should follow more broadly — delegate exact computation to a deterministic tool rather than reasoning it out in language each time.

## MVP → 2.0

Most AI-coding demos are greenfield-only: generate an app from scratch and stop. The plan here is to carry this same codebase from MVP (vanilla JS) into 2.0 (Node/React/AWS), which means a documented case of using AI to iterate on an *existing* codebase under real constraints — established scope, working functionality that can't regress, a migration rather than a rewrite — a different and arguably more common real-world skill than one-shot generation.

## Practices applied

- **Docs as code** ([docslikecode.com](https://www.docslikecode.com)) — scope, requirements, decisions, and test data are plain text/markdown, version-controlled in this repo alongside the app itself, not kept in a separate wiki or notes app.
- **Figma AI** for the MVP's UI concepts (see [`Docs/figma-concepts/`](Docs/figma-concepts/)) — lightweight AI-assisted design exploration, kept distinct from the app-building tooling. (Plain Figma design files, not Figma Make, which generates its own app code and repo.)
- **Postman + an OpenAPI spec** ([`postman/`](postman/)) for exercising and documenting the two Discogs endpoints this app uses, ahead of and alongside the app code itself.

## Testing

Manual and live, deliberately — no test framework for MVP (a v2 scope item introduces automated regression testing). [`Docs/discogs_duration_test_data.md`](Docs/discogs_duration_test_data.md) maps one real Discogs release (or, for a handful of edge cases that don't occur on real data, a synthetic example) to every requirement ID in the PRD. Every live-testable case has been run against the deployed app and the real Discogs API; results and any findings are in the decision log. A few genuinely rare edge cases (malformed upstream data, a release missing its tracklist entirely, a merged/deleted release, a network failure) were deliberately left untested for MVP as a logged scope decision, not an oversight.

## Repo layout

- [`Docs/scope.md`](Docs/scope.md) — MVP / 2.0 / Future roadmap.
- [`Docs/discogs_duration_PRD.md`](Docs/discogs_duration_PRD.md) — detailed requirements, with traceability IDs linking to the test data below.
- [`Docs/discogs_duration_test_data.md`](Docs/discogs_duration_test_data.md) — one real (or synthetic) test case per requirement ID.
- [`Docs/decision-log.md`](Docs/decision-log.md) — dated record of every tooling, architecture, and requirements decision, and why.
- [`Docs/code-architecture-overview.md`](Docs/code-architecture-overview.md) and [`Docs/architecture-diagram.svg`](Docs/architecture-diagram.svg) — what each file does and how the deployment pipeline fits together.
- [`Docs/figma-concepts/`](Docs/figma-concepts/) — the AI-generated UI mockups the MVP's visual design targets.
- [`postman/`](postman/) — OpenAPI spec and Postman collections for the Discogs endpoints this app uses.
- [`.github/workflows/`](.github/workflows/) — the GitHub Actions deployment pipeline.
- `index.html`, `styles.css`, `app.js`, `config.example.js` — the app itself.
