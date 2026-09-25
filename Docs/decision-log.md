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

### 2026-09-18 — Requirements<br>
**Question:** Is the `[m<id>]` bracket notation (parallel to `[r<id>]` for releases) an actual real-world Discogs convention, or an assumed-by-symmetry rule that should be dropped from input validation?<br>
**Decision:** Confirmed real. Bruce found it directly in Discogs' own UI — the release/master page header shows `[r...]`/`[m...]` with a click-to-copy affordance — so a user could plausibly copy this straight off the site and paste it into the app. Validation logic for both stays as specified.<br>
**Reasoning:** Resolves the open question raised in the 2026-09-17 review with a primary-source screenshot rather than a guess.

### 2026-09-18 — Requirements<br>
**Question:** PRD v2 addressed the prior review's findings — full re-review before continuing toward a build.<br>
**Decision:** Nearly all prior findings resolved cleanly: loading state, Clear button, copy-to-clipboard (see below), artist/format comma-joining, ID prefix case/whitespace strictness, `hh:mm:ss` padding, the multi-item partial-data granularity question (simplified to one strict all-or-nothing rule), and the heading-disambiguation conflict (resolved by removing the "ignore some headers" carve-out — every heading now gets its own sub-total). One new issue found: see the refined Open Question below about the new master-release success-case rule.<br>
**Reasoning:** Matches the standing practice of reviewing requirements as a distinct step before building.

### 2026-09-18 — Requirements / Scope<br>
**Question:** Should the results section have a literal Copy-to-clipboard button for MVP?<br>
**Decision:** No — MVP stays with clean, manually-selectable text. A literal Copy button (Clipboard API) added to Future scope instead.<br>
**Reasoning:** Keeps MVP simple; the Clipboard API is a small, well-scoped enhancement that doesn't need to block MVP delivery.

---

