# CareerOS

CareerOS is an AI-powered job discovery and application assistance platform supporting private-sector IT jobs and government recruitment in India and the UAE.

## Monorepo Architecture

This repository is managed with **pnpm workspaces**.

```text
careeros/
├── apps/
│   ├── web/               # Next.js App Router frontend with Tailwind CSS
│   ├── api/               # NestJS modular backend REST API (/api/v1)
│   └── worker/            # Standalone Node.js / BullMQ background worker
├── packages/
│   ├── config/            # Shared configuration presets
│   ├── contracts/         # Shared TypeScript interfaces & API contracts
│   ├── database/          # Prisma schema, migrations, and database client (TASK-003)
│   ├── ui/                # Shared design system components and tokens (DESIGN.md)
│   └── utils/             # Shared pure utility functions
├── pnpm-workspace.yaml    # Monorepo workspace configuration
└── tsconfig.base.json     # Strict base TypeScript configuration
```

## Workspace Boundaries

1. **Process Isolation**: `apps/web`, `apps/api`, and `apps/worker` run as distinct, decoupled processes.
2. **Zero Cross-App Imports**: Applications never directly import from other applications.
3. **Internal Packages**: All shared contracts, utilities, and UI primitives are consumed via `@careeros/*` packages.
4. **Compile Target**: Internal packages compile TypeScript to `./dist` CommonJS + `.d.ts` declarations, natively consumable by Next.js, NestJS, and Node workers.

## Quick Start & Verification

### Prerequisites
- Node.js >= 20.0.0
- pnpm >= 9.0.0

### Commands
```bash
# Install dependencies
pnpm install

# Build all packages and applications in topological order
pnpm build

# Run strict type checking across all workspaces
pnpm typecheck

# Run linting across all workspaces (enforces strict TypeScript)
pnpm lint

# Run Vitest test suites
pnpm test
```
