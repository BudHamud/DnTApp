# Death & Taxes Tracker (Next.js Edition)

This project modernizes the original **Death & Taxes Tracker** by migrating it to **Next.js** while preserving the classic experience and introducing a modern UI.

## Features

- **Hybrid Architecture**:
  - **Classic (V1)**: Available at `/`. A faithful recreation of the vanilla JS app using **CSS Modules** and **TypeScript**.
  - **Modern (V2)**: Available at `/modern`. A redesigned experience using **Tailwind CSS**.
- **Unified Data Sync**: Both versions share the same `localStorage` key (`dnt_stats`).
- **Legacy Migration**: Automatically detects and migrates old data format from V1 to the new unified structure.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**:
  - V1: CSS Modules (Pure CSS)
  - V2: Tailwind CSS
- **Language**: TypeScript

## Getting Started

```bash
pnpm install
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) for Classic V1, or [http://localhost:3000/modern](http://localhost:3000/modern) for Modern V2.