### 2026-09-18 — Requirements<br>
**Question:** Follow-up on the master-release success-case rule flagged as infeasible — confirm and resolve.<br>
**Decision:** Removed the rule from the PRD. Confirmed infeasible with a direct test: querying `/releases/87442` (the numeric ID from Stevie Wonder's *Hotter Than July* master URL) returned a completely unrelated real release ("House Of Jazz — The Soul Package") with a `200 OK` and no error or warning of any kind. The `master_id`/`master_url` fields present in that response are ordinary per-release metadata (which master group *that* release belongs to) and have no connection to the queried number — there is no field anywhere in the response that flags "this number is also used elsewhere as a master ID." The existing Release metadata display (Artist/Title/Format always shown) remains the only, informal mitigation — a user can notice the returned album is wrong.<br>
**Reasoning:** Confirms the 2026-09-17 forum-based finding with a direct, reproducible test against the real API, removing any doubt.

### 2026-09-18 — Requirements / Scope<br>
**Question:** The bare-numeric master/release ID collision is confirmed real and not rare (both ID sequences are dense and long-running) — worth fixing rather than leaving as an accepted MVP risk indefinitely?<br>
**Decision:** Added "Improve release ID input handling" to v2 scope, rather than changing MVP scope now. Two candidate approaches noted for when it's tackled: require a full URL only (simpler, but narrows the current "URL or release ID" MVP scope statement), or keep bare release-ID input but require the `r` prefix and drop support for a totally unprefixed number (keeps more of the current scope, since `r`/`m`-prefixed and full-URL input are already unambiguous — only a bare, unprefixed integer has zero type context).<br>
**Reasoning:** Not critical enough to block or change MVP, but real enough (confirmed via direct test, not rare) to fix deliberately in v2 rather than carry indefinitely as an informal, undocumented risk.

### 2026-09-18 — Architecture<br>
**Question:** Does Discogs accept an API request from real browser JS, which can't set a custom User-Agent at all and silently sends the browser's own default instead — the foundational risk to the whole no-backend MVP architecture?<br>
**Decision:** Confirmed yes. Tested directly with a `fetch()` call from a real webpage's dev tools console (not an internal Chrome page, which has its own restrictive CSP and gave a false alarm on the first attempt) — got back a `200`.<br>
**Reasoning:** This was the single biggest open architectural risk in the project — if Discogs had rejected or throttled requests without a custom User-Agent, the static/no-backend MVP approach wouldn't have worked at all. Now tested and confirmed rather than assumed. Note: tested in Chrome; Bruce's actual daily/target browser is Safari, not yet independently tested. Expected to behave the same, since the forbidden-header behavior is part of the standard Fetch spec implemented identically across browsers, not a Chrome-specific quirk — but worth a quick confirmation in Safari's Web Inspector console too, since that's the browser that actually matters for real usage.

---

### 2026-09-18 — Architecture<br>
**Question:** Is the token-secrecy tradeoff (it will be visible to anyone inspecting the deployed site's network traffic) acceptable, now that its actual scope is understood correctly?<br>
**Decision:** Accepted, with the scope correctly understood: a personal access token grants full account-level access for the token holder (collection, wantlist, marketplace orders, private inventory) — not just a rate-limit nuisance, as initially assumed. Confirmed against Discogs' own authentication docs, which distinguish key+secret (no user identity, no account access) from either token type (account access for the token holder). Acceptable specifically because this app won't be shared beyond Bruce and a personal circle of friends — not a decision that would hold for a publicly shared app.<br>
**Reasoning:** The risk didn't change; the understanding of it did. Worth recording the corrected scope so this isn't re-accepted later under the original, inaccurate "worst case is rate limit" premise if the app's audience ever grows.

### 2026-09-18 — Architecture<br>
**Question:** How should the token actually be held and rotated, given `config.js` is gitignored but GitHub Pages only serves what's committed to the repo — so a gitignored file never reaches the deployed site at all?<br>
**Decision:** Store the token as a GitHub Actions repository secret rather than a local gitignored file, and have the existing deploy workflow (`static.yml`) generate `config.js` from that secret as a build step before publishing to Pages. Rotation: generate a new token on Discogs (replaces the old one), update the Actions secret, redeploy — no code changes, nothing to find in git.<br>
**Reasoning:** Matches standard practice for a static site needing one secret at deploy time, and matches Bruce's own professional guidance to customers — credentials as a parameter stored outside the code, for easy rotation — applied to this project's own architecture. Also meaningfully reduces exposure versus committing the token directly: a secret sitting in a public repo's history gets found by automated secret-scanning at scale, while runtime-only exposure requires someone to actually visit the site and inspect traffic. To be implemented alongside actual app building, since no code exists yet to consume `config.js`.

### 2026-09-21 — Tooling / Process<br>
**Question:** Now that a Figma MCP plugin is connected directly in this Claude session, should Claude drive Figma itself to generate the UI concepts, replacing the plan to have Bruce prompt Figma AI himself?<br>
**Decision:** Not yet — stick with the original plan (Bruce prompts Figma AI directly, for his own hands-on reps) for the MVP UI concepts now. Revisit having Claude drive Figma directly via the MCP plugin as a v2 exercise.<br>
**Reasoning:** The two options tell different interview stories: Bruce driving Figma AI himself demonstrates his own hands-on exposure to an AI design tool, which is the reason this exercise was scoped into the project in the first place (2026-09-16). Claude driving Figma directly is a different, also-legitimate story — an AI coding collaborator connected to a design tool via MCP — but replacing the original plan now would mean losing the hands-on reps Bruce specifically wanted. Deferred rather than dropped, since it's a real option worth trying once the project reaches v2.

### 2026-09-21 — Requirements<br>
**Question:** Bruce wants to compile a test-data set (one Discogs URL per case in the PRD) and link each URL to the specific requirement it covers — how should requirements be identified for that mapping?<br>
**Decision:** Added short traceability IDs to every testable requirement in the PRD: `UC-1`–`UC-5` for the five Use Cases, `IN-1`–`IN-2` (Input), `IV-1`–`IV-6` (Input Validation), `UI-1`–`UI-8` (Input UI), `RU-1`–`RU-8` (Results UI), `DC-1`–`DC-7` (Duration Calculation success cases), `DF-1`–`DF-6` (Duration Calculation failure cases), and `AF-1` (API/Network failures). Problems, Assumptions, and Risks are context, not testable requirements, and were left without IDs.<br>
**Reasoning:** The PRD's requirements were written as plain prose paragraphs with no stable identifier, so a test-data document would have had nothing to point at except re-describing each case. Bruce plans to build a companion test-data document (one URL per ID) once this exists.

### 2026-09-21 — Requirements / Scope<br>
**Question:** Once a test-data doc exists (one URL per requirement ID), how will it actually get used — will Claude automatically build the app, run every case, and produce a report?<br>
**Decision:** For MVP, testing stays manual: Claude walks through the test-data doc case by case using browser automation against the running app and reports what actually happened per requirement ID, on request. No test framework or automated regression suite for MVP. Added a v2 scope item to introduce automated test execution (e.g. Playwright) that re-runs the full test-data set and reports pass/fail per ID.<br>
**Reasoning:** No automated testing was ever scoped into the MVP PRD, and adding a test framework now would be scope creep inconsistent with keeping the MVP small. A manual, on-request walkthrough is sufficient for a personal project at this size and doesn't require new tooling. Automated regression testing is genuinely useful once the app exists and changes over time, which fits naturally into v2 rather than MVP.

### 2026-09-22 — Requirements<br>
**Question:** The test-data plan is one real Discogs URL per requirement ID — can DF-1 (malformed duration strings, e.g. seconds > 59 like `5:76`, or track times of `0:00`) actually be sourced from a real, live release?<br>
**Decision:** No known real-world example was found, and none is expected to reliably exist or persist. DF-1 will be tested with hand-crafted synthetic/mocked API response data once app code exists, rather than a live Discogs URL like every other case in the test-data set.<br>
**Reasoning:** Discogs' track-time field is almost certainly format-validated at entry, so a malformed string like `5:76` likely can't be saved through the normal editing UI at all. `0:00` is more plausible as a literal placeholder entry, but no confirmed example was found either. More fundamentally, Discogs is actively curated by a community that treats data-quality issues (like incorrect durations) as something to fix — the "Complete & Correct" status editors care about — so even a real example found today could be corrected before the test-data doc is used against it. Mocked data tests this case deterministically instead of depending on a fragile, editable, third-party data point.

### 2026-09-22 — Requirements<br>
**Question:** UI-1 originally said the app should try to copy Discogs' own site styling for MVP, possibly deferred to v2/React if not achievable. Now that real Figma AI concept mockups exist and look good, should MVP still target literal Discogs-style visual matching?<br>
**Decision:** No — MVP targets the Figma AI mockups already in `Docs/figma-concepts/` as the actual visual spec, not Discogs' own site styling. Updated `UI-1` in the PRD accordingly. Also noted: in v2, React with Material UI components may let the app look more polished than Discogs' own site, not just match it — a stretch goal, not a requirement.<br>
**Reasoning:** The Figma mockups are a better, already-validated visual target than an open-ended "try to copy Discogs" instruction — concrete and already reviewed, versus vague and open to endless polishing against a moving target (Discogs' own site). Matches the earlier UI-1 note that hand-matching another site's exact styling in plain CSS is more time investment than framework work is worth for MVP.

### 2026-09-23 — Requirements / Implementation<br>
**Question:** Build started on the MVP. Two things the PRD didn't fully pin down needed a concrete answer in code: (1) exact hh:mm:ss padding when a release is over an hour (DC-2 only specifies the under-an-hour case), and (2) how to actually parse Discogs' tracklist data into side/item/medley groups for DC-3–DC-7, since the PRD describes the desired output but not the API's underlying data shape.<br>
**Decision:** (1) Matched the Figma mock's own example ("01:22:10") — zero-padded two-digit hours/minutes/seconds whenever the release is an hour or longer, unpadded minutes only when it's under an hour, per DC-2's explicit example. (2) Implemented grouping as: `type_:"heading"` entries with `sub_tracks` become named item groups (box-set discs, DC-6); a heading whose sub_tracks all lack individual times falls back to the heading's own duration (DC-7 medley case); tracks without a heading are grouped by `position` prefix — a leading number before a dash (`1-1`, `2-1`) as a disc/item (DC-4/DC-5), a leading letter (`A1`, `AA`) as a side (DC-3). Any missing or malformed track time anywhere aborts the whole calculation (DF-1/DF-2/DF-3), matching the strict all-or-nothing rule already in the PRD.<br>
**Reasoning:** Both are reasonable, PRD-consistent interpretations, but neither has been verified against a real Discogs API response yet — no live API access was available during the build itself (verified with a Node unit-test harness against synthetic tracklist data and against every input-validation case in `Docs/discogs_duration_test_data.md`, 36/36 passing, but not against the real DC/DF example URLs in that same doc). Flagged for Bruce to confirm once the app is deployed/tested with a real token, and to revise if real data doesn't match these assumptions.

### 2026-09-23 — Implementation / Bug fix<br>
**Question:** The prior entry (build-implementation-decisions) flagged the tracklist-grouping logic as unverified against real Discogs API data. Now that the app is deployed with a real token, live testing against the test-data doc's DC/DF example URLs found: does the grouping logic hold up against real API responses?<br>
**Decision:** Mostly yes, with one real bug found and fixed. Live-tested against `release/46547` (DC-3, sides), `release/1532118` (DC-4, numbered items), `release/32391060` (DC-5, box set with mixed formats), and `release/4000806` (DC-7, medley). Found: `computeDurations()` was unconditionally skipping `type_:"index"` tracklist entries (`if (entry.type_ === "index") continue;`), on the assumption these were rare/non-track entries. Live data from `release/4000806` (Genesis, "The Lamb Lies Down On Broadway") showed the medley entry "The Colony Of Slippermen" is actually `type_:"index"` (not `"heading"` as assumed during the build), with its own `duration: "8:00"` and three `sub_tracks` all with empty duration strings — meaning it needed the same heading/medley fallback resolution, but was instead silently dropped, undercounting the release's grand total by ~8:00. Fixed by routing `type_:"index"` entries through the same `resolveHeadingGroup()` path as `type_:"heading"` entries (commit `1f9fab0`). Re-verified locally (37/37 Node unit-test cases, including a new case using the exact real API shape from `release/4000806`) before committing.<br>
**Reasoning:** This is exactly the kind of unverified assumption the prior entry flagged as a build-time risk — real data disconfirmed the `type_` value assumed for medley/suite entries while confirming the general "fall back to the header's own duration when sub_tracks have none" logic was otherwise correct. Documenting per the standing practice of logging implementation decisions and corrections, not just plans.<br>

Two other live-testing findings, not yet resolved:<br>
- `release/32391060` (DC-5, New Order "Brotherhood" box set: vinyl + CD + 2x DVD) computes the correct grand total, but labels the CD/DVD groups "Side CD" / "Side DVD" — the position-prefix grouping heuristic treats any letter-prefixed position (e.g. `CD1`, `DVD1`) as a "side," which reads oddly outside the vinyl case it was designed for. Math is correct; this is a labeling/wording issue only, flagged for Bruce to decide on a fix (e.g. drop the "Side" prefix for non-vinyl format labels).<br>
- The test-data doc's `DC-6` URL (`master/192783-Kate-Bush-...`) is a master release URL, which the app correctly rejects per `IV-5`/`IV-6` — meaning this test case can never actually reach the box-set/heading duration logic it's meant to exercise. Needs a real `/release/` URL replacement from Bruce.

### 2026-09-23 — Testing<br>
**Question:** Continuing the live test-data pass: does the rest of `Docs/discogs_duration_test_data.md`'s live-testable set (RU-5/RU-6, RU-7, DF-2, DF-3) hold up against the real Discogs API and deployed app, ahead of the `type_:index` fix (above) being pushed/redeployed?<br>
**Decision:** RU-7 (`release/2240787`, Tony Bennett & Bill Evans, multi-artist), DF-2 (`release/191013`, missing-time standard release), and DF-3 (`release/16000948`, missing-time box-set item) all passed as specified. Also ran an unplanned bonus 404 case (a made-up release ID) since a live 404 needed no mocked data — passed, correct "does not exist" message. RU-5/RU-6's URL (`release/25863751`, New Order "Low-life" box set) could not actually be tested as a success case: the release's real Discogs data has empty `duration` on all of its vinyl-side tracks (A1–B4), so the app correctly returns the missing-time error per the DF-2 all-or-nothing rule — this test case's URL doesn't meet its own precondition (all tracks timed) on real data. Inspecting that release's raw tracklist also confirmed the DC-5 "Side CD"/"Side DVD" labeling issue isn't unique to the Brotherhood box set — any multi-format release grouped by position prefix hits the same letter-prefix-means-"Side" heuristic (`CD1-1`, `DVD1-1`, etc. all match the side-grouping regex).<br>
**Reasoning:** Same practice as the entry above — real data can disconfirm a test case's assumptions as easily as it can disconfirm app logic, and both are worth recording distinctly. RU-5/RU-6 needs a replacement URL from Bruce, same as DC-6, once he has a working multi-format-with-full-track-times example. DC-7 re-test (to confirm the `type_:index` fix, commit `1f9fab0`) is pending Bruce pushing that commit and Pages redeploying.<br>

### 2026-09-23 — Testing<br>
**Question:** Did the `type_:index` fix (commit `1f9fab0`) actually resolve DC-7 once deployed?<br>
**Decision:** Confirmed live against `release/4000806` (Genesis, "The Lamb Lies Down On Broadway") after Pages redeployed at commit `045367c` (run #28): "The Colony Of Slippermen" now appears as its own breakdown group at 8:00, and the grand total moved from the prior undercounted `01:29:29` to the correct `01:37:29` — exactly the expected +8:00. DC-7 is closed.<br>
**Reasoning:** Closing the loop per the standing practice of confirming a fix against the same live case that surfaced the bug, not just re-running the unit-test harness.<br>

### 2026-09-23 — Testing / Scope<br>
**Question:** DF-1 (malformed track duration), DF-4 (release with no tracklist at all), DF-6 (410 Gone response), and AF-1 (network/API failure) all remain marked in the test-data doc as "to be tested with mocked/synthetic API response data" — none occur naturally on a real Discogs release, so none could be exercised in the live test pass. Should MVP testing produce synthetic/mocked fixtures to cover these before calling testing done?<br>
**Decision:** No — these four are being deliberately left untested for MVP. They're edge cases (malformed upstream data, a release missing its tracklist, a merged/deleted release, a network failure) that the code already handles per the PRD's stated rules, and the live test pass already validated the closely-related, more-common cases that share the same code paths: DF-2/DF-3 (missing, rather than malformed, duration) and the bonus live 404 test (not-found, rather than gone). Building out a mocked-response test harness just to cover these four is deferred, consistent with the earlier decision to keep MVP testing manual/live rather than building automated infrastructure (see the manual-vs-automated testing entry above, and the v2 scope item for automated regression testing).<br>
**Reasoning:** Diminishing returns for MVP — the marginal risk left in these four paths is low (simple, already-reviewed conditional branches) relative to the cost of standing up mocked-response test fixtures, and the project's stated goal at this stage is a working, well-documented MVP, not exhaustive test coverage. Explicitly logging this as a scope decision rather than leaving it an open question, since not testing something is itself a decision worth being able to point to later.<br>

### 2026-09-25 — Requirements / Implementation<br>
**Question:** DC-8/DC-9 (new requirements, added after the "Side CD"/"Side DVD" labeling issue found during live testing) specify that vinyl/cassette sides keep a "Side" label (DC-8), while CD/DVD groups should use a bare format code when there's only one of that format, or a numbered code when there's more than one (DC-9). The PRD text doesn't say how to detect "bare vs. numbered" from the raw position data — how should that be implemented?<br>
**Decision:** Split the old single regex (which grouped any letter-prefixed position together) into two: a no-dash pattern for sides (`A1`, `AA1` → DC-8) and a dash-separated pattern for format codes (`CD1-1`, `DVD2-3` → DC-9). For format-code groups, count how many distinct groups share the same letters (e.g. "CD"); exactly one → bare label ("CD"), more than one → numbered labels ("CD1", "CD2"). Side and format-code groups now render together rather than being mutually exclusive, since a mixed box set (vinyl + CD + DVD) needs both at once — this also fixed a second, previously-undetected bug: the old regex merged all DVD tracks across multiple discs into a single bucket (since it only captured letters, ignoring the digit), so a 2-DVD box set was being under-grouped, not just mislabeled. Verified locally with a new unit test mirroring the real Brotherhood box-set shape (40/40 passing) — commit `749ed14`.<br>
**Reasoning:** The PRD gives the desired labels but not the detection rule, so this was an implementation decision within the requirement's intent, same pattern as the DC-1/DC-2 build-time decisions. Logging it because the singular/plural detection logic (count distinct groups per format) isn't obvious from reading DC-9 alone, and because the DVD-merging fix is a real behavior change worth being able to point back to.<br>

---

## Open Questions / Unresolved

Items raised during reviews that don't have a decision yet. Once resolved, move the entry up into the dated log above.

*(none currently open)*
