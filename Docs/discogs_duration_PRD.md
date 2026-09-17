Discogs Duration MVP PRD

Full MVP scope and future state can be found in the scope.md doc. This PRD covers only MVP scope.

# Problems
Discogs release data often includes track times, but does not calculate and display total release duration.
Summing track times in your head, or using a calculator or spreadsheet is onerous and time-consuming. Asking an AI agent for the duration is non-deterministic and prone to error and variation.

# Assumptions
Users will have a known discogs release URL or release ID to enter. This assumes the user has already browsed the release on the discogs site.
Not every discogs release has complete track time data.

# Use Cases
Keeping these intentionally simple and lightweight, no UML or mermaid diagrams or structured use case templates.


## Happy Path

1. User enters or pastes a discogs URL or release ID.
2. App successfully validates the input.
3. User clicks to initiate the duration calculation.
4. App pulls track durations via discogs API.
5. App displays the album duration results.
6. User may clear results and request a new URL or release ID.

## Invalid release URL or invalid release ID

1. User enters or pastes a discogs URL or release ID.
2. App validates the input, detects a format error prior to execution.
3. App displays validation error.
4. User corrects URL or ID.
5. User clicks to initiate the duration calculation.
6. App pulls track durations via discogs API.
7. App displays the album duration results.
8. User may clear results and request a new URL or release ID.

## Release not found

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

## Unable to calculate release duration

1. User enters or pastes a discogs URL or release ID.
2. App successfully validates the input.
3. User clicks to initiate the duration calculation.
4. App pulls release data but track durations are missing, incomplete, or in an unsupported pattern.
5. App displays error message.
6. User may clear results and request a new URL or release ID.

## Discogs API failure

1. User enters or pastes a discogs URL or release ID.
2. App successfully validates the input.
3. User clicks to initiate the duration calculation.
4. App is unable to connect to the discogs API (i.e. 500 series error).
5. App displays error message.
6. User may try again, resubmitting the same release URL or ID.

# Input

Ability to enter a discogs release URL. The release ID can be parsed from the URL.
Ability to enter a discogs release ID.

## Input Validation

A URL must be in a valid discogs URL format. Example: https://www.discogs.com/release/547049-Gorillaz-Demon-Days, or www.discogs.com/release/547049-Gorillaz-Demon-Days.
Check URL validity prior to API request. Invalid URLs include: not a URL, empty string, whitespace/newline-padded paste. If the URL is invalid, display a message: Please enter a valid Discogs release URL or release ID.
An ID must be in a valid discogs release ID format. Invalid formats include zero, negative, decimal, leading zeros. A valid input can be the standard integer number like 547049, or include a leading r, such as r547049 or [r547049]. The r and brackets can be stripped when sending the API request. If the ID is invalid, display a message: Please enter a valid Discogs release URL or release ID.
OPEN QUESTION: What is the format for a valid discogs release number?
Disallow use of non-release discogs records. Wrong Discogs URL type: a /master/ URL instead of /release/ (easy mistake — masters and releases are different endpoints with different data), or a /artist/, /label/, or search-results URL. This can be identified at time of input, such as "master" in the URL, like https://www.discogs.com/master/58002-Gorillaz-Demon-Days. Or by a leading m in ID, such as [m58002] or m58002. In the case of a user entering just a numeric ID, it will not be possible to detect a master release until the API response is received.
If a non-release URL or master release ID with leading m is entered, prior to API request display a message: Only individual releases are supported. Please use a specific release URL or ID.

# Input UI

UI styling can be copied from the Discogs website. Let's try making the app look like a Discogs tool, if possible. (This may need to wait until v2 when we implement React)

At the top of the UI place the app name: Release Duration Calculator
Beneath the app name and above the input field place instructions: Enter a discogs release URL or discogs release ID to calculate the release's total duration. Master release records are not supported, only specific child releases.
A single input field for entering either a release URL or release ID. Field label: Release URL or ID
Make the input field long enough to limit truncation of an entered URL.
A button to submit the API request. The button should be grey/disabled until something is entered into the input field. Button label: Calculate Duration
Input validation occurs when the button is clicked, either returning a validation error described above, or triggering the API request. Don't erase the user input, allow them to edit it and try again.

# Results UI

As the input and output is minimal, let's keep both the input and output on the same screen. The results can render beneath the input field. This has the advantage of also keeping the input context visible to the user.
In all success and error cases, the input URL or ID should remain in the input field. The user has the ability to edit or replace the input and try again.
The results should have two sections: Release metadata, and the duration calculation
Release metadata to include: Discogs release ID, Artist, Title, Label, Format, Country, Released date
For release with multiple formats, display all the contained formats. For example: https://www.discogs.com/release/25863751-New-Order-Low-Life

## Duration Calculation Section

### Success cases

Format this section in a way that's easy to copy to the clipboard for pasting elsewhere as plain text.
Display the release's total duration as: Grand Total Duration: hh:mm:ss
In the case of a formats with multiple sides (vinyl LPs, cassettes) indicated for example as A, B, or AA, include sub-total durations for the sides as: Side Duration: hh:mm:ss
In the case of multiple discs, multiple LPs, multiple tapes, indicated numerically like 1-1 or 2-1, include sub-total durations for each item as: Item Duration: hh:mm:ss
In the case of releases with multiple mixed formats, such as box sets with vinyl and CDs, treat these the same as multi-item releases. Include item Duration totals for each item.
In the case of multi-disc sets, such as box sets, include the title for each item in the set above its sub-total track time. These titles can be found in headers within the track list. For example: https://www.discogs.com/release/25863751-New-Order-Low-Life has headers of Low-life, Extras, Live In Tokyo 1985, and more.
In the case of multi-disc sets, such as box sets with multiple format items, where an entire item is missing track times but other contained items have complete track times, calculate the durations of items where possible, include the Grand Total Duration, and include a message: One or more items in this multi-item set has no track time data. The Grand Total Duration has been calculated with available data.
In the case of releases with a multi-track medley/suite, these will appear in the track list with a medley/suite section header and indented track, such as: https://www.discogs.com/release/4000806-Genesis-The-Lamb-Lies-Down-On-Broadway. The section header may have a duration, while the contained tracks do not. If the contained tracks have times, ignore the header and simply treat these as regular tracks in the total duration. If the contained tracks have no individual times, use the time in the medley/suite header.
In the case of release with section headers not related to a medley/suite, such as section names or Bonus Tracks, ignore the headers. For example: https://www.discogs.com/release/1141075-Kate-Bush-Hounds-Of-Love


### Failure cases

In the case of track times of 0:00 or malformed duration strings such as 3:75 (seconds >59), do not calculate duration. Display a message: Duration cannot be calculated due to track time data errors.
In the case of no track times or missing track times for one or more tracks in a single or multi-disc standard release (double LP or CD, for example), do not calculate duration. Display a message: Duration cannot be calculated due to missing track time data.
If the release is found, but has no track list, display a message: Release has no track data.
If the release is not found, this will return a 400 series error (404) with a message such as "The value "258624535643576" is not a valid Discogs identifier." In this case, display the returned discogs message to the user.
If the release has been merged or removed, this will return a 400 series error (410). In this case display a message: This release has been merged or removed.


### API/Network failures

In the case of any other 400 errors, 500 errors, timeouts, or unexpected malformed API response errors, display an error message: Something went wrong. Include any returned error code or message from discogs beneath the error message.
