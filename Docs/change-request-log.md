# Change Request Log

A running record of change requests against this project — things that changed after they were already decided, built, or approved: bug fixes, post-approval requirement changes, and labeling/behavior corrections found during testing. This is a companion to [`decision-log.md`](decision-log.md), not a replacement for it: this log tracks *what was requested, by what source, and what happened to it*; the decision log carries the *why* behind each resolution. Original scope/tooling/architecture decisions made before anything was built aren't CRs — they're covered in the decision log alone.

Each row links to the decision-log entry with the full reasoning, and to the commit(s) that implemented it, rather than duplicating that detail here.

| ID | Date | Description | Source | Disposition | Resolved by |
|----|------|--------------|--------|--------------|-------------|
| CR-1 | 2026-09-23 | `computeDurations()` silently dropped `type_:"index"` tracklist entries (real-world medley/suite shape), undercounting release totals | Live testing against real Discogs API (`release/4000806`) | Approved | commit `1f9fab0`, decision-log 2026-09-23 |
| CR-2 | 2026-09-25 | Multi-format box-set groups (CD/DVD) mislabeled as "Side CD"/"Side DVD"; multiple DVD discs silently merged into one group | Live testing (flagged 2026-09-23), turned into requirements DC-8/DC-9 | Approved | commit `749ed14`, decision-log 2026-09-25 |
| CR-3 | 2026-09-26 | Error banner (red, empty message) displayed on page load and after a successful calculation, not just on an actual error | Bruce's manual testing pass | Approved | commit `130a3b5`, decision-log 2026-09-26 |
| CR-4 | 2026-09-26 | UI-2: fold app name into header, drop separate eyebrow line; RU-9: add explicit release-date formatting rule | Bruce (PRD/Figma update) | Approved | commit `bbfe6f4`, decision-log 2026-09-26 |
| CR-5 | 2026-09-26 | UI-9: display a build/deploy identifier (footer, lower-left) so a stale cached build can be told apart from the latest deploy | Bruce | Approved | commit `db4e476`, decision-log 2026-09-26 |
| CR-6 | 2026-09-26 | UI-9 footer was pinned to the browser viewport's lower-left corner (easy to miss, scrolls out of view below the fold); moved into the app's white card frame instead | Bruce's manual testing | Approved | commit `42937a2`, decision-log 2026-09-26 |

---

## Open

*(none currently open)*
