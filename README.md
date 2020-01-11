# spubg

Statistic based utility for PUBG powered by the [PUBG API](https://documentation.pubg.com/en/introduction.html)

## Motivation

`spubg` was built to fill in a gap of trending data across seasons, 
with the intention of either comparing yourself on different metrics between seasons and comparing yourself against your friends.


### Self Comparison Example

When comparing against yourself, the values for each metric and a lifetime value is displayed.

![](./docs/imgs/chocoTaco-ADR-solo-fpp.png)


### Player Comparison Example

When comparing against others, only plot lines display the difference.

![](./docs/imgs/adr-WackyJacky101-chocoTaco-solo-fpp.png)


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