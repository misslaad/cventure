# Giggle Box — Random Joke Generator

A small responsive website that fetches safe-for-work jokes from the public [JokeAPI](https://jokeapi.dev/). It is built with plain HTML, CSS and JavaScript; no API key or build step is required.

## Run locally

From the project directory, start a local static server:

```bash
python3 -m http.server 8000
```

Open <http://localhost:8000/>. The joke button calls `https://v2.jokeapi.dev/joke/Any?safe-mode` directly from the browser, so an internet connection is needed. The page shows an error and retry option if the service is unavailable.

You can also deploy the three site files (`index.html`, `style.css`, `script.js`) to any static hosting service such as GitHub Pages.

## Features

- Responsive, accessible design with reduced-motion support
- Random, safe-mode jokes from an external API
- Handles both one-line and setup/punchline jokes
- Loading and network-error states
- Copy joke button and a session favorite toggle
