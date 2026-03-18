# WoW Core

Raid management tool for World of Warcraft guilds. Upload combat logs, track player performance, consumable compliance, and raid progression.

## Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Styling**: Tailwind CSS v4, dark-only theme
- **Database**: PostgreSQL 17 + Drizzle ORM
- **Auth**: better-auth with Discord OAuth
- **API**: tRPC v11
- **Forms**: React Hook Form + Zod v4
- **State**: nuqs (URL search params)

## Setup

```bash
pnpm install
docker compose up -d
cp .env.example .env  # fill in secrets
pnpm drizzle-kit push
pnpm dev
```

## Features

- Multi-core (guild) support with core switching
- Combat log upload with raid detection and duplicate prevention
- Raid details with encounter breakdown, DPS metrics, and death tracking
- Per-player breakdown with consumable usage (flasks, food, pots, engineering)
- Member roster with DPS trends, attendance heatmaps, and consumable compliance
- Sortable tables with URL-persisted sort state
- Server-side pagination for raids and members lists
