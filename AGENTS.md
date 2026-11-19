# CareerOS — AI Agent Instructions

## 1. Project Overview

CareerOS is a public multi-user AI-powered job discovery and application assistance platform supporting private-sector IT jobs and government recruitment in India and the UAE.

## 2. Required Project Documents

Before starting implementation, read:

1. `PRD.md` — Product requirements.
2. `ARCHITECTURE.md` — Technical architecture.
3. `DESIGN.md` — UI/UX design.
4. `RULES.md` — Mandatory engineering rules.
5. `TASKS.md` — Implementation tasks.

Follow the approved documents. If instructions conflict or a requirement is unclear, report the issue before implementing the affected work.

## 3. Approved Technology Stack

- Frontend: Next.js, React, TypeScript.
- Backend: NestJS.
- Database: PostgreSQL and Prisma.
- Background processing: Redis and BullMQ.
- Storage: S3-compatible private object storage.
- AI: Provider-independent gateway, initially Gemini.
- Monorepo: pnpm workspaces.
- Deployment: Docker-based modular monolith.

Do not change the architecture without approval.

## 4. Development Workflow

For each task:

1. Identify the task in `TASKS.md`.
2. Verify its dependencies.
3. Inspect the relevant existing files.
4. Explain the implementation plan.
5. Implement only the authorized task.
6. Add appropriate tests.
7. Run relevant checks.
8. Report the results.
9. Stop and wait for the next task.

Do not automatically implement the entire task list.

## 5. Mandatory Engineering Rules

- Follow `RULES.md`.
- Use strict TypeScript.
- Validate external inputs.
- Enforce backend authorization.
- Protect candidate data.
- Never hardcode credentials.
- Never fabricate job listings or candidate information.
- Never invent government eligibility results.
- Never send emails without explicit user approval.
- Never claim tests passed without executing them.
- Never claim an application was submitted without confirmation.
- Avoid unnecessary dependencies and architectural complexity.

## 6. Testing

After changes, run relevant checks supported by the current repository:

- Linting.
- Type checking.
- Unit tests.
- Integration tests when applicable.
- Build verification.

If a check cannot run, explain why.

Do not invent successful test results.

## 7. Task Completion Report

After completing each task, report:

**Task ID:**  
**Status:**  
**Files created:**  
**Files modified:**  
**Implementation summary:**  
**Tests executed:**  
**Test results:**  
**Known issues:**  
**Next task:**

Do not proceed to the next task without authorization.

## 8. First Task

The first authorized implementation task is:

**TASK-001 — Initialize Monorepo**

Follow its scope and acceptance criteria in `TASKS.md`.

Do not implement authentication, job scraping, government eligibility, resume generation, or outreach during TASK-001.

---

**End of AGENTS.md**