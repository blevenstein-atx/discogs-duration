Discogs Duration MVP PRD

Full MVP scope and future state can be found in the scope.md doc. This PRD covers only MVP scope.

Testable requirements below carry a short ID (e.g. `IV-1`) for traceability, used to link each requirement to specific test-data URLs/cases without re-describing them elsewhere. Context sections (Problems, Assumptions, Risks) aren't testable requirements and aren't ID'd.

# Problems
Discogs release data often includes track times, but does not calculate and display total release duration.
Summing track times in your head, or using a calculator or spreadsheet is onerous and time-consuming. Asking an AI agent for the duration is non-deterministic and prone to error and variation.

# Assumptions
Users will have a known discogs release URL or release ID to enter. This assumes the user has already browsed the release on the discogs site.
Not every discogs release has complete track time data.
The Discogs response is fast enough that a loading/pending state is not needed in the UI.

# Risks

The app authenticates to the Discogs API using a personal access token, which grants full account-level access for the token holder (collection, wantlist, marketplace orders, private inventory) — not just a rate-limit allowance. In a static site with no backend, this token is necessarily sent from the browser and is visible to anyone who inspects the deployed site's network traffic; this cannot be avoided within a no-backend architecture, regardless of what is or isn't committed to the repo.

This risk has been accepted for the MVP. It is acceptable specifically because this app will not be shared publicly — only with Bruce and a personal circle of friends. This decision would need to be revisited if the app's audience ever grows beyond that.

Mitigation: the token is not committed to the git repository. It is stored as a GitHub Actions repository secret and injected into a generated `config.js` file as a build step during deployment, rather than living in a local gitignored file that would never actually reach the deployed site. This does not prevent the runtime exposure above (the accepted risk), but it does prevent a second, larger exposure: a token committed into a public repo's history is discoverable by automated secret-scanning at scale, while runtime-only exposure requires someone to visit the site and inspect it directly. Rotation, if ever needed: generate a new token from Discogs (which replaces the current one), update the GitHub Actions secret, and redeploy — no code changes required.

# Use Cases
Keeping these intentionally simple and lightweight, no UML or mermaid diagrams or structured use case templates.


## UC-1 — Happy Path

1. User enters or pastes a discogs URL or release ID.
2. App successfully validates the input.
3. User clicks to initiate the duration calculation.
4. App pulls track durations via discogs API.
5. App displays the album duration results.
6. User may clear results and request a new URL or release ID.

## UC-2 — Invalid release URL or invalid release ID

1. User enters or pastes a discogs URL or release ID.
2. App validates the input, detects a format error prior to execution.
3. App displays validation error.
4. User corrects URL or ID.
5. User clicks to initiate the duration calculation.
6. App pulls track durations via discogs API.
7. App displays the album duration results.
8. User may clear results and request a new URL or release ID.

## UC-3 — Release not found

1. User enters or pastes a discogs URL or release ID.
2. App successfully validates the input.
3. User clicks to initiate the duration calculation.
4. The discogs API returns that the release does not exist.
5. App displays release-not-found error.
6. User corrects URL or ID.
7. User clicks to initiate the duration calculation.
8. App pulls track durations via discogs API.
9. App displays the album duration results.
10. User may clear results and request a new URL or release ID.

## UC-4 — Unable to calculate release duration

1. User enters or pastes a discogs URL or release ID.
2. App successfully validates the input.
3. User clicks to initiate the duration calculation.
4. App pulls release data but track durations are missing, incomplete, or in an unsupported pattern.
5. App displays error message.
6. User may clear results and request a new URL or release ID.

## UC-5 — Discogs API failure

1. User enters or pastes a discogs URL or release ID.
2. App successfully validates the input.
3. User clicks to initiate the duration calculation.
4. App is unable to connect to the discogs API (i.e. 500 series error).
5. App displays error message.
6. User may try again, resubmitting the same release URL or ID.

# Input

**IN-1.** Ability to enter a discogs release URL. The release ID can be parsed from the URL.
**IN-2.** Ability to enter a discogs release ID.

## Input Validation

**IV-1.** A URL must be in a valid discogs URL format. Example: https://www.discogs.com/release/547049-Gorillaz-Demon-Days, or www.discogs.com/release/547049-Gorillaz-Demon-Days.
**IV-2.** Check URL validity prior to API request. Invalid URLs include: not a URL, empty string, whitespace/newline-padded paste. If the URL is invalid, display a message: Please enter a valid Discogs release URL or release ID.
**IV-3.** An ID must be in a valid discogs release ID format. Invalid formats include zero, negative, decimal, leading zeros. A valid input can be the standard integer number like 547049, or include a leading r, such as r547049 or [r547049]. The r and brackets can be stripped when sending the API request. If the ID input is invalid, display a message: Please enter a valid Discogs release URL or release ID.
**IV-4.** In the case of ID prefixing, R547049 (uppercase) or [ r547049 ] (inner whitespace) are invalid.
**IV-5.** Disallow use of non-release discogs records. Wrong Discogs URL type: a /master/ URL instead of /release/, or a /artist/, /label/, or search-results URL. This can be identified at time of input, such as "master" in the URL, like https://www.discogs.com/master/58002-Gorillaz-Demon-Days. Or if a user includes a leading m in the ID, such as [m58002] or m58002.
**IV-6.** If a non-release URL or master release ID with leading m is entered, prior to API request display a message: Only individual releases are supported. Please use a specific release URL or ID.

