# Architecture Overview

How the pipeline is put together, and what each file in the MVP build does. Written as a reference for explaining the build to someone else (e.g. in an interview) without assuming they've seen the code.

## The deployment pipeline

![Diagram of the discogs-duration pipeline: local Mac tooling pushes to a public GitHub repo, which triggers a GitHub Actions workflow that deploys to GitHub Pages; from there, a visitor's browser fetches release data directly from the Discogs API.](architecture-diagram.svg)

Local tooling on the left/top (nothing there ships) feeds a public GitHub repo. A push to `main` triggers a GitHub Actions workflow, which generates `config.js` from a repository secret and publishes the site to GitHub Pages — no build step. From there, a visitor's own browser loads the static files and calls the Discogs API directly; nothing in this pipeline is a server we operate ourselves. Every stage shown here is built, deployed, and confirmed working end to end, including the live `fetch()`/JSON exchange with Discogs.

## The shape of the app

This is a static site: five files, no build step, no framework, no backend/server of our own. A browser downloads all five files from GitHub Pages, and everything — reading your input, calling the Discogs API, doing the math, drawing the results — happens in the browser itself, in JavaScript. GitHub Actions is the one piece of "infrastructure": it packages and publishes those files whenever we push to `main`.

## The files

### `index.html` — the page skeleton
Defines the structure of the page: the title and instructions text, the input box and "Calculate Duration" button, a spot for an error message, and a spot for the results (a two-column layout: release info on one side, duration breakdown on the other, plus a grand total). It has almost no logic in it — it's just the empty containers that `app.js` fills in once it has data. At the bottom it loads `config.js` and then `app.js`, in that order, so the token is available before the app logic runs.

### `styles.css` — the visual design
All of the app's appearance: colors, spacing, fonts, the card layout, how the error banner looks vs. the results grid, and how the page reshapes itself on a narrow (mobile) screen. Doesn't do anything itself — it's a set of rules the browser applies to the elements defined in `index.html`. Built to match the Figma mockups.

### `app.js` — the application logic
This is the actual program — everything that makes the app *do* something. It's one file, organized into a handful of jobs:

- **Input validation** — checks whatever you typed or pasted (a URL, a bare ID, `r123456`, etc.) against the accepted formats from the PRD, and tells you specifically if it's a master/artist/label link (not supported) vs. just plain invalid.
- **Calling the Discogs API** — once the input is valid, sends a request to Discogs for that release's data, using the access token from `config.js`. Handles the different things that can come back: success, "not found," "gone" (merged/deleted), or a network failure — each gets its own message.
- **Duration calculation** — this is the trickiest part. A release's tracklist isn't always a flat list of tracks with times; box sets group tracks under named headings (e.g. "Disc 1," "Disc 2"), and some entries (like a medley) list one combined time instead of per-track times. This code walks the tracklist, figures out which shape it's in, sums up the right numbers, and — per the project's rule — refuses to produce a total at all if any track's time is missing or looks broken (rather than guessing or showing a partial number).
- **Rendering results** — takes the release info (artist, title, label, format, etc.) and the calculated totals and writes them into the page's HTML so you see them.
- **Formatting helpers** — small functions that turn things like `4325` seconds into `"01:12:05"`, or a list of artist objects into `"Tony Bennett, Bill Evans"`.

Everything in `app.js` runs only when you open the page — there's no server executing any of this.

### `config.example.js` — the token template
A template showing the one line of setup needed to run the app: `window.DISCOGS_CONFIG = { token: "YOUR_TOKEN_HERE" }`. This file *is* committed to the repo — it has no real token in it, just a placeholder, so anyone (including future-you) knows what to fill in. It exists so the actual token never has to be written into `index.html` or `app.js` directly.

### `config.js` — the real token (not in the repo)
The file `app.js` actually reads the token from. It's listed in `.gitignore`, so it never gets committed or shows up on GitHub. Locally, you'd copy `config.example.js` to `config.js` and fill in a real token to test on your own machine. In production it doesn't exist as a file in the repo at all — it's generated automatically (see below).

### `.github/workflows/static.yml` — the deployment pipeline
A GitHub Actions workflow — a recipe GitHub runs automatically every time we push to `main`. Two things worth knowing about it: (1) it has a step that writes `config.js` on the fly, filling in the real Discogs token from a GitHub repository secret (`DISCOGS_TOKEN`) that you added in the repo's settings — so the token lives only in GitHub's encrypted secret storage, never in a file we write or commit ourselves; (2) it then packages the whole site and publishes it to GitHub Pages at `blevenstein-atx.github.io/discogs-duration/`. This is the automation that turns "push a commit" into "the live site updates."

## How a single request flows through it

1. You type/paste something into the box in `index.html`; `app.js` validates it as you type.
2. On submit, `app.js` calls the Discogs API for that release, using the token `config.js` supplied.
3. `app.js` runs the duration-calculation logic against the API's tracklist data.
4. `app.js` writes either an error message or the formatted results back into the page; `styles.css` determines how it all looks.

No step here touches a server we run — Discogs' API is the only backend involved, and GitHub Pages is just serving static files.
