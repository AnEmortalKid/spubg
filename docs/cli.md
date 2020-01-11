# CLI

Command Line Interface for `spubg`. 

## Usage

```bash
  ____  ____  _   _ ____   ____
 / ___||  _ \| | | | __ ) / ___|
 \___ \| |_) | | | |  _ \| |  _
  ___) |  __/| |_| | |_) | |_| |
 |____/|_|    \___/|____/ \____|

Usage:
<command> playerName... [options]

Available commands are:
help:
  Displays this message. Get additional help by doing help <command>.
kd-trend:
  Charts Kill/Death Rate by season.
winRate-trend:
  charts Win Rate by season
adr-trend:
  charts Average Damage Rate by season
top10-trend:
  charts Top 10 Rate by season
all-trends:
  gathers all trend charts for a player
kd-compare:
  KD Comparison between players
adr-compare:
  ADR Comparison between players
winRate-compare:
  Win Rate Comparison between players
```

### Example

```bash
./dist/spubg.bin.js kd-trend Kaymind
```