# Input UI

**UI-1.** UI styling can be copied from the Discogs website. Let's try making the app look like a Discogs tool, if possible. (This may need to wait until v2 when we implement React)

**UI-2.** At the top of the UI place the app name: Release Duration Calculator
**UI-3.** Beneath the app name and above the input field place instructions: Enter a discogs release URL or discogs release ID to calculate the release's total duration. Master release records are not supported, only specific child releases.
**UI-4.** A single input field for entering either a release URL or release ID. Field label: Release URL or ID
**UI-5.** Make the input field long enough to limit truncation of an entered URL.
**UI-6.** A button to submit the API request. The button should be grey/disabled until something is entered into the input field. Button label: Calculate Duration
**UI-7.** The Calculate Duration button should be disabled after clicking, while the API response is in progress, to prevent double-submit. (the Discogs response is expected to be fast, so displaying a loading/pending state is not necessary.)
**UI-8.** Input validation occurs when the button is clicked, either returning a validation error described above, or triggering the API request. Don't erase the user input, allow them to edit it and try again.

# Results UI

**RU-1.** As the input and output is minimal, let's keep both the input and output on the same screen. The results can render beneath the input field. This has the advantage of also keeping the input context visible to the user.
**RU-2.** In all success and error cases, the input URL or ID should remain in the input field. The user has the ability to edit or replace the input and try again.
**RU-3.** The results should have two sections: Release metadata, and the duration calculation
**RU-4.** Release metadata to include: Discogs release ID, Artist, Title, Label, Format, Country, Released date
**RU-5.** For release with multiple formats, display all the contained formats. For example: https://www.discogs.com/release/25863751-New-Order-Low-Life
**RU-6.** In the case of releases with multiple format values, present this as a single line with comma-joined values.
**RU-7.** In the case of multi-artist releases (i.e. compilations), display the multiple artists as comma-joined.
**RU-8.** Include a Clear results button. This button clears the input field and the results, so the user can enter new input and try again. The user also has the option to manually replace the input value and click Calculate Duration, which replaces the current results with new results. The Clear Results button should be disabled when no results are displayed.

## Duration Calculation Section

### Success cases

**DC-1.** Format this section in a way that's easy to copy to the clipboard for pasting elsewhere as plain text. For MVP this can be cleanly selectable text for manually copy, no Copy button needed.
**DC-2.** Display the release's total duration as: Grand Total Duration: hh:mm:ss. Do not use zero-padding for releases under an hour. For example, 45 minutes and 32 seconds is formatted as 45:32.
**DC-3.** In the case of a formats with multiple sides (vinyl LPs, cassettes) indicated for example as A, B, or AA, include sub-total durations for the sides as: Side Duration: hh:mm:ss
**DC-4.** In the case of multiple discs, multiple LPs, multiple tapes, indicated numerically like 1-1 or 2-1, include sub-total durations for each item as: Item Duration: hh:mm:ss
**DC-5.** In the case of releases with multiple mixed formats, such as box sets with vinyl and CDs, treat these the same as multi-item releases. Include item Duration totals for each item.
**DC-6.** In the case of multi-disc sets, such as box sets, and releases with a suite/medley, include the title for each item with a header above its sub-total track time. These titles can be found in headers within the track list. For example: https://www.discogs.com/release/25863751-New-Order-Low-Life has headers of Low-life, Extras, Live In Tokyo 1985, and more.
**DC-7.** In the case of releases with a multi-track medley/suite, these will appear in the track list with a medley/suite section header and indented track, such as: https://www.discogs.com/release/4000806-Genesis-The-Lamb-Lies-Down-On-Broadway. The medley/suite section header may have a duration, while the contained tracks do not. If the contained tracks do have times, use those times. If the contained tracks have no individual times, use the time in the medley/suite header.


### Failure cases

**DF-1.** In the case of track times of 0:00 or malformed duration strings such as 3:75 (seconds >59), do not calculate duration. Display a message: Duration cannot be calculated due to track time data errors.
**DF-2.** In the case of no track times for all tracks in a release, or missing track times for one or more tracks in a single or multi-disc standard release (double LP or CD, for example), do not calculate duration. Display a message: Duration cannot be calculated due to missing track time data.
**DF-3.** In the case of missing track times for one or more tracks in any item within a box set release do not calculate duration. Display a message: Duration cannot be calculated due to missing track time data.
**DF-4.** If the release is found, but has no track list, display a message: Release has no track data.
**DF-5.** If the release is not found, this will return a 400 series error (404) with a message such as "The value "258624535643576" is not a valid Discogs identifier." In this case, display the returned discogs message to the user.
**DF-6.** If the release has been merged or removed, this will return a 400 series error (410). In this case display a message: This release has been merged or removed.


### API/Network failures

**AF-1.** In the case of any other 400 errors, 500 errors, timeouts, or unexpected malformed API response errors, display an error message: Something went wrong. Include any returned error code or message from discogs beneath the error message.
