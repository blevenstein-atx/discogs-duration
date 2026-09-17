# Decision Log

A running record of questions, decisions, and reasoning behind this project's tooling, architecture, and requirements choices — kept alongside `scope.md` and the PRD as part of this project's docs-as-code practice ([docslikecode.com](https://www.docslikecode.com)).

**How this doc works:** each entry is a discrete question that came up, what was decided, and why — dated to when the decision was made (some early dates are approximate, inferred from git history, since this log started retroactively). New entries are appended to the bottom of the log as they arise, rather than inserted chronologically in the middle, to keep diffs small and reviewable. Unresolved items live in their own section at the end and move up into the dated log once they're actually decided.

---

## Log

### 2026-09-09 — Tooling
**Question:** Which git hosting platform — GitHub or GitLab?<br>
**Decision:** GitHub.<br>
**Reasoning:** Broader ecosystem familiarity (GitHub Actions, Pages, `gh` CLI) that's more commonly asked about in job postings than GitLab equivalents.

### 2026-09-09 — Tooling
**Question:** Install Homebrew, Node.js, and GitHub CLI locally, even though a static JS site doesn't strictly require Node.js to run in the browser?<br>
**Decision:** Install them anyway.<br>
**Reasoning:** Hands-on familiarity with the standard local dev toolchain was an explicit learning goal for this project, independent of whether the MVP itself needs it.

### 2026-09-09 — Architecture
**Question:** Discogs auth approach for the MVP — OAuth, or a personal access token?<br>
**Decision:** Personal access token.<br>
**Reasoning:** MVP only reads public release data and never accesses the user's own Discogs account, so OAuth's added complexity isn't needed. Deferred to Future scope, where it would support pulling from the user's own account.

### 2026-09-09 — Requirements
**Question:** Register a formal Discogs "Application" (full OAuth client), or is a personal access token enough?<br>
**Decision:** Personal access token only; skip formal app registration for MVP.<br>
**Reasoning:** App registration is for OAuth flows this project doesn't use yet.

### 2026-09-09 — Architecture
**Question:** Use a frontend framework (React, etc.), or plain JS?<br>
**Decision:** No framework for MVP — plain vanilla HTML/CSS/JS, no build step.<br>
**Reasoning:** Keeps the MVP simple and fast to ship; framework experience is deliberately deferred to the 2.0 roadmap (Node.js/React) as a separate learning milestone.

### 2026-09-09 — Architecture
**Question:** Where to host the MVP?<br>
**Decision:** GitHub Pages, deployed via a GitHub Actions static-site workflow.<br>
**Reasoning:** Free (on a public repo), and matches the no-backend/no-build static approach. Confirmed the Discogs API sends CORS headers permitting direct browser calls, so no proxy/backend is needed to make this work.

### 2026-09-11 — Requirements
**Question:** Should MVP include Discogs search, user authentication, or AWS?<br>
**Decision:** No to all three for MVP — release URL/ID entry only, public data only, no AWS. All three deferred (search and OAuth to Future, AWS to 2.0).<br>
**Reasoning:** Bruce's own explicit scoping — keeps the MVP small enough to fully ship while still exercising real engineering surface area (API integration, edge cases, deploy pipeline).

### 2026-09-13 — Requirements
**Question:** How should scope be organized so MVP architecture choices can be made with extensibility in mind, without pulling later-phase features into the MVP itself?<br>
**Decision:** A three-tier roadmap — MVP / 2.0 / Future — documented in `Docs/scope.md`.<br>
**Reasoning:** Having the full intended trajectory in writing up front lets implementation decisions be weighed against where the app is headed, not just what's needed today.

### 2026-09-13 — Tooling
**Question:** What format for the API documentation — a Postman-native "v3 YAML" format, or something else?<br>
**Decision:** OpenAPI 3.0 YAML, imported into Postman to auto-generate a collection.<br>
**Reasoning:** Postman collections have no v3 YAML schema (only JSON v1.0/2.0/2.1) — OpenAPI is the actual standard, machine-readable spec format for this.

### 2026-09-13 — Tooling
**Question:** Postman's file-based workspace sync generates a `postman/` folder plus a hidden `.postman/` local-state folder — what gets committed to the repo?<br>
**Decision:** Commit `postman/specs`, `postman/collections`, and `postman/globals`; gitignore `.postman/`.<br>
**Reasoning:** The specs/collections are meaningful project documentation worth versioning; `.postman/` is local app state, in the same category as `.vscode/`.

### 2026-09-14 — Requirements
**Question:** Should the full MVP/2.0/Future scope be written and reviewed by Bruce before Claude makes implementation/extensibility decisions?<br>
**Decision:** Yes — confirmed as a standing working agreement for this project.<br>
**Reasoning:** Discussed directly: having explicit scope in writing measurably changes how implementation choices get weighed toward deliberate engineering judgment (testability, separation of concerns, extensibility) rather than just "what works for the MVP today." This is the core process difference this project is meant to demonstrate.

### 2026-09-14 — Process
**Question:** Where should scope, requirements, and API docs live?<br>
**Decision:** As plain text/markdown in the GitHub repo (`Docs/`, `postman/`), not in Apple Notes or Claude's own Project docs.<br>
**Reasoning:** Docs as code ([docslikecode.com](https://www.docslikecode.com)) — a named practice Bruce is deliberately applying, worth citing in the final README.

### 2026-09-14 — Architecture
**Question:** For the 2.0 architecture, is the intended split "Vercel/Netlify hosts the frontend, AWS hosts the backend/API" — two complementary pieces, not competing choices?<br>
**Decision:** Confirmed yes.<br>
**Reasoning:** A Node/React frontend needs a host (Vercel/Netlify replacing GitHub Pages); AWS (Lambda, presumably, via API Gateway) becomes the backend/API layer once server-side logic exists in 2.0.

### 2026-09-15 — Requirements
**Question:** GitHub's own UI prompts to add a README — add one now, or wait until the project's finished as originally planned?<br>
**Decision:** Add a short interim README now (what the app does, current status, links to scope/PRD); keep the full architecture-and-decisions README deferred to project completion.<br>
**Reasoning:** Satisfies GitHub's onboarding nudge without prematurely duplicating the final deliverable, which needs the finished app to describe accurately.

### 2026-09-16 — Tooling / Process
**Question:** How to get genuine hands-on exposure to "AI-assisted workflow" / "AI prototyping" tooling (increasingly named in PM job postings) without diluting this project's own scope?<br>
**Decision:** Three separate, deliberately distinct exercises: this project stays scoped to directing a general AI coding collaborator (Claude) with Bruce owning scope and architecture decisions; Figma AI used within this project for lightweight UI-concept generation; Lovable used only in an entirely separate side project, since it's a full prompt-to-deployed-app builder (own repo, backend/auth, hosting) — not a UI prototyping tool — and merging it into `discogs-duration` would add a second codebase/deployment with no real benefit.<br>
**Reasoning:** Produces three distinct, nameable interview stories instead of one project trying to prove everything: AI-assisted engineering collaboration, AI-assisted design exploration, and AI-native app building.

### 2026-09-16 — Requirements / Scope
**Question:** Should Lovable be used to prototype the (currently deferred) Discogs Search feature before committing it to the real roadmap?<br>
**Decision:** Yes — added "Use Lovable to prototype Discogs Search POC" to the v2 section of `scope.md`, explicitly worded as a spike, not a scope commitment.<br>
**Reasoning:** Cheaply de-risks a complex, currently-deferred feature (chaining search → select release → duration) before deciding whether/how it enters the real roadmap. Also previews the backend/token-handling questions the 2.0 architecture will face for real, since Lovable-generated apps get a real backend rather than exposing secrets client-side.

### 2026-09-17 — Requirements
**Question:** Is PRD v1 (`Docs/discogs_duration_PRD.md`) ready to build against?<br>
**Decision:** Not yet — a full requirements review was performed before any build work, per the standing "no building before requirements review" agreement. Rated 8/10: strong structure and edge-case instinct, docked for one real logical conflict and a handful of gaps (see Open Questions below).<br>
**Reasoning:** Matches this project's core practice of treating requirements review as a distinct, visible step rather than something folded silently into the build.

### 2026-09-17 — Process
**Question:** Clean up the typos throughout PRD v1?<br>
**Decision:** Yes — spelling/typo pass committed, no content changes except restoring one accidentally-dropped word ("does **not** calculate...") and fixing a skipped use-case step number.<br>
**Reasoning:** Requested as a distinct cleanup pass, separate from the substantive requirements review above.

### 2026-09-17 — Requirements / Scope<br>
**Question:** A real PRD would normally include non-functional requirements (performance, traceability, observability, logging) — worth including for this personal MVP?<br>
**Decision:** Not for MVP. Added to Future scope instead: basic API request/response logging (e.g. to Postgres), plus reports/analytics built on top of that logging once it exists.<br>
**Reasoning:** Full NFR treatment isn't warranted for a personal project's MVP, but logging is a reasonable, well-scoped stepping stone toward the "Basic APM tooling" Future item already in scope, and a foundation for later analytics. Explicitly depends on the AWS backend from 2.0 already existing — a static/no-backend app can't write to a database directly from the browser without exposing database credentials to every visitor — so it's correctly placed in Future, not 2.0.

---

## Open Questions / Unresolved

Items raised during reviews that don't have a decision yet. Once resolved, move the entry up into the dated log above.

- **Box-set/multi-item header disambiguation:** the PRD uses tracklist section headers both as item/disc titles to sub-total under (e.g. "Live In Tokyo 1985") *and* as things to ignore (e.g. "Bonus Tracks") — but both are the identical data shape (`type_: "heading"`) in Discogs' API. No rule yet distinguishes them. *(Raised 2026-09-17)*
- **Partial-data granularity:** does one item (not all) in a multi-item box set having *some* but not *all* track times missing block just that item's subtotal, or the whole Grand Total? *(Raised 2026-09-17)*
- **Master-ID shorthand notation:** is `m<id>` / `[m<id>]` an actual real-world Discogs convention, the way `r<id>` is used for releases, or an assumed-by-symmetry convention that should be dropped? *(Raised 2026-09-17)*
- **UI details not yet specified:** loading/pending state during the API call, disabling the button during an in-flight request, an explicit "Clear" action vs. just re-typing and resubmitting, and whether "copy to clipboard" means a literal button or just copy-friendly text formatting. *(Raised 2026-09-17)*
- **Minor formatting decisions:** zero-padded `hh:mm:ss` vs. dropping the hours segment under an hour; how multiple credited artists / "Various" compilations should display; case/whitespace tolerance for `r`/`m` ID prefixes. *(Raised 2026-09-17)*
- **User-Agent feasibility risk:** browser JS cannot set a custom User-Agent header (forbidden header) — Discogs asks API clients to self-identify, and whether it accepts requests carrying only a browser's default User-Agent is untested. This is foundational to whether the no-backend MVP architecture works as scoped; worth testing directly rather than discovering mid-build. *(Open since early project setup; reiterated 2026-09-17)*
- **Token secrecy tradeoff:** a personal Discogs token cannot actually be kept secret in a pure static/no-backend architecture — it ships to the browser and is readable by anyone inspecting the deployed site's network traffic, regardless of what's gitignored in the repo. Treated informally as an acceptable tradeoff for a personal token against public/read-only data, but not yet explicitly signed off as a final decision. *(Open since early project setup; reiterated 2026-09-17)*
