# spubg

Statistic based utility for PUBG powered by the [PUBG API](https://documentation.pubg.com/en/introduction.html)

## Usage

### Prerequisites

1. You'll need an API token, store it in a `.env` file with a `PUBG_TOKEN=your_token_here` key.
2. Install the dependencies `npm i`
3. Build the binaries: `npm run build`

## Interact

### CLI

```bash
Usage:

command <playerName>

Available commands are:

kd-trend:       charts Kill/Death Rate by season

winRate-trend:  charts Win Rate by season

adr-trend:      charts Average Damage Rate by season

all-trends:     gathers all trend charts for a player

```

_E.G_
```bash
./dist/spubg.bin.js kd-trend Kaymind
```

### Discord Bot