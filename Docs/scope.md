# MVP Scope and Roadmap

## MVP
- No Discogs search — just enter a known valid release URL or valid release ID
- No discogs user authentication — not accessing my own Discogs account, or allowing other users to log into their Discogs account
- No framework — plain vanilla HTML/CSS/JS, no build step, direct DOM manipulation
- Hosted via GitHub Pages
- Simple UI to enter a release URL or release ID, then display the album duration result
- Basic input validation and errors for required fields and correct URL or release ID formatting
- Handling for some track times edge cases, such as missing/incomplete track time data
- Handling for obvious multi-album/multi-disc release scenarios
- Small set of real release IDs mapped to each supported edge case, to be used as a lighweight test suite

## 2.0
- Add Node.js, React (maybe Material UI components), and AWS to the architecture
- Registered custom domain name
- Add Vercel or Netlify to replace GitHub Pages
- Handling for more edge cases around unpredictable/partial release track time data
- Handling for more multi-album and other complex release scenarios (e.g. box sets with multiple albums, mixed formats, etc.)
- Ability to keep a recent local history of retrieved releases (probably just locally in a browser cookie — no complex user account feature)
- Use Lovable to prototype Discogs Search POC (spike to validate the search -> select release -> duration interaction before committing it to scope; not a code merge into this app)
- Improve release ID input handling (close the bare-numeric-ID ambiguity where a number can validly match both an unrelated release and an unrelated master, since the two are separate, non-overlapping ID sequences — e.g. by requiring a full URL or an explicit r-prefix, rather than accepting a totally bare number)

## Future
- Add rudimentary Discogs search support as a user option, for when the user doesn't already know the release ID (Search is complex; not looking to rebuild Discogs' own search UI, but a good use case for chaining multiple API calls in sequence)
- Add OAuth (may start bringing in the user's own Discogs account data from other Discogs APIs)
- Ability to export results (formats TBD)
- Ability to augment missing Discogs track duration data with other sources, such as Wikipedia
- Explore the idea of a browser extension that sends the currently viewed Discogs release URL directly into the app
- Basic APM tooling — not needed for a personal project, but a good opportunity to learn how it's set up
- Basic API request/response logging (e.g. to Postgres), as a first step toward the APM item above and a foundation for later reports/analytics on usage. Depends on the AWS backend from 2.0 already existing — a static/no-backend app can't write to a database directly from the browser without exposing database credentials to every visitor
- Reports and analytics built on top of the API logging above, once there's real logged data to work with
- Add a "Copy to Clipboard" button for the duration results (browser Clipboard API), replacing the MVP's plain-selectable-text approach
