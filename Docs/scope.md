# MVP Scope and Roadmap

## MVP
- No Discogs search — just enter a known release URL or release ID
- No authentication — not accessing my own Discogs account, or allowing other users to log into their Discogs account
- No framework — plain vanilla HTML/CSS/JS, no build step, direct DOM manipulation
- Hosted via GitHub Pages
- Simple UI to enter a release URL or release ID, then display the album duration result
- Basic input validation and errors for required fields and correct release ID formatting
- Handling for some edge cases, such as missing/incomplete track time data
- Handling for obvious multi-album/multi-disc release scenarios

## 2.0
- Add Node.js, React, and AWS to the architecture
- Registered custom domain name
- Add Vercel or Netlify to replace GitHub Pages
- Handling for more edge cases around unpredictable/partial release track time data
- Handling for more multi-album and other complex release scenarios (e.g. box sets with multiple albums, mixed formats, etc.)
- Ability to keep a recent local history of retrieved releases (probably just locally in a browser cookie — no complex user account feature)

## Future
- Add rudimentary Discogs search support as a user option, for when the user doesn't already know the release ID (complex; not looking to rebuild Discogs' own search UI, but a good use case for chaining multiple API calls in sequence)
- Add OAuth (may start bringing in the user's own Discogs account data from other Discogs APIs)
- Ability to export results (formats TBD)
- Ability to augment missing Discogs track duration data with other sources, such as Wikipedia
- Explore a browser extension that sends the currently viewed Discogs release URL directly into the app
- Basic APM tooling — not needed for a personal project, but a good opportunity to learn how it's set up
