<img src="src/assets/img/logo.png">

---

The website for the Ashlyn SMP. Built with [Vite](https://vite.dev) and React.

## Features

- **Story**: an act overview with a short description per act; later act titles only appear once a leader reveals them with `/act`, so nothing is spoiled in the site source
- **Live status** from the [Core](https://github.com/AshlynSMP/Core) web API: radio tower status (from act II)
- **Event countdown** for the next event the leaders set in-game with `/event`
- **Timeline** of every event so far, with the recap the leaders write afterwards (`/event recap`)
- **Activity feed**: live joins, leaves, deaths and advancements (death causes stay hidden, like in chat)
- **Online players** with their heads, leader/crew tags, health, level, dimension and ping
- **Players**: a leaderboard (playtime, deaths, mob kills, PvP kills), every player that ever joined with when they were last seen, and a profile popup with their full skin and stats
- **Modpack**: the [Ashlyn SMP modpack](https://modrinth.com/modpack/ashlynsmp) with its latest version and last update live from the Modrinth API, and a step-by-step install guide. Nothing links to the resource pack repo, since it would spoil the story
- A mist effect for Mistwalkers

## Pre-season

Until `seasonStart` (`dd-mm-yyyy hh:mm`, in `timezone`) in [`src/config.js`](src/config.js), the site only shows the logo and a countdown to the start of Season II, nothing else. Leave it `null` while there's no date yet; the countdown then shows scrambled question marks instead of numbers. It doesn't contact the server then, so the server doesn't need to be running. At the start time it switches to the live site by itself.

## Setup

1. Turn on the web API in Core's `config.yml` (`web.enabled: true`) and restart the server.
2. Point `statusUrl` in [`src/config.js`](src/config.js) at it, e.g. `https://api.example.nl/api/status`.
3. Set `web.allowed-origin` in Core's config to the website's URL.

> If the site is served over HTTPS (GitHub Pages is), the API must be HTTPS too or browsers will block it. Put it behind a reverse proxy or a Cloudflare Tunnel.

## Running locally

```bash
npm install
npm run dev
```

Open the URL Vite prints.

## Building

```bash
npm run build
```

The finished site ends up in `dist/`. Upload that folder to any static host. Paths are relative, so it also works in a subfolder such as GitHub Pages.

### GitHub Pages

[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) builds and publishes the site on every push to `main`. To turn it on:

1. In the repo, go to Settings → Pages and set Source to **GitHub Actions**.
2. For a custom domain, fill it in on the same page and add a `CNAME` record at your registrar pointing to `<user>.github.io`. Tick **Enforce HTTPS** once the certificate is ready.

## Structure

```
src/
  config.js          settings (API URL, season start, modpack)
  App.jsx            picks what to show: pre-season, offline or live
  components/
    ui/              reusable building blocks (Card, Button, Dialog, Countdown, Tabs, ...)
    layout/          nav and footer
    hero/            logo, mist, stats, pre-season countdown
    story/           acts and event timeline
    live/            online players, event, radio towers, activity
    players/         leaderboard, all players, profile popup
    modpack/         modpack card and install guide
  hooks/             data and timing (useStatus, useModpack, useNow, ...)
  lib/               plain helpers (formatting, game labels)
```

Each component keeps its styles in a CSS file next to it. Colors and sizes are shared through the variables in [`src/styles/global.css`](src/styles/global.css).
