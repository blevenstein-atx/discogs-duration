// Copy this file to config.js (which is gitignored — never commit your real token)
// and fill in a real Discogs personal access token to test locally.
//
// Generate a token at: https://www.discogs.com/settings/developers
//
// In production, config.js is generated automatically at deploy time by the
// GitHub Actions workflow from a repository secret — see .github/workflows/static.yml
// and Docs/decision-log.md for the token maintenance/rotation plan.

window.DISCOGS_CONFIG = {
  token: "YOUR_TOKEN_HERE",
};
