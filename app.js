// Discogs Duration Calculator — MVP
// See Docs/discogs_duration_PRD.md for requirement IDs referenced in comments below.

(function () {
  "use strict";

  // ---------- DOM refs ----------
  const form = document.getElementById("calc-form");
  const input = document.getElementById("release-input");
  const calculateBtn = document.getElementById("calculate-btn");
  const clearBtn = document.getElementById("clear-btn");
  const errorBanner = document.getElementById("error-banner");
  const errorMessage = document.getElementById("error-message");
  const results = document.getElementById("results");
  const metadataList = document.getElementById("metadata-list");
  const calcBreakdown = document.getElementById("calc-breakdown");
  const grandTotalValue = document.getElementById("grand-total-value");

  const GENERIC_INVALID_MESSAGE = "Please enter a valid Discogs release URL or release ID.";
  const NON_RELEASE_MESSAGE = "Only individual releases are supported. Please use a specific release URL or ID.";

  // ---------- UI-6 / UI-7: enable/disable Calculate button ----------
  input.addEventListener("input", () => {
    calculateBtn.disabled = input.value.length === 0;
    // UI-8: don't erase user input on edit; just clear a stale invalid state as they retype
    input.classList.remove("invalid");
  });

  // ---------- IV-1..IV-6: validation ----------
  // NOTE: the raw input is matched as-is (never trimmed first), so IV-2's
  // "whitespace/newline-padded paste" rule is enforced automatically: padded
  // input simply fails every anchored pattern below and falls through to invalid.

  const RELEASE_URL_RE = /^(https?:\/\/)?www\.discogs\.com\/release\/(\d+)(-.*)?$/;
  const MASTER_URL_RE = /^(https?:\/\/)?www\.discogs\.com\/master\/(\d+)(-.*)?$/;
  const OTHER_RECORD_URL_RE = /^(https?:\/\/)?www\.discogs\.com\/(artist|label)\/(\d+)(-.*)?$/;

  const BARE_ID_RE = /^[1-9]\d*$/;
  const R_PREFIXED_RE = /^r([1-9]\d*)$/;
  const R_BRACKETED_RE = /^\[r([1-9]\d*)\]$/;
  const M_PREFIXED_RE = /^m[1-9]\d*$/;
  const M_BRACKETED_RE = /^\[m[1-9]\d*\]$/;

  function validateInput(raw) {
    // Master / non-release URL and ID forms (IV-5, IV-6) get their own message,
    // checked before the generic invalid case.
    if (
      MASTER_URL_RE.test(raw) ||
      OTHER_RECORD_URL_RE.test(raw) ||
      M_PREFIXED_RE.test(raw) ||
      M_BRACKETED_RE.test(raw)
    ) {
      return { valid: false, message: NON_RELEASE_MESSAGE };
    }

    let match = RELEASE_URL_RE.exec(raw);
    if (match) {
      return { valid: true, releaseId: match[2] };
    }

    if (BARE_ID_RE.test(raw)) {
      return { valid: true, releaseId: raw };
    }

    match = R_PREFIXED_RE.exec(raw);
    if (match) {
      return { valid: true, releaseId: match[1] };
    }

    match = R_BRACKETED_RE.exec(raw);
    if (match) {
      return { valid: true, releaseId: match[1] };
    }

    return { valid: false, message: GENERIC_INVALID_MESSAGE };
  }

  // ---------- Duration parsing ----------
  // Returns { seconds } | { missing: true } | { malformed: true }
  function parseDurationToken(raw) {
    if (raw === undefined || raw === null || String(raw).trim() === "") {
      return { missing: true };
    }
    const match = /^(\d+):(\d{1,2})$/.exec(String(raw).trim());
    if (!match) {
      return { malformed: true };
    }
    const minutes = parseInt(match[1], 10);
    const seconds = parseInt(match[2], 10);
    if (seconds > 59) {
      return { malformed: true };
    }
    if (minutes === 0 && seconds === 0) {
      // DF-1: a literal 0:00 track time is treated as a data error, not a zero duration.
      return { malformed: true };
    }
    return { seconds: minutes * 60 + seconds };
  }

  // Sums a flat array of track-like objects. Returns { total } or { error: 'missing'|'malformed' }.
  function sumTracks(tracks) {
    let total = 0;
    for (const t of tracks) {
      const parsed = parseDurationToken(t.duration);
      if (parsed.malformed) return { error: "malformed" };
      if (parsed.missing) return { error: "missing" };
      total += parsed.seconds;
    }
    return { total };
  }

  // Resolves a type_:"heading" or type_:"index" tracklist entry into a named
  // group total, if it represents one (DC-6: box-set/disc-titled items; DC-7:
  // medley/suite headers — real API data uses type_:"index" for these).
  // Returns null if the entry is a bare section label with no sub_tracks.
  function resolveHeadingGroup(entry) {
    const subTracks = entry.sub_tracks || [];
    if (subTracks.length === 0) {
      return null;
    }
    const anySubHasDuration = subTracks.some(
      (t) => t.duration !== undefined && t.duration !== null && String(t.duration).trim() !== ""
    );
    if (!anySubHasDuration) {
      // DC-7: contained tracks have no individual times — fall back to the
      // heading/medley's own duration, if present.
      const parsed = parseDurationToken(entry.duration);
      if (parsed.malformed) return { error: "malformed" };
      if (parsed.missing) return { error: "missing" };
      return { total: parsed.seconds, label: entry.title };
    }
    const summed = sumTracks(subTracks);
    if (summed.error) return summed;
    return { total: summed.total, label: entry.title };
  }

  // Computes durations for a release's tracklist.
  // Returns { ok: true, grandTotalSeconds, groups } or { ok: false, reason }.
  // reason is one of: 'no-tracks' (DF-4), 'missing' (DF-2/DF-3), 'malformed' (DF-1).
  function computeDurations(tracklist) {
    if (!tracklist || tracklist.length === 0) {
      return { ok: false, reason: "no-tracks" };
    }

    const headingGroups = [];
    const flatTracks = [];

    for (const entry of tracklist) {
      if (entry.type_ === "heading" || entry.type_ === "index") {
        // DC-7: real Discogs API data uses type_:"index" (not "heading") for
        // medley/suite entries with sub_tracks, e.g. a multi-part track grouped
        // under one listed duration. Route both through the same resolution path
        // so these entries and their sub_tracks/own duration are never dropped.
        const resolved = resolveHeadingGroup(entry);
        if (resolved && resolved.error) return { ok: false, reason: resolved.error };
        if (resolved) headingGroups.push(resolved);
        continue;
      }
      flatTracks.push(entry);
    }

    // Named-item release: headings with sub_tracks (box-set discs, medleys)
    if (headingGroups.length > 0) {
      let grand = 0;
      const groups = [];
      for (const g of headingGroups) {
        grand += g.total;
        groups.push({ type: "item", label: g.label, total: g.total });
      }
      if (flatTracks.length > 0) {
        const summed = sumTracks(flatTracks);
        if (summed.error) return { ok: false, reason: summed.error };
        grand += summed.total;
      }
      return { ok: true, grandTotalSeconds: grand, groups };
    }

    // No headings — group by position prefix:
    //   numeric "1-1" (plain multi-item/disc, DC-4)
    //   letters+digits with a dash, e.g. "CD1-1"/"DVD2-3" (format code, DC-9)
    //   bare letters+digits with no dash, e.g. "A1"/"AA1" (vinyl/cassette side, DC-8)
    // A single release can mix side groups and format-code groups (e.g. a box
    // set with vinyl + CD + DVD, DC-5), so all three are collected and
    // rendered together rather than being mutually exclusive.
    const itemGroups = new Map();
    const formatGroups = new Map(); // key: "LETTERS|DIGITS" -> { letters, digits, tracks }
    const sideGroups = new Map();
    let sawItemStyle = false;
    let sawFormatStyle = false;
    let sawSideStyle = false;

    for (const t of flatTracks) {
      const pos = (t.position || "").trim();
      const itemMatch = /^(\d+)-/.exec(pos);
      const formatMatch = /^([A-Za-z]+)(\d*)-/.exec(pos);
      const sideMatch = /^([A-Za-z]+)(\d+)$/.exec(pos);
      if (itemMatch) {
        sawItemStyle = true;
        const key = itemMatch[1];
        if (!itemGroups.has(key)) itemGroups.set(key, []);
        itemGroups.get(key).push(t);
      } else if (formatMatch) {
        sawFormatStyle = true;
        const letters = formatMatch[1].toUpperCase();
        const digits = formatMatch[2] || "";
        const key = `${letters}|${digits}`;
        if (!formatGroups.has(key)) formatGroups.set(key, { letters, digits, tracks: [] });
        formatGroups.get(key).tracks.push(t);
      } else if (sideMatch) {
        sawSideStyle = true;
        const key = sideMatch[1].toUpperCase();
        if (!sideGroups.has(key)) sideGroups.set(key, []);
        sideGroups.get(key).push(t);
      } else {
        if (!itemGroups.has("_")) itemGroups.set("_", []);
        itemGroups.get("_").push(t);
      }
    }

    if (sawItemStyle || sawFormatStyle || sawSideStyle) {
      let grand = 0;
      const groups = [];

      // Sides first (DC-8): "Side A", "Side AA", ...
      for (const [key, tracks] of sideGroups) {
        const summed = sumTracks(tracks);
        if (summed.error) return { ok: false, reason: summed.error };
        grand += summed.total;
        groups.push({ type: "side", label: `Side ${key}`, total: summed.total });
      }

      // Format-code groups next (DC-9): collapse to a bare code ("CD") when
      // only one group of that format exists; use numbered codes ("CD1",
      // "CD2") when there's more than one of that format.
      const lettersCounts = new Map();
      for (const { letters } of formatGroups.values()) {
        lettersCounts.set(letters, (lettersCounts.get(letters) || 0) + 1);
      }
      for (const { letters, digits, tracks } of formatGroups.values()) {
        const summed = sumTracks(tracks);
        if (summed.error) return { ok: false, reason: summed.error };
        grand += summed.total;
        const label = lettersCounts.get(letters) > 1 ? `${letters}${digits}` : letters;
        groups.push({ type: "item", label, total: summed.total });
      }

      // Numbered-item groups (DC-4): "Item 1", "Item 2", ...
      for (const [key, tracks] of itemGroups) {
        const summed = sumTracks(tracks);
        if (summed.error) return { ok: false, reason: summed.error };
        grand += summed.total;
        groups.push({ type: "item", label: key === "_" ? null : `Item ${key}`, total: summed.total });
      }

      return { ok: true, grandTotalSeconds: grand, groups };
    }

    // Simple single-item release, no side/item structure at all.
    const summed = sumTracks(flatTracks);
    if (summed.error) return { ok: false, reason: summed.error };
    return { ok: true, grandTotalSeconds: summed.total, groups: [] };
  }

  // DC-2: hh:mm:ss, no zero-padding on hours for releases under an hour.
  function formatDuration(totalSeconds) {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    const pad2 = (n) => String(n).padStart(2, "0");
    if (h > 0) {
      return `${pad2(h)}:${pad2(m)}:${pad2(s)}`;
    }
    return `${m}:${pad2(s)}`;
  }

  // ---------- Metadata formatting (RU-4..RU-7) ----------
  function formatArtists(release) {
    if (!release.artists || release.artists.length === 0) return "—";
    return release.artists.map((a) => a.name).join(", ");
  }

  function formatFormats(release) {
    if (!release.formats || release.formats.length === 0) return "—";
    return release.formats
      .map((f) => {
        const qty = f.qty && parseInt(f.qty, 10) > 1 ? `${f.qty}x` : "";
        const parts = [`${qty}${f.name}`];
        if (f.descriptions && f.descriptions.length) parts.push(...f.descriptions);
        return parts.join(", ");
      })
      .join(", ");
  }

  function formatLabels(release) {
    if (!release.labels || release.labels.length === 0) return "—";
    return release.labels
      .map((l) => (l.catno && l.catno !== "none" ? `${l.name} — ${l.catno}` : l.name))
      .join(", ");
  }

  // ---------- Release date formatting (RU-9) ----------
  const MONTH_ABBR = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  function formatReleaseDate(raw) {
    if (!raw) return "—";
    const value = String(raw).trim();

    // Full date, e.g. "1978-11-10" -> "Nov 10, 1978"
    let m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
    if (m) {
      const [, year, month, day] = m;
      const monthIdx = parseInt(month, 10) - 1;
      if (monthIdx >= 0 && monthIdx < 12) {
        return `${MONTH_ABBR[monthIdx]} ${parseInt(day, 10)}, ${year}`;
      }
    }

    // Year only, e.g. "1992" -> "1992"
    if (/^\d{4}$/.test(value)) {
      return value;
    }

    // Month and day only, no year, e.g. "11-10" -> "Nov 10"
    m = /^(\d{2})-(\d{2})$/.exec(value);
    if (m) {
      const [, month, day] = m;
      const monthIdx = parseInt(month, 10) - 1;
      if (monthIdx >= 0 && monthIdx < 12) {
        return `${MONTH_ABBR[monthIdx]} ${parseInt(day, 10)}`;
      }
    }

    // Unrecognized shape (e.g. Discogs literal text like "Unknown") -> show as-is.
    return value;
  }

  // ---------- Rendering ----------
  function showError(message) {
    errorMessage.textContent = message;
    errorBanner.hidden = false;
    results.hidden = true;
    input.classList.add("invalid");
    clearBtn.disabled = false;
  }

  function clearError() {
    errorBanner.hidden = true;
    errorMessage.textContent = "";
    input.classList.remove("invalid");
  }

  function renderResults(release, calc) {
    clearError();

    metadataList.innerHTML = "";
    const fields = [
      ["Discogs Release ID", release.id],
      ["Artist", formatArtists(release)],
      ["Title", release.title || "—"],
      ["Label", formatLabels(release)],
      ["Format", formatFormats(release)],
      ["Country", release.country || "—"],
      ["Released", formatReleaseDate(release.released)],
    ];
    for (const [label, value] of fields) {
      const dt = document.createElement("dt");
      dt.textContent = label;
      const dd = document.createElement("dd");
      dd.textContent = value;
      metadataList.appendChild(dt);
      metadataList.appendChild(dd);
    }

    calcBreakdown.innerHTML = "";
    for (const group of calc.groups) {
      const row = document.createElement("div");
      row.className = "calc-group";
      const header = document.createElement("div");
      header.className = "calc-group-header";
      const labelSpan = document.createElement("span");
      labelSpan.textContent = group.label || (group.type === "side" ? "Side" : "Item");
      const valueSpan = document.createElement("span");
      valueSpan.className = "calc-value";
      valueSpan.textContent = formatDuration(group.total);
      header.appendChild(labelSpan);
      header.appendChild(valueSpan);
      row.appendChild(header);
      calcBreakdown.appendChild(row);
    }

    grandTotalValue.textContent = formatDuration(calc.grandTotalSeconds);
    results.hidden = false;
    clearBtn.disabled = false;
  }

  // ---------- API ----------
  async function fetchRelease(releaseId) {
    const token = window.DISCOGS_CONFIG && window.DISCOGS_CONFIG.token;
    const url = `https://api.discogs.com/releases/${releaseId}`;
    let response;
    try {
      response = await fetch(url, {
        headers: {
          Authorization: `Discogs token=${token}`,
        },
      });
    } catch (networkErr) {
      return { ok: false, kind: "network" };
    }

    if (response.status === 404) {
      let body = null;
      try {
        body = await response.json();
      } catch (e) {
        /* fall through to generic message below */
      }
      return { ok: false, kind: "not-found", message: body && body.message };
    }

    if (response.status === 410) {
      return { ok: false, kind: "gone" };
    }

    if (!response.ok) {
      let body = null;
      try {
        body = await response.json();
      } catch (e) {
        /* ignore */
      }
      return { ok: false, kind: "other-error", status: response.status, message: body && body.message };
    }

    try {
      const data = await response.json();
      return { ok: true, data };
    } catch (e) {
      return { ok: false, kind: "other-error" };
    }
  }

  // ---------- Submit handler ----------
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const raw = input.value;
    const validation = validateInput(raw);

    if (!validation.valid) {
      showError(validation.message);
      return;
    }

    calculateBtn.disabled = true; // UI-7: prevent double-submit while in flight

    const apiResult = await fetchRelease(validation.releaseId);

    // Re-enable unless the input has been cleared out from under us
    calculateBtn.disabled = input.value.length === 0;

    if (!apiResult.ok) {
      if (apiResult.kind === "not-found") {
        showError(apiResult.message || GENERIC_INVALID_MESSAGE);
        return;
      }
      if (apiResult.kind === "gone") {
        showError("This release has been merged or removed.");
        return;
      }
      if (apiResult.kind === "network") {
        showError("Something went wrong.");
        return;
      }
      // other-error: 4xx/5xx we don't special-case, or malformed response
      const suffix = apiResult.status || apiResult.message
        ? ` (${[apiResult.status, apiResult.message].filter(Boolean).join(" — ")})`
        : "";
      showError(`Something went wrong.${suffix}`);
      return;
    }

    const release = apiResult.data;
    const calc = computeDurations(release.tracklist);

    if (!calc.ok) {
      if (calc.reason === "no-tracks") {
        showError("Release has no track data.");
        return;
      }
      if (calc.reason === "missing") {
        showError("Duration cannot be calculated due to missing track time data.");
        return;
      }
      if (calc.reason === "malformed") {
        showError("Duration cannot be calculated due to track time data errors.");
        return;
      }
    }

    renderResults(release, calc);
  });

  // ---------- Clear (RU-8) ----------
  clearBtn.addEventListener("click", () => {
    input.value = "";
    calculateBtn.disabled = true;
    clearBtn.disabled = true;
    clearError();
    results.hidden = true;
  });

  // Exposed for local/unit testing (see Docs/discogs_duration_test_data.md).
  window.__DiscogsDurationInternals = {
    validateInput,
    parseDurationToken,
    computeDurations,
    formatDuration,
    formatReleaseDate,
  };
})();
