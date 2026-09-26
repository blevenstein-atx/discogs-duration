// Copy this file to build-info.js for local dev (gitignored — never commit it, since
// the real one is generated fresh at every deploy).
//
// In production, build-info.js is generated automatically at deploy time by the
// GitHub Actions workflow (short commit SHA + deploy date) — see
// .github/workflows/static.yml and Docs/discogs_duration_PRD.md (UI-9).

window.BUILD_INFO = {
  sha: "0000000",
  date: "01-01-2000",
};
