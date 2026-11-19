# CareerOS

[![CI Quality Gates](https://github.com/muhdhaseeb/CareerOS/actions/workflows/ci.yml/badge.svg)](https://github.com/muhdhaseeb/CareerOS/actions/workflows/ci.yml)

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
- Docker Desktop with WSL2 backend (for local development infrastructure)

### Local Infrastructure Setup

CareerOS uses Docker Compose for local infrastructure services with persistent volumes:
- **PostgreSQL 16.8**: Bound to `127.0.0.1:5433` (container port 5432). Note: Host port `5433` is used to prevent collisions with native PostgreSQL installations running on `5432`.
- **Redis 7.4.2**: Bound to `127.0.0.1:6379` with mandatory password authentication.
- **MinIO S3**: Bound to `127.0.0.1:9000` (S3 API) and `127.0.0.1:9001` (Web Console).

> [!NOTE]
> **Local Development Note on MinIO:**
> The local MinIO container is configured with `user: '0:0'` solely to grant write access to Docker named volumes mounted by the Windows/WSL2 Docker Desktop engine. This is a local-development-only concession. In production, CareerOS connects directly to managed S3-compatible object storage (e.g., AWS S3 or Cloudflare R2) using non-root service identities and scoped IAM credentials, as specified in `ARCHITECTURE.md`.

1. Copy `.env.example` to `.env` and set your local credentials:
   ```bash
   cp .env.example .env
   ```
2. Start infrastructure containers:
   ```bash
   pnpm infra:up
   ```
3. Verify authenticated service connectivity:
   ```bash
   pnpm infra:verify
   ```
4. Stop infrastructure containers (preserves data volumes):
   ```bash
   pnpm infra:down
   ```

### Database Foundation & Migrations

CareerOS uses Prisma in `@careeros/database` configured with strict target safety guards:
- **Port Isolation & Guard:** Local development and testing are strictly restricted to host port `5433` (`careeros_dev_db` or `careeros_local_dev`). Connecting to port `5432` is prohibited in code to protect native PostgreSQL installations.
- **Isolated Testing:** Integration tests run exclusively against `careeros_test_db`, provisioned and migrated in complete isolation from development data.
- **Guarded Workflows:**
  ```bash
  # Generate Prisma Client via guarded runner
  pnpm db:generate

  # Apply versioned database migrations
  pnpm db:migrate

  # Run idempotent seed verification
  pnpm db:seed
  ```

### Commands
```bash
# Install dependencies
pnpm install

# Start local infrastructure (Postgres, Redis, MinIO)
pnpm infra:up

# Verify infrastructure authentication and connectivity
pnpm infra:verify

# Build all packages and applications in topological order
pnpm build

# Run strict type checking across all workspaces
pnpm typecheck

# Run linting across all workspaces (enforces strict TypeScript)
pnpm lint

# Run Vitest test suites
pnpm test

# Run Prettier format check
pnpm format:check

# Run production dependency security audit
pnpm audit --prod --audit-level=high
```

## Continuous Integration & Quality Gates (TASK-004)

CareerOS enforces strict automated quality gates on every push and pull request targeting `master` via GitHub Actions (`.github/workflows/ci.yml`).

### Workflow Gates (Execution Order)

1. **Dependency Installation:** `pnpm install --frozen-lockfile` ensures strict lockfile integrity.
2. **Prisma Client Generation:** `pnpm db:generate` generates `@prisma/client` types before any linting, typechecking, or compilation steps.
3. **Gate 1 — Formatting:** `pnpm format:check` validates Prettier formatting across all files.
4. **Gate 2 — Linting:** `pnpm lint` executes ESLint across the monorepo with strict TypeScript rules.
5. **Gate 3 — Type Checking:** `pnpm typecheck` validates TypeScript across all packages and applications with zero errors.
6. **Gate 4 — Security Audit:** `pnpm audit --prod --audit-level=high` blocks on high or critical vulnerabilities in production runtime dependencies.
7. **Service Isolation & Healthcheck:** Spins up *only* containerized PostgreSQL on port `5433` using disposable CI credentials; Redis and MinIO remain unstarted. A bounded readiness loop polls `pg_isready` before running migrations.
8. **Gate 5 — Automated Tests:** `pnpm test` provisions `careeros_test_db`, applies migrations, and runs unit and database integration tests.
9. **Gate 6 — Build Verification:** `pnpm build` compiles all packages and applications in topological order.

### Dependency Security Audit Policy

- **Production Dependencies:** Zero tolerance for High or Critical vulnerabilities. Checked via `pnpm audit --prod --audit-level=high`. Semver-compatible overrides (`pnpm-workspace.yaml#overrides`) are applied for upstream transitive vulnerabilities (e.g. `postcss`, `qs`) to ensure production safety without upgrading framework major versions.
- **Development Dependencies:** Evaluated separately to prevent test runner disruption. Speculative major-version overrides for developer test tooling (e.g., `tinypool`, `vite`) are avoided unless supported by upstream patch releases.
- **No Blanket Suppressions:** CI never uses `continue-on-error: true` or suppressed security gates.

### Enforcing GitHub Branch Protection

To enforce that failing CI checks prevent merging into `master`:

1. Navigate to **Settings → Branches** in the GitHub repository.
2. Under **Branch protection rules**, click **Add branch ruleset** or **Add rule** targeting `master`.
3. Enable **Require a pull request before merging**.
4. Enable **Require status checks to pass before merging**.
5. Search for and select the required status check: `quality-gates`.
6. Enable **Require branches to be up to date before merging**.
7. Enable **Do not allow bypassing the above settings**.
8. Save changes. Merging will now be blocked whenever any CI gate fails.

